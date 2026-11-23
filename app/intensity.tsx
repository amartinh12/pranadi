import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../components/Text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { chakraColors, neutralColors, spacing, fontSize } from '../theme/tokens';
import { chakras } from '../content/chakras';

// Dark text on light chakra colors (e.g. yellow), white text on the rest
function readableOn(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7 ? neutralColors.textPrimary : neutralColors.surface;
}

export default function IntensityScreen() {
  const router = useRouter();
  const { chakraId } = useLocalSearchParams<{ chakraId?: string }>();
  const chakra = chakras.find(c => c.id === chakraId);
  const sessions = chakra?.sessions;

  // The chosen chakra's color; falls back to the brand indigo if none was passed
  const accent = chakra ? chakraColors[chakra.colorToken] : neutralColors.textPrimary;
  const onAccent = readableOn(accent);

  return (
    <View style={[styles.container, { backgroundColor: chakra ? `${accent}1F` : neutralColors.background }]}>
      <Text style={[styles.heading, { color: accent }]}>Choose your rhythm</Text>

      {sessions ? (
        sessions.map(session => (
          <TouchableOpacity
            key={session.level}
            style={[styles.button, { backgroundColor: accent }]}
            onPress={() =>
              router.push({ pathname: '/practice', params: { chakraId, level: session.level } })
            }
          >
            <Text style={[styles.buttonText, { color: onAccent }]}>
              {session.name.en} · {session.minutes} min
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        // Chakras without sessions yet keep the original single button
        <TouchableOpacity style={[styles.button, { backgroundColor: accent }]} onPress={() => router.push('/practice')}>
          <Text style={[styles.buttonText, { color: onAccent }]}>Start practice</Text>
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
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  buttonText: {
    color: neutralColors.surface,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});
