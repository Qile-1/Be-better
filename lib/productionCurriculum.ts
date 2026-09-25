import type { Lesson, MicroBlock, ProductionTask, RubricPoint } from "./types";

function task(id: string, prompt: string, focus: string, reference: string, analysis: string[]): ProductionTask {
  return { id, prompt, focus, reference, analysis };
}

function point(id: string, text: string, keyPhrases: string[], tier: RubricPoint["tier"] = "core"): RubricPoint {
  return { id, point: text, keyPhrases, tier, mustCover: tier === "core" };
}

function writingLesson(id: string, title: string, goal: string, blocks: MicroBlock[], retellTask: string, rubricPoints: RubricPoint[], commonMistakes: string[], modelAnswer: string, productionTasks: ProductionTask[]): Lesson {
  return {
    id, title, category: "writing",
    microLesson: {
      goal,
      blocks: [
        { type: "tip", text: "真题风格原创练习。正式四级写作通常要求 120—180 词；先审任务，再列提纲，最后留 3 分钟检查。" },
        ...blocks
      ],
      advancedBlocks: [
        { type: "heading", text: "拔高：从能写到写得有说服力" },
        { type: "bullets", items: ["每段只服务一个中心句，例子具体到人物、场景或结果。", "连接词只在逻辑需要时使用；优先写准确的简单句，再尝试定语从句或让步句。", "检查主谓一致、时态、冠词、单复数，以及题目要求的体裁和词数。"] }
      ]
    },
    retellTask, rubricPoints, commonMistakes, modelAnswer, productionTasks
  };
}

function translationLesson(id: string, title: string, goal: string, blocks: MicroBlock[], retellTask: string, rubricPoints: RubricPoint[], commonMistakes: string[], modelAnswer: string, productionTasks: ProductionTask[]): Lesson {
  return {
    id, title, category: "translation",
    microLesson: {
      goal,
      blocks: [
        { type: "tip", text: "真题风格原创段落。先保全信息，再调成自然英语；参考译文只是一种可行表达，不是唯一答案。" },
        ...blocks
      ],
      advancedBlocks: [
        { type: "heading", text: "拔高：一句多译" },
        { type: "paragraph", text: "译完先核对信息是否完整、关系是否清楚；同一个中文短语可用不同英文结构表达，不必逐字对号入座。再检查时态、主谓一致、冠词和专有名词。" }
      ]
    },
    retellTask, rubricPoints, commonMistakes, modelAnswer, productionTasks
  };
}

