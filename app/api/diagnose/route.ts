import { NextResponse } from "next/server";
import { getLessonById } from "../../../lib/lessons";
import type { DiagnoseError, DiagnoseResult } from "../../../lib/types";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

const systemRule = `你是大学英语四级阅读的「费曼复述」考评老师。学生刚学完一节阅读解题方法，现在要用自己的话把方法讲给你听。你只能依据我随后提供的本节《要点清单》来评判，规则如下：
1. 判断学生覆盖了清单里的哪些要点、遗漏了哪些要点；要点 id 只能从我给出的《要点清单》里的 id 中选择，不许编造清单里没有的 id。
2. 只有当学生的说法与《要点清单》或四级阅读的标准方法直接冲突时，才算硬伤错误；清单之外的内容不要评判对错，也不要补充清单以外的知识点，更不要编造。
3. 拿不准是否覆盖，一律算遗漏，不要默认他会了。
4. 给出一段简洁的参考讲法，严格基于要点清单。

你必须只输出一个 JSON 对象。键名必须与下面完全一致，一个都不能少、不能改名、不能新增键：
{
  "coveredPointIds": ["已覆盖要点的 id"],
  "missedPointIds": ["遗漏要点的 id"],
  "errors": [{"point": "冲突的知识点", "detail": "学生是怎么说的；正确说法是什么"}],
  "fatalErrorCount": 0,
  "coverage": 0.0,
  "passed": false,
  "modelAnswer": "一段基于要点清单的简洁参考讲法",
  "encouragement": "一句简短的中文鼓励"
}
要求：errors 在没有硬伤错误时必须是空数组 []；fatalErrorCount 必须等于 errors 数组的长度；coverage 等于 coveredPointIds 的数量除以要点总数，保留两位小数；当 coverage 不低于 0.7 且 fatalErrorCount 为 0 时 passed 为 true，否则为 false。不要输出 JSON 以外的任何文字，不要使用 markdown 代码块。`;

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type RequestBody = {
  lessonId?: unknown;
  userText?: unknown;
};

function friendlyError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizeErrors(value: unknown): DiagnoseError[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim()
          ? { point: "相关要点", detail: item.trim() }
          : null;
      }

      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const detail =
          typeof record.detail === "string"
            ? record.detail
            : typeof record.message === "string"
              ? record.message
              : "";
        const point =
          typeof record.point === "string" && record.point.trim()
            ? record.point
            : "相关要点";

        return detail.trim() ? { point, detail: detail.trim() } : null;
      }

      return null;
    })
    .filter((item): item is DiagnoseError => item !== null);
}

function normalizeDiagnoseResult(
  value: unknown,
  validPointIds: Set<string>,
  totalPoints: number
): DiagnoseResult | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  const coveredPointIds = toStringArray(
    record.coveredPointIds ?? record.coveredPoints
  ).filter((id) => validPointIds.has(id));

  const coveredSet = new Set(coveredPointIds);

  const missedPointIds = toStringArray(
    record.missedPointIds ?? record.missingPoints ?? record.missedPoints
  ).filter((id) => validPointIds.has(id) && !coveredSet.has(id));

  const errors = normalizeErrors(record.errors);

  const fatalErrorCount =
    typeof record.fatalErrorCount === "number"
      ? record.fatalErrorCount
      : errors.length;

  const coverage =
    totalPoints > 0
      ? Math.round((coveredPointIds.length / totalPoints) * 100) / 100
      : 0;

  const passed = coverage >= 0.7 && fatalErrorCount === 0;

  const modelAnswer =
    typeof record.modelAnswer === "string" && record.modelAnswer.trim()
      ? record.modelAnswer
      : typeof record.referenceAnswer === "string" &&
          record.referenceAnswer.trim()
        ? record.referenceAnswer
        : typeof record.referenceExplanation === "string" &&
            record.referenceExplanation.trim()
          ? record.referenceExplanation
          : "";

  return {
    coveredPointIds,
    missedPointIds,
    errors,
    fatalErrorCount,
    coverage,
    passed,
    modelAnswer,
    encouragement:
      typeof record.encouragement === "string" && record.encouragement.trim()
        ? record.encouragement
        : "已经迈出关键一步，再补齐遗漏点就更稳了。"
  };
}

async function callDeepSeek({
  apiKey,
  systemContent,
  userText
}: {
  apiKey: string;
  systemContent: string;
  userText: string;
}) {
  const response = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: `学生的复述如下：${userText}` }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("DeepSeek request failed");
  }

  const data = (await response.json()) as DeepSeekResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek returned empty content");
  }

  return content;
}

function parseModelJson(content: string, validPointIds: Set<string>, totalPoints: number) {
  try {
    return normalizeDiagnoseResult(
      JSON.parse(content),
      validPointIds,
      totalPoints
    );
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return friendlyError("请求格式不正确，请再试一次", 400);
  }

  const lessonId = typeof body.lessonId === "string" ? body.lessonId : "";
  const userText = typeof body.userText === "string" ? body.userText : "";

  if (!userText.trim()) {
    return friendlyError("先写下你的复述，再提交给 AI 诊断", 400);
  }

  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return friendlyError("没有找到这节课，请回到课程地图重新进入", 404);
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return friendlyError("AI 服务未配置", 500);
  }

  const validPointIds = new Set(lesson.rubricPoints.map((point) => point.id));
  const lessonContext = {
    rubricPoints: lesson.rubricPoints.map(({ id, point }) => ({ id, point })),
    commonMistakes: lesson.commonMistakes
  };
  const systemContent = `${systemRule}\n本节《要点清单》与常见错误：${JSON.stringify(
    lessonContext
  )}`;

  try {
    const firstContent = await callDeepSeek({ apiKey, systemContent, userText });
    const firstResult = parseModelJson(
      firstContent,
      validPointIds,
      lesson.rubricPoints.length
    );

    if (firstResult) {
      return NextResponse.json(firstResult);
    }

    const secondContent = await callDeepSeek({
      apiKey,
      systemContent,
      userText
    });
    const secondResult = parseModelJson(
      secondContent,
      validPointIds,
      lesson.rubricPoints.length
    );

    if (secondResult) {
      return NextResponse.json(secondResult);
    }

    return friendlyError("网络波动，请再试一次", 500);
  } catch {
    return friendlyError("网络波动，请再试一次", 500);
  }
}
