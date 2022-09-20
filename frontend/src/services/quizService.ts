import API from "@services/API";
import { AnyRecord, Quiz, QuizTestResponse } from "@shared/types";

interface QuizResponse {
  data: Quiz;
}
export interface ListResponse<T> {
  data: T[];
  total: number;
  length: number;
  page?: number;
}

export const getPublishedQuiz = async (publishId: String) =>
  API.get<QuizResponse>(`/quiz/test/${publishId}`).then(
    ({ data }) => data?.data
  );

export const getQuizMarks = async (publishId: String, answers: AnyRecord) =>
  API.post<{ data: QuizTestResponse }>(`/quiz/test/${publishId}`, answers).then(
    ({ data }) => data?.data
  );

export const getQuizDetails = async (quizId: String) =>
  API.get(`/quiz/${quizId}`).then((res) => res.data);

export const getMyQuizList = async (page = 0, limit = 0) =>
  API.get<ListResponse<Quiz>>(`/quiz?page=${page}&limit=${limit}`).then(
    (res) => res.data
  );

export const addQuiz = async (quiz: Quiz) =>
  API.post<QuizResponse>("/quiz", quiz).then(({ data }) => data?.data);

export const updateQuiz = async (quiz: Quiz) =>
  API.put<QuizResponse>("/quiz", quiz).then(({ data }) => data?.data);

export const deleteQuizes = async (idList: string[]) =>
  API.delete<{ data: string[] }>("/quiz", {
    data: idList,
  }).then(({ data }) => data?.data);
