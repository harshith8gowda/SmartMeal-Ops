'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Sphere } from '@react-three/drei';
import * as THREE from 'three';

type FoodShape = 'sphere' | 'box' | 'dumpling';

type FoodTokenProps = {
  position: [number, number, number];
  color: string;
  shape: FoodShape;
  scale?: number;
  speed?: number;
};

export function OrbitFood({ position, color, shape, scale = 1, speed = 1 }: FoodTokenProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.15;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {shape === 'sphere' && (
        <Sphere args={[0.6, 32, 32] as [number, number, number]}>
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
        </Sphere>
      )}
      {shape === 'box' && (
        <RoundedBox args={[1, 1, 1] as [number, number, number]} radius={0.12}>
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} />
        </RoundedBox>
      )}
      {shape === 'dumpling' && (
        <group>
          <Sphere args={[0.55, 32, 32] as [number, number, number]} scale={[1, 0.75, 1]}>
            <meshStandardMaterial color={color} roughness={0.5} />
          </Sphere>
        </group>
      )}
    </group>
  );
}
