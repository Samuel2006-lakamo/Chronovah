import type { ReactNode } from "react";

export type DarkModeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};
export type DarkModeProviderProps = {
  children: ReactNode;
};