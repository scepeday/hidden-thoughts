# Hidden Thoughts Microsite

Hidden Thoughts is a custom React / Three.js storytelling microsite.

This project is focused on one immersive visual world: a dark, grainy,
interactive collage of floating images, texture, sound, scroll, drag movement,
and idle camera travel.

The only secondary section is a small product preview that links out to Shopify.
It is not a full store and does not own commerce behavior.

## Shopify Boundary

Shopify handles all commerce:

- Products
- Cart
- Checkout
- Payment
- Orders

The microsite must not include product pages, purchasable product cards,
collection catalog flows, cart logic, checkout logic, payment logic, order
logic, inventory logic, or Shopify admin pages.

Product preview links and the Shop link open the Shopify store externally in a
new browser tab.

## Development

```bash
npm install
npm run dev
npm run lint
npm run format:check
npm run build
```

Use `npm run format` to apply Prettier formatting.

## Reference Files

Files inside `reference/`, if present, are for inspiration and planning only.
They should not be imported into the live app unless that is specifically
requested.

Use live website assets from the `src/assets/` folder. The Vite build is
configured with `base: "/hidden-thoughts/"`, so bundled files resolve under
`/hidden-thoughts/assets/...` in production.

## Project Structure

```text
reference/
  video/
  video-frames/
  wireframes/
  brand-inspiration/

src/assets/
  audio/
  brand/
  collage/
  web/
    textures/
  textures/

src/
  components/
  data/
  hooks/
  sections/
  styles/
  utils/
```

See `docs/architecture.md` for a short explanation of the World, texture cache,
image recycling, and Shopify boundary.
