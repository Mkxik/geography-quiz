# Flags of the World

A local flag quiz built with React, TypeScript, Vite and Tailwind CSS v4. Flag images load from [flagcdn.com](https://flagcdn.com), so it needs an internet connection.

## Setup from scratch

```bash
npm create vite@latest geography-quiz -- --template react-ts
cd geography-quiz
npm install
npm install react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

Tailwind v4 needs no `tailwind.config.js`: the `@tailwindcss/vite` plugin goes in `vite.config.ts` and `src/index.css` starts with `@import "tailwindcss";`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## Deploy (GitHub Pages)

Every push to `main` builds the app and deploys it with `.github/workflows/deploy.yml`.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The app uses hash routing (`/#/classic`), so links keep working on Pages without a server-side fallback.

## Modes

| Route | Mode |
| --- | --- |
| `#/classic` | **A · Classic Type**: type the country name. Aliases, accents and small typos are accepted (Enter checks close spellings, Esc skips) |
| `#/continents` | **B · Continent Clicker**: find each named flag in a continent's grid |
| `#/doppelgangers` | **C · Doppelgängers**: pick the right flag from 2 to 6 lookalikes in the same `similarityGroup` |
| `#/explorer` | **D · Explorer**: filter the gallery by color (all / any / only these), feature, continent and name |

## Structure

```
src/
  data/flagsData.ts     205 entries: 197 countries + 8 territories (isTerritory: true)
  lib/matching.ts       normalize + Levenshtein answer checking
  lib/groups.ts         builds lookalike groups from similarityGroup
  lib/random.ts         shuffle / sample
  lib/feedback.ts       green/red flash + shake (Web Animations API)
  components/           Layout, FlagImage (fade-in + skeleton), UI primitives
  pages/                Home + the four modes
```

## Data notes

- The 197 countries are JetPunk's list: 193 UN members plus Vatican City, Palestine, Kosovo and Taiwan. The 8 extras are Western Sahara, Puerto Rico, Greenland, England, Scotland, Wales, Hong Kong and Macau.
- `colors`, `features` and `similarityGroup` were tagged by hand for every flag. Correct them in `COUNTRY_ROWS` / `TERRITORY_ROWS`.
- A fuzzy answer is rejected if it is closer to another country's name, so "Austria" never counts as Australia.
