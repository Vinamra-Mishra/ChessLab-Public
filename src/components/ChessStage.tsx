"use client";

import { useEffect, useRef } from "react";
import type { BufferGeometry, Group, Material, Mesh, Object3D } from "three";

type Three = typeof import("three");
type PieceKind = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

const PIECE_PROFILES: Record<PieceKind, Array<[number, number]>> = {
  pawn: [
    [0, 0.02], [0.29, 0.02], [0.34, 0.055], [0.32, 0.10], [0.23, 0.14],
    [0.16, 0.28], [0.19, 0.34], [0.17, 0.39], [0.12, 0.43], [0.09, 0.49],
    [0.05, 0.52], [0, 0.52],
  ],
  rook: [
    [0, 0.02], [0.34, 0.02], [0.39, 0.06], [0.37, 0.12], [0.27, 0.16],
    [0.20, 0.25], [0.22, 0.32], [0.23, 0.77], [0.29, 0.82], [0.31, 0.89],
    [0.26, 0.93], [0, 0.93],
  ],
  knight: [
    [0, 0.02], [0.36, 0.02], [0.40, 0.06], [0.37, 0.12], [0.27, 0.17],
    [0.20, 0.27], [0.17, 0.42], [0.12, 0.47], [0, 0.47],
  ],
  bishop: [
    [0, 0.02], [0.35, 0.02], [0.39, 0.06], [0.37, 0.12], [0.26, 0.16],
    [0.19, 0.27], [0.13, 0.44], [0.18, 0.52], [0.20, 0.61], [0.15, 0.76],
    [0.09, 0.91], [0.05, 0.99], [0, 1.01],
  ],
  queen: [
    [0, 0.02], [0.37, 0.02], [0.41, 0.06], [0.39, 0.12], [0.27, 0.17],
    [0.21, 0.29], [0.17, 0.46], [0.12, 0.61], [0.18, 0.73], [0.22, 0.82],
    [0.17, 0.91], [0.10, 1.02], [0.07, 1.11], [0, 1.14],
  ],
  king: [
    [0, 0.02], [0.38, 0.02], [0.42, 0.06], [0.40, 0.12], [0.28, 0.17],
    [0.21, 0.30], [0.17, 0.49], [0.13, 0.67], [0.18, 0.78], [0.21, 0.88],
    [0.16, 0.98], [0.10, 1.08], [0.08, 1.16], [0, 1.19],
  ],
};

const STARTING_BACK_RANK: PieceKind[] = [
  "rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook",
];

const FALLBACK_BACK_RANK = {
  light: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
  dark: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
};

function fallbackPiece(file: number, rank: number) {
  if (rank === 7) return { glyph: FALLBACK_BACK_RANK.dark[file], side: "dark" };
  if (rank === 0) return { glyph: FALLBACK_BACK_RANK.light[file], side: "light" };
  if (rank === 6 && file !== 4) return { glyph: "♟", side: "dark" };
  if (rank === 1 && file !== 4) return { glyph: "♙", side: "light" };
  if (rank === 4 && file === 4) return { glyph: "♟", side: "dark" };
  if (rank === 3 && file === 4) return { glyph: "♙", side: "light" };
  return { glyph: "", side: "" };
}

