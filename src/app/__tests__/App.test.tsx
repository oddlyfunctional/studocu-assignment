import { App } from "@/app/App";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("App", () => {
  it("initializes app with a default question", () => {
    render(<App />);
    expect(screen.getByRole("term")).toHaveTextContent(
      "How to add a question?"
    );
    expect(screen.getByRole("main")).toHaveTextContent("1 question");
  });

  it("adds new question", async () => {
    render(<App />);

    await userEvent.type(screen.getByLabelText("Question"), "New question");
    await userEvent.type(screen.getByLabelText("Answer"), "New answer");
    await userEvent.click(screen.getByText("Create question"));

    expect(screen.getAllByRole("term").map((el) => el.textContent)).toEqual([
      "How to add a question?",
      "New question",
    ]);
    expect(screen.getByRole("main")).toHaveTextContent("2 questions");

    // and cleans the form
    expect(screen.getByLabelText("Question")).toHaveValue("");
    expect(screen.getByLabelText("Answer")).toHaveValue("");
  });

  it("sorts the questions alphabetically", async () => {
    render(<App />);

    await userEvent.type(screen.getByLabelText("Question"), "A question");
    await userEvent.type(screen.getByLabelText("Answer"), "An answer");
    await userEvent.click(screen.getByText("Create question"));

    await userEvent.click(screen.getByText("Sort questions"));

    expect(screen.getAllByRole("term").map((el) => el.textContent)).toEqual([
      "A question",
      "How to add a question?",
    ]);
  });

  it("removes all questions", async () => {
    render(<App />);

    await userEvent.click(screen.getByText("Remove questions"));
    expect(screen.getByRole("main")).toHaveTextContent("no questions");

    expect(screen.queryByRole("term")).not.toBeInTheDocument;
    expect(screen.getByRole("list")).toHaveTextContent("No questions yet");
  });
});
