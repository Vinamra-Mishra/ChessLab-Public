"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, useGLTF } from "@react-three/drei";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { PieceKind } from "./Pieces";

export type PieceVariant =
  | "marbled-king"
  | "copper-queen"
  | "crimson-blue"
  | "black-king"
  | "white-queen";

/**
 * Easy-to-edit tuning knobs for the 3D hero scene.
 */
export const HERO_3D_TUNING = {
  SWIRL_PALETTE: {
    king: ["#2fd0c8", "#7a5cff", "#f472b6", "#eab308", "#1d4ed8"] as const,
    queen: ["#c9825f", "#ff7eb6", "#ff6b2c", "#ffd7ba", "#a35238"] as const,
    crimsonBlue: ["#0a2463", "#1d4ed8", "#2563eb", "#7f1d1d", "#b91c1c"] as const,
  },
  DISTORTION: {
    baseDistortion: 0,
    distortionScale: 0,
    temporalDistortion: 0,
    speedBoostFactor: 0,
    wetNormalAmplitude: 0,
  },
  BOARD_GLOW: {
    gridColor: "#ffd4c2",
    gridTint: "#ff8547",
    poolColor: "#ff5a1f",
    poolOpacity: 0.42,
  },
  PARALLAX_STRENGTH: {
    cameraMaxOffset: 0.6,
    pieceMaxYawRad: (12 * Math.PI) / 180,
    pieceMaxPitchRad: (6 * Math.PI) / 180,
  },
};

export interface PointerState {
  x: number;
  y: number;
  speed: number;
}

const MODEL_PATHS: Record<PieceKind, string> = {
  king: "/models/ChessPieceKing.glb",
  queen: "/models/ChessPieceQueen.glb",
  bishop: "/models/ChessPieceBishop.glb",
  knight: "/models/ChessPieceKnight.glb",
  rook: "/models/ChessPieceRook.glb",
  pawn: "/models/ChessPiecePawn.glb",
};

for (const url of Object.values(MODEL_PATHS)) {
  useGLTF.preload(url);
}

function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number): number {
  let v = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 4; i++) {
    v += amp * valueNoise(x * freq, y * freq);
    freq *= 2.02;
    amp *= 0.5;
  }
  return v;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function createMarbledSwirlTextures(paletteHex: readonly string[]): {
  colorMap: THREE.CanvasTexture;
  iridescenceMap: THREE.CanvasTexture;
} {
  const size = 256;
  const palette = paletteHex.map(hexToRgb);

  const cCanvas = document.createElement("canvas");
  cCanvas.width = size;
  cCanvas.height = size;
  const cCtx = cCanvas.getContext("2d")!;
  const cImg = cCtx.createImageData(size, size);

  const iCanvas = document.createElement("canvas");
  iCanvas.width = size;
  iCanvas.height = size;
  const iCtx = iCanvas.getContext("2d")!;
  const iImg = iCtx.createImageData(size, size);

  for (let py = 0; py < size; py++) {
    const v = py / size;
    for (let px = 0; px < size; px++) {
      const u = px / size;
      // Seamless cylindrical horizontal wrap + domain-warped fBM swirl
      const sx = Math.cos(u * Math.PI * 2) * 1.4 + 3.2;
      const sz = Math.sin(u * Math.PI * 2) * 1.4 + 3.2;
      const sy = v * 4.2;

      const qx = fbm(sx + sy * 0.4, sz - sy * 0.3);
      const qy = fbm(sx + 5.2, sz + sy * 0.6 + 1.3);
      const val = fbm(sx + 2.8 * qx, sz + 2.8 * qy + sy * 0.5);

      const t = Math.max(0, Math.min(0.999, val));
      const scaled = t * (palette.length - 1);
      const idx0 = Math.floor(scaled);
      const idx1 = Math.min(palette.length - 1, idx0 + 1);
      const frac = scaled - idx0;

      const c0 = palette[idx0];
      const c1 = palette[idx1];
      const r = Math.round(c0[0] + (c1[0] - c0[0]) * frac);
      const g = Math.round(c0[1] + (c1[1] - c0[1]) * frac);
      const b = Math.round(c0[2] + (c1[2] - c0[2]) * frac);

      const p = (py * size + px) * 4;
      cImg.data[p] = r;
      cImg.data[p + 1] = g;
      cImg.data[p + 2] = b;
      cImg.data[p + 3] = 255;

      const thick = Math.round(t * 255);
      iImg.data[p] = thick;
      iImg.data[p + 1] = thick;
      iImg.data[p + 2] = thick;
      iImg.data[p + 3] = 255;
    }
  }

  cCtx.putImageData(cImg, 0, 0);
  iCtx.putImageData(iImg, 0, 0);

  const colorMap = new THREE.CanvasTexture(cCanvas);
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.needsUpdate = true;

  const iridescenceMap = new THREE.CanvasTexture(iCanvas);
  iridescenceMap.wrapS = THREE.RepeatWrapping;
  iridescenceMap.wrapT = THREE.RepeatWrapping;
  iridescenceMap.colorSpace = THREE.NoColorSpace;
  iridescenceMap.needsUpdate = true;

  return { colorMap, iridescenceMap };
}

