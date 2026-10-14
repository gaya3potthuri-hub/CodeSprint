import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  IslandWorldNode, 
  LearningPathId, 
  ProgrammingIslandId, 
  CameraMode, 
  WorldViewMode 
} from '../../types';
import { ISLAND_CONFIG, ISLAND_NODES } from '../../services/islandNodes';
import { VillageProgressService } from '../../services/villageProgressService';
import { soundFx } from '../../services/soundFx';
import { World2DFallback } from './World2DFallback';
import { Lock, Star, Sparkles, Compass } from 'lucide-react';

export interface WorldCanvasProps {
  currentIsland?: LearningPathId | ProgrammingIslandId;
  completedIds?: string[];
  cameraMode?: CameraMode;
  viewMode?: WorldViewMode;
  onInteract?: (node: IslandWorldNode) => void;
  onSelectIsland: (islandId: ProgrammingIslandId) => void;
  movementInput?: { x: number; y: number; isJumping: boolean };
  isSprinting?: boolean;
  theme?: 'dark' | 'light';
}

export const ISLAND_CENTERS: Record<ProgrammingIslandId, { x: number; z: number; name: string; area: string; color: number; highlight: string }> = {
  python: { x: -55, z: -35, name: 'PYTHON ISLE', area: '45.2 km²', color: 0x22c55e, highlight: '#22C55E' },
  java: { x: 55, z: -35, name: 'JAVA FOUNDRY', area: '41.8 km²', color: 0xea580c, highlight: '#EA580C' },
  sql: { x: -55, z: 35, name: 'SQL ARCHIPELAGO', area: '38.4 km²', color: 0x0284c7, highlight: '#38BDF8' },
  ai: { x: 55, z: 35, name: 'AI SANCTUARY', area: '50.0 km²', color: 0x9333ea, highlight: '#C084FC' }
};

