import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { neutralColors, welcomeColors, spacing, fontSize } from '../theme/tokens';

export default function IntroScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* ── Heading ── */}
        <Text style={styles.heading}>Welcome to PraNadi.</Text>

        {/* ── Decorative divider ── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerDiamond}>◆</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Body text ── */}
        <Text style={styles.body}>
          Throughout the day, energy can get stuck in any of your seven chakras.
          Each day, we'll help you check in, find the one that needs care, and
          give you a short practice to bring it back into balance.
        </Text>

        {/* ── Spacer ── */}
        <View style={styles.spacer} />

        {/* ── Continue button ── */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/branch')}
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: spacing.xl * 2,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },

  // ── Heading ────────────────────────────────────────────────────────────────
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: neutralColors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: spacing.lg,
  },

  // ── Divider ────────────────────────────────────────────────────────────────
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: neutralColors.textPrimary,
    opacity: 0.35,
  },
  dividerDiamond: {
    fontSize: 8,
    color: neutralColors.textPrimary,
    opacity: 0.5,
    marginHorizontal: spacing.sm,
  },

  // ── Body ───────────────────────────────────────────────────────────────────
  body: {
    fontSize: fontSize.title,
    color: neutralColors.textSecondary,
    textAlign: 'center',
    lineHeight: 32,
    maxWidth: 320,
  },

  // ── Spacer ─────────────────────────────────────────────────────────────────
  spacer: {
    flex: 1,
  },

  // ── Button ─────────────────────────────────────────────────────────────────
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
    marginBottom: spacing.md,
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
