'use client';

import { useEffect, useState } from 'react';

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
  const [tier, setTier] = useState<DeviceTier>('high');

  useEffect(() => {
    // Compute the real tier only after hydration so the first render always
    // matches the server snapshot ('high') and avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only hydration update
    setTier(getTier());

    return subscribe(() => setTier(getTier()));
  }, []);

  return tier;
}
