# AGENTS.md

This document provides an overview of the project for AI agents and developers.

## Project Overview

A read-only in-game item preview catalog. Visitors browse all available items, filter by category and rarity, and view detailed stats and prices. No authentication, no purchasing, no payments.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS |
| Icons | Lucide React |
| Language | TypeScript 5 |
| Deployment | Netlify |

## Directory Structure

```
src/
  data/items.ts             — All item definitions (type, rarity, stats, price)
  routes/
    __root.tsx              — Root HTML shell, meta tags
    index.tsx               — Catalog page: grid, filters, item cards
    products/$productId.tsx — Item detail page
  styles.css                — Full design system: CSS vars, component styles, animations
public/
  favicon.ico
  placeholder.png
```

## Data Model (`src/data/items.ts`)

Each item exports from `items.ts`:
- `id` — unique numeric ID
- `name`, `shortDescription`, `description`
- `type`: `'weapon' | 'armor' | 'accessory' | 'consumable' | 'mount' | 'pet'`
- `rarity`: `'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'`
- `price` (number) + `currency` (string)
- `stats`: `Record<string, string>` — arbitrary key/value stat pairs

`rarityConfig` maps each rarity to its color, glow, border, and background values.
`typeLabels` maps each type to its display name.

To add items: append to the `items` array in `src/data/items.ts`.

## Design System

CSS custom properties drive all theming in `styles.css`:
- `--bg-deep/base/surface/raised/hover` — background layers
- `--rarity-*` — canonical rarity colors
- `--font-display` (Cinzel), `--font-body` (Rajdhani), `--font-mono` (Share Tech Mono)

Rarity-specific colors and glows are applied **inline** via `rarityConfig` lookups — not Tailwind classes — so all theming is centralized in the data file.

## Routing

File-based with TanStack Router. The item detail route is `/products/$productId` where `productId` is the numeric `item.id` as a string.

## Filtering

Client-side only via `useState` in `index.tsx`. Two independent filters: item type and rarity. No server involvement.

## Conventions

- No purchasing, no Stripe, no checkout — intentionally preview-only
- Item "art" is generated from lucide icons + CSS radial gradients, not real game assets
- Legendary items animate their rarity label with a CSS gold shimmer
- TypeScript strict mode; use `@/` alias for `src/` imports
