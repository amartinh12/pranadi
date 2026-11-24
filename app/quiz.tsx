import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo, Animated, Easing, Image, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions,
} from 'react-native';
import { Text } from '../components/Text';
import { StartOver } from '../components/StartOver';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { fonts, neutralColors } from '../theme/tokens';
import { QUESTIONS, scoreQuiz } from './quizData';

const OPTION_LABELS = ['Not at all', 'Somewhat', 'Mostly', 'Fully'] as const;

// One watercolour background for all 14 questions , mounted once and
// never reloaded between questions. It is the supplied artwork with plain paper added in
// the middle so it fills tall phones without stretching; everything written on the screen
// is real UI placed from the artwork's own geometry (measured in its pixels below).
const artwork = require('../assets/questions-bg.jpg');
const ART_W = 941;
const ART_H = 2072;
const LOTUS_BOTTOM = 185;  // the questions start below this (the artwork is plain paper above it)
const HILLS_TOP = 1815;    // the watercolour hills begin here
const PAPER = '#FDEEDE';   // the artwork's paper colour (shows only beside the art on short screens)

const BUTTON_H = 54;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function QuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );

  // ── Reduced motion: skip the text fade when the person has asked for less motion ──
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  // ── Layout from the artwork's geometry ──
  // Phones are taller than the artwork, so "cover" it (a hair of paper is trimmed at the top
  // and bottom). On short or wide screens, fit it whole instead.
  const tall = height / width >= 1.95;
  const scale = tall ? Math.max(width / ART_W, height / ART_H) : Math.min(width / ART_W, height / ART_H);
  const left0 = (width - ART_W * scale) / 2;
  const top0 = (height - ART_H * scale) / 2;
  const Y = (y: number) => top0 + y * scale;

  const contentTop = Math.max(Y(LOTUS_BOTTOM) + 14, insets.top + 8);
  const buttonBottom = Math.max(height - Y(HILLS_TOP) + 6, insets.bottom + 12); // sits just above the hills
  const contentBottom = buttonBottom + BUTTON_H + 14;
  const questionSize = clamp(width * 0.082, 24, 34);

  // ── Existing quiz state and logic (unchanged) ──
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
      // Last question: go straight to the chosen chakra's page
      router.push(`/chakra-of-the-day?chakraId=${scoreQuiz(answers)}` as never);
    }
  }

  function handleBack() {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  }

  // ── Light transitions: the question and answers fade in, the progress line glides ──
  const fade = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(progress)).current;
  useEffect(() => {
    if (reduceMotion) {
      fade.setValue(1);
      progressAnim.setValue(progress);
      return;
    }
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    Animated.timing(progressAnim, { toValue: progress, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, [currentIndex, reduceMotion, fade, progressAnim, progress]);

  // ── Question screen ──
  let content: React.ReactNode;
  let bottomButton: React.ReactNode;

  content = (
    <>
      {/* ── Header: name, count, progress ── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.backSlot}>
            {currentIndex > 0 && (
              <TouchableOpacity
                onPress={handleBack}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Previous question"
              >
                <Text style={styles.backText}>←</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.title} accessibilityRole="header">CHECK IN WITH YOURSELF</Text>
          <View style={styles.backSlot} />
        </View>
        <Text style={styles.count}>
          {currentIndex + 1} of {QUESTIONS.length}
        </Text>
        <View
          style={styles.progressTrack}
          accessible
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: QUESTIONS.length, now: currentIndex + 1 }}
        >
          <Animated.View
            style={[
              styles.progressFill,
              { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
          />
        </View>
      </View>

      {/* ── Question + answers (one reusable block; only the text changes) ── */}
      <Animated.View style={{ opacity: fade }}>
        <Text style={[styles.questionText, { fontSize: questionSize, lineHeight: questionSize * 1.3 }]}>
          {question.text}
        </Text>

        <View style={styles.options}>
          {OPTION_LABELS.map((label, idx) => {
            const selected = currentAnswer === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.option, selected && styles.optionSelected]}
                onPress={() => handleSelect(idx)}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={label}
              >
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
                {selected && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </>
  );
  bottomButton = (
    <TouchableOpacity
      style={[styles.button, currentAnswer === null && styles.buttonDisabled]}
      onPress={handleContinue}
      activeOpacity={currentAnswer === null ? 1 : 0.85}
      disabled={currentAnswer === null}
      accessibilityRole="button"
      accessibilityLabel={isLast ? 'See my result' : 'Continue'}
      accessibilityState={{ disabled: currentAnswer === null }}
    >
      <Text style={styles.buttonText}>{isLast ? 'See my result' : 'Continue'}</Text>
      <Text style={styles.buttonArrow}>→</Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.screen}>
      {/* The one background: stays mounted across all the questions */}
      <Image
        source={artwork}
        style={{ position: 'absolute', left: left0, top: top0, width: ART_W * scale, height: ART_H * scale }}
        accessible={false}
      />

      {/* Scrolls only if text is large or the phone is small; never runs under the button */}
      <ScrollView
        style={[styles.scroll, { top: contentTop, bottom: contentBottom }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {content}
      </ScrollView>

      <View style={[styles.bottom, { bottom: buttonBottom }]}>{bottomButton}</View>

      <StartOver plain />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PAPER,
  },
  scroll: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  scrollContent: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  backSlot: {
    width: 32,
    alignItems: 'flex-start',
  },
  backText: {
    fontSize: 22,
    color: neutralColors.textSecondary,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 2,
    color: neutralColors.textSecondary,
  },
  count: {
    fontSize: 13,
    color: neutralColors.textSecondary,
    marginTop: 4,
  },
  progressTrack: {
    alignSelf: 'stretch',
    height: 3,
    borderRadius: 2,
    backgroundColor: neutralColors.border,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: neutralColors.textPrimary,
  },

  // ── Question ──────────────────────────────────────────────────────────────
  questionText: {
    fontFamily: fonts.heading,
    color: neutralColors.textPrimary,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 26,
  },

  // ── Options ───────────────────────────────────────────────────────────────
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: neutralColors.border,
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    borderColor: neutralColors.textPrimary,
    backgroundColor: '#F1EDE7',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
    color: neutralColors.textSecondary,
  },
  optionTextSelected: {
    color: neutralColors.textPrimary,
  },
  check: {
    position: 'absolute',
    right: 20,
    fontSize: 14,
    color: neutralColors.textPrimary,
  },

  // ── Continue ──────────────────────────────────────────────────────────────
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: BUTTON_H,
    paddingHorizontal: 56,
    borderRadius: 28,
    backgroundColor: neutralColors.textPrimary,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: neutralColors.border,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '400',
  },
});
