import { I18nContext } from "@/i18n/i18n";
import { useTranslation } from "@/lib/hooks";
import { useContext } from "react";
import styles from "./LocaleSwitcher.module.css";

export const LocaleSwitcher = () => {
  const { locale, supportedLocales, setLocale } = useContext(I18nContext);
  const t = useTranslation();

  return (
    <select
      value={locale}
      onChange={(ev) => {
        setLocale(ev.currentTarget.value);
      }}
      className={styles.switcher}
    >
      {supportedLocales.map((locale) => (
        <option value={locale} key={locale}>
          {t(locale)}
        </option>
      ))}
    </select>
  );
};
