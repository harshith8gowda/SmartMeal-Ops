import { SwiggyMcpServer, SwiggyMcpToolResponse } from "./types";

const DEFAULT_ENDPOINTS: Record<SwiggyMcpServer, string> = {
  food: "https://mcp.swiggy.com/food",
  instamart: "https://mcp.swiggy.com/im",
  dineout: "https://mcp.swiggy.com/dineout"
};

const endpointEnv: Record<SwiggyMcpServer, string | undefined> = {
  food: process.env.SWIGGY_FOOD_MCP_URL,
  instamart: process.env.SWIGGY_INSTAMART_MCP_URL,
  dineout: process.env.SWIGGY_DINEOUT_MCP_URL
};

let requestId = 1;

export function hasSwiggyMcpSession() {
  return Boolean(process.env.SWIGGY_MCP_ACCESS_TOKEN);
}

export async function callSwiggyTool<T>(
  server: SwiggyMcpServer,
  name: string,
  args: Record<string, unknown> = {}
): Promise<SwiggyMcpToolResponse<T>> {
  const token = process.env.SWIGGY_MCP_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing SWIGGY_MCP_ACCESS_TOKEN. Complete OAuth 2.1 PKCE before live Swiggy MCP calls.");
  }

  const endpoint = endpointEnv[server] || DEFAULT_ENDPOINTS[server];
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
