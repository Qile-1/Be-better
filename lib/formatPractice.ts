import type { FormatPractice } from "./types";

// Independently authored training texts, not extracted or paraphrased exam passages.
export const CLOZE_PRACTICE: FormatPractice = {
  id: "cloze-repair-01", kind: "cloze", title: "选词填空：校园维修角",
  instructions: "原创题型训练：15 选 10，每词最多使用一次，不改变词形。篇幅经过缩短，不是全长模拟卷。",
  passage: "A college opened a weekly repair desk to help students keep useful objects for longer. At first, the organizers expected most visitors to bring electronic equipment. Instead, the most [1] problem was loose buttons on clothes. The team therefore invited volunteers with a wider range of [2].\n\nBefore beginning any repair, volunteers [3] each object to see whether they could work on it safely. Students were encouraged to describe the problem [4], rather than simply saying that something was broken. This made it easier to identify the cause. When a part had to be replaced, the owner gave [5] before any money was spent.\n\nThe desk was not intended to [6] professional repair services. It dealt only with simple jobs and referred difficult cases to qualified workers. Students were also asked to remain at the desk and [7] the process, so they could learn a useful skill.\n\nAfter one term, the organizers collected [8] from visitors. Many said they now felt more confident about looking after their belongings. However, the team did not [9] that the project had reduced waste across the whole college: it had not measured that effect. It planned to keep more careful records and publish the results [10] at the end of each term.",
  options: [
    { label: "A", text: "approval" }, { label: "B", text: "claim" },
    { label: "C", text: "common" }, { label: "D", text: "examine" },
    { label: "E", text: "feedback" }, { label: "F", text: "observe" },
    { label: "G", text: "precisely" }, { label: "H", text: "regularly" },
    { label: "I", text: "replace" }, { label: "J", text: "skills" },
    { label: "K", text: "approved" }, { label: "L", text: "examination" },
    { label: "M", text: "impatient" }, { label: "N", text: "rarely" },
    { label: "O", text: "replacing" }
  ],
  items: [
    { id: "1", prompt: "第 1 空", answer: "C", explanation: "the most common problem 表示最常见的问题；名词前需要形容词。impatient 描述不耐烦，不符合问题的性质。" },
    { id: "2", prompt: "第 2 空", answer: "J", explanation: "a range of skills，志愿者需要多种技能。不能用单个 approval 或 examination 表示技能范围。" },
    { id: "3", prompt: "第 3 空", answer: "D", explanation: "复数主语 volunteers 缺一般现在时谓语 examine，后接检查对象。examination 是名词。" },
    { id: "4", prompt: "第 4 空", answer: "G", explanation: "副词 precisely 修饰 describe，和笼统地说坏了形成对照；regularly 不表达描述的准确程度。" },
    { id: "5", prompt: "第 5 空", answer: "A", explanation: "give approval 表示给予许可；花钱前征得物主同意，这里缺名词宾语，不能填分词 approved。" },
    { id: "6", prompt: "第 6 空", answer: "I", explanation: "be intended to 后接原形；下文说明只做简单维修，故不是取代专业服务。replacing 词形不对。" },
    { id: "7", prompt: "第 7 空", answer: "F", explanation: "remain 与 observe 由 and 并列，留下来观察过程才能学习技能；examine 已用于第 3 空且不如 observe 符合学习过程。" },
    { id: "8", prompt: "第 8 空", answer: "E", explanation: "collected feedback from visitors，后文正是访客的反馈。" },
    { id: "9", prompt: "第 9 空", answer: "B", explanation: "did not 后用原形 claim，并可接 that 从句；没测量就不声称有全校效果。" },
    { id: "10", prompt: "第 10 空", answer: "H", explanation: "每学期末公布构成定期安排，regularly 对应 at the end of each term，rarely 与安排不符。" }
  ]
};

