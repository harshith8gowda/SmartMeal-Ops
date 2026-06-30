/**
 * 3D scene palette tokens matching the Tailwind/CSS design system.
 * Three.js materials/lights need hex/RGB strings, not CSS HSL, so these are
 * kept as hex values derived from the same design tokens used in CSS.
 */
export const tokens = {
  primary: '#FB7718', // matches hsl(25 97% 54%) — Swiggy orange
  accent: '#F5AC19', // matches hsl(35 95% 56%) — warm amber
  success: '#36D399', // matches hsl(158 64% 52%) — cook green
  dineout: '#B152E0', // matches hsl(280 70% 60%) — dineout purple
  glow: '#FB7718', // matches hsl(25 97% 54%) — Swiggy orange
} as const;

export type ColorToken = keyof typeof tokens;