function applyCylindricalUVs(geo: THREE.BufferGeometry): void {
  const pos = geo.getAttribute("position");
  if (!pos) return;
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const height = bb.max.y - bb.min.y || 1;
  const cx = (bb.min.x + bb.max.x) * 0.5;
  const cz = (bb.min.z + bb.max.z) * 0.5;

  const uvs = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) - cx;
    const y = pos.getY(i) - bb.min.y;
    const z = pos.getZ(i) - cz;
    uvs[i * 2] = Math.atan2(x, z) / (Math.PI * 2) + 0.5;
    uvs[i * 2 + 1] = y / height;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
}

export function ChessPieceGLB({
  kind,
  variant,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  pointerRef,
  rotDamping = 0.06,
  isMobile = false,
  isTouch = false,
  reducedMotion = false,
}: {
  kind: PieceKind;
  variant: PieceVariant;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  pointerRef?: React.MutableRefObject<PointerState>;
  rotDamping?: number;
  isMobile?: boolean;
  isTouch?: boolean;
  reducedMotion?: boolean;
}) {
  const { scene } = useGLTF(MODEL_PATHS[kind]);
  const outerGroupRef = useRef<THREE.Group>(null);
  const transMatRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const isKingGlass = variant === "marbled-king" || variant === "black-king";
  const isCrimsonBlue = variant === "crimson-blue";

  const { geometry, meshQuaternion, offsetPos, unitScale } = useMemo(() => {
    let primary: THREE.Mesh | null = null;
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        if (!primary || (!obj.name.endsWith(".001") && primary.name.endsWith(".001"))) {
          primary = obj as THREE.Mesh;
        }
      }
    });

    const source = primary as THREE.Mesh | null;
    if (!source) {
      return {
        geometry: new THREE.BufferGeometry(),
        meshQuaternion: new THREE.Quaternion(),
        offsetPos: new THREE.Vector3(),
        unitScale: 1,
      };
    }

    const cloned = source.geometry.clone();
    if (cloned.getAttribute("normal")) {
      cloned.deleteAttribute("normal");
    }
    const welded = mergeVertices(cloned, 1e-4);
    cloned.dispose();
    welded.computeVertexNormals();
    applyCylindricalUVs(welded);

    const tempMesh = new THREE.Mesh(welded);
    tempMesh.quaternion.copy(source.quaternion);
    tempMesh.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(tempMesh);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    return {
      geometry: welded,
      meshQuaternion: source.quaternion.clone(),
      offsetPos: new THREE.Vector3(-center.x, -box.min.y, -center.z),
      unitScale: 1 / (size.y || 1),
    };
  }, [scene]);

  const { colorMap, iridescenceMap } = useMemo(() => {
    const palette = isKingGlass
      ? HERO_3D_TUNING.SWIRL_PALETTE.king
      : isCrimsonBlue
        ? HERO_3D_TUNING.SWIRL_PALETTE.crimsonBlue
        : HERO_3D_TUNING.SWIRL_PALETTE.queen;
    return createMarbledSwirlTextures(palette);
  }, [isKingGlass, isCrimsonBlue]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      colorMap.dispose();
      iridescenceMap.dispose();
    };
  }, [geometry, colorMap, iridescenceMap]);

  useFrame(({ clock }) => {
    if (reducedMotion || !outerGroupRef.current) return;

    const t = clock.getElapsedTime();

    let targetRx = rotation[0];
    let targetRy = rotation[1];

    if (isTouch) {
      targetRy = rotation[1] + Math.sin(t * 0.35) * 0.08;
      targetRx = rotation[0] + Math.cos(t * 0.25) * 0.03;
    } else if (pointerRef) {
      const p = pointerRef.current;
      targetRy = rotation[1] + p.x * HERO_3D_TUNING.PARALLAX_STRENGTH.pieceMaxYawRad;
      targetRx = rotation[0] + p.y * HERO_3D_TUNING.PARALLAX_STRENGTH.pieceMaxPitchRad;
    }

    outerGroupRef.current.rotation.y += (targetRy - outerGroupRef.current.rotation.y) * rotDamping;
    outerGroupRef.current.rotation.x += (targetRx - outerGroupRef.current.rotation.x) * rotDamping;
  });

  return (
    <group ref={outerGroupRef} position={position} rotation={rotation} scale={scale}>
      <group scale={unitScale}>
        <group position={offsetPos}>
          <mesh geometry={geometry} quaternion={meshQuaternion} castShadow receiveShadow>
            {isKingGlass ? (
              <MeshTransmissionMaterial
                ref={transMatRef}
                transmission={1}
                thickness={1.5}
                roughness={0.04}
                ior={1.5}
                chromaticAberration={0.06}
                anisotropicBlur={0.2}
                distortion={HERO_3D_TUNING.DISTORTION.baseDistortion}
                distortionScale={HERO_3D_TUNING.DISTORTION.distortionScale}
                temporalDistortion={HERO_3D_TUNING.DISTORTION.temporalDistortion}
                backside
                samples={isMobile ? 4 : 8}
                resolution={isMobile ? 256 : 512}
                iridescence={1}
                iridescenceIOR={1.6}
                iridescenceThicknessRange={[100, 900]}
                iridescenceThicknessMap={iridescenceMap}
                clearcoat={1}
                clearcoatRoughness={0.03}
                map={colorMap}
                envMapIntensity={1.5}
              />
            ) : isCrimsonBlue ? (
              <meshPhysicalMaterial
                color="#1746a2"
                metalness={0.72}
                roughness={0.08}
                clearcoat={1}
                clearcoatRoughness={0.04}
                iridescence={0.35}
                iridescenceIOR={1.45}
                iridescenceThicknessRange={[140, 620]}
                iridescenceThicknessMap={iridescenceMap}
                map={colorMap}
                envMapIntensity={1.8}
              />
            ) : (
              <meshPhysicalMaterial
                color="#df9a78"
                metalness={0.75}
                roughness={0.08}
                clearcoat={1}
                clearcoatRoughness={0.04}
                transmission={0.25}
                thickness={0.8}
                ior={1.5}
                iridescence={0.85}
                iridescenceIOR={1.5}
                iridescenceThicknessRange={[180, 760]}
                iridescenceThicknessMap={iridescenceMap}
                map={colorMap}
                envMapIntensity={1.5}
              />
            )}
          </mesh>
        </group>
      </group>
    </group>
  );
}
