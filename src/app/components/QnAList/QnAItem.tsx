"use client";

import type { QnA } from "@/domain/core";
import { useState } from "react";

export const QnAItem = ({
  item,
  onRemove,
}: {
  item: QnA;
  onRemove: (item: QnA) => void;
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const toggleAnswer = () => setShowAnswer((showAnswer) => !showAnswer);

  return (
    <div>
      <dt onClick={toggleAnswer} role="term">
        <span aria-label="question">{item.question}</span>
        <button onClick={() => onRemove(item)}>Remove</button>
      </dt>
      {showAnswer && <dd role="definition">{item.answer}</dd>}
    </div>
  );
};
