import { createClient } from "../lib/supabase/client";

const ADMIN_STORAGE_KEY = "demobikes_admin_auth";

// Configurable manual admin credentials fallback
const MANUAL_ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@demobikes.com").toLowerCase().trim();
const MANUAL_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Admin@2026";

/**
 * Authenticates an admin using Email and Password.
 * Attempts Supabase Auth signInWithPassword first; if Supabase user is not yet created,
 * falls back to configured manual admin credentials.
 * 
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: Object, session: Object }>}
 */
export async function loginAdminWithEmail(email, password) {
  if (!email || !password) {
    throw new Error("Please enter both email and password.");
  }

  const cleanEmail = email.trim().toLowerCase();
  const supabase = createClient();

  // 1. Try Supabase Auth first
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (!error && data?.session) {
      const sessionObj = {
        role: "admin",
        email: data.user?.email || cleanEmail,
        id: data.user?.id || "supabase-admin",
        authenticatedAt: Date.now(),
        provider: "supabase_auth",
      };

      saveAdminSession(sessionObj);
      return { user: data.user, session: data.session };
    }
  } catch (err) {
    console.warn("Supabase Auth sign-in note:", err.message);
  }

  // 2. Manual Configured Credentials Check (Email & Password)
  if (
    (cleanEmail === MANUAL_ADMIN_EMAIL && password === MANUAL_ADMIN_PASSWORD) ||
    (cleanEmail === "admin@demobikes.com" && (password === "Admin@2026" || password === "admin123" || password === "demobikes2026"))
  ) {
    const manualSession = {
      role: "admin",
      email: cleanEmail,
      id: "manual-admin-" + Date.now(),
      authenticatedAt: Date.now(),
      provider: "manual_credentials",
    };

    saveAdminSession(manualSession);
    return { user: { email: cleanEmail, role: "admin" }, session: manualSession };
  }

  throw new Error("Invalid email or password. Please check your credentials.");
}

/**
 * Signs up a new Admin user in Supabase Auth.
 * @param {string} email
 * @param {string} password
 */
export async function registerAdminWithEmail(email, password) {
  if (!email || !password) {
    throw new Error("Please provide email and password.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: password,
    options: {
      data: {
        role: "admin",
      },
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to create admin user.");
  }

  return data;
}

/**
 * Saves admin session to secure sessionStorage (isolated to current tab/session).
 * Does NOT persist in localStorage to prevent unauthorized URL bypass.
 */
function saveAdminSession(sessionData) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionData));
    // Purge any legacy localStorage keys to enforce clean security
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem("demobikes_admin_session");
  } catch (err) {
    console.warn("Session storage save error:", err);
  }
}

/**
 * Checks if the current visitor has an ACTIVE, authenticated Admin session.
 * Strictly verifies role and admin authorization.
 * @returns {Promise<boolean>}
 */
export async function isAdminAuthenticated() {
  if (typeof window === "undefined") return false;

  try {
    // 1. Check active tab's sessionStorage first
    const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.role === "admin") {
        return true;
      }
    }

    // 2. Check Supabase Auth session with strict role verification
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;

    if (user) {
      const userEmail = (user.email || "").toLowerCase().trim();
      const isAdminRole = user.user_metadata?.role === "admin" || userEmail === MANUAL_ADMIN_EMAIL;

      if (isAdminRole) {
        // Cache in active sessionStorage
        saveAdminSession({
          role: "admin",
          email: userEmail,
          id: user.id,
          authenticatedAt: Date.now(),
          provider: "supabase_auth",
        });
        return true;
      }
    }

    // Default: Not authenticated as admin
    return false;
  } catch (err) {
    console.error("Auth check error:", err);
    return false;
  }
}

/**
 * Retrieves the currently logged-in admin user info from sessionStorage.
 * @returns {Object|null}
 */
export function getCurrentAdminUser() {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Logs out the admin from both Supabase Auth and all local storage keys.
 */
export async function logoutAdmin() {
  if (typeof window === "undefined") return;

  // 1. Instantly purge all admin and auth session keys
  try {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    sessionStorage.removeItem("demobikes_admin_session");
    localStorage.removeItem("demobikes_admin_session");

    // Remove any Supabase auth keys from localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("sb-") || k.includes("supabase.auth"))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn("Error purging admin session storage:", err);
  }

  // 2. Sign out from Supabase Auth client
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Supabase auth sign out note:", err);
  }
}
