import { getDictionary, getLocale, getLocales } from "@/actions/i18nActions";
import { getAllQnAs } from "@/actions/qnaActions";
import { AppContainer } from "@/app/App";
import type { NonEmptyString, QnAId } from "@/domain/core";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Q&A | Find the A to your Q here!",
};

const blankslate = [
  {
    id: -1 as QnAId,
    question: "How to add a question?" as NonEmptyString,
    answer: "Just use the form below!" as NonEmptyString,
    createdAt: new Date(),
  },
];

export default async function Home() {
  const items = await getAllQnAs();
  const locale = await getLocale();
  const supportedLocales = await getLocales();
  const dictionary = await getDictionary();
  return (
    <AppContainer
      preloadedItems={items.length === 0 ? blankslate : items}
      i18nContext={{ locale, supportedLocales, dictionary }}
    />
  );
}
