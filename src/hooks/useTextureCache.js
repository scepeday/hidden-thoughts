import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function configurePhotoTexture(texture, maxAnisotropy) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(maxAnisotropy, 2);
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
}

export function useTextureCache({ initialSources = [], maxAnisotropy = 1 } = {}) {
  const cacheRef = useRef(new Map());
  const loader = useMemo(() => new THREE.TextureLoader(), []);
  const [loadedCount, setLoadedCount] = useState(0);

  const requestTexture = useCallback(
    (src) => {
      if (!src) {
        return { status: "failed", texture: null };
      }

      const cachedEntry = cacheRef.current.get(src);

      if (cachedEntry) {
        return cachedEntry;
      }

      const entry = {
        status: "loading",
        texture: null,
        src,
      };

      cacheRef.current.set(src, entry);

      loader.load(
        src,
        (texture) => {
          configurePhotoTexture(texture, maxAnisotropy);
          entry.status = "loaded";
          entry.texture = texture;
          setLoadedCount((count) => count + 1);
        },
        undefined,
        () => {
          entry.status = "failed";
        },
      );

      return entry;
    },
    [loader, maxAnisotropy],
  );

  useEffect(() => {
    initialSources.forEach((src) => {
      requestTexture(src);
    });
  }, [initialSources, requestTexture]);

  useEffect(
    () => () => {
      cacheRef.current.forEach((entry) => {
        entry.texture?.dispose();
      });
      cacheRef.current.clear();
    },
    [],
  );

  return {
    cacheRef,
    loadedCount,
    requestTexture,
  };
}
