"use client";
import { NewQnA } from "@/app/components/NewQnA/NewQnA";
import { QnAList } from "@/app/components/QnAList/QnAList";
import type { NonEmptyString, QnA } from "@/domain/core";
import { useState } from "react";

const compareStrings = (a: string, b: string) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export default function Home() {
  const [items, setItems] = useState<QnA[]>([
    {
      id: "blankslate",
      question: "How to add a question?" as NonEmptyString,
      answer: "Just use the form below!" as NonEmptyString,
      createdAt: new Date(),
    },
  ]);
  const addNewQnA = (item: QnA) => setItems((items) => [...items, item]);
  const sortQnAs = () =>
    setItems((items) =>
      [...items].sort((a, b) => compareStrings(a.question, b.question))
    );

  return (
    <main>
      <h1>The awesome Q/A tool</h1>

      <div>
        <h2>Created questions</h2>
        <QnAList items={items} />
        <button onClick={sortQnAs}>Sort questions</button>
      </div>

      <NewQnA onSubmit={addNewQnA} />
    </main>
  );
}
