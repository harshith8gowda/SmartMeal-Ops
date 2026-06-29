'use client';

import { useSyncExternalStore } from 'react';

export type DeviceTier = 'high' | 'medium' | 'low';

interface NavigatorWithDevice extends Navigator {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
}

function getTier(): DeviceTier {
  if (typeof window === 'undefined') return 'high';

  const nav = navigator as NavigatorWithDevice;
  const connection = nav.connection;

  const lowPower =
    connection?.saveData ||
    connection?.effectiveType === '2g' ||
    connection?.effectiveType === 'slow-2g';

  const weakGPU = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smallScreen = window.innerWidth < 768;

  if (lowPower || weakGPU || smallScreen || (nav.deviceMemory && nav.deviceMemory <= 4)) {
    return 'low';
  }

  if (nav.deviceMemory && nav.deviceMemory <= 8) {
    return 'medium';
  }

  return 'high';
}

function subscribe(onChange: () => void) {
  if (typeof window === 'undefined') return () => {};

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleChange = () => onChange();

  media.addEventListener?.('change', handleChange);
  window.addEventListener('resize', handleChange);

  return () => {
    media.removeEventListener?.('change', handleChange);
    window.removeEventListener('resize', handleChange);
  };
}

export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(subscribe, getTier, () => 'high');
}
