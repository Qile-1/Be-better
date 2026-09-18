"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Loader2,
  RotateCcw,
  Send,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  incrementLessonAttempts,
  markVideoChecked,
  saveDiagnosisResult
} from "../../../lib/storage";
import type { DiagnoseResult, Lesson, RubricPoint } from "../../../lib/types";

type LessonStageProps = {
  lesson: Lesson;
  lessonIndex: number;
  nextLesson?: Lesson;
};

const steps = ["看视频", "复述", "诊断"];

type Stage = 1 | 2 | 3;

type DiagnoseResponse = DiagnoseResult | { error?: string };

function isDiagnoseResult(value: DiagnoseResponse): value is DiagnoseResult {
  return (
    "coveredPointIds" in value &&
    "missedPointIds" in value &&
    "fatalErrorCount" in value
  );
}

function getPointMap(points: RubricPoint[]) {
  return new Map(points.map((point) => [point.id, point.point]));
}

function getPointsByIds(pointMap: Map<string, string>, ids: string[]) {
  return ids
    .map((id) => ({ id, point: pointMap.get(id) }))
    .filter((item): item is { id: string; point: string } =>
      Boolean(item.point)
    );
}

function getCoverage(result: DiagnoseResult | null, total: number) {
  if (!result || total <= 0) {
    return 0;
  }

  return result.coveredPointIds.length / total;
}