// 参照近年公开试卷的任务形式和题材重新编写；不收录真题原文或官方范文。
export const PRODUCTION_LESSONS: Lesson[] = [
  writingLesson(
    "w1", "写作·校园建议与活动信", "读懂写给谁、为什么写、希望对方做什么，并写出有细节的校园建议或邀请。",
    [
      { type: "heading", text: "一、审题先圈三件事" },
      { type: "bullets", items: ["身份与对象：学生代表写给谁？语气要礼貌。", "写作目的：建议、邀请还是通知？开头一句就点明。", "必答信息：时间地点、问题与措施、期待回应等，不可漏掉。"] },
      { type: "heading", text: "二、三段就够" },
      { type: "paragraph", text: "开头交代目的；主体给两条可执行的建议或活动安排，并各说一个理由；结尾写预期效果和礼貌请求。建议句可用 I suggest that...；邀请可用 We would be delighted if...。" },
      { type: "example", title: "原创示例：图书馆座位", question: "学校想改善自习环境。不要只写 The library should be better；你会给什么具体建议？", analysis: "可写 Extend the quiet area on the second floor and display real-time seat availability. 前者有地点和动作，后者能说明学生找座位更省时。" }
    ],
    "请向同学解释：写校园建议或邀请信时，怎样审清对象和目的、安排三段内容，并让建议具体可执行？",
    [point("p1", "先确定写给谁、写作目的和题目要求的信息。", ["对象", "目的", "信息", "审题"]), point("p2", "开头说明目的，主体给具体安排或建议及理由，结尾提出期待。", ["开头", "主体", "结尾", "理由"]), point("p3", "语气礼貌，建议要有具体动作和场景。", ["礼貌", "具体", "动作", "场景"]), point("p4", "检查格式、词数和遗漏信息。", ["格式", "词数", "检查"], "bonus")],
    ["只写空泛好处，没有可执行措施。", "把邀请写成议论文，漏了活动时间或对象。", "结尾没有明确请求。"],
    "先圈出身份、对象、目的和必答点。开头一句说明来意，主体写两项具体措施或活动安排，并解释理由，结尾礼貌地提出回应请求。写完检查体裁、词数及时间地点等信息。",
    [
      task("w1-t1", "你是学生代表。写信建议学校图书馆改善期末复习服务，提出两项措施及理由。写 120—180 词。", "建议要能执行，语气礼貌。", "Dear Librarian,\nI am writing on behalf of several students to suggest two changes to the library during the final examination period. First, could the reading rooms stay open for one extra hour in the evening? Many students finish classes late and have little quiet time to study. Second, a simple online page showing available seats would save us from walking through crowded rooms. It could also reduce noise because students would not need to search for seats in person. These changes would make the library more useful without requiring a complete redesign. If extending all rooms is difficult, a trial in one area would be a good start. Thank you for considering our suggestions. We would be glad to help collect feedback after the trial.\nYours sincerely,\nA Student Representative", ["开头交代身份与目的。", "两项措施均有操作细节和理由。", "结尾提出试行与反馈，语气得体。"]),
      task("w1-t2", "你负责组织校友职业分享会。写一封邀请邮件，说明活动形式、两项希望校友分享的内容和回复方式。写 120—180 词。", "邀请信要有时间、形式、分享内容、回应请求。", "Dear Alumni,\nOur class is planning an online career talk next Friday evening, and I am writing to invite you to speak with current students. Many of us are preparing for internships and would value practical advice from graduates. We hope you could share how you found your first opportunity and which skills you use most often at work. A short example of a challenge you faced would also help us understand what a new employee can expect. The talk will last about forty minutes, followed by a question-and-answer session. You may join from anywhere, and we will send the meeting link in advance. If you are available, please reply to this email by Monday and let us know which topic you would like to discuss. We would be grateful for your time.\nBest regards,\nThe Class Organizer", ["交代对象、时间、形式。", "分享内容具体。", "回复方式清楚。"]),
      task("w1-t3", "学校计划开设校园二手物品交换角。写邮件给学生会，提出组织办法、好处与一项可能问题的解决方法。写 120—180 词。", "兼顾方案、理由和风险处理。", "Dear Student Union,\nI am writing to support the proposed campus exchange corner and suggest a simple way to run it. Students could bring clean books and small household items to a supervised room once a week. Volunteers would label each item and help visitors record exchanges. This would give useful objects a second life and help students save money, especially at the beginning of a new term. One possible problem is that damaged items might disappoint visitors. To address it, volunteers could check the condition of each item before it is displayed and post clear rules at the entrance. The project could start as a one-month trial, after which the union could ask students for feedback. I believe a small, well-managed exchange corner would make campus life both more affordable and more sustainable.\nYours sincerely,\nA Student", ["有明确运作办法。", "好处与场景对应。", "指出问题并给出解决步骤。"])
    ]
  ),
  writingLesson(
    "w2", "写作·科技与学习观点", "对科技或学习方式提出清晰观点，并用例子与边界条件支撑。",
    [
      { type: "heading", text: "一、观点要能回答题目" },
      { type: "paragraph", text: "题目问技术有没有帮助时，不要只列优缺点。先写立场：有帮助，但需主动管理使用方式；或益处大于风险，并说明条件。" },
      { type: "heading", text: "二、用“主张—例子—解释”写主体" },
      { type: "bullets", items: ["主张：技术能提供及时反馈。", "例子：学生用词典检查发音，再录音比较。", "解释：重复反馈帮助发现错误，而不是只节省时间。"] },
      { type: "example", title: "原创示例：避免空泛", question: "把 Technology is good for students 改成有边界的论点。", analysis: "Online tools can support independent learning when students use them to check their work rather than copy ready-made answers. 后半句给出使用边界。" }
    ],
    "请讲给同学听：科技类观点作文如何先表态，再用具体例子和解释支撑，同时承认适用边界？",
    [point("p1", "审题后给出清晰立场，不只罗列优缺点。", ["审题", "立场", "观点"]), point("p2", "主体采用主张、具体例子、解释的结构。", ["主张", "例子", "解释"]), point("p3", "指出科技使用的条件或风险，结尾回应立场。", ["条件", "风险", "结尾", "回应"]), point("p4", "避免笼统断言与模板堆砌。", ["笼统", "模板", "具体"], "bonus")],
    ["只喊 technology is important，没有例子。", "首段和结尾观点相反。", "把风险写成与题目无关的常识。"],
    "我先回答题目，明确技术在什么条件下有帮助。主体每段写一个主张、一个具体场景，再解释这个场景怎样支持观点。也会承认风险并给出使用边界，最后回到中心立场。",
    [
      task("w2-t1", "围绕“在线工具能否帮助大学生独立学习”写 120—180 词，给出观点、例子与使用边界。", "要区分帮助学习与代替思考。", "Online tools can help university students learn independently, but only when they are used as guides rather than substitutes for thinking. For example, a student learning English may record a short speech and use an app to identify unclear words. By comparing the recording with a model, the student can notice mistakes and practise again. This process develops awareness and confidence. Online courses also allow students to review difficult topics at their own pace. However, copying an answer generated by a tool may save time while leaving the underlying problem unsolved. Students should therefore try a task first, use technology for feedback, and then explain the answer in their own words. In this way, digital tools can support real learning instead of hiding gaps in understanding.", ["首句有立场与条件。", "例子展示学习过程。", "风险之后给出可执行边界。"]),
      task("w2-t2", "校园计划用 AI 工具辅助课程作业。写一篇短文，讨论一项优势、一项风险及你的建议。写 120—180 词。", "建议应具体到学生怎样使用工具。", "Artificial intelligence can be a useful study partner, provided that students remain responsible for their own work. One advantage is immediate feedback. A student can ask a tool to explain why a sentence is unclear and then revise it independently. This can make practice more efficient, especially outside class hours. Yet there is a risk: if students submit machine-generated work as their own, teachers cannot see what they have actually learned. The students themselves also miss the chance to think through a problem. I suggest that courses allow AI for brainstorming and revision but require students to keep an early draft and briefly explain their final choices. Such a rule encourages honest use while preserving the main purpose of an assignment: learning to think and communicate.", ["优势和风险分别展开。", "建议含早期草稿与解释机制。", "结尾回应责任主体。"]),
      task("w2-t3", "写一篇短文讨论手机是否应该在自习时保持静音并远离桌面。给出立场、具体场景与可行做法。写 120—180 词。", "避免绝对化；讨论学习场景。", "Keeping a phone silent and away from the desk is a sensible choice during focused study. Many students intend to check only one message, but the interruption can make it difficult to return to a complex reading task. In a quiet library, even a short sound may disturb others. Putting the phone in a bag for a planned forty-minute session creates a clear boundary and makes concentration easier. This does not mean that students must give up their phones completely. They can check important messages during a short break, and those who expect an urgent call can choose a vibration setting. The aim is to manage attention, not to reject technology. A small change in where the phone sits can make a study period more effective for both the student and the people nearby.", ["立场清晰。", "例子说明注意力成本。", "给出例外和可实行的休息安排。"])
    ]
  ),
  writingLesson(
    "w3", "写作·个人成长与健康习惯", "把成长或健康话题写成有因果、有经历、有行动建议的短文。",
    [
      { type: "heading", text: "一、从抽象词落到日常行为" },
      { type: "paragraph", text: "题目若问坚持、时间管理或健康生活，不要反复写 important。先定义你要谈的具体行为，再说明它带来的结果。" },
      { type: "heading", text: "二、组织因果链" },
      { type: "bullets", items: ["选择一种行动，如每周运动三次。", "给出一个身边例子，而非编造统计数字。", "说明为什么行动会改善学习或生活，再提出可开始的小步骤。"] },
      { type: "example", title: "原创示例：计划", question: "“时间管理有用”如何写成可证实的段落？", analysis: "A student who reviews vocabulary for fifteen minutes after breakfast is more likely to keep the habit than one who waits for a free afternoon. 例子体现频率、时间与行动。" }
    ],
    "请说明成长类作文怎样把抽象主题变成具体行为、因果链与可执行建议。",
    [point("p1", "把抽象主题落到具体行为或场景。", ["具体", "行为", "场景"]), point("p2", "用例子和因果解释支持观点。", ["例子", "因果", "解释"]), point("p3", "给出可开始的行动建议并回扣主题。", ["建议", "行动", "主题"]), point("p4", "不编造数据，不夸大效果。", ["数据", "夸大", "准确"], "bonus")],
    ["全篇重复 important、good 等空词。", "例子与结论没有因果连接。", "建议太大，无法执行。"],
    "我会先把成长或健康主题缩小成一项可观察的行为，再用身边例子解释行为如何产生结果，最后给一个能从今天开始的小建议。避免编造数字和夸大成效。",
    [
      task("w3-t1", "写一篇短文谈大学生建立规律作息的价值，提出两项容易开始的做法。写 120—180 词。", "用具体行动解释健康与学习的关系。", "A regular daily routine can make university life healthier and less stressful. When students go to bed at very different times, they often feel tired in morning classes and find it harder to concentrate. A stable schedule does not require a perfect timetable. One useful step is to choose a fixed time to stop using screens at night. Another is to prepare a short list of the next day's tasks before going to bed. These small actions reduce last-minute decisions and make it easier to start work in the morning. Students should also leave room for social activities and unexpected changes; a routine needs to be realistic to last. By improving one habit at a time, we can protect our energy and study more effectively.", ["论点对应规律作息。", "两项措施具体。", "说明可持续性，而非追求完美。"]),
      task("w3-t2", "写一篇短文谈失败经历如何帮助学生成长，举一个具体但不必真实署名的例子。写 120—180 词。", "例子要展示反思与下一次行动。", "Failure can be useful when it leads to careful reflection rather than simple self-blame. Imagine a student who gives an unclear presentation and receives several questions from classmates. Instead of deciding that public speaking is impossible, the student asks which part was confusing. She then shortens her slides, practises the opening aloud, and invites a friend to listen before the next presentation. The first disappointing result has now become information for improvement. This does not mean that failure is pleasant or that every mistake has an easy solution. It means we can respond to it with a specific plan. The same approach can help with exams, group projects, and other ordinary challenges at university. By identifying one problem and testing one change, students gradually build both skill and confidence.", ["例子有问题、反思、改进。", "不过度美化失败。", "结尾归纳可迁移方法。"]),
      task("w3-t3", "围绕“每天进行短时运动是否比偶尔高强度运动更适合忙碌学生”写 120—180 词。", "比较两种做法并给出适用条件。", "For busy students, short daily exercise is often easier to maintain than an occasional demanding workout. A fifteen-minute walk after class may not seem impressive, but it gives students a regular break from sitting and helps them clear their minds. Because the goal is manageable, they are less likely to skip it during examination weeks. Longer workouts can still be valuable, especially for students who enjoy sport and have enough time to recover. However, a difficult plan that is repeatedly postponed does little good. I would encourage students to begin with a simple daily activity and increase the amount gradually if they wish. The best routine is not the hardest one; it is the one students can safely continue over time.", ["有明确比较标准。", "承认高强度运动的适用场景。", "建议从可持续的小步骤开始。"])
    ]
  ),
  writingLesson(
    "w4", "写作·社会责任与文化活动", "在志愿、环保和文化活动话题中，说明行动、受益者与实际影响。",
    [
      { type: "heading", text: "一、说清谁做、为谁做" },
      { type: "paragraph", text: "社会话题常容易写成口号。选一个明确对象，如新生、社区老人或校外访客；再写行动和可观察结果。" },
      { type: "heading", text: "二、写出活动方案与影响" },
      { type: "bullets", items: ["活动前：确定对象、地点、分工。", "活动中：用一两个具体动作体现参与。", "活动后：说明对参与者与受益者的意义，并承认资源限制。"] },
      { type: "example", title: "原创示例：文化开放日", question: "为什么“举办文化活动很好”太空？", analysis: "Students could guide visitors through a small exhibition and explain the stories behind local crafts. 这句话说出了谁、做什么、向谁解释什么。" }
    ],
    "请向同学解释社会责任类作文如何选对象、写行动、说明影响，并避免口号化。",
    [point("p1", "明确行动者、受益对象和写作目的。", ["行动者", "对象", "目的"]), point("p2", "用活动前、中、后的具体安排展开。", ["安排", "具体", "活动"]), point("p3", "解释行动怎样产生实际影响。", ["影响", "结果", "意义"]), point("p4", "避免空喊口号并注意资源限制。", ["口号", "限制", "可行"], "bonus")],
    ["只写 everyone should help，没有受益对象。", "安排不清，效果无法对应。", "用未经证实的宏大结论替代具体影响。"],
    "先确定谁来做、为谁做，再按准备、实施和反馈写两三项具体行动。最后解释受益者实际得到什么，也检查方案是否在时间和资源上可行。",
    [
      task("w4-t1", "学校计划组织学生志愿者帮助新生熟悉校园。写一篇短文说明两项活动安排及其意义。写 120—180 词。", "受益对象为新生，安排要具体。", "A student volunteer programme can help new students feel at home on campus. Before the new term begins, volunteers could prepare a simple map showing classrooms, the library, health services and places to ask for help. During the first week, they could lead small walking groups and answer practical questions about schedules and campus rules. These activities would save newcomers time and reduce the anxiety of finding their way alone. Volunteers would benefit too: explaining familiar places to others helps them become more patient and responsible. The programme need not be large. If each volunteer guides one small group, the school can offer useful support without creating a heavy burden. A friendly welcome can make the beginning of university life easier for everyone involved.", ["两项安排都有实施时间。", "同时说明新生和志愿者的收获。", "考虑活动规模。"]),
      task("w4-t2", "写一篇短文建议校园举办低浪费文化节，说明一项文化活动、一项环保措施及效果。写 120—180 词。", "文化活动与环保措施都不可漏。", "Our campus culture festival could celebrate local traditions while producing less waste. One activity would be a student-led exhibition of traditional crafts. Visitors could learn the stories behind each object and try a short hands-on demonstration. To reduce waste, organisers could use reusable signs and ask food stalls to offer discounts to students who bring their own cups. This measure would be easy to explain at the entrance and simple for visitors to follow. A festival should be enjoyable, but it can also show that cultural learning and everyday environmental choices belong together. After the event, volunteers could count how many disposable cups were avoided and collect suggestions for the next year. Small, visible actions would make the idea more persuasive than a slogan alone.", ["两项任务分别展开。", "效果有可观察的方式。", "结尾避免空泛口号。"]),
      task("w4-t3", "社区图书馆邀请大学生为老人开设手机使用小课堂。写短文讨论怎样组织，以及双方能获得什么。写 120—180 词。", "考虑老年学习者的节奏和需求。", "University students could organise a small phone skills class at the community library. Before the class, volunteers should ask older residents which tasks they want to learn, such as making a video call or finding a bus route. During each session, one volunteer could guide only a few learners and let them repeat the steps on their own phones. A printed card with clear instructions would help them practise later. Participants would gain confidence in using useful services, while students would learn to explain ideas patiently and listen to different needs. The class should avoid complicated apps and should never ask learners to share passwords. By focusing on everyday tasks and giving time for practice, a simple programme can make technology more accessible and strengthen connections between generations.", ["先调查需求。", "组织方式具体且考虑隐私。", "双方收获清楚。"])
    ]
  ),
  translationLesson(
    "t1", "翻译·传统节日与民俗", "把节日时间、习俗和文化意义译成自然连贯的英文段落。",
    [
      { type: "heading", text: "一、先找信息骨架" },
      { type: "paragraph", text: "按“节日是什么—人们做什么—为什么重要”拆句。名称可用通行译名；不熟悉的民俗可先用英文解释，不要凭空造词。" },
      { type: "heading", text: "二、处理时间和目的" },
      { type: "bullets", items: ["“在……期间”可用 during / at。", "“为了表达……”可用 to express 或 as a way to express。", "多个动作可以分句，避免一口气堆多个 and。"] },
      { type: "example", title: "原创示例", question: "“节日期间，家人一起准备食物，表达对团聚的珍视。”如何拆译？", analysis: "During the festival, family members prepare food together. The shared activity shows how much they value reunion. 先动作后意义，逻辑清楚。" }
    ],
    "请讲清如何把节日段落拆为背景、习俗和意义，并处理时间、目的与文化词。",
    [point("p1", "先找节日背景、具体习俗、文化意义。", ["背景", "习俗", "意义"]), point("p2", "文化词采用通行译法或简明解释，不硬造词。", ["通行", "解释", "文化词"]), point("p3", "用时间和目的关系连接信息，必要时分句。", ["时间", "目的", "分句"]), point("p4", "译后检查动作主体和信息遗漏。", ["主体", "遗漏", "检查"], "bonus")],
    ["逐字翻译文化词导致读者不懂。", "漏掉习俗背后的意义。", "长句堆砌造成主语混乱。"],
    "我先标出节日背景、习俗动作和文化意义。文化词优先用通行译名，不确定时用简短解释。再用 during、to express 等连接时间和目的，长句可拆开，最后核对信息是否完整。",
    [
      task("t1-t1", "将下面原创段落译成英文：春节前，许多家庭会一起打扫房屋、准备年夜饭。对他们来说，这些活动不只是节日安排，也是迎接新一年、与家人相聚的方式。", "保留“不只是……也是……”关系。", "Before the Spring Festival, many families clean their homes and prepare a reunion dinner together. For them, these activities are not merely holiday arrangements; they are also a way to welcome the new year and spend time with family.", ["春节可译为 the Spring Festival。", "年夜饭用 reunion dinner 自然表达。", "not merely...also 保留递进关系。"]),
      task("t1-t2", "将下面原创段落译成英文：端午节时，一些地方会举行龙舟比赛。人们在河边观看比赛，鼓励队员。这样的活动让年轻人有机会了解节日传统，也加强了社区之间的联系。", "区分观看者与参赛队员。", "During the Dragon Boat Festival, some places hold dragon boat races. People watch from the riverbank and cheer for the teams. Such events give young people a chance to learn about the festival's traditions and strengthen ties within the community.", ["时间状语置前。", "cheer for 表达鼓励队员。", "最后一句兼顾学习与社区联系。"]),
      task("t1-t3", "将下面原创段落译成英文：中秋节常与赏月和家人团聚联系在一起。即使亲人住在不同城市，他们也会通过电话分享节日祝福。对很多人而言，团聚不仅意味着见面，也意味着彼此惦念。", "处理 even if 与 not only...but also。", "The Mid-Autumn Festival is often associated with enjoying the full moon and family reunions. Even if relatives live in different cities, they share holiday wishes by phone. For many people, reunion means not only meeting in person but also caring for one another.", ["节日名采用通行写法。", "even if 保留让步。", "团聚的延伸含义表达自然。"])
    ]
  ),
  translationLesson(
    "t2", "翻译·饮食、茶与传统技艺", "解释食物、茶和手工艺的制作、用途与传承，避免生硬直译。",
    [
      { type: "heading", text: "一、文化词先解释后补充" },
      { type: "paragraph", text: "读者未必知道某种食物或技艺。先用类别词如 tea、pastry、craft 告诉读者“它是什么”，再补充当地名称或做法。" },
      { type: "heading", text: "二、把中文并列动作译成英文顺序" },
      { type: "bullets", items: ["制作步骤用 first、then，或分成短句。", "用途与意义用 which、so that 或独立句表达。", "避免 every、all 等原文没有的绝对词。"] },
      { type: "example", title: "原创示例", question: "“师傅把竹条编成篮子，既实用又美观。”怎样译？", analysis: "Craftspeople weave bamboo strips into baskets that are both useful and attractive. 先写动作，再描述成品。" }
    ],
    "请向同学解释如何处理不熟悉的文化词、制作步骤和用途意义。",
    [point("p1", "文化词先用类别或简短解释让读者理解。", ["类别", "解释", "文化词"]), point("p2", "把制作动作按顺序清楚表达。", ["顺序", "动作", "步骤"]), point("p3", "保留用途和文化意义，不添加原文没有的事实。", ["用途", "意义", "添加"]), point("p4", "注意名词单复数与搭配。", ["单复数", "搭配"], "bonus")],
    ["只音译不解释，读者无法理解。", "步骤顺序混乱。", "为了句子好看添加不真实信息。"],
    "先判断文化词属于什么类别，用常见英文词或短解释引入。按实际顺序译制作动作，再说明用途或意义，不擅自添加事实，最后核对搭配和单复数。",
    [
      task("t2-t1", "将下面原创段落译成英文：在一些地区，茶不仅是一种饮品，也是一种待客方式。主人会先为客人倒茶，再与他们聊天。简单的饮茶过程让人们有机会放慢节奏、分享近况。", "保留“先……再……”的顺序。", "In some regions, tea is not only a drink but also a way of welcoming guests. Hosts serve tea first and then talk with their visitors. This simple custom gives people a chance to slow down and share recent news.", ["not only...but also 对应双重作用。", "serve tea 比 pour tea 更适合待客语境。", "末句表达过程的社交意义。"]),
      task("t2-t2", "将下面原创段落译成英文：一位手艺人把竹子切成细条，再编成结实的篮子。这样的篮子可以反复使用。如今，越来越多的年轻人通过工作坊学习这门手艺。", "动作主体、顺序和传承三点不可漏。", "A craftsperson cuts bamboo into thin strips and then weaves them into strong baskets. These baskets can be used again and again. Today, more young people are learning the craft through workshops.", ["craftsperson 用中性职业名词。", "them 指代竹条。", "最后一句说明学习方式。"]),
      task("t2-t3", "将下面原创段落译成英文：一种当地小吃用米粉和蔬菜制成，通常在早晨供应。游客喜欢它的味道，但许多居民更珍视它带来的童年回忆。因此，这种食物也是当地生活的一部分。", "区分游客与居民的不同视角。", "A local snack is made from rice flour and vegetables and is usually served in the morning. Visitors enjoy its taste, but many residents value the childhood memories it brings even more. For this reason, the food is also part of local life.", ["is made from 表示原料。", "but 对照游客与居民。", "For this reason 连接结论。"])
    ]
  ),
  translationLesson(
    "t3", "翻译·风景名胜与城市空间", "准确表达地点、历史、游客体验和空间变化。",
    [
      { type: "heading", text: "一、地点介绍按空间组织" },
      { type: "paragraph", text: "先说在哪里，再说有什么，最后说人们如何使用或感受。不要把“位于、建于、吸引游客”全部挤进一个长句。" },
      { type: "heading", text: "二、分清事实与评价" },
      { type: "bullets", items: ["“位于”用 be located in / lie in。", "“吸引游客”用 attract visitors。", "数字、年代、方位若未给出，不要自行补充。"] },
      { type: "example", title: "原创示例", question: "“公园位于市中心，旧厂房改成了展厅。”怎样保持清楚？", analysis: "The park is located in the city centre. Former factory buildings have been turned into exhibition halls. 拆成两句，分别交代位置与变化。" }
    ],
    "请讲解地点介绍的三个层次，以及如何拆分长句、避免添加未经给出的数据。",
    [point("p1", "按位置、特点、体验或作用组织段落。", ["位置", "特点", "体验", "作用"]), point("p2", "长句可拆开，区分地点事实和评价。", ["拆句", "事实", "评价"]), point("p3", "准确表达变化、吸引游客等常见结构。", ["变化", "游客", "attract"]), point("p4", "不虚构年代、规模或排名。", ["年代", "规模", "虚构"], "bonus")],
    ["多个地点信息挤成无主语长句。", "把曾经和现在的状态混淆。", "补上原文不存在的排名、年代。"],
    "地点段落先译位置，再译特色，最后译人们的活动和感受。复杂句可以拆开，用 be located in、attract visitors 等自然表达，且不添加原文没有的数字或评价。",
    [
      task("t3-t1", "将下面原创段落译成英文：这座城市在旧火车站旁建了一座小公园。公园里保留了部分铁轨，并设置了介绍当地交通历史的展板。居民来这里散步，游客也能了解城市过去的样子。", "保留旧设施与新用途的关系。", "The city has built a small park beside the old railway station. Part of the tracks have been preserved, and displays introduce the history of local transport. Residents come here for walks, while visitors can learn what the city was like in the past.", ["beside 表示相邻。", "have been preserved 表示保留至今。", "while 对比居民与游客用途。"]),
      task("t3-t2", "将下面原创段落译成英文：这片湖区位于群山之间，以清晨的景色闻名。沿湖步道让游客能够近距离观察植物，同时减少他们对湖岸的影响。当地人希望在开放旅游的同时保护自然环境。", "处理 while/at the same time 的平衡关系。", "The lake area lies among the mountains and is known for its scenery in the early morning. A path along the lake allows visitors to observe plants closely while reducing their impact on the shore. Local people hope to protect the natural environment as they welcome tourists.", ["位置与特色先行。", "while 连接体验和保护。", "末句保持发展与保护的平衡。"]),
      task("t3-t3", "将下面原创段落译成英文：一条老街经过修缮后重新开放。街上的店铺保留了传统外观，也开始销售本地设计师的作品。游客可以在这里看到历史建筑如何融入今天的城市生活。", "避免将“修缮”误译为拆除重建。", "An old street has reopened after renovation. Its shops have kept their traditional appearance and now sell works by local designers. Visitors can see how historic buildings fit into city life today.", ["renovation 是修缮。", "have kept 强调传统外观仍在。", "fit into 表达融入。"])
    ]
  ),
  translationLesson(
    "t4", "翻译·社会发展与生态行动", "把中国社会变化、公共服务和环保行动译成有因果的英语。",
    [
      { type: "heading", text: "一、先标逻辑词" },
      { type: "paragraph", text: "中文常并列叙述，英文需要看清“原因—措施—结果”。先标出因为、为了、随着、因此等关系，再决定是否用 because、to、as、therefore。" },
      { type: "heading", text: "二、找清动作主体" },
      { type: "bullets", items: ["谁建设或改善？城市、社区、机构还是居民？", "“越来越多”可用 more and more，但不要每句重复。", "政策与设施用清楚的普通词表达，不为显高级而误译。"] },
      { type: "example", title: "原创示例", question: "“社区增加回收点，方便居民分类投放。”怎样译出目的？", analysis: "The community has added more recycling stations to make it easier for residents to sort their waste. to make... 表示目的。" }
    ],
    "请向同学说明如何找出社会发展类段落的主体、措施与因果关系，并用自然英语表达。",
    [point("p1", "找出原因、措施、结果等逻辑关系。", ["原因", "措施", "结果", "逻辑"]), point("p2", "明确每个动作的主体。", ["主体", "谁", "动作"]), point("p3", "用自然英语表达目的和变化，不逐字硬译。", ["目的", "变化", "自然"]), point("p4", "检查时态及信息是否完整。", ["时态", "完整", "检查"], "bonus")],
    ["省略实施者导致无主句。", "混淆措施与结果。", "同一个连接词机械重复。"],
    "我先标出谁在做什么，以及原因、措施和结果。译文用清楚的主语和目的结构连接信息，必要时拆句，最后检查时态和内容是否遗漏。",
    [
      task("t4-t1", "将下面原创段落译成英文：为鼓励绿色出行，这座城市增加了自行车道，并在地铁站附近设置停车点。越来越多的居民选择骑车完成短途出行。城市仍在收集意见，以改进道路安全。", "保留目的、措施、结果与后续行动。", "To encourage greener travel, the city has added bicycle lanes and set up parking areas near metro stations. More residents are choosing to cycle for short trips. The city is still collecting feedback to improve road safety.", ["To encourage 表目的。", "两项措施并列。", "最后一句表持续改进。"]),
      task("t4-t2", "将下面原创段落译成英文：一些社区开设共享阅读室，居民可以免费借阅图书。志愿者定期整理书架，并举办面向儿童的故事活动。阅读室不仅提供书籍，也让邻居有机会相互认识。", "译出公共服务及社交作用。", "Some communities have opened shared reading rooms where residents can borrow books for free. Volunteers organise the shelves regularly and hold story sessions for children. The rooms provide not only books but also opportunities for neighbours to get to know one another.", ["where 引出地点功能。", "志愿者为第二句主语。", "not only...but also 保留双重作用。"]),
      task("t4-t3", "将下面原创段落译成英文：近年来，越来越多的学校关注食物浪费问题。食堂通过提供不同份量的餐食，帮助学生按需要选择。学生组织也举办活动，提醒大家珍惜食物并记录改进建议。", "注意“近年来”与两个行动主体。", "In recent years, more schools have paid attention to food waste. Cafeterias help students choose what they need by offering meals in different portion sizes. Student groups also organise activities to raise awareness of food waste and record suggestions for improvement.", ["现在完成时呼应近年来。", "by offering 表达方式。", "学校、食堂、学生组织三种主体清楚。"])
    ]
  )
];
