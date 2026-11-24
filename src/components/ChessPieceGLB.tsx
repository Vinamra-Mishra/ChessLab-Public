"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { PieceKind } from "./Pieces";

export type PieceVariant = "black-king" | "white-queen";

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

export function ChessPieceGLB({
  kind,
  variant,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  kind: PieceKind;
  variant: PieceVariant;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(MODEL_PATHS[kind]);

  const { normalizedGroup, unitScale, geometries, material } = useMemo(() => {
    const wrapper = new THREE.Group();
    const geos: THREE.BufferGeometry[] = [];

    const mat =
      variant === "black-king"
        ? new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#050505"),
            metalness: 1,
            roughness: 0.12,
            clearcoat: 1,
            clearcoatRoughness: 0.03,
            envMapIntensity: 2,
          })
        : new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#e9e6ee"),
            metalness: 0.9,
            roughness: 0.1,
            clearcoat: 1,
            iridescence: 1,
            iridescenceIOR: 1.5,
            iridescenceThicknessRange: [200, 900],
            envMapIntensity: 2.5,
          });

    // Pick only the single primary mesh (exclude duplicate .001 sibling in GLB)
    let primary: THREE.Mesh | null = null;
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        if (!primary || (!obj.name.endsWith(".001") && primary.name.endsWith(".001"))) {
          primary = obj as THREE.Mesh;
        }
      }
    });

    if (primary) {
      const sourceMesh = primary as THREE.Mesh;
      const geo = sourceMesh.geometry.clone();
      if (geo.getAttribute("normal")) {
        geo.deleteAttribute("normal");
      }
      const welded = mergeVertices(geo, 1e-4);
      geo.dispose();
      welded.computeVertexNormals();
      geos.push(welded);

      const cleanMesh = new THREE.Mesh(welded, mat);
      cleanMesh.castShadow = true;
      cleanMesh.receiveShadow = true;
      // Preserve source orientation (e.g., if GLTF exporter rotated X/Y/Z) without translation or non-uniform scale
      cleanMesh.quaternion.copy(sourceMesh.quaternion);
      wrapper.add(cleanMesh);
    }

    wrapper.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(wrapper);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    wrapper.position.set(-center.x, -box.min.y, -center.z);
    const uniformScalar = 1 / (size.y || 1);

    return {
      normalizedGroup: wrapper,
      unitScale: uniformScalar,
      geometries: geos,
      material: mat,
    };
  }, [scene, variant]);

  useEffect(() => {
    return () => {
      for (const geo of geometries) geo.dispose();
      material.dispose();
    };
  }, [geometries, material]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group scale={unitScale}>
        <primitive object={normalizedGroup} />
      </group>
    </group>
  );
}
