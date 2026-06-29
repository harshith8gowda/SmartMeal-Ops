import { env } from "@/lib/env";
import { SwiggyMcpServer, SwiggyMcpToolResponse } from "./types";

const DEFAULT_ENDPOINTS: Record<SwiggyMcpServer, string> = {
  food: env.SWIGGY_FOOD_MCP_URL,
  instamart: env.SWIGGY_INSTAMART_MCP_URL,
  dineout: env.SWIGGY_DINEOUT_MCP_URL
};

let requestId = 1;

export function hasSwiggyMcpSession(token?: string) {
  return Boolean(token);
}

async function sendSwiggyRequest<T>(
  server: SwiggyMcpServer,
  name: string,
  args: Record<string, unknown> = {},
  token?: string
): Promise<SwiggyMcpToolResponse<T>> {
  if (!token) {
    throw new Error("Missing SWIGGY_MCP_ACCESS_TOKEN. Complete OAuth 2.1 PKCE before live Swiggy MCP calls.");
  }

  const endpoint = DEFAULT_ENDPOINTS[server];
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name,
        arguments: args
      },
      id: requestId++
    })
  });

  if (response.status === 401) {
    throw new Error("Swiggy MCP session expired. Re-run OAuth authorization.");
  }

  if (!response.ok) {
    throw new Error(`Swiggy MCP ${server} call failed with HTTP ${response.status}`);
  }

  const payload = await response.json();

  if (payload.error) {
    return {
      success: false,
      error: {
        code: payload.error.code,
        message: payload.error.message ?? "Swiggy MCP tool call failed"
      }
    };
  }

  return payload.result ?? payload;
}

export async function callSwiggyTool<T>(
  server: SwiggyMcpServer,
  name: string,
  args: Record<string, unknown> = {},
  token?: string,
  retries = 1
): Promise<SwiggyMcpToolResponse<T>> {
  try {
    return await sendSwiggyRequest<T>(server, name, args, token);
  } catch (err) {
    if (retries > 0 && err instanceof Error && err.message.toLowerCase().includes("timeout")) {
      return callSwiggyTool<T>(server, name, args, token, retries - 1);
    }
    throw err;
  }
}
