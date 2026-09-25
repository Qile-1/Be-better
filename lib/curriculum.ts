import type { Lesson, MicroBlock, PracticeQuestion, RubricPoint } from "./types";

type Enrichment = {
  advancedBlocks: MicroBlock[];
  practiceQuestions: PracticeQuestion[];
};

function question(
  id: string,
  pointId: string,
  passage: string,
  prompt: string,
  options: PracticeQuestion["options"],
  answer: PracticeQuestion["answer"],
  explanation: string
): PracticeQuestion {
  return { id, pointId, passage, prompt, options, answer, explanation };
}

function point(
  id: string,
  text: string,
  keyPhrases: string[],
  tier: RubricPoint["tier"] = "core"
): RubricPoint {
  return { id, point: text, keyPhrases, tier, mustCover: tier === "core" };
}

// 例题均为原创微型练习，按 2021—2025 年公开真题呈现的稳定题型设计；
// 不复制真题文章、题干或选项。source-alignment 见 CONTENT_SOURCES.md。
export const EXISTING_LESSON_ENRICHMENTS: Record<string, Enrichment> = {
  l1: {
    advancedBlocks: [
      { type: "heading", text: "拔高：区分文章主题与作者结论" },
      { type: "paragraph", text: "主题是文章谈什么，结论是作者想让读者相信什么。主旨题优先选能同时覆盖主题和结论的选项；只有主题词、没有观点的选项可能太空。" },
      { type: "tip", text: "把首段和末段各压缩成一句话，再问：它们共同指向什么结论？" }
    ],
    practiceQuestions: [
      question("l1-q1", "p4", "A city library extended its evening hours. At first, staff expected only students to use the space. Instead, many shift workers came to read and attend free classes. The library now plans more flexible services for people with different schedules.", "What is the main idea of the passage?", { A: "Students prefer to study at night.", B: "Flexible library hours can serve a wider community.", C: "Shift workers should change their jobs.", D: "Free classes are expensive to run." }, "B", "文章从延长开放时间写到服务更多群体，B 覆盖全文。A 只抓到预期而非结果，C、D 无依据。"),
      question("l1-q2", "p3", "Many schools have added short outdoor breaks. Teachers first worried about lost class time. However, several classes reported better attention after the breaks, so the schools kept the policy.", "Which title best fits the passage?", { A: "A New Way to Improve Attention", B: "Why Teachers Dislike Outdoor Activities", C: "The History of School Buildings", D: "How to Extend Every Class" }, "A", "转折后的结果是短暂户外休息有助于注意力，A 概括全文；B 把最初担忧当成主旨。")
    ]
  },
  l2: {
    advancedBlocks: [
      { type: "heading", text: "拔高：限定范围与否定词" },
      { type: "paragraph", text: "定位后同时核对对象、时间、程度和否定。especially 不等于 only，some 不等于 all，before 不等于 after；正确答案必须保留原句的限定。" },
      { type: "tip", text: "对每个选项问四遍：谁？什么时候？多大程度？有没有否定？" }
    ],
    practiceQuestions: [
      question("l2-q1", "p5", "The museum offers free entry on Fridays for local residents. Visitors from other cities still pay the regular ticket price.", "Who can enter the museum for free on Fridays?", { A: "All visitors", B: "Local residents", C: "Only children", D: "Museum employees" }, "B", "定位句明确限定为 local residents；A 扩大范围，C、D 未提及。"),
      question("l2-q2", "p4", "The team moved the meeting from Monday to Wednesday because the laboratory was closed for repairs on Monday. The project deadline did not change.", "Why was the meeting moved?", { A: "The project deadline was delayed.", B: "The team needed more members.", C: "The laboratory was unavailable on Monday.", D: "Wednesday was a public holiday." }, "C", "because 后给出直接原因。C 用 unavailable 改写 closed for repairs；A 与原文相反。")
    ]
  },
  l3: {
    advancedBlocks: [
      { type: "heading", text: "拔高：把证据链说完整" },
      { type: "paragraph", text: "较难的推理题要连接两处信息：事实一 + 事实二 → 最保守的结论。若选项引入将来一定、所有人、唯一原因等信息，就超出了证据。" },
      { type: "tip", text: "讲题时说出‘因为原文 A 和 B，所以最多能推出 C’，不要只说‘感觉是 C’。" }
    ],
    practiceQuestions: [
      question("l3-q1", "p2", "A university installed water stations in every building. Six months later, it bought fewer disposable bottles for campus events. The report did not measure students' personal purchases.", "What can reasonably be inferred?", { A: "No student buys bottled water now.", B: "The stations may have reduced the university's bottle use at events.", C: "All campus waste has disappeared.", D: "Students' personal purchases doubled." }, "B", "前后两个事实只支持学校活动中瓶装水采购减少，不能推到所有学生或所有垃圾。"),
      question("l3-q2", "p3", "The app was downloaded by many users, but few returned after the first week. The company plans to interview those who stopped using it.", "Why will the company interview former users?", { A: "To learn why users did not stay", B: "To prove downloads were fake", C: "To raise the app price", D: "To replace all employees" }, "A", "转折指出留存问题，访谈是寻找原因的合理一步推断；其余选项缺证据。")
    ]
  },
  l4: {
    advancedBlocks: [
      { type: "heading", text: "拔高：混合态度与语境词义" },
      { type: "paragraph", text: "作者可能先肯定现象，再提醒风险。不要只凭一个褒义词判断‘完全支持’，要看转折和结尾的限定；猜词义也要代回原句检验。" },
      { type: "tip", text: "先写出作者肯定什么、保留什么，再选态度词；词义选项代回后还须与上下文逻辑一致。" }
    ],
    practiceQuestions: [
      question("l4-q1", "p2", "Online lessons make courses easier to access. Still, the author argues that they cannot replace every face-to-face discussion, especially when students need immediate feedback.", "What is the author's attitude toward online lessons?", { A: "Completely opposed", B: "Carefully supportive", C: "Uninterested", D: "Certain they solve every problem" }, "B", "作者肯定便利，也提出局限，是审慎支持。A、D 过于绝对。"),
      question("l4-q2", "p4", "The first plan was costly. The revised plan was more modest: it used existing rooms and required no new equipment.", "What does modest most likely mean here?", { A: "Less ambitious", B: "More expensive", C: "Secret", D: "Unclear" }, "A", "冒号后的细节解释了修订方案规模更小、成本更低，所以 modest 是 less ambitious。")
    ]
  },
  l5: {
    advancedBlocks: [
      { type: "heading", text: "拔高：词形相同也要看逻辑" },
      { type: "paragraph", text: "同一空可能有两个相同词性的候选词。这时看段落态度、前后因果和固定搭配；不要只凭‘都能当名词/动词’随便选。" },
      { type: "tip", text: "先排不合词性的，再用语义和搭配二次筛选，最后整句读一遍。" }
    ],
    practiceQuestions: [
      question("l5-q1", "p3", "Regular breaks can ___ workers' attention during long tasks.", "Which word best fits the blank?", { A: "improvement", B: "improve", C: "improved", D: "improving" }, "B", "情态动词 can 后用动词原形 improve。"),
      question("l5-q2", "p5", "The program was designed to make public transport more ___ to older passengers.", "Which word best fits the blank?", { A: "access", B: "accessibly", C: "accessible", D: "accessing" }, "C", "more 后作表语，需要形容词 accessible；accessible to 是常见搭配。")
    ]
  }
};

