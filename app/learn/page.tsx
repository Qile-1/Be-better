import { LearnMap } from "./LearnMap";

export default function LearnPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-12 md:px-12 md:py-16">
      <header className="mb-12 max-w-2xl">
        <p className="text-xs font-medium tracking-[0.18em] text-ink/45">
          CET-4 READING
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-ink md:text-4xl">
          课程地图
        </h1>
        <p className="mt-5 text-base leading-7 text-ink/65">
          每一节都是：学 → 讲 → 被诊断 → 补 → 达标
        </p>
        <p className="mt-2 text-sm leading-6 text-ink/50">
          建议从第 1 节按顺序学，也可以直接挑你薄弱的题型。
        </p>
      </header>

      <LearnMap />
    </section>
  );
}
