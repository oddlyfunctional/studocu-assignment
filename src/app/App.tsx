"use client";
import {
  createQnA,
  deleteAllQnAs,
  deleteQnA,
  updateQnA,
} from "@/actions/qnaActions";
import { Button } from "@/app/components/Button/Button";
import { QnAForm } from "@/app/components/QnAForm/QnAForm";
import { QnAItem } from "@/app/components/QnAItem/QnAItem";
import { Tooltip } from "@/app/components/Tooltip/Tooltip";
import type { QnA } from "@/domain/core";
import { pluralize } from "@/lib/pluralize";
import { useReducer, useRef } from "react";
import styles from "./App.module.css";

const compareStrings = (a: string, b: string) => {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

type State = {
  items: QnA[];
  editing: QnA | null;
};

type Add = { type: "Add"; payload: QnA };
type Remove = { type: "Remove"; payload: QnA };
type Update = { type: "Update"; payload: QnA };
type Edit = { type: "Edit"; payload: QnA };
type Sort = { type: "Sort" };
type RemoveAll = { type: "RemoveAll" };
type Action = Add | Remove | Update | Edit | Sort | RemoveAll;
const Actions = {
  add: (payload: QnA): Add => ({ type: "Add", payload }),
  remove: (payload: QnA): Remove => ({ type: "Remove", payload }),
  update: (payload: QnA): Update => ({ type: "Update", payload }),
  edit: (payload: QnA): Edit => ({ type: "Edit", payload }),
  sort: (): Sort => ({ type: "Sort" }),
  removeAll: (): RemoveAll => ({ type: "RemoveAll" }),
};
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "Add":
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case "Remove":
      return {
        editing: state.editing === action.payload ? null : state.editing,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };
    case "Update":
      return {
        editing: null,
        items: state.items.map((i) => {
          if (i.id === action.payload.id) {
            return { ...action.payload };
          } else {
            return i;
          }
        }),
      };
    case "Edit":
      return {
        ...state,
        editing: state.editing === action.payload ? null : action.payload,
      };
    case "Sort":
      return {
        ...state,
        items: [...state.items].sort((a, b) =>
          compareStrings(a.question, b.question)
        ),
      };
    case "RemoveAll":
      return {
        items: [],
        editing: null,
      };
  }
};

export const App = ({ preloadedItems }: { preloadedItems: QnA[] }) => {
  const [{ items, editing }, dispatch] = useReducer(reducer, {
    items: preloadedItems,
    editing: null,
  });
  const removeItem = (item: QnA) => {
    // update UI optimistically
    dispatch(Actions.remove(item));
    deleteQnA(item.id);
  };

  const removeAll = () => {
    // update UI optimistically
    dispatch(Actions.removeAll());
    deleteAllQnAs();
  };

  const qnaListTitleAnchor = useRef(null);
  const formTitleAnchor = useRef(null);

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
                <h2 ref={qnaListTitleAnchor} className={styles["header-title"]}>
                  Created questions
                </h2>
                <Tooltip anchorRef={qnaListTitleAnchor}>
                  Here you can find the created questions and their answers.
                </Tooltip>
                <div className={styles["header-actions"]}>
                  <Button
                    kind="secondary"
                    onClick={() => dispatch(Actions.sort())}
                  >
                    Sort
                  </Button>
                  <Button kind="danger" onClick={removeAll}>
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
                    onEdit={(item) => dispatch(Actions.edit(item))}
                    editing={item === editing}
                  />
                ))}
              </dl>
            </div>

            <div className={styles.form}>
              {editing ? (
                <>
                  <h2>
                    <span ref={formTitleAnchor}>Edit question</span>
                  </h2>
                  <Tooltip anchorRef={formTitleAnchor}>
                    Here you can edit a question and its answer.
                  </Tooltip>

                  <QnAForm
                    initialState={editing}
                    action={(params) => updateQnA(editing, params)}
                    onSubmit={(item) => dispatch(Actions.update(item))}
                    submitLabel="Update question"
                  />
                </>
              ) : (
                <>
                  <h2>
                    <span ref={formTitleAnchor}>Create a new question</span>
                  </h2>
                  <Tooltip anchorRef={formTitleAnchor}>
                    Here you can create new questions and their answers.
                  </Tooltip>

                  <QnAForm
                    action={createQnA}
                    onSubmit={(item) => dispatch(Actions.add(item))}
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
