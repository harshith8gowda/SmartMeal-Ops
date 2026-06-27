import { env } from "@/lib/env";
import { findUserById } from "@/lib/db/user";
import { encryptToken, decryptToken } from "./crypto";

export async function getSwiggyToken(userId: string): Promise<string | undefined> {
  if (env.SWIGGY_MCP_ACCESS_TOKEN) {
    return env.SWIGGY_MCP_ACCESS_TOKEN;
  }

  const user = await findUserById(userId);
  if (!user?.swiggyAccessToken) return undefined;

  try {
    return decryptToken(user.swiggyAccessToken);
  } catch (error) {
    console.warn("Failed to decrypt user Swiggy token:", error);
    return undefined;
  }
}

export async function setSwiggyToken(userId: string, token: string | null) {
  const encrypted = token ? encryptToken(token) : null;
  const { updateSwiggyToken } = await import("@/lib/db/user");
  return updateSwiggyToken(userId, encrypted);
}

export async function hasUserSwiggyToken(userId: string): Promise<boolean> {
  if (env.SWIGGY_MCP_ACCESS_TOKEN) return false;
  const user = await findUserById(userId);
  return Boolean(user?.swiggyAccessToken);
}

export function hasSwiggySession(userId?: string): boolean {
  if (env.SWIGGY_MCP_ACCESS_TOKEN) return true;
  return Boolean(userId);
}
