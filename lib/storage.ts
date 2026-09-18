const STORAGE_KEY = "be-better-progress";

export type LessonStatus = "not_started" | "video_checked" | "completed";

export type LessonProgress = {
  status: LessonStatus;
  bestCoverage: number;
  attempts: number;
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
  return {
    unlockedIndex:
      typeof progress?.unlockedIndex === "number"
        ? progress.unlockedIndex
        : defaultProgress.unlockedIndex,
    lessons: progress?.lessons ?? defaultProgress.lessons,
    streak:
      typeof progress?.streak === "number"
        ? progress.streak
        : defaultProgress.streak
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
  const previous = progress.lessons[lessonId] ?? {
    status: "not_started",
    bestCoverage: 0,
    attempts: 0
  };

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
