import { useMemo } from "react";
import WorldImagePlane from "./WorldImagePlane.jsx";

function makeSlot(image, poolIndex, sourceIndex) {
  return {
    ...image,
    poolIndex,
    sourceIndex,
    floatSpeed: 0.08 + (poolIndex % 7) * 0.012,
    floatStrength: 0.018 + (poolIndex % 5) * 0.008,
    phase: poolIndex * 0.83,
  };
}

export default function VirtualImagePool({
  activePoolSize,
  navigationRef,
  renderCameraZ,
  requestTexture,
  shouldReduceMotion,
  worldImages,
}) {
  const slots = useMemo(() => {
    if (worldImages.length === 0) {
      return [];
    }

    return Array.from({ length: activePoolSize }, (_, index) => {
      const sourceIndex = Math.floor((index / activePoolSize) * worldImages.length);
      return makeSlot(worldImages[sourceIndex], index, sourceIndex);
    });
  }, [activePoolSize, worldImages]);

  return (
    <group>
      {slots.map((slot) => (
        <WorldImagePlane
          key={`world-image-slot-${slot.poolIndex}`}
          navigationRef={navigationRef}
          renderCameraZ={renderCameraZ}
          requestTexture={requestTexture}
          shouldReduceMotion={shouldReduceMotion}
          slot={slot}
          worldImages={worldImages}
        />
      ))}
    </group>
  );
}
