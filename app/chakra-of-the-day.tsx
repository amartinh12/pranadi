import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { neutralColors, spacing, fontSize } from '../theme/tokens';

export default function ChakraOfTheDayScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chakra of the Day</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/intensity')}>
        <Text style={styles.buttonText}>Choose intensity</Text>
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
