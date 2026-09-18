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
