'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, ContactShadows, OrbitControls } from '@react-three/drei';
import { OrbitRing } from './orbit-ring';
import { useSceneTier } from './scene-provider';
import { cn } from '@/lib/utils/cn';
import { tokens } from '@/lib/3d/tokens';
import { DeviceTier } from '@/lib/hooks/use-device-tier';

type MealMapOrbitProps = {
  className?: string;
  speed?: number;
  autoRotate?: boolean;
  interaction?: boolean;
  tier?: DeviceTier;
};

export function MealMapOrbit({
  className,
  speed = 0.2,
  autoRotate = true,
  interaction = false,
  tier,
}: MealMapOrbitProps) {
  const sceneTier = useSceneTier();
  const effectiveTier = tier ?? sceneTier;

  return (
    <div className={cn('r3f-canvas', className)}>
      <Canvas camera={{ position: [0, 1, 8], fov: 45 }} dpr={[1, effectiveTier === 'high' ? 1.5 : 1]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.25} penumbra={0.5} intensity={1.5} color={tokens.glow} />
        <pointLight position={[-10, -5, -5]} intensity={0.6} color={tokens.accent} />
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <OrbitRing speed={speed} autoRotate={autoRotate} tier={effectiveTier} />
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
