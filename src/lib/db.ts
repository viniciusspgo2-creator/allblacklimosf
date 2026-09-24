import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 *
 * Defensive design: if the database is unreachable (e.g. local preview
 * without a real Postgres connection, or first Vercel deploy before the
 * env var is configured), creating the client still succeeds — only the
 * first actual query will throw. API routes wrap DB calls in try/catch
 * and degrade gracefully.
 *
 * The schema in prisma/schema.prisma is PostgreSQL-only (Vercel + Neon).
 * On Vercel, set DATABASE_URL in the project env vars.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Returns true if a real Postgres DATABASE_URL is configured.
 * Used by API routes to decide whether to persist or fall back to
 * an in-memory acknowledgment response.
 */
export const isDbConfigured = (): boolean => {
  const url = process.env.DATABASE_URL || "";
  return url.startsWith("postgres://") || url.startsWith("postgresql://");
};
