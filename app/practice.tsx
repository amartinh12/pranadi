import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { neutralColors, spacing, fontSize } from '../theme/tokens';
import { chakras } from '../content/chakras';

export default function PracticeScreen() {
  const router = useRouter();
  const { chakraId, level } = useLocalSearchParams<{ chakraId?: string; level?: string }>();
  const session = chakras
    .find(c => c.id === chakraId)
    ?.sessions?.find(s => s.level === level);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {session ? `${session.name.en} · ${session.minutes} min` : 'Practice'}
      </Text>

      {session && (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {session.warmups.length > 0 && <Text style={styles.sectionLabel}>Warm-up</Text>}
          {session.warmups.map((w, i) => (
            <Text key={w.key} style={styles.item}>{i + 1}. {w.name.en}</Text>
          ))}

          <Text style={styles.sectionLabel}>Poses</Text>
          {session.poses.map((p, i) => (
            <Text key={p.key} style={styles.item}>{i + 1}. {p.name.en}</Text>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.push('/closing-reflection')}>
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutralColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  heading: {
    fontSize: fontSize.heading,
    color: neutralColors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xl,
  },
  list: {
    alignSelf: 'stretch',
    flexGrow: 0,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: fontSize.small,
    color: neutralColors.textSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  item: {
    fontSize: fontSize.body,
    color: neutralColors.textPrimary,
    paddingVertical: spacing.xs,
  },
  button: {
    backgroundColor: neutralColors.textPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  buttonText: {
    color: neutralColors.surface,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});
