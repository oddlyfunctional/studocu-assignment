"use client";

import { deleteQnA } from "@/actions/qnaActions";
import { Button } from "@/app/components/Button/Button";
import { edit, remove, selectEditing } from "@/app/store/qnasSlice";
import type { QnA } from "@/domain/core";
import { useAppDispatch, useAppSelector, useTranslation } from "@/lib/hooks";
import { useState } from "react";
import styles from "./QnAItem.module.css";

export const QnAItem = ({ item }: { item: QnA }) => {
  const dispatch = useAppDispatch();
  const isEditing = useAppSelector(selectEditing) === item;
  const [showAnswer, setShowAnswer] = useState(false);
  const toggleAnswer = () => setShowAnswer((showAnswer) => !showAnswer);
  const t = useTranslation();
  const actions = (
    <>
      <Button
        kind="warning"
        size="small"
        onClick={() => dispatch(edit(item))}
        className={styles.action}
      >
        {t(isEditing ? "Q&A_EDITING_BUTTON" : "Q&A_EDIT_BUTTON")}
      </Button>
      <Button
        kind="danger"
        size="small"
        onClick={() => {
          // update UI optimistically
          dispatch(remove(item));
          deleteQnA(item.id);
        }}
        className={styles.action}
      >
        {t("Q&A_REMOVE_BUTTON")}
      </Button>
    </>
  );

  return (
    <div
      className={[styles.row, isEditing && styles.editing]
        .filter(Boolean)
        .join(" ")}
      role="listitem"
    >
      <div role="term" className={styles.question}>
        <div
          onClick={toggleAnswer}
          aria-label="question"
          className={styles["question-text"]}
        >
          {item.question}
        </div>
        <div className={styles.actions}>{actions}</div>
      </div>
      {showAnswer && (
        <div role="definition" className={styles.answer}>
          {item.answer}
        </div>
      )}

      <div className={styles["mobile-actions"]}>{actions}</div>
    </div>
  );
};
