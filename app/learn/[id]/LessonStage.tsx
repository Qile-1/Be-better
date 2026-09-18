"use client";

import { ChevronDown, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { useState } from "react";
import { saveLessonResult } from "../../../lib/storage";
import type { Lesson } from "../../../lib/types";

type LessonStageProps = {
  lesson: Lesson;
};

const steps = ["看视频", "复述", "诊断"];

export function LessonStage({ lesson }: LessonStageProps) {
  const [stage, setStage] = useState<1 | 2 | 3>(1);

  function handleVideoDone() {
    saveLessonResult(lesson.id, { status: "video_checked" });
    setStage(2);
  }

  return (
    <section className="px-5 py-6">
      <header className="mb-5 space-y-3">
        <p className="text-sm font-semibold text-coral">第 01 节</p>
        <h1 className="text-2xl font-bold leading-8 text-ink">
          {lesson.title}
        </h1>
      </header>

      <ol className="mb-6 grid grid-cols-3 gap-2">
        {steps.map((label, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3;
          const isActive = stage === stepNumber;
          const isDone = stage > stepNumber;

          return (
            <li
              key={label}
              className={[
                "rounded-lg border px-2 py-3 text-center text-xs font-semibold",
                isActive
                  ? "border-leaf bg-leaf text-white"
                  : isDone
                    ? "border-leaf/20 bg-leaf/10 text-leaf"
                    : "border-black/10 bg-white text-ink/45"
              ].join(" ")}
            >
              <span className="mb-1 block text-base">{index + 1}</span>
              {label}
            </li>
          );
        })}
      </ol>

      {stage === 1 ? (
        <div className="space-y-5">
          <div className="overflow-hidden rounded-lg border border-black/10 bg-black">
            <div className="aspect-video w-full">
              <iframe
                title={lesson.title}
                src={`https://player.bilibili.com/player.html?bvid=${lesson.video.ref}&high_quality=1`}
                allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>

          <details className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold text-ink">
              本节讲义要点
              <ChevronDown aria-hidden="true" className="h-5 w-5" />
            </summary>

            <div className="mt-4 space-y-4 text-sm leading-6 text-ink/75">
              <div>
                <p className="mb-2 font-semibold text-ink">复述任务</p>
                <p>{lesson.retellTask}</p>
              </div>

              <div>
                <p className="mb-2 font-semibold text-ink">必须讲清楚</p>
                <ul className="space-y-2">
                  {lesson.rubricPoints.map((point) => (
                    <li
                      key={point.id}
                      className="rounded-lg bg-paper px-3 py-2"
                    >
                      {point.point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          <button
            type="button"
            onClick={handleVideoDone}
            className="flex h-16 w-full items-center justify-center gap-2 rounded-lg bg-leaf px-5 text-base font-bold text-white shadow-soft transition active:scale-[0.99]"
          >
            <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
            我看完了，去讲一遍
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-lg border border-black/10 bg-white p-5 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-black/5 text-ink/45">
              {stage === 2 ? (
                <PlayCircle aria-hidden="true" className="h-6 w-6" />
              ) : (
                <Lock aria-hidden="true" className="h-6 w-6" />
              )}
            </div>
            <h2 className="text-lg font-bold text-ink">复述与诊断即将上线</h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              今天先完成看视频阶段，后续再接入复述与诊断流程。
            </p>
          </div>

          <button
            type="button"
            disabled
            className="h-16 w-full rounded-lg bg-black/10 px-5 text-base font-bold text-ink/35"
          >
            即将开放
          </button>
        </div>
      )}
    </section>
  );
}
