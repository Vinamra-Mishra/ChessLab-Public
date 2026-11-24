"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  HERO_3D_TUNING,
  MODEL_PATHS,
  getOrCreateNormalizedGeo,
  getOrCreateSwirlTextures,
} from "./ChessPieceGLB";
import type { PieceKind } from "./Pieces";

const SNAPSHOT_WIDTH = 420;
const SNAPSHOT_HEIGHT = 630;

const SNAPSHOT_CACHE = new Map<PieceKind, string>();
const PENDING_RENDERS = new Map<PieceKind, Promise<string>>();
const GLB_CACHE = new Map<PieceKind, Promise<THREE.Group>>();

interface SharedSnapshotStudio {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  contactShadowTex: THREE.CanvasTexture;
}

let sharedStudio: SharedSnapshotStudio | null = null;
let drawQueue: Promise<void> = Promise.resolve();

function createStudioEnvMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color("#02040a");

  const addPanel = (
    colorHex: string,
    intensity: number,
    position: [number, number, number],
    rotation: [number, number, number],
    scale: [number, number]
  ) => {
    const color = new THREE.Color(colorHex).multiplyScalar(intensity);
    const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(scale[0], scale[1]), mat);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    envScene.add(mesh);
  };

  // Matches the crimson-blue studio Lightformers (white top, blood-red left, cobalt/sky right & back)
  addPanel("#ffffff", 2.8, [0, 5, 0], [Math.PI / 2, 0, 0], [8, 8]);
  addPanel("#ef4444", 7.8, [-4, 1.4, 1], [0, Math.PI / 2, 0], [2.4, 6]);
  addPanel("#3b82f6", 7.4, [4, 1.8, -1.5], [0, -Math.PI / 2, 0], [2.6, 6]);
  addPanel("#38bdf8", 4.2, [2.5, 2.5, -4], [0, 0, 0], [4, 5]);
  addPanel("#eff6ff", 2.2, [0, 1.5, 5], [0, Math.PI, 0], [5, 4]);

  const rt = pmrem.fromScene(envScene, 0.03);
  envScene.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const m = obj as THREE.Mesh;
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
  });
  pmrem.dispose();
  return rt.texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(0, 0, 0, 0.9)");
  grad.addColorStop(0.45, "rgba(0, 0, 0, 0.56)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function getSharedStudio(): SharedSnapshotStudio {
  if (sharedStudio) return sharedStudio;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(1);
  renderer.setSize(SNAPSHOT_WIDTH, SNAPSHOT_HEIGHT, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.48;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.environment = createStudioEnvMap(renderer);

  // Low ambient + crisp directional key light + dual-tone rim lights for deep sculptural shadows
  const ambient = new THREE.AmbientLight("#93c5fd", 0.34);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight("#eff6ff", 4.2);
  keyLight.position.set(2.6, 3.8, 2.4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(512, 512);
  keyLight.shadow.bias = -0.0004;
  keyLight.shadow.normalBias = 0.02;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 10;
  keyLight.shadow.camera.left = -1.5;
  keyLight.shadow.camera.right = 1.5;
  keyLight.shadow.camera.top = 1.5;
  keyLight.shadow.camera.bottom = -1.5;
  scene.add(keyLight);

  const redRim = new THREE.PointLight("#ef4444", 28);
  redRim.position.set(-2.1, 1.1, 1.2);
  scene.add(redRim);

  const blueRim = new THREE.PointLight("#3b82f6", 22);
  blueRim.position.set(2.2, 0.2, -1.6);
  scene.add(blueRim);

  // Real cast-shadow floor catcher + radial contact shadow directly beneath piece base
  const shadowCatcher = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.ShadowMaterial({ opacity: 0.68, color: "#000000" })
  );
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.set(0, -0.585, 0);
  shadowCatcher.receiveShadow = true;
  scene.add(shadowCatcher);

  const contactShadowTex = createContactShadowTexture();
  const contactDisc = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, 2.1),
    new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.86,
    })
  );
  contactDisc.rotation.x = -Math.PI / 2;
  contactDisc.position.set(0, -0.584, 0);
  scene.add(contactDisc);

  const camera = new THREE.PerspectiveCamera(29, SNAPSHOT_WIDTH / SNAPSHOT_HEIGHT, 0.1, 20);
  camera.position.set(0, 0.08, 3.05);
  camera.lookAt(0, 0, 0);

  sharedStudio = { renderer, scene, camera, contactShadowTex };
  return sharedStudio;
}

