"use client";

import { Button } from "@/app/components/Button/Button";
import { ErrorMessage } from "@/app/components/ErrorMessage/ErrorMessage";
import { type QnAValidationErrors } from "@/domain/core";

import { createQnA, updateQnA } from "@/actions/qnaActions";
import { add, selectEditing, update } from "@/app/store/qnasSlice";
import {
  useAppDispatch,
  useAppSelector,
  useForm,
  useTranslation,
} from "@/lib/hooks";
import { useEffect, useRef, useState } from "react";
import styles from "./QnAForm.module.css";

export type Fields = {
  question: string;
  answer: string;
  delay: boolean;
};

const initialState: Fields = {
  question: "",
  answer: "",
  delay: false,
};

export const QnAForm = () => {
  const editing = useAppSelector(selectEditing);
  const dispatch = useAppDispatch();
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
    ...(editing || initialState),
    delay: false,
  });
  useEffect(
    () => setFields({ ...(editing || initialState), delay: false }),
    [editing, setFields]
  );
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
        const serverAction = editing
          ? (params: Fields) => updateQnA(editing, params)
          : createQnA;
        const qna = await serverAction(values);
        if (qna.ok) {
          const action = editing ? update : add;
          dispatch(action(qna.value));
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

        <Button
          kind="primary"
          type="submit"
          size="large"
          className={styles.submit}
        >
          {pending
            ? t("SUBMITTING")
            : editing
            ? t("EDIT_Q&A_SUBMIT")
            : t("NEW_Q&A_SUBMIT")}
        </Button>
      </fieldset>
    </form>
  );
};
