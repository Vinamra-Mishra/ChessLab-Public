"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { ChessPieceGLB, HERO_3D_TUNING, type PointerState } from "./ChessPieceGLB";

function createRefractionBackdropTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, size, size);
  const base = ctx.createRadialGradient(size * 0.5, size * 0.5, 16, size * 0.5, size * 0.5, size * 0.48);
  base.addColorStop(0, "rgba(138, 90, 78, 0.85)");
  base.addColorStop(0.5, "rgba(42, 15, 8, 0.45)");
  base.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  const blobs: Array<[number, number, number, string]> = [
    [0.36, 0.58, 0.24, "rgba(255, 90, 31, 0.42)"],
    [0.64, 0.42, 0.22, "rgba(47, 208, 200, 0.36)"],
    [0.52, 0.28, 0.22, "rgba(122, 92, 255, 0.34)"],
  ];
  ctx.globalCompositeOperation = "screen";
  for (const [bx, by, br, color] of blobs) {
    const g = ctx.createRadialGradient(size * bx, size * by, 0, size * bx, size * by, size * br);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createGridGlowTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, size, size);
  const cells = 12;
  const step = size / cells;

  // Soft edge-fading radial mask via gradient stroke
  ctx.lineWidth = 2.2;
  const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.08, size / 2, size / 2, size * 0.5);
  grad.addColorStop(0, HERO_3D_TUNING.BOARD_GLOW.gridColor);
  grad.addColorStop(0.55, HERO_3D_TUNING.BOARD_GLOW.gridTint);
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.strokeStyle = grad;
  for (let i = 0; i <= cells; i++) {
    const p = i * step;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createOrangePoolTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `rgba(255, 90, 31, ${HERO_3D_TUNING.BOARD_GLOW.poolOpacity})`);
  g.addColorStop(0.5, "rgba(255, 90, 31, 0.14)");
  g.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createBoardSurfaceTextures(): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const size = 512;
  const cells = 12;
  const step = size / cells;

  const cCanvas = document.createElement("canvas");
  cCanvas.width = size;
  cCanvas.height = size;
  const cCtx = cCanvas.getContext("2d")!;

  const rCanvas = document.createElement("canvas");
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext("2d")!;

  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      const light = (row + col) % 2 === 0;
      cCtx.fillStyle = light ? "#d8d4cc" : "#0a0a0d";
      cCtx.fillRect(col * step, row * step, step, step);
      rCtx.fillStyle = light ? "#48484c" : "#222228";
      rCtx.fillRect(col * step, row * step, step, step);
    }
  }

  const map = new THREE.CanvasTexture(cCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  map.needsUpdate = true;

  const roughnessMap = new THREE.CanvasTexture(rCanvas);
  roughnessMap.needsUpdate = true;

  return { map, roughnessMap };
}

function GeometriaBoard({ isMobile }: { isMobile: boolean }) {
  const gridTex = useMemo(() => createGridGlowTexture(), []);
  const poolTex = useMemo(() => createOrangePoolTexture(), []);
  const boardTex = useMemo(() => createBoardSurfaceTextures(), []);

  useEffect(() => {
    return () => {
      gridTex.dispose();
      poolTex.dispose();
      boardTex.map.dispose();
      boardTex.roughnessMap.dispose();
    };
  }, [gridTex, poolTex, boardTex]);

  return (
    <group position={[0.5, 0, -0.4]}>
      {/* Dark beveled metallic slab */}
      <mesh position={[0, -0.14, 0]} receiveShadow>
        <boxGeometry args={[10.4, 0.24, 10.4]} />
        <meshStandardMaterial color="#09090c" metalness={0.65} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[10.0, 0.04, 10.0]} />
        <meshStandardMaterial color="#18181f" metalness={0.5} roughness={0.28} />
      </mesh>

      {/* Reflective top surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[9.9, 9.9]} />
        <MeshReflectorMaterial
          map={boardTex.map}
          roughnessMap={boardTex.roughnessMap}
          mirror={0.42}
          blur={[300, 100]}
          resolution={isMobile ? 256 : 512}
          mixBlur={1}
          mixStrength={0.62}
          roughness={0.28}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#ffffff"
          metalness={0.22}
        />
      </mesh>

      {/* Glowing grid lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <planeGeometry args={[9.8, 9.8]} />
        <meshBasicMaterial
          map={gridTex}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.7}
        />
      </mesh>

      {/* Soft orange glow pool on board */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.1, 0.004, 0.2]}>
        <planeGeometry args={[5.4, 5.4]} />
        <meshBasicMaterial
          map={poolTex}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function RefractionBackdrop() {
  const tex = useMemo(() => createRefractionBackdropTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[0.85, 1.4, -2.8]}>
      <planeGeometry args={[6.2, 6.2]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

function InteractiveRig({
  pointerRef,
  isTouch,
  reducedMotion,
}: {
  pointerRef: React.MutableRefObject<PointerState>;
  isTouch: boolean;
  reducedMotion: boolean;
}) {
  const { camera } = useThree();
  const cursorLightRef = useRef<THREE.PointLight>(null);
  const basePos = useMemo(() => new THREE.Vector3(0, 2.1, 7.8), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(0.45, 1.15, 0), []);

  useEffect(() => {
    camera.position.copy(basePos);
    camera.lookAt(lookAtTarget);
  }, [camera, basePos, lookAtTarget]);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.getElapsedTime();
    const strength = HERO_3D_TUNING.PARALLAX_STRENGTH.cameraMaxOffset;

    let px = 0;
    let py = 0;
    if (isTouch) {
      px = Math.sin(t * 0.25) * 0.35;
      py = Math.cos(t * 0.2) * 0.2;
    } else {
      px = pointerRef.current.x;
      py = pointerRef.current.y;
    }

    const tx = basePos.x + px * strength;
    const ty = basePos.y - py * (strength * 0.45);
    state.camera.position.x += (tx - state.camera.position.x) * 0.05;
    state.camera.position.y += (ty - state.camera.position.y) * 0.05;
    state.camera.lookAt(lookAtTarget);

    if (cursorLightRef.current) {
      cursorLightRef.current.position.x += (0.8 + px * 2.8 - cursorLightRef.current.position.x) * 0.08;
      cursorLightRef.current.position.y += (1.8 - py * 1.4 - cursorLightRef.current.position.y) * 0.08;
    }
  });

  return <pointLight ref={cursorLightRef} position={[0.8, 1.8, 2.4]} intensity={5.5} color="#7dd3fc" distance={9} />;
}

