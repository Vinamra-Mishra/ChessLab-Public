"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { PieceKind } from "./Pieces";

function latheFromPairs(pairs: Array<[number, number]>, segments = 48): THREE.LatheGeometry {
  const pts = pairs.map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(pts, segments);
  geo.computeVertexNormals();
  return geo;
}

function buildPieceMeshes(kind: PieceKind, mat: THREE.Material, disposables: THREE.BufferGeometry[]): THREE.Group {
  const root = new THREE.Group();

  const add = (geo: THREE.BufferGeometry, pos?: [number, number, number], rot?: [number, number, number]) => {
    disposables.push(geo);
    const mesh = new THREE.Mesh(geo, mat);
    if (pos) mesh.position.set(...pos);
    if (rot) mesh.rotation.set(...rot);
    root.add(mesh);
    return mesh;
  };

  if (kind === "pawn") {
    add(
      latheFromPairs([
        [0.0, -1.35],
        [0.64, -1.35],
        [0.66, -1.24],
        [0.54, -1.16],
        [0.58, -1.04],
        [0.42, -0.92],
        [0.29, -0.52],
        [0.21, -0.05],
        [0.34, 0.14],
        [0.22, 0.24],
        [0.16, 0.36],
        [0.0, 0.36],
      ])
    );
    add(new THREE.SphereGeometry(0.36, 36, 36), [0, 0.66, 0]);
  } else if (kind === "rook") {
    add(
      latheFromPairs([
        [0.0, -1.35],
        [0.72, -1.35],
        [0.74, -1.22],
        [0.6, -1.12],
        [0.63, -1.0],
        [0.48, -0.84],
        [0.37, -0.3],
        [0.34, 0.36],
        [0.48, 0.56],
        [0.52, 0.82],
        [0.32, 0.82],
        [0.32, 0.68],
        [0.0, 0.68],
      ])
    );
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const box = new THREE.BoxGeometry(0.22, 0.24, 0.16);
      const r = 0.42;
      add(box, [Math.cos(angle) * r, 0.94, Math.sin(angle) * r], [0, -angle + Math.PI / 2, 0]);
    }
  } else if (kind === "bishop") {
    add(
      latheFromPairs([
        [0.0, -1.35],
        [0.7, -1.35],
        [0.72, -1.22],
        [0.58, -1.12],
        [0.62, -1.0],
        [0.45, -0.84],
        [0.31, -0.35],
        [0.23, 0.16],
        [0.39, 0.3],
        [0.25, 0.4],
        [0.36, 0.68],
        [0.34, 0.96],
        [0.2, 1.2],
        [0.0, 1.32],
      ])
    );
    add(new THREE.SphereGeometry(0.13, 28, 28), [0, 1.44, 0]);
  } else if (kind === "queen") {
    add(
      latheFromPairs([
        [0.0, -1.38],
        [0.76, -1.38],
        [0.78, -1.24],
        [0.62, -1.12],
        [0.66, -1.0],
        [0.48, -0.82],
        [0.33, -0.25],
        [0.24, 0.36],
        [0.42, 0.52],
        [0.28, 0.62],
        [0.48, 1.04],
        [0.54, 1.18],
        [0.28, 1.18],
        [0.0, 1.05],
      ])
    );
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      add(new THREE.SphereGeometry(0.095, 20, 20), [Math.cos(angle) * 0.46, 1.26, Math.sin(angle) * 0.46]);
    }
    add(new THREE.SphereGeometry(0.15, 28, 28), [0, 1.34, 0]);
  } else if (kind === "king") {
    add(
      latheFromPairs([
        [0.0, -1.4],
        [0.78, -1.4],
        [0.8, -1.26],
        [0.64, -1.14],
        [0.68, -1.0],
        [0.49, -0.82],
        [0.34, -0.22],
        [0.26, 0.4],
        [0.44, 0.56],
        [0.3, 0.66],
        [0.46, 1.1],
        [0.36, 1.2],
        [0.0, 1.22],
      ])
    );
    add(new THREE.BoxGeometry(0.14, 0.44, 0.14), [0, 1.44, 0]);
    add(new THREE.BoxGeometry(0.36, 0.13, 0.14), [0, 1.5, 0]);
  } else {
    // knight: lathe pedestal + beveled 3D horse head silhouette
    add(
      latheFromPairs([
        [0.0, -1.35],
        [0.74, -1.35],
        [0.76, -1.22],
        [0.6, -1.12],
        [0.64, -1.0],
        [0.48, -0.84],
        [0.38, -0.66],
        [0.0, -0.66],
      ])
    );
    const shape = new THREE.Shape();
    shape.moveTo(-0.34, -0.68);
    shape.lineTo(-0.32, -0.18);
    shape.quadraticCurveTo(-0.46, 0.32, -0.22, 0.78);
    shape.quadraticCurveTo(-0.12, 1.06, 0.02, 1.22);
    shape.lineTo(0.12, 1.02);
    shape.quadraticCurveTo(0.28, 1.0, 0.44, 0.8);
    shape.lineTo(0.56, 0.48);
    shape.quadraticCurveTo(0.5, 0.34, 0.34, 0.36);
    shape.lineTo(0.12, 0.42);
    shape.quadraticCurveTo(0.06, 0.24, 0.22, 0.02);
    shape.quadraticCurveTo(0.42, -0.26, 0.34, -0.68);
    shape.closePath();

    const horse = new THREE.ExtrudeGeometry(shape, {
      depth: 0.26,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.12,
      bevelSegments: 8,
      curveSegments: 24,
    });
    horse.translate(0, 0, -0.13);
    horse.computeVertexNormals();
    add(horse);
  }

  return root;
}

