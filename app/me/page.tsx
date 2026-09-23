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
    <section className="px-5 py-7 md:px-10 md:py-10 lg:px-12 xl:px-14">
      <header className="mb-8 max-w-2xl space-y-3">
        <p className="inline-flex rounded-full bg-coral/10 px-3 py-1.5 text-xs font-bold text-coral">
          我的
        </p>
        <h1 className="text-3xl font-extrabold text-ink md:text-4xl">
          学习账户
        </h1>
        <p className="text-sm leading-6 text-ink/55">
          掌握度按核心要点覆盖率计算。
        </p>
      </header>

      <section>
        <h2 className="text-lg font-bold text-ink">学习进度</h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          <Stat
            label="已掌握"
            value={summary.mastered}
            tone="text-leaf"
            surface="border-leaf/15 bg-leaf/10"
          />
          <Stat
            label="基本掌握"
            value={summary.basic}
            tone="text-ink"
            surface="border-wheat bg-wheat/50"
          />
          <Stat
            label="待复习"
            value={summary.review}
            tone="text-coral"
            surface="border-coral/15 bg-coral/10"
          />
          <Stat
            label="已学习"
            value={summary.learned}
            tone="text-ink"
            surface="border-black/5 bg-paper"
          />
        </dl>
      </section>
    </section>
  );
}

function Stat({
  label,
  value,
  tone,
  surface
}: {
  label: string;
  value: number;
  tone: string;
  surface: string;
}) {
  return (
    <div
      className={`rounded-2xl border px-5 py-5 shadow-[0_10px_28px_rgba(22,32,25,0.05)] ${surface}`}
    >
      <dt className="text-sm font-semibold text-ink/55">{label}</dt>
      <dd className={`mt-2 text-3xl font-extrabold md:text-4xl ${tone}`}>
        {value}
        <span className="ml-1 text-sm font-semibold text-ink/45">节</span>
      </dd>
    </div>
  );
}
