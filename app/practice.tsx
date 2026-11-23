import { useEffect, useRef, useState } from 'react';
import {
  Alert, Animated, Easing, Image, StyleSheet, TouchableOpacity, View, useWindowDimensions,
} from 'react-native';
import { Text } from '../components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { chakraDeep, fonts, neutralColors, poseColors, spacing, fontSize } from '../theme/tokens';
import { Chakra, chakras, SessionStep } from '../content/chakras';
import { poseImages } from '../content/poseImages';

const rootSymbol = require('../assets/root-symbol.png');

const formatTime = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;

// Small sprout line icon, drawn with plain Views (no icon library)
function SproutIcon({ color }: { color: string }) {
  return (
    <View style={styles.sprout}>
      <View style={[styles.sproutStem, { backgroundColor: color }]} />
      <View style={[styles.sproutLeaf, styles.sproutLeafLeft, { borderColor: color }]} />
      <View style={[styles.sproutLeaf, styles.sproutLeafRight, { borderColor: color }]} />
    </View>
  );
}

// One page of the practice, all on one screen: a centered card with the chakra
// header, pose name, illustration (blends into the card), description,
// qualities and the countdown. The big button below starts the timer, then
// pauses/resumes it, and becomes Next once the time is up. The timer lives only
// in this component's state and starts fresh on each page.
function StepPage({
  step, seconds, chakra, accent, label, isLast, onBack, onNext, onExit,
}: {
  step: SessionStep; seconds: number; chakra: Chakra; accent: string; label: string;
  isLast: boolean; onBack?: () => void; onNext: () => void; onExit: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const compact = windowHeight < 740; // smaller phones: tighter text, no qualities row
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(seconds);
  const progress = useRef(new Animated.Value(0)).current;
  const image = poseImages[step.key];

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

  // The main button: Start → Pause/Resume → Next (or Finish)
  const buttonLabel = !started ? 'Start' : done ? (isLast ? 'Finish' : 'Next') : running ? 'Pause' : 'Resume';
  const onButtonPress = () => {
    if (!started) {
      setStarted(true);
      setRunning(true);
    } else if (done) {
      onNext();
    } else {
      setRunning(r => !r);
    }
  };

  const qualities = chakra.qualities?.en ?? [];

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.xs }]}>
      {/* Header: exit on the left, progress centered */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerSide} onPress={onExit} accessibilityLabel="Exit practice" hitSlop={8}>
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.progressLabel}>{label}</Text>
        <View style={styles.headerSide} />
      </View>

      <View style={styles.cardWrap}>
        <View style={[styles.card, compact && styles.cardCompact]}>
          {/* Chakra header */}
          {chakra.id === 'root' ? (
            // Painted Root lotus (cut out, transparent) in place of the seed-sound circle
            <Image
              source={rootSymbol}
              style={{ width: compact ? 46 : 58, height: compact ? 47 : 60 }}
              resizeMode="contain"
              accessible={false}
            />
          ) : (
            <View style={[styles.symbol, compact && styles.symbolCompact, { backgroundColor: accent }]}>
              <Text style={styles.symbolText}>{chakra.mantra}</Text>
            </View>
          )}
          <Text style={[styles.chakraSanskrit, { color: accent }]}>{chakra.sanskritName.toUpperCase()}</Text>
          <Text style={styles.chakraEnglish}>{chakra.displayName.en}</Text>

          {/* Pose name */}
          <Text style={[styles.poseName, compact && styles.poseNameCompact]}>{step.name.en}</Text>
          {step.sanskrit && <Text style={[styles.poseSanskrit, { color: accent }]}>{step.sanskrit}</Text>}

          {/* Illustration: takes all the space left, same colour as the card so it blends in */}
          <View style={styles.imageBox}>
            {image && <Image source={image} style={styles.image} resizeMode="contain" />}
          </View>

          <View style={styles.divider} />

          <Text style={[styles.description, compact && styles.descriptionCompact]}>{step.description.en}</Text>

          {!compact && qualities.length > 0 && (
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

          {/* Countdown: shows the suggested time until started */}
          <Text style={[styles.timerText, { color: accent }]}>{done ? 'Done' : formatTime(remaining)}</Text>
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
      </View>

      {/* Bottom bar: Back · main button · Skip */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={styles.sideSlot}>
          {onBack && (
            <TouchableOpacity onPress={onBack} hitSlop={8}>
              <Text style={styles.sideText}>Back</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: accent }]}
          onPress={onButtonPress}
          activeOpacity={0.85}
          accessibilityLabel={buttonLabel}
        >
          <Text style={styles.mainButtonText}>{buttonLabel}</Text>
        </TouchableOpacity>
        <View style={[styles.sideSlot, styles.sideSlotRight]}>
          {!done && (
            <TouchableOpacity onPress={onNext} hitSlop={8} accessibilityLabel={isLast ? 'Finish early' : 'Skip to next'}>
              <Text style={styles.sideText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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

  return (
    <StepPage
      key={current.step.key}
      step={current.step}
      seconds={seconds}
      chakra={chakra}
      accent={accent}
      label={`${session.name.en} · ${current.section} · ${index + 1} of ${steps.length}`}
      isLast={isLast}
      onBack={isFirst ? undefined : () => setIndex(i => i - 1)}
      onNext={() => (isLast ? router.push('/closing-reflection') : setIndex(i => i + 1))}
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
    height: 36,
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

  // ── Card (fills the space between header and bottom bar) ───────────────────
  cardWrap: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  card: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    backgroundColor: poseColors.card,
    borderRadius: 24,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    shadowColor: '#202435',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 3,
  },
  cardCompact: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  // Chakra header
  symbol: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  symbolText: {
    fontSize: 13,
    letterSpacing: 1.5,
    color: '#FFFFFF',
  },
  chakraSanskrit: {
    fontFamily: fonts.heading,
    fontSize: 12,
    letterSpacing: 3.5,
    marginTop: spacing.sm,
  },
  chakraEnglish: {
    fontSize: 13,
    color: poseColors.gray,
    marginTop: 1,
  },
  poseName: {
    fontFamily: fonts.heading,
    fontSize: 28,
    color: poseColors.title,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  poseNameCompact: {
    fontSize: 24,
    marginTop: spacing.xs,
  },
  poseSanskrit: {
    fontFamily: fonts.headingItalic,
    fontSize: 17,
    textAlign: 'center',
    marginTop: 1,
  },

  // Illustration
  imageBox: {
    flex: 1,
    alignSelf: 'stretch',
    minHeight: 60,
    marginTop: spacing.xs,
  },
  image: {
    flex: 1,
    width: '100%',
  },

  divider: {
    width: '85%',
    height: 1,
    backgroundColor: poseColors.hairline,
    marginVertical: spacing.sm,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4A4A4A',
    textAlign: 'center',
  },
  descriptionCompact: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Qualities
  qualities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
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

  // Countdown
  timerText: {
    fontFamily: fonts.bodyBold,
    fontSize: 34,
    letterSpacing: 1,
    marginTop: spacing.sm,
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

  // Sprout icon
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

  // ── Bottom bar ─────────────────────────────────────────────────────────────
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  sideSlot: {
    width: 56,
    alignItems: 'flex-start',
  },
  sideSlotRight: {
    alignItems: 'flex-end',
  },
  sideText: {
    fontSize: fontSize.body,
    color: poseColors.gray,
    fontWeight: '600',
  },
  mainButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 28,
    marginHorizontal: spacing.sm,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
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
