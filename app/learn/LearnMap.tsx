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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {LESSONS.map((lesson, index) => {
        const lessonProgress = progress?.lessons[lesson.id];
        const status = lessonProgress?.status;

        return (
          <Link
            key={lesson.id}
            href={`/learn/${lesson.id}`}
            className="group block h-full"
          >
            <article className="h-full rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_30px_rgba(22,32,25,0.06)] transition duration-200 group-hover:-translate-y-0.5 group-hover:border-leaf/35 group-hover:shadow-[0_16px_36px_rgba(22,32,25,0.10)]">
              <div className="flex items-start gap-4">
                <div
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm",
                    status === "mastered"
                      ? "bg-gradient-to-br from-[#5b9472] to-leaf text-white"
                      : status === "basic"
                        ? "bg-gradient-to-br from-[#f3e9c9] to-wheat text-ink"
                        : status === "review"
                          ? "bg-coral/10 text-coral"
                          : "bg-paper text-ink/60"
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
                      <span className="inline-flex items-center gap-1 rounded-lg bg-black/5 px-2.5 py-1 text-xs text-ink/55">
                        <PlayCircle aria-hidden="true" className="h-3.5 w-3.5" />
                        未学
                      </span>
                    ) : (
                      <>
                        <span
                          className={[
                            "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold",
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
