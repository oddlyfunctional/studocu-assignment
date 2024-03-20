"use client";

import { createQnA } from "@/actions/qnaActions";
import { ErrorMessage } from "@/app/components/ErrorMessage";
import type { CreateQnAErrors, QnA } from "@/domain/core";
import { useObjectState } from "@/lib/hooks";
import { useState } from "react";

export type State = {
  question: string;
  answer: string;
};

const initialState: State = {
  question: "",
  answer: "",
};

const errorMessages = {
  EMPTY_QUESTION: "Please type a question.",
  EMPTY_ANSWER: "Please type an answer.",
};

export const NewQnA = ({ onSubmit }: { onSubmit: (v: QnA) => void }) => {
  // this state and its associated actions are simple
  // enough that a simple `useState` is enough for now
  const [state, setProp, setState] = useObjectState<State>(initialState);
  const [errors, setErrors] = useState<CreateQnAErrors>({});

  return (
    <form
      onSubmit={async (ev) => {
        ev.preventDefault();
        const qna = await createQnA(state);
        if (qna.ok) {
          onSubmit(qna.value);
          setState(initialState);
          setErrors({});
        } else {
          setErrors(qna.error);
        }
      }}
    >
      <label>
        Question
        <input
          type="text"
          name="question"
          value={state.question}
          onChange={setProp("question")}
        />
      </label>
      {errors.question && (
        <ErrorMessage error={errorMessages[errors.question]} />
      )}

      <label>
        Answer
        <textarea
          name="answer"
          value={state.answer}
          onChange={setProp("answer")}
        />
      </label>
      {errors.answer && <ErrorMessage error={errorMessages[errors.answer]} />}

      <button type="submit">Create question</button>
    </form>
  );
};
