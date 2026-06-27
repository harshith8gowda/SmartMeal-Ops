import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import { env } from "@/lib/env";
import { requireUserId } from "@/lib/auth/clerk";

const PKCE_COOKIE = "swiggy_pkce";

function generatePkce() {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

function generateState() {
  return crypto.randomBytes(24).toString("base64url");
}

export async function GET() {
  const userId = await requireUserId();

  const clientId = env.SWIGGY_MCP_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      {
        error:
          "Swiggy OAuth client_id is not configured. Set SWIGGY_MCP_CLIENT_ID after signing the integration agreement."
      },
      { status: 400 }
    );
  }

  const { verifier, challenge } = generatePkce();
  const state = generateState();

  const cookieValue = Buffer.from(JSON.stringify({ userId, state, verifier })).toString("base64url");
  const cookieStore = await cookies();
  cookieStore.set(PKCE_COOKIE, cookieValue, {
    httpOnly: true,
    secure: env.SWIGGY_MCP_AUTH_BASE_URL.startsWith("https://"),
    sameSite: "lax",
    path: "/api/swiggy/callback",
    maxAge: 120
  });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: env.SWIGGY_MCP_REDIRECT_URI,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
    scope: env.SWIGGY_MCP_SCOPES
  });

  return NextResponse.redirect(`${env.SWIGGY_MCP_AUTH_BASE_URL}/auth/authorize?${params.toString()}`);
}
