import { useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { chakraColors, neutralColors, welcomeColors, spacing, fontSize } from '../theme/tokens';

const bodyImage = require('../assets/checkin-body.png');

// Natural image size after optimization: 430 × 929
const IMG_ASPECT = 430 / 929; // ≈ 0.463 (portrait)

// Seven chakra tap zones — topFrac is the fraction of image height to the centre of each dot
const CHAKRA_ZONES = [
  { id: 'crown'       as const, topFrac: 0.20, label: 'Crown' },
  { id: 'thirdEye'    as const, topFrac: 0.28, label: 'Third Eye' },
  { id: 'throat'      as const, topFrac: 0.37, label: 'Throat' },
  { id: 'heart'       as const, topFrac: 0.46, label: 'Heart' },
  { id: 'solarPlexus' as const, topFrac: 0.55, label: 'Solar Plexus' },
  { id: 'sacral'      as const, topFrac: 0.63, label: 'Sacral' },
  { id: 'root'        as const, topFrac: 0.71, label: 'Root' },
];

type ChakraId = (typeof CHAKRA_ZONES)[number]['id'];

const ZONE_RADIUS = 26; // tap target half-size in points (52pt diameter)

export default function CheckInScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<ChakraId | null>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  function onContainerLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ w: width, h: height });
  }

  // Compute displayed image bounds within the flex container (resizeMode="contain")
  const { w: cw, h: ch } = containerSize;
  let imgW = 0, imgH = 0, imgLeft = 0, imgTop = 0;
  if (cw > 0 && ch > 0) {
    if (cw / ch > IMG_ASPECT) {
      // Container is wider than the image — image fills height
      imgH = ch;
      imgW = ch * IMG_ASPECT;
    } else {
      // Container is taller than the image — image fills width
      imgW = cw;
      imgH = cw / IMG_ASPECT;
    }
    imgLeft = (cw - imgW) / 2;
    imgTop  = (ch - imgH) / 2;
  }

  function handleZonePress(id: ChakraId) {
    setSelected(prev => (prev === id ? null : id));
  }

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Heading ── */}
      <View style={styles.headerArea}>
        <Text style={styles.heading}>Where do you feel it today?</Text>
        <Text style={styles.subheading}>Tap the area that calls your attention.</Text>
      </View>

      {/* ── Body image + tap zones ── */}
      <View style={styles.imageWrapper} onLayout={onContainerLayout}>
        <Image source={bodyImage} style={styles.bodyImage} resizeMode="contain" />

        {/* Render zones only once layout is known */}
        {cw > 0 && CHAKRA_ZONES.map((zone) => {
          const isSelected = selected === zone.id;
          const color = chakraColors[zone.id];
          const left = imgLeft + imgW * 0.5 - ZONE_RADIUS;
          const top  = imgTop  + imgH * zone.topFrac - ZONE_RADIUS;
          return (
            <TouchableOpacity
              key={zone.id}
              style={[
                styles.zone,
                {
                  left,
                  top,
                  borderColor:       isSelected ? color : 'transparent',
                  backgroundColor:   isSelected ? `${color}40` : 'transparent',
                  shadowColor:       color,
                  shadowOpacity:     isSelected ? 0.65 : 0,
                },
              ]}
              onPress={() => handleZonePress(zone.id)}
              activeOpacity={0.7}
              accessibilityLabel={`${zone.label} chakra`}
              accessibilityRole="button"
            />
          );
        })}
      </View>

      {/* ── Continue button ── */}
      {/* Empty selection is allowed; falls back to root chakra as default */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push(
              `/chakra-of-the-day?chakraId=${selected ?? 'root'}` as never,
            )
          }
          activeOpacity={0.82}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: neutralColors.background,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  headerArea: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  heading: {
    fontSize: fontSize.heading,
    fontWeight: '700',
    color: neutralColors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subheading: {
    fontSize: fontSize.body,
    color: neutralColors.textSecondary,
    textAlign: 'center',
  },

  // ── Image wrapper ───────────────────────────────────────────────────────────
  imageWrapper: {
    flex: 1,
    position: 'relative',
  },
  bodyImage: {
    width: '100%',
    height: '100%',
  },

  // ── Tap zones ──────────────────────────────────────────────────────────────
  zone: {
    position: 'absolute',
    width:  ZONE_RADIUS * 2,
    height: ZONE_RADIUS * 2,
    borderRadius: ZONE_RADIUS,
    borderWidth: 2.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 4,
  },

  // ── Bottom area ─────────────────────────────────────────────────────────────
  bottomArea: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: welcomeColors.deepIndigo,
    paddingVertical: spacing.md,
    paddingHorizontal: 36,
    borderRadius: 50,
    gap: spacing.sm,
    shadowColor: welcomeColors.deepIndigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 7,
  },
  buttonText: {
    color: neutralColors.surface,
    fontSize: fontSize.body,
    fontWeight: '600',
    letterSpacing: 1,
  },
  buttonArrow: {
    color: neutralColors.surface,
    fontSize: fontSize.body,
    fontWeight: '400',
  },
});
