import { LearnMap } from "./LearnMap";

export default function LearnPage() {
  return (
    <section className="px-5 py-7 md:px-10 md:py-10 lg:px-12 xl:px-14">
      <header className="mb-8 max-w-2xl space-y-3">
        <p className="inline-flex rounded-full bg-leaf/10 px-3 py-1.5 text-xs font-bold text-leaf">
          四级阅读
        </p>
        <h1 className="text-3xl font-extrabold text-ink md:text-4xl">
          课程地图
        </h1>
        <p className="text-base leading-7 text-ink/60">
          每一节都是：学 → 讲 → 被诊断 → 补 → 达标
        </p>
        <p className="text-sm leading-6 text-ink/60">
          建议从第 1 节按顺序学，也可以直接挑你薄弱的题型。
        </p>
      </header>

      <LearnMap />
    </section>
  );
}
