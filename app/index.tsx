import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { fonts, neutralColors, spacing, fontSize } from '../theme/tokens';

// Text-free watercolour illustration; everything written on the screen is real UI on top of it
const artwork = require('../assets/welcome-art.jpg');

// Welcome: the illustration fills the screen. Heading and divider sit near the top,
// the subtitle and Begin near the bottom, all inside the safe areas.
export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <Image source={artwork} style={styles.artwork} resizeMode="cover" accessible={false} />

      {/* ── Top: heading + divider ── */}
      <View style={[styles.top, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.title} accessibilityRole="header">PraNadi</Text>
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerDiamond}>◆</Text>
          <View style={styles.dividerLine} />
        </View>
      </View>

      <View style={styles.spacer} />

      {/* ── Bottom: subtitle + Begin ── */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.md }]}>
        <Text style={styles.subtitle}>
          A space to reconnect with the language of your energy.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/intro')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Begin"
        >
          <Text style={styles.buttonText}>Begin</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </View>
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

  // ── Top ───────────────────────────────────────────────────────────────────
  top: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 40,
    letterSpacing: 2,
    color: neutralColors.textPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '46%',
    marginTop: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: neutralColors.textPrimary,
    opacity: 0.4,
  },
  dividerDiamond: {
    fontSize: 8,
    color: neutralColors.textPrimary,
    opacity: 0.6,
    marginHorizontal: spacing.sm,
  },

  spacer: {
    flex: 1,
  },

  // ── Bottom ────────────────────────────────────────────────────────────────
  bottom: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  subtitle: {
    fontSize: fontSize.body,
    lineHeight: 24,
    color: neutralColors.textSecondary,
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: spacing.lg,
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
    fontWeight: '600',
    letterSpacing: 1,
  },
  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '400',
  },
});
