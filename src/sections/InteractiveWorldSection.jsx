import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { siteContent } from "../data/siteContent.js";
import { sectionFade, softReveal, viewportOnce } from "../styles/animations.js";

const collageImageModules = import.meta.glob("../assets/web/collage/*.jpg", {
  eager: true,
  import: "default",
});

const collageSources = Object.entries(collageImageModules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(([, src]) => src)
  .filter(Boolean);

const WORLD_LIMITS = {
  x: 8.4,
  y: 5.4,
};

const CAMERA_Z = {
  min: 3.4,
  max: 12,
  initial: 7.2,
};

function clampValue(value, limit) {
  return Math.min(Math.max(value, -limit), limit);
}

function clampRange(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function moveWorldTarget(travelRef, deltaX, deltaY) {
  const travel = travelRef.current;
  travel.targetX = clampValue(travel.targetX + deltaX, WORLD_LIMITS.x);
  travel.targetY = clampValue(travel.targetY + deltaY, WORLD_LIMITS.y);
}

function zoomWorldTarget(travelRef, deltaZ) {
  const travel = travelRef.current;
  travel.targetZ = clampRange(travel.targetZ + deltaZ, CAMERA_Z.min, CAMERA_Z.max);
}

const collageLayouts = [
  {
    position: [-1.05, 0.2, -1],
    rotation: [0.03, 0.1, -0.05],
    size: 2.05,
    opacity: 0.62,
    speed: 0.24,
  },
  {
    position: [2.65, 1.15, -1.45],
    rotation: [-0.04, -0.18, 0.05],
    size: 1.48,
    opacity: 0.52,
    speed: 0.2,
  },
  {
    position: [-3.25, -1.85, -1.7],
    rotation: [0.05, -0.12, -0.04],
    size: 1.35,
    opacity: 0.5,
    speed: 0.22,
  },
  {
    position: [5.15, 2.75, -2.25],
    rotation: [-0.03, 0.14, 0.08],
    size: 1.65,
    opacity: 0.42,
    speed: 0.19,
  },
  {
    position: [-5.75, 2.45, -2.55],
    rotation: [0.04, -0.1, 0.12],
    size: 1.5,
    opacity: 0.4,
    speed: 0.18,
  },
  {
    position: [7.75, -0.85, -2.9],
    rotation: [-0.06, -0.2, -0.1],
    size: 1.12,
    opacity: 0.34,
    speed: 0.17,
  },
  {
    position: [-8.25, -1.05, -3.05],
    rotation: [0.08, 0.22, 0.06],
    size: 1.04,
    opacity: 0.32,
    speed: 0.16,
  },
  {
    position: [0.75, 3.75, -3.2],
    rotation: [-0.05, 0.08, -0.12],
    size: 0.92,
    opacity: 0.28,
    speed: 0.15,
  },
  {
    position: [-1.3, -4.05, -3.35],
    rotation: [0.06, -0.18, 0.04],
    size: 0.94,
    opacity: 0.28,
    speed: 0.15,
  },
  {
    position: [4.15, -3.35, -3.6],
    rotation: [-0.07, 0.18, -0.04],
    size: 0.88,
    opacity: 0.25,
    speed: 0.14,
  },
  {
    position: [-4.85, -3.8, -3.9],
    rotation: [0.08, 0.06, -0.12],
    size: 0.78,
    opacity: 0.24,
    speed: 0.14,
  },
  {
    position: [9.65, 3.75, -4.25],
    rotation: [-0.05, -0.08, 0.14],
    size: 0.72,
    opacity: 0.2,
    speed: 0.12,
  },
  {
    position: [-10.1, 3.55, -4.35],
    rotation: [0.05, 0.18, 0.16],
    size: 0.72,
    opacity: 0.2,
    speed: 0.12,
  },
  {
    position: [11.25, 0.9, -4.7],
    rotation: [-0.04, -0.18, -0.16],
    size: 0.58,
    opacity: 0.18,
    speed: 0.11,
  },
  {
    position: [-11.45, -0.5, -4.75],
    rotation: [-0.03, 0.14, 0.08],
    size: 0.58,
    opacity: 0.18,
    speed: 0.11,
  },
  {
    position: [2.5, -5.35, -4.9],
    rotation: [0.04, -0.12, -0.08],
    size: 0.58,
    opacity: 0.17,
    speed: 0.11,
  },
  {
    position: [-2.35, 5.35, -5.05],
    rotation: [0.02, 0.08, 0.02],
    size: 0.56,
    opacity: 0.17,
    speed: 0.1,
  },
  {
    position: [6.85, 5.45, -5.25],
    rotation: [-0.02, -0.08, -0.02],
    size: 0.5,
    opacity: 0.15,
    speed: 0.09,
  },
  {
    position: [-7.15, -5.35, -5.35],
    rotation: [0.02, 0.16, -0.1],
    size: 0.5,
    opacity: 0.15,
    speed: 0.09,
  },
  {
    position: [0.15, -6.35, -5.7],
    rotation: [-0.02, -0.14, 0.1],
    size: 0.46,
    opacity: 0.13,
    speed: 0.08,
  },
  {
    position: [-0.65, 6.45, -5.8],
    rotation: [0.04, -0.12, 0.14],
    size: 0.46,
    opacity: 0.13,
    speed: 0.08,
  },
  {
    position: [12.25, -3.65, -6.05],
    rotation: [-0.05, 0.12, -0.16],
    size: 0.42,
    opacity: 0.11,
    speed: 0.07,
  },
  {
    position: [-12.55, -3.8, -6.15],
    rotation: [0.04, 0.08, -0.04],
    size: 0.42,
    opacity: 0.11,
    speed: 0.07,
  },
  {
    position: [3.65, 6.85, -6.45],
    rotation: [-0.04, -0.08, 0.04],
    size: 0.38,
    opacity: 0.1,
    speed: 0.06,
  },
  {
    position: [-3.85, -6.85, -6.55],
    rotation: [0.02, 0.1, 0.12],
    size: 0.38,
    opacity: 0.1,
    speed: 0.06,
  },
  {
    position: [8.85, -6.1, -7],
    rotation: [-0.02, -0.1, -0.12],
    size: 0.34,
    opacity: 0.09,
    speed: 0.055,
  },
  {
    position: [-9.05, 6.05, -7.1],
    rotation: [0.04, 0.16, -0.08],
    size: 0.34,
    opacity: 0.09,
    speed: 0.055,
  },
  {
    position: [0.55, -1.25, -5.2],
    rotation: [-0.04, -0.16, 0.08],
    size: 0.38,
    opacity: 0.13,
    speed: 0.06,
  },
];

const collageItems = collageSources.map((src, index) => {
  const layout = collageLayouts[index % collageLayouts.length];

  return {
    src,
    ...layout,
    phase: index * 0.72,
    floatX: 0.025 + (index % 5) * 0.008,
    floatY: 0.045 + (index % 4) * 0.01,
  };
});

class WebGLFallbackBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function CollagePlane({ item, texture }) {
  const meshRef = useRef(null);
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const width = aspect >= 1 ? item.size : item.size * aspect;
  const height = aspect >= 1 ? item.size / aspect : item.size;

  useFrame((state) => {
    if (!meshRef.current) {
      return;
    }

    const time = state.clock.elapsedTime;
    meshRef.current.position.x =
      item.position[0] + Math.sin(time * item.speed * 0.72 + item.phase) * item.floatX;
    meshRef.current.position.y =
      item.position[1] + Math.sin(time * item.speed + item.phase) * item.floatY;
    meshRef.current.rotation.z =
      item.rotation[2] + Math.sin(time * item.speed * 0.75 + item.phase) * 0.018;
  });

  return (
    <mesh ref={meshRef} position={item.position} rotation={item.rotation}>
      <planeGeometry args={[width, height, 1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={item.opacity}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function AbstractFragments() {
  const dots = useMemo(
    () => [
      [-3.35, -0.05, -1.1],
      [-1.2, 1.85, -1.8],
      [0.65, -1.75, -1.2],
      [3.1, 0.15, -1.6],
      [2.25, -0.85, -2.4],
    ],
    [],
  );

  return (
    <group>
      <Line
        points={[
          [-3.1, 0.45, -0.9],
          [-0.8, 0.86, -1.1],
          [1.2, 0.35, -1.2],
        ]}
        color="#f1eee7"
        transparent
        opacity={0.18}
        lineWidth={1}
      />
      <Line
        points={[
          [0.8, -1.35, -1.6],
          [2.85, -0.7, -1.7],
        ]}
        color="#f1eee7"
        transparent
        opacity={0.14}
        lineWidth={1}
      />
      {dots.map((position) => (
        <mesh key={position.join(",")} position={position}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#f1eee7" transparent opacity={0.42} />
        </mesh>
      ))}
    </group>
  );
}

function WorldScene({ shouldReduceMotion, travelRef }) {
  const groupRef = useRef(null);
  const textures = useTexture(collageItems.map((item) => item.src));
  const { camera, pointer } = useThree();

  useMemo(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
    });
  }, [textures]);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const time = state.clock.elapsedTime;
    const travel = travelRef.current;
    const travelEase = shouldReduceMotion ? 1 : 0.055;
    const zoomEase = shouldReduceMotion ? 1 : 0.08;
    const parallaxX = shouldReduceMotion ? 0 : pointer.x * 0.18;
    const parallaxY = shouldReduceMotion ? 0 : pointer.y * 0.12;
    const driftX = shouldReduceMotion ? 0 : Math.sin(time * 0.08) * 0.08;
    const driftY = shouldReduceMotion ? 0 : Math.cos(time * 0.1) * 0.05;

    travel.currentX += (travel.targetX - travel.currentX) * travelEase;
    travel.currentY += (travel.targetY - travel.currentY) * travelEase;
    travel.currentZ += (travel.targetZ - travel.currentZ) * zoomEase;

    groupRef.current.position.x = travel.currentX + parallaxX + driftX;
    groupRef.current.position.y = travel.currentY + parallaxY + driftY;
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.035);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      shouldReduceMotion ? 0 : pointer.y * 0.018,
      0.035,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      shouldReduceMotion ? 0 : pointer.x * 0.024,
      0.035,
    );

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, travel.currentX * -0.045, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, travel.currentY * -0.035, 0.035);
    camera.position.z = travel.currentZ;
    camera.lookAt(0, 0, -3.2);
  });

  return (
    <group ref={groupRef}>
      {collageItems.map((item, index) => (
        <CollagePlane item={item} texture={textures[index]} key={item.src} />
      ))}
      <AbstractFragments />
    </group>
  );
}

