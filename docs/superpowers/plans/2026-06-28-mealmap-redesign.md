# MealMap Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign SmartMeal Ops into MealMap, a Swiggy-only consumer food operations copilot with a dashboard that compares Cook / Order / Dineout options side by side and a weekly meal planner that pre-builds carts and bookings.

**Architecture:** Keep the existing Next.js + Clerk + Prisma + OpenAI + Swiggy MCP stack. Refactor the data model to support a weekly `MealSlot` grid and `CartSession` redirect URLs. Replace the single-recommendation dashboard with a three-card comparison view. Add new `/meal-plan`, `/orders`, and `/profile` routes. Ensure the app only builds carts and redirects to Swiggy — it never places real orders or payments.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, TailwindCSS, Clerk, Prisma + Neon, OpenAI, Framer Motion, Swiggy MCP, Vitest.

## Global Constraints

- **Swiggy-only:** Only use Swiggy MCP tools for Food, Instamart, and Dineout.
- **Cart-build-only:** The app never places a real order or payment. It builds carts/bookings and redirects the user to Swiggy.
- **Restrained orange:** Keep the dark aurora glass base but use Swiggy orange as a primary accent only.
- **Clerk auth:** Use Clerk for authentication and user context.
- **Neon Postgres:** Use Prisma with Neon for persistence.
- **Mock-safe:** All Swiggy MCP calls must fall back to mock data when no token is available.
- **No next/font/google:** Do not use `next/font/google` to avoid build failures.

## File Structure

### Modified files
- `app/layout.tsx` — update metadata to MealMap, remove `next/font/google` if still present.
- `app/icon.tsx` — update favicon to MealMap branding.
- `app/globals.css` — adjust orange gradient intensity to be more restrained.
- `app/(marketing)/page.tsx` — rebrand to MealMap, update hero to show comparison concept.
- `app/dashboard/page.tsx` — replace single recommendation with three-card comparison dashboard.
- `app/onboarding/page.tsx` — expand to collect addresses and default budget.
- `app/chat/page.tsx` — remove or fold into dashboard (optional).
- `lib/ai/decision-engine.ts` — return all three sources (Cook, Order, Dineout) instead of one.
- `lib/ai/planner.ts` — generate 7-day `MealSlot` plan and pre-build carts.
- `lib/swiggy/food.ts` — add cart redirect helpers; remove `placeFoodOrder` from app flow.
- `lib/swiggy/instamart.ts` — add cart redirect helpers; stop at cart build.
- `lib/swiggy/dineout.ts` — add free booking redirect helpers.
- `lib/swiggy/mcp-client.ts` — add retry on timeout and better error handling.
- `lib/db/meal-plan.ts` — adapt to `MealSlot` and `CartSession` model.
- `lib/db/orders.ts` — store redirect URLs and cart sessions.
- `components/cards/confirmation-card.tsx` — replace confirm action with cart build + redirect.
- `components/cards/meal-plan-card.tsx` — adapt to weekly planner mini cards and detail sheet.
- `components/orders/order-list.tsx` — add reorder and Swiggy links.
- `package.json` — rename project to `mealmap`.
- `prisma/schema.prisma` — add `Address`, `Preference`, `MealSlot`, `CartSession`, update `Order` to `OrderHistory`.

### New files
- `app/meal-plan/page.tsx` — weekly meal planner page.
- `app/orders/page.tsx` — order/booking history page.
- `app/profile/page.tsx` — user profile, addresses, preferences.
- `app/api/cart/route.ts` — build cart/booking via MCP and return redirect URL.
- `app/api/recommendations/route.ts` — return all three recommendations for dashboard.
- `app/api/meal-plan/route.ts` — CRUD for weekly meal slots.
- `components/dashboard/comparison-card.tsx` — reusable Cook/Order/Dineout card.
- `components/dashboard/input-bar.tsx` — budget, time, mood, diet chips.
- `components/dashboard/cart-summary.tsx` — cart/booking summary before redirect.
- `components/meal-plan/week-grid.tsx` — 7-day meal slot grid.
- `components/meal-plan/slot-sheet.tsx` — detail sheet for a slot.
- `components/profile/address-form.tsx` — add/edit saved addresses.
- `components/profile/preference-form.tsx` — dietary preferences.
- `lib/ai/cart-builder.ts` — orchestrates MCP cart/booking creation and returns redirect URL.
- `lib/db/address.ts` — CRUD for addresses.
- `lib/db/cart-session.ts` — CRUD for cart sessions.
- `lib/db/preference.ts` — CRUD for preferences.
- `lib/utils/swiggy-url.ts` — helper to generate Swiggy app/web redirect URLs.

