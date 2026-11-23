import { Image, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Text } from '../components/Text';
import { StartOver } from '../components/StartOver';
import { useRouter } from 'expo-router';
import { fonts, neutralColors } from '../theme/tokens';

// Watercolour artwork with the two card outlines painted into it. It is the original
// illustration with extra plain paper added between the lotus and the cards (so it
// fills tall phones without stretching anything). All text and tap targets are real UI,
// placed from the artwork's own geometry (measured in the artwork's pixels below).
const artwork = require('../assets/choose-path.jpg');
const ART_W = 941;
const ART_H = 2072;
const CARD_Y0 = 1191;
const CARD_Y1 = 1752;
const LEFT_CARD = { x0: 50, x1: 456 };
const RIGHT_CARD = { x0: 484, x1: 893 };
const TEXT_Y0 = 1405;   // below each card's little illustration
const TEXT_Y1 = 1650;   // above the hills inside each card
const HEADING_Y0 = 760; // open paper between the lotus and the cards
const HEADING_Y1 = 1000;
const PAPER = '#FFF1E0'; // the artwork's paper colour (shows only beside the art on short screens)

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function BranchScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // Phones are taller than the artwork, so "cover" it (a hair of the paper is trimmed at
  // the top and bottom). On short or wide screens, fit it whole instead.
  const tall = height / width >= 1.95;
  const scale = tall ? Math.max(width / ART_W, height / ART_H) : Math.min(width / ART_W, height / ART_H);
  const left0 = (width - ART_W * scale) / 2;
  const top0 = (height - ART_H * scale) / 2;
  const X = (x: number) => left0 + x * scale;
  const Y = (y: number) => top0 + y * scale;

  const cardW = (LEFT_CARD.x1 - LEFT_CARD.x0) * scale;
  const titleSize = clamp(cardW * 0.105, 14, 21);
  const descSize = clamp(cardW * 0.073, 11, 14.5);
  const headingSize = clamp(width * 0.088, 26, 38);

  const cards = [
    {
      key: 'focus',
      rect: LEFT_CARD,
      title: "I'll choose\nmy focus",
      label: "I'll choose my focus",
      description: "Pick the area you'd like to work on.",
      onPress: () => router.push('/check-in'),
    },
    {
      key: 'checkin',
      rect: RIGHT_CARD,
      title: 'Check in with\nyourself',
      label: 'Check in with yourself',
      description: 'Answer a few questions to discover which chakra needs care.',
      onPress: () => router.push('/quiz'),
    },
  ];

  return (
    <View style={styles.screen}>
      <Image
        source={artwork}
        style={{ position: 'absolute', left: left0, top: top0, width: ART_W * scale, height: ART_H * scale }}
        accessible={false}
      />

      {/* ── Heading, in the open paper between the lotus and the cards ── */}
      <View style={[styles.headingBox, { top: Y(HEADING_Y0), height: (HEADING_Y1 - HEADING_Y0) * scale }]}>
        <Text
          style={[styles.heading, { fontSize: headingSize, lineHeight: headingSize * 1.25 }]}
          accessibilityRole="header"
        >
          How would you like{'\n'}to begin today?
        </Text>
      </View>

      {/* ── The two cards: the whole card is the tap target ── */}
      {cards.map(card => (
        <Pressable
          key={card.key}
          onPress={card.onPress}
          accessibilityRole="button"
          accessibilityLabel={`${card.label}. ${card.description}`}
          style={({ pressed }) => [
            styles.card,
            {
              left: X(card.rect.x0),
              top: Y(CARD_Y0),
              width: (card.rect.x1 - card.rect.x0) * scale,
              height: (CARD_Y1 - CARD_Y0) * scale,
              borderRadius: 52 * scale,
              backgroundColor: pressed ? 'rgba(32, 36, 53, 0.05)' : 'transparent',
            },
          ]}
        >
          <View
            style={[
              styles.cardText,
              { top: (TEXT_Y0 - CARD_Y0) * scale, height: (TEXT_Y1 - TEXT_Y0) * scale, paddingHorizontal: cardW * 0.08 },
            ]}
          >
            <Text style={[styles.cardTitle, { fontSize: titleSize, lineHeight: titleSize * 1.25 }]}>{card.title}</Text>
            <Text style={[styles.cardDescription, { fontSize: descSize, lineHeight: descSize * 1.4 }]}>
              {card.description}
            </Text>
          </View>
        </Pressable>
      ))}

      <StartOver plain />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PAPER,
  },
  headingBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontFamily: fonts.heading,
    color: neutralColors.textPrimary,
    textAlign: 'center',
  },
  card: {
    position: 'absolute',
  },
  cardText: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: fonts.heading,
    color: neutralColors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  cardDescription: {
    color: neutralColors.textSecondary,
    textAlign: 'center',
  },
});
