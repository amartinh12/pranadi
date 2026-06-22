import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  neutralColors,
  chakraColors,
  welcomeColors,
  spacing,
  fontSize,
} from '../theme/tokens';
import { chakras } from '../content/chakras';
import { QUESTIONS, scoreQuiz } from './quizData';

const OPTION_LABELS = ['Not at all', 'Sometimes', 'Often', 'Fully'] as const;

export default function QuizScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const [phase, setPhase] = useState<'quiz' | 'reveal'>('quiz');

  // ── Reveal phase ───────────────────────────────────────────────────────────
  if (phase === 'reveal') {
    const chakraId = scoreQuiz(answers);
    const chakra   = chakras.find(c => c.id === chakraId);
    const accent   = chakra ? chakraColors[chakra.colorToken] : welcomeColors.deepIndigo;
    const name     = chakra?.displayName.en ?? 'Your chakra';

    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.spacer} />

          {/* Colour accent */}
          <View style={[styles.revealOrb, { backgroundColor: accent }]} />

          <Text style={styles.revealHeading}>
            Your {name} is asking{'\n'}for care today.
          </Text>
          <Text style={styles.revealSub}>
            That's where we suggest beginning.
          </Text>

          <View style={styles.spacer} />

          {/* Navigate and pass the chakra id forward so a future step can use it */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: accent, shadowColor: accent }]}
            onPress={() =>
              router.push(`/chakra-of-the-day?chakraId=${chakraId}` as never)
            }
            activeOpacity={0.82}
          >
            <Text style={styles.buttonText}>Begin</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Quiz phase ─────────────────────────────────────────────────────────────
  const question      = QUESTIONS[currentIndex];
  const currentAnswer = answers[currentIndex];
  const progress      = (currentIndex + 1) / QUESTIONS.length;
  const isLast        = currentIndex === QUESTIONS.length - 1;

  function handleSelect(idx: number) {
    const updated = [...answers];
    updated[currentIndex] = idx;
    setAnswers(updated);
  }

  function handleContinue() {
    if (currentAnswer === null) return;
    if (!isLast) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setPhase('reveal');
    }
  }

  function handleBack() {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* ── Progress row ── */}
        <View style={styles.progressRow}>
          {currentIndex > 0 ? (
            <TouchableOpacity
              onPress={handleBack}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.backButton}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}

          <Text style={styles.progressLabel}>
            {currentIndex + 1} of {QUESTIONS.length}
          </Text>

          {/* Balancing spacer — same width as back button */}
          <View style={styles.backButton} />
        </View>

        {/* ── Progress bar ── */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as `${number}%` }]} />
        </View>

        {/* ── Question ── */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.text}</Text>
        </View>

        {/* ── Options ── */}
        <View style={styles.optionsContainer}>
          {OPTION_LABELS.map((label, idx) => {
            const selected = currentAnswer === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.option, selected && styles.optionSelected]}
                onPress={() => handleSelect(idx)}
                activeOpacity={0.75}
              >
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.spacer} />

        {/* ── Continue ── */}
        <TouchableOpacity
          style={[styles.button, currentAnswer === null && styles.buttonDisabled]}
          onPress={handleContinue}
          activeOpacity={currentAnswer === null ? 1 : 0.82}
        >
          <Text style={styles.buttonText}>
            {isLast ? 'See my result' : 'Continue'}
          </Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: neutralColors.background,
  },
  container: {
    flex: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },

  // ── Progress ─────────────────────────────────────────────────────────────
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  backButton: {
    width: 32,
    alignItems: 'flex-start',
  },
  backText: {
    fontSize: fontSize.title,
    color: neutralColors.textSecondary,
  },
  progressLabel: {
    fontSize: fontSize.small,
    color: neutralColors.textSecondary,
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 3,
    backgroundColor: neutralColors.border,
    borderRadius: 2,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: welcomeColors.deepIndigo,
    borderRadius: 2,
  },

  // ── Question ──────────────────────────────────────────────────────────────
  questionContainer: {
    flex: 0,
    marginBottom: spacing.xl,
  },
  questionText: {
    fontSize: fontSize.title,
    fontWeight: '500',
    color: neutralColors.textPrimary,
    lineHeight: 32,
    textAlign: 'center',
  },

  // ── Options ───────────────────────────────────────────────────────────────
  optionsContainer: {
    gap: spacing.sm,
  },
  option: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: neutralColors.border,
    backgroundColor: neutralColors.surface,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: welcomeColors.deepIndigo,
    backgroundColor: '#EEEDF8',
  },
  optionText: {
    fontSize: fontSize.body,
    color: neutralColors.textSecondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: welcomeColors.deepIndigo,
    fontWeight: '600',
  },

  // ── Spacer ────────────────────────────────────────────────────────────────
  spacer: {
    flex: 1,
  },

  // ── Button ────────────────────────────────────────────────────────────────
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: welcomeColors.deepIndigo,
    paddingVertical: spacing.md,
    paddingHorizontal: 36,
    borderRadius: 50,
    gap: spacing.sm,
    shadowColor: welcomeColors.deepIndigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 7,
    marginBottom: spacing.md,
  },
  buttonDisabled: {
    backgroundColor: neutralColors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: neutralColors.surface,
    fontSize: fontSize.body,
    fontWeight: '600',
    letterSpacing: 1,
  },
  buttonArrow: {
    color: neutralColors.surface,
    fontSize: fontSize.body,
    fontWeight: '400',
  },

  // ── Reveal ────────────────────────────────────────────────────────────────
  revealOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: spacing.xl,
    opacity: 0.85,
  },
  revealHeading: {
    fontSize: fontSize.heading,
    fontWeight: '600',
    color: neutralColors.textPrimary,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: spacing.md,
  },
  revealSub: {
    fontSize: fontSize.body,
    color: neutralColors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
});
