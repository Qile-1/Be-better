"use client";

import { ArrowRight } from "lucide-react";
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
    <section className="mx-auto flex min-h-[calc(100dvh-6rem)] w-full max-w-4xl flex-col px-6 pb-12 pt-12 md:min-h-[calc(100dvh-4.5rem)] md:px-12 md:pt-20">
      <p className="text-xs font-medium tracking-[0.18em] text-ink/45">
        CET-4 · AI 费曼督学
      </p>

      <div className="flex flex-1 flex-col justify-center py-16 md:py-24">
        <p className="mb-5 text-sm text-ink/55">每次只专注一件事</p>
        <h1 className="max-w-2xl text-[clamp(3.4rem,9vw,6rem)] leading-[1.02] text-ink">
          Be better<span className="text-ink/30">.</span>
        </h1>
        <p className="mt-8 max-w-xl text-xl font-medium leading-relaxed md:text-2xl">
          把阅读、写作、翻译的方法讲清楚，再动手练。
        </p>
        <p className="mt-2 text-sm leading-7 text-ink/55 md:text-base">
          学一个要点，用自己的话讲一遍，再看哪里需要补。
        </p>

        <Link
          href="/learn"
          className="mt-10 inline-flex h-14 w-full items-center justify-between bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/85 sm:w-64"
        >
          {reviewDueCount > 0
            ? `复习 ${reviewDueCount} 节待巩固内容`
            : learnedCount > 0
              ? "继续学习"
              : "开始第一节"}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <Link href="/learn" className="group block border-t border-ink/15 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-xs text-ink/50">学习进度</p>
            <p className="mt-1 text-sm font-medium">
              已掌握 {masteredCount} / {LESSONS.length} 节
            </p>
          </div>
          <span className="text-sm tabular-nums text-ink/55">{progress}%</span>
        </div>
        <div className="mt-4 h-1 bg-ink/10">
          <div
            className="h-full bg-ink transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Link>
    </section>
  );
}
