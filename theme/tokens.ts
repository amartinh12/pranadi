// ─── Chakra Colors ───────────────────────────────────────────────────────────
// Soft, calm tones chosen for a wellness app context.
export const chakraColors = {
  root:        '#C44E52', // Red       — grounded, earthy rose-red
  sacral:      '#F28C4B', // Orange    — warm terracotta
  solarPlexus: '#F2C94C', // Yellow    — soft golden yellow
  heart:       '#6DBF7B', // Mint Green — calm sage-mint
  throat:      '#5DADE2', // Sky Blue  — gentle sky blue
  thirdEye:    '#6C63FF', // Indigo    — muted indigo-violet
  crown:       '#B284E6', // Violet    — soft lavender
} as const;

// ─── Neutral Colors ───────────────────────────────────────────────────────────
export const neutralColors = {
  background:    '#F6F4F9', // soft lavender-tinted white page background
  surface:       '#FFFFFF', // card / sheet surface
  textPrimary:   '#2D2B6B', // deep indigo — PraNadi brand, body copy and buttons
  textSecondary: '#6E6C8F', // muted indigo-grey for captions / labels
  border:        '#E4E1EE', // subtle divider / stroke
} as const;

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Loaded once in app/_layout.tsx. Use the <Text> in components/Text.tsx, which
// picks from these automatically.
export const fonts = {
  body:       'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold:   'DMSans_600SemiBold',
  italic:     'DMSans_400Regular_Italic',
  heading:    'PlayfairDisplay_700Bold',
} as const;

// ─── Spacing Scale ────────────────────────────────────────────────────────────
export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  40,
} as const;

// ─── Font Size Scale ──────────────────────────────────────────────────────────
export const fontSize = {
  small:   12,
  body:    16,
  title:   20,
  heading: 28,
} as const;

// ─── Welcome Screen Colors ────────────────────────────────────────────────────
export const welcomeColors = {
  deepIndigo:  '#2D2B6B', // pill button background
  scrimLight:  'rgba(247, 245, 242, 0.52)', // subtle light scrim behind text
} as const;
