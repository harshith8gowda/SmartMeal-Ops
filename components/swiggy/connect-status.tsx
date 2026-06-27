import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { requireUserId } from "@/lib/auth/clerk";
import { hasUserSwiggyToken } from "@/lib/swiggy/token";
import { env } from "@/lib/env";
import { ExternalLink } from "lucide-react";

export async function SwiggyConnectStatus() {
  const userId = await requireUserId();
  const isConnected = await hasUserSwiggyToken(userId);
  const canConnect = Boolean(env.SWIGGY_MCP_CLIENT_ID);

  if (isConnected) {
    return (
      <Badge variant="success" className="h-9 px-3">
        Swiggy connected
      </Badge>
    );
  }

  if (!canConnect) {
    return (
      <div className="flex items-center gap-2">
        <Button size="sm" disabled>
          Connect Swiggy
        </Button>
        <span className="text-xs text-muted-foreground">
          Add SWIGGY_MCP_CLIENT_ID after signing the agreement.
        </span>
      </div>
    );
  }

  return (
    <Button asChild size="sm">
      <Link href="/api/swiggy/connect">
        Connect Swiggy <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
      </Link>
    </Button>
  );
}
