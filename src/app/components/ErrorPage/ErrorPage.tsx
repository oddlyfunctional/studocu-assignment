import type { ErrorComponent } from "next/dist/client/components/error-boundary";
import styles from "./ErrorPage.module.css";

export const ErrorPage: ErrorComponent = ({ reset }) => (
  <div className={styles.error}>
    <h2>{"Oops something went wrong, we're sorry about that! 🙇"}</h2>
    <button onClick={reset} className={styles.reset}>
      Try again
    </button>
  </div>
);
