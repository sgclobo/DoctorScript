import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import id from "./locales/id";
import pt from "./locales/pt";
import tet from "./locales/tet";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "tet", label: "Tetum" },
  { code: "pt", label: "Português" },
  { code: "id", label: "Indonesia" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

const deviceLocale = getLocales()[0]?.languageCode ?? "en";
const defaultLanguage = SUPPORTED_LANGUAGES.some((l) => l.code === deviceLocale)
  ? deviceLocale
  : "en";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    en: { translation: en },
    tet: { translation: tet },
    pt: { translation: pt },
    id: { translation: id },
  },
  lng: defaultLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
