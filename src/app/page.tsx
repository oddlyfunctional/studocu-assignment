import { getAllQnAs } from "@/actions/qnaActions";
import { App } from "@/app/App";
import type { NonEmptyString, QnAId } from "@/domain/core";

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
  return <App preloadedItems={items.length === 0 ? blankslate : items} />;
}
