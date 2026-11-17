"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { animate, type JSAnimation } from "animejs";
import { CAMPAIGNS, LAYERS, PLANE_ASPECT, pexelsUrl } from "./campaigns";

export interface HeroPointer {
  x: number;
  y: number;
}

interface HeroSceneProps {
  index: number;
  active: boolean;
  pointer: RefObject<HeroPointer>;
  onReady: () => void;
  onError: () => void;
}

const FOV = 32;
const CAM_Z = 7;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const imageFragment = /* glsl */ `
  uniform sampler2D uA;
  uniform sampler2D uB;
  uniform vec2 uScaleA;
  uniform vec2 uScaleB;
  uniform float uProgress;
  uniform vec2 uLight;
  varying vec2 vUv;

  vec2 cover(vec2 uv, vec2 s) { return (uv - 0.5) * s + 0.5; }

  void main() {
    float p = uProgress;
    // Outgoing image drifts closer while the incoming one settles from a slight zoom.
    vec4 a = texture2D(uA, cover(vUv, uScaleA * (1.0 - 0.05 * p)));
    vec4 b = texture2D(uB, cover(vUv, uScaleB * (0.9 + 0.1 * p)));
    float sweep = vUv.y * 0.85 + vUv.x * 0.15;
    float t = mix(-0.25, 1.25, p);
    float m = 1.0 - smoothstep(t - 0.25, t, sweep);
    vec4 col = mix(a, b, m);

    float light = 1.0 - distance(vUv, uLight);
    col.rgb *= 0.9 + 0.14 * light;
    float vig = smoothstep(0.95, 0.35, distance(vUv, vec2(0.5)));
    col.rgb *= mix(0.86, 1.0, vig);

    gl_FragColor = vec4(col.rgb, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const shadowFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec2 q = abs(vUv - 0.5) - vec2(0.36);
    float d = length(max(q, 0.0));
    float a = 1.0 - smoothstep(0.0, 0.14, d);
    gl_FragColor = vec4(0.0, 0.0, 0.0, a * uOpacity);
  }
`;

const textureCache = new Map<string, Promise<THREE.Texture>>();
const loader = new THREE.TextureLoader();
loader.setCrossOrigin("anonymous");

function loadTexture(url: string, maxAnisotropy: number) {
  let cached = textureCache.get(url);
  if (!cached) {
    cached = loader.loadAsync(url).then((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(4, maxAnisotropy);
      return tex;
    });
    textureCache.set(url, cached);
  }
  return cached;
}

function coverScale(tex: THREE.Texture) {
  const img = tex.image as { width: number; height: number };
  const texAspect = img.width / img.height;
  return texAspect > PLANE_ASPECT
    ? new THREE.Vector2(PLANE_ASPECT / texAspect, 1)
    : new THREE.Vector2(1, texAspect / PLANE_ASPECT);
}

const layerUrl = (campaign: number, key: (typeof LAYERS)[number]["key"]) =>
  pexelsUrl(CAMPAIGNS[campaign].images[key].id, key === "main" ? 1400 : 900);

