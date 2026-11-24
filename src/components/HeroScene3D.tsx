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
      cCtx.fillStyle = isLight ? "#d8d3c8" : "#0b0b0b";
      cCtx.fillRect(col * tilePx, row * tilePx, tilePx, tilePx);

      rCtx.fillStyle = isLight ? "#363636" : "#1a1a1a";
      rCtx.fillRect(col * tilePx, row * tilePx, tilePx, tilePx);
    }
  }

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
  map.repeat.set(1.4, 1.4);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(1.4, 1.4);

  return { map, roughnessMap };
}

function createWaterNormalMap(): THREE.CanvasTexture {
  const size = 256;
  const tau = Math.PI * 2;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);

  const hAt = (u: number, v: number) => {
    const x = u * tau;
    const y = v * tau;
    return (
      Math.sin(x * 3 + Math.cos(y * 2)) * 0.45 +
      Math.cos(y * 4 - Math.sin(x * 3)) * 0.35 +
      Math.sin((x + y) * 5) * 0.14 +
      Math.cos((x * 2 - y * 3) * 2) * 0.06
    );
  };

  const eps = 1 / size;
  const strength = 2.4;

  for (let py = 0; py < size; py++) {
    const v = py / size;
    for (let px = 0; px < size; px++) {
      const u = px / size;
      const hx = hAt(u + eps, v) - hAt(u - eps, v);
      const hy = hAt(u, v + eps) - hAt(u, v - eps);

      let nx = -hx * strength;
      let ny = -hy * strength;
      let nz = 1.0;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      nz /= len;

      const idx = (py * size + px) * 4;
      img.data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
      img.data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      img.data[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      img.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2);
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
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

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
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
    renderer.toneMappingExposure = 1.18;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");
    scene.fog = new THREE.FogExp2(0x000000, 0.24);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
    const baseCamPos = new THREE.Vector3(0, 1.25, 5.15);
    const lookTarget = new THREE.Vector3(0, 1.18, 0);
    camera.position.copy(baseCamPos);
    camera.lookAt(lookTarget);

    // Wet water ripple normal map shared across pieces & floor
    const waterNormal = createWaterNormalMap();
    textures.push(waterNormal);

    // Wet reflective chessboard floor
    const boardTex = createChessboardTextures();
    textures.push(boardTex.map, boardTex.roughnessMap);
    const boardMat = new THREE.MeshPhysicalMaterial({
      map: boardTex.map,
      roughnessMap: boardTex.roughnessMap,
      normalMap: waterNormal,
      normalScale: new THREE.Vector2(0.12, 0.12),
      roughness: 0.12,
      metalness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.1,
    });
    materials.push(boardMat);

    const boardGeo = new THREE.PlaneGeometry(14, 14);
    disposables.push(boardGeo);
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.rotation.x = -Math.PI / 2;
    board.receiveShadow = true;
    scene.add(board);

    // Deep obsidian-espresso wet water-reflective King
    const kingMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1b0e09"),
      normalMap: waterNormal,
      normalScale: new THREE.Vector2(0.28, 0.28),
      roughness: 0.05,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      iridescence: 0.22,
      iridescenceIOR: 1.333,
      envMapIntensity: 1.8,
    });

    // Luminous pearl-ivory wet water-reflective Queen
    const queenMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#f4efe6"),
      normalMap: waterNormal,
      normalScale: new THREE.Vector2(0.25, 0.25),
      roughness: 0.05,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      iridescence: 0.35,
      iridescenceIOR: 1.333,
      envMapIntensity: 1.9,
    });
    materials.push(kingMat, queenMat);

    const king = buildKing(kingMat, disposables);
    king.position.set(-0.18, 0, -0.25);
    scene.add(king);

    const queen = buildQueen(queenMat, disposables);
    queen.position.set(0.05, 0.26, 0.35);
    queen.rotation.set(0.08, 0.22, -0.6);
    scene.add(queen);

    // Chiaroscuro backlight column + fiery orange-red ember rim glow
    const backBeamTex = createGlowTexture([
      [0, "rgba(255, 245, 232, 0.56)"],
      [0.42, "rgba(215, 210, 200, 0.18)"],
      [1, "rgba(0, 0, 0, 0)"],
    ]);
    const emberTex = createGlowTexture([
      [0, "rgba(255, 58, 16, 0.78)"],
      [0.45, "rgba(255, 58, 16, 0.26)"],
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

    const beamGeo = new THREE.PlaneGeometry(7.5, 8.5);
    const emberGeo = new THREE.PlaneGeometry(5, 5);
    disposables.push(beamGeo, emberGeo);

    const beamPlane = new THREE.Mesh(beamGeo, beamMat);
    beamPlane.position.set(-0.1, 2.5, -1.9);
    scene.add(beamPlane);

    const emberPlane = new THREE.Mesh(emberGeo, emberMat);
    emberPlane.position.set(-0.9, 0.95, -0.8);
    scene.add(emberPlane);

    const keySpot = new THREE.SpotLight("#fff7ed", 34, 22, Math.PI / 4.2, 0.65, 1.4);
    keySpot.position.set(1.4, 5.8, 3.0);
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.set(1024, 1024);
    keySpot.shadow.bias = -0.0005;
    scene.add(keySpot);

    const emberRim = new THREE.PointLight("#ff3a10", 26, 10);
    emberRim.position.set(-1.6, 1.2, 0.5);
    scene.add(emberRim);

    const coolFill = new THREE.DirectionalLight("#cbd5e1", 0.65);
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
    const startTime = performance.now();

    const renderFrame = () => {
      const t = (performance.now() - startTime) * 0.001;
      if (!reducedMotion) {
        const targetX = baseCamPos.x + pointerX * 0.36;
        const targetY = baseCamPos.y - pointerY * 0.16;
        camera.position.x += (targetX - camera.position.x) * 0.06;
        camera.position.y += (targetY - camera.position.y) * 0.06;
        camera.lookAt(lookTarget);
        waterNormal.offset.y = t * 0.045;
        waterNormal.offset.x = Math.sin(t * 0.25) * 0.025;
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
