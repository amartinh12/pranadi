// ─── Chakra Colors ───────────────────────────────────────────────────────────
// Soft, calm tones chosen for a wellness app context.
export const chakraColors = {
  root:        '#B33B3D', // Red
  sacral:      '#D98145', // Orange
  solarPlexus: '#DAAC40', // Yellow
  heart:       '#78946B', // Green
  throat:      '#6FA8B8', // Blue
  thirdEye:    '#555D91', // Indigo
  crown:       '#A17BA6', // Violet
} as const;

// ─── Neutral Colors ───────────────────────────────────────────────────────────
export const neutralColors = {
  background:    '#FCFAF6', // warm ivory page background
  surface:       '#FFFFFF', // card / sheet surface
  textPrimary:   '#202435', // deep ink — body copy, headings and primary buttons
  textSecondary: '#6A6662', // warm gray for captions / labels
  border:        '#D9D1C8', // warm divider / outline
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
  headingItalic: 'PlayfairDisplay_400Regular_Italic',
} as const;

// ─── Pose Screen ──────────────────────────────────────────────────────────────
// The card colour matches the illustrations' own background (about #FEFCF8), so
// pictures blend into the card with no visible edge.
export const poseColors = {
  page:     '#FCFAF6', // warm ivory behind the card
  card:     '#FEFCF8', // equals the artwork background
  title:    '#202435', // deep ink
  gray:     '#6A6662', // warm gray secondary text
  hairline: '#D9D1C8', // dividers
} as const;

// Kept as an alias so older imports keep working
export const chakraDeep = chakraColors; // one accent per chakra, used everywhere

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
  deepIndigo:  '#202435', // primary button background (deep ink)
  scrimLight:  'rgba(247, 245, 242, 0.52)', // subtle light scrim behind text
} as const;
