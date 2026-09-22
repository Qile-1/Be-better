import { NextResponse } from "next/server";
import { getLessonById } from "../../../lib/lessons";
import type {
  DiagnoseError,
  RemedyItem,
  RemedyKind,
  RemedyResult
} from "../../../lib/types";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

const systemRule = `你是大学英语四级阅读的费曼辅导老师。学生刚做完一次脱稿复述但没完全讲对。你的任务不是替他答题，而是只针对他这次【遗漏的要点】和【讲错的地方】做最小必要补讲，帮他自己想明白后再脱稿讲一遍。规则：
1. 只为传入的核心遗漏要点和错误生成 remedyItems，顺序与遗漏要点一致；拓展点遗漏不补讲，已经讲对的内容不要再讲。
2. 每个要点用通俗的话讲清思路，配一个小例子或类比，再给一句"怎么记/做题时怎么用"，语言短，面向基础薄弱学生。
3. 绝对禁止输出本节课完整参考答案、禁止给出可照抄的整段复述、禁止让学生逐字跟读，只讲思路和例子，结论让他自己说。
4. 讲错的用 kind="error"，指出错在哪、正确思路是什么；遗漏用 kind="gap"。
5. recap 基于已覆盖要点具体肯定他讲对的部分，不要空泛夸奖；nextPrompt 引导他合上讲义、脱稿再讲一遍并重点补遗漏点。
只输出一个 JSON 对象，键名必须与下面完全一致，不能新增或改名：
{
  "recap": "一句具体肯定",
  "remedyItems": [
    { "pointId": "遗漏要点id或review", "kind": "gap", "title": "短标题", "explanation": "通俗讲解", "example": "小例子或类比", "tip": "一句话记忆/用法" }
  ],
  "nextPrompt": "引导脱稿再讲一遍"
}
不要输出 JSON 以外任何文字，不要用 markdown 代码块。`;

type RemedyRequestBody = {
  lessonId?: unknown;
  coveredPointIds?: unknown;
  missedPointIds?: unknown;
  errors?: unknown;
  userText?: unknown;
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function friendlyError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function toUniqueStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function normalizeRequestErrors(value: unknown): DiagnoseError[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const detail =
        typeof record.detail === "string" ? record.detail.trim() : "";
      const point =
        typeof record.point === "string" && record.point.trim()
          ? record.point.trim()
          : "相关要点";

      return detail ? { point, detail } : null;
    })
    .filter((item): item is DiagnoseError => item !== null);
}

function truncate(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength);
}

function getText(record: Record<string, unknown>, key: string) {
  return typeof record[key] === "string" ? record[key].trim() : "";
}

function normalizeRemedyItem({
  value,
  missedPointIds,
  validPointIds,
  pointTextById,
  errorFallback
}: {
  value: unknown;
  missedPointIds: Set<string>;
  validPointIds: Set<string>;
  pointTextById: Map<string, string>;
  errorFallback?: DiagnoseError;
}): RemedyItem | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const kind: RemedyKind | null =
    record.kind === "gap" || record.kind === "error" ? record.kind : null;

  if (!kind) {
    return null;
  }

  const rawPointId = getText(record, "pointId");

  if (kind === "gap" && !missedPointIds.has(rawPointId)) {
    return null;
  }

  const pointId =
    kind === "gap"
      ? rawPointId
      : rawPointId === "review" || validPointIds.has(rawPointId)
        ? rawPointId
        : "review";
  const pointText = pointTextById.get(pointId) ?? "";
  const explanation = truncate(
    getText(record, "explanation") ||
      pointText ||
      errorFallback?.detail ||
      "回到刚才的说法，找出它和本节方法冲突的地方，再换成正确思路。",
    160
  );

  if (!explanation) {
    return null;
  }

  return {
    pointId,
    kind,
    title: truncate(
      getText(record, "title") ||
        (kind === "gap" ? "补上这个要点" : "纠正这个硬伤"),
      40
    ),
    explanation,
    example: truncate(
      getText(record, "example") ||
        "想一个能体现这个规则的小例子，再用自己的话解释它。",
      160
    ),
    tip: truncate(
      getText(record, "tip") ||
        "合上讲义后，把这一点放回你的解题流程里。",
      40
    )
  };
}

