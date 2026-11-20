import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { neutralColors } from '../theme/tokens';

// Only the font files we actually use are required here. Importing from the
// font packages' main entry would bundle every weight and bloat the app.
const FONT_FILES = {
  PlayfairDisplay_700Bold: require('@expo-google-fonts/playfair-display/700Bold/PlayfairDisplay_700Bold.ttf'),
  DMSans_400Regular: require('@expo-google-fonts/dm-sans/400Regular/DMSans_400Regular.ttf'),
  DMSans_400Regular_Italic: require('@expo-google-fonts/dm-sans/400Regular_Italic/DMSans_400Regular_Italic.ttf'),
  DMSans_500Medium: require('@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf'),
  DMSans_600SemiBold: require('@expo-google-fonts/dm-sans/600SemiBold/DMSans_600SemiBold.ttf'),
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts(FONT_FILES);

  if (!fontsLoaded) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: neutralColors.background },
      }}
    />
  );
}
