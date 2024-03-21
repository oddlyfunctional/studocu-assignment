"use client";
import styles from "./ErrorMessage.module.css";

export const ErrorMessage = ({ error }: { error: string }) => {
  return <div className={styles.error}>{error}</div>;
};
