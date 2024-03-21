import { QnAItem } from "@/app/components/QnAItem/QnAItem";
import type { NonEmptyString, QnA, QnAId } from "@/domain/core";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("QnAItem", () => {
  const qna: QnA = {
    id: 1 as QnAId,
    question: "some question" as NonEmptyString,
    answer: "some answer" as NonEmptyString,
    createdAt: new Date(),
  };

  it("should not display answer by default", () => {
    render(<QnAItem item={qna} />);

    expect(screen.getByRole("term")).toHaveTextContent(qna.question);
    expect(screen.queryByRole("definition")).not.toBeInTheDocument;
  });

  it("should toggle the answer", async () => {
    render(<QnAItem item={qna} />);

    // open
    await userEvent.click(screen.getByLabelText("question"));
    expect(screen.getByRole("definition")).toHaveTextContent(qna.answer);

    // close
    await userEvent.click(screen.getByLabelText("question"));
    expect(screen.queryByRole("definition")).not.toBeInTheDocument;
  });
});
