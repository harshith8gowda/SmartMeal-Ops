# MealMap Brand Guidelines v2.0

> Last updated: 2026-06-30
> Status: Active
> Replaces: v1.0 (dark Swiggy-orange tech template)

## Quick Reference

| Element | Value |
|---------|-------|
| Primary Color | #D84315 (Tamarind) |
| Cook Color | #2E7D32 (Basil) |
| Order Color | #F9A825 (Saffron) |
| Dineout Color | #6A1B9A (Eggplant) |
| Display Font | Space Grotesk |
| Body Font | DM Sans |
| Voice | Direct, warm, never hungry for your attention |

---

## 1. Brand Idea

MealMap is the calm, confident answer to "what should I eat?" It does not scream. It does not throw confetti. It looks at your mood, your budget, and your week, and hands you a decision you can trust.

The previous identity leaned on a dark tech palette and a generic 3D orbit. The new identity is lighter, more editorial, and grounded in the real world of food: markets, recipe cards, and the three ways Indians actually eat — cook at home, order in, or step out.

---

## 2. Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Tamarind | #D84315 | rgb(216,67,21) | Primary CTAs, links, key emphasis |
| Tamarind Dark | #BF360C | rgb(191,54,12) | Hover states, pressed buttons |
| Tamarind Light | #FFCCBC | rgb(255,204,188) | Subtle highlights, badges |

### Mode Colors (Cook / Order / Dineout)

| Name | Hex | Usage |
|------|-----|-------|
| Basil | #2E7D32 | Cook-at-home options, freshness, ingredients |
| Saffron | #F9A825 | Order/delivery options, warmth, speed |
| Eggplant | #6A1B9A | Dineout options, evening, occasion |

### Neutral Palette

| Name | Hex | Usage |
|------|-----|-------|
| Rice Paper | #FAF9F6 | Page backgrounds |
| Flour | #FFFFFF | Cards, surfaces, modals |
| Charcoal | #1C1917 | Primary text |
| Pepper | #44403C | Secondary text |
| Stone | #78716C | Muted text, captions |
| Linen | #E7E5E4 | Borders, dividers |
| Porcelain | #F5F5F4 | Subtle backgrounds, hover states |

### Semantic Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | #2E7D32 | Confirmations, added-to-cart, saved |
| Warning | #F9A825 | Cautions, pending, maybe-later |
| Error | #C62828 | Errors, destructive actions |
| Info | #455A64 | Tips, explanations |

### Accessibility

- Charcoal on Rice Paper: 15.3:1 (AAA)
- Tamarind on Rice Paper: 4.8:1 (AA for large text, AA for UI components)
- Basil on Rice Paper: 5.1:1 (AA)
- All body text pairings meet WCAG 2.1 AA.

---

## 3. Typography

### Font Stack

