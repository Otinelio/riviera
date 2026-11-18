import React, { useEffect, useRef, useState, useCallback } from "react";
import { Plus, Minus, RotateCw, Maximize2, Minimize2, ArrowRight, Compass, Calendar, ChevronRight } from "lucide-react";
import { TOUR, type TourScene, type TourLink } from "@/data/tour360";
import { SectionHeading } from "./site/RoomsSection";

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

const dir = (yaw: number, pitch: number, THREE: any) =>
  new THREE.Vector3(
    Math.sin(yaw * D2R) * Math.cos(pitch * D2R),
    Math.sin(pitch * D2R),
    -Math.cos(yaw * D2R) * Math.cos(pitch * D2R)
  );

interface ProjectedHotspot {
  link: TourLink;
  x: number;
  y: number;
  visible: boolean;
}

export default function Tour360() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [currentSceneId, setCurrentSceneId] = useState<string>(TOUR[0].id);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fadeOpacity, setFadeOpacity] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [debugInfo, setDebugInfo] = useState<{ yaw: number; pitch: number; text: string } | null>(null);
  const [hotspots, setHotspots] = useState<ProjectedHotspot[]>([]);

  // Three.js instances ref
  const threeRef = useRef<{
    THREE: any;
    renderer: any;
    scene: any;
    camera: any;
    mesh: any;
    material: any;
    raycaster: any;
  } | null>(null);

  // Interaction & camera state refs (for 60fps animation loop)
  const stateRef = useRef({
    lon: TOUR[0].yaw0 || 0,
    lat: TOUR[0].pitch0 || 0,
    vlon: 0,
    vlat: 0,
    fov: 75,
    cibleFov: 75,
    autoRotate: false,
    drag: false,
    lastX: 0,
    lastY: 0,
    touchDist: 0,
    activePointers: new Map<number, { x: number; y: number }>(),
    hasInteracted: false,
    prefersReducedMotion: false,
    currentSceneId: TOUR[0].id,
    isTransitioning: false,
    textureCache: new Map<string, any>(),
    rafId: 0,
    isDebug: false,
  });

  const activeScene = TOUR.find((s) => s.id === currentSceneId) || TOUR[0];

  // Helper to load HTMLImageElement
  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  // Texture application helper
  const applyTexture = useCallback((img: HTMLImageElement) => {
    const tRefs = threeRef.current;
    if (!tRefs) return;
    const { THREE, renderer, material } = tRefs;

    const texture = new THREE.Texture(img);
    if (THREE.SRGBColorSpace) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
    const maxAniso = renderer.capabilities ? renderer.capabilities.getMaxAnisotropy() : 8;
    texture.anisotropy = Math.min(8, maxAniso);
    texture.needsUpdate = true;

    if (material.map) {
      material.map.dispose();
    }
    material.map = texture;
    material.needsUpdate = true;
  }, []);

  // Preload neighbor scene images
  const preloadNeighbors = useCallback(
    (scene: TourScene) => {
      scene.liens.forEach((l) => {
        const neighbor = TOUR.find((s) => s.id === l.vers);
        if (neighbor) {
          const img = new Image();
          img.src = neighbor.image;
        }
      });
    },
    []
  );

  // Transition to a given scene
  const goToScene = useCallback(
    async (nextSceneId: string) => {
      if (stateRef.current.isTransitioning) return;
      const targetScene = TOUR.find((s) => s.id === nextSceneId);
      if (!targetScene) return;

      stateRef.current.isTransitioning = true;
      setIsTransitioning(true);

      // Fade out and zoom in
      setFadeOpacity(1);
      stateRef.current.cibleFov = 38;

      // Preload next scene image
      let nextImg: HTMLImageElement | null = null;
      try {
        nextImg = await loadImage(targetScene.image);
      } catch {
        try {
          nextImg = await loadImage(targetScene.mini);
        } catch (e) {
          console.error("Failed to load scene image", e);
        }
      }

      setTimeout(() => {
        if (nextImg) {
          applyTexture(nextImg);
        }
        setCurrentSceneId(targetScene.id);
        stateRef.current.currentSceneId = targetScene.id;
        stateRef.current.lon = targetScene.yaw0 || 0;
        stateRef.current.lat = targetScene.pitch0 || 0;
        stateRef.current.vlon = 0;
        stateRef.current.vlat = 0;
        stateRef.current.fov = 105;
        stateRef.current.cibleFov = 75;

        // Fade in
        setFadeOpacity(0);
        preloadNeighbors(targetScene);

        setTimeout(() => {
          stateRef.current.isTransitioning = false;
          setIsTransitioning(false);
        }, 400);
      }, 520);
    },
    [applyTexture, loadImage, preloadNeighbors]
  );

  // Initialize Three.js dynamically when visible
  useEffect(() => {
    let isMounted = true;
    let observer: IntersectionObserver | null = null;

    // Check debug mode
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      stateRef.current.isDebug = params.get("debug360") === "1";
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      stateRef.current.prefersReducedMotion = mediaQuery.matches;
    }

    const initEngine = async () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || threeRef.current) return;

      let THREE: any;
      try {
        THREE = await import("three");
      } catch (err) {
        console.error("Failed to load Three.js", err);
        setWebGLSupported(false);
        return;
      }

      if (!isMounted) return;

      // Renderer setup
      let renderer: any;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch (e) {
        console.warn("WebGL not supported", e);
        setWebGLSupported(false);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 500;
      renderer.setSize(width, height, false);

      // Scene & Camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1100);

      // Sphere geometry scaled inwardly
      const geo = new THREE.SphereGeometry(500, 64, 40);
      geo.scale(-1, 1, 1);
      // Align yaw 0 with image center (0.5 U)
      geo.rotateY(-Math.PI / 2);

      const mat = new THREE.MeshBasicMaterial({ map: null });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      const raycaster = new THREE.Raycaster();

      threeRef.current = {
        THREE,
        renderer,
        scene,
        camera,
        mesh,
        material: mat,
        raycaster,
      };

      // Load initial scene: mini first, then full
      const initScene = TOUR[0];
      loadImage(initScene.mini)
        .then((miniImg) => {
          if (!isMounted) return;
          applyTexture(miniImg);
          return loadImage(initScene.image);
        })
        .then((fullImg) => {
          if (!isMounted || !fullImg) return;
          applyTexture(fullImg);
          preloadNeighbors(initScene);
        })
        .catch((e) => console.warn("Image load warning", e));

      // Animation frame loop
      const animate = () => {
        if (!isMounted) return;
        stateRef.current.rafId = requestAnimationFrame(animate);

        const s = stateRef.current;
        const curScene = TOUR.find((sc) => sc.id === s.currentSceneId) || TOUR[0];

        // Inertia
        if (!s.drag) {
          s.lon -= s.vlon;
          s.lat = Math.max(-85, Math.min(85, s.lat + s.vlat));
          s.vlon *= 0.92;
          s.vlat *= 0.92;
        }

        // Auto rotate
        if (s.autoRotate && !s.drag && !s.prefersReducedMotion) {
          s.lon += 0.12;
        }

        // Smooth FOV
        if (s.prefersReducedMotion) {
          s.fov = s.cibleFov;
        } else {
          s.fov += (s.cibleFov - s.fov) * 0.1;
        }
        camera.fov = s.fov;
        camera.updateProjectionMatrix();

        // Update camera direction
        const lookDir = dir(s.lon, s.lat, THREE);
        camera.lookAt(lookDir);
        camera.updateMatrixWorld();

        renderer.render(scene, camera);

        // Project hotspots in 3D
        const w = container.clientWidth;
        const h = container.clientHeight;
        const projected: ProjectedHotspot[] = curScene.liens.map((l) => {
          const p = dir(l.yaw, l.pitch, THREE).multiplyScalar(20);
          p.project(camera);

          // Visible if in front of camera (z < 1) and within 92% screen bounds
          const visible = p.z < 1 && Math.abs(p.x) < 0.92 && Math.abs(p.y) < 0.92;
          const x = (p.x * 0.5 + 0.5) * w;
          const y = (-p.y * 0.5 + 0.5) * h;

          return { link: l, x, y, visible };
        });

        setHotspots(projected);
      };

      stateRef.current.rafId = requestAnimationFrame(animate);
    };

    // IntersectionObserver to defer loading until near viewport
    const target = sectionRef.current;
    if (target && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            initEngine();
            observer?.disconnect();
          }
        },
        { rootMargin: "300px" }
      );
      observer.observe(target);
    } else {
      initEngine();
    }

    return () => {
      isMounted = false;
      observer?.disconnect();
      if (stateRef.current.rafId) {
        cancelAnimationFrame(stateRef.current.rafId);
      }
      if (threeRef.current) {
        const { renderer, material, mesh } = threeRef.current;
        material.map?.dispose();
        material.dispose();
        mesh.geometry.dispose();
        renderer.dispose();
        threeRef.current = null;
      }
    };
  }, [applyTexture, loadImage, preloadNeighbors]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const tRefs = threeRef.current;
      if (!container || !tRefs) return;
      const { renderer, camera } = tRefs;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
    };

    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", handleResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Pointer & Touch Controls
  const onPointerDown = (e: React.PointerEvent) => {
    if (stateRef.current.isTransitioning) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const s = stateRef.current;
    s.drag = true;
    s.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (s.activePointers.size === 1) {
      s.lastX = e.clientX;
      s.lastY = e.clientY;
    } else if (s.activePointers.size === 2) {
      const pts = Array.from(s.activePointers.values());
      s.touchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    }

    if (showHint) {
      setShowHint(false);
      s.hasInteracted = true;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s.drag) return;

    s.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const container = containerRef.current;
    if (!container) return;
    const h = container.clientHeight || 500;

    if (s.activePointers.size === 1) {
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.lastX = e.clientX;
      s.lastY = e.clientY;

      const k = s.fov / h;
      s.lon -= dx * k;
      s.lat = Math.max(-85, Math.min(85, s.lat + dy * k));
      s.vlon = dx * k;
      s.vlat = dy * k;
    } else if (s.activePointers.size === 2) {
      const pts = Array.from(s.activePointers.values());
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (s.touchDist > 0 && currentDist > 0) {
        const factor = s.touchDist / currentDist;
        s.cibleFov = Math.max(30, Math.min(100, s.cibleFov * factor));
        s.touchDist = currentDist;
      }
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const s = stateRef.current;
    s.activePointers.delete(e.pointerId);
    if (s.activePointers.size === 0) {
      s.drag = false;
    }
  };

  // Wheel zoom (prevents page scroll while cursor is in view)
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (showHint) setShowHint(false);
    const s = stateRef.current;
    s.cibleFov = Math.max(30, Math.min(100, s.cibleFov + e.deltaY * 0.04));
  };

  // Debug click handler to calibrate yaw & pitch
  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!stateRef.current.isDebug || !threeRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const { raycaster, camera } = threeRef.current;
    raycaster.setFromCamera({ x, y }, camera);
    const d = raycaster.ray.direction.clone().normalize();

    const pitch = Math.asin(Math.max(-1, Math.min(1, d.y))) * R2D;
    const yaw = Math.atan2(d.x, -d.z) * R2D;

    const roundedYaw = Math.round(yaw * 10) / 10;
    const roundedPitch = Math.round(pitch * 10) / 10;
    const snippet = `{ yaw: ${roundedYaw}, pitch: ${roundedPitch} }`;

    console.log(`[Tour360 Debug] Scene: ${currentSceneId} -> ${snippet}`);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(snippet);
    }
    setDebugInfo({ yaw: roundedYaw, pitch: roundedPitch, text: snippet });
  };

  // Toolbar actions
  const zoomIn = () => {
    if (showHint) setShowHint(false);
    stateRef.current.cibleFov = Math.max(30, stateRef.current.cibleFov - 10);
  };

  const zoomOut = () => {
    if (showHint) setShowHint(false);
    stateRef.current.cibleFov = Math.min(100, stateRef.current.cibleFov + 10);
  };

  const toggleAutoRotate = () => {
    if (showHint) setShowHint(false);
    const nextVal = !autoRotate;
    setAutoRotate(nextVal);
    stateRef.current.autoRotate = nextVal;
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request failed", err);
    }
  };

  return (
    <section id="visite-360" ref={sectionRef} className="py-24 bg-ivory relative">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="Visite immersive"
          title="Découvrez l'hôtel comme si vous y étiez"
          desc="Tournez à 360°, zoomez et déplacez-vous d'un espace à l'autre : plage, piscine, restaurants et jardins."
        />

        {/* Debug Banner if ?debug360=1 */}
        {stateRef.current.isDebug && (
          <div className="mt-4 p-3 rounded-xl bg-navy text-ivory text-xs flex flex-wrap items-center justify-between gap-2 border border-coral">
            <div>
              <span className="font-bold text-coral">MODE CALIBRAGE ACTIF :</span> Cliquez dans la sphère pour copier yaw/pitch.
            </div>
            {debugInfo && (
              <div className="font-mono bg-ivory/10 px-2 py-1 rounded text-sand">
                Dernier clic : yaw={debugInfo.yaw}°, pitch={debugInfo.pitch}° (copié dans le presse-papier !)
              </div>
            )}
          </div>
        )}

        {/* Main interactive area */}
        <div className="mt-12 flex flex-col lg:flex-row gap-8 items-stretch">
          {/* 3D Viewer Container */}
          <div
            ref={containerRef}
            className="relative flex-1 min-h-[440px] md:min-h-[560px] h-[65vh] max-h-[700px] rounded-3xl overflow-hidden shadow-elegant border border-border/60 bg-navy select-none"
            style={{ touchAction: "none" }}
          >
            {/* Canvas Three.js */}
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onWheel={onWheel}
              onClick={onCanvasClick}
              className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
              tabIndex={0}
              aria-label="Vue panoramique 360 interactive"
            />

            {/* Fallback if WebGL unsupported */}
            {!webGLSupported && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy text-ivory p-6 text-center">
                <img src={activeScene.mini} alt={activeScene.nom} className="w-full h-full object-cover opacity-60 absolute inset-0" />
                <div className="relative z-10 max-w-md bg-navy/90 backdrop-blur-md p-6 rounded-2xl border border-ivory/20">
                  <h3 className="font-display text-2xl text-sand mb-2">{activeScene.nom}</h3>
                  <p className="text-sm text-ivory/80 mb-4">{activeScene.texte}</p>
                  <p className="text-xs text-muted-foreground">La visite interactive 3D nécessite l'activation de WebGL dans votre navigateur.</p>
                </div>
              </div>
            )}

            {/* Floating Top Toolbar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1 p-1 rounded-full bg-navy/80 backdrop-blur-md border border-ivory/15 shadow-soft">
              <button
                type="button"
                onClick={zoomIn}
                aria-label="Zoomer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-ivory/90 hover:text-ivory hover:bg-ivory/15 transition-colors focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
              >
                <Plus size={15} />
              </button>
              <button
                type="button"
                onClick={zoomOut}
                aria-label="Dézoomer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-ivory/90 hover:text-ivory hover:bg-ivory/15 transition-colors focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
              >
                <Minus size={15} />
              </button>
              <div className="w-px h-4 bg-ivory/20 mx-0.5" />
              <button
                type="button"
                onClick={toggleAutoRotate}
                aria-label="Rotation automatique"
                aria-pressed={autoRotate}
                className={`px-3 h-8 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none ${
                  autoRotate ? "bg-ocean text-ivory shadow-soft" : "text-ivory/90 hover:bg-ivory/15"
                }`}
              >
                <RotateCw size={13} className={autoRotate ? "animate-spin" : ""} style={{ animationDuration: "8s" }} />
                <span>Rotation</span>
              </button>
              <div className="w-px h-4 bg-ivory/20 mx-0.5" />
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ivory/90 hover:text-ivory hover:bg-ivory/15 transition-colors focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
              >
                {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
            </div>

            {/* Current Scene Badge on top-right */}
            <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-navy/80 backdrop-blur-md border border-ivory/15 text-ivory text-xs font-medium flex items-center gap-2 shadow-soft">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
              <span>{activeScene.nom}</span>
            </div>

            {/* 3D Floating Navigation Hotspots */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              {hotspots.map((hs) => {
                if (!hs.visible || fadeOpacity > 0.3) return null;
                return (
                  <div
                    key={hs.link.vers}
                    className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
                    style={{ left: `${hs.x}px`, top: `${hs.y}px` }}
                  >
                    <button
                      type="button"
                      onClick={() => goToScene(hs.link.vers)}
                      aria-label={hs.link.label}
                      className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-ivory/95 hover:bg-ivory text-navy shadow-elegant backdrop-blur-md border border-ivory/40 hover:border-coral transition-all transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
                    >
                      <span className="w-6 h-6 rounded-full bg-coral text-ivory flex items-center justify-center transition-transform group-hover:translate-x-0.5 shadow-sm">
                        <ArrowRight size={13} />
                      </span>
                      <span className="text-xs font-medium tracking-wide text-navy whitespace-nowrap">{hs.link.label}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Hint pill on first appearance */}
            {showHint && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-2 rounded-full bg-navy/85 backdrop-blur-md text-ivory text-xs flex items-center gap-2 shadow-soft border border-ivory/15 animate-bounce">
                <Compass size={15} className="text-sand" />
                <span>Glissez pour regarder autour de vous</span>
              </div>
            )}

            {/* Transition Dark Fade Overlay */}
            <div
              className="absolute inset-0 bg-navy pointer-events-none transition-opacity duration-500 z-30"
              style={{ opacity: fadeOpacity }}
            />
          </div>

          {/* Side Info Panel */}
          <div className="w-full lg:w-80 xl:w-96 flex flex-col justify-between bg-card rounded-3xl p-6 md:p-8 border border-border shadow-soft">
            <div className="space-y-6">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-coral font-medium mb-1.5">Espace sélectionné</div>
                <h3 className="font-display text-3xl text-navy">{activeScene.nom}</h3>
                <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{activeScene.texte}</p>
              </div>

              {/* Tags / Chips */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
                {activeScene.etiquettes.map((chip) => (
                  <span
                    key={chip}
                    className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* Scene direct selector tabs */}
              <div className="pt-2 border-t border-border/60">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                  Tous les espaces ({TOUR.length})
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {TOUR.map((scene) => {
                    const isSelected = scene.id === currentSceneId;
                    return (
                      <button
                        key={scene.id}
                        type="button"
                        onClick={() => goToScene(scene.id)}
                        disabled={isTransitioning}
                        aria-pressed={isSelected}
                        className={`text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between border ${
                          isSelected
                            ? "bg-ocean text-ivory border-ocean shadow-sm font-medium"
                            : "bg-ivory/50 text-foreground border-border hover:border-ocean hover:bg-ivory"
                        }`}
                      >
                        <span className="truncate mr-1">{scene.nom}</span>
                        <ChevronRight size={12} className={isSelected ? "text-ivory" : "text-muted-foreground"} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CTA Book Button (matching existing site buttons) */}
            <div className="mt-8 pt-6 border-t border-border">
              <a
                href="#booking"
                className="w-full py-3.5 px-6 rounded-full bg-coral hover:bg-coral/95 text-ivory text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-soft flex items-center justify-center gap-2"
              >
                <Calendar size={16} />
                <span>Réserver mon séjour</span>
              </a>
              <div className="text-[11px] text-center text-muted-foreground mt-2">
                Tarif garanti • Réservation rapide via WhatsApp
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
