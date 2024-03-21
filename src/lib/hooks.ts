import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type InputHTMLAttributes,
  type SetStateAction,
  type TextareaHTMLAttributes,
} from "react";

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

/**
 * Hook to manage form state and callbacks
 * @param initialState - Initial values for the form fields
 * @returns `{register, onSubmit, setFields}`. Note all managed fields need to be registered.
 * @example
 * ```tsx
 * type Fields = {
 *   name: string;
 * };
 *
 * function Form() {
 *   const { register, onSubmit, setFields } = useForm<Fields>({
 *     name: "",
 *   });
 *
 *   return (
 *     <form onSubmit={onSubmit((fields) => console.log(fields))}>
 *       <input {...register("name", { type: "text", required: true })} />
 *       <button type="submit">Submit</button>
 *       <button onClick={() => setFields({ name: "" })}>Reset</button>
 *     </form>
 *   );
 * }
 * ```
 */
export const useForm = <T extends Record<string, string | File>>(
  initialState: T
) => {
  const [fields, setFields] = useState<T>(initialState);

  const register = <Key extends keyof T>(
    key: Key,
    props: Omit<InputHTMLAttributes<HTMLInputElement>, "value"> &
      Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value"> = {}
  ) => ({
    name: key,
    value: fields[key],
    onChange: (ev: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => {
      const value = ev.currentTarget.value;
      setFields((fields) => ({
        ...fields,
        [key]: value,
      }));
      props.onChange && props.onChange(ev);
    },
    ...props,
  });

  const onSubmit =
    (f: (values: T) => void) => (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      f(fields);
    };

  return { register, onSubmit, setFields };
};
