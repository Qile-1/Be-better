import type { LessonMasteryStatus } from "./types";

const STORAGE_KEY = "be-better-progress";
const STORAGE_VERSION = 2;

export type LessonProgress = {
  status: LessonMasteryStatus;
  bestCoreCoverage: number;
  attempts: number;
  pendingCorePointIds: string[];
  updatedAt: number;
  reviewStep: number;
  nextReviewAt: number;
};

export type Progress = {
  version: 2;
  lessons: Record<string, LessonProgress>;
};

const statusRank: Record<LessonMasteryStatus, number> = {
  review: 0,
  basic: 1,
  mastered: 2
};
const REVIEW_DELAYS_MS = [1, 3, 7, 14].map((days) => days * 24 * 60 * 60 * 1000);

function emptyProgress(): Progress {
  return {
    version: STORAGE_VERSION,
    lessons: {}
  };
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function isMasteryStatus(value: unknown): value is LessonMasteryStatus {
  return value === "review" || value === "basic" || value === "mastered";
}

function clampCoverage(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : 0;
}

function normalizeLessonProgress(value: unknown): LessonProgress | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const lesson = value as Record<string, unknown>;

  if (!isMasteryStatus(lesson.status)) {
    return null;
  }

  const updatedAt =
    typeof lesson.updatedAt === "number" && Number.isFinite(lesson.updatedAt)
      ? lesson.updatedAt
      : 0;
  const reviewStep =
    typeof lesson.reviewStep === "number" && Number.isFinite(lesson.reviewStep)
      ? Math.min(REVIEW_DELAYS_MS.length - 1, Math.max(0, Math.floor(lesson.reviewStep)))
      : 0;

  return {
    status: lesson.status,
    bestCoreCoverage: clampCoverage(lesson.bestCoreCoverage),
    attempts:
      typeof lesson.attempts === "number" && Number.isFinite(lesson.attempts)
        ? Math.max(0, Math.floor(lesson.attempts))
        : 0,
    pendingCorePointIds: Array.isArray(lesson.pendingCorePointIds)
      ? Array.from(
          new Set(
            lesson.pendingCorePointIds.filter(
              (id): id is string => typeof id === "string" && Boolean(id)
            )
          )
        )
      : [],
    updatedAt,
    reviewStep,
    nextReviewAt:
      typeof lesson.nextReviewAt === "number" && Number.isFinite(lesson.nextReviewAt)
        ? lesson.nextReviewAt
        : lesson.status === "review"
          ? updatedAt
          : updatedAt + REVIEW_DELAYS_MS[0]
  };
}

export function getProgress(): Progress {
  if (!canUseLocalStorage()) {
    return emptyProgress();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return emptyProgress();
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    if (
      !parsed ||
      parsed.version !== STORAGE_VERSION ||
      !parsed.lessons ||
      typeof parsed.lessons !== "object"
    ) {
      return emptyProgress();
    }

    const lessons = Object.fromEntries(
      Object.entries(parsed.lessons as Record<string, unknown>)
        .map(([lessonId, lesson]) => [
          lessonId,
          normalizeLessonProgress(lesson)
        ] as const)
        .filter(
          (entry): entry is readonly [string, LessonProgress] =>
            entry[1] !== null
        )
    );

    return {
      version: STORAGE_VERSION,
      lessons
    };
  } catch {
    return emptyProgress();
  }
}

function saveProgress(progress: Progress) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function createLessonProgress(): LessonProgress {
  return {
    status: "review",
    bestCoreCoverage: 0,
    attempts: 0,
    pendingCorePointIds: [],
    updatedAt: Date.now(),
    reviewStep: 0,
    nextReviewAt: Date.now()
  };
}

function saveLessonProgress(lessonId: string, lesson: LessonProgress) {
  const progress = getProgress();

  saveProgress({
    version: STORAGE_VERSION,
    lessons: {
      ...progress.lessons,
      [lessonId]: lesson
    }
  });
}

export function markVideoChecked(_lessonId: string) {
  // 第一阶段完成不代表掌握，不单独写入 v2 进度。
}

export function incrementLessonAttempts(lessonId: string) {
  const progress = getProgress();
  const previous = progress.lessons[lessonId] ?? createLessonProgress();
  const attempts = previous.attempts + 1;

  saveLessonProgress(lessonId, {
    ...previous,
    attempts,
    updatedAt: Date.now()
  });

  return attempts;
}

export function saveMastery({
  lessonId,
  status,
  coreCoverage,
  lessonIndex,
  missingCorePointIds
}: {
  lessonId: string;
  status: LessonMasteryStatus;
  coreCoverage: number;
  lessonIndex: number;
  missingCorePointIds: string[];
}) {
  void lessonIndex;

  const progress = getProgress();
  const previous = progress.lessons[lessonId] ?? createLessonProgress();
  const normalizedCoverage = clampCoverage(coreCoverage);
  const statusImproved = statusRank[status] > statusRank[previous.status];
  const sameStatusImprovedCoverage =
    status === previous.status &&
    normalizedCoverage >= previous.bestCoreCoverage;
  const nextStatus = statusImproved ? status : previous.status;
  const shouldReplacePending =
    statusImproved || sameStatusImprovedCoverage || !progress.lessons[lessonId];
  const now = Date.now();
  const completedDueReview =
    status === "mastered" &&
    previous.status === "mastered" &&
    previous.nextReviewAt <= now;
  const reviewStep =
    completedDueReview
      ? Math.min(REVIEW_DELAYS_MS.length - 1, previous.reviewStep + 1)
      : status === "mastered" && previous.status === "mastered"
        ? previous.reviewStep
        : 0;
  const nextReviewAt =
    status === "review"
      ? now
      : status === "mastered" && previous.status === "mastered" && !completedDueReview
        ? previous.nextReviewAt
        : now + REVIEW_DELAYS_MS[reviewStep];

  saveLessonProgress(lessonId, {
    ...previous,
    status: nextStatus,
    bestCoreCoverage: Math.max(
      previous.bestCoreCoverage,
      normalizedCoverage
    ),
    pendingCorePointIds: shouldReplacePending
      ? Array.from(new Set(missingCorePointIds))
      : previous.pendingCorePointIds,
    updatedAt: now,
    reviewStep,
    nextReviewAt
  });
}
