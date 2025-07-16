import React, { createContext, useContext, useState } from 'react';
import en from './en.json';
import es from './es.json';

const resources = { en, es };

type Locale = 'en' | 'es';

interface I18nContextValue {
  t: (key: string) => string;
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const t = (key: string) => resources[locale][key] || key;
  return (
    <I18nContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('I18nContext missing');
  return ctx;
};