function buildWaterRibbons(
  mat: THREE.Material,
  disposables: THREE.BufferGeometry[]
): { ribbons: THREE.Group; droplets: Array<{ mesh: THREE.Mesh; baseY: number; phase: number; radius: number; speed: number }> } {
  const ribbons = new THREE.Group();

  const makeRibbon = (turns: number, yStart: number, yEnd: number, rStart: number, rEnd: number, radius: number, phase: number) => {
    const pts: THREE.Vector3[] = [];
    const steps = 36;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const a = phase + t * turns * Math.PI * 2;
      const r = THREE.MathUtils.lerp(rStart, rEnd, t) + Math.sin(t * Math.PI) * 0.14;
      const y = THREE.MathUtils.lerp(yStart, yEnd, t);
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.TubeGeometry(curve, 64, radius, 14, false);
    disposables.push(tube);
    ribbons.add(new THREE.Mesh(tube, mat));
  };

  makeRibbon(1.25, -1.25, 0.65, 0.92, 0.46, 0.055, 0.3);
  makeRibbon(0.9, -1.15, 0.22, 0.82, 0.56, 0.038, 3.4);

  const droplets: Array<{ mesh: THREE.Mesh; baseY: number; phase: number; radius: number; speed: number }> = [];
  const dropPositions: Array<[number, number, number, number]> = [
    [0.88, 0.32, 0.055, 0.0],
    [0.74, 0.95, 0.045, 1.1],
    [0.95, -0.45, 0.065, 2.2],
    [0.68, -0.82, 0.048, 3.3],
    [0.82, 0.68, 0.038, 4.4],
    [1.02, -0.1, 0.042, 5.2],
  ];

  for (const [radius, baseY, size, phase] of dropPositions) {
    const geo = new THREE.SphereGeometry(size, 18, 18);
    disposables.push(geo);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(Math.cos(phase) * radius, baseY, Math.sin(phase) * radius);
    ribbons.add(mesh);
    droplets.push({ mesh, baseY, phase, radius, speed: 0.35 + (phase % 0.4) });
  }

  return { ribbons, droplets };
}

