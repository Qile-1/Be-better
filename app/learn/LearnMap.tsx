"use client";

import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LESSONS } from "../../lib/lessons";
import { getProgress, type Progress } from "../../lib/storage";

export function LearnMap() {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const unlockedIndex = progress?.unlockedIndex ?? 0;

  return (
    <div className="space-y-3">
      {LESSONS.map((lesson, index) => {
        const lessonProgress = progress?.lessons[lesson.id];
        const isCompleted = lessonProgress?.status === "completed";
        const isUnlocked = index <= unlockedIndex;
        const bestCoverage = lessonProgress?.bestCoverage ?? 0;

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
                  isCompleted
                    ? "bg-leaf text-white"
                    : isUnlocked
                      ? "bg-wheat text-ink"
                      : "bg-black/5 text-ink/35"
                ].join(" ")}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-lg font-semibold leading-6">
                  {lesson.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  {isCompleted ? (
                    <>
                      <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                      <span>已完成</span>
                      <span className="rounded-full bg-leaf/10 px-2 py-1 text-xs text-leaf">
                        最佳覆盖率 {Math.round(bestCoverage * 100)}%
                      </span>
                    </>
                  ) : isUnlocked ? (
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
  );
}
