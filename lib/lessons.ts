import type { Lesson } from "./types";

const placeholderRetellTask = "本节复述任务待补充。";
const placeholderModelAnswer = "本节参考答案待补充。";
const placeholderCommonMistakes = ["本节常见错误待补充。"];

export const LESSONS: Lesson[] = [
  {
    id: "l1",
    title: "仔细阅读·主旨大意题",
    video: { provider: "bilibili", ref: "BV1xxxxxxxxxx" },
    retellTask:
      "假设同学完全没做过这类题，请你用自己的话讲清楚：拿到一篇仔细阅读，怎么判断它是主旨题、去哪里找主旨、怎么排除干扰项。",
    rubricPoints: [
      {
        id: "p1",
        point: "先看题干和题目再读文章，带着问题去读，定位更高效。",
        keyPhrases: ["先题后文", "带着问题", "审题"],
        mustCover: true
      },
      {
        id: "p2",
        point:
          "能识别主旨题信号词：main idea、mainly about、purpose、best title，以及问主旨、中心、标题、写作目的。",
        keyPhrases: [
          "main idea",
          "best title",
          "purpose",
          "主旨",
          "中心",
          "目的"
        ],
        mustCover: true
      },
      {
        id: "p3",
        point:
          "知道主旨常出现的位置：首段、末段、各段首句、转折词 but/however/yet 之后、全文反复出现的高频词。",
        keyPhrases: ["首段", "末段", "段首", "转折", "however", "高频词"],
        mustCover: true
      },
      {
        id: "p4",
        point: "正确选项特征：能概括全文，不太宽也不太窄，不含文章没提的信息。",
        keyPhrases: ["概括全文", "以偏概全", "未提及", "太宽", "太窄"],
        mustCover: true
      },
      {
        id: "p5",
        point: "干扰项特征：用某个段落的细节冒充主旨、以偏概全、偷换概念、表述绝对化。",
        keyPhrases: ["细节冒充", "以偏概全", "偷换", "绝对化"],
        mustCover: true
      }
    ],
    commonMistakes: [
      "把某一段的细节当成全文主旨",
      "只看首句，忽略转折词之后作者的真正观点",
      "选了原文出现过的词，但它并不是全文中心"
    ],
    modelAnswer:
      "做主旨题我会先看题干，看到 main idea、best title、purpose 这些信号就确定是主旨题。然后重点读首段、末段和每段首句，尤其注意 but、however 这种转折之后的句子，再结合全文反复出现的高频词归纳中心。选答案时挑那个能概括全文的，太窄只讲某段细节、太宽文章没展开、或者出现原文没有的信息的都排除，表述特别绝对的也要警惕。"
  },
  {
    id: "l2",
    title: "仔细阅读·细节理解与定位题",
    video: { provider: "bilibili", ref: "" },
    retellTask: placeholderRetellTask,
    rubricPoints: [],
    commonMistakes: placeholderCommonMistakes,
    modelAnswer: placeholderModelAnswer
  },
  {
    id: "l3",
    title: "仔细阅读·推理判断题",
    video: { provider: "bilibili", ref: "" },
    retellTask: placeholderRetellTask,
    rubricPoints: [],
    commonMistakes: placeholderCommonMistakes,
    modelAnswer: placeholderModelAnswer
  },
  {
    id: "l4",
    title: "观点态度题与词义猜测题",
    video: { provider: "bilibili", ref: "" },
    retellTask: placeholderRetellTask,
    rubricPoints: [],
    commonMistakes: placeholderCommonMistakes,
    modelAnswer: placeholderModelAnswer
  },
  {
    id: "l5",
    title: "选词填空（篇章词汇）",
    video: { provider: "bilibili", ref: "" },
    retellTask: placeholderRetellTask,
    rubricPoints: [],
    commonMistakes: placeholderCommonMistakes,
    modelAnswer: placeholderModelAnswer
  }
];

export function getLessonById(id: string) {
  return LESSONS.find((lesson) => lesson.id === id);
}

export function getLessonIndexById(id: string) {
  return LESSONS.findIndex((lesson) => lesson.id === id);
}

export function getNextLesson(id: string) {
  const index = getLessonIndexById(id);

  if (index < 0) {
    return undefined;
  }

  return LESSONS[index + 1];
}
