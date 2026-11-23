import { Image, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Text } from '../components/Text';
import { StartOver } from '../components/StartOver';
import { ChakraSymbol } from '../components/ChakraSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { chakraColors, fonts, neutralColors } from '../theme/tokens';
import { chakras } from '../content/chakras';

// Chakra introduction. The watercolour (botanical corners and hills only, no symbol or
// cards) is shared by all seven chakras; the symbol, divider, affirmation accent and
// Continue button take the chosen chakra's colour. Everything written is real UI.
const artwork = require('../assets/chakra-intro.jpg');
const ART_W = 941;
const ART_H = 2072;
const HILLS_TOP = 1815; // where the painted hills begin, in artwork pixels
const PAPER = '#FDEDDC';
const CARD = '#FEFCFA';
const CARD_BORDER = '#D9D1C8';

// Readable label colour on a chakra-coloured surface
function onColor(hex: string) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
  );
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return 1.05 / (L + 0.05) >= 4.5 ? '#FFFFFF' : neutralColors.textPrimary;
}

export default function ChakraOfTheDayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { chakraId } = useLocalSearchParams<{ chakraId?: string }>();

  // Look up the chosen chakra; default to root if param missing or unrecognised
  const chakra =
    chakras.find(c => c.id === chakraId) ??
    chakras.find(c => c.id === 'root') ??
    chakras[0];
  const accent = chakraColors[chakra.colorToken];
  const ink = onColor(accent);

  // Cover the screen on tall phones, fit whole on short/wide ones
  const tall = height / width >= 1.95;
  const scale = tall ? Math.max(width / ART_W, height / ART_H) : Math.min(width / ART_W, height / ART_H);
  const left0 = (width - ART_W * scale) / 2;
  const top0 = (height - ART_H * scale) / 2;
  const hillsY = top0 + HILLS_TOP * scale;

  const BUTTON_H = 56;
  const footerBottom = Math.max(insets.bottom + 12, height - hillsY + 4);
  const symbol = Math.min(Math.max(width * 0.27, 96), 130);
  const titleSize = Math.min(Math.max(width * 0.092, 32), 38);

  return (
    <View style={styles.screen}>
      <Image
        source={artwork}
        style={{ position: 'absolute', left: left0, top: top0, width: ART_W * scale, height: ART_H * scale }}
        accessible={false}
      />

      <ScrollView
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: footerBottom + BUTTON_H + 10 }}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 14 }]}
        showsVerticalScrollIndicator={false}
      >
        <ChakraSymbol id={chakra.colorToken} color={accent} mantra={chakra.mantra} size={symbol} onColor={ink} />

        <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.2 }]} accessibilityRole="header">
          {chakra.displayName.en}
        </Text>

        <Text style={styles.descriptor}>{chakra.descriptor.en}</Text>

        <View style={[styles.divider, { backgroundColor: accent }]} />

        {/* ── Affirmation ── */}
        <View style={styles.card}>
          <View style={[styles.bar, { backgroundColor: accent }]} />
          <Text style={styles.label}>AFFIRMATION</Text>
          <Text style={styles.cardText}>“{chakra.affirmation.en}”</Text>
        </View>

        {/* ── Journal prompt ── */}
        <View style={styles.card}>
          <View style={[styles.bar, { backgroundColor: '#D3CAC0' }]} />
          <Text style={styles.label}>JOURNAL PROMPT</Text>
          <Text style={styles.cardText}>“{chakra.journalPrompt.en}”</Text>
        </View>
      </ScrollView>

      {/* ── Continue, above the hills ── */}
      <View style={[styles.footer, { bottom: footerBottom }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: accent, height: BUTTON_H }]}
          onPress={() => router.push({ pathname: '/intensity', params: { chakraId: chakra.id } })}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          <Text style={[styles.buttonText, { color: ink }]}>Continue</Text>
          <Text style={[styles.buttonText, { color: ink }]}>→</Text>
        </TouchableOpacity>
      </View>

      <StartOver plain />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PAPER },
  scroll: { alignItems: 'center', paddingHorizontal: 28, paddingBottom: 12 },
  title: {
    fontFamily: fonts.heading,
    color: neutralColors.textPrimary,
    textAlign: 'center',
    marginTop: 14,
  },
  descriptor: {
    fontFamily: fonts.italic,
    fontSize: 17,
    lineHeight: 26,
    color: neutralColors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 330,
  },
  divider: { width: 46, height: 3, borderRadius: 2, marginTop: 18, marginBottom: 20 },
  card: {
    width: '100%',
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: CARD_BORDER,
    borderRadius: 26,
    paddingVertical: 18,
    paddingLeft: 26,
    paddingRight: 22,
    marginBottom: 14,
  },
  bar: { position: 'absolute', left: -1, top: -1, bottom: -1, width: 7, borderRadius: 4 },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 1.6,
    color: neutralColors.textSecondary,
    marginBottom: 8,
  },
  cardText: {
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 27,
    color: neutralColors.textPrimary,
    textAlign: 'left',
  },
  footer: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 56,
    borderRadius: 28,
    gap: 8,
  },
  buttonText: { fontFamily: fonts.bodyMedium, fontSize: 17, letterSpacing: 0.5 },
});
