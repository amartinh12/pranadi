import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { neutralColors, spacing, fontSize } from '../theme/tokens';
import { chakras } from '../content/chakras';

export default function IntensityScreen() {
  const router = useRouter();
  const { chakraId } = useLocalSearchParams<{ chakraId?: string }>();
  const sessions = chakras.find(c => c.id === chakraId)?.sessions;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Intensity</Text>

      {sessions ? (
        sessions.map(session => (
          <TouchableOpacity
            key={session.level}
            style={styles.button}
            onPress={() =>
              router.push({ pathname: '/practice', params: { chakraId, level: session.level } })
            }
          >
            <Text style={styles.buttonText}>
              {session.name.en} · {session.minutes} min
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        // Chakras without sessions yet keep the original single button
        <TouchableOpacity style={styles.button} onPress={() => router.push('/practice')}>
          <Text style={styles.buttonText}>Start practice</Text>
        </TouchableOpacity>
      )}
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
  button: {
    backgroundColor: neutralColors.textPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  buttonText: {
    color: neutralColors.surface,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});
