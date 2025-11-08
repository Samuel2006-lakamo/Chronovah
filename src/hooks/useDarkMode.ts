import { createContext, useContext } from "react";
import { type DarkModeContextType } from "../type/DarkModeContextType";

export const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);
export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined)
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  return context;
}
