import { db, isDbConfigured } from "@/lib/db";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "abl_admin";
export const SESSION_TTL_DAYS = 7;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64);
  const hashBuf = Buffer.from(hash, "hex");
  return test.length === hashBuf.length && timingSafeEqual(test, hashBuf);
}

export function newToken(): string {
  return randomBytes(32).toString("hex");
}

/** Returns the adminId for a valid session token, or null. */
export async function requireAdmin(request: Request): Promise<{ adminId: string; email: string } | null> {
  if (!isDbConfigured()) return null;
  try {
    const cookies = request.headers.get("cookie") || "";
    const match = cookies.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]+)`));
    if (!match) return null;
    const token = decodeURIComponent(match[1] || "");
    if (!token) return null;
    const session = await db.adminSession.findUnique({
      where: { token },
      include: { admin: true },
    });
    if (!session) return null;
    if (session.expiresAt.getTime() < Date.now()) {
      await db.adminSession.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }
    return { adminId: session.adminId, email: session.admin.email };
  } catch (e) {
    console.error("[requireAdmin] error", e);
    return null;
  }
}

/** Checks if any admin exists (used by setup page to allow first-access creation). */
export async function hasAnyAdmin(): Promise<boolean> {
  if (!isDbConfigured()) return false;
  try {
    const count = await db.adminUser.count();
    return count > 0;
  } catch {
    return false;
  }
}