export function LessonStage({
  lesson,
  lessonIndex,
  nextLesson
}: LessonStageProps) {
  const [stage, setStage] = useState<Stage>(1);
  const [userText, setUserText] = useState("");
  const [result, setResult] = useState<DiagnoseResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pointMap = useMemo(
    () => getPointMap(lesson.rubricPoints),
    [lesson.rubricPoints]
  );
  const coveredPoints = useMemo(
    () => getPointsByIds(pointMap, result?.coveredPointIds ?? []),
    [pointMap, result]
  );
  const missedPoints = useMemo(
    () => getPointsByIds(pointMap, result?.missedPointIds ?? []),
    [pointMap, result]
  );
  const recalculatedCoverage = getCoverage(result, lesson.rubricPoints.length);
  const passed =
    result !== null &&
    recalculatedCoverage >= 0.7 &&
    result.fatalErrorCount === 0;
  const canSubmit = userText.trim().length > 0 && !isSubmitting;
  const lessonNumber = String(lessonIndex + 1).padStart(2, "0");

  function handleVideoDone() {
    markVideoChecked(lesson.id);
    setStage(2);
  }

  async function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    incrementLessonAttempts(lesson.id);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lessonId: lesson.id,
          userText
        })
      });

      const data = (await response.json()) as DiagnoseResponse;

      if (!response.ok || !isDiagnoseResult(data)) {
        throw new Error(
          "error" in data && data.error ? data.error : "网络波动，请再试一次"
        );
      }

      const nextResult = data;
      const nextCoverage = getCoverage(nextResult, lesson.rubricPoints.length);
      const nextPassed =
        nextCoverage >= 0.7 && nextResult.fatalErrorCount === 0;

      setResult(nextResult);
      saveDiagnosisResult({
        lessonId: lesson.id,
        coverage: nextCoverage,
        passed: nextPassed,
        lessonIndex
      });
      setStage(3);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "网络波动，请再试一次"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="px-5 py-6">
      <header className="mb-5 space-y-3">
        <p className="text-sm font-semibold text-coral">第 {lessonNumber} 节</p>
        <h1 className="text-2xl font-bold leading-8 text-ink">
          {lesson.title}
        </h1>
      </header>

      <ol className="mb-6 grid grid-cols-3 gap-2">
        {steps.map((label, index) => {
          const stepNumber = (index + 1) as Stage;
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

      {stage === 1 && (
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
      )}

      {stage === 2 && (
        <div className="space-y-5">
          <label className="block space-y-3">
            <span className="text-base font-semibold text-ink">
              用自己的话讲一遍
            </span>
            <textarea
              value={userText}
              onChange={(event) => setUserText(event.target.value)}
              placeholder="不用背讲义，像教同学一样说清楚：怎么识别题型、去哪里找主旨、怎么排除干扰项。"
              className="min-h-72 w-full resize-none rounded-lg border border-black/10 bg-white p-4 text-base leading-7 text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-leaf focus:ring-2 focus:ring-leaf/20"
            />
          </label>

          {errorMessage ? (
            <div className="flex gap-2 rounded-lg border border-coral/25 bg-coral/10 p-3 text-sm leading-6 text-coral">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5" />
              <p>{errorMessage}</p>
            </div>
          ) : null}

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={[
              "flex h-16 w-full items-center justify-center gap-2 rounded-lg px-5 text-base font-bold shadow-soft transition",
              canSubmit
                ? "bg-leaf text-white active:scale-[0.99]"
                : "bg-black/10 text-ink/35"
            ].join(" ")}
          >
            {isSubmitting ? (
              <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
            ) : (
              <Send aria-hidden="true" className="h-5 w-5" />
            )}
            {isSubmitting ? "诊断中..." : "提交给 AI 诊断"}
          </button>
        </div>
      )}

      {stage === 3 && result && (
        <div className="space-y-4">
          <div
            className={[
              "rounded-lg border p-4",
              passed
                ? "border-leaf/25 bg-leaf/10"
                : "border-coral/25 bg-coral/10"
            ].join(" ")}
          >
            <p className="text-sm font-semibold text-ink/60">
              本次覆盖率 {Math.round(recalculatedCoverage * 100)}%
            </p>
            <h2 className="mt-1 text-xl font-bold text-ink">
              {passed ? "达标了，下一节已解锁" : "还差一点，再补讲一次"}
            </h2>
          </div>

          <ResultBlock
            title="你讲清楚了这些"
            tone="green"
            items={coveredPoints.map((point) => point.point)}
            emptyText="还没有明确覆盖的要点。"
          />

          <ResultBlock
            title="你漏掉了这些"
            tone="orange"
            items={missedPoints.map((point) => point.point)}
            emptyText="没有遗漏要点。"
          />

          {result.errors.length > 0 ? (
            <section className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-red-700">
                <XCircle aria-hidden="true" className="h-5 w-5" />
                <h3 className="font-bold">这里讲错了</h3>
              </div>
              <ul className="space-y-2">
                {result.errors.map((error, index) => (
                  <li
                    key={`${error.point}-${index}`}
                    className="rounded-lg bg-white/70 p-3 text-sm leading-6 text-red-900"
                  >
                    <p className="font-semibold">{error.point}</p>
                    <p>{error.detail}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-bold text-ink">鼓励一下</h3>
            <p className="text-sm leading-6 text-ink/70">
              {result.encouragement}
            </p>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-bold text-ink">参考讲法</h3>
            <p className="text-sm leading-6 text-ink/70">
              {result.modelAnswer}
            </p>
          </section>

          {passed ? (
            nextLesson ? (
              <Link
                href={`/learn/${nextLesson.id}`}
                className="flex h-16 w-full items-center justify-center rounded-lg bg-leaf px-5 text-base font-bold text-white shadow-soft"
              >
                进入下一节
              </Link>
            ) : (
              <div className="rounded-lg bg-leaf p-5 text-center text-white shadow-soft">
                <p className="text-lg font-bold">全部课程已完成</p>
                <p className="mt-1 text-sm text-white/80">这一轮讲得漂亮。</p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setStage(2)}
                className="flex h-16 w-full items-center justify-center gap-2 rounded-lg bg-leaf px-5 text-base font-bold text-white shadow-soft"
              >
                <RotateCcw aria-hidden="true" className="h-5 w-5" />
                我再讲一遍
              </button>
              <button
                type="button"
                onClick={() => setStage(1)}
                className="flex h-16 w-full items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-5 text-base font-bold text-ink shadow-sm"
              >
                <ArrowLeft aria-hidden="true" className="h-5 w-5" />
                回看视频
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ResultBlock({
  title,
  tone,
  items,
  emptyText
}: {
  title: string;
  tone: "green" | "orange";
  items: string[];
  emptyText: string;
}) {
  const isGreen = tone === "green";

  return (
    <section
      className={[
        "rounded-lg border p-4",
        isGreen ? "border-leaf/25 bg-leaf/10" : "border-wheat bg-wheat/30"
      ].join(" ")}
    >
      <h3
        className={[
          "mb-3 font-bold",
          isGreen ? "text-leaf" : "text-ink"
        ].join(" ")}
      >
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-lg bg-white/75 p-3 text-sm leading-6 text-ink/75"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-6 text-ink/60">{emptyText}</p>
      )}
    </section>
  );
}
