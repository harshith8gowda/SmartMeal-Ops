# MealMap — SmartMeal Ops Redesign

> **Goal:** Rebuild SmartMeal Ops into a Swiggy-only food operations copilot for consumers. The app helps users decide between cooking (Swiggy Instamart), ordering (Swiggy Food), and dining out (Swiggy Dineout), then builds the cart or booking and redirects the user to Swiggy to complete payment.

## 1. Overview

- **New name:** MealMap
- **Tagline:** *Decide dinner. Build the cart. Swiggy handles the rest.*
- **Target user:** Households in India who already use Swiggy and want help deciding what to eat and executing that decision quickly.
- **Core differentiator:** A single dashboard that compares Cook / Order / Dineout options side by side, plus a weekly meal planner that pre-builds carts and bookings.
- **Platform:** Next.js 16 App Router, React 19, TypeScript, TailwindCSS, Clerk, Prisma + Neon, OpenAI, Swiggy MCP.

## 2. Goals

1. Users can decide tonight’s meal in under 30 seconds.
2. Users can compare real Cook, Order, and Dineout options side by side.
3. Users can plan a week of meals and have carts/bookings pre-built.
4. The app never places a real order; it only builds carts and redirects to Swiggy.
5. The app stays visually connected to Swiggy but uses orange as a restrained accent.

## 3. User Flows

### 3.1 Today’s Decision (Dashboard)
1. User opens the dashboard.
2. They set quick inputs: budget, time available, mood, and diet preferences.
3. The app calls the decision engine and Swiggy MCP to generate three comparison cards:
   - **Cook:** recipe + Instamart grocery cart + total cost + time.
   - **Order:** Swiggy Food restaurant + dish + cart total + delivery time.
   - **Dineout:** restaurant + table slot availability + estimated cost.
4. User taps one option.
5. App shows a cart/booking summary.
6. User taps **Build cart / Book table**.
7. App calls Swiggy MCP to build the cart or hold the table.
8. App redirects the user to the Swiggy app/website to complete payment.

### 3.2 Weekly Planner (Meal Plan)
1. User switches to the **Meal Plan** tab.
2. They see a 7-day grid with breakfast, lunch, and dinner slots.
3. For each slot they can choose:
   - Cook with recipe
   - Order from a restaurant
   - Dineout booking
   - Let AI decide
4. The app pre-builds carts for planned days.
5. At meal time, the user taps **Get it** and is redirected to Swiggy.

## 4. Information Architecture

**Navigation tabs:**
- **Dashboard** — today’s decision
- **Meal Plan** — weekly planner
- **Orders** — history of carts/bookings
- **Pantry** — ingredients for cook suggestions
- **Profile** — preferences, addresses, budget defaults

**Key routes:**
- `/` — marketing landing page
- `/dashboard` — today’s decision
- `/meal-plan` — weekly planner
- `/orders` — order history
- `/pantry` — pantry manager
- `/profile` — user profile and preferences
- `/sign-in`, `/sign-up` — Clerk auth
- `/api/*` — API routes for decision engine, MCP, meal plans, orders, pantry, profile

## 5. Key Screens & Components

### 5.1 Dashboard (Today)
- Header with greeting, address switcher, and notification bell.
- Input bar: budget slider, time chips (15 min / 30 min / 1 hr / no rush), mood chips, diet tags.
- Three comparison cards with source icon, title, cost, time, effort level, and primary action.
- Cards are visually distinct: Cook card is tall with recipe details; Order and Dineout cards are compact.
- Refresh button to regenerate options.
- Uses `premium-card` and `scroll-reveal` utilities.

### 5.2 Meal Plan (Week)
- 7-day grid with meal slots.
- Mini cards per slot showing source icon, title, and cost.
- Bulk actions: **Build all carts for this week**, **Clear week**, **Let AI plan the week**.
- Tapping a slot opens a detail sheet to pick the option.

### 5.3 Cart / Booking Summary
- Bottom sheet or full-screen modal.
- Itemized list (groceries, dishes, or reservation details).
- Total cost, time, and **Confirm & open Swiggy** button.
- No payment happens inside the app.

### 5.4 Orders
- List of past carts/bookings with date, source, status, and **Reorder** button.
- Each item links to the Swiggy order if available.

### 5.5 Pantry
- List of ingredients the user has.
- Used to filter Cook suggestions so recipes prioritize existing ingredients.

### 5.6 Profile
- Saved addresses, dietary preferences, household size, default budget.
- Swiggy MCP connection status.

### 5.7 Visual Direction
- Keep the dark aurora glass base but make the orange accent more restrained.
- Use orange for primary buttons, active states, source badges, and key highlights.
- Maintain the premium feel: subtle noise, rounded cards, custom easing, hover lift.

## 6. Backend & Data Model

### 6.1 Services
- **Decision Engine** — ranks Cook / Order / Dineout options based on user context.
- **Swiggy MCP Client** — thin JSON-RPC wrapper for Food, Instamart, and Dineout tools.
- **Cart Builder** — converts a recommendation into a cart/booking and returns a Swiggy redirect URL.
- **Meal Planner** — generates and stores weekly meal plans.

### 6.2 Data Models (Prisma)
- `User` — Clerk id, preferences, household size, default budget.
- `Address` — saved delivery/dining addresses.
- `Preference` — diet, cuisine, allergies.
- `MealPlan` — one row per week, linked to user.
- `MealSlot` — day, meal type, chosen source, recipe/restaurant id, status.
- `CartSession` — stores MCP-built cart/booking details and redirect URL.
- `OrderHistory` — history of what was sent to Swiggy.
- `PantryItem` — ingredients and quantities.

### 6.3 Swiggy MCP Tools
- **Food:** `search_restaurants`, `search_menu`, `update_food_cart`, `get_food_cart`.
- **Instamart:** `search_products`, `update_cart`, `get_cart`.
- **Dineout:** `search_restaurants_dineout`, `get_available_slots`, `book_table`.

### 6.4 Safety Rule
The app only builds carts and creates bookings. Real payment and order confirmation always happen on Swiggy.

## 7. Error Handling

- **Swiggy MCP unavailable / no token** → show a “Connect Swiggy” prompt and fallback to manual browsing suggestions.
- **No results for a source** → hide that card or show a “No options found — try a different budget/location” message.
- **Cart build fails** → show the summary with a “Search on Swiggy” link instead of redirecting.
- **Location missing** → prompt the user to add an address before showing options.
- **MCP timeout** → retry once, then fall back to manual suggestions.

## 8. Testing

- Unit tests for the decision engine.
- MCP client tests with mocked responses.
- E2E tests for dashboard → cart summary → redirect flow.
- CSP and security header tests.
- Rate limiting and auth guard tests.

## 9. Success Criteria

1. A user can pick a meal type and see three options within 3 seconds.
2. A user can build a cart and be redirected to Swiggy without errors.
3. A user can plan a week and see all carts pre-built.
4. The app never places a real order without the user being on Swiggy.
5. The new name and restrained orange theme are reflected across the app and landing page.

## 10. Open Questions / Next Steps

- Finalize the new logo/favicon for MealMap.
- Confirm exact Swiggy MCP tool names and request schemas once the agreement is signed.
- Decide whether to keep or remove the existing AI chat assistant (currently in `/chat`).
