import type { AppDispatch, RootState } from "@/app/store/store";
import { I18nContext, translate } from "@/i18n/i18n";
import {
  useContext,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

type ExtractValue<T, Key extends keyof T> = (
  ev: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
) => T[Key];
type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "checked" | "name"
> &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "checked" | "name"
  >;
type Register<T, Key extends keyof T> = (
  key: Key,
  props: InputProps & { extractValue?: ExtractValue<T, Key> }
) => InputProps;

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
export const useForm = <T extends Record<string, any>>(initialState: T) => {
  const [fields, setFields] = useState<T>(initialState);

  const register: Register<T, keyof T> = (key, { extractValue, ...props }) => {
    const onChange = (
      ev: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
    ) => {
      const value = extractValue ? extractValue(ev) : ev.currentTarget.value;
      setFields((fields) => ({
        ...fields,
        [key]: value,
      }));
      props.onChange && props.onChange(ev);
    };

    const valueKey = typeof fields[key] === "boolean" ? "checked" : "value";

    return {
      name: key,
      [valueKey]: fields[key],
      onChange,
      ...props,
    };
  };

  const onSubmit =
    (f: (values: T) => void) => (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      f(fields);
    };

  return { register, onSubmit, setFields };
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  return translate(context.dictionary);
};

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
