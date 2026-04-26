# EgyszerűAutó Frontend Design System

This document defines the reusable visual foundation for all marketplace screens.

## 1) Color Palette Suggestion

Use semantic tokens through Tailwind theme extension.

- Brand Blue: Trust and primary actions.
  - brand-50: #eff6ff
  - brand-100: #dbeafe
  - brand-300: #93c5fd
  - brand-500: #2563eb
  - brand-600: #1d4ed8
  - brand-700: #1d4ed8
  - brand-900: #1e3a8a
- Accent Amber: Price highlights, key conversion actions.
  - accent-500: #f59e0b
  - accent-600: #d97706
- Neutral Slate: Backgrounds, borders, text hierarchy.
  - neutral-50: #f8fafc
  - neutral-100: #f1f5f9
  - neutral-200: #e2e8f0
  - neutral-700: #334155
  - neutral-900: #0f172a
- Feedback
  - success-500: #22c55e
  - danger-500: #ef4444

Color usage rules:
- Use brand for navigation and primary CTAs.
- Use accent for price emphasis and high-intent actions.
- Use neutral tones for structure and readability.
- Keep red/green only for state feedback.

## 2) Typography Guidelines

Primary typefaces:
- Heading: Manrope
- Body/UI: Plus Jakarta Sans

Hierarchy:
- H1: text-4xl to text-5xl, font-extrabold, heading family
- H2: section-title utility (2xl to 3xl)
- H3: text-xl, font-bold
- Body: text-sm to text-base for cards and forms
- Meta text: text-xs to text-sm with neutral-700 or slate-500

Readability rules:
- Minimum body size 14px equivalent.
- Use generous line-height for descriptions.
- Keep price values bold and larger than surrounding text.

## 3) Tailwind Utility Strategy

Use layered approach:
- Atomic utilities for one-off layout and spacing.
- Component classes in src/index.css for repeated patterns:
  - Buttons: btn-base, btn-primary, btn-secondary, btn-accent, btn-ghost
  - Inputs: label-base, input-base, input-hint
  - Titles: section-title, section-subtitle
  - Containers and cards: container-page, card-base

Reusable primitives:
- Container: src/components/ui/Container.tsx
- Button: src/components/ui/Button.tsx
- InputField: src/components/ui/InputField.tsx
- Card: src/components/ui/Card.tsx
- SectionTitle: src/components/ui/SectionTitle.tsx
- LoadingSpinner: src/components/ui/LoadingSpinner.tsx
- EmptyState: src/components/ui/EmptyState.tsx

## 4) Responsive Breakpoints Strategy

Tailwind breakpoints:
- xs: 420px (small phones)
- sm: 640px (large phones)
- md: 768px (tablet)
- lg: 1024px (small desktop)
- xl: 1280px (desktop)
- 2xl: 1536px (wide desktop)

Layout behavior recommendations:
- Mobile first.
- Keep single-column flow for forms and listing details below md.
- Convert listing grids to 2 columns at md and 3 columns at xl.
- Keep navbar actions visible with simplified mobile navigation.
- Maintain card spacing and touch-friendly controls on all screens.

## 5) Reuse Across Main Product Areas

This foundation is suitable for:
- Homepage: hero, categories, featured cards
- Listings page: filters, result grid, empty states
- Listing details page: premium content + seller side panel
- Profile page: forms, account cards, status blocks
- Create/edit listing page: validated forms with reusable inputs and buttons
- Favorites page: card lists with empty states
- Admin panel: dashboard cards, data table wrappers, secondary buttons

## 6) Accessibility Baseline

- All form fields must have visible labels.
- Focus-visible ring on all interactive elements.
- Maintain contrast on text and buttons.
- Use semantic landmarks and aria labels for navigation and loading states.