const islandKeys: ProgrammingIslandId[] = ['python', 'java', 'sql', 'ai'];

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  currentIsland = 'python',
  completedIds = [],
  cameraMode = 'third-person',
  viewMode = 'orbital-map',
  onInteract,
  onSelectIsland,
  movementInput,
  isSprinting = false,
  theme = 'light'
}) => {
  // WebGL support fallback check
  const [webglSupported] = useState<boolean>(() => isWebGLAvailable());

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const islandGroupsRef = useRef<Record<string, THREE.Group>>({});
  const hoveredIslandRef = useRef<ProgrammingIslandId | null>(null);

  const [hoveredIsland, setHoveredIsland] = useState<ProgrammingIslandId | null>(null);
  const [nearbyNode, setNearbyNode] = useState<IslandWorldNode | null>(null);
  const [speedKmh, setSpeedKmh] = useState(0);

  // Keep latest mutable props in refs to avoid re-triggering Three.js mount/teardown
  const onSelectIslandRef = useRef(onSelectIsland);
  onSelectIslandRef.current = onSelectIsland;

  const onInteractRef = useRef(onInteract);
  onInteractRef.current = onInteract;

  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;

  const cameraModeRef = useRef(cameraMode);
  cameraModeRef.current = cameraMode;

  const movementInputRef = useRef(movementInput);
  movementInputRef.current = movementInput;

  const isSprintingRef = useRef(isSprinting);
  isSprintingRef.current = isSprinting;

  const activeIslandKey: ProgrammingIslandId = 
    (currentIsland === 'web-dev' ? 'python' : currentIsland) as ProgrammingIslandId || 'python';
  const activeIslandRef = useRef<ProgrammingIslandId>(activeIslandKey);
  activeIslandRef.current = activeIslandKey;

  const initialCenter = ISLAND_CENTERS[activeIslandKey] || ISLAND_CENTERS.python;

  const physics = useRef({
    x: initialCenter.x,
    y: 4.0,
    z: initialCenter.z + 8,
    vx: 0,
    vy: 0,
    vz: 0,
    yaw: 0,
    pitch: 0,
    targetYaw: 0,
    targetPitch: 0,
    isGrounded: true
  });

  const mouseDrag = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    startTime: 0
  });

  // Accurate terrain height function
  const getTerrainHeight = useCallback((worldX: number, worldZ: number, islandId: ProgrammingIslandId): number => {
    const center = ISLAND_CENTERS[islandId] || ISLAND_CENTERS.python;
    const lx = worldX - center.x;
    const lz = worldZ - center.z;
    const dist = Math.sqrt(lx * lx + lz * lz);
    const islandRadius = 32;

    if (dist > islandRadius) {
      const falloff = (dist - islandRadius) * 0.6;
      return Math.max(-10, 0.5 - falloff);
    }
    const wave1 = Math.sin(lx * 0.12) * Math.cos(lz * 0.12) * 0.6;
    const plateau = Math.max(0, 1 - (dist / islandRadius)) * 0.8;
    return 1.2 + wave1 + plateau;
  }, []);

  // Main Three.js Scene Lifecycle (Mounts once, updates dynamically without teardown)
  useEffect(() => {
    if (!webglSupported || !containerRef.current) return;
    const container = containerRef.current;

    // Guaranteed non-zero container dimensions
    const getDims = () => {
      const w = container.clientWidth || window.innerWidth || 800;
      const h = container.clientHeight || Math.max(500, window.innerHeight - 64);
      return { width: Math.max(w, 320), height: Math.max(h, 240) };
    };

    const { width, height } = getDims();

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const isDarkMode = theme === 'dark';
    scene.background = new THREE.Color(isDarkMode ? 0x0B132B : 0x67D2F9);
    scene.fog = new THREE.FogExp2(isDarkMode ? 0x0B132B : 0x67D2F9, 0.004);

    // 2. Camera with safe aspect ratio
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 1000);
    camera.position.set(0, 115, 140);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and soft shadow map
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false
      });
    } catch (err) {
      console.error('Failed to create WebGLRenderer:', err);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const hemiLight = new THREE.HemisphereLight(
      isDarkMode ? 0x93C5FD : 0xFFFFFF,
      isDarkMode ? 0x0F172A : 0x38BDF8,
      1.1
    );
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xFFFBEB, 1.6);
    dirLight.position.set(70, 120, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 350;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    dirLight.shadow.camera.top = 120;
    dirLight.shadow.camera.bottom = -120;
    scene.add(dirLight);

    // 5. Stylized Ocean Ground Plane with gentle wave effect
    const waterGeo = new THREE.PlaneGeometry(600, 600, 32, 32);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x101D42 : 0x38BDF8,
      roughness: 0.15,
      metalness: 0.2,
      flatShading: true
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = -14;
    waterMesh.receiveShadow = true;
    scene.add(waterMesh);

    // 6. Build the 4 Floating Islands
    const islandGroups: Record<string, THREE.Group> = {};
    const islandRadius = 32;

    islandKeys.forEach((key) => {
      const cfg = ISLAND_CONFIG[key];
      const center = ISLAND_CENTERS[key];
      const islandGroup = new THREE.Group();
      islandGroup.position.set(center.x, 0, center.z);
      islandGroup.name = `island_${key}`;

      // Island Grassy Upper Plateau
      const topGeo = new THREE.CylinderGeometry(islandRadius, islandRadius + 2, 4.5, 36);
      const topMat = new THREE.MeshStandardMaterial({
        color: center.color,
        roughness: 0.65,
        metalness: 0.1,
        flatShading: true
      });
      const topMesh = new THREE.Mesh(topGeo, topMat);
      topMesh.position.y = 2.25;
      topMesh.castShadow = true;
      topMesh.receiveShadow = true;
      topMesh.name = `terrain_${key}`;
      islandGroup.add(topMesh);

      // Rocky Under-Skirting (Inverted Tapered Mountain Cone)
      const skirtGeo = new THREE.ConeGeometry(islandRadius + 2, 18, 28);
      skirtGeo.rotateX(Math.PI);
      const skirtMat = new THREE.MeshStandardMaterial({
        color: isDarkMode ? 0x1E293B : (cfg?.rockColor || 0x64748B),
        roughness: 0.9,
        metalness: 0.05,
        flatShading: true
      });
      const skirt = new THREE.Mesh(skirtGeo, skirtMat);
      skirt.position.y = -9;
      skirt.castShadow = true;
      skirt.receiveShadow = true;
      islandGroup.add(skirt);

      // Distinct Thematic Monument per island
      if (key === 'python') {
        // Emerald Obelisk & Forest Foliage
        const obeliskGeo = new THREE.BoxGeometry(4.5, 12, 4.5);
        const obeliskMat = new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.3 });
        const obelisk = new THREE.Mesh(obeliskGeo, obeliskMat);
        obelisk.position.set(0, 10, 0);
        obelisk.castShadow = true;
        islandGroup.add(obelisk);

        // Surrounding Trees
        for (let t = 0; t < 6; t++) {
          const angle = (t / 6) * Math.PI * 2;
          const trGeo = new THREE.DodecahedronGeometry(2.8, 1);
          const trMat = new THREE.MeshStandardMaterial({ color: 0x22C55E });
          const tr = new THREE.Mesh(trGeo, trMat);
          tr.position.set(Math.cos(angle) * 16, 6, Math.sin(angle) * 16);
          tr.castShadow = true;
          islandGroup.add(tr);
        }
      } else if (key === 'java') {
        // Coral Fortress Keep & Turrets
        const keepGeo = new THREE.BoxGeometry(10, 10, 10);
        const keepMat = new THREE.MeshStandardMaterial({ color: 0xC2410C });
        const keep = new THREE.Mesh(keepGeo, keepMat);
        keep.position.set(0, 9, 0);
        keep.castShadow = true;
        islandGroup.add(keep);

        // Turret Roof
        const roofGeo = new THREE.ConeGeometry(6.5, 6, 4);
        roofGeo.rotateY(Math.PI / 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0xFBBF24 });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.set(0, 17, 0);
        islandGroup.add(roof);
      } else if (key === 'sql') {
        // Cyan Data Columns
        for (let c = 0; c < 3; c++) {
          const colGeo = new THREE.CylinderGeometry(2.5, 2.5, 8 + c * 3, 16);
          const colMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.3 });
          const col = new THREE.Mesh(colGeo, colMat);
          col.position.set((c - 1) * 7, 7 + c * 1.5, 0);
          col.castShadow = true;
          islandGroup.add(col);
        }
      } else if (key === 'ai') {
        // Purple Neural Crystal Octahedron Spire
        const spireGeo = new THREE.OctahedronGeometry(5, 0);
        const spireMat = new THREE.MeshStandardMaterial({
          color: 0xA855F7,
          emissive: 0x7E22CE,
          emissiveIntensity: 0.4,
          roughness: 0.2
        });
        const spire = new THREE.Mesh(spireGeo, spireMat);
        spire.position.set(0, 11, 0);
        spire.name = 'ai_spire';
        islandGroup.add(spire);
      }

      // Overhead Floating Holographic Beacon Marker
      const markerGroup = new THREE.Group();
      markerGroup.position.set(0, 24, 0);
      markerGroup.name = 'island_marker';

      const ringGeo = new THREE.TorusGeometry(6, 0.35, 8, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: center.highlight,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      markerGroup.add(ring);

      const beaconGeo = new THREE.OctahedronGeometry(1.6, 0);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: center.highlight,
        emissive: center.highlight,
        emissiveIntensity: 0.8,
        roughness: 0.1
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 2.0;
      beacon.name = 'beacon_gem';
      markerGroup.add(beacon);

      islandGroup.add(markerGroup);
      scene.add(islandGroup);
      islandGroups[key] = islandGroup;
    });

    islandGroupsRef.current = islandGroups;

    // 7. Glowing Energy Bridges Connecting the 4 Isles in a Quad Ring
    const bridgeConnections: [typeof ISLAND_CENTERS.python, typeof ISLAND_CENTERS.python][] = [
      [ISLAND_CENTERS.python, ISLAND_CENTERS.java],
      [ISLAND_CENTERS.java, ISLAND_CENTERS.ai],
      [ISLAND_CENTERS.ai, ISLAND_CENTERS.sql],
      [ISLAND_CENTERS.sql, ISLAND_CENTERS.python]
    ];

    bridgeConnections.forEach(([p1, p2]) => {
      const v1 = new THREE.Vector3(p1.x, 2, p1.z);
      const v2 = new THREE.Vector3(p2.x, 2, p2.z);
      const dist = v1.distanceTo(v2);

      const bridgeGeo = new THREE.BoxGeometry(2.5, 0.4, dist);
      const bridgeMat = new THREE.MeshStandardMaterial({
        color: 0x38BDF8,
        emissive: 0x0284C7,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.85
      });
      const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);

      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      bridge.position.copy(mid);
      bridge.lookAt(v2);
      scene.add(bridge);
    });

    // 8. Fluffy Drifting 3D Cloud Puffs
    const cloudGeo = new THREE.DodecahedronGeometry(6, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.95,
      transparent: true,
      opacity: isDarkMode ? 0.35 : 0.85
    });
    const clouds: THREE.Mesh[] = [];
    for (let c = 0; c < 8; c++) {
      const cl = new THREE.Mesh(cloudGeo, cloudMat);
      const angle = (c / 8) * Math.PI * 2;
      cl.position.set(Math.cos(angle) * 110, 35 + (c % 3) * 6, Math.sin(angle) * 110);
      cl.scale.set(1.8 + (c % 2) * 0.8, 0.7, 1.2 + (c % 2) * 0.5);
      scene.add(cl);
      clouds.push(cl);
    }

    // 9. Resize Handling using ResizeObserver and Window fallback
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const { width: nw, height: nh } = getDims();
      if (nw <= 0 || nh <= 0) return;
      cameraRef.current.aspect = nw / nh;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // 10. Raycaster & Pointer Interaction (Clicking islands to enter)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      mouseDrag.current = {
        isDown: true,
        startX: e.clientX,
        startY: e.clientY,
        startTime: performance.now()
      };
    };

    const handlePointerUp = (e: MouseEvent) => {
      const dt = performance.now() - mouseDrag.current.startTime;
      const dx = Math.abs(e.clientX - mouseDrag.current.startX);
      const dy = Math.abs(e.clientY - mouseDrag.current.startY);
      mouseDrag.current.isDown = false;

      // If dragged more than 8 pixels or held for a long orbit drag, ignore click
      if (dx > 8 || dy > 8 || dt > 600) return;

      if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);

      const targetMeshes: THREE.Object3D[] = [];
      islandKeys.forEach((k) => {
        const grp = islandGroupsRef.current[k];
        if (grp) targetMeshes.push(grp);
      });

      const intersects = raycaster.intersectObjects(targetMeshes, true);
      if (intersects.length > 0) {
        let hit: THREE.Object3D | null = intersects[0].object;
        while (hit && hit.parent && !hit.name.startsWith('island_')) {
          hit = hit.parent;
        }
        if (hit && hit.name.startsWith('island_')) {
          const islandId = hit.name.replace('island_', '') as ProgrammingIslandId;
          if (islandKeys.includes(islandId)) {
            soundFx.warpDrive();
            onSelectIslandRef.current(islandId);
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Orbit drag controls when mouse is down
      if (mouseDrag.current.isDown) {
        const deltaX = e.clientX - mouseDrag.current.startX;
        const deltaY = e.clientY - mouseDrag.current.startY;
        mouseDrag.current.startX = e.clientX;
        mouseDrag.current.startY = e.clientY;

        physics.current.yaw += deltaX * 0.006;
        physics.current.pitch = Math.max(-0.4, Math.min(0.55, physics.current.pitch + deltaY * 0.005));
        return;
      }

      // Hover Raycasting for interactive pointer feedback
      if (!containerRef.current || !cameraRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const targetMeshes: THREE.Object3D[] = [];
      islandKeys.forEach((k) => {
        const grp = islandGroupsRef.current[k];
        if (grp) targetMeshes.push(grp);
      });

      const intersects = raycaster.intersectObjects(targetMeshes, true);
      if (intersects.length > 0) {
        let hit: THREE.Object3D | null = intersects[0].object;
        while (hit && hit.parent && !hit.name.startsWith('island_')) {
          hit = hit.parent;
        }
        if (hit && hit.name.startsWith('island_')) {
          const islandId = hit.name.replace('island_', '') as ProgrammingIslandId;
          hoveredIslandRef.current = islandId;
          setHoveredIsland(islandId);
          containerRef.current.style.cursor = 'pointer';
          return;
        }
      }

      if (hoveredIslandRef.current !== null) {
        hoveredIslandRef.current = null;
        setHoveredIsland(null);
      }
      containerRef.current.style.cursor = viewModeRef.current === 'orbital-map' ? 'grab' : 'default';
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('mousemove', handleMouseMove);

    // 11. Main Animation Game Loop (Guarded against disposed renderer/camera)
    let animationFrameId: number;

    const animate = (time: number) => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      animationFrameId = requestAnimationFrame(animate);

      const sec = time * 0.001;

      // Bobbing floating animation for each island group
      islandKeys.forEach((key, idx) => {
        const grp = islandGroupsRef.current[key];
        if (grp) {
          const offset = idx * 1.5;
          grp.position.y = Math.sin(sec * 1.8 + offset) * 1.2;

          // Rotate overhead beacon gem
          const beacon = grp.getObjectByName('beacon_gem');
          if (beacon) {
            beacon.rotation.y += 0.03;
          }
        }
      });

      // Drifting clouds
      clouds.forEach((cl, i) => {
        cl.rotation.y = sec * 0.05 + i;
        cl.position.x += Math.sin(sec * 0.4 + i) * 0.05;
      });

      // Gentle water ripple
      waterMesh.position.y = -14 + Math.sin(sec * 1.2) * 0.35;

      // Camera Positioning depending on view mode
      if (viewModeRef.current === 'orbital-map') {
        const radius = 180;
        const currentYaw = physics.current.yaw + sec * 0.06;
        const pitchAngle = 0.52 + physics.current.pitch * 0.4;
        camera.position.x = Math.sin(currentYaw) * radius * Math.cos(pitchAngle);
        camera.position.z = Math.cos(currentYaw) * radius * Math.cos(pitchAngle);
        camera.position.y = Math.sin(pitchAngle) * radius + 30;
        camera.lookAt(0, 0, 0);
      } else {
        // Targeted Island Focus
        const center = ISLAND_CENTERS[activeIslandRef.current] || ISLAND_CENTERS.python;
        const targetPos = new THREE.Vector3(center.x, 8, center.z);
        const camYaw = physics.current.yaw;
        const dist = 55;
        camera.position.x = center.x + Math.sin(camYaw) * dist;
        camera.position.z = center.z + Math.cos(camYaw) * dist;
        camera.position.y = 35 + physics.current.pitch * 20;
        camera.lookAt(targetPos);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 12. Cleanup on Unmount (Strict Mode Safe)
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('mousemove', handleMouseMove);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current = null;
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
        sceneRef.current = null;
      }
      cameraRef.current = null;
    };
  }, [theme, webglSupported]);

  // If WebGL is not supported, immediately render 2D Fallback Map
  if (!webglSupported) {
    return (
      <World2DFallback
        onSelectIsland={onSelectIsland}
        theme={theme}
        errorMessage="WebGL hardware acceleration unavailable"
      />
    );
  }

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)] select-none overflow-hidden bg-gradient-to-b from-[#67D2F9] to-[#0EA5E9] dark:from-[#0B132B] dark:to-[#1C2E5E]">
      
      {/* Three.js Canvas Container with Explicit Sizing */}
      <div
        ref={containerRef}
        className="w-full h-full min-h-[calc(100vh-4rem)] relative block cursor-grab active:cursor-grabbing"
        style={{ minHeight: 'calc(100vh - 4rem)', width: '100%', height: '100%' }}
      />

      {/* 4 Interactive Floating Island HUD Cards (Matching theme.png) */}
      <div className="absolute bottom-6 inset-x-0 z-20 pointer-events-none flex justify-center px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl w-full pointer-events-auto">
          {islandKeys.map((key) => {
            const island = VillageProgressService.getIsland(key);
            const stats = VillageProgressService.getIslandStats(key);
            const isHovered = hoveredIsland === key;
            const isSelected = activeIslandKey === key;
            const isMastered = stats.progressPercent === 100 && stats.totalCount > 0;

            const badgeBg = {
              python: 'bg-green-700 hover:bg-green-600 border-green-300',
              java: 'bg-orange-700 hover:bg-orange-600 border-orange-300',
              sql: 'bg-sky-700 hover:bg-sky-600 border-sky-300',
              ai: 'bg-purple-700 hover:bg-purple-600 border-purple-300'
            }[key];

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (island?.isLocked) {
                    soundFx.errorDeflect();
                    return;
                  }
                  soundFx.warpDrive();
                  onSelectIsland(key);
                }}
                className={`flex flex-col p-3 rounded-2xl border-2 text-white shadow-lg transition-all duration-200 cursor-pointer text-left ${badgeBg} ${
                  isHovered || isSelected ? 'scale-105 shadow-xl ring-2 ring-white' : 'opacity-95'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-heading font-black text-sm tracking-wide">
                    {island?.name || key.toUpperCase()}
                  </span>
                  {island?.isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-red-300" />
                  ) : isMastered ? (
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  ) : null}
                </div>

                <div className="text-[10px] font-sans font-bold opacity-90">
                  {stats.completedCount}/{stats.totalCount} Villages · {stats.progressPercent}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating 3D Navigation Hint Pill (Center Top) */}
      <aside aria-label="Controls Overview" className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="px-4 py-1.5 rounded-full bg-card/90 dark:bg-card/90 border-2 border-border shadow-sm text-xs font-bold font-sans text-navy dark:text-white backdrop-blur-md flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-purple animate-spin" />
          <span>Click any 3D island or badge to enter · Drag to rotate world</span>
        </div>
      </aside>
    </div>
  );
};
