"use client";

import { Button } from "@/app/components/Button/Button";
import { ErrorMessage } from "@/app/components/ErrorMessage/ErrorMessage";
import type { QnA, QnAValidationErrors } from "@/domain/core";
import { useForm } from "@/lib/hooks";
import type { Result } from "@/lib/result";
import { useEffect, useState } from "react";
import styles from "./QnAForm.module.css";

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
      className={styles.form}
    >
      <label>
        <div className={styles.label}>Question</div>
        <input
          {...register("question", {
            type: "text",
            className: styles.input,
          })}
        />
      </label>
      {errors.question && (
        <ErrorMessage error={errorMessages[errors.question]} />
      )}

      <label>
        <div className={styles.label}>Answer</div>
        <textarea
          {...register("answer", {
            className: styles.input,
          })}
        />
      </label>
      {errors.answer && <ErrorMessage error={errorMessages[errors.answer]} />}

      <Button kind="primary" type="submit" className={styles.submit}>
        {submitLabel}
      </Button>
    </form>
  );
};
