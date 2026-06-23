import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTextureCache } from "../../hooks/useTextureCache.js";
import VirtualImagePool from "./VirtualImagePool.jsx";

function getInitialSources(worldImages, activePoolSize) {
  if (worldImages.length === 0) {
    return [];
  }

  return Array.from({ length: Math.min(activePoolSize + 4, worldImages.length) }, (_, index) => {
    const sourceIndex = Math.floor((index / Math.max(activePoolSize, 1)) * worldImages.length);
    return worldImages[sourceIndex]?.src;
  }).filter(Boolean);
}

export default function WorldScene({
  activePoolSize,
  cameraLimits,
  navigationRef,
  shouldReduceMotion,
  worldImages,
}) {
  const { camera, gl } = useThree();
  const initialSources = useMemo(
    () => getInitialSources(worldImages, activePoolSize),
    [activePoolSize, worldImages],
  );
  const { requestTexture } = useTextureCache({
    initialSources,
    maxAnisotropy: gl.capabilities.getMaxAnisotropy(),
  });

  useFrame((state, delta) => {
    const navigation = navigationRef.current;
    const clampedDelta = Math.min(delta, 0.05);
    const cameraDamping = shouldReduceMotion ? 18 : 5.8;
    const dragDamping = shouldReduceMotion ? 14 : 6.8;
    const velocityDamping = shouldReduceMotion ? 12 : 4.8;
    const parallaxX = shouldReduceMotion ? 0 : navigation.pointerX * 0.22;
    const parallaxY = shouldReduceMotion ? 0 : navigation.pointerY * 0.16;
    const idleDelayMs = 2500;
    const idleTravelSpeed = shouldReduceMotion ? 0.12 : 0.42;
    const hasIdleControl = performance.now() - navigation.lastInteractionTime > idleDelayMs;

    navigation.targetCameraX += navigation.velocityX * clampedDelta * 0.18;
    navigation.targetCameraY += navigation.velocityY * clampedDelta * 0.18;
    navigation.targetCameraZ += navigation.velocityZ * clampedDelta * 0.1;

    if (hasIdleControl) {
      navigation.targetCameraZ += idleTravelSpeed * clampedDelta;
      navigation.targetCameraX += Math.sin(state.clock.elapsedTime * 0.07) * clampedDelta * 0.035;
      navigation.targetCameraY += Math.cos(state.clock.elapsedTime * 0.055) * clampedDelta * 0.025;
    }

    navigation.velocityX = THREE.MathUtils.damp(
      navigation.velocityX,
      0,
      velocityDamping,
      clampedDelta,
    );
    navigation.velocityY = THREE.MathUtils.damp(
      navigation.velocityY,
      0,
      velocityDamping,
      clampedDelta,
    );
    navigation.velocityZ = THREE.MathUtils.damp(
      navigation.velocityZ,
      0,
      velocityDamping,
      clampedDelta,
    );

    navigation.currentCameraX = THREE.MathUtils.damp(
      navigation.currentCameraX,
      navigation.targetCameraX,
      dragDamping,
      clampedDelta,
    );
    navigation.currentCameraY = THREE.MathUtils.damp(
      navigation.currentCameraY,
      navigation.targetCameraY,
      dragDamping,
      clampedDelta,
    );
    navigation.currentCameraZ = THREE.MathUtils.damp(
      navigation.currentCameraZ,
      navigation.targetCameraZ,
      cameraDamping,
      clampedDelta,
    );

    const idleX = shouldReduceMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
    const idleY = shouldReduceMotion ? 0 : Math.cos(state.clock.elapsedTime * 0.06) * 0.035;

    camera.position.set(
      navigation.currentCameraX + parallaxX + idleX,
      navigation.currentCameraY + parallaxY + idleY,
      cameraLimits.initialZ,
    );
    camera.lookAt(
      navigation.currentCameraX + parallaxX * 0.28,
      navigation.currentCameraY + parallaxY * 0.22,
      cameraLimits.initialZ - 24,
    );
  });

  return (
    <VirtualImagePool
      activePoolSize={activePoolSize}
      navigationRef={navigationRef}
      renderCameraZ={cameraLimits.initialZ}
      requestTexture={requestTexture}
      shouldReduceMotion={shouldReduceMotion}
      worldImages={worldImages}
    />
  );
}
