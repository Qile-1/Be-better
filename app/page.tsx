"use client";

import { ArrowRight, BookOpenText, PenLine, Languages, Sprout, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LESSONS } from "../lib/lessons";
import { getProgress } from "../lib/storage";

export default function HomePage() {
  const [masteredCount, setMasteredCount] = useState(0);
  const [learnedCount, setLearnedCount] = useState(0);
  const [reviewDueCount, setReviewDueCount] = useState(0);

  useEffect(() => {
    const lessons = Object.values(getProgress().lessons);
    setMasteredCount(
      lessons.filter((lesson) => lesson.status === "mastered").length
    );
    setLearnedCount(lessons.length);
    setReviewDueCount(
      lessons.filter((lesson) => lesson.nextReviewAt <= Date.now()).length
    );
  }, []);

  const progress = Math.round((masteredCount / LESSONS.length) * 100);

  return (
    <section className="mx-auto w-full px-5 py-6 md:px-8 md:py-8 lg:px-12 lg:py-10">
      <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-medium text-ink/60">
        <Sprout aria-hidden="true" className="h-3.5 w-3.5" />
        CET-4 · AI 费曼督学
      </p>

      <div className="border-b border-ink/10 pb-6 pt-4 md:pb-8">
        <h1 className="text-4xl leading-tight text-ink [letter-spacing:0] md:text-5xl">
          Be better
        </h1>
        <p className="mt-3 text-base font-medium leading-7 md:text-xl">
          把阅读、写作、翻译的方法讲清楚，再动手练。
        </p>
        <p className="mt-1 text-sm leading-6 text-ink/55">
          学一个要点，用自己的话讲一遍，再看哪里需要补。
        </p>

        <Link
          href="/learn"
          className="mt-5 inline-flex h-12 w-full items-center justify-between gap-8 rounded-xl bg-ink px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(32,34,35,0.15)] transition hover:-translate-y-0.5 hover:bg-ink/85 sm:w-auto"
        >
          {reviewDueCount > 0
            ? `复习 ${reviewDueCount} 节待巩固内容`
            : learnedCount > 0
              ? "继续学习"
              : "开始第一节"}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 py-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-8">
      <Link href="/learn" className="group block rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_6px_24px_rgba(32,34,35,0.04)] md:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm text-[#35634c]"><CheckCircle2 aria-hidden="true" className="h-4 w-4" />学习进度</p>
            <p className="mt-3 text-lg font-semibold">
              已掌握 {masteredCount} / {LESSONS.length} 节
            </p>
          </div>
          <span className="text-sm tabular-nums text-ink/55">{progress}%</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-ink transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 flex items-center justify-between text-xs text-ink/50">每讲清一个要点，就向前一步。<ArrowRight aria-hidden="true" className="h-4 w-4 text-ink/50" /></p>
      </Link>
      <dl className="grid grid-cols-3 items-center gap-3">
        {[
          { label: "已学习", value: learnedCount, color: "text-ink" },
          { label: "已掌握", value: masteredCount, color: "text-[#35634c]" },
          { label: "待复习", value: reviewDueCount, color: "text-ink" }
        ].map((stat) => (
          <div key={stat.label} className="border-l border-ink/10 pl-4 md:pl-6">
            <dt className="text-xs text-ink/50 md:text-sm">{stat.label}</dt>
            <dd className={`mt-2 text-2xl font-semibold tabular-nums md:text-3xl ${stat.color}`}>{stat.value}<span className="ml-1 text-xs font-normal text-ink/40">节</span></dd>
          </div>
        ))}
      </dl>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">从一个小目标开始</h2>
        <Link href="/learn" className="inline-flex min-h-10 items-center gap-1 text-xs text-ink/60">全部课程<ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></Link>
      </div>
      <div className="grid gap-3 md:grid-cols-3 md:gap-5">
        {[
          { title: "阅读", text: "读懂文章，讲清解题思路", Icon: BookOpenText, color: "bg-paper text-ink/70" },
          { title: "写作", text: "理清结构，把观点写明白", Icon: PenLine, color: "bg-paper text-ink/70" },
          { title: "翻译", text: "拆解句子，准确表达意思", Icon: Languages, color: "bg-paper text-ink/70" }
        ].map(({ title, text, Icon, color }) => (
          <Link key={title} href="/learn" className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-md md:p-5">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}><Icon aria-hidden="true" className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-ink/50">{text}</p></div>
            <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink/30 group-hover:text-ink" />
          </Link>
        ))}
      </div>
    </section>
  );
}
