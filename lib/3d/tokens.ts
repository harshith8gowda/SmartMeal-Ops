/**
 * 3D scene palette tokens matching the Tailwind/CSS design system.
 * All HSL values are kept as strings so they work directly with Three.js
 * color props and React Three Fiber JSX materials/lights.
 */
export const tokens = {
  primary: 'hsl(25 97% 54%)',
  accent: 'hsl(35 95% 56%)',
  success: 'hsl(158 64% 52%)',
  dineout: 'hsl(280 70% 60%)',
  glow: 'hsl(25 97% 54%)',
} as const;

export type ColorToken = keyof typeof tokens;
