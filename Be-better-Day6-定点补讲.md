# Be better・Day6：定点补讲（不直接给答案，针对遗漏点补课后再复述）

> 本次只做一件事：诊断
>
> **不通过**
>
> 时，不再直接展示完整参考答案，而是调用新接口，让 AI 
>
> **只针对用户这次漏掉的要点和讲错的地方**
>
> 做一小段补讲，然后引导他
>
> **清空输入、脱稿再讲一遍**
>
> ，直到覆盖率达标。
> 诊断
>
> **通过**
>
> 时的流程、解锁逻辑、存储逻辑、课程内容一律不动。

## 一、本次允许改动的文件



* 新增：`app/api/remedy/route.ts`

* 修改：`lib/types.ts`（只新增类型，不改现有任何 interface）

* 修改：`app/learn/[id]/LessonStage.tsx`（主要工作）

* **不要改**：`app/api/diagnose/route.ts`、`lib/lessons.ts`、`lib/storage.ts`、课程地图页、`/me` 页、全局样式与配色变量。

配色继续使用现有 Tailwind 语义色：`leaf`（绿，正确 / 主按钮）、`coral`（红，错误）、`wheat`（橙黄，遗漏）、`paper`、`ink`、`black/10`，图标继续用 `lucide-react`，不要引入新依赖。



***

## 二、新增类型（追加到 `lib/types.ts` 末尾，不要动已有内容）



```
export type RemedyKind = "gap" | "error";

export interface RemedyItem {

&#x20; pointId: string;          // gap 项必须对应某个遗漏要点 id；error 项可填 "review"

&#x20; kind: RemedyKind;         // gap=遗漏补讲，error=硬伤纠错

&#x20; title: string;            // 这张补讲卡片的短标题

&#x20; explanation: string;      // 通俗讲解，1-3 句，讲清思路

&#x20; example: string;          // 一个小例子或类比，帮助理解

&#x20; tip: string;              // 一句话：怎么记、做题时怎么用

}

export interface RemedyResult {

&#x20; recap: string;            // 先用一句话肯定他这次讲对的部分

&#x20; remedyItems: RemedyItem\[];// 只针对遗漏点 + 错误，顺序与遗漏要点一致

&#x20; nextPrompt: string;       // 一句引导他脱稿再讲一遍的话

}
```



***

## 三、新增接口 `app/api/remedy/route.ts`

整体写法、错误处理、DeepSeek 调用、解析失败重试一次的模式，**参照现有的&#x20;**`app/api/diagnose/route.ts`（同一个 `DEEPSEEK_URL`、`Authorization: Bearer`、`model: "deepseek-chat"`、`response_format: { type: "json_object" }`、密钥读 `process.env.DEEPSEEK_API_KEY`，友好错误用 `NextResponse.json({ error }, { status })`）。`temperature` 设为 `0.3`。

### 请求体



```
type RemedyRequestBody = {

&#x20; lessonId?: unknown;

&#x20; coveredPointIds?: unknown;   // 本次已覆盖要点

&#x20; missedPointIds?: unknown;    // 本次遗漏要点

&#x20; errors?: unknown;            // DiagnoseError\[]

&#x20; userText?: unknown;          // 用户本次复述原文

};
```

### 校验



* `lessonId` 找不到对应课程：返回 404「没有找到这节课，请回到课程地图重新进入」。

* `missedPointIds` 为空且 `errors` 为空：返回 400「这次没有需要补讲的要点」。

* 未配置 `DEEPSEEK_API_KEY`：返回 500「AI 服务未配置」。

* 入参 id 必须过滤，只保留本节课 `rubricPoints` 里真实存在的 id；`error` 项允许 `pointId: "review"`。

### 发给模型的上下文

从课程里取：



* 遗漏要点：`lesson.rubricPoints` 中 id 命中 `missedPointIds` 的 `{ id, point }`，按课程中 rubric 的原始顺序排列；

* 硬伤错误：请求体里的 `errors`（`{ point, detail }`）；

* 讲解素材：`lesson.microLesson.goal` 与 `lesson.commonMistakes`（用于把课讲通俗，但不要把整节微课原样倒出）；

* 已覆盖要点 id 列表（用于让模型先肯定讲对的部分）。

### System 规则（核心，严格按这个意思写，禁止模型直接给完整答案）



