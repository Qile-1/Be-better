export default function MePage() {
  return (
    <section className="px-5 py-7">
      <header className="mb-6 space-y-2">
        <p className="text-sm font-semibold text-coral">我的</p>
        <h1 className="text-3xl font-bold text-ink">学习账户</h1>
      </header>

      <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
        <p className="text-base font-semibold text-ink">今日先从阅读开始。</p>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          个人数据与学习记录后续接入。
        </p>
      </div>
    </section>
  );
}
