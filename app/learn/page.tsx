import { LearnMap } from "./LearnMap";

export default function LearnPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-10 pt-7 md:px-8 md:pt-9">
      <header className="mb-7 border-b border-ink/15 pb-6 md:mb-8">
        <p className="text-xs font-semibold text-ink/45">
          CET-4 · 阅读 / 写作 / 翻译
        </p>
        <h1 className="mt-2 font-serif text-3xl font-black leading-tight text-ink md:text-4xl">
          课程地图
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink/70 md:text-base">
          把方法讲清楚，再用新题检验。
        </p>
        <p className="mt-1 text-xs leading-6 text-ink/50 md:text-sm">
          选择阅读、写作或翻译，开始今天的学习。
        </p>
      </header>

      <LearnMap />
    </section>
  );
}
