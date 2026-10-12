import { Suspense } from "react";
import { LearnMap } from "./LearnMap";

export default function LearnPage() {
  return (
    <section className="course-map">
      <header className="map-heading"><div><p className="eyebrow">CET-4 / 阅读 · 写作 · 翻译</p><h1>每一次理解，<br />都向前一点。</h1></div><p>把方法讲清楚，再用新题检验。<br />选择一个方向，开始今天的学习。</p></header>
      <Suspense fallback={<p className="py-10 text-ink/60">正在打开课程地图…</p>}><LearnMap /></Suspense>
    </section>
  );
}
