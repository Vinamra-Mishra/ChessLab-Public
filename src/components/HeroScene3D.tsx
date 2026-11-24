"use client";

import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { ChessPieceGLB } from "./ChessPieceGLB";

function CameraAim() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 1.15, 0);
  }, [camera]);
  return null;
}

function ChessboardFloor() {
  const { map, roughnessMap } = useMemo(() => {
    const size = 512;
    const tiles = 8;
    const tilePx = size / tiles;

    const cCanvas = document.createElement("canvas");
    cCanvas.width = size;
    cCanvas.height = size;
    const cCtx = cCanvas.getContext("2d")!;

    const rCanvas = document.createElement("canvas");
    rCanvas.width = size;
    rCanvas.height = size;
    const rCtx = rCanvas.getContext("2d")!;

    for (let row = 0; row < tiles; row++) {
      for (let col = 0; col < tiles; col++) {
        const light = (row + col) % 2 === 0;
        cCtx.fillStyle = light ? "#3e3c44" : "#121216";
        cCtx.fillRect(col * tilePx, row * tilePx, tilePx, tilePx);
        rCtx.fillStyle = light ? "#404040" : "#262626";
        rCtx.fillRect(col * tilePx, row * tilePx, tilePx, tilePx);
      }
    }

    const colorTex = new THREE.CanvasTexture(cCanvas);
    colorTex.wrapS = THREE.RepeatWrapping;
    colorTex.wrapT = THREE.RepeatWrapping;
    colorTex.repeat.set(3, 3);
    colorTex.colorSpace = THREE.SRGBColorSpace;

    const roughTex = new THREE.CanvasTexture(rCanvas);
    roughTex.wrapS = THREE.RepeatWrapping;
    roughTex.wrapT = THREE.RepeatWrapping;
    roughTex.repeat.set(3, 3);

    return { map: colorTex, roughnessMap: roughTex };
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[24, 24]} />
      <meshPhysicalMaterial
        map={map}
        roughnessMap={roughnessMap}
        roughness={0.38}
        metalness={0.12}
        clearcoat={0}
        envMapIntensity={0.75}
      />
    </mesh>
  );
}

export function HeroScene3D() {
  return (
    <div className="hero-scene-3d" aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        camera={{ position: [0, 1.95, 8.8], fov: 28 }}
      >
        <CameraAim />
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 8, 22]} />

        <Environment resolution={512}>
          {/* Large soft top light */}
          <Lightformer
            form="rect"
            intensity={2.6}
            color="#ffffff"
            position={[0, 6, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[10, 10, 1]}
          />
          {/* Warm orange side strip */}
          <Lightformer
            form="rect"
            intensity={5.5}
            color="#ff5a2a"
            position={[-5, 2, 1]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[2.5, 8, 1]}
          />
          {/* Cool blue rim strip */}
          <Lightformer
            form="rect"
            intensity={3.8}
            color="#6aa0ff"
            position={[5, 3, -3]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[2.5, 8, 1]}
          />
          {/* Front fill */}
          <Lightformer
            form="rect"
            intensity={1.8}
            color="#f5f2eb"
            position={[0, 2, 6]}
            scale={[6, 4, 1]}
          />
          {/* Subtle pink & teal accent panels for iridescent sweep */}
          <Lightformer
            form="rect"
            intensity={1.8}
            color="#ff7ac6"
            position={[-3.5, 4, -4]}
            rotation={[0, Math.PI / 4, 0]}
            scale={[3, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.8}
            color="#38d9c0"
            position={[4, 1.8, 2]}
            rotation={[0, -Math.PI / 3, 0]}
            scale={[2.5, 5, 1]}
          />
        </Environment>

        <spotLight
          position={[2.0, 5.8, 3.6]}
          angle={0.44}
          penumbra={0.7}
          intensity={34}
          color="#fff7ed"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <ChessboardFloor />
        <ContactShadows position={[0, 0.002, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />

        <Suspense fallback={null}>
          <ChessPieceGLB
            kind="king"
            variant="black-king"
            scale={2.35}
            position={[-0.05, 0, -0.35]}
          />
          <ChessPieceGLB
            kind="queen"
            variant="white-queen"
            scale={2.05}
            position={[0.45, 0.14, 0.18]}
            rotation={[0.04, 0.2, -0.5]}
          />
        </Suspense>

        <EffectComposer>
          <Bloom intensity={0.45} luminanceThreshold={1.0} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
