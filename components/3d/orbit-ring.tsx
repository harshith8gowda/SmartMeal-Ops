'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitFood } from './orbit-food';
import { tokens } from '@/lib/3d/tokens';

const foodTokens = [
  { angle: 0, color: tokens.primary, shape: 'box' as const, scale: 1.2 },
  { angle: 60, color: tokens.accent, shape: 'sphere' as const, scale: 0.9 },
  { angle: 120, color: tokens.success, shape: 'dumpling' as const, scale: 1.0 },
  { angle: 180, color: tokens.dineout, shape: 'sphere' as const, scale: 0.8 },
  { angle: 240, color: tokens.primary, shape: 'box' as const, scale: 1.1 },
  { angle: 300, color: tokens.accent, shape: 'dumpling' as const, scale: 0.95 },
];

export type OrbitRingProps = {
  speed?: number;
  radius?: number;
  autoRotate?: boolean;
};

export function OrbitRing({ speed = 0.2, radius = 3.5, autoRotate = true }: OrbitRingProps) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ringRef.current || !autoRotate) return;
    ringRef.current.rotation.y += delta * speed;
  });

  return (
    <group ref={ringRef} rotation={[0.2, 0, 0]}>
      {foodTokens.map((t, i) => {
        const rad = (t.angle * Math.PI) / 180;
        return (
          <OrbitFood
            key={i}
            position={[Math.cos(rad) * radius, Math.sin(rad * 1.5) * 0.4, Math.sin(rad) * radius]}
            color={t.color}
            shape={t.shape}
            scale={t.scale}
            speed={0.8 + (i % 5) * 0.15}
          />
        );
      })}
    </group>
  );
}