export function HeroScene3D() {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, speed: 0 });
  const [inView, setInView] = useState(true);
  const [envFlags, setEnvFlags] = useState({ isMobile: false, isTouch: false, reducedMotion: false });

  useEffect(() => {
    const updateFlags = () => {
      setEnvFlags({
        isMobile: window.innerWidth < 768,
        isTouch: window.matchMedia("(pointer: coarse)").matches,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    };
    updateFlags();
    window.addEventListener("resize", updateFlags, { passive: true });
    return () => window.removeEventListener("resize", updateFlags);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.01 }
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (envFlags.reducedMotion || envFlags.isTouch) return;
    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();
    let decayRaf = 0;

    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const nx = (e.clientX / w - 0.5) * 2;
      const ny = (e.clientY / h - 0.5) * 2;
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      const dist = Math.hypot(nx - lastX, ny - lastY);
      const spd = Math.min(1, (dist / dt) * 160);
      pointerRef.current = { x: nx, y: ny, speed: Math.max(pointerRef.current.speed * 0.6, spd) };
      lastX = nx;
      lastY = ny;
      lastT = now;
    };

    const decay = () => {
      pointerRef.current.speed *= 0.92;
      decayRaf = requestAnimationFrame(decay);
    };
    decayRaf = requestAnimationFrame(decay);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(decayRaf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [envFlags.reducedMotion, envFlags.isTouch]);

  return (
    <div ref={hostRef} className="hero-scene-3d" aria-hidden="true">
      <Canvas
        shadows
        frameloop={inView ? "always" : "never"}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        camera={{ position: [0, 2.1, 7.8], fov: 28 }}
      >
        <fog attach="fog" args={["#000000", 8, 20]} />

        {/* Refraction backdrop plane behind pieces */}
        <RefractionBackdrop />

        <Environment resolution={envFlags.isMobile ? 256 : 1024}>
          {/* Big white softbox on top */}
          <Lightformer
            form="rect"
            intensity={2.8}
            color="#ffffff"
            position={[0, 7, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[10, 10, 1]}
          />
          {/* Colorful side & back strips */}
          <Lightformer form="rect" intensity={4.0} color="#ff6ec7" position={[-5, 2.5, -1]} rotation={[0, Math.PI / 2, 0]} scale={[2.5, 7, 1]} />
          <Lightformer form="rect" intensity={4.0} color="#2fd0c8" position={[5.5, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[2.5, 7, 1]} />
          <Lightformer form="rect" intensity={1.8} color="#7a5cff" position={[0, 3.2, -5.5]} scale={[7, 4, 1]} />
          <Lightformer form="rect" intensity={4.5} color="#ff5a1f" position={[-4, 1.4, 2.5]} rotation={[0, Math.PI / 3, 0]} scale={[2, 6, 1]} />
          <Lightformer form="rect" intensity={3.2} color="#5ea0ff" position={[4.5, 3.6, -3.5]} rotation={[0, -Math.PI / 3, 0]} scale={[2.2, 7, 1]} />
          {/* Tall thin white streak front-left */}
          <Lightformer form="rect" intensity={4.8} color="#ffffff" position={[-3.2, 2.2, 4.2]} rotation={[0, 0.4, 0]} scale={[0.35, 7, 1]} />
        </Environment>

        <spotLight
          position={[2.0, 6.2, 3.8]}
          angle={0.44}
          penumbra={0.7}
          intensity={32}
          color="#fff7ed"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <InteractiveRig
          pointerRef={pointerRef}
          isTouch={envFlags.isTouch}
          reducedMotion={envFlags.reducedMotion}
        />

        <GeometriaBoard isMobile={envFlags.isMobile} />
        <ContactShadows position={[0.5, 0.004, -0.4]} opacity={0.62} scale={11} blur={2.4} far={3.5} />

        <Suspense fallback={null}>
          <ChessPieceGLB
            kind="king"
            variant="marbled-king"
            scale={2.45}
            position={[0.55, 0, -0.25]}
            pointerRef={pointerRef}
            rotDamping={0.055}
            isMobile={envFlags.isMobile}
            isTouch={envFlags.isTouch}
            reducedMotion={envFlags.reducedMotion}
          />
          <ChessPieceGLB
            kind="queen"
            variant="copper-queen"
            scale={2.05}
            position={[1.18, 0.12, 0.28]}
            rotation={[0.04, 0.22, -0.42]}
            pointerRef={pointerRef}
            rotDamping={0.095}
            isMobile={envFlags.isMobile}
            isTouch={envFlags.isTouch}
            reducedMotion={envFlags.reducedMotion}
          />
        </Suspense>

        <EffectComposer>
          <Bloom intensity={0.3} luminanceThreshold={1.0} mipmapBlur />
          <Vignette eskil={false} offset={0.22} darkness={0.52} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
