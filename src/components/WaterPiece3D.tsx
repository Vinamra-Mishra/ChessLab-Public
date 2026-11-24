"use client";

import { Suspense } from "react";
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
  const variant = kind === "queen" || kind === "bishop" ? "white-queen" : "black-king";

  return (
    <div
      className={`piece-water-3d${className ? ` ${className}` : ""}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-material="water"
      data-piece={kind}
    >
      <Canvas
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
            intensity={2.6}
            color="#ffffff"
            position={[0, 5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[8, 8, 1]}
          />
          <Lightformer
            form="rect"
            intensity={5.0}
            color="#ff5a2a"
            position={[-4, 1.5, 1]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[2, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={3.5}
            color="#6aa0ff"
            position={[4, 2, -2]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[2, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.6}
            color="#f5f2eb"
            position={[0, 1.5, 5]}
            scale={[5, 4, 1]}
          />
        </Environment>

        <spotLight position={[2, 4.5, 3]} intensity={24} color="#fff7ed" />
        <pointLight position={[-1.8, 1.2, 0.5]} intensity={14} color="#ff5a2a" />

        <Suspense fallback={null}>
          <ChessPieceGLB kind={kind} variant={variant} scale={1.65} position={[0, -0.82, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
