"use client";
import { createQnA, updateQnA } from "@/actions/qnaActions";
import { QnAForm } from "@/app/components/QnAForm";
import { QnAList } from "@/app/components/QnAList/QnAList";
import type { NonEmptyString, QnA } from "@/domain/core";
import { pluralize } from "@/lib/pluralize";
import { useState } from "react";

const compareStrings = (a: string, b: string) => {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export const App = () => {
  const [items, setItems] = useState<QnA[]>([
    {
      id: "blankslate",
      question: "How to add a question?" as NonEmptyString,
      answer: "Just use the form below!" as NonEmptyString,
      createdAt: new Date(),
    },
  ]);
  const addNewItem = (item: QnA) => setItems((items) => [...items, item]);
  const removeItem = (item: QnA) =>
    setItems((items) => items.filter((i) => i.id !== item.id));

  const [editing, setEditing] = useState<QnA | null>(null);
  const editItem = (item: QnA) => setEditing(item);
  const updateItem = (item: QnA) => {
    setItems((items) =>
      items.map((i) => {
        if (i.id === item.id) {
          return { ...item };
        } else {
          return i;
        }
      })
    );
    setEditing(null);
  };

  const sortQnAs = () =>
    setItems((items) =>
      [...items].sort((a, b) => compareStrings(a.question, b.question))
    );

  return (
    <main>
      <aside>
        Here you can find{" "}
        {pluralize(items.length, {
          0: "no questions",
          1: "1 question",
          default: "{count} questions",
        })}
        . Feel free to create your own questions!
      </aside>

      <h1>The awesome Q/A tool</h1>

      <div>
        <h2>Created questions</h2>
        <QnAList items={items} onRemove={removeItem} onEdit={editItem} />
        <button onClick={sortQnAs}>Sort questions</button>
        <button onClick={() => setItems([])}>Remove questions</button>
      </div>

      {editing ? (
        <QnAForm
          initialState={editing}
          action={(params) => updateQnA(editing, params)}
          onSubmit={updateItem}
          submitLabel="Update question"
        />
      ) : (
        <QnAForm
          action={createQnA}
          onSubmit={addNewItem}
          submitLabel="Create question"
        />
      )}
    </main>
  );
};
