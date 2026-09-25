import { EXISTING_LESSON_ENRICHMENTS, EXTRA_LESSONS } from "./curriculum";
import type { Lesson } from "./types";

const BASE_LESSONS: Lesson[] = [
  {
    id: "l1",
    title: "仔细阅读·主旨大意题",
    keyWords: [],
    microLesson: {
      goal: "学完这节课，你能在 1 分钟内认出主旨大意题，快速在文章里定位主旨，并排除三类常见干扰项。",
      blocks: [
        {
          type: "heading",
          text: "一、先认出它：主旨题长什么样"
        },
        {
          type: "paragraph",
          text: "主旨题不问某个细节，它问的是整篇文章主要在讲什么、作者为什么写这篇文章、最好的标题是什么。"
        },
        {
          type: "bullets",
          items: [
            "The passage is mainly about ___.",
            "What is the main idea of the passage?",
            "The author's purpose in writing the passage is ___.",
            "Which of the following could be the best title?"
          ]
        },
        {
          type: "tip",
          text: "题干里出现 mainly about、main idea、purpose、best title、primarily、chiefly 这类词，基本就是主旨题。"
        },
        {
          type: "heading",
          text: "二、先题后文，带着任务读"
        },
        {
          type: "paragraph",
          text: "先扫一眼题干，确认是主旨题再去读文章。读的时候不用逐句翻译，你只有一个任务：找出作者最想让你记住的那句中心观点。"
        },
        {
          type: "heading",
          text: "三、主旨最爱躲在四个地方"
        },
        {
          type: "bullets",
          items: [
            "首段，尤其首段最后一句，常用来抛出全文观点。",
            "末段，常对全文做总结或重申结论。",
            "每一段的第一句，把它们串起来就是文章骨架。",
            "转折词之后，如 but、however、yet，作者真正的态度往往藏在转折后面。"
          ]
        },
        {
          type: "tip",
          text: "再圈出全文反复出现的词，包括它们的同义替换，反复讲的东西通常就是中心。"
        },
        {
          type: "heading",
          text: "四、正确项和干扰项怎么分"
        },
        {
          type: "paragraph",
          text: "正确答案是一句范围刚刚好、能罩住全文的话。干扰项主要有三类："
        },
        {
          type: "bullets",
          items: [
            "太窄：把某一段里的例子或细节，当成了全文主旨。",
            "太宽：说法很大，但文章根本没有展开。",
            "太偏：偷换概念、加入原文没有的信息，或用 only、all、never 把话说得太绝对。"
          ]
        },
        {
          type: "tip",
          text: "选项如果只是原文某个细节的原词重现，反而要警惕，细节最常被拿来冒充主旨。"
        },
        {
          type: "example",
          title: "方法演示（不用读整篇也能判断）",
          question:
            "题干是 What is the passage mainly about?。四个选项：A 是第 2 段举的一个例子；B 能同时概括首段观点和末段结论；C 提到一个文章完全没出现的概念；D 加了 only，说法比原文更绝对。",
          analysis:
            "A 太窄，是细节不是主旨；C 无中生有；D 绝对化还偷换了范围。把首段末句、末段和各段首句串起来，只有 B 罩得住全文，所以选 B。"
        },
        {
          type: "heading",
          text: "五、记住这一条流程"
        },
        {
          type: "paragraph",
          text: "认信号词 → 读首段、末段和各段首句，盯住转折词和高频词 → 选罩得住全文的选项 → 排除太窄、太宽、太偏。"
        }
      ]
    },
    retellTask:
      "假设同学完全没做过这类题，请你用自己的话讲清楚：拿到一篇仔细阅读，怎么判断它是主旨题、去哪里找主旨、怎么排除干扰项。",
    rubricPoints: [
      {
        id: "p1",
        point: "先看题干和题目再读文章，带着问题去读，定位更高效。",
        keyPhrases: ["先题后文", "带着问题", "审题"],
        tier: "core",
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
        tier: "core",
        mustCover: true
      },
      {
        id: "p3",
        point:
          "知道主旨常出现的位置：首段、末段、各段首句、转折词 but/however/yet 之后、全文反复出现的高频词。",
        keyPhrases: ["首段", "末段", "段首", "转折", "however", "高频词"],
        tier: "core",
        mustCover: true
      },
      {
        id: "p4",
        point: "正确选项特征：能概括全文，不太宽也不太窄，不含文章没提的信息。",
        keyPhrases: ["概括全文", "以偏概全", "未提及", "太宽", "太窄"],
        tier: "core",
        mustCover: true
      },
      {
        id: "p5",
        point: "干扰项特征：用某个段落的细节冒充主旨、以偏概全、偷换概念、表述绝对化。",
        keyPhrases: ["细节冒充", "以偏概全", "偷换", "绝对化"],
        tier: "bonus",
        mustCover: false
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
    keyWords: [],
    microLesson: {
      goal: "学完这节课，你能在题干里圈出定位词，快速回原文找到出题句，并认出正确答案大多是原文的同义改写，而不是原词照搬。",
      blocks: [
        { type: "heading", text: "一、先认出它：细节题问什么" },
        {
          type: "paragraph",
          text: "细节题问的是文章里的具体信息，比如某人做了什么、某个数据、某个原因、某件事的时间或方式，答案就藏在文章的某一两句话里，不需要你总结全文。"
        },
        {
          type: "bullets",
          items: [
            "According to the passage, ... ?",
            "Which of the following is true / NOT true ?",
            "Why / What / When / How ... ?",
            "填空式：The author mentions ... in order to ___."
          ]
        },
        {
          type: "tip",
          text: "题干里出现具体人名、地名、数字、时间、大写词，或者出现 according to，基本就是让你回原文找一个点，这是细节题。"
        },
        { type: "heading", text: "二、先圈定位词，再回原文找" },
        {
          type: "paragraph",
          text: "不要通读全文硬找。先在题干里挑一两个最显眼、最不容易被改写的词当定位词。"
        },
        {
          type: "bullets",
          items: [
            "专有名词：人名、地名、机构名、大写缩写。",
            "数字、年份、百分比、时间。",
            "带比较级或特殊符号的词。",
            "题干里的核心名词短语。"
          ]
        },
        {
          type: "tip",
          text: "定位词优先选长得特别、文章里出现次数少的词；people、good、thing 这种满篇都是的词没法定位。"
        },
        { type: "heading", text: "三、题文同序，按段落顺序扫" },
        {
          type: "paragraph",
          text: "仔细阅读的细节题，题目顺序和文章顺序基本一致，这叫题文同序。前面的题答案一般在前面段落，后面的题顺着往下找，能快速锁定范围。"
        },
        { type: "heading", text: "四、找到句子后，读定位句加前后句" },
        {
          type: "paragraph",
          text: "定位到那句话后，把它和前一句、后一句一起读，抓句子主干，也就是谁做了什么；遇到长难句，先跳过插入语和定语从句。"
        },
        {
          type: "tip",
          text: "正确选项常常是把定位句换个说法，也就是同义替换，意思一样、用词不同；和原文一字不差的选项反而要多留个心眼。"
        },
        { type: "heading", text: "五、排除四类干扰项" },
        {
          type: "bullets",
          items: [
            "偷换：换掉数字、时间、对象、因果、比较对象或否定词，看着眼熟但意思变了。",
            "无中生有：说法本身合理，但文章根本没提。",
            "张冠李戴：把 A 做的事安到 B 头上。",
            "答非所问：选项是文章里的真话，但回答的不是这道题问的东西。"
          ]
        },
        {
          type: "example",
          title: "方法演示",
          question:
            "题干问 Why did the company move its office?，你用 company 和 move 定位到第二段，定位句说 because rent in the city center kept rising，选项里有一项写 The company moved due to the increasing rent downtown。",
          analysis:
            "这项是定位句的同义替换，rent kept rising 对应 increasing rent，city center 对应 downtown，意思完全一致，是正确答案。另一项若说它想招更多人，文章没提，属于无中生有，直接排除。"
        },
        { type: "heading", text: "六、记住这一条流程" },
        {
          type: "paragraph",
          text: "认细节题 → 圈定位词 → 按题文同序回原文扫到出题句 → 读定位句和前后句、抓主干 → 选同义替换项 → 排除偷换、无中生有、张冠李戴、答非所问。"
        }
      ]
    },
    retellTask:
      "假设同学完全没做过这类题，请你用自己的话讲清楚：拿到一道仔细阅读细节题，怎么圈定位词、回原文哪里找、正确选项长什么样、要排除哪些干扰项。",
    rubricPoints: [
      {
        id: "p1",
        point:
          "能识别细节题：问具体信息，常见 according to、which is true、what/why/when/how 或填空式，答案在原文某一两句话里。",
        keyPhrases: [
          "according to",
          "具体信息",
          "哪项正确",
          "事实细节",
          "true"
        ],
        tier: "core",
        mustCover: true
      },
      {
        id: "p2",
        point:
          "会圈定位词回原文定位：专有名词、数字时间、人名地名、大写词、比较级、核心名词短语。",
        keyPhrases: [
          "定位词",
          "人名",
          "数字",
          "专有名词",
          "大写",
          "回原文"
        ],
        tier: "core",
        mustCover: true
      },
      {
        id: "p3",
        point:
          "知道题文同序：题目顺序和文章段落顺序基本一致，可以据此缩小查找范围。",
        keyPhrases: ["题文同序", "顺序", "段落顺序", "顺着往下"],
        tier: "bonus",
        mustCover: false
      },
      {
        id: "p4",
        point: "定位后读定位句和前后句，结合上下文，遇到长难句先抓主干。",
        keyPhrases: ["定位句", "前后句", "上下文", "主干", "长难句"],
        tier: "core",
        mustCover: true
      },
      {
        id: "p5",
        point:
          "正确答案多为原文的同义替换，并能排除偷换、无中生有、张冠李戴、答非所问四类干扰。",
        keyPhrases: [
          "同义替换",
          "换个说法",
          "偷换",
          "无中生有",
          "张冠李戴",
          "答非所问"
        ],
        tier: "core",
        mustCover: true
      }
    ],
    commonMistakes: [
      "只找和题干或原文一模一样的表达，选了原词复现的干扰项，没看出正确项是同义替换。",
      "定位到一句话就只看那一句，忽略了前一句、后一句里的因果、转折和指代。",
      "选了文章里出现过、但和这道题所问无关的选项，也就是答非所问。",
      "通读全文逐句翻译，没有用定位词，又慢又容易漏。"
    ],
    modelAnswer:
      "做细节题我会先认出它问的是具体信息，题干里有 according to、数字、人名这些。然后在题干里圈一两个显眼的定位词，比如专有名词、年份、大写词，按题文同序顺着段落回原文扫，找到出题句后把它和前后句一起读，长难句先抓谁做了什么这个主干。正确选项一般是把定位句同义替换、换个说法，意思一样但用词不同。最后排除四类干扰：换掉数字对象因果的偷换、文章没提的无中生有、把 A 的事安给 B 的张冠李戴，以及话是真的但所答非所问。"
  },
  {
    id: "l3",
    title: "仔细阅读·推理判断题",
    keyWords: [],
    microLesson: {
      goal: "学完这节课，你能认出 infer、imply 类推理题，知道答案要基于原文往合理方向推一步，既不能照抄原句，也不能脱离原文自己开脑洞。",
      blocks: [
        { type: "heading", text: "一、先认出它：推理题的信号" },
        {
          type: "paragraph",
          text: "推理题不考原文直接写了什么，而考你能不能从作者给出的信息里读出言外之意。"
        },
        {
          type: "bullets",
          items: [
            "It can be inferred from the passage that ___.",
            "The author implies /suggests/indicates that ___.",
            "What can we learn from ... ?",
            "We can conclude that ___.",
            "By saying ..., the author probably means ___."
          ]
        },
        {
          type: "tip",
          text: "看到 infer、imply、suggest、indicate、learn、conclude、probably means，就是推理题。"
        },
        { type: "heading", text: "二、推理题答案的分寸" },
        {
          type: "paragraph",
          text: "推理题正确答案的关键特点是：它在原文里没有被一字不差写出来，但一定能由原文合理地推一步得到。"
        },
        {
          type: "bullets",
          items: [
            "直接照抄原句的往往不是答案，因为那根本不需要推理。",
            "推得太远、加上原文没有的前提，也不是答案。",
            "正确项是离原文最近的一步推断。"
          ]
        },
        {
          type: "tip",
          text: "记住一个标准：原文是地基，答案是紧挨着地基的一块砖，而不是另一栋楼。"
        },
        { type: "heading", text: "三、去哪里找证据" },
        {
          type: "paragraph",
          text: "先根据题干定位段落，再重点读下面这几类地方，言外之意常藏在这里："
        },
        {
          type: "bullets",
          items: [
            "转折和对比：but、however、while、unlike、on the contrary。",
            "评价性的形容词、副词，以及 should、must、may 等情态动词。",
            "举例的目的，例子通常是为了证明它前面那句观点。",
            "反问、虚拟语气和比较级。"
          ]
        },
        { type: "heading", text: "四、只推一步，别用自己的常识" },
        {
          type: "paragraph",
          text: "推断必须挂在原文证据上，不能用你自己的生活经验或课外知识去补全。题目问的是根据这篇文章能推出什么，不是问你个人怎么看。"
        },
        { type: "heading", text: "五、排除四类干扰项" },
        {
          type: "bullets",
          items: [
            "原文直述：句子本身对，但文章已经明说了，不需要推。",
            "过度推断：方向也许对，但加了原文没有的信息，或用 only、all、never 说得太满。",
            "与原文相反：和作者态度或事实正好矛盾。",
            "无据推断：听着合理，但文章里找不到任何支撑。"
          ]
        },
        {
          type: "example",
          title: "方法演示",
          question:
            "原文说这家公司连续三年把研发预算翻倍，但至今没有一款产品盈利，题目问 It can be inferred that ___。",
          analysis:
            "合理的一步推断是这家公司目前更看重技术积累而不是短期盈利，它由持续重投研发加上尚未盈利直接推出。若选项说明年一定会倒闭，就是过度推断加绝对化，原文没这个结论；若选项只是复述它研发预算翻倍，那是原文直述，也不是推理题答案。"
        },
        { type: "heading", text: "六、记住这一条流程" },
        {
          type: "paragraph",
          text: "认 infer、imply、learn → 定位段落 → 找转折、评价词、举例目的等证据 → 只做最近一步推断 → 排除原文直述、过度推断、与原文相反、无据推断。"
        }
      ]
    },
    retellTask:
      "假设同学没做过这类题，请你讲清楚：推理题长什么样、它的正确答案和细节题有什么不同、应该去原文找哪些线索、推理时最容易犯什么错。",
    rubricPoints: [
      {
        id: "p1",
        point:
          "能识别推理题信号词：infer、imply、suggest、indicate、learn、conclude、probably means。",
        keyPhrases: [
          "infer",
          "imply",
          "suggest",
          "indicate",
          "learn",
          "conclude",
          "推理"
        ],
        tier: "core",
        mustCover: true
      },
      {
        id: "p2",
        point:
          "正确答案要基于原文合理推一步：不是原句照抄，也不能脱离原文。",
        keyPhrases: [
          "推一步",
          "言外之意",
          "不是照抄",
          "基于原文",
          "合理推断"
        ],
        tier: "core",
        mustCover: true
      },
      {
        id: "p3",
        point:
          "会找证据：转折对比、评价性形容词副词和情态动词、举例目的、反问虚拟和比较。",
        keyPhrases: [
          "转折",
          "however",
          "评价",
          "情态动词",
          "举例目的",
          "对比"
        ],
        tier: "bonus",
        mustCover: false
      },
      {
        id: "p4",
        point:
          "只做最近一步推断，不用个人常识或外部知识替代原文依据。",
        keyPhrases: ["一步", "就近", "常识", "外部知识", "证据", "开脑洞"],
        tier: "core",
        mustCover: true
      },
      {
        id: "p5",
        point:
          "能排除干扰：原文直述、过度推断、与原文相反、无中生有，以及说得太满的绝对化。",
        keyPhrases: [
          "原文直述",
          "过度推断",
          "相反",
          "无据",
          "太满",
          "绝对化"
        ],
        tier: "core",
        mustCover: true
      }
    ],
    commonMistakes: [
      "选了和原文一字不差的句子，没意识到推理题要的是没明说但能推出的结论。",
      "用自己的常识或课外知识脑补，选了文章里没有依据的选项。",
      "一次推两三步，把可能推成必然，中了过度推断和绝对化。",
      "只盯定位的那一句，没看转折和作者评价，把方向推反了。"
    ],
    modelAnswer:
      "推理题我会先看题干，出现 infer、imply、suggest、learn、conclude 就确定是它。它和细节题最大的不同是，照抄原句的不是答案，答案必须在原文里没明说、但能合理推一步。我会先定位段落，重点看 but、however 这种转折对比，看评价性的形容词副词和 should、may 这类情态动词，还有例子想证明的前面那句观点。推断时只走离原文最近的一步，绝不用自己的常识补。最后排除四种：文章已经明说的原文直述、推太远或说太满的过度推断、和作者意思相反的、以及文章里压根没依据的。"
  },
  {
    id: "l4",
    title: "观点态度题与词义猜测题",
    keyWords: [],
    microLesson: {
      goal: "这节课解决两类小题：一是判断作者或文中人物的态度，二是不认识单词时靠上下文猜出词义或指代，两类都不靠语感，靠找线索。",
      blocks: [
        { type: "heading", text: "第一部分・观点态度题" },
        { type: "heading", text: "一、态度题长什么样" },
        {
          type: "paragraph",
          text: "态度题问作者或文中某个人对一件事是赞成、反对还是中立，选项通常是一组形容词，比如 What is the author's attitude toward ... ?，或 The tone of the passage is ___。"
        },
        {
          type: "bullets",
          items: [
            "正面：positive、supportive、favorable、optimistic、approving。",
            "负面：negative、critical、doubtful、pessimistic、concerned。",
            "中立客观：neutral、objective、impartial。"
          ]
        },
        {
          type: "tip",
          text: "indifferent，也就是漠不关心，几乎不会是答案，作者真不在乎就不会专门写这篇文章。"
        },
        { type: "heading", text: "二、态度藏在这些词里" },
        {
          type: "paragraph",
          text: "态度不靠猜，去定位作者表态的地方：评价性的形容词和副词、情态动词 should 或 must、转折之后、评价性动词，以及作者引用的话。"
        },
        {
          type: "tip",
          text: "一定要分清这句话是作者自己的态度，还是作者在转述别人的观点，还是只是客观陈述事实。说明文里作者常只做客观介绍，答案多为 objective 或 neutral。"
        },
        { type: "heading", text: "三、态度题的干扰项" },
        {
          type: "bullets",
          items: [
            "把文中某个人物的态度当成作者态度，张冠李戴。",
            "程度过重，作者只是 concerned，选项却写成 desperate 或 furious。",
            "方向相反，把批评读成赞成，把中立读成支持。"
          ]
        },
        { type: "heading", text: "第二部分・词义猜测题" },
        { type: "heading", text: "四、词义和指代题长什么样" },
        {
          type: "paragraph",
          text: "题目给一个词、短语或代词，问它在文中什么意思或指代谁，比如 The word X probably means ___、The underlined word is closest in meaning to ___、The word they or it refers to ___。"
        },
        { type: "heading", text: "五、不靠词汇量，靠上下文线索" },
        {
          type: "bullets",
          items: [
            "定义或解释：后面紧跟定语从句、同位语、that is、in other words。",
            "举例：such as、for example 后面的例子可以反推词义。",
            "同义复述：上下文用另一种说法把它又讲了一遍。",
            "反义对比：but、while、unlike、instead of 给出反义词。",
            "因果关系，以及前后缀、合成词等构词法。"
          ]
        },
        {
          type: "tip",
          text: "猜完一定把选项代回原句读一遍，看意思、感情色彩和逻辑通不通。指代题就往前找最近的名词，再核对单复数和语义。"
        },
        {
          type: "example",
          title: "方法演示",
          question:
            "句子是 Unlike her talkative sister, Mary is quite reticent; she seldom speaks in meetings，问 reticent 最可能是什么意思。",
          analysis:
            "句首 Unlike 把 Mary 和健谈的姐姐做对比，后面还补充她很少发言，由反义对比就能推出 reticent 是沉默寡言的意思。这靠的是反义线索，认不认识这个词本身并不重要。"
        },
        { type: "heading", text: "六、记住这一条流程" },
        {
          type: "paragraph",
          text: "态度题：找评价性词语和转折，分清是谁的态度，警惕 indifferent 和程度过重项。词义题：抓定义、举例、同义、反义、因果、构词六类线索，猜后代回原句验证，指代题向前找最近名词并核对单复数。"
        }
      ]
    },
    retellTask:
      "请讲清楚：态度题应该去哪里找作者态度、怎么区分作者和文中人物的态度；遇到不认识的词或代词，分别用哪些上下文线索把意思猜出来。",
    rubricPoints: [
      {
        id: "p1",
        point:
          "能识别态度题（attitude、tone，选项是一组态度形容词）和词义 / 指代题（means、closest in meaning、refers to）。",
        keyPhrases: [
          "attitude",
          "tone",
          "态度",
          "means",
          "closest",
          "refers to",
          "指代"
        ],
        tier: "core",
        mustCover: true
      },
      {
        id: "p2",
        point:
          "态度题会定位评价性线索：形容词副词、情态动词、转折、评价动词和引言。",
        keyPhrases: ["形容词", "副词", "情态动词", "转折", "评价", "引言"],
        tier: "core",
        mustCover: true
      },
      {
        id: "p3",
        point:
          "能区分作者本人态度、文中人物态度和客观叙述；知道说明文常选 objective 或 neutral，indifferent 通常排除。",
        keyPhrases: [
          "作者",
          "人物",
          "客观",
          "objective",
          "neutral",
          "indifferent",
          "中立"
        ],
        tier: "core",
        mustCover: true
      },
      {
        id: "p4",
        point:
          "词义题会用上下文线索：定义同位语、举例、同义复述、反义对比、因果、构词法。",
        keyPhrases: [
          "上下文",
          "定义",
          "举例",
          "同义",
          "反义",
          "unlike",
          "构词",
          "前后缀"
        ],
        tier: "core",
        mustCover: true
      },
      {
        id: "p5",
        point:
          "猜后代入原句验证通顺和逻辑；指代题向前找最近名词并核对单复数；能排除程度过重、方向相反、张冠李戴。",
        keyPhrases: [
          "代入",
          "验证",
          "指代",
          "最近",
          "单复数",
          "程度过重",
          "相反"
        ],
        tier: "bonus",
        mustCover: false
      }
    ],
    commonMistakes: [
      "把文中被引用人物的观点当成作者自己的态度。",
      "作者只是客观说明，却选了强烈支持或反对的词，或把轻微担忧选成激烈情绪。",
      "猜词只凭单词眼熟或课本义项，不看上下文，忽略了 but、unlike 给的反义线索。",
      "指代题随手选最近的名词，没有代回句子核对单复数和逻辑。"
    ],
    modelAnswer:
      "态度题我先认题干里的 attitude、tone，选项是一组态度形容词。然后去原文找评价性的形容词副词、should 这类情态动词、转折之后和作者引言，同时一定分清这是作者本人态度、文中人物观点，还是客观陈述，说明文一般选 objective 或 neutral，indifferent 基本排除，还要小心程度过重和方向相反的选项。词义题我不靠词汇量，而是看上下文六类线索：定义同位语、举例、同义复述、but 和 unlike 的反义对比、因果，以及前后缀构词。猜完把选项代回原句验证；遇到 it、they 这类指代，就往前找最近的名词，核对单复数和语义。"
  },
  {
    id: "l5",
    title: "选词填空（篇章词汇）",
    keyWords: [],
    microLesson: {
      goal: "学完这节课，你能用先标词性、再判空格、边做边排除的流程，把 15 选 10 的选词填空做稳，而不是凭语感一个个试。",
      blocks: [
        { type: "heading", text: "一、先认清题型规则" },
        {
          type: "paragraph",
          text: "选词填空在一篇短文里挖 10 个空，给你 15 个词的词库，从 A 到 O 编号，每个词最多用一次，所以有 5 个词永远用不上。"
        },
        {
          type: "tip",
          text: "这道题考的是词性、语义和搭配，不是单纯考词汇量，方法性非常强。"
        },
        { type: "heading", text: "二、第一步：给词库每个词标词性" },
        {
          type: "paragraph",
          text: "动手填空前，先在词库旁边标出词性：名词、动词、形容词、副词，很多副词以 ly 结尾。"
        },
        {
          type: "bullets",
          items: [
            "一个词可能兼两类词性，ed、ing 结尾既可能是动词时态，也可能当形容词，两个都标上。",
            "名词注意单复数，动词注意原形、第三人称单数、ed 和 ing 形式。"
          ]
        },
        { type: "heading", text: "三、第二步：读首句，抓主旨和时态" },
        {
          type: "paragraph",
          text: "文章第一句通常不设空，先读懂它，知道全文在讲什么、整体是什么时态，后面选词的语义和时态才有方向。"
        },
        { type: "heading", text: "四、第三步：判断每个空要什么词性" },
        {
          type: "bullets",
          items: [
            "冠词 a、an、the，形容词性物主代词 his、their，或介词后面，多半要名词。",
            "主语后面缺成分，往往要谓语动词，并核对主谓一致、时态、被动 be 加过去分词、进行时 be 加 doing。",
            "名词前面做修饰，多半要形容词。",
            "修饰动词、形容词或整个句子，常用副词。",
            "and、or 并列结构前后词性通常一致。"
          ]
        },
        { type: "heading", text: "五、第四步：先易后难，边做边排除" },
        {
          type: "paragraph",
          text: "先做有固定搭配、或你一眼就能确定的空，每用掉一个词就从词库划掉；候选越来越少，难空再用排除法和词性筛选解决。"
        },
        {
          type: "tip",
          text: "选定后把词代回句子通读，确认词性对、意思通、搭配成立、时态和单复数也对，再进下一个。"
        },
        {
          type: "example",
          title: "方法演示",
          question:
            "句子是 The new policy greatly ___ the efficiency of the team，空格在主语 policy 后、宾语 efficiency 前，副词 greatly 修饰它。",
          analysis:
            "这个位置需要一个谓语动词，在主语后、宾语前，语义还要能和 efficiency 搭配，greatly 常接 improved、increased 这类词，所以词库里的动词 improved 最合理；名词或副词放进去会让句子缺谓语或语法不通。先按词性把范围缩到动词，再按搭配锁定答案。"
        },
        { type: "heading", text: "六、记住这一条流程" },
        {
          type: "paragraph",
          text: "标词库词性 → 读首句抓主旨时态 → 判空格词性和语法 → 先做固定搭配和最有把握的、边做边划掉 → 难空用排除法 → 全部代回通读核对。"
        }
      ]
    },
    retellTask:
      "请讲清楚：选词填空的题型规则是什么、为什么要先标词性、怎么判断一个空该填哪种词，以及按什么顺序做又快又准。",
    rubricPoints: [
      {
        id: "p1",
        point:
          "知道规则：10 个空、15 个词、每词只用一次、有 5 个干扰；动手前先给词库标词性，ed、ing 可能兼作动词和形容词。",
        keyPhrases: [
          "15",
          "10",
          "标词性",
          "名词",
          "动词",
          "形容词",
          "副词",
          "ing"
        ],
        tier: "core",
        mustCover: true
      },
      {
        id: "p2",
        point: "先读不设空的首句，把握文章主旨和整体时态。",
        keyPhrases: ["首句", "主旨", "时态", "第一句"],
        tier: "bonus",
        mustCover: false
      },
      {
        id: "p3",
        point:
          "能按语法结构判断空格词性：冠词介词物主代词后名词、主语后谓语动词、名词前形容词、修饰动词用副词、并列前后一致。",
        keyPhrases: [
          "冠词",
          "介词",
          "谓语",
          "主谓一致",
          "被动",
          "形容词",
          "副词",
          "并列"
        ],
        tier: "core",
        mustCover: true
      },
      {
        id: "p4",
        point:
          "先做固定搭配和最有把握的空，用一个划一个，难空靠缩小候选范围和排除法。",
        keyPhrases: [
          "固定搭配",
          "有把握",
          "划掉",
          "排除法",
          "缩小候选",
          "先易后难"
        ],
        tier: "core",
        mustCover: true
      },
      {
        id: "p5",
        point: "选定后代入通读，核对词性、语义、搭配、时态和单复数。",
        keyPhrases: ["代入", "通读", "搭配", "语义", "单复数", "核对"],
        tier: "core",
        mustCover: true
      }
    ],
    commonMistakes: [
      "不标词性，直接把 15 个词逐空试，又慢又容易乱。",
      "把 ed、ing 结尾的词只当动词，没想到它们也可能作形容词。",
      "只看空格所在的短语，不读首句，不管全文时态和语义方向。",
      "选定后不代回通读，单复数、时态或搭配错了没发现。"
    ],
    modelAnswer:
      "选词填空我先认清规则，10 个空、15 个词，每个只用一次，还有 5 个干扰。第一步先给词库每个词标名词、动词、形容词、副词，ed 和 ing 可能既是动词又当形容词，都标上。第二步读不设空的首句，抓主旨和时态。第三步逐空判词性，冠词介词和物主代词后面多是名词，主语后面缺谓语就找动词并核对主谓一致、时态和被动，名词前用形容词，修饰动词或整句用副词，and 并列前后词性一致。第四步先做固定搭配和最有把握的，用一个划一个，难空靠排除法。最后每个词都代回通读，确认词性、意思、搭配、时态和单复数都对。"
  }
];

export const LESSONS: Lesson[] = [
  ...BASE_LESSONS.map((lesson) => {
    const enrichment = EXISTING_LESSON_ENRICHMENTS[lesson.id];

    return enrichment
      ? {
          ...lesson,
          microLesson: lesson.microLesson
            ? { ...lesson.microLesson, advancedBlocks: enrichment.advancedBlocks }
            : undefined,
          practiceQuestions: enrichment.practiceQuestions
        }
      : lesson;
  }),
  ...EXTRA_LESSONS
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
