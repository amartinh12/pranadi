import { StyleSheet, Text as RNText, TextProps } from 'react-native';
import { fonts } from '../theme/tokens';

// App-wide text: picks the right brand font from each style's weight/size so
// screens don't have to set a font family themselves.
//   - large (28+) semi-bold/bold text  → Playfair Display (titles)
//   - everything else                  → DM Sans, by weight (italic supported)
// A style that sets its own fontFamily is left alone.
export function Text({ style, ...props }: TextProps) {
  const flat = StyleSheet.flatten(style) ?? {};
  if (flat.fontFamily) return <RNText {...props} style={style} />;

  const weight = Number(flat.fontWeight ?? 400);
  const size = typeof flat.fontSize === 'number' ? flat.fontSize : 16;

  let fontFamily: string = fonts.body;
  if (size >= 28 && weight >= 600) fontFamily = fonts.heading;
  else if (flat.fontStyle === 'italic') fontFamily = fonts.italic;
  else if (weight >= 600) fontFamily = fonts.bodyBold;
  else if (weight >= 500) fontFamily = fonts.bodyMedium;

  // Custom fonts carry their own weight/style, so neutralise the system ones
  return <RNText {...props} style={[style, { fontFamily, fontWeight: 'normal', fontStyle: 'normal' }]} />;
}
