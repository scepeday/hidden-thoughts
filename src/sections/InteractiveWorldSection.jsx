import { Component, Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion, useInView } from "framer-motion";
import { siteContent } from "../data/siteContent.js";

const collageImageModules = import.meta.glob("../assets/web/collage/*.jpg", {
  eager: true,
  import: "default",
});

const collageSources = Object.entries(collageImageModules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(([, src]) => src);

const collageLayouts = [
  {
    position: [-2.9, 1.25, -1.2],
    rotation: [0.08, 0.12, -0.08],
    scale: [1.05, 1.55, 1],
    opacity: 0.58,
    speed: 0.42,
  },
  {
    position: [2.45, 1.05, -1.9],
    rotation: [-0.05, -0.18, 0.06],
    scale: [1.75, 1.16, 1],
    opacity: 0.54,
    speed: 0.34,
  },
  {
    position: [1.45, -1.45, -1.35],
    rotation: [0.05, -0.1, -0.05],
    scale: [1.45, 0.96, 1],
    opacity: 0.5,
    speed: 0.3,
  },
  {
    position: [-2.05, -1.25, -2.1],
    rotation: [-0.03, 0.16, 0.08],
    scale: [1.35, 0.9, 1],
    opacity: 0.48,
    speed: 0.38,
  },
  {
    position: [-0.35, 1.9, -2.7],
    rotation: [0.04, -0.08, 0.12],
    scale: [0.95, 0.64, 1],
    opacity: 0.36,
    speed: 0.28,
  },
  {
    position: [3.15, -0.2, -2.9],
    rotation: [-0.08, -0.22, -0.1],
    scale: [0.82, 1.12, 1],
    opacity: 0.34,
    speed: 0.25,
  },
  {
    position: [-3.35, -0.55, -3.1],
    rotation: [0.12, 0.2, 0.06],
    scale: [1.05, 0.7, 1],
    opacity: 0.34,
    speed: 0.22,
  },
  {
    position: [0.35, -2.05, -2.7],
    rotation: [-0.06, 0.08, -0.13],
    scale: [0.74, 1.03, 1],
    opacity: 0.32,
    speed: 0.24,
  },
  {
    position: [-1.3, 0.05, -3.45],
    rotation: [0.08, -0.18, 0.04],
    scale: [0.78, 0.52, 1],
    opacity: 0.28,
    speed: 0.2,
  },
  {
    position: [1.15, 0.48, -3.65],
    rotation: [-0.08, 0.18, -0.04],
    scale: [0.72, 0.48, 1],
    opacity: 0.27,
    speed: 0.18,
  },
  {
    position: [-2.75, 2.08, -4.1],
    rotation: [0.08, 0.06, -0.16],
    scale: [0.6, 0.4, 1],
    opacity: 0.22,
    speed: 0.16,
  },
  {
    position: [2.75, 1.9, -4.2],
    rotation: [-0.06, -0.08, 0.14],
    scale: [0.58, 0.39, 1],
    opacity: 0.22,
    speed: 0.15,
  },
  {
    position: [-3.65, 1.05, -4.5],
    rotation: [0.05, 0.18, 0.2],
    scale: [0.5, 0.68, 1],
    opacity: 0.2,
    speed: 0.14,
  },
  {
    position: [3.7, -1.2, -4.4],
    rotation: [-0.04, -0.2, -0.18],
    scale: [0.52, 0.7, 1],
    opacity: 0.2,
    speed: 0.13,
  },
  {
    position: [-1.95, -2.15, -4.25],
    rotation: [-0.04, 0.12, 0.08],
    scale: [0.56, 0.38, 1],
    opacity: 0.2,
    speed: 0.16,
  },
  {
    position: [1.95, -2.25, -4.35],
    rotation: [0.04, -0.12, -0.08],
    scale: [0.56, 0.38, 1],
    opacity: 0.19,
    speed: 0.14,
  },
  {
    position: [-0.05, 2.55, -4.8],
    rotation: [0.02, 0.08, 0.02],
    scale: [0.48, 0.32, 1],
    opacity: 0.18,
    speed: 0.13,
  },
  {
    position: [0.05, -2.65, -4.85],
    rotation: [-0.02, -0.08, -0.02],
    scale: [0.48, 0.32, 1],
    opacity: 0.18,
    speed: 0.12,
  },
  {
    position: [-4.05, -1.95, -5.25],
    rotation: [0.02, 0.16, -0.12],
    scale: [0.42, 0.28, 1],
    opacity: 0.15,
    speed: 0.12,
  },
  {
    position: [4.15, 0.85, -5.25],
    rotation: [-0.02, -0.16, 0.12],
    scale: [0.42, 0.28, 1],
    opacity: 0.15,
    speed: 0.11,
  },
  {
    position: [-2.45, 0.15, -5.6],
    rotation: [0.05, -0.12, 0.18],
    scale: [0.36, 0.24, 1],
    opacity: 0.13,
    speed: 0.1,
  },
  {
    position: [2.35, -0.1, -5.7],
    rotation: [-0.05, 0.12, -0.18],
    scale: [0.36, 0.24, 1],
    opacity: 0.13,
    speed: 0.1,
  },
  {
    position: [-0.95, -0.95, -5.95],
    rotation: [0.04, 0.08, -0.04],
    scale: [0.32, 0.22, 1],
    opacity: 0.12,
    speed: 0.09,
  },
  {
    position: [0.9, 1.05, -6.05],
    rotation: [-0.04, -0.08, 0.04],
    scale: [0.32, 0.22, 1],
    opacity: 0.12,
    speed: 0.09,
  },
  {
    position: [-3.4, 2.75, -6.25],
    rotation: [0.02, 0.1, 0.12],
    scale: [0.28, 0.19, 1],
    opacity: 0.1,
    speed: 0.08,
  },
  {
    position: [3.35, -2.7, -6.25],
    rotation: [-0.02, -0.1, -0.12],
    scale: [0.28, 0.19, 1],
    opacity: 0.1,
    speed: 0.08,
  },
  {
    position: [-4.25, 0.1, -6.6],
    rotation: [0.04, 0.16, -0.08],
    scale: [0.24, 0.16, 1],
    opacity: 0.08,
    speed: 0.07,
  },
  {
    position: [4.25, -0.05, -6.6],
    rotation: [-0.04, -0.16, 0.08],
    scale: [0.24, 0.16, 1],
    opacity: 0.08,
    speed: 0.07,
  },
];

const collageItems = collageSources.map((src, index) => ({
  src,
  ...collageLayouts[index % collageLayouts.length],
}));

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

  useFrame((state) => {
    if (!meshRef.current) {
      return;
    }

    const time = state.clock.elapsedTime;
    meshRef.current.position.y =
      item.position[1] + Math.sin(time * item.speed + item.position[0]) * 0.08;
    meshRef.current.rotation.z =
      item.rotation[2] + Math.sin(time * item.speed * 0.75) * 0.025;
  });

  return (
    <mesh ref={meshRef} position={item.position} rotation={item.rotation}>
      <planeGeometry args={[item.scale[0], item.scale[1], 1, 1]} />
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
      <mesh position={[0.15, 0.1, -2.6]} rotation={[0.25, 0.4, -0.2]}>
        <boxGeometry args={[0.48, 0.48, 0.02]} />
        <meshBasicMaterial color="#f1eee7" transparent opacity={0.065} wireframe />
      </mesh>
    </group>
  );
}

