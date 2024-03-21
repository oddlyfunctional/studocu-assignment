"use client";

import { Button } from "@/app/components/Button/Button";
import type { QnA } from "@/domain/core";
import { useState } from "react";
import styles from "./QnAItem.module.css";

export const QnAItem = ({
  item,
  onRemove = () => {},
  onEdit = () => {},
  editing = false,
}: {
  item: QnA;
  onRemove?: (item: QnA) => void;
  onEdit?: (item: QnA) => void;
  editing?: boolean;
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const toggleAnswer = () => setShowAnswer((showAnswer) => !showAnswer);
  const actions = (
    <>
      <Button
        kind="secondary"
        onClick={() => onEdit(item)}
        className={styles.action}
      >
        Edit
      </Button>
      <Button
        kind="danger"
        onClick={() => onRemove(item)}
        className={styles.action}
      >
        Remove
      </Button>
    </>
  );

  return (
    <div
      className={[styles.row, editing && styles.editing]
        .filter(Boolean)
        .join(" ")}
    >
      <dt role="term" className={styles.question}>
        <div
          onClick={toggleAnswer}
          aria-label="question"
          className={styles["question-text"]}
        >
          {item.question}
        </div>
        <div className={styles.actions}>{actions}</div>
      </dt>
      {showAnswer && (
        <dd role="definition" className={styles.answer}>
          {item.answer}
        </dd>
      )}

      <div className={styles["mobile-actions"]}>{actions}</div>
    </div>
  );
};