function WebGLFallback() {
  function handleImageError(event) {
    event.currentTarget.hidden = true;
  }

  return (
    <div className="world-webgl-fallback" aria-hidden="true">
      {collageItems.map((item) => {
        const [x, y, z] = item.position;
        const depthScale = THREE.MathUtils.mapLinear(z, -7.2, -1, 0.35, 1);

        return (
          <img
            src={item.src}
            alt=""
            key={item.src}
            className="fallback-image"
            loading="lazy"
            decoding="async"
            onError={handleImageError}
            style={{
              left: `${50 + x * 7}%`,
              top: `${50 - y * 8}%`,
              opacity: Math.max(item.opacity * 0.8, 0.08),
              transform: `translate(-50%, -50%) rotate(${item.rotation[2]}rad)`,
              width: `${Math.max(item.size * 190 * depthScale, 42)}px`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function InteractiveWorldSection({ isBlurred = false }) {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0, pointerId: null });
  const travelRef = useRef({
    targetX: 0,
    targetY: 0,
    targetZ: CAMERA_Z.initial,
    currentX: 0,
    currentY: 0,
    currentZ: CAMERA_Z.initial,
  });
  const [isDragging, setIsDragging] = useState(false);
  const isInView = useInView(sectionRef, { amount: 0.15 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame || isBlurred) {
      return undefined;
    }

    function handleWheel(event) {
      event.preventDefault();

      const deltaMultiplier =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? window.innerHeight
            : 1;
      const deltaY = clampValue(event.deltaY * deltaMultiplier, 220);
      zoomWorldTarget(travelRef, deltaY * 0.006);
    }

    frame.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      frame.removeEventListener("wheel", handleWheel);
    };
  }, [isBlurred]);

  function handlePointerDown(event) {
    if (isBlurred || event.button > 0) {
      return;
    }

    dragRef.current = {
      active: true,
      lastX: event.clientX,
      lastY: event.clientY,
      pointerId: event.pointerId,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsDragging(true);
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;

    if (!drag.active) {
      return;
    }

    event.preventDefault();

    const deltaX = event.clientX - drag.lastX;
    const deltaY = event.clientY - drag.lastY;

    drag.lastX = event.clientX;
    drag.lastY = event.clientY;

    moveWorldTarget(travelRef, deltaX * 0.011, -deltaY * 0.011);
  }

  function handlePointerUp(event) {
    if (!dragRef.current.active) {
      return;
    }

    event.currentTarget.releasePointerCapture?.(dragRef.current.pointerId);
    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    setIsDragging(false);
  }

  return (
    <motion.section
      ref={sectionRef}
      id="world"
      className={`site-section site-section--world world-section${
        isBlurred ? " world-section--blurred" : ""
      }`}
      tabIndex={-1}
      aria-label="Hidden Thoughts interactive world"
      aria-hidden={isBlurred}
      variants={sectionFade}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={viewportOnce}
    >
      <div
        ref={frameRef}
        className={`world-canvas-frame${isDragging ? " is-dragging" : ""}`}
        aria-hidden="true"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <WebGLFallbackBoundary fallback={<WebGLFallback />}>
          <Suspense fallback={<WebGLFallback />}>
            <Canvas
              camera={{ position: [0, 0, CAMERA_Z.initial], fov: 42, near: 0.1, far: 80 }}
              dpr={[1, 1.35]}
              frameloop={isInView && !isBlurred ? "always" : "demand"}
              gl={{
                alpha: true,
                antialias: false,
                powerPreference: "low-power",
              }}
            >
              <color attach="background" args={["#030303"]} />
              <WorldScene shouldReduceMotion={shouldReduceMotion} travelRef={travelRef} />
            </Canvas>
          </Suspense>
        </WebGLFallbackBoundary>
      </div>

      <div className="world-archive-labels" aria-hidden="true">
        <span>archive 01 / drag</span>
        <span>hidden thoughts / world</span>
        <span>scroll to zoom</span>
      </div>

      <motion.div
        className="section-content world-content"
        variants={softReveal}
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={viewportOnce}
      >
        <p className="section-kicker">{siteContent.brandName}</p>
        <p className="world-statement">{siteContent.headline}</p>
        <p className="section-copy world-copy">{siteContent.worldIntro}</p>
        <p className="world-instruction">drag to move / scroll to zoom</p>
      </motion.div>
    </motion.section>
  );
}
