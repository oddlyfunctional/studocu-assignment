import { App } from "@/app/App";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";

describe("App", () => {
  const getAllItems = () =>
    screen
      .getAllByRole("term")
      .map((el) => within(el).getByLabelText("question").textContent);

  it("initializes app with a default question", () => {
    render(<App />);
    expect(screen.getByRole("term")).toHaveTextContent(
      "How to add a question?"
    );
    expect(screen.getByRole("main")).toHaveTextContent("1 question");
  });

  it("adds new question", async () => {
    const userEvent = UserEvent.setup();
    render(<App />);

    await userEvent.type(screen.getByLabelText("Question"), "New question");
    await userEvent.type(screen.getByLabelText("Answer"), "New answer");
    await userEvent.click(screen.getByText("Create question"));

    expect(getAllItems()).toEqual(["How to add a question?", "New question"]);
    expect(screen.getByRole("main")).toHaveTextContent("2 questions");

    // and cleans the form
    expect(screen.getByLabelText("Question")).toHaveValue("");
    expect(screen.getByLabelText("Answer")).toHaveValue("");
  });

  it("sorts the questions alphabetically ignoring case", async () => {
    const userEvent = UserEvent.setup();
    render(<App />);

    await userEvent.type(screen.getByLabelText("Question"), "a question");
    await userEvent.type(screen.getByLabelText("Answer"), "An answer");
    await userEvent.click(screen.getByText("Create question"));

    await userEvent.click(screen.getByText("Sort questions"));

    expect(getAllItems()).toEqual(["a question", "How to add a question?"]);
  });

  it("removes all questions", async () => {
    const userEvent = UserEvent.setup();
    render(<App />);

    await userEvent.click(screen.getByText("Remove questions"));
    expect(screen.getByRole("main")).toHaveTextContent("no questions");

    expect(screen.queryByRole("term")).not.toBeInTheDocument;
    expect(screen.getByRole("list")).toHaveTextContent("No questions yet");
  });

  it("removes specific question", async () => {
    const userEvent = UserEvent.setup();
    render(<App />);

    await userEvent.type(screen.getByLabelText("Question"), "New question");
    await userEvent.type(screen.getByLabelText("Answer"), "New answer");
    await userEvent.click(screen.getByText("Create question"));

    const item = screen.getByText("How to add a question?");
    await userEvent.click(within(item.parentElement!).getByText("Remove"));

    expect(getAllItems()).toEqual(["New question"]);
  });

  it("edits question", async () => {
    const userEvent = UserEvent.setup();
    render(<App />);

    const item = screen.getByText("How to add a question?");
    await userEvent.click(within(item.parentElement!).getByText("Edit"));

    expect(screen.getByLabelText("Question")).toHaveValue(
      "How to add a question?"
    );
    expect(screen.getByLabelText("Answer")).toHaveValue(
      "Just use the form below!"
    );

    const questionInput = screen.getByLabelText("Question");
    await userEvent.clear(questionInput);
    await userEvent.type(questionInput, "Updated question");
    await userEvent.click(screen.getByText("Update question"));

    expect(getAllItems()).toEqual(["Updated question"]);
  });
});
