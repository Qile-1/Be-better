const lessons = [
  "阅读方法热身",
  "细节题定位",
  "主旨题判断",
  "推理题拆解",
  "长难句复述"
];

export default function LearnPage() {
  return (
    <section className="px-5 py-7">
      <header className="mb-6 space-y-2">
        <p className="text-sm font-semibold text-coral">学习</p>
        <h1 className="text-3xl font-bold text-ink">四级阅读 5 节课</h1>
      </header>

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <article
            key={lesson}
            className="rounded-lg border border-black/10 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm text-ink/50">
                  第 {String(index + 1).padStart(2, "0")} 节
                </p>
                <h2 className="text-lg font-semibold text-ink">{lesson}</h2>
              </div>
              <span className="shrink-0 rounded-full bg-wheat px-3 py-1 text-xs font-medium text-ink">
                占位
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
