import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../components/Text';
import { StartOver } from '../components/StartOver';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { chakraColors, neutralColors, spacing, fontSize } from '../theme/tokens';
import { chakras } from '../content/chakras';

// "Choose your rhythm": the page and heading stay in the classic ink-on-ivory theme;
// the chosen chakra's colour appears only as a small accent on each choice.
export default function IntensityScreen() {
  const router = useRouter();
  const { chakraId } = useLocalSearchParams<{ chakraId?: string }>();
  const chakra = chakras.find(c => c.id === chakraId);
  const sessions = chakra?.sessions;
  const accent = chakra ? chakraColors[chakra.colorToken] : neutralColors.border;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose your rhythm</Text>

      {sessions ? (
        sessions.map(session => (
          <TouchableOpacity
            key={session.level}
            style={styles.button}
            onPress={() =>
              router.push({ pathname: '/practice', params: { chakraId, level: session.level } })
            }
          >
            <View style={[styles.dot, { backgroundColor: accent }]} />
            <Text style={styles.buttonText}>
              {session.name.en} · {session.minutes} min
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        // Chakras without sessions yet keep the original single button
        <TouchableOpacity style={styles.button} onPress={() => router.push('/practice')}>
          <View style={[styles.dot, { backgroundColor: accent }]} />
          <Text style={styles.buttonText}>Start practice</Text>
        </TouchableOpacity>
      )}
      <StartOver />
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: neutralColors.textPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 28,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  buttonText: {
    color: neutralColors.surface,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});
