import { match } from "@formatjs/intl-localematcher";

import Negotiator from "negotiator";
import { cookies, headers } from "next/headers";

const defaultLocale = "en";

export const getLocales = async () =>
  (await import("@/i18n/locales.json", { assert: { type: "json" } })).default;

const getChosenLocale = async () => {
  const cookie = cookies().get("NEXT_LOCALE");
  if (!cookie) return;
  return match([cookie.value], await getLocales(), defaultLocale);
};

const getAcceptedLocale = async () => {
  const acceptedLanguages = new Negotiator({
    headers: Object.fromEntries(headers().entries()),
  }).languages();
  return match(acceptedLanguages, await getLocales(), defaultLocale);
};

export const getLocale = async () =>
  (await getChosenLocale()) ?? (await getAcceptedLocale()) ?? "en";

export const getDictionary = async (): Promise<Record<string, string>> => {
  const locale = await getLocale();
  const dictionary = await import(`@/i18n/${locale}.json`, {
    assert: { type: "json" },
  });
  return dictionary.default;
};
