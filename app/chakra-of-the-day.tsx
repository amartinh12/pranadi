import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  chakraColors,
  neutralColors,
  welcomeColors,
  spacing,
  fontSize,
} from '../theme/tokens';
import { chakras } from '../content/chakras';

export default function ChakraOfTheDayScreen() {
  const router = useRouter();
  const { chakraId } = useLocalSearchParams<{ chakraId?: string }>();

  // Look up the chosen chakra; default to root if param missing or unrecognised
  const chakra =
    chakras.find(c => c.id === chakraId) ??
    chakras.find(c => c.id === 'root') ??
    chakras[0];

  const accent = chakraColors[chakra.colorToken];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Colour orb ── */}
        <View style={[styles.orb, { backgroundColor: accent }]} />

        {/* ── Chakra name ── */}
        <Text style={[styles.chakraName, { color: accent }]}>
          {chakra.displayName.en}
        </Text>

        {/* ── Descriptor ── */}
        <Text style={styles.descriptor}>{chakra.descriptor.en}</Text>

        {/* ── Divider ── */}
        <View style={[styles.divider, { backgroundColor: accent }]} />

        {/* ── Affirmation ── */}
        <View style={[styles.card, styles.affirmationCard, { borderLeftColor: accent }]}>
          <Text style={styles.cardLabel}>Affirmation</Text>
          <Text style={styles.affirmationText}>{chakra.affirmation.en}</Text>
        </View>

        {/* ── Journal prompt ── */}
        <View style={[styles.card, styles.journalCard]}>
          <Text style={styles.cardLabel}>Journal prompt</Text>
          <Text style={styles.journalText}>{chakra.journalPrompt.en}</Text>
        </View>

        <View style={styles.spacer} />

        {/* ── Continue ── */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: accent, shadowColor: accent }]}
          onPress={() => router.push('/intensity')}
          activeOpacity={0.82}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: neutralColors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },

  // ── Orb ──────────────────────────────────────────────────────────────────
  orb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    opacity: 0.85,
    marginBottom: spacing.lg,
  },

  // ── Chakra name ───────────────────────────────────────────────────────────
  chakraName: {
    fontSize: fontSize.heading,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: 0.3,
  },

  // ── Descriptor ───────────────────────────────────────────────────────────
  descriptor: {
    fontSize: fontSize.body,
    fontStyle: 'italic',
    color: neutralColors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 300,
    marginBottom: spacing.lg,
  },

  // ── Divider ───────────────────────────────────────────────────────────────
  divider: {
    width: 40,
    height: 2,
    borderRadius: 1,
    opacity: 0.5,
    marginBottom: spacing.lg,
  },

  // ── Cards ─────────────────────────────────────────────────────────────────
  card: {
    width: '100%',
    backgroundColor: neutralColors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  affirmationCard: {
    borderLeftWidth: 4,
  },
  journalCard: {
    borderWidth: 1,
    borderColor: neutralColors.border,
  },
  cardLabel: {
    fontSize: fontSize.small,
    fontWeight: '600',
    color: neutralColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  affirmationText: {
    fontSize: fontSize.body,
    color: neutralColors.textPrimary,
    lineHeight: 26,
    fontWeight: '500',
  },
  journalText: {
    fontSize: fontSize.body,
    color: neutralColors.textPrimary,
    lineHeight: 26,
  },

  // ── Spacer ────────────────────────────────────────────────────────────────
  spacer: {
    height: spacing.lg,
  },

  // ── Button ────────────────────────────────────────────────────────────────
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: 36,
    borderRadius: 50,
    gap: spacing.sm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 7,
    marginBottom: spacing.md,
    width: '100%',
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