function normalizeRemedyResult({
  value,
  missedPointIds,
  validPointIds,
  pointTextById,
  errors
}: {
  value: unknown;
  missedPointIds: string[];
  validPointIds: Set<string>;
  pointTextById: Map<string, string>;
  errors: DiagnoseError[];
}): RemedyResult | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (!Array.isArray(record.remedyItems)) {
    return null;
  }

  const missedSet = new Set(missedPointIds);
  const normalizedItems = record.remedyItems
    .map((item, index) =>
      normalizeRemedyItem({
        value: item,
        missedPointIds: missedSet,
        validPointIds,
        pointTextById,
        errorFallback: errors[index]
      })
    )
    .filter((item): item is RemedyItem => item !== null);

  const firstGapById = new Map<string, RemedyItem>();
  const errorItems: RemedyItem[] = [];

  for (const item of normalizedItems) {
    if (item.kind === "gap") {
      if (!firstGapById.has(item.pointId)) {
        firstGapById.set(item.pointId, item);
      }
    } else {
      errorItems.push(item);
    }
  }

  const maxItems = Math.min(6, missedPointIds.length + errors.length);
  const remedyItems = [
    ...missedPointIds
      .map((id) => firstGapById.get(id))
      .filter((item): item is RemedyItem => item !== undefined),
    ...errorItems
  ].slice(0, maxItems);

  if (remedyItems.length === 0) {
    return null;
  }

  return {
    recap: truncate(
      getText(record, "recap") ||
        "你已经讲清了部分要点，下面只补还没稳的地方。",
      160
    ),
    remedyItems,
    nextPrompt: truncate(
      getText(record, "nextPrompt") ||
        "合上讲义，把刚补的要点放进完整流程里，再脱稿讲一遍。",
      160
    )
  };
}

async function callDeepSeek({
  apiKey,
  userContent
}: {
  apiKey: string;
  userContent: string;
}) {
  const response = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemRule },
        { role: "user", content: userContent }
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
  context: Parameters<typeof normalizeRemedyResult>[0]
) {
  try {
    return normalizeRemedyResult({
      ...context,
      value: JSON.parse(content)
    });
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: RemedyRequestBody;

  try {
    body = (await request.json()) as RemedyRequestBody;
  } catch {
    return friendlyError("请求格式不正确，请再试一次", 400);
  }

  const lessonId = typeof body.lessonId === "string" ? body.lessonId : "";
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return friendlyError("没有找到这节课，请回到课程地图重新进入", 404);
  }

  const validPointIds = new Set(lesson.rubricPoints.map((point) => point.id));
  const requestedMissedIds = new Set(toUniqueStringArray(body.missedPointIds));
  const missedPointIds = lesson.rubricPoints
    .filter(
      (point) => point.tier === "core" && requestedMissedIds.has(point.id)
    )
    .map((point) => point.id);
  const missedSet = new Set(missedPointIds);
  const coveredPointIds = toUniqueStringArray(body.coveredPointIds).filter(
    (id) => validPointIds.has(id) && !missedSet.has(id)
  );
  const errors = normalizeRequestErrors(body.errors);

  if (missedPointIds.length === 0 && errors.length === 0) {
    return friendlyError("这次没有需要补讲的要点", 400);
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return friendlyError("AI 服务未配置", 500);
  }

  const missedPoints = lesson.rubricPoints
    .filter((point) => missedSet.has(point.id))
    .map(({ id, point }) => ({ id, point }));
  const pointTextById = new Map(
    lesson.rubricPoints.map((point) => [point.id, point.point])
  );
  const userContent = JSON.stringify({
    userText: typeof body.userText === "string" ? body.userText : "",
    missedPoints,
    errors,
    coveredPointIds,
    material: {
      goal: lesson.microLesson?.goal ?? "",
      commonMistakes: lesson.commonMistakes
    }
  });
  const normalizeContext = {
    value: null,
    missedPointIds,
    validPointIds,
    pointTextById,
    errors
  };

  try {
    const firstContent = await callDeepSeek({ apiKey, userContent });
    const firstResult = parseModelJson(firstContent, normalizeContext);

    if (firstResult) {
      return NextResponse.json(firstResult);
    }

    const secondContent = await callDeepSeek({ apiKey, userContent });
    const secondResult = parseModelJson(secondContent, normalizeContext);

    if (secondResult) {
      return NextResponse.json(secondResult);
    }

    return friendlyError("补讲生成失败，请点重试", 500);
  } catch {
    return friendlyError("补讲生成失败，请点重试", 500);
  }
}
