"use client";

import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LESSONS } from "../../lib/lessons";
import { getProgress, type Progress } from "../../lib/storage";
import type { Lesson, LessonMasteryStatus } from "../../lib/types";

const statusLabel: Record<LessonMasteryStatus, string> = { mastered: "已掌握", basic: "基本掌握", review: "待复习" };
const groups = [
  { category: "reading", label: "阅读", english: "Reading", note: "读懂文章，找到证据" },
  { category: "writing", label: "写作", english: "Writing", note: "审清任务，表达观点" },
  { category: "translation", label: "翻译", english: "Translation", note: "保全信息，自然表达" }
] as const;

export function LearnMap() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const params = useSearchParams();
  const requested = params.get("subject");
  const selected = groups.some((item) => item.category === requested) ? requested : "all";
  useEffect(() => { setProgress(getProgress()); }, []);
  function courseRow(lesson: Lesson) {
    const saved = progress?.lessons[lesson.id];
    const reviewDue = saved && saved.nextReviewAt <= Date.now();
    return (
      <Link key={lesson.id} href={`/learn/${lesson.id}`} className="course-row">
        <span className="course-number">{String(LESSONS.indexOf(lesson) + 1).padStart(2, "0")}</span>
        <div className="course-info"><h3>{lesson.title.replace(/^[^·]+·\s*/, "")}</h3><p>{lesson.alignment?.skills.slice(0, 2).join(" · ")}</p>
          <span className={`course-status ${saved?.status === "mastered" ? "mastered" : ""}`}>{saved?.status === "mastered" && <CheckCircle2 size={12} aria-hidden="true" />}{reviewDue ? "建议复习" : saved ? statusLabel[saved.status] : "未开始"}{saved ? ` · 最佳覆盖 ${Math.round(saved.bestCoreCoverage * 100)}%` : ""}</span>
        </div><ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    );
  }
  return (
    <>
      <nav className="map-filters" aria-label="课程分类"><Link href="/learn" aria-current={selected === "all" ? "page" : undefined}>全部课程 <span>{LESSONS.length}</span></Link>{groups.map((item) => <Link key={item.category} href={`/learn?subject=${item.category}`} aria-current={selected === item.category ? "page" : undefined}>{item.label}<span>{LESSONS.filter((lesson) => (lesson.category ?? "reading") === item.category).length}</span></Link>)}</nav>
      <div className={`course-columns ${selected !== "all" ? "course-columns-filtered" : ""}`}>{groups.filter((item) => selected === "all" || item.category === selected).map(({ category, label, english, note }) => (
        <section key={category} data-module={category} aria-labelledby={`module-${category}`}>
          <header className="course-group-heading"><div><p>{english}</p><h2 id={`module-${category}`}>{label}</h2></div><span>{note}</span></header>
          <div>{LESSONS.filter((lesson) => (lesson.category ?? "reading") === category).map(courseRow)}</div>
        </section>
      ))}</div>
      <p className="map-footnote">学微课 → 用自己的话复述 → 诊断与补讲。学习进度会保存在当前浏览器。</p>
    </>
  );
}
