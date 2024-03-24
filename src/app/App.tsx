"use client";
import { deleteAllQnAs } from "@/actions/qnaActions";
import { Button } from "@/app/components/Button/Button";
import { ErrorPage } from "@/app/components/ErrorPage/ErrorPage";
import { LocaleSwitcher } from "@/app/components/LocaleSwitcher/LocaleSwitcher";
import { QnAForm } from "@/app/components/QnAForm/QnAForm";
import { QnAItem } from "@/app/components/QnAItem/QnAItem";
import { Tooltip } from "@/app/components/Tooltip/Tooltip";
import { StoreProvider } from "@/app/store/StoreProvider";
import {
  removeAll,
  selectEditing,
  selectOrder,
  selectOrderedQnAs,
  sort,
} from "@/app/store/qnasSlice";
import type { QnA } from "@/domain/core";
import * as I18n from "@/i18n/i18n";
import { useAppDispatch, useAppSelector, useTranslation } from "@/lib/hooks";
import { pluralize } from "@/lib/pluralize";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import styles from "./App.module.css";

export const App = () => {
  const items = useAppSelector(selectOrderedQnAs);
  const order = useAppSelector(selectOrder);
  const isEditing = Boolean(useAppSelector(selectEditing));
  const dispatch = useAppDispatch();
  const qnaListTitleAnchor = useRef(null);
  const formTitleAnchor = useRef(null);
  const t = useTranslation();

  return (
    <div className={styles.wrapper}>
      <LocaleSwitcher />
      <main className={styles.container}>
        <h1 className={styles.title}>{t("PAGE_TITLE")}</h1>

        <div className={styles.content}>
          <aside className={styles.description}>
            {t("DESCRIPTION", {
              questions: pluralize(items.length, {
                0: t("NO_QUESTIONS"),
                1: t("1_QUESTION"),
                default: t("N_QUESTIONS"),
              }),
            })}
          </aside>

          <div className={styles.qna}>
            <div>
              <header className={styles.header}>
                <h2 ref={qnaListTitleAnchor} className={styles["header-title"]}>
                  {t("Q&A_LIST_TITLE")}
                </h2>
                <Tooltip anchorRef={qnaListTitleAnchor}>
                  {t("Q&A_LIST_TOOLTIP")}
                </Tooltip>
                <div className={styles["header-actions"]}>
                  <Button kind="secondary" onClick={() => dispatch(sort())}>
                    {t("SORT_BUTTON")}
                    {order === "ASC" ? "👇" : order === "DESC" ? "☝️" : null}
                  </Button>
                  <Button
                    kind="danger"
                    onClick={() => {
                      // update UI optimistically
                      dispatch(removeAll());
                      deleteAllQnAs();
                    }}
                  >
                    {t("REMOVE_ALL_BUTTON")}
                  </Button>
                </div>
              </header>

              <div role="list" className={styles.questions}>
                {items.length === 0 && (
                  <div className={styles["no-questions"]}>
                    {t("Q&A_LIST_BLANKSLATE")}
                  </div>
                )}
                {items.map((item) => (
                  <QnAItem item={item} key={item.id} />
                ))}
              </div>
            </div>

            <div className={styles.form}>
              {isEditing ? (
                <>
                  <h2 className={styles["form-title"]}>
                    <span ref={formTitleAnchor}>{t("EDIT_Q&A_TITLE")}</span>
                  </h2>
                  <Tooltip anchorRef={formTitleAnchor}>
                    {t("EDIT_Q&A_TOOLTIP")}
                  </Tooltip>

                  <QnAForm />
                </>
              ) : (
                <>
                  <h2 className={styles["form-title"]}>
                    <span ref={formTitleAnchor}>{t("NEW_Q&A_TITLE")}</span>
                  </h2>
                  <Tooltip anchorRef={formTitleAnchor}>
                    {t("NEW_Q&A_TOOLTIP")}
                  </Tooltip>

                  <QnAForm />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const AppContainer = ({
  preloadedItems,
  i18nContext,
}: {
  preloadedItems: QnA[];
  i18nContext: Pick<I18n.Context, "locale" | "supportedLocales" | "dictionary">;
}) => {
  const router = useRouter();
  const setLocale = (locale: string) => {
    if (!i18nContext.supportedLocales.includes(locale))
      throw new Error(`Unsupported locale: ${locale}`);
    document.cookie = `NEXT_LOCALE=${locale}`;
    router.refresh();
  };
  return (
    <I18n.I18nContext.Provider value={{ ...i18nContext, setLocale }}>
      <ErrorBoundary errorComponent={ErrorPage}>
        <StoreProvider
          initialState={{
            qnas: {
              qnas: preloadedItems,
              editing: null,
              order: null,
            },
          }}
        >
          <App />
        </StoreProvider>
      </ErrorBoundary>
    </I18n.I18nContext.Provider>
  );
};