function createWaterTextures(): {
  colorMap: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const size = 256;
  const tau = Math.PI * 2;

  const heightAt = (u: number, v: number) => {
    const x = u * tau;
    const y = v * tau;
    return (
      Math.sin(x * 3 + Math.cos(y * 2)) * 0.42 +
      Math.cos(y * 4 - Math.sin(x * 3)) * 0.34 +
      Math.sin((x + y) * 5) * 0.16 +
      Math.cos((x * 2 - y * 3) * 2) * 0.08
    );
  };

  // 1. Seamless tangent-space ripple normal map + roughness map
  const normalCanvas = document.createElement("canvas");
  normalCanvas.width = size;
  normalCanvas.height = size;
  const nCtx = normalCanvas.getContext("2d")!;
  const nImg = nCtx.createImageData(size, size);

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext("2d")!;
  const rImg = rCtx.createImageData(size, size);

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext("2d")!;
  const cImg = cCtx.createImageData(size, size);

  const eps = 1 / size;
  const strength = 2.6;

  for (let py = 0; py < size; py++) {
    const v = py / size;
    for (let px = 0; px < size; px++) {
      const u = px / size;
      const h = heightAt(u, v);
      const hx = heightAt(u + eps, v) - heightAt(u - eps, v);
      const hy = heightAt(u, v + eps) - heightAt(u, v - eps);

      let nx = -hx * strength;
      let ny = -hy * strength;
      let nz = 1.0;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      nz /= len;

      const idx = (py * size + px) * 4;
      nImg.data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
      nImg.data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      nImg.data[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      nImg.data[idx + 3] = 255;

      // Caustic filament intensity: sharp bright ridges where |h| approaches zero/crest
      const ridge = Math.pow(1 - Math.min(1, Math.abs(Math.sin(u * tau * 3 + h * 1.6))), 3.5);
      const ridge2 = Math.pow(1 - Math.min(1, Math.abs(Math.cos(v * tau * 4 - h * 1.4))), 4.0);
      const caustic = Math.min(1, ridge * 0.7 + ridge2 * 0.65);

      const roughVal = Math.round(THREE.MathUtils.clamp(22 + (1 - caustic) * 48, 12, 90));
      rImg.data[idx] = roughVal;
      rImg.data[idx + 1] = roughVal;
      rImg.data[idx + 2] = roughVal;
      rImg.data[idx + 3] = 255;

      // Translucent aqua-cerulean swirls with crisp caustic highlights
      const swirl = (h + 1) * 0.5;
      const cr = Math.round(THREE.MathUtils.clamp(120 + swirl * 65 + caustic * 70, 0, 255));
      const cg = Math.round(THREE.MathUtils.clamp(215 + swirl * 30 + caustic * 25, 0, 255));
      const cb = Math.round(THREE.MathUtils.clamp(242 + swirl * 13, 0, 255));
      cImg.data[idx] = cr;
      cImg.data[idx + 1] = cg;
      cImg.data[idx + 2] = cb;
      cImg.data[idx + 3] = 255;
    }
  }

  nCtx.putImageData(nImg, 0, 0);
  rCtx.putImageData(rImg, 0, 0);
  cCtx.putImageData(cImg, 0, 0);

  const setup = (canvas: HTMLCanvasElement, srgb: boolean) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
  };

  return {
    colorMap: setup(colorCanvas, true),
    normalMap: setup(normalCanvas, false),
    roughnessMap: setup(roughCanvas, false),
  };
}

