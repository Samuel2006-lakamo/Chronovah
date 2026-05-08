// hooks/useUser.ts
import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth.service";
import { protectedAxios } from "../../axios";
import { syncManager } from "../lib/sync";
import { db } from "../database/db";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  bio?: string;
  favoriteQuote?: string;
  emailReminders?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  synced: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
}

/** Persist user profile to Dexie so it's available offline */
async function cacheUserProfile(userData: User) {
  try {
    await db.userProfile.put({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      username: userData.username,
      bio: userData.bio,
      favoriteQuote: userData.favoriteQuote,
      emailReminders: userData.emailReminders,
      updatedAt: userData.updatedAt ?? new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Failed to cache user profile in Dexie:", err);
  }
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On mount, check if Dexie already has data from a previous session.
  // If so, mark synced=true immediately so pages render from cache
  // without showing skeletons while the background refresh runs.
  useEffect(() => {
    (async () => {
      try {
        const profiles = await db.userProfile.toArray();
        if (profiles.length > 0) {
          // We have cached data — pages can render immediately
          setUser(profiles[0] as User);
          setSynced(true);
        }
      } catch (_) {
        // Dexie not ready yet — fetchUserFromBackend will handle it
      }
    })();
  }, []);

  const fetchUserFromBackend = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await protectedAxios.get("/user/me");
      const userData: User =
        response.data.data || response.data.user || response.data;
      setUser(userData);

      // Cache to Dexie for offline use — non-fatal, don't let it block sync
      try {
        await cacheUserProfile(userData);
      } catch (cacheErr) {
        console.warn("Profile cache failed (non-fatal):", cacheErr);
      }

      // Pull user data from server — awaited so Dexie is populated before
      // setLoading(false) fires and pages render.
      if (userData?.id) {
        try {
          await syncManager.pullUserData(userData.id);
        } catch (syncErr) {
          console.warn("Initial sync failed (non-fatal):", syncErr);
        }
      }

      // Mark sync complete regardless of cache/sync errors so pages render
      setSynced(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to fetch user:", err);

      if (err.response?.status === 401) {
        setUser(null);
        setError(null);
      } else if (!err.response) {
        // Offline — try to load from Dexie cache
        // We don't know the userId yet, so try to find any cached profile
        try {
          const allProfiles = await db.userProfile.toArray();
          if (allProfiles.length > 0) {
            setUser(allProfiles[0] as User);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
        setError("Network error. Please check your connection.");
      } else {
        setUser(null);
        setError(err.response?.data?.error || "Failed to fetch user data");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserFromBackend();
  }, [fetchUserFromBackend]);

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      if (user?.id) {
        await syncManager.clearUserData(user.id);
        // Clear cached profile too
        await db.userProfile.delete(user.id);
      }

      await authService.signOut();
      setUser(null);
      window.location.href = "/signin";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Logout failed:", err);
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await protectedAxios.patch("/user/update", userData);
      const updatedUser: User =
        response.data.data || response.data.user || response.data;
      setUser(updatedUser);

      // Keep Dexie cache in sync
      await cacheUserProfile(updatedUser);

      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Optimistic update — apply locally even if server is unreachable
      if (!err.response && user) {
        const optimistic = { ...user, ...userData };
        setUser(optimistic);
        await cacheUserProfile(optimistic);
        return true;
      }
      console.error("Failed to update user:", err);
      setError(err.response?.data?.error || "Failed to update user");
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    user,
    loading,
    synced,
    error,
    refresh: fetchUserFromBackend,
    logout,
    updateUser,
  };
};
