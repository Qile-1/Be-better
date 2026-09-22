"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
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
  saveMastery
} from "../../../lib/storage";
import type {
  DiagnoseResult,
  Lesson,
  LessonMasteryStatus,
  MicroBlock,
  MicroLesson,
  RemedyResult,
  RubricPoint
} from "../../../lib/types";

type LessonStageProps = {
  lesson: Lesson;
  lessonIndex: number;
  nextLesson?: Lesson;
};

const steps = ["学微课", "复述", "诊断"];

type Stage = 1 | 2 | 3;
type DiagnoseResponse = DiagnoseResult | { error?: string };
type RemedyResponse = RemedyResult | { error?: string };

function isDiagnoseResult(value: DiagnoseResponse): value is DiagnoseResult {
  return (
    "coveredPointIds" in value &&
    "missedPointIds" in value &&
    "fatalErrorCount" in value
  );
}

function isRemedyResult(value: RemedyResponse): value is RemedyResult {
  return "remedyItems" in value && Array.isArray(value.remedyItems);
}

function getCoreCoverage(
  result: DiagnoseResult | null,
  corePoints: RubricPoint[]
) {
  if (!result || corePoints.length === 0) {
    return 0;
  }

  const coveredIds = new Set(result.coveredPointIds);
  const coveredCoreCount = corePoints.filter((point) =>
    coveredIds.has(point.id)
  ).length;

  return coveredCoreCount / corePoints.length;
}

function getMasteryStatus(
  result: DiagnoseResult,
  coreCoverage: number,
  attemptCount: number
): LessonMasteryStatus {
  if (result.fatalErrorCount > 0) {
    return "review";
  }

  if (coreCoverage === 1) {
    return "mastered";
  }

  if (attemptCount >= 2 && coreCoverage >= 0.6) {
    return "basic";
  }

  return "review";
}

