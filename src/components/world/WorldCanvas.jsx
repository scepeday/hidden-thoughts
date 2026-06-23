import { Component, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import WorldScene from "./WorldScene.jsx";

const ACTIVE_POOL_SIZES = {
  desktop: 34,
  tablet: 26,
  mobile: 20,
};

function getActivePoolSize() {
  if (typeof window === "undefined") {
    return ACTIVE_POOL_SIZES.desktop;
  }

  if (window.matchMedia("(max-width: 620px)").matches) {
    return ACTIVE_POOL_SIZES.mobile;
  }

  if (window.matchMedia("(max-width: 980px)").matches) {
    return ACTIVE_POOL_SIZES.tablet;
  }

  return ACTIVE_POOL_SIZES.desktop;
}

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

function WebGLFallback({ worldImages }) {
  function handleImageError(event) {
    event.currentTarget.hidden = true;
  }

  return (
    <div className="world-webgl-fallback" aria-hidden="true">
      {worldImages.slice(0, 24).map((image, index) => (
        <img
          src={image.src}
          alt=""
          key={image.id}
          className="fallback-image"
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          style={{
            left: `${50 + image.baseX * 1.75}%`,
            top: `${50 - image.baseY * 2.1}%`,
            opacity: Math.max(image.opacity * 0.72, 0.12),
            transform: `translate(-50%, -50%) rotate(${image.rotation}rad)`,
            width: `${Math.max(image.width * 110 + (index % 3) * 18, 80)}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function WorldCanvas({
  cameraLimits,
  isActive,
  navigationRef,
  shouldReduceMotion,
  worldImages,
}) {
  const [activePoolSize, setActivePoolSize] = useState(getActivePoolSize);

  useEffect(() => {
    function handleResize() {
      setActivePoolSize(getActivePoolSize());
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fallback = <WebGLFallback worldImages={worldImages} />;

  return (
    <WebGLFallbackBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <Canvas
          camera={{
            position: [0, 0, cameraLimits.initialZ],
            fov: 46,
            near: 0.2,
            far: 90,
          }}
          dpr={[1, 1.5]}
          frameloop={isActive ? "always" : "demand"}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
          }}
        >
          <color attach="background" args={["#020202"]} />
          <WorldScene
            activePoolSize={activePoolSize}
            cameraLimits={cameraLimits}
            navigationRef={navigationRef}
            shouldReduceMotion={shouldReduceMotion}
            worldImages={worldImages}
          />
        </Canvas>
      </Suspense>
    </WebGLFallbackBoundary>
  );
}

export { ACTIVE_POOL_SIZES };