## Phase 1: Foundation

### Task 1: Rebrand and update layout

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/icon.tsx`
- Modify: `app/globals.css`
- Modify: `package.json`

**Interfaces:**
- Consumes: existing metadata, favicon, CSS variables.
- Produces: `metadata.title` and `metadata.description` updated to MealMap; package name changed to `mealmap`; restrained orange theme.

- [ ] **Step 1: Update layout metadata**

```tsx
export const metadata: Metadata = {
  title: {
    default: "MealMap",
    template: "%s | MealMap"
  },
  description: "Decide dinner. Build the cart. Swiggy handles the rest."
};
```

- [ ] **Step 2: Ensure no `next/font/google` imports remain in `app/layout.tsx`**

If present, remove them and use system fonts or CSS font variables instead.

- [ ] **Step 3: Update favicon in `app/icon.tsx`**

Keep the generated PNG but change the label text from "SM" to "MM".

```tsx
const size = 32;
return new ImageResponse(
  (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FC8019, #EA580C)",
        borderRadius: "8px"
      }}
    >
      <span style={{ fontSize: 18, color: "white", fontWeight: 700 }}>MM</span>
    </div>
  ),
  { width: size, height: size }
);
```

- [ ] **Step 4: Reduce orange intensity in `app/globals.css`**

Replace the dominant orange background aurora with a more neutral dark slate base and subtle orange accents. Keep the noise overlay and premium-card utilities.

```css
body {
  @apply bg-background text-foreground antialiased;
  background:
    radial-gradient(ellipse at 10% 10%, rgba(252, 128, 25, 0.08), transparent 35%),
    radial-gradient(ellipse at 90% 20%, rgba(234, 88, 12, 0.06), transparent 40%),
    radial-gradient(ellipse at 50% 90%, rgba(251, 191, 36, 0.04), transparent 35%),
    hsl(222 47% 6%);
  background-attachment: fixed;
}
```

- [ ] **Step 5: Rename project in `package.json`**

```json
"name": "mealmap"
```

- [ ] **Step 6: Run typecheck and commit**

```bash
npm run typecheck
npm run lint
git add app/layout.tsx app/icon.tsx app/globals.css package.json
git commit -m "rebrand: MealMap metadata, favicon, and restrained orange theme"
```

### Task 2: Update database schema

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260628000000_mealmap_redesign/migration.sql`
- Modify: `prisma/seed.ts`

**Interfaces:**
- Consumes: existing `User`, `MealPlan`, `Order`, `PantryItem` models.
- Produces: new `Address`, `Preference`, `MealSlot`, `CartSession`, `OrderHistory` models and the migration to apply them.

- [ ] **Step 1: Rewrite `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String            @id
  clerkId           String            @unique
  email             String            @unique
  name              String?
  avatarUrl         String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  swiggyAccessToken String?
  addresses         Address[]
  preference        Preference?
  pantryItems       PantryItem[]
  mealSlots         MealSlot[]
  cartSessions      CartSession[]
  orderHistory      OrderHistory[]
}

model Address {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  label     String
  address   String
  city      String
  pincode   String
  lat       Float?
  lng       Float?
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

model Preference {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  diet          String[] @default([])
  allergies     String[] @default([])
  cuisines      String[] @default([])
  householdSize Int      @default(1)
  defaultBudget Int      @default(500)
  cookSkill     String   @default("beginner")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model PantryItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  item      String
  quantity  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, item])
  @@index([userId])
}

model MealSlot {
  id            String     @id @default(cuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  date          DateTime
  mealType      String     // breakfast, lunch, dinner
  source        MealSource
  title         String
  description   String?
  cost          Int        @default(0)
  timeMinutes   Int        @default(0)
  cartSessionId String?
  cartSession   CartSession? @relation(fields: [cartSessionId], references: [id])
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@index([userId, date])
}

model CartSession {
  id           String       @id @default(cuid())
  userId       String
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  source       MealSource
  redirectUrl  String
  payload      Json
  status       String       @default("ready")
  mealSlots    MealSlot[]
  orderHistory OrderHistory[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  @@index([userId])
}

model OrderHistory {
  id             String       @id @default(cuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  cartSessionId  String
  cartSession    CartSession  @relation(fields: [cartSessionId], references: [id], onDelete: Cascade)
  source         MealSource
  title          String
  total          Int          @default(0)
  status         String       @default("pending")
  swiggyUrl      String?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([userId])
}

enum MealSource {
  cook
  order
  dineout
}
```

