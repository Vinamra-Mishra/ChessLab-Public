"use client";

import { useMemo, useRef } from "react";
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
 * Easy-to-edit tuning knobs for the 3D hero & card scenes.
 */
export const HERO_3D_TUNING = {
  SWIRL_PALETTE: {
    king: ["#2fd0c8", "#7a5cff", "#f472b6", "#eab308", "#1d4ed8"] as const,
    queen: ["#0284c7", "#38bdf8", "#7dd3fc", "#bae6fd", "#e0f2fe"] as const,
    crimsonBlue: ["#1d4ed8", "#3b82f6", "#60a5fa", "#dc2626", "#f87171"] as const,
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

interface NormalizedGeoData {
  geometry: THREE.BufferGeometry;
  meshQuaternion: THREE.Quaternion;
  offsetPos: THREE.Vector3;
  unitScale: number;
}

interface SwirlTexturePair {
  colorMap: THREE.CanvasTexture;
  iridescenceMap: THREE.CanvasTexture;
}

const GEOMETRY_CACHE = new Map<PieceKind, NormalizedGeoData>();
const SWIRL_CACHE = new Map<string, SwirlTexturePair>();

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

function getOrCreateSwirlTextures(cacheKey: string, paletteHex: readonly string[]): SwirlTexturePair {
  const cached = SWIRL_CACHE.get(cacheKey);
  if (cached) return cached;

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

  const pair = { colorMap, iridescenceMap };
  SWIRL_CACHE.set(cacheKey, pair);
  return pair;
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

function getOrCreateNormalizedGeo(kind: PieceKind, scene: THREE.Object3D): NormalizedGeoData {
  const cached = GEOMETRY_CACHE.get(kind);
  if (cached) return cached;

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

  const data: NormalizedGeoData = {
    geometry: welded,
    meshQuaternion: source.quaternion.clone(),
    offsetPos: new THREE.Vector3(-center.x, -box.min.y, -center.z),
    unitScale: 1 / (size.y || 1),
  };
  GEOMETRY_CACHE.set(kind, data);
  return data;
}

export function ChessPieceGLB({
  kind,
  variant,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  pointerRef,
  rotDamping = 0.06,
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

  const { geometry, meshQuaternion, offsetPos, unitScale } = useMemo(
    () => getOrCreateNormalizedGeo(kind, scene),
    [kind, scene]
  );

  const { colorMap, iridescenceMap } = useMemo(() => {
    const key = isKingGlass ? "king" : isCrimsonBlue ? "crimsonBlue" : "queen";
    const palette = HERO_3D_TUNING.SWIRL_PALETTE[key];
    return getOrCreateSwirlTextures(key, palette);
  }, [isKingGlass, isCrimsonBlue]);

  useFrame(({ clock }) => {
    if (reducedMotion || !outerGroupRef.current) return;
    if (!pointerRef && !isTouch) return;

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
                transparent
                opacity={0.78}
                thickness={0.75}
                roughness={0.02}
                ior={1.38}
                attenuationColor="#bae6fd"
                attenuationDistance={2.8}
                chromaticAberration={0.06}
                anisotropicBlur={0.2}
                distortion={HERO_3D_TUNING.DISTORTION.baseDistortion}
                distortionScale={HERO_3D_TUNING.DISTORTION.distortionScale}
                temporalDistortion={HERO_3D_TUNING.DISTORTION.temporalDistortion}
                backside
                samples={4}
                resolution={256}
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
                color="#3b82f6"
                emissive="#172554"
                emissiveIntensity={0.42}
                metalness={0.52}
                roughness={0.11}
                clearcoat={1}
                clearcoatRoughness={0.04}
                iridescence={0.55}
                iridescenceIOR={1.5}
                iridescenceThicknessRange={[140, 620]}
                iridescenceThicknessMap={iridescenceMap}
                map={colorMap}
                envMapIntensity={2.6}
              />
            ) : (
              <MeshTransmissionMaterial
                color="#7dd3fc"
                attenuationColor="#38bdf8"
                attenuationDistance={2.4}
                transmission={1}
                transparent
                opacity={0.8}
                thickness={0.85}
                roughness={0.03}
                ior={1.4}
                chromaticAberration={0.05}
                iridescence={0.9}
                iridescenceIOR={1.45}
                iridescenceThicknessRange={[140, 760]}
                iridescenceThicknessMap={iridescenceMap}
                clearcoat={1}
                clearcoatRoughness={0.03}
                map={colorMap}
                envMapIntensity={1.6}
                backside
                samples={4}
                resolution={256}
              />
            )}
          </mesh>
        </group>
      </group>
    </group>
  );
}
