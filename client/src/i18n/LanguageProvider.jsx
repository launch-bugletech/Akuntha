import { useEffect, useMemo, useState } from 'react';
import LanguageContext from './LanguageContext.js';
import { DEFAULT_LANGUAGE, LANGUAGES, TRANSLATIONS } from './translations.js';

const LANGUAGE_STORAGE_KEY = 'akuntha-language';

function readSavedLanguage() {
  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return LANGUAGES.some(({ code }) => code === savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
}

function getTranslation(language, key) {
  const keys = key.split('.');
  const read = (source) => keys.reduce((value, part) => value?.[part], source);
  return read(TRANSLATIONS[language]) ?? read(TRANSLATIONS[DEFAULT_LANGUAGE]) ?? key;
}

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readSavedLanguage);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';
  }, [language]);

  const value = useMemo(() => ({
    language,
    languages: LANGUAGES,
    setLanguage,
    t: (key) => getTranslation(language, key),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
