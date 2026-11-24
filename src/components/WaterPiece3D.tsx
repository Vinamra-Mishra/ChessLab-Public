"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { ChessPieceGLB } from "./ChessPieceGLB";
import type { PieceKind } from "./Pieces";

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
  const [inView, setInView] = useState(true);

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

  return (
    <div
      ref={hostRef}
      className={`piece-water-3d${className ? ` ${className}` : ""}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-material="water"
      data-piece={kind}
    >
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        camera={{ position: [0, 0.9, 3.6], fov: 32 }}
      >
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={2.4}
            color="#ffffff"
            position={[0, 5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[8, 8, 1]}
          />
          <Lightformer
            form="rect"
            intensity={6.5}
            color="#b91c1c"
            position={[-4, 1.4, 1]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[2.2, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={5.5}
            color="#2563eb"
            position={[4, 1.8, -1.5]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[2.5, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={3.0}
            color="#38bdf8"
            position={[2.5, 2.5, -4]}
            scale={[4, 5, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.5}
            color="#dbeafe"
            position={[0, 1.5, 5]}
            scale={[5, 4, 1]}
          />
        </Environment>

        <spotLight position={[2, 4.5, 3]} intensity={24} color="#eff6ff" />
        <pointLight position={[-1.9, 1.1, 0.7]} intensity={18} color="#dc2626" />

        <Suspense fallback={null}>
          <ChessPieceGLB kind={kind} variant="crimson-blue" scale={1.65} position={[0, -0.82, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
