import { useState } from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Text } from '../components/Text';
import { StartOver } from '../components/StartOver';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { chakraColors, fonts, neutralColors } from '../theme/tokens';

// Watercolour artwork with the seven chakra symbols painted into it. It is the original
// illustration with extra plain paper added above the figure (so it fills tall phones
// without stretching, and leaves room for the heading). The symbols are NOT redrawn:
// invisible touch targets sit over them, placed from the artwork's own geometry, so they
// stay aligned at any screen size. Positions below are in the artwork's pixels.
const artwork = require('../assets/select-chakra.jpg');
const ART_W = 941;
const ART_H = 2072;
const FIGURE_X = 471; // the symbols sit on the figure's centre line
const HEADING_Y0 = 335; // open paper above the figure (below the corner branches)
const HEADING_Y1 = 700;
const PAPER = '#FDEDDC'; // the artwork's paper colour (shows only beside the art on short screens)

// Top to bottom
const CHAKRA_ZONES = [
  { id: 'crown'       as const, y: 894,  label: 'Crown' },
  { id: 'thirdEye'    as const, y: 977,  label: 'Third Eye' },
  { id: 'throat'      as const, y: 1166, label: 'Throat' },
  { id: 'heart'       as const, y: 1272, label: 'Heart' },
  { id: 'solarPlexus' as const, y: 1390, label: 'Solar Plexus' },
  { id: 'sacral'      as const, y: 1509, label: 'Sacral' },
  { id: 'root'        as const, y: 1623, label: 'Root' },
];

type ChakraId = (typeof CHAKRA_ZONES)[number]['id'];

const MIN_TARGET = 44; // accessible minimum touch target, in points
const RING = 54;       // selection ring diameter, in points

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function CheckInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [selected, setSelected] = useState<ChakraId | null>(null);

  // Phones are taller than the artwork, so "cover" it (a hair of paper is trimmed at the top
  // and bottom). On short or wide screens, fit it whole instead.
  const tall = height / width >= 1.95;
  const scale = tall ? Math.max(width / ART_W, height / ART_H) : Math.min(width / ART_W, height / ART_H);
  const left0 = (width - ART_W * scale) / 2;
  const top0 = (height - ART_H * scale) / 2;
  const X = (x: number) => left0 + x * scale;
  const Y = (y: number) => top0 + y * scale;

  const target = Math.max(MIN_TARGET, 70 * scale);
  const headingSize = clamp(width * 0.088, 28, 38);
  const subSize = clamp(width * 0.043, 15, 18);

  function handleZonePress(id: ChakraId) {
    setSelected(prev => (prev === id ? null : id));
  }

  const canContinue = selected !== null;

  return (
    <View style={styles.screen}>
      <Image
        source={artwork}
        style={{ position: 'absolute', left: left0, top: top0, width: ART_W * scale, height: ART_H * scale }}
        accessible={false}
      />

      {/* ── Heading, in the open paper above the figure ── */}
      <View style={[styles.headingBox, { top: Y(HEADING_Y0), height: (HEADING_Y1 - HEADING_Y0) * scale }]}>
        <Text
          style={[styles.heading, { fontSize: headingSize, lineHeight: headingSize * 1.25 }]}
          accessibilityRole="header"
        >
          Where do you{'\n'}feel it today?
        </Text>
        <Text style={[styles.subheading, { fontSize: subSize }]}>Tap the area that calls your attention.</Text>
      </View>

      {/* ── Selection ring: drawn only for the chosen chakra, over its painted symbol ── */}
      {CHAKRA_ZONES.map(zone =>
        selected === zone.id ? (
          <View
            key={`ring-${zone.id}`}
            pointerEvents="none"
            style={[
              styles.ring,
              {
                left: X(FIGURE_X) - RING / 2,
                top: Y(zone.y) - RING / 2,
                width: RING,
                height: RING,
                borderRadius: RING / 2,
                borderColor: chakraColors[zone.id],
                backgroundColor: `${chakraColors[zone.id]}26`,
              },
            ]}
          />
        ) : null,
      )}

      {/* ── Seven invisible touch targets over the painted symbols ── */}
      {CHAKRA_ZONES.map(zone => (
        <Pressable
          key={zone.id}
          onPress={() => handleZonePress(zone.id)}
          accessibilityRole="button"
          accessibilityLabel={`${zone.label} chakra`}
          accessibilityState={{ selected: selected === zone.id }}
          style={{
            position: 'absolute',
            left: X(FIGURE_X) - target / 2,
            top: Y(zone.y) - target / 2,
            width: target,
            height: target,
            borderRadius: target / 2,
          }}
        />
      ))}

      {/* ── Continue: enabled once a chakra is chosen ── */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.button, !canContinue && styles.buttonDisabled]}
          onPress={() => canContinue && router.push(`/chakra-of-the-day?chakraId=${selected}` as never)}
          activeOpacity={canContinue ? 0.85 : 1}
          disabled={!canContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          accessibilityState={{ disabled: !canContinue }}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <StartOver plain />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PAPER,
  },
  headingBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  heading: {
    fontFamily: fonts.heading,
    color: neutralColors.textPrimary,
    textAlign: 'center',
  },
  subheading: {
    color: neutralColors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  ring: {
    position: 'absolute',
    borderWidth: 2.5,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: neutralColors.textPrimary,
    paddingVertical: 16,
    paddingHorizontal: 56,
    borderRadius: 28,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '400',
  },
});
