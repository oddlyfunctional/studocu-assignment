import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export type ButtonKind = "primary" | "secondary" | "danger" | "warning";
export type ButtonSize = "regular" | "small" | "large";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind: ButtonKind;
  size?: ButtonSize;
}

export const Button = ({ kind, size = "regular", ...props }: Props) => {
  const className = [styles.button, styles[kind], styles[size], props.className]
    .filter(Boolean)
    .join(" ");
  return <button {...props} className={className} />;
};
