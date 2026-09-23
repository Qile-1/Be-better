"use client";

import { ArrowRight, Play, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LESSONS } from "../lib/lessons";
import { getProgress } from "../lib/storage";

export default function HomePage() {
  const [masteredCount, setMasteredCount] = useState(0);
  const [learnedCount, setLearnedCount] = useState(0);

  useEffect(() => {
    const lessons = Object.values(getProgress().lessons);
    setMasteredCount(
      lessons.filter((lesson) => lesson.status === "mastered").length
    );
    setLearnedCount(lessons.length);
  }, []);

  const progress = Math.round((masteredCount / LESSONS.length) * 100);

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-6rem)] flex-col overflow-hidden px-5 py-7 md:min-h-[calc(100dvh-4.5rem)] md:px-10 md:py-10 lg:px-14 lg:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-20 -z-10 h-28 bg-gradient-to-r from-transparent via-leaf/10 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1/3 bottom-10 -z-10 h-20 bg-gradient-to-r from-transparent via-coral/10 to-transparent blur-3xl"
      />

      <header className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="rounded-full bg-leaf/10 px-3 py-1.5 text-leaf">
          四级阅读
        </span>
        <span className="rounded-full bg-wheat/45 px-3 py-1.5 text-ink/65">
          AI 费曼督学
        </span>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 py-8 md:gap-10">
        <div className="space-y-5">
          <p className="text-sm font-bold text-coral">CET-4 Reading</p>
          <h1 className="text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
            <span className="text-ink">Be </span>
            <span className="text-leaf">better</span>
          </h1>
          <div className="space-y-2">
            <p className="text-xl font-semibold leading-8 text-ink md:text-2xl">
              把阅读讲清楚，再去拿分。
            </p>
            <p className="text-sm leading-7 text-ink/55 md:text-base">
              用自己的话讲一遍，才算真的会。
            </p>
          </div>
        </div>

        <Link
          href="/learn"
          className="group rounded-2xl bg-gradient-to-br from-[#5b9472] to-leaf p-5 text-white shadow-[0_18px_40px_rgba(47,111,78,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(47,111,78,0.28)] md:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white/75">今日进度</p>
              <p className="mt-2 text-2xl font-bold">
                {learnedCount > 0
                  ? `已掌握 ${masteredCount} 节`
                  : "从第 1 节开始"}
              </p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <TrendingUp aria-hidden="true" className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm font-semibold">
            <span>{learnedCount > 0 ? "继续学习" : "开始第一节"}</span>
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition group-hover:translate-x-1"
            />
          </div>
        </Link>

        <Link
          href="/learn"
          className="inline-flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-leaf to-[#4f8a68] px-5 text-base font-bold text-white shadow-[0_14px_30px_rgba(47,111,78,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(47,111,78,0.28)]"
        >
          <Play aria-hidden="true" className="h-5 w-5 fill-white" />
          开始学习
        </Link>
      </div>
    </section>
  );
}
