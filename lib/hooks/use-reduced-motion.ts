'use client';

import { useReducedMotion } from 'framer-motion';

export function useMotionPreference() {
  const reduceMotion = useReducedMotion();
  return {
    reduceMotion: reduceMotion ?? false,
    motionOK: !reduceMotion,
  };
}
