import { Play } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100dvh-6rem)] flex-col px-5 py-7">
      <header className="flex items-center justify-between text-sm text-ink/60">
        <span>四级阅读</span>
        <span>AI 费曼督学</span>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-coral">CET-4 Reading</p>
          <h1 className="text-5xl font-bold leading-tight text-ink">
            Be better
          </h1>
          <p className="max-w-xs text-base leading-7 text-ink/70">
            把阅读讲清楚，再去拿分。
          </p>
        </div>

        <Link
          href="/learn"
          className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-leaf px-5 text-base font-semibold text-white shadow-soft transition hover:bg-leaf/90"
        >
          <Play aria-hidden="true" className="h-5 w-5 fill-white" />
          开始学习
        </Link>
      </div>
    </section>
  );
}
