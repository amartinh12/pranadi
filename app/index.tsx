import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { neutralColors, welcomeColors, spacing, fontSize } from '../theme/tokens';

const bgImage = require('../assets/welcome-background.jpg');

export default function WelcomeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ PlayfairDisplay_700Bold });

  if (!fontsLoaded) return null;

  return (
    <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>

        {/* ── Top area: title + divider + tagline ── */}
        <View style={styles.topArea}>
          <Text style={styles.title}>PraNadi</Text>

          {/* Decorative divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerDiamond}>◆</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.tagline}>
            A space to reconnect with the language of your energy.
          </Text>
        </View>

        {/* ── Spacer — lets the artwork breathe ── */}
        <View style={styles.spacer} />

        {/* ── Bottom area: Begin button ── */}
        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/intro')}
            activeOpacity={0.82}
          >
            <Text style={styles.buttonText}>Begin</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },

  // ── Top section ──────────────────────────────────────────────────────────
  topArea: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: welcomeColors.scrimLight,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 40,
    color: neutralColors.textPrimary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    marginBottom: spacing.md,
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
  tagline: {
    fontSize: fontSize.body,
    color: neutralColors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },

  // ── Middle ───────────────────────────────────────────────────────────────
  spacer: {
    flex: 1,
  },

  // ── Bottom section ───────────────────────────────────────────────────────
  bottomArea: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: welcomeColors.scrimLight,
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