function loadGlbScene(kind: PieceKind): Promise<THREE.Group> {
  const existing = GLB_CACHE.get(kind);
  if (existing) return existing;

  const loader = new GLTFLoader();
  const promise = loader.loadAsync(MODEL_PATHS[kind]).then((gltf) => gltf.scene);
  GLB_CACHE.set(kind, promise);
  return promise;
}

function requestPieceSnapshot(kind: PieceKind): Promise<string> {
  const cached = SNAPSHOT_CACHE.get(kind);
  if (cached) return Promise.resolve(cached);

  const pending = PENDING_RENDERS.get(kind);
  if (pending) return pending;

  const glbPromise = loadGlbScene(kind);
  const job = new Promise<string>((resolve, reject) => {
    drawQueue = drawQueue.then(async () => {
      try {
        const alreadyCached = SNAPSHOT_CACHE.get(kind);
        if (alreadyCached) {
          resolve(alreadyCached);
          return;
        }

        const glbScene = await glbPromise;
        const studio = getSharedStudio();
        const { geometry, meshQuaternion, offsetPos, unitScale } = getOrCreateNormalizedGeo(kind, glbScene);
        const { colorMap, iridescenceMap } = getOrCreateSwirlTextures(
          "crimsonBlue",
          HERO_3D_TUNING.SWIRL_PALETTE.crimsonBlue
        );

        const material = new THREE.MeshPhysicalMaterial({
          color: "#3b82f6",
          emissive: "#172554",
          emissiveIntensity: 0.34,
          metalness: 0.48,
          roughness: 0.14,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          iridescence: 0.5,
          iridescenceIOR: 1.5,
          iridescenceThicknessRange: [140, 620],
          iridescenceThicknessMap: iridescenceMap,
          map: colorMap,
          envMapIntensity: 2.35,
        });

        const pieceRoot = new THREE.Group();
        pieceRoot.position.set(0, -0.58, 0);
        pieceRoot.scale.setScalar(1.18);

        const scaleGroup = new THREE.Group();
        scaleGroup.scale.setScalar(unitScale);

        const offsetGroup = new THREE.Group();
        offsetGroup.position.copy(offsetPos);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.quaternion.copy(meshQuaternion);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        offsetGroup.add(mesh);
        scaleGroup.add(offsetGroup);
        pieceRoot.add(scaleGroup);

        studio.scene.add(pieceRoot);
        studio.renderer.render(studio.scene, studio.camera);
        const dataUrl = studio.renderer.domElement.toDataURL("image/png");
        studio.scene.remove(pieceRoot);
        material.dispose();

        SNAPSHOT_CACHE.set(kind, dataUrl);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    });
  });

  PENDING_RENDERS.set(kind, job);
  job.finally(() => {
    PENDING_RENDERS.delete(kind);
  });
  return job;
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
  const imgRef = useRef<HTMLImageElement>(null);
  const reducedMotionRef = useRef(false);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    requestPieceSnapshot(kind)
      .then((dataUrl) => {
        if (!cancelled) setSrc(dataUrl);
      })
      .catch(() => {
        // Keep empty container silently if WebGL context is unavailable
      });
    return () => {
      cancelled = true;
    };
  }, [kind]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current || !hostRef.current || !imgRef.current) return;
    if (e.pointerType === "touch") return;
    const rect = hostRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    imgRef.current.style.transform = `perspective(640px) rotateX(${(-ny * 6).toFixed(2)}deg) rotateY(${(nx * 10).toFixed(2)}deg) scale(1.03)`;
  };

  const onPointerLeave = () => {
    if (!imgRef.current) return;
    imgRef.current.style.transform = "perspective(640px) rotateX(0deg) rotateY(0deg) scale(1)";
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
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={label ?? ""}
          decoding="async"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            transition: "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        />
      ) : null}
    </div>
  );
}
