import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const CAMERA_SETTINGS = {
  initialZ: 8.6,
};

function normalizeWheelDelta(event) {
  const deltaMultiplier =
    event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? window.innerHeight
        : 1;

  return THREE.MathUtils.clamp(event.deltaY * deltaMultiplier, -280, 280);
}

function getPointerFromEvent(event, element) {
  const rect = element.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

  return {
    x: THREE.MathUtils.clamp(x, -1, 1),
    y: THREE.MathUtils.clamp(y, -1, 1),
  };
}

export function useWorldNavigation({ disabled = false, shouldReduceMotion = false } = {}) {
  const frameRef = useRef(null);
  const dragRef = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    pointerId: null,
  });
  const navigationRef = useRef({
    targetCameraX: 0,
    targetCameraY: 0,
    targetCameraZ: CAMERA_SETTINGS.initialZ,
    currentCameraX: 0,
    currentCameraY: 0,
    currentCameraZ: CAMERA_SETTINGS.initialZ,
    velocityX: 0,
    velocityY: 0,
    velocityZ: 0,
    pointerX: 0,
    pointerY: 0,
    lastInteractionTime: performance.now(),
  });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame || disabled) {
      return undefined;
    }

    function handleWheel(event) {
      event.preventDefault();

      const pointer = getPointerFromEvent(event, frame);
      const delta = normalizeWheelDelta(event);
      const zoomSensitivity = shouldReduceMotion ? 0.0022 : 0.0038;
      const nextZ = navigationRef.current.targetCameraZ + delta * zoomSensitivity;
      const zoomAmount = navigationRef.current.targetCameraZ - nextZ;

      navigationRef.current.pointerX = pointer.x;
      navigationRef.current.pointerY = pointer.y;
      navigationRef.current.lastInteractionTime = performance.now();
      navigationRef.current.targetCameraZ = nextZ;
      navigationRef.current.targetCameraX += pointer.x * zoomAmount * 0.22;
      navigationRef.current.targetCameraY += pointer.y * zoomAmount * 0.14;
      navigationRef.current.velocityZ += delta * zoomSensitivity * 0.18;
    }

    frame.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      frame.removeEventListener("wheel", handleWheel);
    };
  }, [disabled, shouldReduceMotion]);

  function handlePointerDown(event) {
    if (disabled || event.button > 0) {
      return;
    }

    event.preventDefault();

    const pointer = getPointerFromEvent(event, event.currentTarget);
    navigationRef.current.pointerX = pointer.x;
    navigationRef.current.pointerY = pointer.y;
    navigationRef.current.lastInteractionTime = performance.now();

    dragRef.current = {
      active: true,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: performance.now(),
      pointerId: event.pointerId,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsDragging(true);
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    const pointer = getPointerFromEvent(event, event.currentTarget);

    navigationRef.current.pointerX = pointer.x;
    navigationRef.current.pointerY = pointer.y;
    navigationRef.current.lastInteractionTime = performance.now();

    if (!drag.active) {
      return;
    }

    event.preventDefault();

    const now = performance.now();
    const deltaTime = Math.max((now - drag.lastTime) / 1000, 0.016);
    const deltaX = event.clientX - drag.lastX;
    const deltaY = event.clientY - drag.lastY;
    const dragSensitivity = shouldReduceMotion ? 0.012 : 0.017;
    const sceneDeltaX = -deltaX * dragSensitivity;
    const sceneDeltaY = deltaY * dragSensitivity;

    navigationRef.current.targetCameraX += sceneDeltaX;
    navigationRef.current.targetCameraY += sceneDeltaY;
    navigationRef.current.velocityX = THREE.MathUtils.clamp(sceneDeltaX / deltaTime, -4, 4);
    navigationRef.current.velocityY = THREE.MathUtils.clamp(sceneDeltaY / deltaTime, -4, 4);

    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.lastTime = now;
  }

  function endDrag(event) {
    if (!dragRef.current.active) {
      return;
    }

    event.currentTarget.releasePointerCapture?.(dragRef.current.pointerId);
    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    setIsDragging(false);
  }

  return {
    cameraLimits: CAMERA_SETTINGS,
    frameRef,
    isDragging,
    navigationRef,
    pointerHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onPointerLeave: endDrag,
    },
  };
}
