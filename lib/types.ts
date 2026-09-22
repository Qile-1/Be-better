export interface RubricPoint {
  id: string;
  point: string;
  keyPhrases: string[];
  mustCover: boolean;
}

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
}

export interface Lesson {
  id: string;
  title: string;
  video?: { provider: "bilibili" | "youtube"; ref: string };
  microLesson?: MicroLesson;
  retellTask: string;
  rubricPoints: RubricPoint[];
  commonMistakes: string[];
  modelAnswer: string;
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
