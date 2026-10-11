import { NextResponse } from "next/server";
import { getLessonById } from "../../../lib/lessons";
import { getAssessmentContext, getAssessmentGuidance } from "../../../lib/assessmentContext";
import type { DiagnoseError, DiagnoseResult } from "../../../lib/types";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

const systemRule = `你是大学英语四级阅读、写作与翻译的「费曼复述」考评老师。学生正在复述本节方法，不是提交正式考试答案。你只能依据我随后提供的本节《要点清单》和课程类别来评判，规则如下：
1. 判断学生覆盖了清单里的哪些要点、遗漏了哪些要点；要点 id 只能从我给出的《要点清单》里的 id 中选择，不许编造清单里没有的 id。
2. 只有当学生明确说法与本节《要点清单》直接冲突时才算硬伤；遗漏、表达简短或没使用关键词不算硬伤。语义正确的自己的话应认可，不要求背原句。清单之外内容不判对错，不补充其他课程知识。
3. 拿不准是否覆盖，一律算遗漏，不要默认他会了。
4. 参考讲法先讲本节 core 点，再简短补充 bonus 点，严格基于清单。鼓励要具体，指出下一步能做什么，不承诺考试提分。
5. 要点的 tier="core" 表示核心必会点，tier="bonus" 表示拓展点。每个点都要如实判断并返回在 coveredPointIds 或 missedPointIds 中；bonus 没讲到不算错误，也不算致命问题。

你必须只输出一个 JSON 对象。键名必须与下面完全一致，一个都不能少、不能改名、不能新增键：
{
  "coveredPointIds": ["已覆盖要点的 id"],
  "missedPointIds": ["遗漏要点的 id"],
  "errors": [{"pointId": "本节真实要点 id", "point": "冲突的知识点", "detail": "学生是怎么说的；正确说法是什么"}],
  "fatalErrorCount": 0,
  "coverage": 0.0,
  "passed": false,
  "modelAnswer": "一段基于要点清单的简洁参考讲法",
  "encouragement": "一句简短的中文鼓励"
}
要求：每个本节 id 恰好出现在 coveredPointIds 或 missedPointIds 之一。同一处错误不重复计数，明确讲错的点不能同时算覆盖。errors 为空时 fatalErrorCount 为 0，否则等于 errors 长度；每条错误必须引用真实 pointId。coverage 只按 core 计算；passed 只在全部 core 覆盖且无硬伤时为 true，最终三档状态由前端判定。不要输出 JSON 以外文字或 markdown 代码块。`;

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

        const pointId = typeof record.pointId === "string" ? record.pointId.trim() : undefined;
        return detail.trim() ? { pointId, point, detail: detail.trim() } : null;
      }

      return null;
    })
    .filter((item): item is DiagnoseError => item !== null);
}

function normalizeDiagnoseResult(
  value: unknown,
  validPointIds: Set<string>,
  corePointIds: Set<string>
): DiagnoseResult | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (!Array.isArray(record.coveredPointIds) || !Array.isArray(record.missedPointIds) || !Array.isArray(record.errors)) {
    return null;
  }

  let coveredPointIds = Array.from(
    new Set(
      toStringArray(record.coveredPointIds ?? record.coveredPoints).filter(
        (id) => validPointIds.has(id)
      )
    )
  );

  const errors = normalizeErrors(record.errors);
  if (errors.length !== record.errors.length || errors.some((error) => !error.pointId || !validPointIds.has(error.pointId))) {
    return null;
  }
  const incorrectIds = new Set(errors.map((error) => error.pointId));
  coveredPointIds = coveredPointIds.filter((id) => !incorrectIds.has(id));
  const coveredSet = new Set(coveredPointIds);

  const reportedMissedPointIds = toStringArray(
    record.missedPointIds ?? record.missingPoints ?? record.missedPoints
  ).filter((id) => validPointIds.has(id) && !coveredSet.has(id));
  const missedPointIds = Array.from(
    new Set([
      ...reportedMissedPointIds,
      ...Array.from(validPointIds).filter((id) => !coveredSet.has(id))
    ])
  );

  const fatalErrorCount = errors.length;

  const coveredCoreCount = coveredPointIds.filter((id) =>
    corePointIds.has(id)
  ).length;
  const coverage =
    corePointIds.size > 0
      ? Math.round((coveredCoreCount / corePointIds.size) * 100) / 100
      : 0;

  const passed = corePointIds.size > 0 && coveredCoreCount === corePointIds.size && fatalErrorCount === 0;

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
    signal: AbortSignal.timeout(45000),
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

function parseModelJson(
  content: string,
  validPointIds: Set<string>,
  corePointIds: Set<string>
) {
  try {
    return normalizeDiagnoseResult(
      JSON.parse(content),
      validPointIds,
      corePointIds
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

  if (!body || typeof body !== "object" || Array.isArray(body)) return friendlyError("请求格式不正确，请再试一次", 400);
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
  const corePointIds = new Set(
    lesson.rubricPoints
      .filter((point) => point.tier === "core")
      .map((point) => point.id)
  );
  const lessonContext = getAssessmentContext(lesson);
  const systemContent = `${systemRule}\n${getAssessmentGuidance(lesson)}\n本节《要点清单》与常见错误：${JSON.stringify(
    lessonContext
  )}`;

  try {
    const firstContent = await callDeepSeek({ apiKey, systemContent, userText });
    const firstResult = parseModelJson(
      firstContent,
      validPointIds,
      corePointIds
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
      corePointIds
    );

    if (secondResult) {
      return NextResponse.json(secondResult);
    }

    return friendlyError("网络波动，请再试一次", 500);
  } catch {
    return friendlyError("网络波动，请再试一次", 500);
  }
}
