# SmartMeal Ops

SmartMeal Ops is an AI household food operations copilot that helps users decide whether to cook at home, order via Swiggy Food, or dine out via Dineout.

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- TailwindCSS + reusable UI components
- Prisma + PostgreSQL
- AI abstraction layer with mock-safe fallback
- Swiggy MCP-ready service layer (Food, Instamart, Dineout)

## Features in this MVP
- Onboarding flow with household and goal preferences
- Dashboard with tonight recommendation + weekly meal plan
- AI assistant chat panel
- Decision engine: cook/order/dineout
- Pantry memory starter models
- Final confirmation-ready cart/order payload architecture
- API routes for Swiggy Food / Instamart / Dineout workflows
- Seed data for local development

## Folder Structure
```txt
app/
  (marketing)/page.tsx
  dashboard/page.tsx
  chat/page.tsx
  onboarding/page.tsx
  api/
components/
  ui/
  cards/
  charts/
  chat/
  onboarding/
lib/
  ai/
  swiggy/
  db/
  utils/
prisma/
  schema.prisma
  seed.ts
types/
```

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Run migrations:
   ```bash
   npm run prisma:migrate -- --name init
   ```
5. Seed data:
   ```bash
   npm run prisma:seed
   ```
6. Start app:
   ```bash
   npm run dev
   ```

## Deployment (Vercel)
1. Push repo to GitHub.
2. Import project in Vercel.
3. Set environment variables from `.env.example`.
4. Add managed Postgres and set `DATABASE_URL`.
5. Build command: `npm run build`.
6. Run Prisma migration in CI/CD or post-deploy hook.

## Swiggy MCP integration notes
- Service layer lives in `lib/swiggy/`.
- If API keys are absent, mock responses are returned so UI still works.
- Replace inline comments in service files with actual MCP endpoint calls and auth headers.

## Future-ready extensions
- Household family mode (multiple members)
- Spend analytics and trend charts
- WhatsApp agent orchestrator