- [ ] **Step 2: Generate the migration**

```bash
npx prisma migrate dev --name mealmap_redesign
```

- [ ] **Step 3: Update `prisma/seed.ts` to match the new schema**

Replace references to the old `MealPlan` and `Order` models with the new models. Keep the demo user creation.

- [ ] **Step 4: Run `prisma generate` and verify**

```bash
npm run prisma:generate
npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add prisma/
git commit -m "db: MealMap schema with Address, Preference, MealSlot, CartSession, OrderHistory"
```

## Phase 2: Backend Services

### Task 3: Refactor decision engine

**Files:**
- Modify: `lib/ai/decision-engine.ts`
- Modify: `lib/ai/decision-engine.test.ts`

**Interfaces:**
- Consumes: `DecisionInput` (budget, time, mood, diet, pantry, address) and Swiggy MCP search results.
- Produces: `buildRecommendations(input)` returns `{ cook: Recommendation, order: Recommendation, dineout: Recommendation }`.

- [ ] **Step 1: Update `DecisionInput` and `Recommendation` types**

```ts
export type DecisionInput = {
  budget: number;
  timeMinutes: number;
  mood: string;
  diet: string[];
  allergies: string[];
  pantry: string[];
  addressId?: string;
  lat?: number;
  lng?: number;
};

export type Recommendation = {
  source: "cook" | "order" | "dineout";
  title: string;
  description: string;
  cost: number;
  timeMinutes: number;
  effort: "low" | "medium" | "high";
  imageUrl?: string;
  items: { name: string; quantity?: string; price?: number }[];
  actionLabel: string;
  providerData: unknown;
};
```

- [ ] **Step 2: Implement `buildRecommendations(input)`**

```ts
export async function buildRecommendations(input: DecisionInput): Promise<{
  cook: Recommendation;
  order: Recommendation;
  dineout: Recommendation;
}> {
  const [cook, order, dineout] = await Promise.all([
    buildCookRecommendation(input),
    buildOrderRecommendation(input),
    buildDineoutRecommendation(input)
  ]);
  return { cook, order, dineout };
}
```

Each builder calls the corresponding Swiggy MCP service (or mock fallback) and returns a `Recommendation`.

- [ ] **Step 3: Update tests**

Rewrite `lib/ai/decision-engine.test.ts` to assert that `buildRecommendations` returns all three sources with valid costs and titles.

```ts
const result = await buildRecommendations({ budget: 500, timeMinutes: 30, mood: "lazy", diet: [], allergies: [], pantry: [] });
expect(result.cook.source).toBe("cook");
expect(result.order.source).toBe("order");
expect(result.dineout.source).toBe("dineout");
```

- [ ] **Step 4: Run tests and commit**

```bash
npm run test
npm run typecheck
git add lib/ai/decision-engine.ts lib/ai/decision-engine.test.ts
git commit -m "feat(ai): buildRecommendations returns all three sources"
```

### Task 4: Create cart builder

**Files:**
- Create: `lib/ai/cart-builder.ts`
- Create: `lib/utils/swiggy-url.ts`

**Interfaces:**
- Consumes: `Recommendation` and user context.
- Produces: `buildCart(recommendation)` returns `{ cartSessionId, redirectUrl }`.

- [ ] **Step 1: Create `lib/utils/swiggy-url.ts`**

```ts
export function getSwiggyRedirectUrl(source: "cook" | "order" | "dineout", providerData: unknown): string {
  if (source === "cook") {
    return `https://www.swiggy.com/instamart/checkout`;
  }
  if (source === "order") {
    return `https://www.swiggy.com/cart`;
  }
  return `https://www.swiggy.com/dineout`;
}
```

- [ ] **Step 2: Create `lib/ai/cart-builder.ts`**

```ts
import { getSwiggyRedirectUrl } from "@/lib/utils/swiggy-url";
import { createGroceryCart } from "@/lib/swiggy/instamart";
import { createFoodCart } from "@/lib/swiggy/food";
import { bookTable } from "@/lib/swiggy/dineout";
import { prisma } from "@/lib/db/prisma";
import type { Recommendation } from "@/lib/ai/decision-engine";

