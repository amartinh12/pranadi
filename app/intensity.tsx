import { useState } from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Text } from '../components/Text';
import { StartOver } from '../components/StartOver';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { chakraColors, fonts, neutralColors } from '../theme/tokens';
import { chakras } from '../content/chakras';

// "How much time feels right today?" Watercolour artwork with the heading, card text,
// selection and Continue as real UI on top. The painted cards, illustrations and circles
// are part of the artwork; the touch areas and selection marks are placed from its own
// geometry (artwork pixels below), so they stay aligned at any screen size.
// One page per chakra, all with the same geometry. Third Eye has no artwork yet and uses
// the Root page.
const rootArtwork = require('../assets/rhythm-art.jpg');
const ARTWORK: Record<string, number> = {
  root: rootArtwork,
  sacral: require('../assets/rhythm-art-sacral.jpg'),
  solarPlexus: require('../assets/rhythm-art-solar-plexus.jpg'),
  heart: require('../assets/rhythm-art-heart.jpg'),
  throat: require('../assets/rhythm-art-throat.jpg'),
  crown: require('../assets/rhythm-art-crown.jpg'),
};
const ART_W = 941;
const ART_H = 2072;
const HILLS_TOP = 1845;
const PAPER = '#FDEDDC';
const HEADING_Y0 = 475;
const HEADING_Y1 = 740;
const CARD_X0 = 75;
const CARD_X1 = 866;
const RADIO_X = 785; // centre of the painted circle
const TEXT_X0 = 395; // text starts right of the painted sun/moon
const TEXT_X1 = 745;

const CARDS = [
  { level: 'pause',   name: 'Pause',   minutes: 5,  line: 'A gentle moment to reset.',        y0: 766,  y1: 1018, radioY: 882 },
  { level: 'flow',    name: 'Flow',    minutes: 20, line: 'Settle into a guided practice.',   y0: 1048, y1: 1299, radioY: 1164 },
  { level: 'journey', name: 'Journey', minutes: 45, line: 'A deeper experience.',             y0: 1329, y1: 1580, radioY: 1445 },
] as const;

type Level = (typeof CARDS)[number]['level'];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function onColor(hex: string) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
  );
  return 1.05 / (0.2126 * r + 0.7152 * g + 0.0722 * b + 0.05) >= 4.5 ? '#FFFFFF' : neutralColors.textPrimary;
}

export default function IntensityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { chakraId } = useLocalSearchParams<{ chakraId?: string }>();
  const chakra = chakras.find(c => c.id === chakraId);
  const accent = chakra ? chakraColors[chakra.colorToken] : chakraColors.root;
  const ink = onColor(accent);
  const [selected, setSelected] = useState<Level | null>(null);

  const tall = height / width >= 1.95;
  const scale = tall ? Math.max(width / ART_W, height / ART_H) : Math.min(width / ART_W, height / ART_H);
  const left0 = (width - ART_W * scale) / 2;
  const top0 = (height - ART_H * scale) / 2;
  const X = (x: number) => left0 + x * scale;
  const Y = (y: number) => top0 + y * scale;

  const headingSize = clamp(width * 0.084, 28, 34);
  const titleSize = clamp(width * 0.06, 20, 24);
  const bodySize = clamp(width * 0.036, 13, 16);
  const radius = 66 * scale;
  const ring = 56 * scale;
  const BUTTON_H = 56;
  const footerBottom = Math.max(insets.bottom + 12, height - Y(HILLS_TOP) + 4);

  // Minutes and levels are the session's own when the chakra has them
  const minutesFor = (level: Level, fallback: number) =>
    chakra?.sessions?.find(s => s.level === level)?.minutes ?? fallback;

  const go = () => {
    if (!selected) return;
    router.push({ pathname: '/practice', params: { chakraId, level: selected } });
  };

  return (
    <View style={styles.screen}>
      <Image
        source={ARTWORK[chakra?.colorToken ?? 'root'] ?? rootArtwork}
        style={{ position: 'absolute', left: left0, top: top0, width: ART_W * scale, height: ART_H * scale }}
        accessible={false}
      />

      {/* ── Heading ── */}
      <View style={[styles.headingBox, { top: Y(HEADING_Y0), height: (HEADING_Y1 - HEADING_Y0) * scale }]}>
        <Text style={[styles.heading, { fontSize: headingSize, lineHeight: headingSize * 1.22 }]} accessibilityRole="header">
          How much time{'\n'}feels right today?
        </Text>
        <Text style={[styles.sub, { fontSize: clamp(width * 0.041, 14, 17) }]}>Choose the practice that fits your day.</Text>
      </View>

      {/* ── Three cards: whole card is the touch target ── */}
      {CARDS.map(card => {
        const on = selected === card.level;
        const cardLeft = X(CARD_X0);
        const cardTop = Y(card.y0);
        const cardW = (CARD_X1 - CARD_X0) * scale;
        const cardH = (card.y1 - card.y0) * scale;
        return (
          <Pressable
            key={card.level}
            onPress={() => setSelected(card.level)}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${card.name}, ${minutesFor(card.level, card.minutes)} minutes. ${card.line}`}
            style={{ position: 'absolute', left: cardLeft, top: cardTop, width: cardW, height: cardH, borderRadius: radius }}
          >
            {on && (
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  borderRadius: radius, borderWidth: 2.5, borderColor: accent, backgroundColor: `${accent}14`,
                }}
              />
            )}
            <View
              pointerEvents="none"
              style={{ position: 'absolute', left: (TEXT_X0 - CARD_X0) * scale, width: (TEXT_X1 - TEXT_X0) * scale, top: 0, bottom: 0, justifyContent: 'center' }}
            >
              <Text style={{ fontFamily: fonts.heading, fontSize: titleSize, color: neutralColors.textPrimary }}>{card.name}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: bodySize, color: neutralColors.textPrimary, marginTop: 2 }}>
                {minutesFor(card.level, card.minutes)} min
              </Text>
              <Text style={{ fontFamily: fonts.body, fontSize: bodySize, lineHeight: bodySize * 1.35, color: neutralColors.textSecondary, marginTop: 4 }}>
                {card.line}
              </Text>
            </View>
            {/* selection circle: filled in the chakra colour when chosen (covers the painted ring) */}
            {on && (
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: (RADIO_X - CARD_X0) * scale - ring / 2,
                  top: cardH / 2 - ring / 2,
                  width: ring, height: ring, borderRadius: ring / 2,
                  backgroundColor: accent, alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ color: ink, fontSize: ring * 0.5, fontFamily: fonts.bodyBold }}>✓</Text>
              </View>
            )}
          </Pressable>
        );
      })}

      {/* ── Continue ── */}
      <View style={[styles.footer, { bottom: footerBottom }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: accent, height: BUTTON_H }, !selected && styles.disabled]}
          onPress={go}
          disabled={!selected}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          accessibilityState={{ disabled: !selected }}
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
  headingBox: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  heading: { fontFamily: fonts.heading, color: neutralColors.textPrimary, textAlign: 'center' },
  sub: { fontFamily: fonts.body, color: neutralColors.textSecondary, textAlign: 'center', marginTop: 10 },
  footer: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 56, borderRadius: 28, gap: 8 },
  disabled: { opacity: 0.35 },
  buttonText: { fontFamily: fonts.bodyMedium, fontSize: 17, letterSpacing: 0.5 },
});
