# Hidden Thoughts Microsite

Hidden Thoughts is a custom React / Three.js storytelling microsite.

This project is focused on one immersive visual world: a dark, grainy,
interactive collage of floating images, text fragments, texture, sound, scroll,
and drag movement.

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

Product preview links and the Shop link should open the Shopify store
externally in a new browser tab.

## Reference Files

Files inside `reference/` are for inspiration and planning only. They should
not be imported into the live app unless that is specifically requested.

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
  brand/
  intro/
  collage/
  notes/
  textures/
  audio/
  video/

src/
  components/
  sections/
  data/
  styles/
```
