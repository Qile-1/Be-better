# 本次实施与验证

日期：2026-10-11。

## 文件清单

修改：
- lib/types.ts：可选的课程依据、题型训练数据接口。
- lib/lessons.ts：课程汇总、旧课错误表述修订及要点分层。
- lib/curriculum.ts：基础限定、语法核对等升级为必会点。
- lib/productionCurriculum.ts：基本写译检查项不再归为可忽略的拔高。
- app/learn/LearnMap.tsx：显示重点／拔高及能力标签。
- app/learn/[id]/LessonStage.tsx：显示来源与依据、动态练习数量。
- app/learn/[id]/practice/page.tsx：接入整组题型训练。
- CONTENT_SOURCES.md：本版范围、来源与限制。

新增：
- lib/coverageCurriculum.ts：l13、w5—w7、t5—t7 七节课程。
- lib/curriculumAlignment.ts：27 节课程的能力、优先级和依据。
- lib/formatPractice.ts：原创选词与匹配各一组。
- app/learn/[id]/FormatPracticeSection.tsx：整组作答、本地核对与订正。
- scripts/check-curriculum.cjs：可重复执行的数据约束检查。
- docs/cet/CONTENT_AUDIT.md、source-manifest.json、task-inventory.json、reading-signals.json、audit-summary.json、本文件。

## 已通过

- `node scripts/check-curriculum.cjs`：27 节、27 道阅读微题、30 道开放题、20 个整组训练作答项；ID、引用、答案、词库规则、来源数量均检查通过。15 篇写作参考为 121—141 词，均在 120—180 范围内。
- `npm.cmd run typecheck`：通过。
- `npm.cmd run build`：通过，生成 63 个静态页面条目。
- 独立 Edge 浏览器，在 375px 和 1280px 分别检查 13 个路径：/learn、/learn/l1、/learn/l13、/learn/w5、/learn/w6、/learn/w7、/learn/t5、/learn/t6、/learn/t7、/learn/l5/practice、/learn/l6/practice、/learn/w5/practice、/learn/t5/practice。均返回 200，无横向溢出或页面运行时异常。
- 实际交互：未答完提交禁用；选词已用项不能重复，清空后可重新使用；错一题得到 9/10 和订正；重做清空；全对 10/10；匹配可重复使用 G 段；来源链接可见；新增课可进入文本复述。
- 跳过开场视频后检查桌面与手机课程／练习截图，未改开场视频。
- lib/storage.ts、诊断 route、补讲 route、VoiceDictation.tsx 的修改前后 SHA256 一致；未新增依赖或环境变量。

## 未声称完成

- 未付费调用 AI 做端到端评分，也未验证真实麦克风。
- 未证明原创题与官方考试等难、无歧义或具有已验证的提分效果；软件测试不替代教师审稿。
- 未完成全部真题的逐题语义多标签频率统计；范围见 CONTENT_AUDIT.md。
- 新整组练习结果仅保留在当前页面，刷新会重置，未改现有进度存储。
- 未部署线上或推送 GitHub。