function buildInternalBubbles(
  mat: THREE.Material,
  disposables: THREE.BufferGeometry[]
): THREE.Group {
  const bubbles = new THREE.Group();
  const specs: Array<[number, number, number, number]> = [
    [0.06, -1.12, 0.08, 0.036],
    [-0.14, -1.08, -0.05, 0.028],
    [0.12, -0.96, -0.1, 0.022],
    [-0.08, -0.78, 0.09, 0.032],
    [0.05, -0.62, -0.06, 0.024],
    [-0.04, -0.45, 0.05, 0.02],
    [0.09, -0.28, 0.04, 0.026],
    [-0.07, -0.12, -0.04, 0.018],
    [0.03, 0.06, 0.06, 0.025],
    [-0.06, 0.22, -0.03, 0.017],
    [0.08, 0.42, 0.03, 0.022],
    [-0.04, 0.58, 0.05, 0.019],
    [0.05, 0.74, -0.04, 0.024],
    [-0.08, 0.88, 0.02, 0.016],
    [0.02, 1.02, 0.04, 0.021],
    [-0.18, -1.18, 0.14, 0.038],
    [0.2, -1.14, 0.11, 0.034],
    [0.0, -0.88, -0.14, 0.03],
  ];

  for (const [x, y, z, r] of specs) {
    const geo = new THREE.SphereGeometry(r, 12, 12);
    disposables.push(geo);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    bubbles.add(mesh);
  }
  return bubbles;
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

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const disposables: THREE.BufferGeometry[] = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0.35, 5.4);
    camera.lookAt(0, 0.05, 0);

    const { colorMap, normalMap, roughnessMap } = createWaterTextures();

    const isIvory = kind === "queen" || kind === "bishop";
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isIvory ? "#f4f0e8" : "#1a110d"),
      bumpMap: normalMap,
      bumpScale: 0.014,
      roughnessMap,
      metalness: 0.04,
      roughness: isIvory ? 0.14 : 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      envMapIntensity: isIvory ? 1.25 : 1.15,
    });

    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isIvory ? "#fff8ed" : "#ff6b3d"),
      metalness: 0.05,
      roughness: 0.12,
      clearcoat: 1.0,
    });

    const keyLight = new THREE.DirectionalLight("#fff7ed", 2.4);
    keyLight.position.set(2.8, 4.2, 3.6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight("#ff4214", 5.2, 14);
    rimLight.position.set(-2.4, 1.4, -1.8);
    scene.add(rimLight);

    const bounceLight = new THREE.PointLight("#cbd5e1", 1.4, 12);
    bounceLight.position.set(1.8, -1.6, 2.4);
    scene.add(bounceLight);

    const group = new THREE.Group();
    group.add(buildPieceMeshes(kind, waterMat, disposables));
    group.add(buildInternalBubbles(bubbleMat, disposables));
    const { ribbons, droplets } = buildWaterRibbons(waterMat, disposables);
    group.add(ribbons);
    scene.add(group);

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
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onPointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
    };
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);

    let inView = true;
    let rafId = 0;
    const clock = new THREE.Clock();

    const renderFrame = () => {
      const t = clock.getElapsedTime();
      if (!reducedMotion) {
        const targetRotY = t * 0.42 + pointerX * 0.45;
        const targetRotX = pointerY * 0.22;
        group.rotation.y += (targetRotY - group.rotation.y) * 0.08;
        group.rotation.x += (targetRotX - group.rotation.x) * 0.08;
        ribbons.rotation.y = Math.sin(t * 0.6) * 0.14;
        normalMap.offset.y = t * 0.06;
        normalMap.offset.x = Math.sin(t * 0.3) * 0.04;
        colorMap.offset.y = t * 0.035;
        for (const d of droplets) {
          const a = d.phase + t * d.speed;
          d.mesh.position.set(
            Math.cos(a) * d.radius,
            d.baseY + Math.sin(t * 1.4 + d.phase) * 0.08,
            Math.sin(a) * d.radius
          );
        }
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
          clock.start();
          if (reducedMotion) {
            renderFrame();
          } else if (!rafId) {
            rafId = requestAnimationFrame(loop);
          }
        } else {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
          clock.stop();
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
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      for (const geo of disposables) geo.dispose();
      colorMap.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
      waterMat.dispose();
      bubbleMat.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [kind]);

  return (
    <div
      ref={hostRef}
      className={`piece-water-3d${className ? ` ${className}` : ""}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-material="water"
      data-piece={kind}
    />
  );
}
