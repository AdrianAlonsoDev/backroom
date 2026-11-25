# Landing images

| File                                                             | Use                                              | Size        |
| ---------------------------------------------------------------- | ------------------------------------------------ | ----------- |
| `hero-clouds-day.webp`, `hero-clouds-night.webp`                 | Cloud bank around the product, wider than 1100px | 2400 × 1000 |
| `hero-clouds-compact-day.webp`, `hero-clouds-compact-night.webp` | Smaller cloud tops for tablets and phones        | 1800 × 760  |
| `norte-soma-concept.webp`                                        | Instagram post in the distribution section       | 1440 × 960  |
| `founder-creator.webp`                                           | YouTube cover in the distribution section        | 900 × 1125  |

The four cloud images are procedural renders made by `scripts/hero-sky/render.mjs`. The script ray-marches cumulus clouds in WebGL inside a headless Chromium, then downsamples the result with Sharp. Nothing is downloaded or copied, and the output is transparent, so the CSS sky shows through. To render them again:

```bash
pnpm exec playwright install chromium
pnpm render:sky
```

The day and night colours of the sky, the white light behind the headline, the stars and the grain are CSS and inline SVG in `modules/home/components/v3/HeroSky.tsx` and `v3/sky.css`.

`norte-soma-concept.webp` and `founder-creator.webp` are original AI-generated images made for this landing. Norte Studio and its coffee brand Soma are fictional, and the person in the photo is not a real customer.

All icons, mascots and floating objects are hand-written SVG in `modules/home/components`.
