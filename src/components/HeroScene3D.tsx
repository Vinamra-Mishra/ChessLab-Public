"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

function lathe(pairs: Array<[number, number]>, segments = 64): THREE.LatheGeometry {
  const pts = pairs.map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(pts, segments);
  geo.computeVertexNormals();
  return geo;
}

function createChessboardTextures(): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const size = 512;
  const tiles = 8;
  const tilePx = size / tiles;

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext("2d")!;

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext("2d")!;

  for (let row = 0; row < tiles; row++) {
    for (let col = 0; col < tiles; col++) {
      const isLight = (row + col) % 2 === 0;
      cCtx.fillStyle = isLight ? "#d8d3c8" : "#0d0d0d";
      cCtx.fillRect(col * tilePx, row * tilePx, tilePx, tilePx);

      rCtx.fillStyle = isLight ? "#444444" : "#262626";
      rCtx.fillRect(col * tilePx, row * tilePx, tilePx, tilePx);
    }
  }

  // Subtle stone/marble micro-grain
  const cImg = cCtx.getImageData(0, 0, size, size);
  for (let i = 0; i < cImg.data.length; i += 4) {
    const n = ((Math.sin(i * 0.017) + Math.cos(i * 0.031)) * 4) | 0;
    cImg.data[i] = Math.max(0, Math.min(255, cImg.data[i] + n));
    cImg.data[i + 1] = Math.max(0, Math.min(255, cImg.data[i + 1] + n));
    cImg.data[i + 2] = Math.max(0, Math.min(255, cImg.data[i + 2] + n));
  }
  cCtx.putImageData(cImg, 0, 0);

  const map = new THREE.CanvasTexture(colorCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3, 3);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(3, 3);

  return { map, roughnessMap };
}

function createMicroGrainTextures(): {
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const size = 256;
  const bCanvas = document.createElement("canvas");
  bCanvas.width = size;
  bCanvas.height = size;
  const bCtx = bCanvas.getContext("2d")!;
  const bImg = bCtx.createImageData(size, size);

  const rCanvas = document.createElement("canvas");
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext("2d")!;
  const rImg = rCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const streak =
        Math.sin((y / size) * Math.PI * 24 + Math.sin((x / size) * Math.PI * 6) * 0.8) * 0.5 +
        Math.cos((x / size) * Math.PI * 8) * 0.3;
      const val = Math.round(THREE.MathUtils.clamp(128 + streak * 45, 40, 220));
      bImg.data[idx] = val;
      bImg.data[idx + 1] = val;
      bImg.data[idx + 2] = val;
      bImg.data[idx + 3] = 255;

      const rVal = Math.round(THREE.MathUtils.clamp(44 + streak * 18, 20, 95));
      rImg.data[idx] = rVal;
      rImg.data[idx + 1] = rVal;
      rImg.data[idx + 2] = rVal;
      rImg.data[idx + 3] = 255;
    }
  }

  bCtx.putImageData(bImg, 0, 0);
  rCtx.putImageData(rImg, 0, 0);

  const bumpMap = new THREE.CanvasTexture(bCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 2);

  const roughnessMap = new THREE.CanvasTexture(rCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(2, 2);

  return { bumpMap, roughnessMap };
}

