import { describe, expect, it, vi, beforeEach } from "vitest";
import { callSwiggyTool, hasSwiggyMcpSession } from "./mcp-client";

const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("hasSwiggyMcpSession", () => {
  it("returns true for non-empty tokens", () => {
    expect(hasSwiggyMcpSession("token")).toBe(true);
  });

  it("returns false for empty or undefined tokens", () => {
    expect(hasSwiggyMcpSession("")).toBe(false);
    expect(hasSwiggyMcpSession(undefined)).toBe(false);
  });
});

describe("callSwiggyTool", () => {
  it("throws when token is missing", async () => {
    await expect(callSwiggyTool("food", "search", {}, undefined)).rejects.toThrow(
      "Missing SWIGGY_MCP_ACCESS_TOKEN"
    );
  });

  it("retries on timeout and then succeeds", async () => {
    mockFetch
      .mockRejectedValueOnce(new Error("Request timeout"))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ result: { success: true, data: { ok: true } } })
      });

    const result = await callSwiggyTool("food", "search", {}, "token", 1);
    expect(result).toEqual({ success: true, data: { ok: true } });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("gives up after retries are exhausted", async () => {
    mockFetch.mockRejectedValue(new Error("Request timeout"));

    await expect(callSwiggyTool("food", "search", {}, "token", 1)).rejects.toThrow("timeout");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
