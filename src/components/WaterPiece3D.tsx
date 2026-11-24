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

    const waterMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#dff7ff"),
      metalness: 0.0,
      roughness: 0.05,
      transmission: 0.92,
      ior: 1.333,
      thickness: 1.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      attenuationColor: new THREE.Color("#0ea5e9"),
      attenuationDistance: 1.9,
      envMapIntensity: 1.45,
    });

    const keyLight = new THREE.DirectionalLight("#e8f8ff", 2.2);
    keyLight.position.set(2.8, 4.2, 3.6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight("#38bdf8", 3.5, 14);
    rimLight.position.set(-2.6, 1.8, -2.4);
    scene.add(rimLight);

    const bounceLight = new THREE.PointLight("#2dd4bf", 1.8, 12);
    bounceLight.position.set(1.6, -2.2, 2.0);
    scene.add(bounceLight);

    const group = new THREE.Group();
    group.add(buildPieceMeshes(kind, waterMat, disposables));
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
      waterMat.dispose();
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