export const MATCHING_PRACTICE: FormatPractice = {
  id: "matching-garden-01", kind: "matching", title: "段落匹配：共享菜园",
  instructions: "原创题型训练：将 10 条陈述匹配到段落，同一段可重复使用，也有段落不被使用。篇幅经过缩短，不是全长模拟卷。",
  paragraphs: [
    { label: "A", text: "The town's shared garden began beside a bus depot. Before choosing the site, organizers asked an independent laboratory to test the soil. Only after the report showed that growing vegetables was safe did they invite residents to join." },
    { label: "B", text: "Membership did not require gardening experience. Newcomers worked beside experienced volunteers during their first two visits. The aim was to make basic skills available to people who had never owned a garden." },
    { label: "C", text: "Originally, members met on weekday afternoons. Attendance was low among people with full-time jobs. A second session on Saturday mornings made it easier for those residents to take part." },
    { label: "D", text: "Water initially came from a tap in the nearby sports centre. Members later installed tanks to collect rainwater from a shed roof. Tap water remained available during long dry periods; the tanks did not meet every need." },
    { label: "E", text: "A school group visited once a month. Children measured plant growth and kept notebooks. Their teacher used the records in mathematics lessons, rather than treating the visits only as a break from classroom work." },
    { label: "F", text: "Some members expected all the produce to be sold. The committee instead decided to share it among active volunteers and donate any surplus to a local kitchen. No sales target was set." },
    { label: "G", text: "The garden's newsletter once claimed that participation improved everyone's health. After a nurse questioned the evidence, the editor removed the claim. Members had reported enjoying the work, but no health assessment had taken place." },
    { label: "H", text: "Tools were often difficult to find. A volunteer painted outlines of each tool on a storage board. Members could now see immediately which item was missing and where a returned tool belonged." },
    { label: "I", text: "The committee considered opening a second garden. Rather than expanding immediately, it decided to record costs and volunteer hours for another season. These records would help determine whether expansion was practical." },
    { label: "J", text: "A local artist designed a sign for the entrance. It showed the garden's name and opening hours. Residents chose the design in a short vote at the summer gathering." },
    { label: "K", text: "Visitors sometimes asked whether they could bring dogs. The committee placed the existing visitor rules beside the gate so that everyone could read them before entering." }
  ],
  options: "ABCDEFGHIJK".split("").map((label) => ({ label, text: `段落 ${label}` })),
  items: [
    { id: "1", prompt: "Safety was checked before residents were invited to grow food.", answer: "A", explanation: "实验室先检验土壤，再邀请居民。安全、时间先后两个条件都要满足。" },
    { id: "2", prompt: "A timetable change helped employed residents participate.", answer: "C", explanation: "full-time jobs 改写 employed；周六场次使这部分人可参与。" },
    { id: "3", prompt: "A new source of water supplemented rather than completely replaced the old one.", answer: "D", explanation: "雨水箱增加供水，但干旱时仍用自来水，不能把补充理解为完全替代。" },
    { id: "4", prompt: "An educational visit supplied material for a subject taught indoors.", answer: "E", explanation: "种植记录用于数学课，是 material for a subject 的同义概括。" },
    { id: "5", prompt: "Extra food went to a community organization instead of being sold.", answer: "F", explanation: "surplus 对应 extra food；捐给厨房而非出售。" },
    { id: "6", prompt: "An unsupported statement was withdrawn after a professional raised concerns.", answer: "G", explanation: "护士质疑后删除健康结论；未做健康评估所以证据不足。" },
    { id: "7", prompt: "Beginners received help from people who already had relevant experience.", answer: "B", explanation: "新手前两次由有经验志愿者带领。" },
    { id: "8", prompt: "Visual marks made it easier to manage shared equipment.", answer: "H", explanation: "工具轮廓让缺少什么、放在哪里一眼可见。" },
    { id: "9", prompt: "More information would be gathered before deciding to enlarge the project.", answer: "I", explanation: "再记录一季成本工时后决定是否扩建，不是已经批准扩建。" },
    { id: "10", prompt: "Positive personal reports did not amount to a measured health outcome.", answer: "G", explanation: "享受劳动不等于测量过健康收益；G 再次使用，不能因已用过就排除。" }
  ]
};
