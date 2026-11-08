# MOACH asset notes

## Identity and palette
The three original standalone identity SVGs and pattern are unchanged. New applied marks reuse their exact path geometry. No team, school, college, league or equipment-brand marks are used.

Ink #131D29; coral #EF5A49; cream #F4EFDF; sand #D9CFB4 (existing selector value); lime/chartreuse #DAEF66. Neutral shading tones are rendering colors. Cream decoration contrasts with ink/coral products; ink contrasts with cream/sand/lime. Cream crops retain coral script.

## Product files
All variants are self-contained 1200 × 1400 SVGs. In `products/`:

- `product-hat-ink.svg`, `product-hat-coral.svg`, `product-hat-cream.svg`, `product-hat-sand.svg`
- `product-tank-ink.svg`, `product-tank-coral.svg`, `product-tank-cream.svg`, `product-tank-sand.svg`
- `product-crop-cream.svg`, `product-crop-coral.svg`, `product-crop-ink.svg`, `product-crop-sand.svg`
- `product-hoodie-ink.svg`, `product-hoodie-coral.svg`, `product-hoodie-cream.svg`, `product-hoodie-sand.svg`
- `product-crewneck-coral.svg`, `product-crewneck-ink.svg`, `product-crewneck-cream.svg`, `product-crewneck-sand.svg`
- `product-sticker-coral.svg`, `product-sticker-cream.svg`, `product-sticker-ink.svg`, `product-sticker-lime.svg`

The six legacy root product SVGs are byte-identical copies of defaults: hat ink, tank ink, crop cream, hoodie ink, crewneck coral, sticker coral. Actual product material color changes while framing and warm studio ground remain registered within each family. Variant selection wiring is outside this asset-only change.

The new studio treatment includes directional light, cast shadows, fabric weave, softened folds, seams, stitching, ribbing, cap panel construction, eyelets and curved brim stitching. Hat and crewneck emblem embroidery uses clipped diagonal thread. Garment printing retains material grain and mild fold interaction. Vinyl shows solid color, white carrier/contour, sheen and a lifted corner.

`hero-collage.svg` (1800 × 1000) embeds the new coral crewneck, cream crop, ink cap and coral decal, with namespaced IDs and a shared studio sweep. `pattern-sideline.svg` remains the original 320 × 320 repeat.

## Sports files
All are self-contained accessible 900 × 620 SVGs in `sports/`:

- `football-5v5.svg`: exactly five offensive coral circles and five cream defensive Xs, dashed line of scrimmage, sidelines and routes.
- `basketball.svg`: five players, half court, basket, key, arcs, passes, cuts and screen bar.
- `baseball.svg`: diamond, bases, foul lines, fielders, runner rounding first toward second, coaching box and dugout.
- `volleyball.svg`: six receivers, net, attack lines, serve trajectory and receive adjustments.

Shared ink ground, cream court/field lines, coral players, chartreuse routes/ball accents and original MOACH sideline marker. Dashed chartreuse arrows show ball movement; solid arrows show player movement. Useful titles and descriptions identify symbols without visible text or fonts. These are youth editorial concepts, not rulebook specifications for a particular age group.

## Regeneration
Run `python assets/build_studio_assets.py` with Python 3 from any directory. This dependency-free source reads the unchanged standalone marks and regenerates all 24 variants, six defaults, hero and four sports diagrams, then recursively XML-parses all SVGs.

`build_assets.py` remains the ORIGINAL FIRST-GENERATION source only. It does not regenerate the upgraded set; running it overwrites legacy defaults and hero with old artwork. Use `build_studio_assets.py` for current products and sports.

## Realism and production limits
These are sophisticated vector studio simulations, not camera photographs, garment scans or sewing patterns. Simplified folds and repeated textile/stitch patterns remain visible at high magnification. Rendering and apparent color vary by display and SVG engine. Silhouettes intentionally remain consistent across colorways. No physical inventory, dimensions, fiber composition or decoration durability is asserted.

Use standalone flat identity artwork for production, never shaded mockups. Expand script strokes for vendors. Approve actual placement, ink/thread swatches and physical embroidery sew-outs. Vendors must establish minimum gaps, stitch density, underlay and print sizing. Vinyl contour, bleed, carrier and cut paths require printer preparation; the peel is styling only. Front views do not illustrate the storefront slogan backs.

## Verification
All 39 SVGs recursively XML parsed. Validation checks titles, local reference resolution, unique IDs, accessible label references, dimensions, variant names, byte-equal defaults and football/basketball/volleyball player counts. No images, scripts, foreignObjects, external resources, text or font elements. The SVG namespace URI is metadata, not a fetched resource.

Headless Chrome rendered representative ink/cream hats, coral tank, cream crop, ink hoodie, sand crewneck, lime decal, hero and all four sports into a contact sheet for visual inspection. Contrast, framing, distinct sports and SVG effects were checked; fold edges were softened and the final set re-rendered.
