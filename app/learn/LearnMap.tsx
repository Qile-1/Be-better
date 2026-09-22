"use client";

import { CheckCircle2, CircleDashed, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LESSONS } from "../../lib/lessons";
import { getProgress, type Progress } from "../../lib/storage";
import type { LessonMasteryStatus } from "../../lib/types";

const statusLabel: Record<LessonMasteryStatus, string> = {
  mastered: "已掌握",
  basic: "基本掌握",
  review: "待复习"
};

export function LearnMap() {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <div className="space-y-3">
      {LESSONS.map((lesson, index) => {
        const lessonProgress = progress?.lessons[lesson.id];
        const status = lessonProgress?.status;

        return (
          <Link key={lesson.id} href={`/learn/${lesson.id}`}>
            <article className="rounded-lg border border-leaf/20 bg-white p-4 shadow-sm transition active:scale-[0.99]">
              <div className="flex items-start gap-4">
                <div
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-base font-bold",
                    status === "mastered"
                      ? "bg-leaf text-white"
                      : status === "basic"
                        ? "bg-wheat text-ink"
                        : "bg-paper text-ink"
                  ].join(" ")}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <h2 className="text-lg font-semibold leading-6 text-ink">
                    {lesson.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                    {!status ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-xs text-ink/55">
                        <PlayCircle aria-hidden="true" className="h-3.5 w-3.5" />
                        未学
                      </span>
                    ) : (
                      <>
                        <span
                          className={[
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs",
                            status === "mastered"
                              ? "bg-leaf/10 text-leaf"
                              : status === "basic"
                                ? "bg-wheat text-ink"
                                : "border border-coral/50 bg-white text-coral"
                          ].join(" ")}
                        >
                          {status === "review" ? (
                            <CircleDashed
                              aria-hidden="true"
                              className="h-3.5 w-3.5"
                            />
                          ) : (
                            <CheckCircle2
                              aria-hidden="true"
                              className="h-3.5 w-3.5"
                            />
                          )}
                          {statusLabel[status]}
                        </span>
                        <span className="text-xs text-ink/55">
                          最佳核心覆盖率{" "}
                          {Math.round(lessonProgress.bestCoreCoverage * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
