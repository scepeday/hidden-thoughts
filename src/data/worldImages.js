const imageModules = import.meta.glob("../assets/collage/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
});

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function seededUnit(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function seededRange(seed, min, max) {
  return min + seededUnit(seed) * (max - min);
}

function getSizeBand(index) {
  const marker = positiveModulo(index * 37, 100);

  if (marker < 45) {
    return "small";
  }

  if (marker < 80) {
    return "medium";
  }

  if (marker < 97) {
    return "large";
  }

  return "hero";
}

function buildImageItem([path, src], index) {
  const id = path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? `world-image-${index + 1}`;
  const sizeBand = getSizeBand(index);
  const widthByBand = {
    small: seededRange(index * 5.7 + 1, 1.35, 2.35),
    medium: seededRange(index * 5.7 + 2, 2.55, 4.25),
    large: seededRange(index * 5.7 + 3, 4.75, 6.65),
    hero: seededRange(index * 5.7 + 4, 7.1, 8.4),
  };
  const baseZByBand = {
    small: -seededRange(index * 3.71 + 7, 5.5, 48),
    medium: -seededRange(index * 3.71 + 7, 4.4, 42),
    large: -seededRange(index * 3.71 + 7, 3.6, 34),
    hero: -seededRange(index * 3.71 + 7, 4.2, 28),
  };
  const opacityByBand = {
    small: seededRange(index * 4.11 + 8, 0.58, 0.78),
    medium: seededRange(index * 4.11 + 8, 0.64, 0.86),
    large: seededRange(index * 4.11 + 8, 0.72, 0.94),
    hero: seededRange(index * 4.11 + 8, 0.78, 0.98),
  };

  return {
    id,
    src,
    alt: `Hidden Thoughts collage image ${String(index + 1).padStart(2, "0")}`,
    aspectRatio: seededRange(index * 3.21 + 4, 0.72, 1.42),
    baseX: seededRange(index * 2.31 + 5, -23, 23),
    baseY: seededRange(index * 2.91 + 6, -15, 15),
    baseZ: baseZByBand[sizeBand],
    width: widthByBand[sizeBand],
    depth: sizeBand,
    opacity: opacityByBand[sizeBand],
    rotation: seededRange(index * 4.91 + 9, -0.052, 0.052),
    priority: positiveModulo(index * 7, 97),
  };
}

export const worldImages = Object.entries(imageModules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(buildImageItem)
  .filter((image) => Boolean(image.src));

export const worldImageSources = worldImages.map((image) => image.src);
