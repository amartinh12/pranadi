import { ReactNode, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { chakraColors, neutralColors, spacing, fontSize } from '../theme/tokens';
import { chakras, SessionStep } from '../content/chakras';
import { poseImages } from '../content/poseImages';

const formatTime = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;

// One page of the practice, stacked top to bottom with nothing overlapping:
// header, pose name, full illustration, how-to, timer and navigation. Its timer
// lives only in this component's state and starts fresh on each page.
function StepPage({
  step, seconds, accent, label, nav, onExit,
}: { step: SessionStep; seconds: number; accent: string; label: string; nav: ReactNode; onExit: () => void }) {
  const insets = useSafeAreaInsets();
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

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.sm }]}>
      {/* Header: exit on the left, progress centered */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerSide}
          onPress={onExit}
          accessibilityLabel="Exit practice"
          hitSlop={8}
        >
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.progressLabel}>{label}</Text>
        <View style={styles.headerSide} />
      </View>

      <Text style={styles.stepName}>{step.name.en}</Text>

      {/* Illustration: scaled to fit the space available, never cropped */}
      <View style={styles.imageBox}>
        {image && <Image source={image} style={styles.image} resizeMode="contain" />}
      </View>

      <Text style={styles.description}>{step.description.en}</Text>

      <View style={styles.timerRow}>
        <Text style={[styles.time, { color: accent }]}>{done ? 'Done' : formatTime(remaining)}</Text>
        {!started && (
          <TouchableOpacity
            style={[styles.startButton, { borderColor: accent }]}
            onPress={() => {
              setStarted(true);
              setRunning(true);
            }}
            accessibilityLabel="Start timer"
          >
            <Text style={[styles.startText, { color: accent }]}>Start</Text>
          </TouchableOpacity>
        )}
        {started && !done && (
          <TouchableOpacity onPress={() => setRunning(r => !r)} accessibilityLabel={running ? 'Pause timer' : 'Resume timer'}>
            <Text style={styles.pause}>{running ? 'Pause' : 'Resume'}</Text>
          </TouchableOpacity>
        )}
      </View>
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

      {nav}
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

  const accent = chakraColors[chakra.colorToken];
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
    </View>
  );

  return (
    <StepPage
      key={current.step.key}
      step={current.step}
      seconds={seconds}
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
    backgroundColor: neutralColors.background,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSide: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  exitText: {
    fontSize: fontSize.title,
    color: neutralColors.textSecondary,
  },
  progressLabel: {
    flex: 1,
    fontSize: fontSize.small,
    color: neutralColors.textSecondary,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  stepName: {
    fontSize: fontSize.heading,
    color: neutralColors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  imageBox: {
    flex: 1,
    minHeight: 120,
    marginVertical: spacing.sm,
  },
  image: {
    flex: 1,
    width: '100%',
  },
  description: {
    fontSize: fontSize.body,
    color: neutralColors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  time: {
    fontSize: 36,
    fontWeight: '600',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: neutralColors.border,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
  pause: {
    fontSize: fontSize.body,
    color: neutralColors.textSecondary,
  },
  startButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    borderWidth: 2,
  },
  startText: {
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  navSpacer: {
    width: 80,
  },
  backButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  backText: {
    fontSize: fontSize.body,
    color: neutralColors.textSecondary,
    fontWeight: '600',
  },
  nextButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
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
    borderRadius: 12,
  },
  buttonText: {
    color: neutralColors.surface,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});