```css
--font-display: 'Space Grotesk', system-ui, sans-serif;
--font-body: 'DM Sans', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Loading

Load via `next/font/google`:

```ts
import { Space_Grotesk, DM_Sans } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});
```

### Type Scale

| Element | Desktop | Mobile | Weight | Line Height | Letter-spacing |
|---------|---------|--------|--------|-------------|----------------|
| Display | 72px | 48px | 700 | 1.05 | -0.02em |
| H1 | 56px | 40px | 700 | 1.1 | -0.02em |
| H2 | 40px | 32px | 600 | 1.2 | -0.01em |
| H3 | 28px | 24px | 600 | 1.3 | 0 |
| H4 | 22px | 20px | 600 | 1.35 | 0 |
| Body Large | 18px | 18px | 400 | 1.6 | 0 |
| Body | 16px | 16px | 400 | 1.6 | 0 |
| Small | 14px | 14px | 500 | 1.5 | 0 |
| Caption | 12px | 12px | 500 | 1.4 | 0.01em |

### Typography Rules

- Use **Space Grotesk** for display, headlines, and numbers.
- Use **DM Sans** for body, UI labels, and captions.
- Headings are sentence case. No all-caps eyebrows.
- Body text should feel like a conversation, not a brochure.

---

## 4. Logo & Mark

### Mark

The MealMap mark is a **rounded map pin containing a small fork and knife** or a **stylized plate**. It should feel like a location app for food.

### Logo Variants

| Variant | File | Use Case |
|---------|------|----------|
| Full Horizontal | `logo-full.svg` | Nav, headers |
| Mark Only | `logo-mark.svg` | Favicon, app icon, small spaces |
| Monochrome | `logo-mono.svg` | Watermarks, limited-color contexts |

### Clear Space

Minimum clear space around the logo = the height of the mark.

### Don'ts

- Don't rotate or skew the mark.
- Don't change the mark color outside the palette.
- Don't add shadows or glows.
- Don't place the mark on busy food photography without a neutral backing shape.

---

## 5. Voice & Tone

### Brand Personality

| Trait | Description |
|-------|-------------|
| **Direct** | No filler, no hype. Says what the feature does. |
| **Warm** | Food is personal. The copy respects that. |
| **Confident** | Makes a recommendation without hedging. |
| **Practical** | Every line points to an action or a saved minute. |

### Voice Chart

| Trait | We Are | We Are Not |
|-------|--------|------------|
| Direct | "See your options. Pick one." | "Unlock the power of meal planning." |
| Warm | "Dinner is solved." | "Optimize your caloric intake." |
| Confident | "This is the best choice tonight." | "Maybe this could work for you?" |
| Practical | "Add it to your Swiggy cart." | "Leverage our deep integrations." |

### Tone by Context

| Context | Tone | Example |
|---------|------|---------|
| Marketing | Bold, appetizing | "Decide dinner in one sentence." |
| Dashboard | Helper, decisive | "Here's what to eat tonight." |
| Empty state | Inviting, specific | "Tell me what you're craving and I'll build the map." |
| Error | Calm, fixable | "Could not reach Swiggy. Try again in a second." |
| Success | Brief, satisfying | "Added to cart." |

### Prohibited Terms

| Avoid | Reason |
|-------|--------|
| Revolutionary | Overused, unprovable |
| Best-in-class | Vague |
| Seamless | Overused |
| Leverage | Use "use" |
| Unlock | Gamifies a simple decision |
| AI-powered | The tech is invisible; the decision is what matters |

---

## 6. Imagery & Illustration

### Photography Style

- **Lighting:** Natural daylight or warm tungsten. Avoid flat studio lighting.
- **Subjects:** Real food, real hands, real Indian kitchens and tables. No sterile stock plating.
- **Color treatment:** Warm, slightly desaturated. Food should look edible, not plastic.
- **Composition:** Close crops, shallow depth of field, honest messiness.

### Illustration Style

- Flat, friendly, single-weight line illustrations.
- Stroke: 1.5px, rounded caps.
- Colors: palette only, with one accent color per illustration.
- No gradients in illustrations.

### Icon Style

- Outlined, 24px grid.
- Stroke: 1.5px.
- Corner radius: 2px.
- Use Lucide icons by default. Custom icons follow the illustration style.

---

## 7. Design Components

### Buttons

| Type | Background | Text | Border | Radius | Usage |
|------|------------|------|--------|--------|-------|
| Primary | Tamarind | Flour | none | 12px | Main CTAs |
| Secondary | Flour | Tamarind | 1px Linen | 12px | Secondary actions |
| Tertiary | transparent | Charcoal | none | 12px | Subtle actions |
| Ghost | transparent | Stone | none | 12px | Low-priority links |

### Cards

- Background: Flour.
- Border: 1px Linen.
- Radius: 16px.
- Shadow: none by default; use `0 4px 24px rgba(28,25,23,0.06)` for floating cards.
- Padding: 24px.

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| 1 | 4px | Tight |
| 2 | 8px | Compact |
| 3 | 12px | Standard tight |
| 4 | 16px | Standard |
| 5 | 24px | Relaxed |
| 6 | 32px | Section inner |
| 7 | 48px | Section outer |
| 8 | 64px | Major section breaks |
| 9 | 96px | Hero spacing |

### Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 12px |
| Cards | 16px |
| Inputs | 12px |
| Pills | 9999px |
| Modal | 20px |

---

## 8. Signature Element

The **MealMap Food Map** is the single element the design is remembered by.

It is a horizontal, scrollable map of the user's food options — Cook, Order, and Dineout — shown as location-style cards on a subtle grid. It replaces the previous 3D orbit. It is:

- **Functional:** each card is a real option type.
- **Readable:** it never overlaps the headline.
- **Distinctive:** it turns the product name into a visual metaphor.
- **Lightweight:** no WebGL, no CSP headaches, fast on mobile.

The map lives in the hero and is echoed as a smaller component in the dashboard and meal-plan pages.

---

## 9. AI Image Generation

### Base Prompt Template

> Warm, natural-light food photography, slightly desaturated, honest Indian kitchen or dining table, shallow depth of field, appetizing without being overly styled, colors lean tamarind orange #D84315, basil green #2E7D32, saffron yellow #F9A825, and eggplant purple #6A1B9A, neutral warm background.

### Example Prompts

**Hero food spread:**
```
Overhead shot of a busy Indian dinner table with a thali, biryani bowl, delivery bags, and a phone showing a map, warm natural light, shallow depth of field, slightly desaturated, neutral warm background, appetizing, editorial food photography.
```

**Cook card illustration:**
```
Flat line illustration of a chopping board with vegetables and a knife, single 1.5px stroke, basil green #2E7D32, minimal, friendly, white background.
```

---

## 10. Design Don'ts

| Avoid | Reason |
|-------|--------|
| Dark background as default | The previous identity felt like a generic tech dashboard. |
| 3D abstract shapes | They did not communicate food or map; they looked like a demo. |
| Generic 3-column feature grid with icons in circles | Recognizable AI template pattern. |
| All-caps eyebrows and tracking-widest | Feels like a billboard, not a conversation. |
| `system-ui` as the primary font | Looks like every other default site. |
| Gradient backgrounds | Keep color flat and intentional. |
| Decorative blobs or wavy dividers | Replace with real content or the Food Map. |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-06-30 | New light, editorial direction. Replaced dark/3D identity with Food Map signature. |
