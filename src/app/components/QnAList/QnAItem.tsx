"use client";

import type { QnA } from "@/domain/core";
import { useState } from "react";

export const QnAItem = ({ item }: { item: QnA }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const toggleAnswer = () => setShowAnswer((showAnswer) => !showAnswer);

  return (
    <div>
      <dt onClick={toggleAnswer} role="term">
        {item.question}
      </dt>
      {showAnswer && <dd role="definition">{item.answer}</dd>}
    </div>
  );
};