function StageFallback() {
  return (
    <div className="chess-stage__fallback" aria-hidden="true">
      <div className="chess-stage__fallback-board">
        {Array.from({ length: 64 }, (_, index) => {
          const file = index % 8;
          const rank = 7 - Math.floor(index / 8);
          const piece = fallbackPiece(file, rank);
          const squareTone = (file + rank) % 2 === 0 ? "light" : "dark";
          return (
            <span className={`chess-stage__fallback-square chess-stage__fallback-square--${squareTone}`} key={`${file}-${rank}`}>
              <span className={piece.side ? `chess-stage__fallback-piece chess-stage__fallback-piece--${piece.side}` : ""}>{piece.glyph}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function addMesh<T extends BufferGeometry>(
  THREE: Three,
  parent: Group,
  geometry: T,
  material: Material,
  position: [number, number, number] = [0, 0, 0],
): Mesh<T, Material> {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addLathedBody(THREE: Three, group: Group, kind: PieceKind, material: Material) {
  const points = PIECE_PROFILES[kind].map(([radius, height]) => new THREE.Vector2(radius, height));
  addMesh(THREE, group, new THREE.LatheGeometry(points, 48), material);
}

function addKnightHead(THREE: Three, group: Group, material: Material, detailMaterial: Material) {
  const silhouette = new THREE.Shape();
  silhouette.moveTo(-0.25, 0.40);
  silhouette.lineTo(0.23, 0.40);
  silhouette.quadraticCurveTo(0.20, 0.56, 0.11, 0.69);
  silhouette.quadraticCurveTo(0.30, 0.79, 0.28, 0.99);
  silhouette.lineTo(0.18, 0.96);
  silhouette.lineTo(0.22, 1.23);
  silhouette.lineTo(0.08, 1.12);
  silhouette.quadraticCurveTo(-0.03, 1.28, -0.15, 1.19);
  silhouette.lineTo(-0.18, 1.02);
  silhouette.quadraticCurveTo(-0.34, 0.91, -0.30, 0.76);
  silhouette.quadraticCurveTo(-0.22, 0.59, -0.25, 0.40);

  const head = new THREE.ExtrudeGeometry(silhouette, {
    depth: 0.20,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.035,
    curveSegments: 8,
  });
  head.translate(0, 0, -0.10);
  addMesh(THREE, group, head, material);

  const eye = new THREE.SphereGeometry(0.035, 16, 12);
  addMesh(THREE, group, eye, detailMaterial, [0.12, 0.91, 0.125]);
}

function createPiece(
  THREE: Three,
  kind: PieceKind,
  side: "light" | "dark",
  materials: {
    light: Material;
    dark: Material;
    lightDetail: Material;
    darkDetail: Material;
    lightShadow: Material;
    darkShadow: Material;
  },
): Group {
  const group = new THREE.Group();
  const body = side === "light" ? materials.light : materials.dark;
  const detail = side === "light" ? materials.lightDetail : materials.darkDetail;
  const shadow = side === "light" ? materials.lightShadow : materials.darkShadow;

  addLathedBody(THREE, group, kind, body);
  addMesh(
    THREE,
    group,
    new THREE.TorusGeometry(0.31, 0.018, 8, 36),
    detail,
    [0, 0.105, 0],
  ).rotation.x = Math.PI / 2;

  if (kind === "knight") {
    addKnightHead(THREE, group, body, detail);
  }

  if (kind === "rook") {
    const capY = 0.91;
    addMesh(THREE, group, new THREE.CylinderGeometry(0.30, 0.30, 0.10, 40), detail, [0, capY, 0]);
    const blockGeometry = new THREE.BoxGeometry(0.12, 0.15, 0.12);
    for (let index = 0; index < 6; index += 1) {
      const angle = (index / 6) * Math.PI * 2;
      addMesh(
        THREE,
        group,
        blockGeometry,
        body,
        [Math.cos(angle) * 0.21, capY + 0.09, Math.sin(angle) * 0.21],
      );
    }
  }

  if (kind === "bishop") {
    const orb = new THREE.SphereGeometry(0.085, 24, 16);
    addMesh(THREE, group, orb, detail, [0, 1.04, 0]);
    const slash = addMesh(
      THREE,
      group,
      new THREE.BoxGeometry(0.035, 0.25, 0.035),
      shadow,
      [0, 0.76, 0.13],
    );
    slash.rotation.z = -0.48;
  }

  if (kind === "queen") {
    const crown = new THREE.TorusGeometry(0.16, 0.022, 8, 32);
    addMesh(THREE, group, crown, detail, [0, 1.12, 0]);
    const point = new THREE.SphereGeometry(0.055, 20, 14);
    for (let index = 0; index < 5; index += 1) {
      const angle = (index / 5) * Math.PI * 2;
      addMesh(
        THREE,
        group,
        point,
        detail,
        [Math.cos(angle) * 0.15, 1.17, Math.sin(angle) * 0.15],
      );
    }
  }

  if (kind === "king") {
    addMesh(THREE, group, new THREE.SphereGeometry(0.085, 24, 16), detail, [0, 1.21, 0]);
    addMesh(THREE, group, new THREE.BoxGeometry(0.075, 0.35, 0.075), detail, [0, 1.43, 0]);
    addMesh(THREE, group, new THREE.BoxGeometry(0.25, 0.065, 0.075), detail, [0, 1.43, 0]);
  }

  return group;
}

function addBoard(THREE: Three, board: Group, materials: {
  paleSquare: Material;
  greenSquare: Material;
  frame: Material;
  trim: Material;
}) {
  const boardWidth = 7.22;
  const squareSize = 0.84;
  const base = addMesh(
    THREE,
    board,
    new THREE.BoxGeometry(boardWidth, 0.34, boardWidth),
    materials.frame,
    [0, -0.18, 0],
  );
  base.receiveShadow = true;

  addMesh(
    THREE,
    board,
    new THREE.BoxGeometry(6.91, 0.055, 6.91),
    materials.trim,
    [0, -0.013, 0],
  );

  const squareGeometry = new THREE.BoxGeometry(squareSize - 0.012, 0.072, squareSize - 0.012);
  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const pale = (rank + file) % 2 === 0;
      addMesh(
        THREE,
        board,
        squareGeometry,
        pale ? materials.paleSquare : materials.greenSquare,
        [(file - 3.5) * squareSize, 0.044, (rank - 3.5) * squareSize],
      );
    }
  }
}

function populateBoard(THREE: Three, board: Group, materials: Parameters<typeof createPiece>[3]) {
  for (let file = 0; file < 8; file += 1) {
    const lightBack = createPiece(THREE, STARTING_BACK_RANK[file], "light", materials);
    const darkBack = createPiece(THREE, STARTING_BACK_RANK[file], "dark", materials);
    lightBack.position.set((file - 3.5) * 0.84, 0.06, (0 - 3.5) * 0.84);
    darkBack.position.set((file - 3.5) * 0.84, 0.06, (7 - 3.5) * 0.84);
    board.add(lightBack, darkBack);

    if (file !== 4) {
      const lightPawn = createPiece(THREE, "pawn", "light", materials);
      const darkPawn = createPiece(THREE, "pawn", "dark", materials);
      lightPawn.position.set((file - 3.5) * 0.84, 0.06, (1 - 3.5) * 0.84);
      darkPawn.position.set((file - 3.5) * 0.84, 0.06, (6 - 3.5) * 0.84);
      board.add(lightPawn, darkPawn);
    }
  }

  const lightCenterPawn = createPiece(THREE, "pawn", "light", materials);
  const darkCenterPawn = createPiece(THREE, "pawn", "dark", materials);
  lightCenterPawn.position.set((4 - 3.5) * 0.84, 0.06, (3 - 3.5) * 0.84);
  darkCenterPawn.position.set((4 - 3.5) * 0.84, 0.06, (4 - 3.5) * 0.84);
  board.add(lightCenterPawn, darkCenterPawn);
}

function disposeScene(scene: Object3D) {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  scene.traverse((object) => {
    const candidate = object as Object3D & { geometry?: BufferGeometry; material?: Material | Material[] };
    if (candidate.geometry) geometries.add(candidate.geometry);
    if (candidate.material) {
      for (const material of Array.isArray(candidate.material) ? candidate.material : [candidate.material]) {
        materials.add(material);
      }
    }
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}

export default function ChessStage() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void import("three").then((THREE) => {
      if (cancelled || !stageRef.current) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        stage.classList.add("chess-stage--unavailable");
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.14;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.domElement.className = "chess-stage__canvas";
      renderer.domElement.setAttribute("aria-hidden", "true");
      stage.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      camera.position.set(8.2, 9.2, 11.6);
      camera.lookAt(0, 0.36, 0);

      scene.add(new THREE.HemisphereLight(0xfff8e9, 0x425045, 2.0));
      const keyLight = new THREE.DirectionalLight(0xfff0d9, 4.2);
      keyLight.position.set(-4.5, 9, 7);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -8;
      keyLight.shadow.camera.right = 8;
      keyLight.shadow.camera.top = 8;
      keyLight.shadow.camera.bottom = -8;
      keyLight.shadow.bias = -0.0004;
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xc5dfcc, 2.5);
      fillLight.position.set(6, 5, -5);
      scene.add(fillLight);
      const rimLight = new THREE.PointLight(0xd7b879, 35, 18, 2);
      rimLight.position.set(-5, 3, -3);
      scene.add(rimLight);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.ShadowMaterial({ opacity: 0.19 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.365;
      floor.receiveShadow = true;
      scene.add(floor);

      const board = new THREE.Group();
      board.rotation.y = -0.22;
      scene.add(board);

      const materials = {
        light: new THREE.MeshPhysicalMaterial({ color: 0xf0e6d3, roughness: 0.25, metalness: 0.16, clearcoat: 0.38, clearcoatRoughness: 0.25 }),
        dark: new THREE.MeshPhysicalMaterial({ color: 0x26372e, roughness: 0.23, metalness: 0.38, clearcoat: 0.55, clearcoatRoughness: 0.2 }),
        lightDetail: new THREE.MeshStandardMaterial({ color: 0xb58d55, roughness: 0.27, metalness: 0.66 }),
        darkDetail: new THREE.MeshStandardMaterial({ color: 0xc3a96e, roughness: 0.25, metalness: 0.7 }),
        lightShadow: new THREE.MeshStandardMaterial({ color: 0x88745b, roughness: 0.47, metalness: 0.08 }),
        darkShadow: new THREE.MeshStandardMaterial({ color: 0x122019, roughness: 0.4, metalness: 0.16 }),
        paleSquare: new THREE.MeshStandardMaterial({ color: 0xe5d8be, roughness: 0.58, metalness: 0.025 }),
        greenSquare: new THREE.MeshStandardMaterial({ color: 0x536c59, roughness: 0.54, metalness: 0.04 }),
        frame: new THREE.MeshStandardMaterial({ color: 0x25362d, roughness: 0.36, metalness: 0.22 }),
        trim: new THREE.MeshStandardMaterial({ color: 0x9a7748, roughness: 0.36, metalness: 0.52 }),
      };

      addBoard(THREE, board, {
        paleSquare: materials.paleSquare,
        greenSquare: materials.greenSquare,
        frame: materials.frame,
        trim: materials.trim,
      });
      populateBoard(THREE, board, materials);

      const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
      const onPointerMove = (event: PointerEvent) => {
        const bounds = stage.getBoundingClientRect();
        pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      };
      const onPointerLeave = () => {
        pointer.targetX = 0;
        pointer.targetY = 0;
      };
      stage.addEventListener("pointermove", onPointerMove, { passive: true });
      stage.addEventListener("pointerleave", onPointerLeave, { passive: true });

      const resize = () => {
        const width = Math.max(stage.clientWidth, 1);
        const height = Math.max(stage.clientHeight, 1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);
      resize();

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let animationFrame = 0;
      let hasRendered = false;
      const render = (time: number) => {
        if (!prefersReducedMotion) {
          pointer.x += (pointer.targetX - pointer.x) * 0.035;
          pointer.y += (pointer.targetY - pointer.y) * 0.035;
          board.rotation.y = -0.22 + Math.sin(time * 0.00017) * 0.035 + pointer.x * 0.045;
          board.rotation.x = pointer.y * -0.012;
        }
        renderer.render(scene, camera);
        if (!hasRendered && renderer.info.render.calls > 0) {
          hasRendered = true;
          stage.classList.remove("chess-stage--unavailable");
          stage.classList.add("chess-stage--ready");
        }
        animationFrame = window.requestAnimationFrame(render);
      };
      animationFrame = window.requestAnimationFrame(render);

      cleanup = () => {
        window.cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        stage.removeEventListener("pointermove", onPointerMove);
        stage.removeEventListener("pointerleave", onPointerLeave);
        disposeScene(scene);
        renderer.dispose();
        renderer.domElement.remove();
      };
    }).catch(() => {
      if (!cancelled) stage.classList.add("chess-stage--unavailable");
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="chess-stage" ref={stageRef} role="img" aria-label="A custom three-dimensional chessboard with sculpted ivory and forest-green chess pieces">
      <div className="chess-stage__ambient" aria-hidden="true" />
      <StageFallback />
      <div className="chess-stage__label chess-stage__label--top" aria-hidden="true">
        <span className="chess-stage__label-dot" />
        <span>THE BOARD, REIMAGINED</span>
      </div>
      <div className="chess-stage__label chess-stage__label--side" aria-hidden="true">
        <span className="chess-stage__label-rule" />
        <span>STOCKFISH 19<br />ON-DEVICE ENGINE</span>
      </div>
      <div className="chess-stage__index" aria-hidden="true">01 <span>/</span> 03</div>
      <div className="chess-stage__caption" aria-hidden="true">
        <span className="chess-stage__caption-mark">♞</span>
        <span><strong>Made for the long game</strong><small>Built to think with you.</small></span>
      </div>
    </div>
  );
}
