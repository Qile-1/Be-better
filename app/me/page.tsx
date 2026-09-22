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
    <section className="px-5 py-7">
      <header className="mb-6 space-y-2">
        <p className="text-sm font-semibold text-coral">我的</p>
        <h1 className="text-3xl font-bold text-ink">学习账户</h1>
      </header>

      <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-ink">学习进度</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="已掌握" value={summary.mastered} tone="text-leaf" />
          <Stat label="基本掌握" value={summary.basic} tone="text-ink" />
          <Stat label="待复习" value={summary.review} tone="text-coral" />
          <Stat label="已学习" value={summary.learned} tone="text-ink" />
        </dl>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-lg bg-paper px-4 py-3">
      <dt className="text-xs text-ink/55">{label}</dt>
      <dd className={`mt-1 text-2xl font-bold ${tone}`}>{value} 节</dd>
    </div>
  );
}
