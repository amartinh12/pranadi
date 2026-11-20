import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { neutralColors, spacing, fontSize } from '../theme/tokens';
import { chakras, SessionStep } from '../content/chakras';
import { poseImages } from '../content/poseImages';

function StepRow({ step, number }: { step: SessionStep; number: number }) {
  const image = poseImages[step.key];
  return (
    <View style={styles.row}>
      {image && <Image source={image} style={styles.thumb} resizeMode="cover" />}
      <Text style={styles.item}>{number}. {step.name.en}</Text>
    </View>
  );
}

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
            <StepRow key={w.key} step={w} number={i + 1} />
          ))}

          <Text style={styles.sectionLabel}>Poses</Text>
          {session.poses.map((p, i) => (
            <StepRow key={p.key} step={p} number={i + 1} />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  thumb: {
    width: 56,
    height: 84,
    borderRadius: 8,
    marginRight: spacing.md,
    backgroundColor: neutralColors.border,
  },
  item: {
    flex: 1,
    fontSize: fontSize.body,
    color: neutralColors.textPrimary,
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