export async function buildCart(
  userId: string,
  recommendation: Recommendation
): Promise<{ cartSessionId: string; redirectUrl: string }> {
  let payload: unknown = null;
  if (recommendation.source === "cook") {
    payload = await createGroceryCart(recommendation.items);
  } else if (recommendation.source === "order") {
    payload = await createFoodCart(recommendation.items);
  } else {
    payload = await bookTable(recommendation.providerData);
  }
  const redirectUrl = getSwiggyRedirectUrl(recommendation.source, payload);
  const session = await prisma.cartSession.create({
    data: { userId, source: recommendation.source, redirectUrl, payload: payload as any, status: "ready" }
  });
  return { cartSessionId: session.id, redirectUrl };
}
```

- [ ] **Step 3: Add tests**

Create `lib/ai/cart-builder.test.ts` that mocks the Swiggy helpers and asserts the cart session is created.

- [ ] **Step 4: Run tests and commit**

```bash
npm run test
npm run typecheck
git add lib/ai/cart-builder.ts lib/utils/swiggy-url.ts lib/ai/cart-builder.test.ts
git commit -m "feat(cart): buildCart creates cart session and returns Swiggy redirect URL"
```

### Task 5: Update Swiggy MCP clients

**Files:**
- Modify: `lib/swiggy/mcp-client.ts`
- Modify: `lib/swiggy/food.ts`
- Modify: `lib/swiggy/instamart.ts`
- Modify: `lib/swiggy/dineout.ts`

**Interfaces:**
- Consumes: existing `callSwiggyTool` and MCP endpoints.
- Produces: cart-building helpers return provider data and redirect URLs; retry logic on timeout.

- [ ] **Step 1: Add retry logic to `lib/swiggy/mcp-client.ts`**

```ts
export async function callSwiggyTool<T>(tool: string, args: Record<string, unknown>, retries = 1): Promise<T> {
  try {
    return await sendSwiggyRequest<T>(tool, args);
  } catch (err) {
    if (retries > 0 && err instanceof Error && err.message.includes("timeout")) {
      return callSwiggyTool<T>(tool, args, retries - 1);
    }
    throw err;
  }
}
```

- [ ] **Step 2: Add cart-building helpers in `lib/swiggy/food.ts`**

```ts
export async function createFoodCart(items: { name: string; quantity?: string; price?: number }[]): Promise<unknown> {
  return callSwiggyTool("update_food_cart", { items });
}
```

- [ ] **Step 3: Add cart-building helpers in `lib/swiggy/instamart.ts`**

```ts
export async function createGroceryCart(items: { name: string; quantity?: string; price?: number }[]): Promise<unknown> {
  return callSwiggyTool("update_cart", { items });
}
```

- [ ] **Step 4: Add booking helpers in `lib/swiggy/dineout.ts`**

```ts
export async function bookTable(providerData: unknown): Promise<unknown> {
  return callSwiggyTool("book_table", { ...(providerData as object), freeOnly: true });
}
```

- [ ] **Step 5: Run tests and commit**

```bash
npm run test
npm run typecheck
git add lib/swiggy/
git commit -m "feat(swiggy): cart-building helpers and retry logic"
```

## Phase 3: API Routes

### Task 6: Create recommendations API

**Files:**
- Create: `app/api/recommendations/route.ts`

**Interfaces:**
- Consumes: `GET` with query params (budget, time, mood, diet, addressId) and `buildRecommendations`.
- Produces: JSON `{ recommendations: { cook, order, dineout } }`.

- [ ] **Step 1: Implement the route**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { buildRecommendations } from "@/lib/ai/decision-engine";
import { getCurrentUser } from "@/lib/auth/clerk";
import { getAddresses } from "@/lib/db/address";
import { getPreference } from "@/lib/db/preference";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const budget = Number(searchParams.get("budget") || 500);
  const timeMinutes = Number(searchParams.get("time") || 30);
  const mood = searchParams.get("mood") || "hungry";
  const addressId = searchParams.get("addressId") || undefined;

  const user = await getCurrentUser(userId);
  const preference = await getPreference(user.id);
  const addresses = await getAddresses(user.id);
  const address = addresses.find((a) => a.id === addressId) || addresses.find((a) => a.isDefault) || addresses[0];

  const recommendations = await buildRecommendations({
    budget,
    timeMinutes,
    mood,
    diet: preference?.diet || [],
    allergies: preference?.allergies || [],
    pantry: [],
    addressId: address?.id,
    lat: address?.lat,
    lng: address?.lng
  });

  return NextResponse.json({ recommendations });
}
```

