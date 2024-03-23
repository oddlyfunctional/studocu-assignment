import type { Clock } from "@/lib/clock";
import { error, ok, type Result } from "@/lib/result";

// https://egghead.io/blog/using-branded-types-in-typescript
declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
export type Branded<T, B> = T & Brand<B>;

export type NonEmptyString = Branded<string, "NonEmptyString">;
export const makeNonEmptyString = (
  s: string
): Result<NonEmptyString, "NOT_EMPTY"> => {
  if (s === "") return error("NOT_EMPTY");
  return ok(s as NonEmptyString);
};

// it's easier to serialize/deserialize using number instead of Date
export type Timestamp = Branded<number, "Timestamp">;

export type QnAId = Branded<number, "QnAId">;
export type QnA = {
  id: QnAId;
  question: NonEmptyString;
  answer: NonEmptyString;
  createdAt: Timestamp;
};

export type QnAValidationErrors = {
  question?: "EMPTY_QUESTION";
  answer?: "EMPTY_ANSWER";
};
export const createQnA = (
  {
    question: unvalidatedQuestion,
    answer: unvalidatedAnswer,
  }: { question: string; answer: string },
  clock: Clock
): Result<Omit<QnA, "id">, QnAValidationErrors> => {
  const question = makeNonEmptyString(unvalidatedQuestion);
  const answer = makeNonEmptyString(unvalidatedAnswer);

  const errors: QnAValidationErrors = {};
  if (!question.ok || !answer.ok) {
    if (!question.ok) errors.question = "EMPTY_QUESTION";
    if (!answer.ok) errors.answer = "EMPTY_ANSWER";
    return error(errors);
  }

  return ok({
    question: question.value,
    answer: answer.value,
    createdAt: clock.now().getTime() as Timestamp,
  });
};

export const updateQnA = (
  qna: QnA,
  {
    question: unvalidatedQuestion,
    answer: unvalidatedAnswer,
  }: { question: string; answer: string }
): Result<Pick<QnA, "id" | "question" | "answer">, QnAValidationErrors> => {
  const question = makeNonEmptyString(unvalidatedQuestion);
  const answer = makeNonEmptyString(unvalidatedAnswer);

  const errors: QnAValidationErrors = {};
  if (!question.ok || !answer.ok) {
    if (!question.ok) errors.question = "EMPTY_QUESTION";
    if (!answer.ok) errors.answer = "EMPTY_ANSWER";
    return error(errors);
  }

  return ok({
    id: qna.id,
    question: question.value,
    answer: answer.value,
  });
};

export type QnARepository = {
  getAll: () => Promise<Result<QnA[], unknown>>;
  create: (
    qna: Pick<QnA, "question" | "answer" | "createdAt">
  ) => Promise<Result<QnAId, unknown>>;
  update: (
    qna: Pick<QnA, "id" | "question" | "answer">
  ) => Promise<Result<void, unknown>>;
  delete: (id: QnAId) => Promise<Result<void, unknown>>;
  deleteAll: () => Promise<Result<void, unknown>>;
};
