import React, { createContext, useContext, useState } from 'react';

export interface BrandRules {
  colors: string[]; // hex colors allowed
  fonts: string[]; // font family names allowed
}

interface BrandGuardContextValue {
  rules: BrandRules | null;
  setRules: (rules: BrandRules) => void;
}

const BrandGuardContext = createContext<BrandGuardContextValue | undefined>(undefined);

export const BrandGuardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rules, setRules] = useState<BrandRules | null>(null);
  return (
    <BrandGuardContext.Provider value={{ rules, setRules }}>
      {children}
    </BrandGuardContext.Provider>
  );
};

export const useBrandGuardContext = () => {
  const ctx = useContext(BrandGuardContext);
  if (!ctx) throw new Error('BrandGuardContext missing');
  return ctx;
};