- [ ] **Step 2: Create missing DB helpers**

Create `lib/db/address.ts` and `lib/db/preference.ts` with `getAddresses`, `getPreference`, `createAddress`, `updatePreference` functions.

- [ ] **Step 3: Run tests and commit**

```bash
npm run typecheck
git add app/api/recommendations/route.ts lib/db/address.ts lib/db/preference.ts
git commit -m "feat(api): recommendations endpoint for dashboard comparison cards"
```

### Task 7: Create cart API

**Files:**
- Create: `app/api/cart/route.ts`
- Delete: `app/api/confirm/route.ts` (or repurpose)

**Interfaces:**
- Consumes: `POST` with `{ recommendation }` and `buildCart`.
- Produces: JSON `{ cartSessionId, redirectUrl }`.

- [ ] **Step 1: Implement the route**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { buildCart } from "@/lib/ai/cart-builder";
import { recommendationSchema } from "@/lib/ai/schemas";
import { getCurrentUser } from "@/lib/auth/clerk";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const recommendation = recommendationSchema.parse(body.recommendation);
  const user = await getCurrentUser(userId);

  const { cartSessionId, redirectUrl } = await buildCart(user.id, recommendation);
  return NextResponse.json({ cartSessionId, redirectUrl });
}
```

- [ ] **Step 2: Add `recommendationSchema` to `lib/ai/schemas.ts`**

```ts
import { z } from "zod";

export const recommendationSchema = z.object({
  source: z.enum(["cook", "order", "dineout"]),
  title: z.string(),
  description: z.string(),
  cost: z.number(),
  timeMinutes: z.number(),
  effort: z.enum(["low", "medium", "high"]),
  imageUrl: z.string().optional(),
  items: z.array(z.object({ name: z.string(), quantity: z.string().optional(), price: z.number().optional() })),
  actionLabel: z.string(),
  providerData: z.any()
});
```

- [ ] **Step 3: Remove or repurpose `app/api/confirm/route.ts`**

If the old confirm route placed real orders, delete it or replace it with a redirect helper.

- [ ] **Step 4: Run tests and commit**

```bash
npm run typecheck
git add app/api/cart/route.ts lib/ai/schemas.ts
git rm app/api/confirm/route.ts || true
git commit -m "feat(api): cart endpoint builds cart and returns Swiggy redirect URL"
```

### Task 8: Create meal plan API

**Files:**
- Create: `app/api/meal-plan/route.ts`
- Modify: `lib/db/meal-plan.ts` (replace with slot-based helpers)

**Interfaces:**
- Consumes: `GET`/`POST` for weekly slots.
- Produces: `GET` returns `{ slots: MealSlot[] }`; `POST` creates/updates slots.

- [ ] **Step 1: Rewrite `lib/db/meal-plan.ts` as `lib/db/meal-slot.ts`**

Create `lib/db/meal-slot.ts` with:
- `getMealSlots(userId, startDate, endDate)`
- `createMealSlot(userId, data)`
- `updateMealSlot(id, data)`
- `deleteMealSlot(id)`
- `clearMealSlots(userId, startDate, endDate)`
- `bulkCreateMealSlots(userId, slots)`

- [ ] **Step 2: Implement the API route**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getMealSlots, createMealSlot, updateMealSlot, deleteMealSlot, clearMealSlots } from "@/lib/db/meal-slot";
import { getCurrentUser } from "@/lib/auth/clerk";

const slotSchema = z.object({
  id: z.string().optional(),
  date: z.string().datetime(),
  mealType: z.enum(["breakfast", "lunch", "dinner"]),
  source: z.enum(["cook", "order", "dineout"]),
  title: z.string(),
  description: z.string().optional(),
  cost: z.number().default(0),
  timeMinutes: z.number().default(0),
  cartSessionId: z.string().optional()
});

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const start = new Date(searchParams.get("start") || Date.now());
  const end = new Date(searchParams.get("end") || Date.now() + 7 * 24 * 60 * 60 * 1000);
  const user = await getCurrentUser(userId);
  const slots = await getMealSlots(user.id, start, end);
  return NextResponse.json({ slots });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const user = await getCurrentUser(userId);
  const action = body.action;

  if (action === "clear") {
    const start = new Date(body.start);
    const end = new Date(body.end);
    await clearMealSlots(user.id, start, end);
    return NextResponse.json({ success: true });
  }

  const slots = z.array(slotSchema).parse(body.slots);
  const results = await Promise.all(
    slots.map((slot) =>
      slot.id ? updateMealSlot(slot.id, slot) : createMealSlot(user.id, slot)
    )
  );
  return NextResponse.json({ slots: results });
}
```

