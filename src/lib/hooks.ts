import { useState, type Dispatch, type SetStateAction } from "react";

export const updateProp =
  <T>(setState: Dispatch<SetStateAction<T>>) =>
  <K extends keyof T>(key: K) =>
  (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = ev.currentTarget.value;
    setState((state) => ({ ...state, [key]: value }));
  };

export const useObjectState = <T>(
  initialValue: T
): [T, ReturnType<typeof updateProp<T>>, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(initialValue);
  return [state, updateProp(setState), setState];
};