function createGlowTexture(stops: Array<[number, string]>): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [offset, color] of stops) {
    grad.addColorStop(offset, color);
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildKing(mat: THREE.Material, disposables: THREE.BufferGeometry[]): THREE.Group {
  const g = new THREE.Group();
  const body = lathe([
    [0.0, 0.0],
    [0.64, 0.0],
    [0.66, 0.09],
    [0.54, 0.16],
    [0.57, 0.25],
    [0.42, 0.36],
    [0.3, 0.85],
    [0.24, 1.48],
    [0.42, 1.62],
    [0.28, 1.72],
    [0.38, 2.02],
    [0.46, 2.34],
    [0.32, 2.44],
    [0.0, 2.48],
  ]);
  disposables.push(body);
  const bodyMesh = new THREE.Mesh(body, mat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  g.add(bodyMesh);

  const vArm = new THREE.BoxGeometry(0.11, 0.36, 0.11);
  const hArm = new THREE.BoxGeometry(0.29, 0.105, 0.11);
  const orb = new THREE.SphereGeometry(0.075, 24, 24);
  disposables.push(vArm, hArm, orb);

  const vMesh = new THREE.Mesh(vArm, mat);
  vMesh.position.set(0, 2.66, 0);
  vMesh.castShadow = true;

  const hMesh = new THREE.Mesh(hArm, mat);
  hMesh.position.set(0, 2.7, 0);
  hMesh.castShadow = true;

  const oMesh = new THREE.Mesh(orb, mat);
  oMesh.position.set(0, 2.48, 0);

  g.add(vMesh, hMesh, oMesh);
  return g;
}

function buildQueen(mat: THREE.Material, disposables: THREE.BufferGeometry[]): THREE.Group {
  const g = new THREE.Group();
  const body = lathe([
    [0.0, 0.0],
    [0.58, 0.0],
    [0.6, 0.08],
    [0.48, 0.15],
    [0.52, 0.24],
    [0.37, 0.35],
    [0.26, 0.82],
    [0.21, 1.38],
    [0.37, 1.5],
    [0.25, 1.58],
    [0.36, 1.92],
    [0.44, 2.08],
    [0.24, 2.08],
    [0.0, 1.96],
  ]);
  disposables.push(body);
  const bodyMesh = new THREE.Mesh(body, mat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  g.add(bodyMesh);

  // 6 flared porcelain crown prongs + smooth orb tips
  const prongCount = 6;
  for (let i = 0; i < prongCount; i++) {
    const a = (i / prongCount) * Math.PI * 2;
    const prongGeo = new THREE.CylinderGeometry(0.042, 0.068, 0.28, 18);
    const tipGeo = new THREE.SphereGeometry(0.062, 20, 20);
    disposables.push(prongGeo, tipGeo);

    const holder = new THREE.Group();
    holder.position.set(Math.cos(a) * 0.36, 2.06, Math.sin(a) * 0.36);
    holder.rotation.y = -a;
    holder.rotation.z = -0.34;

    const prong = new THREE.Mesh(prongGeo, mat);
    prong.position.y = 0.12;
    prong.castShadow = true;
    const tip = new THREE.Mesh(tipGeo, mat);
    tip.position.y = 0.27;
    tip.castShadow = true;

    holder.add(prong, tip);
    g.add(holder);
  }

  const centerOrb = new THREE.SphereGeometry(0.11, 24, 24);
  disposables.push(centerOrb);
  const cMesh = new THREE.Mesh(centerOrb, mat);
  cMesh.position.set(0, 2.1, 0);
  cMesh.castShadow = true;
  g.add(cMesh);

  return g;
}

export function HeroScene3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const disposables: THREE.BufferGeometry[] = [];
    const textures: THREE.Texture[] = [];
    const materials: THREE.Material[] = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");
    scene.fog = new THREE.FogExp2(0x000000, 0.115);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    const baseCamPos = new THREE.Vector3(0, 1.35, 6.2);
    const lookTarget = new THREE.Vector3(0, 0.92, 0);
    camera.position.copy(baseCamPos);
    camera.lookAt(lookTarget);

    // Reflective chessboard floor
    const boardTex = createChessboardTextures();
    textures.push(boardTex.map, boardTex.roughnessMap);
    const boardMat = new THREE.MeshPhysicalMaterial({
      map: boardTex.map,
      roughnessMap: boardTex.roughnessMap,
      roughness: 0.24,
      metalness: 0.08,
      clearcoat: 0.65,
      clearcoatRoughness: 0.18,
      envMapIntensity: 0.9,
    });
    materials.push(boardMat);

    const boardGeo = new THREE.PlaneGeometry(16, 16);
    disposables.push(boardGeo);
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.rotation.x = -Math.PI / 2;
    board.receiveShadow = true;
    scene.add(board);

    // Micro-grain textures for obsidian King & porcelain Queen
    const grain = createMicroGrainTextures();
    textures.push(grain.bumpMap, grain.roughnessMap);

    const kingMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1a100c"),
      bumpMap: grain.bumpMap,
      bumpScale: 0.015,
      roughnessMap: grain.roughnessMap,
      roughness: 0.18,
      metalness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.07,
      envMapIntensity: 1.1,
    });
    const queenMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#f4f0e8"),
      roughnessMap: grain.roughnessMap,
      roughness: 0.13,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.25,
    });
    materials.push(kingMat, queenMat);

    const king = buildKing(kingMat, disposables);
    king.position.set(-0.18, 0, -0.25);
    scene.add(king);

    const queen = buildQueen(queenMat, disposables);
    queen.position.set(0.05, 0.26, 0.35);
    queen.rotation.set(0.08, 0.22, -0.6);
    scene.add(queen);

    // Studio backlight beam & fiery ember rim glow planes
    const backBeamTex = createGlowTexture([
      [0, "rgba(255, 245, 232, 0.44)"],
      [0.42, "rgba(215, 210, 200, 0.14)"],
      [1, "rgba(0, 0, 0, 0)"],
    ]);
    const emberTex = createGlowTexture([
      [0, "rgba(255, 61, 18, 0.65)"],
      [0.45, "rgba(255, 61, 18, 0.22)"],
      [1, "rgba(0, 0, 0, 0)"],
    ]);
    textures.push(backBeamTex, emberTex);

    const beamMat = new THREE.MeshBasicMaterial({
      map: backBeamTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const emberMat = new THREE.MeshBasicMaterial({
      map: emberTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materials.push(beamMat, emberMat);

    const beamGeo = new THREE.PlaneGeometry(8, 9);
    const emberGeo = new THREE.PlaneGeometry(5.5, 5.5);
    disposables.push(beamGeo, emberGeo);

    const beamPlane = new THREE.Mesh(beamGeo, beamMat);
    beamPlane.position.set(-0.15, 3.2, -2.8);
    scene.add(beamPlane);

    const emberPlane = new THREE.Mesh(emberGeo, emberMat);
    emberPlane.position.set(-1.1, 1.1, -1.1);
    scene.add(emberPlane);

    // Chiaroscuro lights
    const keySpot = new THREE.SpotLight("#fff7ed", 28, 22, Math.PI / 4.2, 0.65, 1.4);
    keySpot.position.set(1.4, 6.2, 3.2);
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.set(1024, 1024);
    keySpot.shadow.bias = -0.0005;
    scene.add(keySpot);

    const emberRim = new THREE.PointLight("#ff4214", 18, 10);
    emberRim.position.set(-1.8, 1.3, 0.4);
    scene.add(emberRim);

    const coolFill = new THREE.DirectionalLight("#cbd5e1", 0.55);
    coolFill.position.set(3, 2, 4);
    scene.add(coolFill);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      pointerX = (e.clientX / w - 0.5) * 2;
      pointerY = (e.clientY / h - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let inView = true;
    let rafId = 0;
    const renderFrame = () => {
      if (!reducedMotion) {
        const targetX = baseCamPos.x + pointerX * 0.42;
        const targetY = baseCamPos.y - pointerY * 0.18;
        camera.position.x += (targetX - camera.position.x) * 0.06;
        camera.position.y += (targetY - camera.position.y) * 0.06;
        camera.lookAt(lookTarget);
      }
      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!inView || reducedMotion) return;
      renderFrame();
      rafId = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        if (inView) {
          if (reducedMotion) {
            renderFrame();
          } else if (!rafId) {
            rafId = requestAnimationFrame(loop);
          }
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.01 }
    );
    io.observe(host);

    if (reducedMotion) {
      renderFrame();
    } else {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      for (const geo of disposables) geo.dispose();
      for (const tex of textures) tex.dispose();
      for (const mat of materials) mat.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={hostRef} className="hero-scene-3d" aria-hidden="true" />;
}