```
你是大学英语四级阅读的费曼辅导老师。学生刚做完一次脱稿复述，但没有完全讲对。你的任务不是替他答题，而是只针对他这次【遗漏的要点】和【讲错的地方】做最小必要的补讲，帮他自己想明白后再脱稿讲一遍。规则：

1\. 只为传入的遗漏要点和错误生成 remedyItems，顺序与遗漏要点一致；学生已经讲对的内容不要再讲。

2\. 每个要点用通俗的话讲清思路，配一个小例子或类比，再给一句"怎么记/做题时怎么用"。语言要短，面向基础薄弱的学生。

3\. 绝对禁止输出本节课的完整参考答案、禁止给出可以照抄的整段复述、禁止让学生逐字跟读。你只讲思路和例子，结论要让他自己说出来。

4\. 对讲错的地方用 kind="error"，明确指出他的说法错在哪、正确思路是什么；遗漏用 kind="gap"。

5\. recap 先用一句话具体肯定他这次确实讲对的部分（基于传入的已覆盖要点），不要空泛夸奖；nextPrompt 引导他合上讲义、脱稿再讲一遍，重点补上遗漏点。

只输出一个 JSON 对象，键名必须与下面完全一致，不能新增、改名：

{

&#x20; "recap": "一句具体肯定",

&#x20; "remedyItems": \[

&#x20;   { "pointId": "遗漏要点id或review", "kind": "gap", "title": "短标题", "explanation": "通俗讲解", "example": "小例子或类比", "tip": "一句话记忆/用法" }

&#x20; ],

&#x20; "nextPrompt": "引导脱稿再讲一遍"

}

不要输出 JSON 以外的任何文字，不要使用 markdown 代码块。
```

user message 用 JSON 字符串传入：遗漏要点、错误、已覆盖要点 id、讲解素材（goal + commonMistakes）。

### 返回归一化（在服务端做，不信模型自报）



* 解析失败重试一次，仍失败返回 500「补讲生成失败，请点重试」。

* `remedyItems` 过滤：`gap` 项的 `pointId` 必须在遗漏 id 集合内；`error` 项 `pointId` 非法时改为 `"review"`；五个文本字段缺失或非字符串时给安全兜底或丢弃该条。

* 条目数最多为「遗漏点数 + 错误数」且不超过 6；每个文本字段做长度截断（explanation/example 各限 160 字以内，title/tip 各限 40 字以内），避免超长。

* 成功返回 `RemedyResult`（HTTP 200）。



***

## 四、修改 `LessonStage.tsx`

### 1. 新增 state



* `remedy: RemedyResult | null`（默认 null）

* `remedyLoading: boolean`（默认 false）

* `remedyError: string`（默认 ""）

* `attemptCount: number`（默认 0，每点一次「提交给 AI 诊断」加 1，用于在结果页显示 "第 N 次复述"）

### 2. 提交诊断时



* `handleSubmit` 开头：`setAttemptCount(n => n + 1)`，并 `setRemedy(null)`、`setRemedyError("")`。

* 诊断成功后：


  * 若 `nextPassed === true`：维持现状，`setResult(nextResult)`、`setStage(3)`，**不要**请求补讲。

  * 若 `nextPassed === false`：`setResult(nextResult)`、`setStage(3)`，然后**自动**调用新加的 `handleLoadRemedy(nextResult)`。

### 3. 新增 `handleLoadRemedy(result)`



* `setRemedyLoading(true)`、`setRemedyError("")`；

* POST `/api/remedy`，body 为 `{ lessonId: lesson.id, coveredPointIds: result.coveredPointIds, missedPointIds: result.missedPointIds, errors: result.errors, userText }`；

* 成功且响应里有 `remedyItems` 数组：`setRemedy(data)`；

* 失败或网络错误：`setRemedyError("补讲没生成出来，点下面按钮重试")`，**不允许白屏，也不影响已有诊断结果展示**；

* `finally` 关闭 loading。

### 4. 复述页（stage 2）顶部增加 "上次漏了什么" 提示

当存在未通过的上一次结果（`result && 覆盖率 < 0.7 或 fatalErrorCount > 0`，可直接用一个 `hasLastMiss` 判断）时，在 textarea 上方显示一条 wheat 色系提示卡：标题「上一次还漏了这几点，这次重点讲清楚」，列出 `result.missedPointIds` 对应的要点短句（用现有 `pointMap` 取）。第一次复述时不显示。

