"use client";

import { ArrowUpRight, BookOpen, CheckCircle2, Languages, PenLine } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LESSONS } from "../../lib/lessons";
import { getProgress, type Progress } from "../../lib/storage";
import type { Lesson, LessonMasteryStatus } from "../../lib/types";

const statusLabel: Record<LessonMasteryStatus, string> = {
  mastered: "已掌握", basic: "基本掌握", review: "待复习"
};

const groups = [
  { category: "reading", label: "阅读", note: "读懂文章，找到证据", Icon: BookOpen },
  { category: "writing", label: "写作", note: "审清任务，表达观点", Icon: PenLine },
  { category: "translation", label: "翻译", note: "保全信息，自然表达", Icon: Languages }
] as const;

export function LearnMap() {
  const [progress, setProgress] = useState<Progress | null>(null);
  useEffect(() => { setProgress(getProgress()); }, []);

  function courseRow(lesson: Lesson) {
    const lessonProgress = progress?.lessons[lesson.id];
    const status = lessonProgress?.status;
    const reviewDue = Boolean(lessonProgress && lessonProgress.nextReviewAt <= Date.now());
    const index = LESSONS.findIndex((item) => item.id === lesson.id);
    return (
      <Link key={lesson.id} href={`/learn/${lesson.id}`}
        className="group grid grid-cols-[1.75rem_minmax(0,1fr)_1rem] items-start gap-2.5 py-3.5 transition hover:bg-white/60 focus-visible:outline-offset-2">
        <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-ink/5 text-xs font-bold tabular-nums text-ink/60">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-6 text-ink">{lesson.title.replace(/^[^·]+·/, "")}</h3>
          <p className="mt-1 text-xs leading-5 text-ink/50">{lesson.alignment?.skills.slice(0, 2).join(" · ")}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs leading-5 text-ink/55">
            {status === "mastered" ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            <span className={status ? "font-semibold" : ""}>{reviewDue ? "建议复习" : status ? statusLabel[status] : "未开始"}</span>
            {lessonProgress && status ? <span>· 最佳覆盖 {Math.round(lessonProgress.bestCoreCoverage * 100)}%</span> : null}
          </p>
        </div>
        <ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 text-ink/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
      </Link>
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-5">
      {groups.map(({ category, label, note, Icon }, index) => {
        const lessons = LESSONS.filter((lesson) => (lesson.category ?? "reading") === category);
        return (
          <section key={category} aria-labelledby={`module-${category}`} data-module={category} className="min-w-0">
            <div className="mb-3 flex items-center gap-3 border-b-2 border-ink pb-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink text-white"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <h2 id={`module-${category}`} className="font-serif text-2xl font-black leading-8 text-ink">{label}</h2>
                <p className="text-xs leading-5 text-ink/50">{note}</p>
              </div>
              <span className="self-start text-xs font-semibold tabular-nums text-ink/40">0{index + 1} / {lessons.length} 节</span>
            </div>
            <div className="divide-y divide-ink/15 border-b border-ink/15">{lessons.map(courseRow)}</div>
          </section>
        );
      })}
    </div>
  );
}