function WorldScene() {
  const groupRef = useRef(null);
  const dragRef = useRef({ active: false, x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState([0, 0]);
  const textures = useTexture(collageItems.map((item) => item.src));
  const { pointer } = useThree();

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
    const targetX = pointer.y * 0.1 + dragOffset[1] * 0.0012;
    const targetY = pointer.x * 0.16 + dragOffset[0] * 0.0012;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.04,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.04,
    );
    groupRef.current.position.y = Math.sin(time * 0.22) * 0.05;
  });

  function handlePointerDown(event) {
    dragRef.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handlePointerMove(event) {
    if (!dragRef.current.active) {
      return;
    }

    setDragOffset([
      event.clientX - dragRef.current.x,
      event.clientY - dragRef.current.y,
    ]);
  }

  function handlePointerUp() {
    dragRef.current.active = false;
  }

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {collageItems.map((item, index) => (
        <CollagePlane item={item} texture={textures[index]} key={item.src} />
      ))}
      <AbstractFragments />
    </group>
  );
}

function WebGLFallback() {
  return (
    <div className="world-webgl-fallback" aria-hidden="true">
      {collageItems.map((item) => {
        const [x, y, z] = item.position;
        const depthScale = THREE.MathUtils.mapLinear(z, -6.8, -1.1, 0.35, 1);

        return (
          <img
            src={item.src}
            alt=""
            key={item.src}
            className="fallback-image"
            loading="lazy"
            decoding="async"
            style={{
              left: `${50 + x * 11}%`,
              top: `${50 - y * 13}%`,
              opacity: Math.max(item.opacity * 0.8, 0.08),
              transform: `translate(-50%, -50%) rotate(${item.rotation[2]}rad)`,
              width: `${Math.max(item.scale[0] * 190 * depthScale, 42)}px`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function InteractiveWorldSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.15 });

  return (
    <motion.section
      ref={sectionRef}
      id="world"
      className="site-section site-section--world"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="world-canvas-frame" aria-hidden="true">
        <WebGLFallbackBoundary fallback={<WebGLFallback />}>
          <Suspense fallback={<WebGLFallback />}>
            <Canvas
              camera={{ position: [0, 0, 5.8], fov: 42 }}
              dpr={[1, 1.35]}
              frameloop={isInView ? "always" : "demand"}
              gl={{
                alpha: true,
                antialias: false,
                powerPreference: "low-power",
              }}
            >
              <color attach="background" args={["#030303"]} />
              <WorldScene />
            </Canvas>
          </Suspense>
        </WebGLFallbackBoundary>
      </div>

      <motion.div
        className="section-content world-content"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-kicker">Atmospheric collage space</p>
        <h2>Fragments that do not settle.</h2>
        <ul className="world-fragments" aria-label="Poetic fragments">
          {siteContent.manifesto.map((line, index) => (
            <motion.li
              key={line}
              initial={{ opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{
                duration: 0.9,
                delay: 0.52 + index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {line}
            </motion.li>
          ))}
        </ul>
        <p className="world-instruction">drag to explore</p>
      </motion.div>
    </motion.section>
  );
}
