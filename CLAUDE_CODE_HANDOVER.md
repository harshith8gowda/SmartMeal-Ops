# SmartMeal Ops Handover For Claude Code

You are taking over an existing full-stack MVP called **SmartMeal Ops**.

Repository:
https://github.com/harshith8gowda/SmartMeal-Ops

Local project path:

```txt
C:\Users\GIRIJA.N\Downloads\SmartMeal-Ops-main
```

## Product

SmartMeal Ops is an AI household food operations copilot. It helps users decide whether to:

1. Cook at home using Swiggy Instamart groceries
2. Order food via Swiggy Food
3. Go out dining via Swiggy Dineout

Core UX examples:

- "Plan healthy dinners this week under ₹2000"
- "Dinner for 2 tonight under ₹700"
- "Restock essentials for my family"
- "Too tired to cook, best option tonight?"
- "Book a place for 4 tomorrow"

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- TailwindCSS
- ShadCN-style local UI components
- Framer Motion
- React Hook Form + Zod
- Prisma ORM + PostgreSQL
- OpenAI-ready AI abstraction
- Swiggy Builders MCP integration layer
- Vercel-compatible deployment

## Current Status

- The app builds locally with `npm run build`.
- The dev app runs with `npm run dev`.
- Main branch has been pushed to GitHub.
- Latest important GitHub commit for Vercel-safe build:
  `bef1de216654a584e00b02873688c38ba2365b30`
- A local uncommitted change may exist in `app/layout.tsx` matching the same Vercel-safe build fix.
- Direct Vercel CLI deployment failed in the previous environment because outbound HTTPS to Vercel was blocked, not because of app code.
- The Vercel connector in the previous session had no accessible team/project.
- If the GitHub repo is connected to Vercel, pushing `main` should trigger deployment.

## Project Structure

```txt
app/
  (marketing)/page.tsx
  dashboard/page.tsx
  chat/page.tsx
  onboarding/page.tsx
  api/
    ai/plan/route.ts
    profile/route.ts
    swiggy/
      food/
      instamart/
      dineout/
components/
  cards/
  charts/
  chat/
  dashboard/
  onboarding/
  ui/
lib/
  ai/
  db/
  store/
  swiggy/
  utils/
prisma/
  schema.prisma
  seed.ts
types/
  index.ts
```

## Key Files

- `app/layout.tsx`
- `app/(marketing)/page.tsx`
- `app/dashboard/page.tsx`
- `components/chat/assistant-panel.tsx`
- `components/onboarding/onboarding-form.tsx`
- `components/cards/confirmation-card.tsx`
- `lib/ai/decision-engine.ts`
- `lib/ai/planner.ts`
- `lib/swiggy/mcp-client.ts`
- `lib/swiggy/food.ts`
- `lib/swiggy/instamart.ts`
- `lib/swiggy/dineout.ts`
- `prisma/schema.prisma`
- `.env.example`
- `README.md`

## Swiggy MCP

Docs:
https://mcp.swiggy.com/builders/docs/

Current Swiggy MCP architecture:

- Shared JSON-RPC caller: `lib/swiggy/mcp-client.ts`
- Uses `SWIGGY_MCP_ACCESS_TOKEN`
- Falls back to mock data when token is absent
- Endpoints:
  - Food: `https://mcp.swiggy.com/food`
  - Instamart: `https://mcp.swiggy.com/im`
  - Dineout: `https://mcp.swiggy.com/dineout`

Food MCP tools used:

- `get_addresses`
- `search_menu`
- `search_restaurants`
- `update_food_cart`
- `get_food_cart`
- `place_food_order`

Instamart MCP tools used:

- `search_products`
- `update_cart`
- `get_cart`
- `checkout`

Dineout MCP tools used:

- `search_restaurants_dineout`
- `get_available_slots`
- `book_table`

## Safety Rules

- Never place a real order or booking without explicit user confirmation.
- Food order route requires `confirmed: true`.
- Instamart checkout route requires `confirmed: true`.
- Dineout booking route requires `confirmed: true`.
- Swiggy MCP beta order placement has cart value restrictions; carts around/above ₹1000 should direct user to the Swiggy app if required by docs.
- For Food and Instamart, always show cart/order summary and available payment methods before placing an order.
- For Dineout booking, only free reservations should be booked.

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smartmeal_ops"
NEXTAUTH_SECRET="replace_me"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY=""

SWIGGY_MCP_CLIENT_ID=""
SWIGGY_MCP_REDIRECT_URI="http://localhost:3000/api/auth/swiggy/callback"
SWIGGY_MCP_ACCESS_TOKEN=""
SWIGGY_DEFAULT_ADDRESS_ID=""
SWIGGY_FOOD_MCP_URL="https://mcp.swiggy.com/food"
SWIGGY_INSTAMART_MCP_URL="https://mcp.swiggy.com/im"
SWIGGY_DINEOUT_MCP_URL="https://mcp.swiggy.com/dineout"
```

## Database

Prisma models:

- `User`
- `PantryItem`
- `MealPlan`
- `Order`
- `Conversation`

Enums:

- `MealSource`
- `DietGoal`

## Commands

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Known Build Issue Already Fixed

`next/font/google` Inter import caused build failure in restricted/networkless environments because Next tried to fetch Google Fonts.

`app/layout.tsx` should not import `Inter` from `next/font/google`.

Expected `app/layout.tsx` shape:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "SmartMeal Ops",
    template: "%s | SmartMeal Ops"
  },
  description: "Your AI food operations copilot for cooking, ordering, and dining out."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
```

## Immediate Goals

1. Pull/inspect the repo and confirm current file state.
2. Run:

   ```bash
   npm install
   npm run lint
   npm run typecheck
   npm run build
   ```

3. If `app/layout.tsx` still has `next/font/google`, remove it as shown above.
4. Deploy to Vercel.
5. If Vercel is not connected, connect GitHub repo `harshith8gowda/SmartMeal-Ops` to Vercel.
6. Set required environment variables in Vercel.
7. Confirm the deployed URL loads.
8. Verify these routes:
   - `/`
   - `/dashboard`
   - `/chat`
   - `/onboarding`
   - `/api/ai/plan`
9. Keep Swiggy MCP calls mock-safe when no token exists.
10. Do not break the confirmation layer for real order/booking actions.

## Recommended Next Implementation Work

- Add proper OAuth 2.1 PKCE flow for Swiggy MCP instead of manually setting `SWIGGY_MCP_ACCESS_TOKEN`.
- Add real auth via Clerk or NextAuth.
- Persist onboarding/profile to the logged-in user instead of demo email.
- Improve AI planner with structured JSON validation.
- Add real cart summary rendering from Swiggy MCP `get_food_cart` / `get_cart`.
- Add Vercel Postgres or Neon and run migrations.
- Add tests for decision engine and confirmation guards.

## Deployment Notes

Previous environment could not run `vercel deploy` due to `connect EACCES ...:443`.

If you have normal network access, use:

```bash
npx vercel login
npx vercel link
npx vercel deploy
npx vercel deploy --prod
```

Or connect the GitHub repo in Vercel dashboard and push to `main`.

## Handover Instruction

Please take over from here as the senior engineer. Start by validating the current repo state, fix only what is necessary, deploy to Vercel, and report the final deployment URL plus any required env vars still missing.
