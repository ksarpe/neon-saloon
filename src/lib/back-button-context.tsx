"use client";

import { createContext, useContext, useState } from "react";

interface BackButtonContextValue {
  hidden: boolean;
  setHidden: (v: boolean) => void;
  onBack: (() => void) | null;
  setOnBack: (fn: (() => void) | null) => void;
}

const BackButtonContext = createContext<BackButtonContextValue>({
  hidden: false,
  setHidden: () => {},
  onBack: null,
  setOnBack: () => {},
});

export function BackButtonProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const [onBack, setOnBack] = useState<(() => void) | null>(null);
  return (
    <BackButtonContext.Provider value={{ hidden, setHidden, onBack, setOnBack }}>
      {children}
    </BackButtonContext.Provider>
  );
}

export const useBackButton = () => useContext(BackButtonContext);
