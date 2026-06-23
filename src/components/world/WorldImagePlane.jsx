import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  getWrapCell,
  positiveModulo,
  WORLD_VOLUME,
  wrapDepthCoordinate,
  wrapWorldCoordinate,
} from "../../utils/wrapWorldPosition.js";

function getImageIndex(slot, cameraX, cameraY, cameraZ, imageCount) {
  const cellX = getWrapCell(slot.baseX, cameraX, WORLD_VOLUME.width);
  const cellY = getWrapCell(slot.baseY, cameraY, WORLD_VOLUME.height);
  const cellZ = Math.floor((cameraZ - slot.baseZ) / WORLD_VOLUME.depth);

  return positiveModulo(
    slot.sourceIndex + cellX * 11 + cellY * 17 + cellZ * 23 + slot.poolIndex * 5,
    imageCount,
  );
}

function getDepthOpacity(distance) {
  const fade = THREE.MathUtils.mapLinear(
    distance,
    WORLD_VOLUME.minDepthDistance,
    WORLD_VOLUME.depth + WORLD_VOLUME.minDepthDistance,
    1,
    0.55,
  );

  return THREE.MathUtils.clamp(fade, 0.55, 1);
}

export default function WorldImagePlane({
  navigationRef,
  renderCameraZ,
  requestTexture,
  shouldReduceMotion,
  slot,
  worldImages,
}) {
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const runtimeRef = useRef({
    activeImageIndex: -1,
    aspectRatio: slot.aspectRatio,
    fade: 0,
    hasTexture: false,
  });

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;

    if (!mesh || !material || worldImages.length === 0) {
      return;
    }

    const navigation = navigationRef.current;
    const cameraX = navigation.currentCameraX;
    const cameraY = navigation.currentCameraY;
    const logicalCameraZ = navigation.currentCameraZ;
    const imageIndex = getImageIndex(slot, cameraX, cameraY, logicalCameraZ, worldImages.length);
    let selectedImage = worldImages[imageIndex];
    let textureEntry = requestTexture(selectedImage.src);

    if (textureEntry.status === "failed") {
      for (let attempt = 1; attempt < Math.min(worldImages.length, 8); attempt += 1) {
        selectedImage = worldImages[positiveModulo(imageIndex + attempt, worldImages.length)];
        textureEntry = requestTexture(selectedImage.src);

        if (textureEntry.status !== "failed") {
          break;
        }
      }
    }

    if (textureEntry.status === "loaded" && textureEntry.texture) {
      if (runtimeRef.current.activeImageIndex !== imageIndex) {
        material.map = textureEntry.texture;
        material.needsUpdate = true;
        runtimeRef.current.activeImageIndex = imageIndex;
        runtimeRef.current.hasTexture = true;
        runtimeRef.current.fade = 0;

        const image = textureEntry.texture.image;
        runtimeRef.current.aspectRatio =
          image?.width && image?.height ? image.width / image.height : selectedImage.aspectRatio;
      }
    }

    const positionX = wrapWorldCoordinate(slot.baseX, cameraX, WORLD_VOLUME.width);
    const positionY = wrapWorldCoordinate(slot.baseY, cameraY, WORLD_VOLUME.height);
    const positionZ = wrapDepthCoordinate(
      slot.baseZ,
      logicalCameraZ,
      WORLD_VOLUME.depth,
      WORLD_VOLUME.minDepthDistance,
    );
    const distance = logicalCameraZ - positionZ;
    const renderedPositionZ = renderCameraZ - distance;
    const floatStrength = shouldReduceMotion ? 0 : slot.floatStrength;
    const time = state.clock.elapsedTime;

    mesh.position.set(
      positionX + Math.sin(time * slot.floatSpeed + slot.phase) * floatStrength,
      positionY + Math.cos(time * slot.floatSpeed * 0.8 + slot.phase) * floatStrength * 0.62,
      renderedPositionZ,
    );

    mesh.rotation.set(
      shouldReduceMotion ? 0 : Math.sin(time * 0.08 + slot.phase) * 0.012,
      shouldReduceMotion ? 0 : Math.cos(time * 0.07 + slot.phase) * 0.012,
      slot.rotation + (shouldReduceMotion ? 0 : Math.sin(time * 0.12 + slot.phase) * 0.006),
    );

    const height = slot.width / Math.max(runtimeRef.current.aspectRatio, 0.35);
    mesh.scale.set(slot.width, height, 1);

    if (runtimeRef.current.hasTexture) {
      runtimeRef.current.fade = Math.min(1, runtimeRef.current.fade + delta * 1.6);
    }

    material.visible = runtimeRef.current.hasTexture;
    material.opacity = slot.opacity * getDepthOpacity(distance) * runtimeRef.current.fade;
  });

  return (
    <mesh ref={meshRef} frustumCulled>
      <planeGeometry args={[1, 1, 1, 1]} />
      <meshBasicMaterial
        ref={materialRef}
        transparent
        opacity={0}
        toneMapped={false}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
