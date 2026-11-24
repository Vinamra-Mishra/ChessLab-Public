"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { ChessPieceGLB } from "./ChessPieceGLB";
import type { PieceKind } from "./Pieces";

interface HoverState {
  x: number;
  y: number;
  active: boolean;
}

function HoverTiltPiece({
  kind,
  hoverRef,
  reducedMotionRef,
}: {
  kind: PieceKind;
  hoverRef: React.MutableRefObject<HoverState>;
  reducedMotionRef: React.MutableRefObject<boolean>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { invalidate } = useThree();

  useFrame(() => {
    if (reducedMotionRef.current || !groupRef.current) return;
    const h = hoverRef.current;
    const targetY = h.active ? h.x * 0.24 : 0;
    const targetX = h.active ? h.y * 0.12 : 0;
    const dy = targetY - groupRef.current.rotation.y;
    const dx = targetX - groupRef.current.rotation.x;
    if (Math.abs(dy) > 0.001 || Math.abs(dx) > 0.001) {
      groupRef.current.rotation.y += dy * 0.12;
      groupRef.current.rotation.x += dx * 0.12;
      invalidate();
    }
  });

  return (
    <group ref={groupRef}>
      <ChessPieceGLB kind={kind} variant="crimson-blue" scale={1.18} position={[0, -0.58, 0]} />
    </group>
  );
}

export function WaterPiece3D({
  kind,
  className,
  label,
}: {
  kind: PieceKind;
  className?: string;
  label?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HoverState>({ x: 0, y: 0, active: false });
  const reducedMotionRef = useRef(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { rootMargin: "250px" }
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current || !hostRef.current) return;
    const rect = hostRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    hoverRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      active: true,
    };
  };

  const onPointerLeave = () => {
    hoverRef.current.active = false;
  };

  return (
    <div
      ref={hostRef}
      className={`piece-water-3d${className ? ` ${className}` : ""}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-material="water"
      data-piece={kind}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {inView ? (
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.55,
          }}
          camera={{ position: [0, 0.08, 3.05], fov: 29 }}
        >
          <Environment resolution={128}>
            <Lightformer
              form="rect"
              intensity={3.0}
              color="#ffffff"
              position={[0, 5, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[8, 8, 1]}
            />
            <Lightformer
              form="rect"
              intensity={8.0}
              color="#ef4444"
              position={[-4, 1.4, 1]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[2.4, 6, 1]}
            />
            <Lightformer
              form="rect"
              intensity={7.5}
              color="#3b82f6"
              position={[4, 1.8, -1.5]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[2.6, 6, 1]}
            />
            <Lightformer
              form="rect"
              intensity={4.5}
              color="#38bdf8"
              position={[2.5, 2.5, -4]}
              scale={[4, 5, 1]}
            />
            <Lightformer
              form="rect"
              intensity={2.8}
              color="#eff6ff"
              position={[0, 1.5, 5]}
              scale={[5, 4, 1]}
            />
          </Environment>

          <ambientLight intensity={1.15} color="#dbeafe" />
          <directionalLight position={[1.8, 2.8, 4.2]} intensity={4.0} color="#eff6ff" />
          <pointLight position={[-2.1, 1.1, 1.5]} intensity={32} color="#ef4444" />
          <pointLight position={[2.2, -0.5, 2.2]} intensity={20} color="#3b82f6" />

          <Suspense fallback={null}>
            <HoverTiltPiece kind={kind} hoverRef={hoverRef} reducedMotionRef={reducedMotionRef} />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  );
}