export const EXTRA_LESSONS: Lesson[] = [
  {
    id: "l6",
    title: "长篇阅读·段落匹配定位",
    microLesson: {
      goal: "用题干中的独特信息快速找到对应段落，不必逐字读完长文。",
      blocks: [
        { type: "heading", text: "一、先看句子，再扫段落" },
        { type: "paragraph", text: "长篇阅读考查把题干信息匹配到段落。先从每句圈一个独特的定位锚：年份、数字、专有名词或少见名词，再快速扫各段。" },
        { type: "heading", text: "二、匹配意思，而不只匹配原词" },
        { type: "paragraph", text: "找到疑似段落后，读附近完整句，确认人物、动作和因果都相同。一个段落可以对应多题，也可能一题都不对应。" },
        { type: "tip", text: "一题找不到先跳过；把高辨识度题目先做掉，剩余范围会更小。" }
      ],
      advancedBlocks: [
        { type: "heading", text: "拔高：多段都出现同一主题词" },
        { type: "paragraph", text: "若多个段落都提到 technology，只看题干真正限定的行为，例如‘学生使用技术’还是‘教师评估技术’，避免主题词误配。" }
      ]
    },
    retellTask: "请教同学如何用题干的独特信息定位段落，并说明为什么‘看见同一个词’还不能直接匹配。",
    rubricPoints: [
      point("p1", "先看匹配句并圈独特定位词，如数字、年份、专有名词。", ["定位词", "数字", "年份", "专有名词"]),
      point("p2", "快速扫段落，找到候选后核对完整语义，而不是只看原词。", ["扫段落", "语义", "核对", "同义替换"]),
      point("p3", "允许一段对应多题或零题，难题先跳过再回查。", ["多题", "零题", "跳过", "回查"]),
      point("p4", "主题词重复时再核对行为、对象和因果限定。", ["行为", "对象", "因果", "限定"], "bonus")
    ],
    commonMistakes: ["只因出现同一个词就选该段。", "误以为每段只能匹配一道题。"],
    modelAnswer: "我先圈题干里最独特的数字、年份或名词，用它们扫描段落；找到候选后再读完整句，核对谁做了什么和因果。不能只凭原词重复就选，因为题干常会改写；一段可以多题，也可能没有题，难题先跳过。",
    practiceQuestions: [
      question("l6-q1", "p2", "A. The project began in 2019 with two schools.\nB. In 2022, volunteers repaired old computers and donated them to rural classrooms.\nC. Teachers later shared lesson plans online.\nD. The city plans to review the program next year.", "Which paragraph matches: Volunteers gave reused computers to schools outside the city?", { A: "Paragraph A", B: "Paragraph B", C: "Paragraph C", D: "Paragraph D" }, "B", "repaired old computers and donated 对应 reused computers / gave；rural classrooms 对应 schools outside the city。"),
      question("l6-q2", "p1", "A. The garden was designed by students.\nB. The garden opened in April.\nC. A survey found that 68% of visitors came on weekends.\nD. New signs were added at the entrance.", "Which paragraph reports a survey result about weekend visitors?", { A: "Paragraph A", B: "Paragraph B", C: "Paragraph C", D: "Paragraph D" }, "C", "survey、68%、weekends 是独特定位锚，只在 C 段同时出现。")
    ]
  },
  {
    id: "l7",
    title: "长篇阅读·同义改写与干扰",
    microLesson: {
      goal: "识别长篇匹配中的改写，并用限定信息排除看似相关的段落。",
      blocks: [
        { type: "heading", text: "一、常见改写有三种" },
        { type: "bullets", items: ["近义词替换：reduce costs → lower expenses。", "词性转换：a decision → decide。", "概括与具体：public transport → buses and trains。"] },
        { type: "heading", text: "二、三项限定必须一致" },
        { type: "paragraph", text: "匹配句和原文的主体、动作、结果必须一致。只匹配主题词，但把‘过去的试验’说成‘未来的计划’，就是干扰。" },
        { type: "tip", text: "用一句中文复述题干，再用一句中文复述候选段；意思一致才选。" }
      ],
      advancedBlocks: [
        { type: "heading", text: "拔高：否定与比较的改写" },
        { type: "paragraph", text: "not all 不等于 none；more than 不等于 the most。遇到否定和比较，一定把范围写出来再判断。" }
      ]
    },
    retellTask: "请讲清三种常见同义改写，并示范如何排除只共享主题词、却改了时间或主体的段落。",
    rubricPoints: [
      point("p1", "识别近义词、词性转换、概括与具体三种改写。", ["近义", "词性转换", "概括", "具体"]),
      point("p2", "核对主体、动作、结果以及时间等限定，不能只看相同主题词。", ["主体", "动作", "结果", "时间", "限定"]),
      point("p3", "先各自复述题干和段落，再判断意思是否一致。", ["复述", "意思一致", "语义"]),
      point("p4", "否定和比较须保留原文范围，not all 不等于 none。", ["否定", "比较", "范围"], "bonus")
    ],
    commonMistakes: ["只找一模一样的英语词。", "把提议误读成已经实施。"],
    modelAnswer: "长篇匹配要认出同义改写，包括近义词、词性变化和上位概括。我会分别复述题干与段落，再核对主体、动作、结果和时间，意思完全一致才匹配。",
    practiceQuestions: [
      question("l7-q1", "p1", "A. The city decided to cut bus fares for students.\nB. The city discussed cheaper bus tickets but made no decision.\nC. Students were given free bicycles.\nD. Bus prices rose last month.", "Which paragraph matches: The city chose to lower the cost of student bus travel?", { A: "Paragraph A", B: "Paragraph B", C: "Paragraph C", D: "Paragraph D" }, "A", "decided 对应 chose，cut fares 对应 lower the cost；B 只是讨论，尚未决定。"),
      question("l7-q2", "p2", "A. Researchers will interview patients next month.\nB. Doctors interviewed 50 patients last year.\nC. Patients interviewed hospital staff.\nD. A new interview guide was published.", "Which paragraph says medical staff spoke with patients in the past?", { A: "Paragraph A", B: "Paragraph B", C: "Paragraph C", D: "Paragraph D" }, "B", "Doctors = medical staff，interviewed = spoke with，last year = in the past；A 是未来，C 主客体颠倒。")
    ]
  },
  {
    id: "l8",
    title: "仔细阅读·篇章结构与例证作用",
    microLesson: {
      goal: "看出段落中的观点、例子与结论，回答‘为什么提到这个例子’。",
      blocks: [
        { type: "heading", text: "一、先找观点，再看例子" },
        { type: "paragraph", text: "for example、for instance 后面的细节通常服务于附近的观点。题目问作者提例子的目的时，回到例子前后找被支持的论点。" },
        { type: "heading", text: "二、识别段落作用" },
        { type: "bullets", items: ["开头：提出问题或背景。", "中间：解释原因、给证据或对比。", "结尾：总结、限制或建议。"] },
        { type: "tip", text: "用‘这段在证明什么’概括段落，不要把例子的内容原样抄成答案。" }
      ],
      advancedBlocks: [
        { type: "heading", text: "拔高：让步与反驳" },
        { type: "paragraph", text: "although / while 先承认对方一点，后面主句才可能是作者真正立场。别把被让步的观点当结论。" }
      ]
    },
    retellTask: "请给同学讲清作者举例子通常为了什么，以及问段落作用时怎样找观点、证据与结论。",
    rubricPoints: [
      point("p1", "例子通常支持邻近观点，问举例目的要回到例子前后找论点。", ["例子", "观点", "论点", "前后"]),
      point("p2", "能区分背景、原因证据、总结建议等段落作用。", ["背景", "原因", "证据", "总结", "建议"]),
      point("p3", "作答要概括被证明的观点，而非只重复例子细节。", ["概括", "不是细节", "证明"]),
      point("p4", "识别 although/while 的让步，关注后面的主句立场。", ["although", "while", "让步", "主句"], "bonus")
    ],
    commonMistakes: ["选项复述例子细节，却没有解释例子服务的观点。", "把让步部分当作者结论。"],
    modelAnswer: "我看到 for example 会先读它前后，找作者要支持的观点。问例证作用时，我答的是论点而不是例子细节。段落可能负责背景、证据、对比或总结，还要注意 although 之后的主句。",
    practiceQuestions: [
      question("l8-q1", "p1", "Shared tools can reduce waste. For example, one neighborhood library lends drills that most families would otherwise buy and rarely use.", "Why does the author mention drills?", { A: "To explain how to repair tools", B: "To show that sharing infrequently used items can reduce waste", C: "To argue every family needs a drill", D: "To compare two libraries" }, "B", "drills 是例子，服务于前句 shared tools can reduce waste 的观点。"),
      question("l8-q2", "p4", "Although the first trial was expensive, its results helped engineers design a much cheaper system. The team therefore decided to continue testing.", "What is the author's main point?", { A: "The cost ended the project.", B: "The team learned enough to keep improving the system.", C: "The first trial was free.", D: "Engineers refused further tests." }, "B", "although 引出让步；主句和结尾说明试验有价值、团队继续测试。")
    ]
  },
  {
    id: "l9",
    title: "仔细阅读·长难句与指代",
    microLesson: {
      goal: "抓住长句主干，并通过指代词把相邻句子的意思接起来。",
      blocks: [
        { type: "heading", text: "一、先抓主谓宾" },
        { type: "paragraph", text: "碰到插入语、定语从句或长介词短语，先找句子的主语、谓语和宾语，再补条件、原因与结果。不要逐词翻译到忘记主句。" },
        { type: "heading", text: "二、代词往前找名词" },
        { type: "paragraph", text: "it、they、this、those 常指前句的人、事或整个观点。代回去读一遍，检查单复数和语义是否通顺。" },
        { type: "tip", text: "说出‘谁做什么’，再说‘谁/什么被 it 或 this 代替’。" }
      ],
      advancedBlocks: [
        { type: "heading", text: "拔高：分清限制与补充" },
        { type: "paragraph", text: "限定性从句决定‘是哪一个’，非限定性从句补充信息。解题时先问限定信息是否改变了选项范围。" }
      ]
    },
    retellTask: "请讲清看长句时为什么先抓主干、后补修饰，以及 it、this 这类指代如何回指。",
    rubricPoints: [
      point("p1", "长句先找主语、谓语和宾语，再补从句、插入语等修饰。", ["主语", "谓语", "宾语", "主干", "修饰"]),
      point("p2", "指代词回看前句候选，核对单复数与语义。", ["指代", "前句", "单复数", "代回"]),
      point("p3", "理解主句后再核对条件、原因和结果，避免错读因果。", ["条件", "原因", "结果", "因果"]),
      point("p4", "从句中的限定信息可能改变选项范围。", ["从句", "限定", "范围"], "bonus")
    ],
    commonMistakes: ["只翻译长句前半截，漏看主句。", "把 this 指向离它最近但语义不通的名词。"],
    modelAnswer: "长句我先找谁做了什么这个主干，再把从句和介词短语加回去。遇到 it、this，我会回看前一句的名词或整件事，代入后检查单复数和语义；最后再核对条件与因果。",
    practiceQuestions: [
      question("l9-q1", "p1", "The report, which was prepared by a team of volunteers over two years, shows that local parks need more shade in summer.", "What does the report show?", { A: "Volunteers need two more years.", B: "Local parks need more summer shade.", C: "The report was written in summer.", D: "The parks were closed." }, "B", "主干是 The report shows that ...；which 从句补充报告来源，不改变主句结论。"),
      question("l9-q2", "p2", "The school introduced a free breakfast program. This helped students arrive in class ready to learn.", "What does This refer to?", { A: "The school building", B: "The breakfast program", C: "The classroom door", D: "The students' homework" }, "B", "This 回指前句整件事，即学校推出免费早餐计划。")
    ]
  },
  {
    id: "l10",
    title: "选词填空·词性与词形",
    microLesson: {
      goal: "用句子结构先筛词性，再核对动词形式、单复数和派生词。",
      blocks: [
        { type: "heading", text: "一、先给候选词分组" },
        { type: "paragraph", text: "把词库按名词、动词、形容词、副词分类。一个词可能有多种用法，-ed、-ing 也可能是形容词。" },
        { type: "heading", text: "二、空格左右决定词性" },
        { type: "bullets", items: ["冠词 + 空格 + 名词：空格常为形容词。", "情态动词 + 空格：常用动词原形。", "空格 + 动词/形容词：可能需副词。", "主语后缺谓语：看时态、语态与主谓一致。"] },
        { type: "tip", text: "词性只筛出候选，不直接决定答案；还要看意思和搭配。" }
      ],
      advancedBlocks: [
        { type: "heading", text: "拔高：派生词与兼类词" },
        { type: "paragraph", text: "care、careful、carefully 属于不同词性；record 可以作名词也可以作动词。根据句法位置判断，而不是只看词尾。" }
      ]
    },
    retellTask: "请讲清怎么先按词性缩小词库，并举例说明为何还须检查时态、单复数和语义。",
    rubricPoints: [
      point("p1", "先给候选词标名词、动词、形容词、副词及可能兼类。", ["标词性", "名词", "动词", "形容词", "副词", "兼类"]),
      point("p2", "根据空格左右句法判断词性，例如情态动词后用动词原形。", ["空格", "句法", "情态动词", "动词原形"]),
      point("p3", "词性筛选后继续核对语义、时态、单复数与搭配。", ["语义", "时态", "单复数", "搭配"]),
      point("p4", "识别派生词和 -ed/-ing 的多种用法。", ["派生词", "ed", "ing", "兼类"], "bonus")
    ],
    commonMistakes: ["词性相同就直接选择，不检查句意。", "忽略动词时态或名词单复数。"],
    modelAnswer: "我先把词库按词性分类，再看空格左右结构确定需要什么词性；情态动词后要原形。确定候选后还要把词放回句子，检查意思、搭配、时态和单复数。",
    practiceQuestions: [
      question("l10-q1", "p2", "The new rule may ___ the amount of paper used in the office.", "Which word fits best?", { A: "reduction", B: "reducing", C: "reduce", D: "reduced" }, "C", "may 后接动词原形 reduce。"),
      question("l10-q2", "p3", "The library has become a ___ place for students who need quiet study space.", "Which word fits best?", { A: "value", B: "valuable", C: "valuably", D: "valuing" }, "B", "a 与 place 之间需形容词，valuable 表‘有价值的’，语义也相符。")
    ]
  },
  {
    id: "l11",
    title: "选词填空·搭配与语境",
    microLesson: {
      goal: "在词性相同的候选词中，利用固定搭配和段落逻辑选出最合适的词。",
      blocks: [
        { type: "heading", text: "一、先读空格所在整句" },
        { type: "paragraph", text: "先判断句子在表达积极、消极还是转折，再看词与介词、名词的搭配。不能把句子切成只有空格左右两个词。" },
        { type: "heading", text: "二、抓逻辑连接词" },
        { type: "bullets", items: ["because / therefore：前因后果。", "but / however：前后方向相反。", "for example：后句举例说明前句。"] },
        { type: "tip", text: "两个词词性都对时，把每个词代入读整句和前后句。" }
      ],
      advancedBlocks: [
        { type: "heading", text: "拔高：熟词僻义" },
        { type: "paragraph", text: "address 除‘地址’还可表示‘处理问题’；issue 除‘问题’也可表示‘发行’。答案由语境决定，不由第一个记住的中文释义决定。" }
      ]
    },
    retellTask: "请讲清当两个备选词词性都对时，如何结合搭配、转折和上下文判断。",
    rubricPoints: [
      point("p1", "先读整句及前后句，理解积极、消极或转折方向。", ["整句", "上下文", "转折", "方向"]),
      point("p2", "核对词与介词、名词等的搭配。", ["搭配", "介词", "名词"]),
      point("p3", "词性相同的选项逐一代入，最后通读检查语义连贯。", ["代入", "通读", "语义", "连贯"]),
      point("p4", "熟词可能有其他义项，最终以语境定词义。", ["熟词", "僻义", "语境"], "bonus")
    ],
    commonMistakes: ["只看空格左右两个词，漏看 but/however。", "选了词典第一义，却与整段主题冲突。"],
    modelAnswer: "两个选项词性都对时，我会读整句和前后句，找 because、however 等逻辑词，再核对搭配。把候选词都代回去读，选择语义连贯、搭配自然的那个，最后通读全段。",
    practiceQuestions: [
      question("l11-q1", "p2", "The committee will ___ the problem of food waste at its next meeting.", "Which word fits best?", { A: "address", B: "arrive", C: "borrow", D: "attend" }, "A", "address a problem 是‘处理问题’的搭配；其他词与 problem 的语义或搭配不符。"),
      question("l11-q2", "p1", "The first test seemed successful. However, later checks ___ a serious error in the data.", "Which word fits best?", { A: "celebrated", B: "revealed", C: "protected", D: "avoided" }, "B", "however 表转折，后文出现 serious error，所以 later checks 是‘揭示’了错误。")
    ]
  },
  {
    id: "l12",
    title: "阅读综合·限时决策与错因复盘",
    microLesson: {
      goal: "在有限时间里按题型选择方法，并用证据复盘错题。",
      blocks: [
        { type: "heading", text: "一、先识别题型，再选方法" },
        { type: "bullets", items: ["长篇匹配：定位锚 + 同义改写。", "仔细阅读：题干定位 + 原文证据 + 干扰项排除。", "选词填空：词性 + 语境 + 搭配。"] },
        { type: "heading", text: "二、卡住时留证据、先跳题" },
        { type: "paragraph", text: "先做有明确证据的题；遇到一题卡住，记下疑点并继续。做完后回查，而不是在一题上耗尽阅读时间。" },
        { type: "heading", text: "三、错题复盘三句话" },
        { type: "paragraph", text: "说出原文证据在哪、自己的选择错在何处、下次遇到同类信号怎么做。仅记住正确字母不能迁移到新题。" },
        { type: "tip", text: "复盘时合上解析，用自己的话重讲证据链；隔天再做一遍更能检查是否记住。" }
      ],
      advancedBlocks: [
        { type: "heading", text: "拔高：比较两项最像的答案" },
        { type: "paragraph", text: "只剩两项时，逐词检查范围、因果、主体和程度。找到能把其中一项排除的原文证据，而不是凭语感猜。" }
      ]
    },
    retellTask: "请教同学在四级阅读三种题型里怎样选方法、卡题怎么办，以及错题要如何用证据链复盘。",
    rubricPoints: [
      point("p1", "根据长篇匹配、仔细阅读、选词填空选择不同方法。", ["长篇", "仔细阅读", "选词填空", "题型"]),
      point("p2", "卡题先记疑点并跳过，之后回查证据。", ["卡题", "跳过", "回查", "证据"]),
      point("p3", "错题复盘要说原文证据、自己错因和下次行动。", ["证据", "错因", "下次", "复盘"]),
      point("p4", "两项相近时比较范围、因果、主体和程度。", ["范围", "因果", "主体", "程度"], "bonus")
    ],
    commonMistakes: ["只记答案字母，不记证据与错因。", "在一道难题上耗时过久。"],
    modelAnswer: "我先识别是长篇匹配、仔细阅读还是选词填空，再分别用定位改写、原文证据、词性语境的方法。卡题先跳，回头查证据。复盘时说出原文证据、错因和下次怎么做，而不只记字母。",
    practiceQuestions: [
      question("l12-q1", "p1", "A reading task asks you to match ten statements to paragraphs A–N. One paragraph may be used more than once.", "What should you do first?", { A: "Translate every sentence of the passage", B: "Mark distinctive anchors in the statements", C: "Count all adjectives", D: "Assume each paragraph matches exactly once" }, "B", "这是长篇段落匹配，先圈高辨识度定位锚，再扫描段落；一段可对应多题。"),
      question("l12-q2", "p3", "You chose an option because it repeated a word from the passage. The answer key shows a different option that paraphrases the sentence correctly.", "Which review note is most useful?", { A: "Next time I will choose the longest option.", B: "I only need to memorize the answer letter.", C: "I will locate the evidence and compare meanings, not just repeated words.", D: "I will avoid reading the passage." }, "C", "复盘应指出错因是原词复现陷阱，并给出下一次可执行的证据核对步骤。")
    ]
  }
];
