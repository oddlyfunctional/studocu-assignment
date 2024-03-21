"use client";

import { ErrorMessage } from "@/app/components/ErrorMessage";
import type { QnA, QnAValidationErrors } from "@/domain/core";
import { useForm } from "@/lib/hooks";
import type { Result } from "@/lib/result";
import { useEffect, useState } from "react";

export type Fields = {
  question: string;
  answer: string;
};

const defaultState: Fields = {
  question: "",
  answer: "",
};

const errorMessages = {
  EMPTY_QUESTION: "Please type a question.",
  EMPTY_ANSWER: "Please type an answer.",
};

export const QnAForm = ({
  initialState = defaultState,
  submitLabel,
  action,
  onSubmit: onSubmitCallback,
}: {
  initialState?: Fields;
  submitLabel: string;
  action: (v: Fields) => Promise<Result<QnA, QnAValidationErrors>>;
  onSubmit: (v: QnA) => void;
}) => {
  const { register, onSubmit, setFields } = useForm<Fields>(initialState);
  useEffect(() => setFields(initialState), [initialState]);
  const [errors, setErrors] = useState<QnAValidationErrors>({});

  return (
    <form
      onSubmit={onSubmit(async (values) => {
        const qna = await action(values);
        if (qna.ok) {
          onSubmitCallback(qna.value);
          setFields(initialState);
          setErrors({});
        } else {
          setErrors(qna.error);
        }
      })}
    >
      <label>
        Question
        <input
          {...register("question", {
            type: "text",
          })}
        />
      </label>
      {errors.question && (
        <ErrorMessage error={errorMessages[errors.question]} />
      )}

      <label>
        Answer
        <textarea {...register("answer")} />
      </label>
      {errors.answer && <ErrorMessage error={errorMessages[errors.answer]} />}

      <button type="submit">{submitLabel}</button>
    </form>
  );
};
