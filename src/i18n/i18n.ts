import { createContext } from "react";

export type Context = {
  locale: string;
  supportedLocales: string[];
  dictionary: Record<string, string>;
  setLocale: (locale: string) => void;
};

export const I18nContext = createContext<Context>({
  locale: "en",
  supportedLocales: ["en"],
  dictionary: {},
  setLocale: () => {},
});

export const translate =
  (dictionary: Record<string, string>) =>
  (key: string, params: Record<string, string> = {}) => {
    if (!(key in dictionary)) {
      console.error(`Key ${key} not found in dictionary`);
      return key;
    }

    let translation = dictionary[key];
    for (let param in params) {
      translation = translation.replace(`{${param}}`, params[param]);
    }
    return translation;
  };
