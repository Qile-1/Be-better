export interface RubricPoint {
  id: string;
  point: string;
  keyPhrases: string[];
  tier: "core" | "bonus";
  mustCover: boolean;
}

export interface KeyWord {
  word: string;
  meaning: string;
  note?: string;
}

export type LessonMasteryStatus = "mastered" | "basic" | "review";

export type MicroBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "tip"; text: string }
  | {
      type: "example";
      title?: string;
      question: string;
      analysis: string;
    };

export interface MicroLesson {
  goal: string;
  blocks: MicroBlock[];
  advancedBlocks?: MicroBlock[];
}

export type PracticeOption = "A" | "B" | "C" | "D";

export interface PracticeQuestion {
  id: string;
  passage: string;
  prompt: string;
  options: Record<PracticeOption, string>;
  answer: PracticeOption;
  explanation: string;
  pointId: string;
}

export interface Lesson {
  id: string;
  title: string;
  video?: { provider: "bilibili" | "youtube"; ref: string };
  microLesson?: MicroLesson;
  keyWords?: KeyWord[];
  retellTask: string;
  rubricPoints: RubricPoint[];
  commonMistakes: string[];
  modelAnswer: string;
  practiceQuestions?: PracticeQuestion[];
}

export interface DiagnoseError {
  point: string;
  detail: string;
}

export interface DiagnoseResult {
  coveredPointIds: string[];
  missedPointIds: string[];
  errors: DiagnoseError[];
  fatalErrorCount: number;
  coverage: number;
  passed: boolean;
  modelAnswer: string;
  encouragement: string;
}

export type RemedyKind = "gap" | "error";

export interface RemedyItem {
  pointId: string;
  kind: RemedyKind;
  title: string;
  explanation: string;
  example: string;
  tip: string;
}

export interface RemedyResult {
  recap: string;
  remedyItems: RemedyItem[];
  nextPrompt: string;
}
