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

  const groups = [
    { category: "reading", label: "阅读", note: "三类题型与解题方法" },
    { category: "writing", label: "写作", note: "按主题练观点、例子与结构" },
    { category: "translation", label: "翻译", note: "按主题练信息与英文表达" }
  ] as const;

  return (
    <div>
      {groups.map((group) => (
        <section key={group.category} className="mb-12">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-ink/20 pb-4">
            <h2 className="text-xl font-semibold text-ink">{group.label}</h2>
            <p className="text-xs text-ink/50">{group.note}</p>
          </div>
          {LESSONS.map((lesson, index) => {
        if ((lesson.category ?? "reading") !== group.category) return null;
        const lessonProgress = progress?.lessons[lesson.id];
        const status = lessonProgress?.status;
        const reviewDue = Boolean(
          lessonProgress && lessonProgress.nextReviewAt <= Date.now()
        );

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
              <h3 className="text-base font-medium leading-6 text-ink md:text-lg">
                {lesson.title}
              </h3>
              <p className="mt-2 text-xs text-ink/50">
                {reviewDue ? "建议复习" : status ? statusLabel[status] : "未开始"}
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
        </section>
      ))}
    </div>
  );
}
