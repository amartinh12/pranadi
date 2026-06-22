import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { neutralColors, welcomeColors, spacing, fontSize } from '../theme/tokens';

export default function BranchScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* ── Heading ── */}
        <Text style={styles.heading}>How would you like{'\n'}to begin today?</Text>

        {/* ── Cards row ── */}
        <View style={styles.cardsRow}>

          {/* Card 1 — I'll choose my focus */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/check-in')}
            activeOpacity={0.78}
          >
            <Text style={styles.cardLabel}>I'll choose{'\n'}my focus</Text>
            <Text style={styles.cardSubtitle}>Pick the area yourself</Text>
          </TouchableOpacity>

          {/* Card 2 — Help me find it */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/quiz')}
            activeOpacity={0.78}
          >
            <Text style={styles.cardLabel}>Help me{'\n'}find it</Text>
            <Text style={styles.cardSubtitle}>Answer a few questions</Text>
          </TouchableOpacity>

        </View>

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
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },

  // ── Heading ───────────────────────────────────────────────────────────────
  heading: {
    fontSize: fontSize.heading,
    fontWeight: '700',
    color: neutralColors.textPrimary,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: spacing.xl,
  },

  // ── Cards row ─────────────────────────────────────────────────────────────
  cardsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  card: {
    flex: 1,
    backgroundColor: neutralColors.surface,
    borderRadius: 16,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: neutralColors.border,
    // Shadow
    shadowColor: neutralColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    // Allow height to grow with content
    minHeight: 160,
  },
  cardLabel: {
    fontSize: fontSize.title,
    fontWeight: '600',
    color: neutralColors.textPrimary,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: spacing.sm,
  },
  cardSubtitle: {
    fontSize: fontSize.small,
    color: neutralColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
