import { Stack } from 'expo-router';
import { neutralColors } from '../theme/tokens';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: neutralColors.background },
      }}
    />
  );
}
