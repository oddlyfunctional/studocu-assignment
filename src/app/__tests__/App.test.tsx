import { App as OriginalApp } from "@/app/App";
import { StoreProvider } from "@/app/store/StoreProvider";
import type { NonEmptyString, QnA, QnAId, Timestamp } from "@/domain/core";
import { I18nContext, type Context } from "@/i18n/i18n";
import { ok } from "@/lib/result";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";

let id = 0;
jest.mock("../../actions/qnaActions", () => ({
  getAllQnAs: async () => [],
  createQnA: async (params: { question: string; answer: string }) =>
    ok({
      ...params,
      id: id++,
      createdAt: new Date(),
    }),
  updateQnA: async (qna: QnA, params: { question: string; answer: string }) =>
    ok({
      ...qna,
      ...params,
    }),
  deleteQnA: async () => {},
  deleteAllQnAs: async () => {},
}));
describe("App", () => {
  const i18nContext: Context = {
    locale: "en",
    supportedLocales: ["en"],
    setLocale: () => {},
    dictionary: {},
  };

  beforeAll(async () => {
    i18nContext.dictionary = (
      await import(`../../i18n/en.json`, {
        assert: { type: "json" },
      })
    ).default;
  });

  const App = ({ items }: { items: QnA[] }) => {
    return (
      <I18nContext.Provider value={i18nContext}>
        <StoreProvider
          initialState={{
            qnas: {
              qnas: items,
              editing: null,
            },
          }}
        >
          <OriginalApp />
        </StoreProvider>
      </I18nContext.Provider>
    );
  };

  const getAllItems = () =>
    screen
      .getAllByRole("term")
      .map((el) => within(el).getByLabelText("question").textContent);

  const qna: QnA = {
    id: -1 as QnAId,
    question: "How to add a question?" as NonEmptyString,
    answer: "Just use the form below!" as NonEmptyString,
    createdAt: new Date().getTime() as Timestamp,
  };

  it("adds new question", async () => {
    const userEvent = UserEvent.setup();
    render(<App items={[]} />);

    expect(screen.getByRole("main")).toHaveTextContent("no questions");
    await userEvent.type(screen.getByLabelText("Question"), "New question");
    await userEvent.type(screen.getByLabelText("Answer"), "New answer");
    await userEvent.click(screen.getByText("Create question"));

    expect(getAllItems()).toEqual(["New question"]);
    expect(screen.getByRole("main")).toHaveTextContent("1 question");

    // and cleans the form
    expect(screen.getByLabelText("Question")).toHaveValue("");
    expect(screen.getByLabelText("Answer")).toHaveValue("");
  });

  it("sorts the questions alphabetically ignoring case", async () => {
    const userEvent = UserEvent.setup();
    render(<App items={[qna]} />);

    await userEvent.type(screen.getByLabelText("Question"), "a question");
    await userEvent.type(screen.getByLabelText("Answer"), "An answer");
    await userEvent.click(screen.getByText("Create question"));

    await userEvent.click(screen.getByText("Sort"));

    expect(getAllItems()).toEqual(["a question", qna.question]);
  });

  it("removes all questions", async () => {
    const userEvent = UserEvent.setup();
    render(<App items={[qna]} />);

    await userEvent.click(screen.getByText("Remove all"));
    expect(screen.getByRole("main")).toHaveTextContent("no questions");

    expect(screen.queryByRole("term")).not.toBeInTheDocument;
    expect(screen.getByRole("list")).toHaveTextContent("No questions yet");
  });

  it("removes specific question", async () => {
    const userEvent = UserEvent.setup();
    render(<App items={[qna]} />);

    await userEvent.type(screen.getByLabelText("Question"), "New question");
    await userEvent.type(screen.getByLabelText("Answer"), "New answer");
    await userEvent.click(screen.getByText("Create question"));

    const item = screen.getByText(qna.question);
    await userEvent.click(within(item.parentElement!).getByText("Remove"));

    expect(getAllItems()).toEqual(["New question"]);
  });

  it("edits question", async () => {
    const userEvent = UserEvent.setup();
    render(<App items={[qna]} />);

    const item = screen.getByText(qna.question);
    await userEvent.click(within(item.parentElement!).getByText("Edit"));

    expect(screen.getByLabelText("Question")).toHaveValue(qna.question);
    expect(screen.getByLabelText("Answer")).toHaveValue(
      "Just use the form below!"
    );

    const questionInput = screen.getByLabelText("Question");
    await userEvent.clear(questionInput);
    await userEvent.type(questionInput, "Updated question");
    await userEvent.click(screen.getByText("Update question"));

    expect(getAllItems()).toEqual(["Updated question"]);
  });

  it("clears editing item when removing it", async () => {
    const userEvent = UserEvent.setup();
    render(<App items={[qna]} />);

    const item = screen.getByText(qna.question);
    await userEvent.click(within(item.parentElement!).getByText("Edit"));
    await userEvent.click(within(item.parentElement!).getByText("Remove"));

    expect(screen.getByLabelText("Question")).toHaveValue("");
    expect(screen.getByLabelText("Answer")).toHaveValue("");
  });

  it("clears editing item when removing all items", async () => {
    const userEvent = UserEvent.setup();
    render(<App items={[qna]} />);

    const item = screen.getByText(qna.question);
    await userEvent.click(within(item.parentElement!).getByText("Edit"));
    await userEvent.click(screen.getByText("Remove all"));

    expect(screen.getByLabelText("Question")).toHaveValue("");
    expect(screen.getByLabelText("Answer")).toHaveValue("");
  });
});
