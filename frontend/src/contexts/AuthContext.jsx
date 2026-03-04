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

function normalizeWhatsapp(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function inferBusinessNameFromEmail(email) {
  const localPart = normalizeEmail(email).split("@")[0] || "bisnis-anda";
  const words = localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "Bisnis Anda";
  }

  return words
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
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

  const register = async (
    fullName,
    businessName,
    email,
    whatsapp,
    password,
  ) => {
    const safeFullName = String(fullName ?? "").trim();
    const normalizedEmail = normalizeEmail(String(email ?? ""));
    const normalizedWhatsapp = normalizeWhatsapp(whatsapp);
    const safeBusinessName =
      String(businessName ?? "").trim() ||
      inferBusinessNameFromEmail(normalizedEmail);
    const safePassword = String(password ?? "").trim();

    if (!safeFullName) {
      throw new Error("Nama lengkap wajib diisi.");
    }
    if (!safeBusinessName) {
      throw new Error("Nama toko wajib diisi.");
    }
    if (!normalizedEmail) {
      throw new Error("Email wajib diisi.");
    }
    if (!normalizedWhatsapp) {
      throw new Error("No. WhatsApp wajib diisi.");
    }
    if (!safePassword) {
      throw new Error("Password wajib diisi.");
    }

    const users = readJson(STORAGE_KEYS.users, []);
    const emailExists = users.some((item) => item.email === normalizedEmail);
    const whatsappExists = users.some(
      (item) => item.whatsapp && item.whatsapp === normalizedWhatsapp,
    );

    if (emailExists) {
      throw new Error("Email sudah terdaftar. Silakan gunakan email lain.");
    }
    if (whatsappExists) {
      throw new Error(
        "No. WhatsApp sudah terdaftar. Silakan gunakan nomor lain.",
      );
    }

    const nextUser = {
      fullName: safeFullName,
      email: normalizedEmail,
      whatsapp: normalizedWhatsapp,
      businessName: safeBusinessName,
      password: safePassword,
    };

    const nextUsers = [...users, nextUser];
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(nextUsers));
    localStorage.removeItem(STORAGE_KEYS.session);
    setUser(null);
  };

  const login = async (identifier, password) => {
    const safeIdentifier = String(identifier ?? "").trim();
    const normalizedEmail = normalizeEmail(safeIdentifier);
    const normalizedWhatsapp = normalizeWhatsapp(safeIdentifier);
    const safePassword = String(password ?? "").trim();
    const useEmailIdentifier = safeIdentifier.includes("@");

    const users = readJson(STORAGE_KEYS.users, []);
    const matchedUser = users.find((item) => {
      const isIdentifierMatch = useEmailIdentifier
        ? item.email === normalizedEmail
        : Boolean(normalizedWhatsapp) && item.whatsapp === normalizedWhatsapp;
      return isIdentifierMatch && item.password === safePassword;
    });

    if (!matchedUser) {
      throw new Error("Email/No. WhatsApp atau password tidak valid.");
    }

    const sessionUser = {
      email: matchedUser.email,
      businessName: matchedUser.businessName,
      fullName: matchedUser.fullName || "",
      whatsapp: matchedUser.whatsapp || "",
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
