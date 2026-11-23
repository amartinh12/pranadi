import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from './Text';
import { neutralColors, spacing, fontSize } from '../theme/tokens';

// A small "Start over" button for the top-right corner of every screen after the
// welcome screen. It returns to the beginning. Nothing is saved, so starting over
// simply drops whatever the person had chosen so far.
export function StartOver({ confirm = true }: { confirm?: boolean }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goToStart = () => {
    if (router.canDismiss()) router.dismissAll();
    else router.replace('/');
  };

  const onPress = () => {
    if (!confirm) return goToStart();
    Alert.alert('Start over?', 'You will go back to the beginning.', [
      { text: 'Stay', style: 'cancel' },
      { text: 'Start over', style: 'destructive', onPress: goToStart },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.button, { top: insets.top }]}
      onPress={onPress}
      accessibilityLabel="Start over"
      hitSlop={8}
    >
      <Text style={styles.text}>↺ Start over</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: spacing.md,
    zIndex: 10,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  text: {
    fontSize: fontSize.small,
    fontWeight: '500',
    color: neutralColors.textSecondary,
  },
});
