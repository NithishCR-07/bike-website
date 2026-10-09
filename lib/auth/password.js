import crypto from "crypto";

/**
 * Hashes a plain-text password using standard cryptographic PBKDF2 with salt.
 * Format returned: "<salt>:<derivedKeyHash>"
 * 
 * @param {string} password 
 * @returns {string} Hashed password
 */
export function hashPassword(password) {
  if (!password) return "";
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(String(password), salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain-text password against a stored hashed password.
 * 
 * @param {string} password - The user-entered plain password
 * @param {string} storedHash - The hash retrieved from database
 * @returns {boolean} True if password matches
 */
export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;

  const cleanPass = String(password);
  const cleanHash = String(storedHash).trim();

  // 1. Verify PBKDF2 formatted hash ("salt:hash")
  if (cleanHash.includes(":")) {
    const parts = cleanHash.split(":");
    if (parts.length === 2) {
      const [salt, originalHash] = parts;
      const computed = crypto.pbkdf2Sync(cleanPass, salt, 1000, 64, "sha512").toString("hex");
      return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(originalHash));
    }
  }

  // 2. Fallback check for SHA-256 hash
  const sha256Hash = crypto.createHash("sha256").update(cleanPass).digest("hex");
  if (cleanHash.toLowerCase() === sha256Hash.toLowerCase()) {
    return true;
  }

  // 3. Fallback direct match (if stored in plain during setup)
  return cleanHash === cleanPass;
}
