export interface RubricPoint {
  id: string;
  point: string;
  keyPhrases: string[];
  mustCover: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  video: { provider: "bilibili" | "youtube"; ref: string };
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