export function LessonStage({
  lesson,
  lessonIndex,
  nextLesson
}: LessonStageProps) {
  const [stage, setStage] = useState<Stage>(1);
  const [userText, setUserText] = useState("");
  const [result, setResult] = useState<DiagnoseResult | null>(null);
  const [remedy, setRemedy] = useState<RemedyResult | null>(null);
  const [remedyLoading, setRemedyLoading] = useState(false);
  const [remedyError, setRemedyError] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const corePoints = useMemo(
    () => lesson.rubricPoints.filter((point) => point.tier === "core"),
    [lesson.rubricPoints]
  );
  const bonusPoints = useMemo(
    () => lesson.rubricPoints.filter((point) => point.tier === "bonus"),
    [lesson.rubricPoints]
  );
  const coveredIds = useMemo(
    () => new Set(result?.coveredPointIds ?? []),
    [result]
  );
  const coveredCorePoints = corePoints.filter((point) =>
    coveredIds.has(point.id)
  );
  const missedCorePoints = corePoints.filter(
    (point) => !coveredIds.has(point.id)
  );
  const coveredBonusPoints = bonusPoints.filter((point) =>
    coveredIds.has(point.id)
  );
  const missedBonusPoints = bonusPoints.filter(
    (point) => !coveredIds.has(point.id)
  );
  const coreCoverage = getCoreCoverage(result, corePoints);
  const masteryStatus = result
    ? getMasteryStatus(result, coreCoverage, attemptCount)
    : null;
  const canSubmit = userText.trim().length > 0 && !isSubmitting;
  const lessonNumber = String(lessonIndex + 1).padStart(2, "0");

  function handleVideoDone() {
    markVideoChecked(lesson.id);
    setStage(2);
  }

  function saveCurrentMastery(
    status: LessonMasteryStatus,
    diagnosis: DiagnoseResult,
    coverage: number
  ) {
    const diagnosisCoveredIds = new Set(diagnosis.coveredPointIds);
    const missingCorePointIds = corePoints
      .filter((point) => !diagnosisCoveredIds.has(point.id))
      .map((point) => point.id);

    saveMastery({
      lessonId: lesson.id,
      status,
      coreCoverage: coverage,
      lessonIndex,
      missingCorePointIds
    });
  }

  async function handleLoadRemedy(diagnosis: DiagnoseResult) {
    const diagnosisCoveredIds = new Set(diagnosis.coveredPointIds);
    const missingCorePointIds = corePoints
      .filter((point) => !diagnosisCoveredIds.has(point.id))
      .map((point) => point.id);

    setRemedyLoading(true);
    setRemedyError("");

    try {
      const response = await fetch("/api/remedy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lessonId: lesson.id,
          coveredPointIds: diagnosis.coveredPointIds,
          missedPointIds: missingCorePointIds,
          errors: diagnosis.errors,
          userText
        })
      });

      const data = (await response.json()) as RemedyResponse;

      if (!response.ok || !isRemedyResult(data)) {
        throw new Error("Remedy request failed");
      }

      setRemedy(data);
    } catch {
      setRemedyError("补讲没生成出来，点下面按钮重试");
    } finally {
      setRemedyLoading(false);
    }
  }

  async function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    const nextAttemptCount = attemptCount + 1;
    setAttemptCount(nextAttemptCount);
    setRemedyError("");
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

      const nextCoreCoverage = getCoreCoverage(data, corePoints);
      const nextMasteryStatus = getMasteryStatus(
        data,
        nextCoreCoverage,
        nextAttemptCount
      );

      setResult(data);
      saveCurrentMastery(nextMasteryStatus, data, nextCoreCoverage);
      setStage(3);

      if (nextMasteryStatus === "review" && nextAttemptCount === 1) {
        void handleLoadRemedy(data);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "网络波动，请再试一次"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function retryRetell(clearInput = true) {
    if (clearInput) {
      setUserText("");
    }
    setStage(2);
  }

  function markForReviewBeforeLeaving() {
    if (result) {
      saveCurrentMastery("review", result, coreCoverage);
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
          <MicroLessonContent microLesson={lesson.microLesson} />

          <details className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold text-ink">
              本节讲义要点
              <ChevronDown aria-hidden="true" className="h-5 w-5" />
            </summary>

            <div className="mt-4 space-y-5 text-sm leading-6 text-ink/75">
              <div>
                <p className="mb-2 font-semibold text-ink">复述任务</p>
                <p>{lesson.retellTask}</p>
                <p className="mt-2 text-ink/60">
                  必会点要能合上讲义脱稿讲出来；拓展点看懂即可，没讲到不影响过关。
                </p>
              </div>

              <RubricGroup
                title="必会点"
                badge="必会"
                points={corePoints}
                tone="core"
              />
              <RubricGroup
                title="拓展点"
                badge="看懂就行"
                points={bonusPoints}
                tone="bonus"
              />
            </div>
          </details>

          {lesson.keyWords && lesson.keyWords.length > 0 ? (
            <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
              <h2 className="font-bold text-ink">
                本节高频词（会认就行，不要求复述）
              </h2>
              <ul className="mt-3 space-y-2">
                {lesson.keyWords.map((item) => (
                  <li
                    key={item.word}
                    className="rounded-lg bg-paper px-3 py-2 text-sm leading-6"
                  >
                    <span className="font-semibold text-ink">{item.word}</span>
                    <span className="ml-2 text-ink/70">{item.meaning}</span>
                    {item.note ? (
                      <p className="text-xs text-ink/50">{item.note}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <button
            type="button"
            onClick={handleVideoDone}
            className="flex h-16 w-full items-center justify-center gap-2 rounded-lg bg-leaf px-5 text-base font-bold text-white shadow-soft transition active:scale-[0.99]"
          >
            <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
            我学完了，去讲一遍
          </button>
        </div>
      )}

      {stage === 2 && (
        <div className="space-y-5">
          {result && masteryStatus === "review" && missedCorePoints.length > 0 ? (
            <section className="rounded-lg border border-wheat bg-wheat/30 p-4">
              <h2 className="mb-3 font-bold text-ink">
                上一次还漏了这几点，这次重点讲清楚
              </h2>
              <ul className="space-y-2">
                {missedCorePoints.map((point) => (
                  <li
                    key={point.id}
                    className="rounded-lg bg-paper px-3 py-2 text-sm leading-6 text-ink/75"
                  >
                    {point.point}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

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

      {stage === 3 && result && masteryStatus && (
        <div className="space-y-4">
          <MasteryCard
            status={masteryStatus}
            coreCoverage={coreCoverage}
            attemptCount={attemptCount}
          />

          {coveredBonusPoints.length > 0 ? (
            <p className="rounded-lg bg-leaf/10 px-4 py-3 text-sm text-leaf">
              额外讲到 {coveredBonusPoints.length} 个拓展点
            </p>
          ) : null}

          <ResultBlock
            title="你讲清楚了这些"
            tone="green"
            items={coveredCorePoints.map((point) => point.point)}
            emptyText="还没有明确覆盖的核心点。"
          />

          <ResultBlock
            title="你漏掉了这些"
            tone="orange"
            items={missedCorePoints.map((point) => point.point)}
            emptyText="核心点没有遗漏。"
          />

          {bonusPoints.length > 0 ? (
            <BonusSummary
              coveredPoints={coveredBonusPoints}
              missedPoints={missedBonusPoints}
            />
          ) : null}

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

          {masteryStatus === "review" ? (
            <RemedySection
              remedy={remedy}
              isLoading={remedyLoading}
              errorMessage={remedyError}
              onRetry={() => void handleLoadRemedy(result)}
            />
          ) : null}

          <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-bold text-ink">鼓励一下</h3>
            <p className="text-sm leading-6 text-ink/70">
              {result.encouragement}
            </p>
          </section>

          {masteryStatus === "review" ? (
            <details className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold leading-6 text-ink">
                实在没思路？展开看完整讲法（建议先自己补讲）
                <ChevronDown
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                />
              </summary>
              <p className="mt-4 text-sm leading-6 text-ink/70">
                {result.modelAnswer}
              </p>
            </details>
          ) : (
            <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
              <h3 className="mb-2 font-bold text-ink">参考讲法</h3>
              <p className="text-sm leading-6 text-ink/70">
                {result.modelAnswer}
              </p>
            </section>
          )}

          {masteryStatus === "mastered" ? (
            <CompletedActions nextLesson={nextLesson} />
          ) : masteryStatus === "basic" ? (
            <BasicActions
              nextLesson={nextLesson}
              onRetry={() => retryRetell()}
            />
          ) : (
            <ReviewActions
              attemptCount={attemptCount}
              nextLesson={nextLesson}
              onRetry={() => retryRetell()}
              onReviewLesson={() => setStage(1)}
              onLeave={markForReviewBeforeLeaving}
            />
          )}
        </div>
      )}
    </section>
  );
}

function RubricGroup({
  title,
  badge,
  points,
  tone
}: {
  title: string;
  badge: string;
  points: RubricPoint[];
  tone: "core" | "bonus";
}) {
  if (points.length === 0) {
    return null;
  }

  const isCore = tone === "core";

  return (
    <div>
      <p className={`mb-2 font-semibold ${isCore ? "text-leaf" : "text-ink"}`}>
        {title}
      </p>
      <ul className="space-y-2">
        {points.map((point) => (
          <li
            key={point.id}
            className={[
              "rounded-lg border px-3 py-2",
              isCore
                ? "border-leaf/25 bg-leaf/10"
                : "border-black/5 bg-paper"
            ].join(" ")}
          >
            <span
              className={[
                "mr-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                isCore ? "bg-leaf text-white" : "bg-white text-ink/55"
              ].join(" ")}
            >
              {badge}
            </span>
            {point.point}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MasteryCard({
  status,
  coreCoverage,
  attemptCount
}: {
  status: LessonMasteryStatus;
  coreCoverage: number;
  attemptCount: number;
}) {
  const presentation = {
    mastered: {
      title: "已掌握",
      className: "border-leaf/25 bg-leaf/10"
    },
    basic: {
      title: "基本掌握",
      className: "border-wheat bg-wheat/40"
    },
    review: {
      title: "还差一点",
      className: "border-coral/25 bg-coral/10"
    }
  }[status];

  return (
    <div className={`rounded-lg border p-4 ${presentation.className}`}>
      <p className="text-sm font-semibold text-ink/60">
        核心点覆盖率 {Math.round(coreCoverage * 100)}%
      </p>
      <h2 className="mt-1 text-xl font-bold text-ink">
        {presentation.title}
      </h2>
      {status === "review" ? (
        <p className="mt-2 text-sm text-ink/60">
          这是你第 {attemptCount} 次复述
        </p>
      ) : null}
    </div>
  );
}

function BonusSummary({
  coveredPoints,
  missedPoints
}: {
  coveredPoints: RubricPoint[];
  missedPoints: RubricPoint[];
}) {
  return (
    <section className="rounded-lg border border-black/5 bg-paper p-4">
      <h3 className="font-bold text-ink">拓展点（不影响掌握度）</h3>
      <p className="mt-1 text-xs leading-5 text-ink/50">
        拓展点看懂即可，没讲到不影响本节结果。
      </p>
      <ul className="mt-3 space-y-2">
        {[...coveredPoints, ...missedPoints].map((point) => {
          const isCovered = coveredPoints.some(
            (covered) => covered.id === point.id
          );

          return (
            <li
              key={point.id}
              className="rounded-lg bg-white/75 px-3 py-2 text-sm leading-6 text-ink/65"
            >
              <span
                className={[
                  "mr-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                  isCovered
                    ? "bg-leaf/10 text-leaf"
                    : "bg-black/5 text-ink/45"
                ].join(" ")}
              >
                {isCovered ? "已讲到" : "看懂就行"}
              </span>
              {point.point}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function CompletedActions({ nextLesson }: { nextLesson?: Lesson }) {
  if (!nextLesson) {
    return (
      <div className="rounded-lg bg-leaf p-5 text-center text-white shadow-soft">
        <p className="text-lg font-bold">全部课程已完成</p>
        <p className="mt-1 text-sm text-white/80">这一轮讲得漂亮。</p>
      </div>
    );
  }

  return (
    <Link
      href={`/learn/${nextLesson.id}`}
      className="flex h-16 w-full items-center justify-center rounded-lg bg-leaf px-5 text-base font-bold text-white shadow-soft"
    >
      进入下一节
    </Link>
  );
}

function BasicActions({
  nextLesson,
  onRetry
}: {
  nextLesson?: Lesson;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-center text-sm leading-6 text-ink/60">
        基本掌握，漏掉的个别核心点会在复习中再出现
      </p>
      {nextLesson ? (
        <Link
          href={`/learn/${nextLesson.id}`}
          className="flex h-16 w-full items-center justify-center rounded-lg bg-leaf px-5 text-base font-bold text-white shadow-soft"
        >
          进入下一节
        </Link>
      ) : (
        <div className="rounded-lg bg-leaf p-5 text-center text-white shadow-soft">
          <p className="text-lg font-bold">全部课程已完成</p>
          <p className="mt-1 text-sm text-white/80">
            待复习点已经为你记下。
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={onRetry}
        className="h-12 w-full text-sm font-semibold text-leaf"
      >
        再讲一遍冲全掌握
      </button>
    </div>
  );
}

function ReviewActions({
  attemptCount,
  nextLesson,
  onRetry,
  onReviewLesson,
  onLeave
}: {
  attemptCount: number;
  nextLesson?: Lesson;
  onRetry: () => void;
  onReviewLesson: () => void;
  onLeave: () => void;
}) {
  const isFirstAttempt = attemptCount === 1;
  const nextHref = nextLesson ? `/learn/${nextLesson.id}` : "/learn";

  return (
    <div className="grid grid-cols-1 gap-3">
      <button
        type="button"
        onClick={onRetry}
        className="flex h-16 w-full items-center justify-center gap-2 rounded-lg bg-leaf px-5 text-base font-bold text-white shadow-soft"
      >
        <RotateCcw aria-hidden="true" className="h-5 w-5" />
        {isFirstAttempt ? "我补好了，脱稿再讲一遍" : "再讲一遍"}
      </button>

      {!isFirstAttempt ? (
        <Link
          href={nextHref}
          onClick={onLeave}
          className="flex h-14 w-full items-center justify-center rounded-lg border border-coral/25 bg-coral/10 px-5 text-sm font-bold text-coral"
        >
          {nextLesson
            ? "进入下一节（标记为待复习）"
            : "完成本轮（标记为待复习）"}
        </Link>
      ) : null}

      <button
        type="button"
        onClick={onReviewLesson}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-5 text-sm font-bold text-ink shadow-sm"
      >
        <ArrowLeft aria-hidden="true" className="h-5 w-5" />
        回看微课
      </button>

      {isFirstAttempt ? (
        <Link
          href={nextHref}
          onClick={onLeave}
          className="flex h-12 w-full items-center justify-center text-sm font-semibold text-ink/55"
        >
          {nextLesson
            ? "先进入下一节，这点之后再复习"
            : "先结束本轮，这点之后再复习"}
        </Link>
      ) : null}
    </div>
  );
}

function MicroLessonContent({
  microLesson
}: {
  microLesson?: MicroLesson;
}) {
  if (!microLesson) {
    return <p className="text-sm text-ink/60">本节微课内容筹备中</p>;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-coral">本节目标</h2>
        <p className="text-sm leading-7 text-ink/75">{microLesson.goal}</p>
      </section>

      <div>{renderBlocks(microLesson.blocks)}</div>
    </div>
  );
}

function renderBlocks(blocks: MicroBlock[]) {
  return blocks.map((block, index) => {
    const key = `${block.type}-${index}`;

    switch (block.type) {
      case "heading":
        return (
          <h2 key={key} className="mb-3 mt-6 text-base font-bold text-ink">
            {block.text}
          </h2>
        );
      case "paragraph":
        return (
          <p key={key} className="mb-4 text-sm leading-7 text-ink/75">
            {block.text}
          </p>
        );
      case "bullets":
        return (
          <ul key={key} className="mb-4 space-y-2">
            {block.items.map((item) => (
              <li key={item} className="rounded-lg bg-paper px-3 py-2">
                <span className="text-sm leading-6 text-ink/75">{item}</span>
              </li>
            ))}
          </ul>
        );
      case "tip":
        return (
          <div
            key={key}
            className="mb-4 rounded-lg border border-leaf/30 bg-leaf/10 p-3 text-sm leading-6 text-leaf"
          >
            {block.text}
          </div>
        );
      case "example":
        return (
          <section
            key={key}
            className="mb-4 rounded-lg border border-black/10 bg-white p-4 shadow-sm"
          >
            {block.title ? (
              <h3 className="mb-3 text-base font-bold text-ink">
                {block.title}
              </h3>
            ) : null}
            <p className="text-sm leading-7 text-ink/75">{block.question}</p>
            <p className="mt-3 text-sm leading-7 text-ink/75">
              <span className="font-semibold text-leaf">解析：</span>
              {block.analysis}
            </p>
          </section>
        );
    }
  });
}

function RemedySection({
  remedy,
  isLoading,
  errorMessage,
  onRetry
}: {
  remedy: RemedyResult | null;
  isLoading: boolean;
  errorMessage: string;
  onRetry: () => void;
}) {
  return (
    <section className="space-y-3">
      <h3 className="font-bold text-ink">针对性补讲</h3>

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-lg border border-leaf/25 bg-leaf/10 p-4 text-sm leading-6 text-leaf">
          <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
          正在根据你漏的点准备补讲...
        </div>
      ) : null}

      {errorMessage ? (
        <div className="flex gap-2 rounded-lg border border-coral/25 bg-coral/10 p-4 text-sm leading-6 text-coral">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5" />
          <p>{errorMessage}</p>
        </div>
      ) : null}

      {remedy ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-leaf/25 bg-leaf/10 p-4 text-sm leading-6 text-leaf">
            {remedy.recap}
          </div>

          {remedy.remedyItems.map((item, index) => {
            const isError = item.kind === "error";
            const Icon = isError ? XCircle : Lightbulb;

            return (
              <article
                key={`${item.kind}-${item.pointId}-${index}`}
                className={[
                  "rounded-lg border p-4",
                  isError
                    ? "border-coral/25 bg-coral/10"
                    : "border-wheat bg-wheat/30"
                ].join(" ")}
              >
                <div
                  className={[
                    "mb-3 flex items-center gap-2",
                    isError ? "text-coral" : "text-ink"
                  ].join(" ")}
                >
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                  <h4 className="font-bold">{item.title}</h4>
                </div>
                <p className="text-sm leading-6 text-ink/75">
                  {item.explanation}
                </p>
                <p className="mt-3 text-sm leading-6 text-ink/75">
                  <span className="font-semibold text-ink">例：</span>
                  {item.example}
                </p>
                <p className="mt-3 text-sm leading-6 text-leaf">
                  <span className="font-semibold">记住：</span>
                  {item.tip}
                </p>
              </article>
            );
          })}

          <p className="rounded-lg bg-paper px-4 py-3 text-sm leading-6 text-ink/70">
            {remedy.nextPrompt}
          </p>
        </div>
      ) : null}

      {!isLoading ? (
        <button
          type="button"
          onClick={onRetry}
          className="h-11 w-full rounded-lg border border-black/10 bg-white px-4 text-sm font-semibold text-ink/60"
        >
          {remedy ? "重新生成补讲" : "生成补讲"}
        </button>
      ) : null}
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
