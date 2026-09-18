import { Lock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { LESSONS } from "../../lib/lessons";

export default function LearnPage() {
  return (
    <section className="px-5 py-7">
      <header className="mb-6 space-y-2">
        <p className="text-sm font-semibold text-coral">学习</p>
        <h1 className="text-3xl font-bold text-ink">课程地图</h1>
        <p className="text-sm leading-6 text-ink/60">
          今天先完成第 1 节：看视频，再用自己的话讲一遍。
        </p>
      </header>

      <div className="space-y-3">
        {LESSONS.map((lesson, index) => {
          const isUnlocked = index === 0;

          const content = (
            <article
              className={[
                "rounded-lg border p-4 shadow-sm transition",
                isUnlocked
                  ? "border-leaf/20 bg-white active:scale-[0.99]"
                  : "border-black/10 bg-white/60 text-ink/45"
              ].join(" ")}
            >
              <div className="flex items-start gap-4">
                <div
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-base font-bold",
                    isUnlocked
                      ? "bg-leaf text-white"
                      : "bg-black/5 text-ink/35"
                  ].join(" ")}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <h2 className="text-lg font-semibold leading-6">
                    {lesson.title}
                  </h2>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {isUnlocked ? (
                      <>
                        <PlayCircle aria-hidden="true" className="h-4 w-4" />
                        <span>可学</span>
                      </>
                    ) : (
                      <>
                        <Lock aria-hidden="true" className="h-4 w-4" />
                        <span>锁定</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );

          return isUnlocked ? (
            <Link key={lesson.id} href={`/learn/${lesson.id}`}>
              {content}
            </Link>
          ) : (
            <div key={lesson.id} aria-disabled="true">
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
