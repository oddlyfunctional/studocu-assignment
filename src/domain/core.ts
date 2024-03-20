import type { Clock } from "@/lib/clock";
import type { Random } from "@/lib/random";
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

export type Uuid = string;

export type QnAId = Uuid;
export type QnA = {
  id: QnAId;
  question: NonEmptyString;
  answer: NonEmptyString;
  createdAt: Date;
};

export type CreateQnAError = "EMPTY_QUESTION" | "EMPTY_ANSWER";
export const createQnA = (
  {
    question: unvalidatedQuestion,
    answer: unvalidatedAnswer,
  }: { question: string; answer: string },
  random: Random,
  clock: Clock
): Result<Readonly<QnA>, CreateQnAError> => {
  const question = makeNonEmptyString(unvalidatedQuestion);
  if (!question.ok) return error("EMPTY_QUESTION");

  const answer = makeNonEmptyString(unvalidatedAnswer);
  if (!answer.ok) return error("EMPTY_ANSWER");

  return ok({
    question: question.value,
    answer: answer.value,
    id: random.nextUuid(),
    createdAt: clock.now(),
  });
};
