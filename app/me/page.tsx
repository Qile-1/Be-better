"use client";

import { useEffect, useMemo, useState } from "react";
import { getProgress, type Progress } from "../../lib/storage";

export default function MePage() {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const summary = useMemo(() => {
    const lessons = Object.values(progress?.lessons ?? {});

    return {
      mastered: lessons.filter((lesson) => lesson.status === "mastered").length,
      basic: lessons.filter((lesson) => lesson.status === "basic").length,
      review: lessons.filter((lesson) => lesson.status === "review").length,
      learned: lessons.length
    };
  }, [progress]);

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-12 md:px-12 md:py-16">
      <header className="mb-12 max-w-2xl">
        <p className="text-xs font-medium tracking-[0.18em] text-ink/45">
          MY PROGRESS
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-ink md:text-4xl">
          学习账户
        </h1>
        <p className="mt-5 text-sm leading-6 text-ink/55">
          掌握度按核心要点覆盖率计算。
        </p>
      </header>

      <section>
        <h2 className="text-base font-medium text-ink">学习进度</h2>
        <dl className="mt-5 grid grid-cols-2 border-t border-ink/20 md:grid-cols-4">
          <Stat
            label="已掌握"
            value={summary.mastered}
          />
          <Stat
            label="基本掌握"
            value={summary.basic}
          />
          <Stat
            label="待复习"
            value={summary.review}
          />
          <Stat
            label="已学习"
            value={summary.learned}
          />
        </dl>
      </section>
    </section>
  );
}

function Stat({
  label,
  value
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border-b border-ink/15 py-7 pr-4 md:py-8">
      <dt className="text-sm text-ink/50">{label}</dt>
      <dd className="mt-3 text-4xl font-semibold tabular-nums text-ink md:text-5xl">
        {value}
        <span className="ml-1 text-sm font-normal text-ink/45">节</span>
      </dd>
    </div>
  );
}
