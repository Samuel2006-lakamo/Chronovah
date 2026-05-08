import { createContext, useContext } from "react";

type User = {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  username?: string;
  bio?: string;
  favoriteQuote?: string;
  emailReminders?: boolean;
  createdAt?: string;
  updatedAt?: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  synced: boolean;
  refresh: () => void;
  logout: () => void;
};
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
