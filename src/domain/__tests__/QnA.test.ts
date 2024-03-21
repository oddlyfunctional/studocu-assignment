import { createQnA } from "@/domain/core";
import { mockClock } from "@/lib/clock";
import { error, ok } from "@/lib/result";
import { describe, expect, it } from "@jest/globals";

describe("QnA", () => {
  const { setNow, clock } = mockClock();

  it("succeeds creating a new QnA", () => {
    const now = new Date();
    setNow(now);
    const qna = createQnA(
      { question: "some question", answer: "some answer" },
      clock
    );
    expect(qna).toEqual(
      ok({
        question: "some question",
        answer: "some answer",
        createdAt: now,
      })
    );
  });

  it("validates blank fields", () => {
    const qna = createQnA({ question: "", answer: "" }, clock);
    expect(qna).toEqual(
      error({
        question: "EMPTY_QUESTION",
        answer: "EMPTY_ANSWER",
      })
    );
  });
});
