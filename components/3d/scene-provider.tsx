'use client';

import { ReactNode, createContext, useContext } from 'react';
import { useMotionPreference } from '@/lib/hooks/use-reduced-motion';
import { useDeviceTier, DeviceTier } from '@/lib/hooks/use-device-tier';

const SceneTierContext = createContext<DeviceTier>('high');

export function useSceneTier() {
  return useContext(SceneTierContext);
}

export function SceneProvider({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { reduceMotion } = useMotionPreference();
  const tier = useDeviceTier();

  if (reduceMotion) return <>{fallback}</>;
  return <SceneTierContext.Provider value={tier}>{children}</SceneTierContext.Provider>;
}