function Layer({
  layer,
  index,
  pointer,
  onLoaded,
}: {
  layer: (typeof LAYERS)[number];
  index: number;
  pointer: RefObject<HeroPointer>;
  onLoaded: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial | null>(null);
  const base = useRef(new THREE.Vector3());
  const shown = useRef(-1);
  const transition = useRef<JSAnimation | null>(null);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  const phase = layer.z * 1.7;

  useEffect(() => {
    const imageMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: imageFragment,
      uniforms: {
        uA: { value: null },
        uB: { value: null },
        uScaleA: { value: new THREE.Vector2(1, 1) },
        uScaleB: { value: new THREE.Vector2(1, 1) },
        uProgress: { value: 0 },
        uLight: { value: new THREE.Vector2(0.5, 0.5) },
      },
    });
    const shadowMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: shadowFragment,
      uniforms: { uOpacity: { value: layer.key === "front" ? 0.55 : 0.42 } },
      transparent: true,
      depthWrite: false,
    });
    material.current = imageMat;
    if (mesh.current) mesh.current.material = imageMat;
    if (shadow.current) shadow.current.material = shadowMat;
    return () => {
      transition.current?.cancel();
      imageMat.dispose();
      shadowMat.dispose();
    };
  }, [layer.key]);

  useEffect(() => {
    const g = group.current;
    const m = mesh.current;
    const s = shadow.current;
    if (!g || !m || !s) return;
    const visibleH = 2 * (CAM_Z - layer.z) * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const aspect = width / height;
    const h = layer.h * visibleH;
    const w = h * PLANE_ASPECT;
    base.current.set((layer.cx - 0.5) * visibleH * aspect, (0.5 - layer.cy) * visibleH, layer.z);
    g.position.copy(base.current);
    m.scale.set(w, h, 1);
    s.scale.set(w * 1.22, h * 1.16, 1);
    s.position.set(h * 0.045, -h * 0.06, -0.02);
  }, [width, height, layer]);

  useEffect(() => {
    let cancelled = false;
    loadTexture(layerUrl(index, layer.key), maxAnisotropy).then((tex) => {
      const mat = material.current;
      if (cancelled || !mat) return;
      const u = mat.uniforms;
      if (shown.current === -1) {
        u.uA.value = tex;
        u.uB.value = tex;
        u.uScaleA.value = coverScale(tex);
        u.uScaleB.value = coverScale(tex);
        shown.current = index;
        onLoaded();
        return;
      }
      if (shown.current === index) return;
      // Whichever image dominates right now becomes the outgoing one.
      if (u.uProgress.value > 0.5) {
        u.uA.value = u.uB.value;
        u.uScaleA.value = u.uScaleB.value;
      }
      u.uB.value = tex;
      u.uScaleB.value = coverScale(tex);
      u.uProgress.value = 0;
      shown.current = index;
      transition.current?.cancel();
      transition.current = animate(u.uProgress, {
        value: 1,
        duration: 1500,
        delay: layer.delay,
        ease: "inOutQuart",
      });
    }, () => {});
    return () => {
      cancelled = true;
    };
  }, [index, layer, maxAnisotropy, onLoaded]);

  useFrame((state, delta) => {
    const g = group.current;
    const mat = material.current;
    if (!g) return;
    const p = pointer.current ?? { x: 0, y: 0 };
    const k = layer.parallax;
    const t = state.clock.elapsedTime;
    const damp = THREE.MathUtils.damp;
    g.position.x = damp(g.position.x, base.current.x + p.x * 0.22 * k, 3.5, delta);
    g.position.y = damp(g.position.y, base.current.y + p.y * 0.14 * k + Math.sin(t * 0.45 + phase) * 0.03 * k, 3.5, delta);
    g.rotation.y = damp(g.rotation.y, layer.rotY + p.x * 0.06 * k, 3.5, delta);
    g.rotation.x = damp(g.rotation.x, -p.y * 0.04 * k, 3.5, delta);
    g.rotation.z = layer.rotZ;
    if (mat) {
      const light = mat.uniforms.uLight.value as THREE.Vector2;
      light.x = damp(light.x, 0.5 + p.x * 0.4, 3, delta);
      light.y = damp(light.y, 0.5 + p.y * 0.4, 3, delta);
    }
  });

  return (
    <group ref={group}>
      <mesh ref={shadow} renderOrder={0}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={mesh} renderOrder={1}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </group>
  );
}

function CameraRig({ pointer }: { pointer: RefObject<HeroPointer> }) {
  useFrame((state, delta) => {
    const p = pointer.current ?? { x: 0, y: 0 };
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, p.x * 0.18, 2.5, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, p.y * 0.1, 2.5, delta);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

function Preloader({ index }: { index: number }) {
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  useEffect(() => {
    const next = (index + 1) % CAMPAIGNS.length;
    const id = window.setTimeout(() => {
      for (const layer of LAYERS) loadTexture(layerUrl(next, layer.key), maxAnisotropy).catch(() => {});
    }, 1200);
    return () => window.clearTimeout(id);
  }, [index, maxAnisotropy]);
  return null;
}

export function HeroScene({ index, active, pointer, onReady, onError }: HeroSceneProps) {
  const loaded = useRef(0);
  const readyFired = useRef(false);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const handleLoaded = useCallback(() => {
    loaded.current += 1;
    if (loaded.current >= LAYERS.length && !readyFired.current) {
      readyFired.current = true;
      // Wait two frames so the first textured frame is on screen before the DOM layer fades out.
      requestAnimationFrame(() => requestAnimationFrame(() => onReadyRef.current()));
    }
  }, []);

  return (
    <Canvas
      className="absolute! inset-0"
      dpr={[1, 1.5]}
      flat
      frameloop={active ? "always" : "never"}
      camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onError();
        });
      }}
      aria-hidden
    >
      <CameraRig pointer={pointer} />
      <Preloader index={index} />
      {LAYERS.map((layer) => (
        <Layer key={layer.key} layer={layer} index={index} pointer={pointer} onLoaded={handleLoaded} />
      ))}
    </Canvas>
  );
}

export default HeroScene;
