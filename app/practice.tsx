import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Alert, Animated, Easing, Image, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions,
} from 'react-native';
import { Text } from '../components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { chakraDeep, fonts, neutralColors, poseColors, spacing, fontSize } from '../theme/tokens';
import { Chakra, chakras, SessionStep } from '../content/chakras';
import { poseImages } from '../content/poseImages';

const formatTime = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;

// ─── Small line icons, drawn with plain Views (no icon library) ───────────────

function ClockIcon({ color }: { color: string }) {
  return (
    <View style={[styles.clock, { borderColor: color }]}>
      <View style={[styles.clockHandUp, { backgroundColor: color }]} />
      <View style={[styles.clockHandSide, { backgroundColor: color }]} />
    </View>
  );
}

function SproutIcon({ color }: { color: string }) {
  return (
    <View style={styles.sprout}>
      <View style={[styles.sproutStem, { backgroundColor: color }]} />
      <View style={[styles.sproutLeaf, styles.sproutLeafLeft, { borderColor: color }]} />
      <View style={[styles.sproutLeaf, styles.sproutLeafRight, { borderColor: color }]} />
    </View>
  );
}

// One page of the practice: a centered card with the chakra header, pose name,
// illustration (blends into the card), description, qualities and a quiet
// "Start" timer row. Its timer lives only in this component's state and starts
// fresh on each page.
function StepPage({
  step, seconds, chakra, accent, label, nav, onExit,
}: {
  step: SessionStep; seconds: number; chakra: Chakra; accent: string;
  label: string; nav: ReactNode; onExit: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(seconds);
  const progress = useRef(new Animated.Value(0)).current;
  const image = poseImages[step.key];
  const imageHeight = Math.min(360, Math.max(240, windowHeight * 0.38));

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const fill = Animated.timing(progress, {
      toValue: (seconds - remaining + 1) / seconds,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    fill.start();
    const tick = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => {
      fill.stop();
      clearTimeout(tick);
    };
  }, [running, remaining, seconds, progress]);

  const done = remaining <= 0;

  const onStartPress = () => {
    if (!started) {
      setStarted(true);
      setRunning(true);
    } else if (!done) {
      setRunning(r => !r);
    }
  };

  const qualities = chakra.qualities?.en ?? [];
  const startLabel = !started ? 'Start' : done ? 'Done' : formatTime(remaining);
  const caption = !started || done ? '' : running ? 'Tap to pause' : 'Paused · tap to resume';

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.sm }]}>
      {/* Header: exit on the left, progress centered */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerSide} onPress={onExit} accessibilityLabel="Exit practice" hitSlop={8}>
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.progressLabel}>{label}</Text>
        <View style={styles.headerSide} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Chakra header */}
          <View style={[styles.symbol, { backgroundColor: accent }]}>
            <Text style={styles.symbolText}>{chakra.mantra}</Text>
          </View>
          <Text style={[styles.chakraSanskrit, { color: accent }]}>{chakra.sanskritName.toUpperCase()}</Text>
          <Text style={styles.chakraEnglish}>{chakra.displayName.en}</Text>

          {/* Pose name */}
          <Text style={styles.poseName}>{step.name.en}</Text>
          {step.sanskrit && <Text style={[styles.poseSanskrit, { color: accent }]}>{step.sanskrit}</Text>}

          {/* Illustration: same colour as the card, so it blends in */}
          <View style={[styles.imageBox, { height: imageHeight }]}>
            {image && <Image source={image} style={styles.image} resizeMode="contain" />}
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{step.description.en}</Text>

          {qualities.length > 0 && (
            <View style={styles.qualities}>
              <SproutIcon color={accent} />
              {qualities.map((q, i) => (
                <View key={q} style={styles.qualityItem}>
                  {i > 0 && <View style={[styles.qualityDot, { backgroundColor: accent }]} />}
                  <Text style={styles.qualityText}>{q}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Start: a quiet inline row; the countdown replaces the word once running */}
          <TouchableOpacity
            style={styles.startRow}
            onPress={onStartPress}
            activeOpacity={0.6}
            accessibilityLabel={!started ? 'Start timer' : running ? 'Pause timer' : 'Resume timer'}
          >
            <View style={styles.startLine} />
            <View style={styles.startCenter}>
              <ClockIcon color={accent} />
              <Text style={[styles.startText, { color: accent }]}>{startLabel}</Text>
            </View>
            <View style={styles.startLine} />
          </TouchableOpacity>
          <Text style={styles.caption}>{caption}</Text>

          {/* Very thin progress line */}
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.fill,
                {
                  backgroundColor: accent,
                  width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>

      {/* Back / Next sit below the card */}
      <View style={[styles.navWrap, { paddingBottom: insets.bottom + spacing.sm }]}>{nav}</View>
    </View>
  );
}

export default function PracticeScreen() {
  const router = useRouter();
  const { chakraId, level } = useLocalSearchParams<{ chakraId?: string; level?: string }>();
  const [index, setIndex] = useState(0);

  const chakra = chakras.find(c => c.id === chakraId);
  const session = chakra?.sessions?.find(s => s.level === level);

  // Chakras without sessions yet keep the simple placeholder
  if (!chakra || !session) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.heading}>Practice</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/closing-reflection')}>
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const accent = chakraDeep[chakra.colorToken];
  const steps = [
    ...session.warmups.map(step => ({ step, section: 'Warm-up' })),
    ...session.poses.map(step => ({ step, section: 'Pose' })),
  ];
  // Suggested time: the session length shared evenly, rounded to 5 seconds
  const seconds = Math.max(15, Math.round(((session.minutes * 60) / steps.length) / 5) * 5);

  const current = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  const nav = (
    <View style={styles.nav}>
      {isFirst ? (
        <View style={styles.navSpacer} />
      ) : (
        <TouchableOpacity style={styles.backButton} onPress={() => setIndex(i => i - 1)}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: accent }]}
        onPress={() => (isLast ? router.push('/closing-reflection') : setIndex(i => i + 1))}
      >
        <Text style={styles.buttonText}>{isLast ? 'Finish' : 'Next'}</Text>
      </TouchableOpacity>
      <View style={styles.navSpacer} />
    </View>
  );

  return (
    <StepPage
      key={current.step.key}
      step={current.step}
      seconds={seconds}
      chakra={chakra}
      accent={accent}
      label={`${session.name.en} · ${current.section} · ${index + 1} of ${steps.length}`}
      nav={nav}
      onExit={() =>
        Alert.alert('End practice?', 'You will go back to the beginning.', [
          { text: 'Keep going', style: 'cancel' },
          { text: 'End practice', style: 'destructive', onPress: () => router.dismissAll() },
        ])
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: poseColors.page,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  headerSide: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  exitText: {
    fontSize: fontSize.title,
    color: poseColors.gray,
  },
  progressLabel: {
    flex: 1,
    fontSize: fontSize.small,
    letterSpacing: 1.5,
    color: poseColors.gray,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    backgroundColor: poseColors.card,
    borderRadius: 24,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    shadowColor: '#2D2B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 3,
  },

  // Chakra header
  symbol: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontSize: 14,
    letterSpacing: 1.5,
    color: '#FFFFFF',
  },
  chakraSanskrit: {
    fontFamily: fonts.heading,
    fontSize: 12,
    letterSpacing: 3.5,
    marginTop: spacing.sm + 2,
  },
  chakraEnglish: {
    fontSize: 13,
    color: poseColors.gray,
    marginTop: 2,
  },
  poseName: {
    fontFamily: fonts.heading,
    fontSize: 30,
    color: poseColors.title,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  poseSanskrit: {
    fontFamily: fonts.headingItalic,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 2,
  },

  // Illustration
  imageBox: {
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
  image: {
    flex: 1,
    width: '100%',
  },

  divider: {
    width: '85%',
    height: 1,
    backgroundColor: poseColors.hairline,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: fontSize.body,
    lineHeight: 24,
    color: '#4A4A4A',
    textAlign: 'center',
  },

  // Qualities
  qualities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  qualityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qualityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: spacing.sm,
  },
  qualityText: {
    fontSize: 14,
    color: poseColors.gray,
  },

  // Start row
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
  startLine: {
    flex: 1,
    height: 1,
    backgroundColor: poseColors.hairline,
  },
  startCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  startText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  caption: {
    fontSize: fontSize.small,
    color: poseColors.gray,
    marginTop: spacing.xs,
    height: 16,
  },
  track: {
    alignSelf: 'stretch',
    height: 2,
    backgroundColor: poseColors.hairline,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  fill: {
    height: 2,
  },

  // Icons
  clock: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
  },
  clockHandUp: {
    position: 'absolute',
    left: 7,
    top: 3,
    width: 1.5,
    height: 6,
  },
  clockHandSide: {
    position: 'absolute',
    left: 7,
    top: 8,
    width: 5,
    height: 1.5,
  },
  sprout: {
    width: 20,
    height: 20,
    marginRight: spacing.xs,
  },
  sproutStem: {
    position: 'absolute',
    left: 9,
    top: 7,
    width: 1.5,
    height: 12,
  },
  sproutLeaf: {
    position: 'absolute',
    width: 9,
    height: 6,
    borderWidth: 1.5,
    borderRadius: 4,
    top: 5,
  },
  sproutLeafLeft: {
    left: 1,
    transform: [{ rotate: '-30deg' }],
  },
  sproutLeafRight: {
    left: 10,
    transform: [{ rotate: '30deg' }],
  },

  // ── Navigation (below the card) ────────────────────────────────────────────
  navWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navSpacer: {
    width: 80,
  },
  backButton: {
    width: 80,
    paddingVertical: spacing.md,
  },
  backText: {
    fontSize: fontSize.body,
    color: poseColors.gray,
    fontWeight: '600',
  },
  nextButton: {
    paddingVertical: 15,
    paddingHorizontal: 52,
    borderRadius: 28,
  },

  // ── Placeholder (chakras without sessions yet) ─────────────────────────────
  placeholder: {
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
  },
  buttonText: {
    color: neutralColors.surface,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});
