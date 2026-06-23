export const WORLD_VOLUME = {
  width: 46,
  height: 30,
  depth: 52,
  minDepthDistance: 3.2,
};

export function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

export function wrapRelative(value, size) {
  return positiveModulo(value + size / 2, size) - size / 2;
}

export function wrapWorldCoordinate(baseValue, cameraValue, size) {
  return cameraValue + wrapRelative(baseValue - cameraValue, size);
}

export function wrapDepthCoordinate(baseZ, cameraZ, depth, minDistance) {
  const distance = positiveModulo(cameraZ - baseZ - minDistance, depth) + minDistance;
  return cameraZ - distance;
}

export function getWrapCell(baseValue, cameraValue, size) {
  return Math.floor((cameraValue - baseValue + size / 2) / size);
}
