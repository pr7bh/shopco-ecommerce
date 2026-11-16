"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface ProductViewerProps {
  model3dUrl: string;
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function ProductViewer({ model3dUrl }: ProductViewerProps) {
  return (
    <div className="relative w-full h-full bg-gray-50 rounded-2xl overflow-hidden">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 45 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Environment preset="studio" />
          <Suspense fallback={null}>
            <Model url={model3dUrl} />
          </Suspense>
          <OrbitControls
            autoRotate
            autoRotateSpeed={1.5}
            enablePan={false}
            minDistance={1.5}
            maxDistance={8}
            enableDamping
          />
        </Canvas>
      </Suspense>
      <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-gray-400 pointer-events-none">
        Drag to rotate · Scroll to zoom
      </p>
    </div>
  );
}
