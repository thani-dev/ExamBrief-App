---
name: Focus Brief
colors:
  surface: '#121316'
  surface-dim: '#121316'
  surface-bright: '#38393c'
  surface-container-lowest: '#0d0e11'
  surface-container-low: '#1b1b1f'
  surface-container: '#1f1f23'
  surface-container-high: '#292a2d'
  surface-container-highest: '#343538'
  on-surface: '#e3e2e6'
  on-surface-variant: '#c3c6d1'
  inverse-surface: '#e3e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#8d919b'
  outline-variant: '#424750'
  surface-tint: '#a8c8ff'
  primary: '#b5cfff'
  on-primary: '#003061'
  primary-container: '#8ab4f8'
  on-primary-container: '#0d4582'
  inverse-primary: '#315f9d'
  secondary: '#cebdff'
  on-secondary: '#381385'
  secondary-container: '#4f319c'
  on-secondary-container: '#bea8ff'
  tertiary: '#89e0b0'
  on-tertiary: '#003822'
  tertiary-container: '#6dc495'
  on-tertiary-container: '#005032'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a8c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#114784'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cebdff'
  on-secondary-fixed: '#21005e'
  on-secondary-fixed-variant: '#4f319c'
  tertiary-fixed: '#9cf5c3'
  tertiary-fixed-dim: '#81d8a8'
  on-tertiary-fixed: '#002112'
  on-tertiary-fixed-variant: '#005233'
  background: '#121316'
  on-background: '#e3e2e6'
  surface-variant: '#343538'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 22px
  title-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

This design system delivers a calm, high-efficiency examination and academic study companion tailored for Android. The personality is disciplined, analytical, and reassuring—designed to reduce the cognitive friction and anxiety typically surrounding semester exam schedules.

The visual style blends modern Android Material engineering with Samsung Now Brief's structural card architecture. Surfaces prioritize glanceable summaries over decorative ornamentation:
- **Card Hierarchy**: Distinct, soft-cornered modules (18–20px radii) that anchor daily targets, upcoming exam countdowns, and syllabus progress.
- **Visual Weight**: Lightweight and airy despite a deep dark-mode baseline. Translucent card perimeters and low-contrast borders separate content modules cleanly.
- **Iconography**: Refined 1.75px linear strokes with geometric consistency, avoiding expressive or playful visual metaphors.
- **Aesthetic Tone**: A calm, academic cockpit that delivers clear answers within milliseconds of unlocking the device.

## Colors

The palette is engineered exclusively for an OLED-optimized, glare-free dark mode:

- **Canvas & Background**: `#101114` acts as the deep canvas baseline, ensuring zero eye fatigue during late-night study sessions.
- **Surfaces**:
  - `Surface 1 (Base Cards)`: `#1B1D22` creates clear structural boundaries above the canvas.
  - `Surface 2 (Elevated / Nested Cards)`: `#252830` highlights interactive rows, filter chips, and inner data wells.
  - `Surface Outline`: `rgba(255, 255, 255, 0.06)` provides subtle edge definition without harsh line work.
- **Primary & Secondary Accents**:
  - `Primary (#8AB4F8)`: Soft periwinkle blue used for active tabs, primary actions, and immediate milestones.
  - `Secondary (#A78BFA)`: Muted lavender for secondary indicators, topic categorization, and revision trends.
- **Functional Semantics**:
  - `Success (#72C99A)`: Clean mint green indicating completed topics, strong attendance, and target grades met.
  - `Warning (#F4C16B)`: Warm amber for pending deadlines, incomplete study logs, and medium-risk exam alerts.
  - `Critical (#F28B82)`: Desaturated coral red reserved strictly for overdue tasks and imminent exam days (<24h).
- **Text & Content**:
  - `Primary Text`: `#F5F5F5` (96% luminance) for optimal contrast on dark surfaces.
  - `Secondary Text`: `#A5A8B0` (65% luminance) for meta-labels, timestamps, and secondary card descriptions.

## Typography

The typography scale utilizes **Inter** across all roles to achieve tabular clarity, optical balance, and effortless legibility in dense academic widgets.

- **Numerals**: Numerical values (countdown days, percentages, GPA metrics) must use tabular lining figures (`font-variant-numeric: tabular-nums`) to prevent layout shifts during animated timers or recalculations.
- **Hierarchy Rules**:
  - Use `headline-lg-mobile` exclusively for primary screen titles (e.g., "Semester Overview", "Finals Schedule").
  - Use `title-md` and `title-sm` for card heads and section dividing headers.
  - Reserve uppercase transformations strictly for `label-md` and `label-sm` (e.g., exam code tags like `CS-402`, status pills, and countdown labels).

## Layout & Spacing

The layout is built for single-handed, thumb-zone-driven navigation on Android viewports:

- **Grid Architecture**: Single-column vertical stack on mobile with a consistent `16px (1rem)` edge margin. Cards stretch to match full width between margins. On wider displays (tablets/foldables, min-width `600px`), a 2-column card masonry activates with a `16px` gutter.
- **Samsung Now Brief Card Flow**: Top-to-bottom briefing stack:
  1. *Header Briefing*: Compact date & countdown chip.
  2. *Priority Now Widget*: Urgent exam card spanning 100% width.
  3. *Weekly Focus Cards*: 2-up mini-metrics or vertical stack for study queues.
