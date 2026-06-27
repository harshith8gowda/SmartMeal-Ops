import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),
  OPENAI_API_KEY: z.string().optional().default(""),
  TOKEN_ENCRYPTION_KEY: z.string().min(32),
  SWIGGY_MCP_ACCESS_TOKEN: z.string().optional(),
  SWIGGY_FOOD_MCP_URL: z.string().url().default("https://mcp.swiggy.com/food"),
  SWIGGY_INSTAMART_MCP_URL: z.string().url().default("https://mcp.swiggy.com/im"),
  SWIGGY_DINEOUT_MCP_URL: z.string().url().default("https://mcp.swiggy.com/dineout"),
  SWIGGY_MCP_AUTH_BASE_URL: z.string().url().default("https://mcp.swiggy.com"),
  SWIGGY_MCP_CLIENT_ID: z.string().optional(),
  SWIGGY_MCP_REDIRECT_URI: z.string().url().default("https://smart-meal-ops.vercel.app/api/swiggy/callback"),
  SWIGGY_MCP_SCOPES: z.string().default("mcp:tools"),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional()
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1)
});

const buildEnv = () => {
  const server = serverEnvSchema.safeParse(process.env);
  const client = clientEnvSchema.safeParse(process.env);

  if (!server.success) {
    const formatted = server.error.format();
    console.error("❌ Invalid server environment variables:", formatted);
    throw new Error("Invalid server environment variables");
  }

  if (!client.success) {
    const formatted = client.error.format();
    console.error("❌ Invalid client environment variables:", formatted);
    throw new Error("Invalid client environment variables");
  }

  return { ...server.data, ...client.data };
};

export const env = buildEnv();
