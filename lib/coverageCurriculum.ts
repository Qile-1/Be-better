import type { Lesson, ProductionTask, RubricPoint } from "./types";

function point(id: string, text: string, keyPhrases: string[]): RubricPoint {
  return { id, point: text, keyPhrases, tier: "core", mustCover: true };
}

function task(id: string, prompt: string, focus: string, reference: string, analysis: string[]): ProductionTask {
  return { id, prompt, focus, reference, analysis };
}

// Existing IDs stay unchanged. These lessons fill audited skill gaps, not predicted topics.
export const COVERAGE_LESSONS: Lesson[] = [
  {
    id: "l13", title: "仔细阅读·范围、因果与证据边界", category: "reading",
    microLesson: {
      goal: "区分原文事实和自己的解释，核对对象、范围、时间、因果与语气。",
      blocks: [
        { type: "heading", text: "一、先确定题目问的是哪件事" },
        { type: "paragraph", text: "同一篇文章可能讨论现状、理想做法和未来建议。题目问现状的原因时，不能用作者推荐的新方法的好处作答；研究者说的也不一定就是作者赞同的。" },
        { type: "heading", text: "二、定位后保留限定条件" },
        { type: "bullets", items: ["谁做的、对谁有效：参与者不能扩大成所有人。", "何时发生：过去结果、当前安排、未来计划不能混换。", "多大程度：some / most / all，may / will，not all / none 都不同。", "比较对象：A 比 B 更快，不等于 A 最快。"] },
        { type: "heading", text: "三、相关不自动等于因果" },
        { type: "paragraph", text: "两件事同时出现，只能先说有关联。若原文没有建立因果，就不能补成某事导致另一事；如果题目问原文给出的原因，则依据原文，而不是凭生活经验改答案。" },
        { type: "tip", text: "绝对词是核对信号，不是见到就排除的暗号。原文确实说 all 时，正确选项也可以说 all。" }
      ],
      advancedBlocks: [{ type: "paragraph", text: "拔高：连接相隔较远的证据，检查样本、测量方式和替代解释。只做阅读所需判断，不要求掌握统计学术语。" }]
    },
    retellTask: "如何检查一个看似合理的选项有没有偷换时间、主体、范围或因果？遇到 all 是否一定排除？",
    rubricPoints: [
      point("p1", "先确认题目问现状、原因、结论还是建议，并定位相应证据。", ["现状", "原因", "建议", "证据"]),
      point("p2", "核对主体、时间、比较对象、数量范围和可能性，不扩大原文。", ["主体", "时间", "范围", "可能"]),
      point("p3", "不把相关当因果，不加入常识推测；绝对词是否正确取决于原文。", ["相关", "因果", "常识", "绝对词"])
    ],
    commonMistakes: ["把改进方案的优点当成现状的原因。", "见到 all 一律排除。", "把相关性改写成确定因果。"],
    modelAnswer: "我先确认题目问什么，再找对应证据，不把建议当现状。逐项检查是谁、何时、多大范围、和谁比较以及语气强弱。相关不能擅自变成因果；有绝对词也要核对原文，原文有充分依据就可以选。",
    practiceQuestions: [
      { id: "l13-q1", pointId: "p1", passage: "The centre currently opens at nine because its security staff start work then. A consultant suggests opening at eight to reduce queues. No change has yet been approved.", prompt: "Why does the centre currently open at nine?", options: { A: "To reduce queues", B: "To test a new schedule", C: "Because security staff begin work then", D: "Because a consultant requested it" }, answer: "C", explanation: "currently 对应现行安排，because 直接给原因。A 是尚未实施建议的预期好处；B 无依据；D 混淆建议与现状。" },
      { id: "l13-q2", pointId: "p2", passage: "Every participant in the small trial received written instructions. Most completed the task, but the report did not compare them with people who received no instructions.", prompt: "Which statement is supported?", options: { A: "All participants received written guidance", B: "All participants completed the task", C: "Instructions always guarantee success", D: "People without instructions failed" }, answer: "A", explanation: "Every 与 All 等价，所以绝对表达 A 有依据。B 把 most 扩大；C、D 没有比较证据。" },
      { id: "l13-q3", pointId: "p3", passage: "In a survey, students who visited the library more often also reported higher grades. The researchers noted that these students might already have stronger study habits before joining the survey.", prompt: "What is the most careful conclusion?", options: { A: "Library visits necessarily cause better grades", B: "Study habits are irrelevant", C: "All students should stop studying at home", D: "The survey shows an association, not proof of causation" }, answer: "D", explanation: "调查显示关联，既有习惯是另一种解释。A 把相关变因果；B 与后句相反；C 引入无关建议。" }
    ]
  },
  {
    id: "w5", title: "写作·活动报告与经历叙述", category: "writing",
    microLesson: {
      goal: "按题干写报告或叙事，不把所有题套成利弊议论文。",
      blocks: [
        { type: "heading", text: "一、区分 report 与 experience" },
        { type: "paragraph", text: "报告面向读者交代事件及结果，经历叙述重在事情经过和个人感受。先圈身份、读者、事件、要求；题干要总结讲座要点，就不能只写参加讲座的好处。" },
        { type: "heading", text: "二、用信息链组织正文" },
        { type: "bullets", items: ["报告：时间地点人物 → 做了什么或分享哪些要点 → 结果或意义。", "叙事：起因 → 一两个关键行动 → 结果和反思。", "过去发生的事件主要用过去时，现在仍成立的认识可用现在时；不要无缘由来回切换。"] },
        { type: "heading", text: "三、检查任务和词数" },
        { type: "paragraph", text: "按题目要求写 120—180 词。模拟写作可设置合理情境，但不要冒充真实调查编造精确数据。报告不自动需要 Dear... 或 Yours...，格式由题干决定。" }
      ],
      advancedBlocks: [{ type: "tip", text: "拔高：用一句关键动作呈现变化，比堆砌 unforgettable、meaningful 更有说服力。" }]
    },
    retellTask: "活动报告和经历叙述分别怎么组织？如何处理时态、格式和题目要求？",
    rubricPoints: [point("p1", "审清报告或叙事的体裁、对象和必答信息。", ["体裁", "对象", "信息"]), point("p2", "报告交代事件要点与结果，叙事写关键经过与反思。", ["要点", "结果", "经过", "反思"]), point("p3", "保持时态一致，按要求检查格式和词数，不编造调查数据。", ["时态", "格式", "词数", "数据"])],
    commonMistakes: ["讲座报告只写听讲座很重要。", "所有任务都写成信。", "过去事件和现在描述随意混用。"],
    modelAnswer: "先看是报道事件还是讲自己的经历，圈出读者和必答内容。报告写时间地点、主要内容及结果；叙事写关键行动和由此得到的认识。过去事件主要用过去时，最后检查格式、120—180 词和有没有漏答。",
    productionTasks: [task("w5-t1", "原创模拟：你为校报写一篇校园维修体验活动报告。交代活动安排、两项主要内容和参与者的收获。120—180 词。", "报告信息、过去时与结果。", "A repair workshop was held in the student centre last Saturday afternoon. Student volunteers and a local repair worker showed participants how to care for everyday belongings.\nThe first part focused on clothing. Participants learned to sew a loose button and repair a small hole using simple tools. In the second part, the instructor explained how to identify damage that should be handled by a professional. Students were reminded not to open electrical equipment without proper training. They then practised describing a problem clearly before asking for help.\nThe workshop gave students a chance to learn practical skills while thinking about unnecessary waste. Several participants said they would try small clothing repairs before buying replacements. The organizers plan to collect suggestions for future sessions so that the next workshop can address the problems students encounter most often.", ["时间地点及组织者明确；不是泛泛谈修理的重要性。", "两项活动内容对应任务，主体用过去时，未来计划有明确标记。", "只陈述情境内的反馈，不宣称已测得全校减废效果。"])]
  },
  {
    id: "w6", title: "写作·推荐、提案与多任务回应", category: "writing",
    microLesson: {
      goal: "把题干拆成可核对的任务清单，避免漏写理由、措施或回应方式。",
      blocks: [
        { type: "heading", text: "一、体裁看指令，不看话题" },
        { type: "paragraph", text: "校园话题可能要求 essay、proposal、report、letter 或论坛推荐。题目要 response 不等于必写信；只有明确书信任务才使用相应称呼落款。" },
        { type: "heading", text: "二、拆出每一个动作" },
        { type: "bullets", items: ["推荐：介绍对象 → 说明适合谁 → 用具体特点解释推荐理由。", "提案：问题或目标 → 可执行措施 → 理由与预期效果。", "多任务回应：如优势、问题、改进建议，三个都要回答，不只写最熟悉的一项。"] },
        { type: "heading", text: "三、每个理由配细节" },
        { type: "paragraph", text: "不要只写 useful、interesting。解释一个具体功能怎样帮助目标读者。结尾回应目的，不临时引入未展开的新观点。写完按任务清单逐项划勾，检查 120—180 词。" }
      ],
      advancedBlocks: [{ type: "paragraph", text: "拔高：说明建议的资源限制和试行办法，使方案更现实；题目没要求时不必为了显得复杂而增加段落。" }]
    },
    retellTask: "怎样判断推荐、提案或回应的格式，并确保所有任务都答到了？",
    rubricPoints: [point("p1", "依据指令确定体裁和读者，不见校园题就套书信。", ["指令", "体裁", "读者"]), point("p2", "把题干的介绍、理由、建议等动作列成清单并逐项回答。", ["清单", "逐项", "理由", "建议"]), point("p3", "用具体特点或措施及其效果支持观点，检查词数和遗漏。", ["具体", "措施", "效果", "词数"])],
    commonMistakes: ["推荐只有形容词，没有对象特点。", "只写好处，漏掉改进建议。", "把 response 无条件写成正式信件。"],
    modelAnswer: "我先看指令确定体裁和读者，再把所有要求变成清单。推荐要介绍对象并说明为什么适合读者，提案写具体措施和效果，多任务回应逐项作答。最后检查格式、词数和每项任务是否有内容支撑。",
    productionTasks: [task("w6-t1", "原创模拟：在班级论坛推荐一个校园学习空间。介绍它的特点，说明为什么适合小组学习，并提醒一个使用限制。120—180 词，不要求书信格式。", "对象介绍、理由和限制三项均须覆盖。", "I would recommend the discussion room on the ground floor of our library to students preparing group presentations. Unlike the quiet reading rooms upstairs, this space allows conversation, so members can test their ideas aloud without disturbing other readers.\nThe room has a large table and a board that can be used to organize an outline. During our last project, writing each member's main point on the board helped us notice repeated information and agree on a clearer order. The location is also convenient because we can check books nearby when we need reliable examples.\nThere is one important limitation: groups must book the room in advance, and each booking lasts only an hour. I suggest arriving with a short agenda and dividing tasks before the meeting. With a little preparation, the room can make group work more focused and productive.", ["论坛帖子不添加无必要的书信格式。", "设施特点连接到小组学习效果，例子可核对。", "明确限制和应对措施，覆盖三项要求。"])]
  },
  {
    id: "w7", title: "写作·段落展开与语言自检", category: "writing",
    microLesson: {
      goal: "让每段有解释，让每句有完整骨架，先准确再求复杂。",
      blocks: [
        { type: "heading", text: "一、观点之后必须有解释" },
        { type: "paragraph", text: "中心句提出判断，随后用原因、例子或对比说明为什么，最后回扣本段论点。不要把连接词当作论证，也不要用同一句好处换词重复。" },
        { type: "heading", text: "二、逐句查骨架" },
        { type: "bullets", items: ["每个完整句有主语和谓语，注意第三人称单数、时态和名词单复数。", "两个独立句用句号、分号或恰当连词连接，不能只靠一个逗号。", "because 从句要有配套主句；代词要能指回明确的人或事。", "检查冠词、搭配和拼写；不确定的华丽词换成能准确使用的词。"] },
        { type: "example", title: "原创改句", question: "Because online notes are convenient. Students uses them, they can review anywhere.", analysis: "Online notes are convenient because students can review them anywhere. 合并碎句，students 后不用 uses，并消除逗号拼接。" },
        { type: "tip", text: "词数、任务覆盖和语言准确是基础，不是拔高。复杂句式是可选增强，不应牺牲可读性。" }
      ],
      advancedBlocks: [{ type: "paragraph", text: "拔高：在关系明确时使用让步、定语或非谓语结构，减少机械重复；不为增加难度强行倒装。" }]
    },
    retellTask: "一段如何从观点展开到证据？交卷前如何检查句子完整、语法、任务和词数？",
    rubricPoints: [point("p1", "中心句后用原因、例子或对比展开，避免重复空话。", ["中心句", "原因", "例子"]), point("p2", "检查主谓、时态、单复数、指代和连接，避免碎句及逗号拼接。", ["主谓", "时态", "碎句", "逗号"]), point("p3", "核对任务覆盖、体裁、词数和基本搭配，准确优先于复杂。", ["任务", "体裁", "词数", "准确"])],
    commonMistakes: ["堆 Firstly、Secondly 但没有解释。", "because 开头写完从句就结束。", "复杂句越长越好。"],
    modelAnswer: "我用中心句提出一个观点，再用原因或具体例子展开。检查每句主语谓语、时态、单复数和指代，独立句不能只用逗号连接。最后回到任务清单和词数要求，宁可准确清楚，也不堆不熟悉的复杂句。",
    productionTasks: [task("w7-t1", "原创模拟：写 120—180 词讨论小组项目中设定共同截止时间的价值。至少用一个具体例子展开，并说明一项合理例外。", "观点展开、例子、让步及语言准确。", "A shared deadline can make a group project easier to manage because it gives every member a clear picture of the work ahead. Without one, students may finish their parts at different times, leaving little opportunity to check whether the final report fits together.\nFor example, a group preparing a survey report could agree to finish the first draft three days before submission. This would give members time to compare their findings, remove repeated points and correct unclear sentences. The deadline is useful not because it creates pressure, but because it protects time for revision.\nHowever, a student who becomes ill may need an adjustment. The group should discuss the problem early and redistribute a small part of the work if necessary. A good deadline combines a clear plan with reasonable flexibility, helping students cooperate without ignoring genuine difficulties.", ["首段解释机制，而非重复 important。", "提前三天交草稿的例子服务于共同截止时间。", "合理例外不推翻主张；检查主谓和连接。"])]
  },
  {
    id: "t5", title: "翻译·数字、单位与时间表达", category: "translation",
    microLesson: {
      goal: "保全年份、数量、比例和增减关系，不把语言通顺当作信息准确。",
      blocks: [
        { type: "heading", text: "一、先单独圈出数字信息" },
        { type: "bullets", items: ["万 = ten thousand，亿 = one hundred million；3,600 万 = 36 million，不是 3.6 million。", "占 60% = account for 60%；从 20% 到 30% 是上升 10 个百分点，不是上升 10%。", "增加了用 by，增加到用 to；more than / nearly / about 等限定也要保留。"] },
        { type: "heading", text: "二、时间决定表达" },
        { type: "paragraph", text: "2018 年建成可用 was completed in 2018；自 2018 年以来持续的变化可用 has increased since 2018。过去日期不自动让整段都用过去时，现在仍存在的设施和事实可以用现在时。" },
        { type: "example", question: "人数从 2 万增加到 3 万，增长了 50%。", analysis: "The number rose from 20,000 to 30,000, an increase of 50 percent. to 30,000 是终值；by 50 percent 是增幅。" },
        { type: "tip", text: "译完先只对数字、单位、时间和比较词做一轮回查，再检查语法。遇到不确定的专业数字说法优先直白准确。" }
      ],
      advancedBlocks: [{ type: "paragraph", text: "拔高：用分词短语压缩统计说明，但不要把占比、增幅、倍数混为一谈。" }]
    },
    retellTask: "如何翻译万、亿、占比、增幅，以及带过去日期或 since 的句子？",
    rubricPoints: [point("p1", "数字换算和单位准确，保留约、超过等限定。", ["换算", "单位", "限定"]), point("p2", "区分增加到与增加了、占比与百分点。", ["to", "by", "占比", "百分点"]), point("p3", "根据时间和是否持续选择时态，译后逐项回查数字与信息。", ["时间", "持续", "时态", "回查"])],
    commonMistakes: ["把 3,600 万写成 3.6 million。", "把增长到写成增长了。", "漏译大约、超过等限定。"],
    modelAnswer: "我先圈出所有数字、单位、时间和限定词，换算万亿时确认位数。增加到用 to，增加了用 by，比例和百分点分别处理。具体过去事件用过去时，持续到现在的变化考虑完成时，最后把这些信息逐项对回中文。",
    productionTasks: [task("t5-t1", "原创短段训练，非真题全长：某市的社区阅览室于2018年开放。去年，登记读者从2万人增加到3万人，增长了50%。其中，约60%的读者每月至少到访一次。自开放以来，阅览室已举办了120场免费活动。", "20,000 / 30,000、by 50%、about 60%、过去时与完成时。", "The community reading room in a city opened in 2018. Last year, the number of registered readers rose from 20,000 to 30,000, an increase of 50 percent. About 60 percent of them visited at least once a month. Since it opened, the reading room has held 120 free events.", ["from...to... 保留初值终值；an increase of 50 percent 保留增幅。", "about、at least 分别对应约、至少。", "去年用过去时，since 持续累计用完成时；不擅自增加满意度。"])]
  },
  {
    id: "t6", title: "翻译·寓言叙事与时态链", category: "translation",
    microLesson: {
      goal: "把故事译成动作顺序清楚、指代一致的英语，不逐字堆动词。",
      blocks: [
        { type: "heading", text: "一、找到人物、动作和结果" },
        { type: "paragraph", text: "先把故事拆成谁做了什么、为什么、结果怎样。主线通常用一般过去时；故事表达的普遍道理可用现在时，不必把所有句子硬改成过去完成时。" },
        { type: "heading", text: "二、用连接交代先后与转折" },
        { type: "bullets", items: ["先发生、后发生可用 after、when、then，但时间已经明确时不必每句加连接词。", "每个独立句确定主语和谓语；多个动作分句或并列，别照搬中文逗号。", "he / she / it 应有明确所指；两个人物容易混淆时重复名词。"] },
        { type: "heading", text: "三、成语先传意" },
        { type: "paragraph", text: "专名可保留拼音并简释；寓意用普通英文说明即可。不要在记不起固定英文成语时停住，也不要为了凑俗语改变原意。" }
      ],
      advancedBlocks: [{ type: "paragraph", text: "拔高：只有需要强调过去某时之前已经完成的动作，才使用过去完成时；简洁不等于信息省略。" }]
    },
    retellTask: "如何安排故事的动作、时态、人物指代和寓意？",
    rubricPoints: [point("p1", "保留人物、行动、原因和结果，按叙事顺序组织。", ["人物", "行动", "原因", "结果"]), point("p2", "过去事件与普遍道理的时态分清，连接及指代一致。", ["过去", "道理", "连接", "指代"]), point("p3", "寓意优先准确传达，不生造英文成语或漏译信息。", ["寓意", "准确", "成语", "漏译"])],
    commonMistakes: ["故事每句都用现在时。", "几个动作只靠逗号拼起来。", "为套英文俗语改变寓意。"],
    modelAnswer: "我先列出人物、动作、原因和结果，再按顺序分句。过去事件主要用过去时，道理可用现在时，人物多时明确代词所指。成语记不住也可以用普通英语解释，不改动寓意或遗漏情节。",
    productionTasks: [task("t6-t1", "原创短段训练，非传统寓言真题：一名学徒为了尽快完成木椅，省去了检查连接处的步骤。第二天，椅子在测试时松开了。师傅没有替他重做，而是让他找出问题并逐一修好。这件事使他明白，节省时间不能以忽视质量为代价。", "动作顺序、过去时、人物指代和寓意。", "To finish a wooden chair quickly, an apprentice skipped the step of checking its joints. The next day, the chair came loose during a test. Instead of making it again for him, his teacher asked him to identify the problems and fix them one by one. The experience taught him that saving time should not come at the expense of quality.", ["skipped、came、asked 构成过去事件链。", "his teacher 明确主体，代词均能回指。", "结尾传达质量不能牺牲，不额外添加惩罚。"])]
  },
  {
    id: "t7", title: "翻译·主语重建与段落衔接", category: "translation",
    microLesson: {
      goal: "处理中文无主语、长修饰和流水句，保全信息并写出完整英文句子。",
      blocks: [
        { type: "heading", text: "一、先找主干，不逐字排队" },
        { type: "paragraph", text: "中文可能省略主语，英语需根据上下文恢复，如该项目、当地居民或有关部门。原文没说是谁且动作对象更重要时，可用被动；不要随意加 we 或 the government。" },
        { type: "heading", text: "二、拆分长修饰与流水句" },
        { type: "bullets", items: ["圈出每个信息点，再决定分句、并列或从句，所有信息都有落点。", "长定语放到主干后解释，先保证谁是什么、做了什么。", "出现因果、转折、递进时用相应连接，没写因果就不要擅自加 therefore。"] },
        { type: "heading", text: "三、做段落级核对" },
        { type: "paragraph", text: "同一对象称呼保持一致，代词有清楚先行词。核对时态、主谓一致、冠词、单复数及专名；参考译文仅是一种表达，意思完整且语言正确的改写也可以。" },
        { type: "tip", text: "完成复述只说明能解释方法；还要独立翻译新段落并核对信息，才知道是否能用出来。" }
      ],
      advancedBlocks: [{ type: "paragraph", text: "拔高：信息准确之后再尝试非谓语、同位语或名词化压缩，不把复杂程度当成评分捷径。" }]
    },
    retellTask: "中文省略主语或一逗到底时，怎样译成完整、连贯且不增删信息的英文？",
    rubricPoints: [point("p1", "逐项保全信息，根据上下文补主语或合理用被动，不臆造主体。", ["信息", "主语", "被动", "不臆造"]), point("p2", "先定主干，再拆长修饰和流水句，忠实表达逻辑关系。", ["主干", "修饰", "拆句", "逻辑"]), point("p3", "统一指代和术语，回查语法及遗漏，不要求逐字一致。", ["指代", "术语", "语法", "遗漏"])],
    commonMistakes: ["所有无主句都加 we。", "并列事实强行翻成因果。", "句子顺了但漏掉一半修饰信息。"],
    modelAnswer: "先列信息点，确定每句主干。省略的主语从上下文恢复，不明确又不重要的施事可用被动。长修饰分开表达，因果转折忠实于原文，最后检查指代、术语、语法和遗漏，不必与参考答案逐字相同。",
    productionTasks: [task("t7-t1", "原创短段训练：社区旧仓库最近被改成了阅览室。室内设置了儿童阅读区和安静自习区，每周末还举办免费的故事分享活动。居民可以在入口处登记后借书。这个空间既保留了旧建筑的特色，也为附近家庭提供了交流的场所。", "省略主语、被动、并列及指代。", "An old warehouse in the community has recently been converted into a reading room. It has a children's reading area and a quiet study area, and free storytelling sessions are held there every weekend. Residents can borrow books after registering at the entrance. The space preserves the character of the old building while also providing a place for local families to meet.", ["首句被动不臆造改建者。", "每周末、免费、登记后等信息完整。", "while also 表示兼具两种作用，不生造因果。"])]
  }
];
