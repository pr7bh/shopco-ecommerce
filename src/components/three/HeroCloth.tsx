"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ─── Cloth panel ─────────────────────────────────────────────── */

interface ClothPanelProps {
  mouse: React.RefObject<{ x: number; y: number }>;
  color: string;
  basePos: readonly [number, number, number];
  baseRot: readonly [number, number, number];
  scale?: number;
  distort: number;
  speed: number;
  reducedMotion: boolean;
}

function ClothPanel({
  mouse,
  color,
  basePos,
  baseRot,
  scale = 1,
  distort,
  speed,
  reducedMotion,
}: ClothPanelProps) {
  const ref = useRef<THREE.Group>(null!);
  const elapsed = useRef(0);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;

    // Float animation — gentle Y oscillation
    if (!reducedMotion) {
      elapsed.current += dt;
      g.position.y = basePos[1] + Math.sin(elapsed.current * 0.65) * 0.07;
    }

    // Mouse parallax — smooth lerp toward cursor offset
    const p = reducedMotion ? 0.04 : 0.14;
    const mx = mouse.current?.x ?? 0;
    const my = mouse.current?.y ?? 0;

    g.rotation.x = THREE.MathUtils.lerp(
      g.rotation.x,
      baseRot[0] + my * p,
      0.05
    );
    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      baseRot[1] + mx * (p * 1.4),
      0.05
    );
  });

  return (
    <group
      ref={ref}
      position={[basePos[0], basePos[1], basePos[2]]}
      rotation={[baseRot[0], baseRot[1], baseRot[2]]}
      scale={scale}
    >
      <mesh>
        <planeGeometry args={[2.4, 3.8, 48, 48]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed}
          roughness={0.42}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ─── Scroll-driven camera ─────────────────────────────────────── */

function ScrollCamera({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const targetZ = useRef(4.0);

  useEffect(() => {
    if (reducedMotion) return;
    const onScroll = () => {
      targetZ.current = 4.0 - (window.scrollY / window.innerHeight) * 0.5;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  useFrame(() => {
    if (reducedMotion) return;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.04);
  });

  return null;
}

/* ─── Scene ───────────────────────────────────────────────────── */

function Scene({
  mouse,
  reducedMotion,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}) {
  return (
    <>
      {/* Three-point lighting — fashion editorial warmth */}
      <ambientLight intensity={0.45} color="#f9f5f0" />
      <directionalLight position={[4, 7, 3]} intensity={2.1} color="#fff4e8" />
      <pointLight position={[-3.5, -1, 2.5]} intensity={0.75} color="#ddeeff" />
      <pointLight position={[2, -4, 1]} intensity={0.35} color="#ffeedd" />

      {/* Back cloth — softer, receded, adds depth */}
      <ClothPanel
        mouse={mouse}
        color="#282828"
        basePos={[-0.35, -0.05, -0.65] as const}
        baseRot={[0.06, -0.08, -0.03] as const}
        scale={0.88}
        distort={reducedMotion ? 0 : 0.18}
        speed={reducedMotion ? 0 : 1.2}
        reducedMotion={reducedMotion}
      />

      {/* Front cloth — dark charcoal, main focal surface */}
      <ClothPanel
        mouse={mouse}
        color="#141414"
        basePos={[0.3, 0.05, 0] as const}
        baseRot={[0.09, -0.22, 0.04] as const}
        distort={reducedMotion ? 0 : 0.28}
        speed={reducedMotion ? 0 : 1.9}
        reducedMotion={reducedMotion}
      />

      {/* Subtle ambient sparkles — echo the brand sparkle motif */}
      {!reducedMotion && (
        <Sparkles
          count={22}
          scale={4.5}
          size={2}
          speed={0.25}
          color="#ffffff"
          opacity={0.28}
        />
      )}

      <ScrollCamera reducedMotion={reducedMotion} />
    </>
  );
}

/* ─── Canvas wrapper (exported) ───────────────────────────────── */

export function HeroCloth() {
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className="w-full h-full"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mouse.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        mouse.current.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
      }}
      onMouseLeave={() => {
        mouse.current.x = 0;
        mouse.current.y = 0;
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          alpha: true,
        }}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
