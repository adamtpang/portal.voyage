"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ScoredCity } from "@/lib/types";
import { latLngToVector3 } from "@/lib/geo";

// Earth is the open world — a dot-matrix globe, not a texture. Keeps it
// fast (no image asset) and on-brand with the rest of the site's flat,
// mono/brutalist visual language.

const GLOBE_RADIUS = 2;
const MARKER_RADIUS = 0.028;

// Matches the --pv-* spectrum in app/globals.css / the fit bands used by
// city-card.tsx's fitColor() — same thresholds, hex instead of CSS vars
// since WebGL materials need real color values.
function fitHexColor(fit: number): number {
  if (fit >= 75) return 0x16a34a; // --pv-green
  if (fit >= 60) return 0x06b6d4; // --pv-cyan
  if (fit >= 45) return 0xeab308; // --pv-gold
  return 0x71717a; // muted
}

// Evenly-distributed points on a sphere (golden-angle spiral) for the base
// globe's dot matrix — no earth texture/asset needed.
function fibonacciSpherePoints(count: number, radius: number): Float32Array {
  const points = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points[i * 3] = Math.cos(theta) * r * radius;
    points[i * 3 + 1] = y * radius;
    points[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return points;
}

export function WorldGlobe({
  scored,
  onSelect,
}: {
  scored: ScoredCity[];
  onSelect: (slug: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<THREE.Group | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // One-time scene/camera/renderer/controls setup. Deliberately has no
  // dependency on `scored` or `onSelect` — rebuilding those shouldn't tear
  // down the scene (that would reset rotation and cause visible flicker
  // every time the user moves a weight slider).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    renderer.domElement.style.cursor = "grab";

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 3.2;
    controls.maxDistance = 8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    // Base dot-matrix globe.
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(fibonacciSpherePoints(1400, GLOBE_RADIUS), 3)
    );
    const dotMat = new THREE.PointsMaterial({
      color: 0x71717a,
      size: 0.02,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
    });
    const dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    // Faint solid core so the globe reads as a sphere, not a hollow shell.
    const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.985, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0b });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    const markers = new THREE.Group();
    markersRef.current = markers;
    scene.add(markers);

    // Click-to-select a city, without hijacking drag-to-rotate: only fires
    // when pointerup lands within a few px of pointerdown.
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downAt: { x: number; y: number } | null = null;

    function onPointerDown(e: PointerEvent) {
      downAt = { x: e.clientX, y: e.clientY };
    }
    function onPointerUp(e: PointerEvent) {
      if (!downAt) return;
      const dragged = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 4;
      downAt = null;
      if (dragged) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(markers.children, false)[0];
      const slug = hit?.object.userData.slug as string | undefined;
      if (slug) onSelectRef.current(slug);
    }
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    let frameId: number;
    function animate() {
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    function resize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    // Belt-and-suspenders sizing: an eager call can read a stale/default
    // width if the browser hasn't finished layout for a percentage-width
    // (w-full) container yet at this point in the mount effect; relying
    // solely on ResizeObserver's initial-fire-on-observe assumed it would
    // always self-correct, but that didn't hold up in testing (confirmed
    // via a temporary debug log: resize() was never called at all in some
    // environments). So: call it immediately, again next frame (once
    // layout has definitely settled), and keep the observer for any size
    // changes after that (sidebar collapse, window resize, etc).
    resize();
    requestAnimationFrame(resize);
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      controls.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      for (const m of markers.children) {
        const mesh = m as THREE.Mesh;
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      markersRef.current = null;
    };
  }, []);

  // Rebuild just the marker meshes whenever fit scores change (slider
  // moves, constraints change) — cheap, and doesn't touch the scene setup
  // above, so rotation/zoom state is never reset mid-interaction.
  useEffect(() => {
    const markers = markersRef.current;
    if (!markers) return;

    while (markers.children.length) {
      const m = markers.children.pop()!;
      const mesh = m as THREE.Mesh;
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    }

    const topSlug = scored.find((s) => !s.excluded)?.city.slug;
    for (const s of scored) {
      const [x, y, z] = latLngToVector3(s.city.lat, s.city.lng, GLOBE_RADIUS * 1.01);
      const isTop = s.city.slug === topSlug;
      const geo = new THREE.SphereGeometry(isTop ? MARKER_RADIUS * 1.8 : MARKER_RADIUS, 12, 12);
      const mat = new THREE.MeshBasicMaterial({
        color: s.excluded ? 0x3f3f46 : fitHexColor(s.fit),
        transparent: s.excluded,
        opacity: s.excluded ? 0.35 : 1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.userData.slug = s.city.slug;
      markers.add(mesh);
    }
  }, [scored]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl border border-border overflow-hidden bg-card"
      style={{ height: 320, touchAction: "none" }}
      role="img"
      aria-label="Interactive 3D globe of ranked cities — drag to rotate, click a marker for details"
    />
  );
}
