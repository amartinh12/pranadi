import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { fonts, poseColors, welcomeColors, spacing, fontSize } from '../theme/tokens';

// Artwork already blended onto the card colour, so it melts into the card
const cardImage = require('../assets/welcome-card.jpg');

// Welcome: the same centered-card look as the pose screens. The artwork fills
// the card, the title and tagline sit below it, and Begin sits under the card.
export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.cardWrap}>
        <View style={styles.card}>
          <View style={styles.imageBox}>
            <Image source={cardImage} style={styles.image} resizeMode="contain" />
          </View>

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
      </View>

      {/* Begin sits below the card */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/intro')}
          activeOpacity={0.85}
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
    backgroundColor: poseColors.page,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  cardWrap: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  card: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    backgroundColor: poseColors.card,
    borderRadius: 24,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    shadowColor: '#2D2B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 3,
  },
  imageBox: {
    flex: 1,
    alignSelf: 'stretch',
    minHeight: 120,
  },
  image: {
    flex: 1,
    width: '100%',
  },

  // ── Title block ────────────────────────────────────────────────────────────
  title: {
    fontFamily: fonts.heading,
    fontSize: 40,
    letterSpacing: 2,
    color: poseColors.title,
    marginTop: spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    marginVertical: spacing.sm + 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: poseColors.hairline,
  },
  dividerDiamond: {
    fontSize: 8,
    color: welcomeColors.deepIndigo,
    opacity: 0.6,
    marginHorizontal: spacing.sm,
  },
  tagline: {
    fontSize: fontSize.body,
    color: poseColors.gray,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },

  // ── Begin ──────────────────────────────────────────────────────────────────
  bottomBar: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: welcomeColors.deepIndigo,
    paddingVertical: 16,
    paddingHorizontal: 52,
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
