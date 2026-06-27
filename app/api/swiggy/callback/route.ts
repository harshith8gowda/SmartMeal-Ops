import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { setSwiggyToken } from "@/lib/swiggy/token";

const PKCE_COOKIE = "swiggy_pkce";

interface PkceCookie {
  userId: string;
  state: string;
  verifier: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    return NextResponse.json(
      { error: `Swiggy OAuth failed: ${error}${errorDescription ? ` - ${errorDescription}` : ""}` },
      { status: 400 }
    );
  }

  if (!code || !state) {
    return NextResponse.json({ error: "Missing authorization code or state" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const pkceCookie = cookieStore.get(PKCE_COOKIE);
  if (!pkceCookie) {
    return NextResponse.json({ error: "PKCE session expired or missing" }, { status: 400 });
  }

  let parsed: PkceCookie;
  try {
    parsed = JSON.parse(Buffer.from(pkceCookie.value, "base64url").toString("utf-8")) as PkceCookie;
  } catch {
    return NextResponse.json({ error: "Invalid PKCE session" }, { status: 400 });
  }

  if (parsed.state !== state) {
    return NextResponse.json({ error: "Invalid OAuth state" }, { status: 403 });
  }

  const tokenResponse = await fetch(`${env.SWIGGY_MCP_AUTH_BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      code_verifier: parsed.verifier,
      redirect_uri: env.SWIGGY_MCP_REDIRECT_URI
    })
  });

  if (!tokenResponse.ok) {
    const body = await tokenResponse.text().catch(() => "Unknown error");
    return NextResponse.json(
      { error: `Token exchange failed: ${tokenResponse.status} ${body}` },
      { status: 500 }
    );
  }

  const tokenData = (await tokenResponse.json()) as { access_token?: string };
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return NextResponse.json({ error: "No access_token in Swiggy token response" }, { status: 500 });
  }

  await setSwiggyToken(parsed.userId, accessToken);
  cookieStore.delete(PKCE_COOKIE);

  return NextResponse.redirect(new URL("/dashboard?swiggy=connected", env.SWIGGY_MCP_REDIRECT_URI));
}
