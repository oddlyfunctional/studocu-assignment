import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export type ButtonKind = "primary" | "secondary" | "danger";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind: ButtonKind;
}

export const Button = ({ kind, ...props }: Props) => {
  const className = [styles.button, styles[kind], props.className]
    .filter(Boolean)
    .join(" ");
  return <button {...props} className={className} />;
};
