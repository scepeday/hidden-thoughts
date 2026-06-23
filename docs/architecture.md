# Hidden Thoughts Architecture

This project is a custom React and Three.js microsite. It is not a Shopify theme.

## Main Experience

The main screen is the interactive World:

- `src/sections/InteractiveWorldSection.jsx` owns the World section wrapper.
- `src/components/world/WorldCanvas.jsx` creates the React Three Fiber canvas.
- `src/components/world/WorldScene.jsx` moves the virtual camera and handles idle drift.
- `src/components/world/VirtualImagePool.jsx` keeps a fixed number of image planes mounted.
- `src/components/world/WorldImagePlane.jsx` wraps each plane through the 3D space.
- `src/hooks/useWorldNavigation.js` handles drag, wheel, and pointer activity.
- `src/hooks/useTextureCache.js` caches loaded Three.js textures.
- `src/utils/wrapWorldPosition.js` contains the wrapping math.

The World uses a fixed reusable mesh pool. It does not create new meshes while the
user scrolls or drags. The larger photo library lives in `src/assets/collage/`.

## Products

Products are preview-only:

- `src/components/ProductsOverlay.jsx` opens as a modal layer.
- Product links open Shopify in a new tab.
- Shopify handles product pages, cart, checkout, payment, orders, and inventory.

Do not add cart, checkout, payment, order, inventory, or Shopify admin logic to
this React project.

## Assets

Runtime image assets live under `src/assets/`.

Recommended production image formats:

- WebP or AVIF where possible.
- JPEG fallback when needed.
- World photos should usually have a long edge around 720-1200 px.
- Avoid committing raw camera originals to the runtime asset folders.

## Quality Commands

```bash
npm run lint
npm run format:check
npm run build
```
