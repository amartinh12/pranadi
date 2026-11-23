import { Image, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Text } from '../components/Text';
import { StartOver } from '../components/StartOver';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { fonts, neutralColors, spacing } from '../theme/tokens';

// Watercolour background: lotus and olive branches at the top, open ivory paper in
// the middle, terracotta hills at the bottom. All text on the screen is real UI.
const artwork = require('../assets/welcome-intro.jpg');
const ART_W = 941;
const ART_H = 1671;
// Where things sit inside the artwork, as fractions of its height
const LOTUS_BOTTOM = 0.33; // lotus (and its reflection of hills) ends here
const HILLS_TOP = 0.795;   // bottom hills begin here

export default function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  // The artwork is shown "cover" (never stretched). Work out where the open paper
  // area sits on this particular screen so the text never touches the lotus or hills.
  const scale = Math.max(width / ART_W, height / ART_H);
  const shownH = ART_H * scale;
  const top0 = (height - shownH) / 2;
  const openTop = Math.max(insets.top, top0 + LOTUS_BOTTOM * shownH) + spacing.sm;
  const openBottom = top0 + HILLS_TOP * shownH - spacing.sm;
  const openHeight = Math.max(200, openBottom - openTop);

  const compact = openHeight < 330; // smaller phones: slightly smaller type
  const headingSize = compact ? 30 : 36;
  const bodySize = compact ? 15 : 17;

  return (
    <View style={styles.screen}>
      <Image source={artwork} style={styles.artwork} resizeMode="cover" accessible={false} />

      {/* ── Middle: heading, divider, explanation ── */}
      <View style={[styles.open, { top: openTop, height: openHeight }]}>
        <Text
          style={[styles.heading, { fontSize: headingSize, lineHeight: headingSize * 1.2 }]}
          accessibilityRole="header"
        >
          Welcome to{'\n'}PraNadi.
        </Text>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerDiamond}>◆</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={[styles.body, { fontSize: bodySize, lineHeight: bodySize * 1.5, maxWidth: width * 0.85 }]}>
          Throughout the day, energy can get stuck in any of your seven chakras.
          Each day, we'll help you check in, find the one that needs care, and
          give you a short practice to bring it back into balance.
        </Text>
      </View>

      {/* ── Lower: Continue, over the hills ── */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/branch')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Continue"
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
    backgroundColor: neutralColors.background,
  },
  artwork: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  // ── Middle ────────────────────────────────────────────────────────────────
  open: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  heading: {
    fontFamily: fonts.heading,
    color: neutralColors.textPrimary,
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '42%',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#A89F94', // taupe
  },
  dividerDiamond: {
    fontSize: 8,
    color: '#A89F94',
    marginHorizontal: spacing.sm,
  },
  body: {
    color: neutralColors.textSecondary,
    textAlign: 'center',
  },

  // ── Lower ─────────────────────────────────────────────────────────────────
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
    gap: spacing.sm,
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
