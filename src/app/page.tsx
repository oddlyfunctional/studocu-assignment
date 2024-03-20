"use client";
import { NewQnA } from "@/app/components/NewQnA/NewQnA";
import { QnAList } from "@/app/components/QnAList/QnAList";
import type { NonEmptyString, QnA } from "@/domain/core";
import { useState } from "react";

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

  return (
    <main>
      <h1>The awesome Q/A tool</h1>

      <div>
        <h2>Created questions</h2>
        <QnAList items={items} />
      </div>

      <NewQnA onSubmit={addNewQnA} />
    </main>
  );
}
