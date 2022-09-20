export type AnyRecord<T = any> = Record<string, T>;

export interface Error {
  data: {
    message: string;
    status: number;
  };
}
export interface User {
  _id: string;
  email: string;
}
export interface QuizOption {
  value: string;
  _id: string;
}
export interface Question {
  _id: string;
  question: string;
  answers: string[];
  options: Array<QuizOption>;
  isMultipleChoice?: boolean;
}
export interface Quiz {
  _id?: string;
  title: string;
  questions: Question[];
  published: boolean;
  publishId?: string;
}
export interface QuizTestResponse {
  marks: number;
  total: number;
  message: string;
}
