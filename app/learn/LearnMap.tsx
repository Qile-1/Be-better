"use client";

import { ArrowUpRight } from "lucide-react";
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
    <div className="border-t border-ink/20">
      {LESSONS.map((lesson, index) => {
        const lessonProgress = progress?.lessons[lesson.id];
        const status = lessonProgress?.status;

        return (
          <Link
            key={lesson.id}
            href={`/learn/${lesson.id}`}
            className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-ink/15 py-6 transition hover:bg-paper/70 md:grid-cols-[4rem_minmax(0,1fr)_auto] md:gap-6 md:py-8"
          >
            <span className="self-start text-sm tabular-nums text-ink/45 md:pt-1">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-medium leading-6 text-ink md:text-lg">
                {lesson.title}
              </h2>
              <p className="mt-2 text-xs text-ink/50">
                {status ? statusLabel[status] : "未开始"}
                {lessonProgress && status
                  ? ` · 核心覆盖率 ${Math.round(lessonProgress.bestCoreCoverage * 100)}%`
                  : ""}
              </p>
            </div>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 text-ink/40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
            />
          </Link>
        );
      })}
    </div>
  );
}
