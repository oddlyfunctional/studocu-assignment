import { QnAItem as OriginalComponent } from "@/app/components/QnAItem/QnAItem";
import { StoreProvider } from "@/app/store/StoreProvider";
import type { NonEmptyString, QnA, QnAId, Timestamp } from "@/domain/core";
import * as I18n from "@/i18n/i18n";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("QnAItem", () => {
  let dictionary: Record<string, string>;
  beforeAll(async () => {
    dictionary = (
      await import("../../../i18n/en.json", {
        assert: { type: "json" },
      })
    ).default;
  });

  const QnAItem = (props: Parameters<typeof OriginalComponent>[0]) => (
    <I18n.I18nContext.Provider
      value={{
        locale: "en",
        supportedLocales: ["en"],
        dictionary,
        setLocale: () => {},
      }}
    >
      <StoreProvider>
        <OriginalComponent {...props} />
      </StoreProvider>
    </I18n.I18nContext.Provider>
  );

  const qna: QnA = {
    id: 1 as QnAId,
    question: "some question" as NonEmptyString,
    answer: "some answer" as NonEmptyString,
    createdAt: new Date().getTime() as Timestamp,
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
