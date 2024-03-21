"use client";

import type { QnA } from "@/domain/core";
import { useState } from "react";

export const QnAItem = ({
  item,
  onRemove,
  onEdit,
}: {
  item: QnA;
  onRemove: (item: QnA) => void;
  onEdit: (item: QnA) => void;
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const toggleAnswer = () => setShowAnswer((showAnswer) => !showAnswer);

  return (
    <div>
      <dt role="term">
        <span onClick={toggleAnswer} aria-label="question">
          {item.question}
        </span>
        <button onClick={() => onRemove(item)}>Remove</button>
        <button onClick={() => onEdit(item)}>Edit</button>
      </dt>
      {showAnswer && <dd role="definition">{item.answer}</dd>}
    </div>
  );
};
