'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { OrbitFood } from './orbit-food';
import { cn } from '@/lib/utils/cn';

const tokens = [
  { angle: 0, color: '#FC8019', shape: 'box' as const, scale: 1.2 },
  { angle: 60, color: '#F59E0B', shape: 'sphere' as const, scale: 0.9 },
  { angle: 120, color: '#34D399', shape: 'dumpling' as const, scale: 1.0 },
  { angle: 180, color: '#A78BFA', shape: 'sphere' as const, scale: 0.8 },
  { angle: 240, color: '#FC8019', shape: 'box' as const, scale: 1.1 },
  { angle: 300, color: '#FBBF24', shape: 'dumpling' as const, scale: 0.95 },
];

type OrbitRingProps = {
  speed?: number;
  radius?: number;
  autoRotate?: boolean;
};

function OrbitRing({ speed = 0.2, radius = 3.5, autoRotate = true }: OrbitRingProps) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ringRef.current || !autoRotate) return;
    ringRef.current.rotation.y += delta * speed;
  });

  return (
    <group ref={ringRef} rotation={[0.2, 0, 0]}>
      {tokens.map((t, i) => {
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

type MealMapOrbitProps = {
  className?: string;
  speed?: number;
  autoRotate?: boolean;
  interaction?: boolean;
};

export function MealMapOrbit({
  className,
  speed = 0.2,
  autoRotate = true,
  interaction = false,
}: MealMapOrbitProps) {
  return (
    <div className={cn('r3f-canvas', className)}>
      <Canvas camera={{ position: [0, 1, 8], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.25} penumbra={0.5} intensity={1.5} color="#FC8019" />
        <pointLight position={[-10, -5, -5]} intensity={0.6} color="#FBBF24" />
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <OrbitRing speed={speed} autoRotate={autoRotate} />
          </Float>
          <ContactShadows position={[0, -2.5, 0]} opacity={0.25} scale={12} blur={2.5} far={4} />
          <Environment preset="city" />
          {interaction && (
            <OrbitControls enableZoom={false} autoRotate={false} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
