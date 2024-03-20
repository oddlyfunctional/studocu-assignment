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

  it("fails if question is blank", () => {
    const qna = createQnA(
      { question: "", answer: "some answer" },
      random,
      clock
    );
    expect(qna).toEqual(error("EMPTY_QUESTION"));
  });

  it("fails if answer is blank", () => {
    const qna = createQnA(
      { question: "some question", answer: "" },
      random,
      clock
    );
    expect(qna).toEqual(error("EMPTY_ANSWER"));
  });
});
