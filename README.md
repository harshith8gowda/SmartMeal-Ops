# SmartMeal Ops

SmartMeal Ops is an AI household food operations copilot. It helps a household decide whether to cook at home with Instamart groceries, order through Swiggy Food, or reserve a table through Dineout.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- TailwindCSS, ShadCN-style reusable UI, Framer Motion
- React Hook Form and Zod for onboarding
- Prisma ORM with PostgreSQL
- NextAuth-ready auth boundary
- OpenAI-ready planner abstraction with mock fallback
- Swiggy MCP-ready service layer for Food, Instamart, and Dineout
- Vercel-compatible deployment

## MVP Features

- Premium landing page with clear product positioning
- Onboarding for household size, dietary goal, budget, cuisines, allergies, city, and cooking skill
- Dashboard with tonight recommendation, weekly meal plan, pantry status, budget tracker, quick actions, and AI assistant
- AI planner and rules-based decision engine for cook/order/dineout
- Mock Swiggy MCP services when OAuth access token is absent
- Final confirmation layer before any order placement
- Prisma schema and seed data for users, pantry, meal plans, orders, and conversations

## Folder Structure

```txt
app/
  (marketing)/page.tsx
  dashboard/page.tsx
  chat/page.tsx
  onboarding/page.tsx
  api/
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

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL and set `DATABASE_URL`.

4. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Run migration:

   ```bash
   npm run prisma:migrate -- --name init
   ```

6. Seed demo data:

   ```bash
   npm run prisma:seed
   ```

7. Start the app:

   ```bash
   npm run dev
   ```

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

When `SWIGGY_MCP_ACCESS_TOKEN` is blank, `lib/swiggy/*` returns deterministic mock data so the app remains usable.

## Swiggy MCP Integration

Swiggy Builders Club exposes three streamable HTTP MCP endpoints:

- Food: `POST https://mcp.swiggy.com/food`
- Instamart: `POST https://mcp.swiggy.com/im`
- Dineout: `POST https://mcp.swiggy.com/dineout`

All live calls go through `lib/swiggy/mcp-client.ts`, which sends JSON-RPC `tools/call` requests with `Authorization: Bearer <SWIGGY_MCP_ACCESS_TOKEN>`.

The integration boundary is intentionally thin:

- `lib/swiggy/food.ts`: `get_addresses`, `search_menu`, `search_restaurants`, `update_food_cart`, `get_food_cart`, `place_food_order`
- `lib/swiggy/instamart.ts`: `search_products`, `update_cart`, `get_cart`, `checkout`
- `lib/swiggy/dineout.ts`: `search_restaurants_dineout`, `get_available_slots`, `book_table`

API routes under `app/api/swiggy/*` call those services. Keep the UI pointed at the app routes so confirmation, logging, and mock fallback stay centralized.

## Swiggy OAuth Notes

Swiggy MCP uses OAuth 2.1 with PKCE. After access approval, register an exact redirect URI, redirect the user to `/auth/authorize` with `scope=mcp:tools`, exchange the code at `/auth/token`, and store `access_token` securely. Access tokens last 5 days; treat 401 as a signal to re-run authorization.

## Deployment

1. Push the repo to GitHub.
2. Import the project into Vercel.
3. Add Vercel Postgres or another managed PostgreSQL database.
4. Set the environment variables above in Vercel.
5. Build command: `npm run build`.
6. Run Prisma migrations from CI or a release step:

   ```bash
   npx prisma migrate deploy
   ```

## Safety Rule

Order and booking APIs must require explicit confirmation. Food placement, Instamart checkout, and Dineout booking routes reject requests unless `confirmed: true` is provided. Food and Instamart MCP beta order placement is limited to carts below ₹1000; larger carts should be completed in the Swiggy app.
