"use client";

import { createContext, useContext, useState } from "react";

interface BackButtonContextValue {
  hidden: boolean;
  setHidden: (v: boolean) => void;
}

const BackButtonContext = createContext<BackButtonContextValue>({
  hidden: false,
  setHidden: () => {},
});

export function BackButtonProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  return (
    <BackButtonContext.Provider value={{ hidden, setHidden }}>
      {children}
    </BackButtonContext.Provider>
  );
}

export const useBackButton = () => useContext(BackButtonContext);
