import { createQnA } from "@/domain/core";
import { mockClock } from "@/lib/clock";
import { mockRandom } from "@/lib/random";
import { error, ok } from "@/lib/result";
import { describe, expect, it } from "@jest/globals";

describe("QnA", () => {
  const { setNow, clock } = mockClock();
  const { setNextUuid, random } = mockRandom();

  it("succeeds creating a new QnA", () => {
    const id = "some id";
    setNextUuid(id);
    const now = new Date();
    setNow(now);
    const qna = createQnA(
      { question: "some question", answer: "some answer" },
      random,
      clock
    );
    expect(qna).toEqual(
      ok({
        id: "some id",
        question: "some question",
        answer: "some answer",
        createdAt: now,
      })
    );
  });

  it("validates blank fields", () => {
    const qna = createQnA({ question: "", answer: "" }, random, clock);
    expect(qna).toEqual(
      error({
        question: "EMPTY_QUESTION",
        answer: "EMPTY_ANSWER",
      })
    );
  });
});