- [ ] **Step 3: Run tests and commit**

```bash
npm run typecheck
git add app/api/meal-plan/route.ts lib/db/meal-slot.ts
git rm lib/db/meal-plan.ts || true
git commit -m "feat(api): meal plan slot CRUD"
```

## Phase 4: UI Pages

### Task 9: Dashboard redesign

**Files:**
- Modify: `app/dashboard/page.tsx`
- Create: `components/dashboard/input-bar.tsx`
- Create: `components/dashboard/comparison-card.tsx`
- Create: `components/dashboard/cart-summary.tsx`

**Interfaces:**
- Consumes: `/api/recommendations`, `/api/cart`, `premium-card`, `scroll-reveal`.
- Produces: dashboard with three comparison cards and a cart summary that redirects to Swiggy.

- [ ] **Step 1: Create `components/dashboard/input-bar.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export type InputValues = { budget: number; timeMinutes: number; mood: string; };

export function InputBar({ onChange }: { onChange: (values: InputValues) => void }) {
  const [budget, setBudget] = useState(500);
  const [time, setTime] = useState(30);
  const [mood, setMood] = useState("hungry");

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Budget</span>
        <input
          type="range"
          min={100}
          max={2000}
          step={50}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
        <span className="text-sm font-medium">₹{budget}</span>
      </div>
      <div className="flex items-center gap-2">
        {[{ label: "15m", value: 15 }, { label: "30m", value: 30 }, { label: "1h", value: 60 }, { label: "No rush", value: 120 }].map((t) => (
          <Button
            key={t.value}
            variant={time === t.value ? "default" : "ghost"}
            size="sm"
            onClick={() => setTime(t.value)}
          >
            {t.label}
          </Button>
        ))}
      </div>
      <Button size="sm" onClick={() => onChange({ budget, timeMinutes: time, mood })}>
        Find options
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Create `components/dashboard/comparison-card.tsx`**

```tsx
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/lib/ai/decision-engine";

