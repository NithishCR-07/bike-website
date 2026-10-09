const ADMIN_STORAGE_KEY = "demobikes_admin_auth";

/**
 * Authenticates the admin strictly via Supabase admin_users table.
 * NO HARDCODED CREDENTIALS.
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

  // Call Next.js Server API which checks the Supabase 'admin_users' table
  const response = await fetch("/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: cleanEmail, password: password }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Authentication failed. Invalid admin credentials.");
  }

  const sessionObj = {
    role: data.user?.role || "admin",
    email: data.user?.email || cleanEmail,
    id: data.user?.id || "admin",
    authenticatedAt: Date.now(),
    provider: "supabase_admin_users_table",
  };

  saveAdminSession(sessionObj);
  return { user: data.user, session: sessionObj };
}

/**
 * Saves admin session to secure sessionStorage (isolated to current tab/session).
 */
function saveAdminSession(sessionData) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionData));
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem("demobikes_admin_session");
  } catch (err) {
    console.warn("Session storage save error:", err);
  }
}

/**
 * Checks if the current visitor has an ACTIVE, authenticated Admin session.
 * @returns {Promise<boolean>}
 */
export async function isAdminAuthenticated() {
  if (typeof window === "undefined") return false;

  try {
    // 1. Instant check in active tab's sessionStorage
    const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.role === "admin") {
        return true;
      }
    }

    // 2. Server session check
    const res = await fetch("/api/admin/auth/session");
    if (res.ok) {
      const data = await res.json();
      if (data?.authenticated && data?.user) {
        saveAdminSession({
          role: "admin",
          email: data.user.email,
          id: data.user.id || "admin",
          authenticatedAt: Date.now(),
          provider: "supabase_admin_users_table",
        });
        return true;
      }
    }

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
 * Logs out the admin from both server session and local storage.
 */
export async function logoutAdmin() {
  if (typeof window === "undefined") return;

  // 1. Clear local storage
  try {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    sessionStorage.removeItem("demobikes_admin_session");
    localStorage.removeItem("demobikes_admin_session");
  } catch (err) {
    console.warn("Error purging admin session storage:", err);
  }

  // 2. Clear server-side session cookie
  try {
    await fetch("/api/admin/auth/logout", { method: "POST" });
  } catch (err) {
    console.warn("Logout API note:", err);
  }
}
