import { LearnMap } from "./LearnMap";

export default function LearnPage() {
  return (
    <section className="px-5 py-7">
      <header className="mb-6 space-y-2">
        <p className="text-sm font-semibold text-coral">学习</p>
        <h1 className="text-3xl font-bold text-ink">课程地图</h1>
        <p className="text-sm leading-6 text-ink/60">
          建议从第 1 节按顺序学，也可以直接挑你薄弱的题型。
        </p>
      </header>

      <LearnMap />
    </section>
  );
}
