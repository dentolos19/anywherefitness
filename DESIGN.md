# Design System

## Framework

- The UI uses MUI (`@mui/material`) with `@mui/icons-material` for icons.
- [`src/components/app-provider.tsx`](src/components/app-provider.tsx) wraps the app in the MUI App Router cache provider with CSS layers enabled, the theme provider, and `CssBaseline`.
- Maps use Mapbox GL in [`src/app/track/_components/map-view.tsx`](src/app/track/_components/map-view.tsx) with the `streets-v12` style.

## Styling

- Style components with the MUI `sx` prop and component props.
- [`src/app/globals.css`](src/app/globals.css) imports Tailwind CSS theme, preflight, and utility layers, but components do not use Tailwind classes.
- The global stylesheet sizes `body` to the dynamic viewport and hides page overflow, so scrolling happens inside the app shell.

## Tokens

- [`src/theme.ts`](src/theme.ts) defines a dark MUI palette with default MUI colors and radius.
- Typography uses Roboto at weights 300, 400, 500, and 700, loaded with `next/font/google`.

## Layout

- [`src/components/app-shell.tsx`](src/components/app-shell.tsx) renders a top app bar with notifications, profile, and about actions.
- On small screens, a bottom navigation bar shows Home, Track, and Ads, and the app bar shows a back button.
- On larger screens, the app bar shows the title image and a menu button that opens a drawer with the same navigation.
- Pages render inside a `Container` with `Paper` sections, and floating actions use a fixed `Fab` or `SpeedDial` offset above the bottom navigation.
- The shell shows the authentication view until a session is restored.

## Components

- Put modal forms in `src/dialogs/` as MUI `Dialog` components that report results through an `onClose(value)` callback, with `undefined` for cancel.
- Put shared views in `src/components/` and route-only components in a `_components/` folder next to the route.
- Static images live in `public/assets/`.
