import { describe, expect, it } from "vitest";
import { callSwiggyTool, hasSwiggyMcpSession } from "./mcp-client";

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
});