- **Touch & Reachability Target**: All interactive elements (chips, check toggles, navigation tabs) maintain a minimum touch bounding box of `48px × 48px`.
- **Bottom Clearance**: All scrollable canvases enforce a `96px` bottom padding to accommodate the 3-tab navigation bar and floating contextual action button without clipping content.

## Elevation & Depth

Depth is established through disciplined tonal stacking and precision hairline highlights rather than heavy drop shadows:

- **Level 0 (Canvas)**: `#101114` — Flat base, no shadow, non-interactive background.
- **Level 1 (Brief Cards)**: `#1B1D22` — Outlined by a `1px` inner or border stroke of `rgba(255, 255, 255, 0.07)`. A soft, ambient floor shadow gives subtle detachment: `0 4px 16px rgba(0, 0, 0, 0.28)`.
- **Level 2 (Active Sheets / Elevated Widgets)**: `#252830` — Border stroke `rgba(255, 255, 255, 0.12)`, shadow `0 8px 24px rgba(0, 0, 0, 0.40)`.
- **Level 3 (Modals & Bottom Sheets)**: `#1F222A` with an ambient glow of `0 16px 40px rgba(0, 0, 0, 0.65)` and a subtle `1px` top rim light `rgba(255, 255, 255, 0.15)`.
- **Focus / Pressed States**: No expansion or lift. Tapping cards results in a micro-scale transition (`scale(0.985)`) accompanied by an instantaneous surface tint shift to `rgba(255, 255, 255, 0.04)`.

## Shapes

The design system employs a rounded rectangular form language:

- **Card Shells**: Standard card components feature an explicit `18px` to `20px` radius, evoking contemporary hardware surfaces and Now Brief widgets.
- **Nested Inner Modules**: Elements nested inside primary cards (progress bars, study item rows) use an `8px` to `10px` radius to maintain proportional concentricity.
- **Interactive Micro-elements**:
  - Filter chips, tag pills, and countdown badges use a full capsule/pill radius (`999px`).
  - Form fields use `12px` radius.
  - Floating Action Buttons (FAB) adopt a smooth squircle or `16px` rounded rect.

## Components

### 1. Cards (Now Brief Widgets)
- Background `#1B1D22`, `1px` border `rgba(255, 255, 255, 0.06)`, `18px` border-radius, `16px` internal padding.
- Card heads feature an inline indicator dot (e.g., `#8AB4F8` for Next Exam, `#72C99A` for Ready) alongside `label-md` tracking text.
- Inner data blocks sit on `#252830` with `12px` internal padding and `10px` radius.

### 2. Bottom Navigation (3 Tabs)
- Height: `64px`, mounted fixed to bottom safe area, backed by `#14161B` with 90% opacity and `backdrop-filter: blur(16px)`.
- Active tab renders `#8AB4F8` filled linear icon and label; inactive tabs render `#A5A8B0` outline icons with labels hidden or rendered in `label-sm`.
- Top edge: Hairline border `rgba(255, 255, 255, 0.06)`.

### 3. Floating Action Button (Contextual FAB)
- Height: `52px`, pill or rounded-rect (`16px`), background `#8AB4F8`, text/icon `#101114` (600 weight).
- Floats `16px` above the bottom navigation bar on the right margin.
- Accompanied by haptic feedback on actuation; expands dynamically when contextual actions arise (e.g., "+ Add Subject", "Log Hours").

### 4. Bottom Sheets
- Rounded top corners (`24px`), background `#1B1D22`, border-top `1px solid rgba(255, 255, 255, 0.12)`.
- Features a centered drag handle: `36px × 4px`, `rgba(255, 255, 255, 0.24)`, `pill-rounded`.
- Default peek height `50%` viewport, expandable to `90%`.

### 5. Buttons
- **Primary**: Background `#8AB4F8`, color `#101114`, `12px` radius, `headline-sm` / `title-sm` font weight, `44px` height.
- **Secondary / Tonal**: Background `#252830`, color `#F5F5F5`, border `1px solid rgba(255, 255, 255, 0.08)`.
- **Ghost**: Transparent background, text `#8AB4F8`, hover/pressed state `rgba(138, 180, 248, 0.08)`.

### 6. Chips & Badges
- Pill-shaped (`999px`), `26px` height, `10px` horizontal padding.
- Neutral variant: Background `#252830`, text `#A5A8B0`.
- Active variant: Background `rgba(138, 180, 248, 0.14)`, border `1px solid rgba(138, 180, 248, 0.3)`, text `#8AB4F8`.

### 7. Input Fields
- Height `48px`, background `#16181D`, border `1px solid rgba(255, 255, 255, 0.10)`, `12px` radius, `body-md` text `#F5F5F5`.
- Focus state: Border color `#8AB4F8`, outline none.
- Label: `label-md` uppercase above input in `#A5A8B0`.

### 8. Progress Metrics (Exam & Syllabus)
- Continuous track: `6px` height, `#252830` background, rounded `999px`.
- Indicator fill: Linear gradient between `#8AB4F8` and `#A78BFA` or semantic solid (`#72C99A` for syllabus completion).
- Accompanying numeric summary: Tabular mono-spaced digits indicating percentage and pending revision count.