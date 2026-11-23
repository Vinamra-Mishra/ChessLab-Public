"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function makePiece(kind: string, material: THREE.Material) {
  const group = new THREE.Group();
  const lathe = (points: [number, number][]) => {
    const profile = points.map(([x, y]) => new THREE.Vector2(x, y));
    const mesh = new THREE.Mesh(new THREE.LatheGeometry(profile, 32), material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  };
  const base: [number, number][] = [[0,.05],[.3,.05],[.34,.09],[.32,.14],[.25,.18],[.24,.23],[.18,.28]];
  const upper: [number, number][] = kind === "pawn"
    ? [[.17,.4],[.12,.49],[.17,.56],[.16,.62],[.1,.67],[0,.67]]
    : [[.18,.38],[.22,.44],[.2,.5],[.14,.56],[.17,.62],[.27,.68],[.3,.74],[.25,.8],[.14,.84],[0,.84]];
  lathe([...base, ...upper]);
  const add = (geometry: THREE.BufferGeometry, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  };
  if (kind === "king" || kind === "queen") {
    const y = kind === "king" ? .93 : .91;
    add(new THREE.SphereGeometry(.2, 20, 14), 0, y, 0);
    if (kind === "king") {
      add(new THREE.BoxGeometry(.07,.34,.07), 0, 1.2, 0);
      add(new THREE.BoxGeometry(.25,.065,.07), 0, 1.22, 0);
    } else {
      for (let i=0;i<5;i++) {
        const a = i*Math.PI*2/5;
        add(new THREE.SphereGeometry(.045, 12, 10), Math.cos(a)*.17, 1.11, Math.sin(a)*.17);
      }
    }
  }
  if (kind === "bishop") {
    add(new THREE.SphereGeometry(.17, 20, 14), 0, .94, 0);
    add(new THREE.ConeGeometry(.075,.19,12), 0, 1.13, 0);
  }
  if (kind === "rook") {
    add(new THREE.CylinderGeometry(.23,.22,.16,24), 0, .94, 0);
    for (let i=0;i<4;i++) {
      const a=i*Math.PI/2;
      add(new THREE.BoxGeometry(.1,.12,.1), Math.cos(a)*.17, 1.07, Math.sin(a)*.17);
    }
  }
  if (kind === "knight") {
    const silhouette = new THREE.Shape();
    silhouette.moveTo(-.19,.22); silhouette.lineTo(-.22,.45); silhouette.lineTo(-.1,.62);
    silhouette.lineTo(-.06,.93); silhouette.lineTo(.08,1.03); silhouette.lineTo(.11,.88);
    silhouette.lineTo(.29,.73); silhouette.lineTo(.19,.55); silhouette.lineTo(.1,.51);
    silhouette.lineTo(.2,.28); silhouette.closePath();
    const geometry = new THREE.ExtrudeGeometry(silhouette,{depth:.16,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035});
    geometry.translate(0,0,-.08);
    add(geometry,0,0,0);
    add(new THREE.SphereGeometry(.025,12,10), .03,.87,.09);
  }
  return group;
}

export default function ChessScene() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
    camera.position.set(8.6, 9.2, 11.2);
    camera.lookAt(0, .35, 0);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xe7f0d8,0x172119,2.0));
    const key = new THREE.DirectionalLight(0xfff4db,3.2);
    key.position.set(-4,9,6); key.castShadow=true; key.shadow.mapSize.set(1024,1024); scene.add(key);
    const rim = new THREE.PointLight(0xb1e868,20,18); rim.position.set(5,4,-4); scene.add(rim);
    const fill = new THREE.PointLight(0xffc77d,8,16); fill.position.set(-5,3,-2); scene.add(fill);

    const rig = new THREE.Group(); scene.add(rig);
    const wood = new THREE.MeshStandardMaterial({color:0x292d24,roughness:.29,metalness:.28});
    const boardBase = new THREE.Mesh(new THREE.BoxGeometry(8.4,.34,8.4),wood);
    boardBase.position.y=-.23; boardBase.receiveShadow=true; boardBase.castShadow=true; rig.add(boardBase);
    const pale = new THREE.MeshStandardMaterial({color:0xc3c6ae,roughness:.4,metalness:.04});
    const green = new THREE.MeshStandardMaterial({color:0x475b41,roughness:.38,metalness:.08});
    const tileGeo = new THREE.BoxGeometry(1,.055,1);
    for(let row=0;row<8;row++) for(let col=0;col<8;col++) {
      const tile = new THREE.Mesh(tileGeo,(row+col)%2===0?pale:green);
      tile.position.set(col-3.5,-.035,row-3.5); tile.receiveShadow=true; tile.castShadow=true; rig.add(tile);
    }
    // A mid-game position: each custom lathed piece is individually modeled in code.
    const setup: [number,number,string,boolean][] = [];
    const blackBack=["rook","knight","bishop","queen","king","bishop","knight","rook"];
    const whiteBack=["rook","knight","bishop","queen","king","bishop","knight","rook"];
    blackBack.forEach((p,x)=>setup.push([x,0,p,false]));
    [0,1,2,3,5,6,7].forEach(x=>setup.push([x,1,"pawn",false]));
    whiteBack.forEach((p,x)=>setup.push([x,7,p,true]));
    [0,1,2,3,4,5,6,7].forEach(x=>setup.push([x,6,"pawn",true]));
    setup.push([4,4,"knight",true],[3,3,"bishop",false],[5,4,"pawn",false],[2,5,"pawn",true]);
    const ivory=new THREE.MeshPhysicalMaterial({color:0xe8e3d0,roughness:.25,metalness:.08,clearcoat:.38});
    const dark=new THREE.MeshPhysicalMaterial({color:0x20251f,roughness:.22,metalness:.22,clearcoat:.45});
    setup.forEach(([x,z,kind,isWhite])=>{
      const piece=makePiece(kind,isWhite?ivory:dark);
      piece.position.set(x-3.5,.005,z-3.5);
      if(kind==="knight"&&!isWhite) piece.rotation.y=Math.PI;
      rig.add(piece);
    });
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.2}));
    floor.rotation.x=-Math.PI/2; floor.position.y=-.42; floor.receiveShadow=true; scene.add(floor);

    const pointer={x:0,y:0};
    const onMove=(event:PointerEvent)=>{const r=container.getBoundingClientRect();pointer.x=((event.clientX-r.left)/r.width-.5);pointer.y=((event.clientY-r.top)/r.height-.5)};
    container.addEventListener("pointermove",onMove);
    const resize=()=>{const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};
    const observer=new ResizeObserver(resize);observer.observe(container);resize();
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame=0;
    const render=(time:number)=>{frame=requestAnimationFrame(render);if(!reduced){rig.rotation.y=Math.sin(time*.0002)*.055+pointer.x*.045;rig.position.y=Math.sin(time*.0007)*.035;camera.position.x=8.6+pointer.x*.28;camera.position.y=9.2-pointer.y*.2;camera.lookAt(0,.35,0)}renderer.render(scene,camera)};
    frame=requestAnimationFrame(render);
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();container.removeEventListener("pointermove",onMove);rig.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose())}});renderer.dispose();renderer.domElement.remove()};
  },[]);
  return <div className="three-scene" ref={host} role="img" aria-label="A custom three-dimensional chessboard with carved ivory and ebony chess pieces"/>;
}
