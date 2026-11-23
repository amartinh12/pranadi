import { useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../components/Text';
import { StartOver } from '../components/StartOver';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { chakraColors, neutralColors, welcomeColors, spacing, fontSize } from '../theme/tokens';

const bodyImage = require('../assets/welcome-background.jpg'); // same artwork as the welcome screen

// Natural size of the artwork (941 × 1672)
const IMG_W = 941;
const IMG_H = 1672;

// Tap zones, one per glowing chakra in the image. `f` is the glow's centre as a
// fraction of image height (measured from the artwork; the figure is centred
// horizontally). The artwork has eight glows for seven chakras: the amber glow
// between yellow and orange counts as Solar Plexus, so both glows select it.
const CHAKRA_ZONES = [
  { id: 'crown'       as const, f: 0.3798, label: 'Crown' },
  { id: 'thirdEye'    as const, f: 0.4127, label: 'Third Eye' },
  { id: 'throat'      as const, f: 0.4988, label: 'Throat' },
  { id: 'heart'       as const, f: 0.5460, label: 'Heart' },
  { id: 'solarPlexus' as const, f: 0.5933, label: 'Solar Plexus' },
  { id: 'solarPlexus' as const, f: 0.6370, label: 'Solar Plexus' },
  { id: 'sacral'      as const, f: 0.6818, label: 'Sacral' },
  { id: 'root'        as const, f: 0.7255, label: 'Root' },
];
const FIRST_GLOW = 0.3798;
const LAST_GLOW  = 0.7255;
const COLUMN_CENTRE = (FIRST_GLOW + LAST_GLOW) / 2;

type ChakraId = (typeof CHAKRA_ZONES)[number]['id'];

const ZONE_RADIUS = 24; // tap target half-size in points (48pt diameter)

export default function CheckInScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<ChakraId | null>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  function onContainerLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ w: width, h: height });
  }

  // Zoom the artwork so the column of chakras fills most of the available height
  // (never smaller than "cover", so there are no empty edges), centred on the column.
  const { w: cw, h: ch } = containerSize;
  let imgW = 0, imgH = 0, imgLeft = 0, imgTop = 0;
  if (cw > 0 && ch > 0) {
    const coverScale = Math.max(cw / IMG_W, ch / IMG_H);
    const columnScale = (ch * 0.72) / ((LAST_GLOW - FIRST_GLOW) * IMG_H);
    const scale = Math.max(coverScale, columnScale);
    imgW = IMG_W * scale;
    imgH = IMG_H * scale;
    imgLeft = (cw - imgW) / 2;
    imgTop = Math.min(0, Math.max(ch - imgH, ch / 2 - COLUMN_CENTRE * imgH));
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
        {cw > 0 && (
          <Image
            source={bodyImage}
            style={{ position: 'absolute', left: imgLeft, top: imgTop, width: imgW, height: imgH }}
          />
        )}

        {/* Render zones only once layout is known */}
        {cw > 0 && CHAKRA_ZONES.map((zone, index) => {
          const isSelected = selected === zone.id;
          const color = chakraColors[zone.id];
          // Shrink a zone if its neighbours are closer than a full tap circle
          const neighbours = [CHAKRA_ZONES[index - 1], CHAKRA_ZONES[index + 1]].filter(Boolean);
          const nearest = Math.min(...neighbours.map(n => Math.abs(n!.f - zone.f) * imgH));
          const r = Math.min(ZONE_RADIUS, Math.max(14, nearest / 2));
          const left = imgLeft + imgW * 0.5 - r;
          const top  = imgTop  + imgH * zone.f - r;
          return (
            <TouchableOpacity
              key={`${zone.id}-${index}`}
              style={[
                styles.zone,
                {
                  left,
                  top,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: r,
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

      <StartOver />
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
    overflow: 'hidden',
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