export function ComparisonCard({ recommendation, onSelect }: { recommendation: Recommendation; onSelect: () => void }) {
  return (
    <div className="premium-card flex flex-col p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {recommendation.source === "cook" ? <ChefHat className="h-6 w-6" /> : recommendation.source === "order" ? <ShoppingBag className="h-6 w-6" /> : <CalendarCheck className="h-6 w-6" />}
      </div>
      <h3 className="font-display text-xl font-semibold">{recommendation.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{recommendation.description}</p>
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span>₹{recommendation.cost}</span>
        <span>{recommendation.timeMinutes} min</span>
        <span className="capitalize">{recommendation.effort} effort</span>
      </div>
      <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
        {recommendation.items.slice(0, 3).map((item) => (
          <li key={item.name} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {item.name}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Button onClick={onSelect} className="w-full">
          {recommendation.actionLabel}
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `components/dashboard/cart-summary.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/lib/ai/decision-engine";

export function CartSummary({ recommendation, onClose }: { recommendation: Recommendation; onClose: () => void }) {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function buildCart() {
    setLoading(true);
    const res = await fetch("/api/cart", { method: "POST", body: JSON.stringify({ recommendation }) });
    const data = await res.json();
    setLoading(false);
    if (data.redirectUrl) {
      setRedirectUrl(data.redirectUrl);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="premium-card w-full max-w-md p-6">
        <h3 className="font-display text-xl font-semibold">{recommendation.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{recommendation.description}</p>
        <ul className="mt-4 space-y-2">
          {recommendation.items.map((item) => (
            <li key={item.name} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span>{item.price ? `₹${item.price}` : ""}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={buildCart} disabled={loading} className="flex-1">
            {loading ? "Building..." : "Build cart in Swiggy"}
          </Button>
        </div>
        {redirectUrl && (
          <a href={redirectUrl} target="_blank" rel="noreferrer" className="mt-4 block text-center text-primary hover:underline">
            Open in Swiggy →
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Rewrite `app/dashboard/page.tsx`**

Replace the existing single-recommendation layout with:
- Header with greeting and address switcher.
- `InputBar` for budget, time, mood.
- Three `ComparisonCard` components in a grid.
- `CartSummary` modal when a card is selected.
- Fetch `/api/recommendations` on input change.

- [ ] **Step 5: Run tests and commit**

```bash
npm run typecheck
npm run lint
git add app/dashboard/page.tsx components/dashboard/
git commit -m "feat(dashboard): MealMap comparison cards with cart summary"
```

### Task 10: Meal plan page

**Files:**
- Create: `app/meal-plan/page.tsx`
- Create: `components/meal-plan/week-grid.tsx`
- Create: `components/meal-plan/slot-sheet.tsx`

**Interfaces:**
- Consumes: `/api/meal-plan`, `premium-card`.
- Produces: 7-day meal planner with editable slots and bulk actions.

- [ ] **Step 1: Create `components/meal-plan/week-grid.tsx`**

Render a 7-day grid with breakfast, lunch, dinner slots. Each slot shows a mini-card with source icon and title. Clicking opens the detail sheet.

- [ ] **Step 2: Create `components/meal-plan/slot-sheet.tsx`**

A side/bottom sheet that lets the user pick Cook/Order/Dineout/AI for a slot, then searches for a specific option and saves it.

- [ ] **Step 3: Create `app/meal-plan/page.tsx`**

Fetches slots from `/api/meal-plan`, renders the grid, and provides bulk actions:
- **Build all carts** — calls `/api/cart` for each slot and saves `cartSessionId`.
- **Clear week** — calls `/api/meal-plan` with `action: "clear"`.
- **Let AI plan** — calls `/api/ai/plan` to generate slots and saves them.

- [ ] **Step 4: Run tests and commit**

```bash
npm run typecheck
git add app/meal-plan/page.tsx components/meal-plan/
git commit -m "feat(meal-plan): 7-day planner with slots and bulk actions"
```

### Task 11: Orders page

**Files:**
- Create: `app/orders/page.tsx`
- Modify: `components/orders/order-list.tsx`

**Interfaces:**
- Consumes: `OrderHistory` from Prisma.
- Produces: page listing past cart/booking sessions with reorder links.

- [ ] **Step 1: Update `components/orders/order-list.tsx`**

```tsx
export function OrderList({ orders }: { orders: OrderHistory[] }) {
  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <div key={order.id} className="premium-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{order.title}</p>
              <p className="text-sm text-muted-foreground">{order.source} · {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{order.total}</p>
              <Badge variant={order.status === "completed" ? "success" : "default"}>{order.status}</Badge>
            </div>
          </div>
          {order.swiggyUrl && (
            <a href={order.swiggyUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-primary hover:underline">
              View in Swiggy
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `app/orders/page.tsx`**

Fetches `OrderHistory` from `lib/db/orders.ts` and renders `OrderList`.

- [ ] **Step 3: Run tests and commit**

```bash
npm run typecheck
git add app/orders/page.tsx components/orders/order-list.tsx
git commit -m "feat(orders): order history page with Swiggy links"
```

### Task 12: Profile page

**Files:**
- Create: `app/profile/page.tsx`
- Create: `components/profile/address-form.tsx`
- Create: `components/profile/preference-form.tsx`

**Interfaces:**
- Consumes: addresses and preferences from DB.
- Produces: editable profile with saved addresses and dietary preferences.

- [ ] **Step 1: Create `components/profile/address-form.tsx`**

Form to add/edit saved addresses with label, address, city, pincode, and a default checkbox.

- [ ] **Step 2: Create `components/profile/preference-form.tsx`**

Form to edit diet, allergies, cuisines, household size, default budget, and cook skill.

- [ ] **Step 3: Create `app/profile/page.tsx`**

Server component that loads the user, addresses, and preference, then renders the forms and `ConnectStatus` for Swiggy MCP.

- [ ] **Step 4: Run tests and commit**

```bash
npm run typecheck
git add app/profile/page.tsx components/profile/
git commit -m "feat(profile): addresses, preferences, and Swiggy connection status"
```

### Task 13: Pantry update

**Files:**
- Modify: `app/pantry/page.tsx`
- Modify: `components/pantry/pantry-manager.tsx` (if needed)

**Interfaces:**
- Consumes: existing `PantryManager`.
- Produces: pantry tab integrated into the new navigation.

- [ ] **Step 1: Update `app/pantry/page.tsx`**

Add the new navigation header, update the page title to “Pantry,” and keep the existing `PantryManager`.

- [ ] **Step 2: Commit**

```bash
npm run typecheck
git add app/pantry/page.tsx
git commit -m "ui(pantry): integrate pantry into MealMap navigation"
```

### Task 14: Landing page rebrand

**Files:**
- Modify: `app/(marketing)/page.tsx`

**Interfaces:**
- Consumes: existing landing page structure, `premium-card`, `scroll-reveal`.
- Produces: MealMap-branded landing page focused on Swiggy comparison and meal planning.

- [ ] **Step 1: Update copy and hero**

- Replace “SmartMeal Ops” with “MealMap”.
- Tagline: “Decide dinner. Build the cart. Swiggy handles the rest.”
- Hero image should evoke three options: cook, order, dine out.
- Feature cards: side-by-side comparison, weekly meal planner, one-tap Swiggy redirect.

- [ ] **Step 2: Update CTA buttons and footer**

All CTAs should point to `/sign-up` or `/dashboard`. Footer should mention MealMap and Swiggy MCP.

- [ ] **Step 3: Run tests and commit**

```bash
npm run typecheck
npm run lint
git add app/(marketing)/page.tsx
git commit -m "ui(landing): MealMap rebrand and focused value proposition"
```

## Phase 5: Testing and Deployment

### Task 15: Update tests and build

**Files:**
- Modify: `lib/ai/decision-engine.test.ts`
- Modify: `lib/ai/planner.test.ts`
- Modify: `lib/swiggy/mcp-client.test.ts`
- Create: `lib/ai/cart-builder.test.ts`

**Interfaces:**
- Consumes: updated services and API routes.
- Produces: passing tests for decision engine, planner, cart builder, and MCP client.

- [ ] **Step 1: Update decision engine tests**

Test that `buildRecommendations` returns all three sources.

- [ ] **Step 2: Update planner tests**

Test that `generateMealPlan` returns a 7-day `MealSlot` structure.

- [ ] **Step 3: Update MCP client tests**

Test retry behavior on timeout and mock-safe fallback.

- [ ] **Step 4: Add cart builder tests**

Test that `buildCart` creates a `CartSession` and returns a Swiggy redirect URL.

- [ ] **Step 5: Run full verification**

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add lib/ai/*.test.ts lib/swiggy/*.test.ts
git commit -m "test: MealMap decision engine, planner, cart builder, and MCP client"
```

### Task 16: Deploy

**Files:**
- None.

**Interfaces:**
- None.

- [ ] **Step 1: Merge `feat/v1-production-ready` into `main` and push**

```bash
git checkout main
git merge feat/v1-production-ready
git push origin main
```

- [ ] **Step 2: Monitor Vercel production deployment**

Wait for the deployment to become READY and verify the dashboard, meal plan, and profile pages.

- [ ] **Step 3: Run Prisma migration on production database**

```bash
npx prisma migrate deploy
```

- [ ] **Step 4: Verify routes**

- `/`
- `/dashboard`
- `/meal-plan`
- `/orders`
- `/profile`
- `/sign-in`
- `/sign-up`

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-28-mealmap-redesign.md`.

Two execution options:

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session using `superpowers:executing-plans`, with batch checkpoints for review.

Because the goal is to build the app completely and you have given full permissions, I recommend **Inline Execution** so we can iterate quickly and keep the whole context in one place. We can run the tasks in phases, verifying `typecheck`, `lint`, and `test` after each phase.