### 5. 诊断结果页（stage 3）**不通过**分支改造（通过分支完全不动）

按以下顺序渲染：



1. 顶部覆盖率卡片保留，主标题文案改为「还差一点，先补这几点，再讲一遍」，并在副标题显示「这是你第 {attemptCount} 次复述」。

2. 「你讲清楚了这些」保留。

3. 「你漏掉了这些」保留。

4. 硬伤错误区保留（有 errors 才显示）。

5. **新增「针对性补讲」区**（放在遗漏 / 错误之后、鼓励之前）：

* `remedyLoading`：显示 `Loader2` 转圈 + 「正在根据你漏的点准备补讲...」。

* `remedyError`：显示 coral 提示 + 一个「重新生成补讲」按钮（点击重新调 `handleLoadRemedy(result)`）。

* 有 `remedy`：先显示 `recap`（leaf 浅底卡片）；再逐条渲染 `remedyItems` 为卡片，`kind === "error"` 用 coral/red 系并配 `XCircle` 图标，`kind === "gap"` 用 wheat/paper 系并配 `Lightbulb`（lucide 有此图标，没有就用 `Sparkles` 或 `BookOpen`，以 lucide-react 实际导出为准）；每张卡片显示 title、explanation、example（前缀「例：」）、tip（前缀「记住：」，leaf 色）。

1. 「鼓励一下」保留。

2. **把原来直接展示的「参考讲法」整段改成&#x20;**`<details>`**&#x20;折叠**，summary 文案为「实在没思路？展开看完整讲法（建议先自己补讲）」，默认收起；样式复用现有讲义折叠区（`border bg-white shadow-sm` + `ChevronDown`）。通过分支不显示这个折叠（通过时本来就走下一节按钮）。

3. 底部按钮区（不通过）：

* 主按钮文案改为「我补好了，脱稿再讲一遍」，仍用 `RotateCcw` 图标、leaf 实心；onClick 执行：`setUserText("")`（**清空输入，防止照抄上一版**）、`setStage(2)`。保留 `result` 和 `remedy` 不清空（用于 stage2 顶部提示和对照）。

* 次按钮「回看微课」保留不变（`setStage(1)`）。

### 6. 通过分支

保持现状：显示「达标了，下一节已解锁」、下一节链接 / 全部完成卡片；**不请求、不渲染 remedy**，也不显示参考讲法折叠。



***

## 五、不要做的事



* 不要改诊断接口的评分口径（仍是覆盖率 ≥ 0.7 且 fatalErrorCount 为 0），第二次复述仍走原 `/api/diagnose` 全量诊断。

* 不要把完整参考答案在不通过时直接展示（必须折叠）。

* 不要新增数据库、登录、第三方依赖；进度仍只存 localStorage，本次不改存储结构。

* 不要改五节课的任何文案。

* 不要动通过解锁、刷新进度保留的既有逻辑。



***

## 六、完成后必须自测（把结果回报给我）



1. `npm.cmd run typecheck` 通过；`npm.cmd run build` 通过。

2. `npm.cmd run dev` 后进入 `/learn/l1`，**乱讲**（如 "主旨题选最长的，看到原词就选，靠语感蒙"）提交：

* 进入诊断页，显示不通过，**自动出现针对性补讲卡片**，卡片数与遗漏点对应，含讲解和例子；

* 页面默认**看不到**完整参考答案，需要手动展开折叠；

* 出现「这是你第 1 次复述」。

1. 点「我补好了，脱稿再讲一遍」：回到复述页，**输入框已清空**，顶部出现 "上一次还漏了这几点" 提示卡。

2. 这次**讲全五点**提交：通过、出现「进入下一节」，不出现补讲区；回课程地图第 2 节解锁，刷新后完成状态与最佳覆盖率仍在。

3. 对 l2 至 l5 各重复一次 "乱讲出现补讲 → 讲全通过"，确认补讲内容确实只围绕该节遗漏点、没有把整节答案倒出来。

4. 临时把 `.env.local` 的 key 改错或断网提交一次：诊断 / 补讲给出友好的 "重试" 提示，页面不白屏（验证后记得把 key 改回来）。

完成后回报：改动 / 新增的文件清单、两个命令结果、上述 6 条的实际现象。

## 七、提交信息（验收通过后，连同 README 一起在 GitHub Desktop 提交）



```
feat: add targeted remedy lessons and collapse full answer on failure
```