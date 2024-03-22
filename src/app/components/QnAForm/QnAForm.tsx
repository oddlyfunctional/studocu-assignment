"use client";

import { Button } from "@/app/components/Button/Button";
import { ErrorMessage } from "@/app/components/ErrorMessage/ErrorMessage";
import type { QnA, QnAValidationErrors } from "@/domain/core";

import { useForm, useTranslation } from "@/lib/hooks";
import type { Result } from "@/lib/result";
import { useEffect, useRef, useState } from "react";
import styles from "./QnAForm.module.css";

export type Fields = {
  question: string;
  answer: string;
  delay: boolean;
};

const defaultState: Fields = {
  question: "",
  answer: "",
  delay: false,
};

export const QnAForm = ({
  initialState = defaultState,
  submitLabel,
  action,
  onSubmit: onSubmitCallback,
}: {
  initialState?: Pick<Fields, "question" | "answer">;
  submitLabel: string;
  action: (v: Fields) => Promise<Result<QnA, QnAValidationErrors>>;
  onSubmit: (v: QnA) => void;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  useEffect(
    () => () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    },
    []
  );
  const { register, onSubmit, setFields } = useForm<Fields>({
    ...initialState,
    delay: false,
  });
  useEffect(() => setFields({ ...initialState, delay: false }), [initialState]);
  const [errors, setErrors] = useState<QnAValidationErrors>({});
  const t = useTranslation();

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit(async (values) => {
        setErrors({});
        if (values.delay) {
          setPending(true);
          await new Promise((resolve) => {
            timeoutRef.current = setTimeout(resolve, 5_000);
          });
          setPending(false);
        }
        const qna = await action(values);
        if (qna.ok) {
          onSubmitCallback(qna.value);
          setFields({ ...initialState, delay: false });
        } else {
          setErrors(qna.error);
        }
      })}
    >
      <fieldset disabled={pending} className={styles.form}>
        <label>
          <div className={styles.label}>{t("Q&A_FORM_QUESTION_LABEL")}</div>
          <input
            {...register("question", {
              type: "text",
              className: styles.input,
            })}
          />
        </label>
        {errors.question && <ErrorMessage error={t(errors.question)} />}

        <label>
          <div className={styles.label}>{t("Q&A_FORM_ANSWER_LABEL")}</div>
          <textarea
            {...register("answer", {
              className: styles.input,
              onKeyDown: (ev) => {
                if (ev.shiftKey && ev.key === "Enter") {
                  ev.preventDefault();
                  if (formRef.current?.requestSubmit) {
                    formRef.current?.requestSubmit();
                  } else {
                    formRef.current?.dispatchEvent(
                      new Event("submit", { cancelable: true, bubbles: true })
                    );
                  }
                }
              },
            })}
          />
        </label>
        {errors.answer && <ErrorMessage error={t(errors.answer)} />}

        <label className={styles["delay-checkbox"]}>
          <input
            {...register("delay", {
              type: "checkbox",
              extractValue: (ev) => ev.currentTarget.checked,
            })}
          />
          {t("Q&A_FORM_DELAY_CHECKBOX")}
        </label>

        <Button kind="primary" type="submit" className={styles.submit}>
          {pending ? t("SUBMITTING") : submitLabel}
        </Button>
      </fieldset>
    </form>
  );
};
