"use client";
import { createQnA, updateQnA } from "@/actions/qnaActions";
import { Button } from "@/app/components/Button/Button";
import { QnAForm } from "@/app/components/QnAForm/QnAForm";
import { QnAItem } from "@/app/components/QnAItem/QnAItem";
import type { NonEmptyString, QnA } from "@/domain/core";
import { pluralize } from "@/lib/pluralize";
import { useState } from "react";
import styles from "./App.module.css";

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
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <h1 className={styles.title}>The awesome Q/A tool</h1>

        <div className={styles.content}>
          <aside className={styles.description}>
            Here you can find{" "}
            {pluralize(items.length, {
              0: "no questions",
              1: "1 question",
              default: "{count} questions",
            })}
            . Feel free to create your own questions!
          </aside>

          <div className={styles.qna}>
            <div>
              <header className={styles.header}>
                <h2 className={styles["header-title"]}>Created questions</h2>
                <div className={styles["header-actions"]}>
                  <Button kind="secondary" onClick={sortQnAs}>
                    Sort
                  </Button>
                  <Button kind="danger" onClick={() => setItems([])}>
                    Remove all
                  </Button>
                </div>
              </header>

              <dl role="list">
                {items.length === 0 && (
                  <div className={styles["no-questions"]}>
                    {"No questions yet 🙁"}
                  </div>
                )}
                {items.map((item) => (
                  <QnAItem
                    item={item}
                    key={item.id}
                    onRemove={removeItem}
                    onEdit={editItem}
                    editing={item === editing}
                  />
                ))}
              </dl>
            </div>

            <div className={styles.form}>
              {editing ? (
                <>
                  <h2>Edit question</h2>
                  <QnAForm
                    initialState={editing}
                    action={(params) => updateQnA(editing, params)}
                    onSubmit={updateItem}
                    submitLabel="Update question"
                  />
                </>
              ) : (
                <>
                  <h2>Create a new question</h2>
                  <QnAForm
                    action={createQnA}
                    onSubmit={addNewItem}
                    submitLabel="Create question"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
