const STORAGE_KEY = "be-better-progress";

export type LessonStatus = "not_started" | "video_checked" | "completed";

export type LessonProgress = {
  status: LessonStatus;
  bestCoverage: number;
  attempts: number;
  results: Array<{
    coverage: number;
    passed: boolean;
    createdAt: string;
  }>;
};

export type Progress = {
  unlockedIndex: number;
  lessons: Record<string, LessonProgress>;
  streak: number;
};

const defaultProgress: Progress = {
  unlockedIndex: 0,
  lessons: {},
  streak: 0
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function normalizeProgress(progress: Partial<Progress> | null): Progress {
  const lessons = Object.fromEntries(
    Object.entries(progress?.lessons ?? {}).map(([lessonId, lesson]) => [
      lessonId,
      normalizeLessonProgress(lesson)
    ])
  );

  return {
    unlockedIndex:
      typeof progress?.unlockedIndex === "number"
        ? progress.unlockedIndex
        : defaultProgress.unlockedIndex,
    lessons,
    streak:
      typeof progress?.streak === "number"
        ? progress.streak
        : defaultProgress.streak
  };
}

function normalizeLessonProgress(
  lesson: Partial<LessonProgress> | undefined
): LessonProgress {
  return {
    status: lesson?.status ?? "not_started",
    bestCoverage:
      typeof lesson?.bestCoverage === "number" ? lesson.bestCoverage : 0,
    attempts: typeof lesson?.attempts === "number" ? lesson.attempts : 0,
    results: Array.isArray(lesson?.results) ? lesson.results : []
  };
}

export function getProgress(): Progress {
  if (!canUseLocalStorage()) {
    return defaultProgress;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return defaultProgress;
  }

  try {
    return normalizeProgress(JSON.parse(raw) as Partial<Progress>);
  } catch {
    return defaultProgress;
  }
}

export function saveLessonResult(
  lessonId: string,
  result: Partial<LessonProgress>
) {
  if (!canUseLocalStorage()) {
    return;
  }

  const progress = getProgress();
  const previous = normalizeLessonProgress(progress.lessons[lessonId]);

  const nextProgress: Progress = {
    ...progress,
    lessons: {
      ...progress.lessons,
      [lessonId]: {
        ...previous,
        ...result
      }
    }
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProgress));
}

export function getUnlockedIndex() {
  return getProgress().unlockedIndex;
}

export function setUnlockedIndex(unlockedIndex: number) {
  if (!canUseLocalStorage()) {
    return;
  }

  const progress = getProgress();
  const nextProgress: Progress = {
    ...progress,
    unlockedIndex: Math.max(progress.unlockedIndex, unlockedIndex)
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProgress));
}

export function markVideoChecked(lessonId: string) {
  const progress = getProgress();
  const previous = normalizeLessonProgress(progress.lessons[lessonId]);

  saveLessonResult(lessonId, {
    status:
      previous.status === "completed" ? "completed" : "video_checked"
  });
}

export function incrementLessonAttempts(lessonId: string) {
  const progress = getProgress();
  const previous = normalizeLessonProgress(progress.lessons[lessonId]);
  const attempts = previous.attempts + 1;

  saveLessonResult(lessonId, { attempts });

  return attempts;
}

export function saveDiagnosisResult({
  lessonId,
  coverage,
  passed,
  lessonIndex
}: {
  lessonId: string;
  coverage: number;
  passed: boolean;
  lessonIndex: number;
}) {
  const progress = getProgress();
  const previous = normalizeLessonProgress(progress.lessons[lessonId]);
  const nextStatus: LessonStatus = passed ? "completed" : previous.status;
  const bestCoverage = Math.max(previous.bestCoverage, coverage);

  saveLessonResult(lessonId, {
    status: nextStatus,
    bestCoverage,
    results: [
      ...previous.results,
      {
        coverage,
        passed,
        createdAt: new Date().toISOString()
      }
    ]
  });

  if (passed) {
    setUnlockedIndex(lessonIndex + 1);
  }
}
