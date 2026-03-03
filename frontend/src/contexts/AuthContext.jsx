import { createContext, useContext, useMemo, useState } from "react";

// Frontend-only storage contract for mock authentication.
const STORAGE_KEYS = {
  users: "dashumkm:auth:users",
  session: "dashumkm:auth:session",
};

const AuthContext = createContext(null);

function readJson(key, fallback) {
  const rawValue = localStorage.getItem(key);
  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return fallback;
  }
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedSession = readJson(STORAGE_KEYS.session, null);
    if (savedSession?.email) {
      return savedSession;
    }
    return null;
  });
  const [loading] = useState(false);

  const register = async (email, businessName, password) => {
    const normalizedEmail = normalizeEmail(email);
    const safeBusinessName = businessName.trim();
    const safePassword = password.trim();

    const users = readJson(STORAGE_KEYS.users, []);
    const alreadyExists = users.some((item) => item.email === normalizedEmail);

    if (alreadyExists) {
      throw new Error("Email sudah terdaftar. Silakan gunakan email lain.");
    }

    const nextUser = {
      email: normalizedEmail,
      businessName: safeBusinessName,
      password: safePassword,
    };

    const nextUsers = [...users, nextUser];
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(nextUsers));
    localStorage.removeItem(STORAGE_KEYS.session);
    setUser(null);
  };

  const login = async (email, password) => {
    const normalizedEmail = normalizeEmail(email);
    const safePassword = password.trim();

    const users = readJson(STORAGE_KEYS.users, []);
    const matchedUser = users.find((item) => item.email === normalizedEmail && item.password === safePassword);

    if (!matchedUser) {
      throw new Error("Email atau password tidak valid.");
    }

    const sessionUser = {
      email: matchedUser.email,
      businessName: matchedUser.businessName,
    };

    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.session);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

export { STORAGE_KEYS };
