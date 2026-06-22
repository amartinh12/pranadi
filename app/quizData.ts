// ─── Quiz Data & Scoring ──────────────────────────────────────────────────────
// Used by the "Help me find it" quiz (quiz.tsx).
// Chakra ids and polarities are NEVER shown to the user — scoring only.

export type Polarity = '+' | '-';

export interface QuizQuestion {
  text: string;
  chakraId: string;
  polarity: Polarity;
}

// Display order matches the brief exactly.
export const QUESTIONS: QuizQuestion[] = [
  { text: 'I trust that life is holding me, and I feel safe in my body.',                            chakraId: 'root',        polarity: '+' },
  { text: 'When something hurts, my first instinct is to close myself off.',                         chakraId: 'heart',       polarity: '-' },
  { text: 'When I make decisions, I make them from my center, not from doubt.',                      chakraId: 'solarPlexus', polarity: '+' },
  { text: 'There are important things I am keeping to myself out of concern for how they would land.',chakraId: 'throat',      polarity: '-' },
  { text: 'I allow myself to enjoy and to feel pleasure freely.',                                    chakraId: 'sacral',      polarity: '+' },
  { text: 'I sometimes feel a deep emptiness or disconnection from everything.',                     chakraId: 'crown',       polarity: '-' },
  { text: 'I trust my intuition even when reasoning tells me otherwise.',                            chakraId: 'thirdEye',    polarity: '+' },
  { text: 'I carry an underlying anxiety or fear that I have not yet released.',                     chakraId: 'root',        polarity: '-' },
  { text: 'Something in me feels rigid, or without room to create.',                                 chakraId: 'sacral',      polarity: '-' },
  { text: 'I can give love and also receive it, including the love I give myself.',                  chakraId: 'heart',       polarity: '+' },
  { text: 'My life feels meaningful, and I feel part of something greater than me.',                 chakraId: 'crown',       polarity: '+' },
  { text: 'I postpone or hold myself back even when I know what I need to do.',                      chakraId: 'solarPlexus', polarity: '-' },
  { text: 'I say what I feel even when it is uncomfortable, without apologizing for it.',            chakraId: 'throat',      polarity: '+' },
  { text: 'I live in my head, turning everything over without ever quite landing.',                  chakraId: 'thirdEye',    polarity: '-' },
];

// Tie-break: lowest in the body wins first.
export const TIEBREAK_ORDER = [
  'root', 'sacral', 'solarPlexus', 'heart', 'throat', 'thirdEye', 'crown',
] as const;

/**
 * Computes the chakra "asking for care" from a complete answers array.
 *
 * @param answers  Array of 14 answer indices (0 = "Not at all" … 3 = "Fully").
 *                 Callers must ensure all 14 slots are filled before calling.
 * @returns  The chakra id with the lowest aggregate score.
 *
 * Scoring per answer:
 *   Positive (+) question: score = answerIndex + 1  (1–4, more = more open)
 *   Negative (−) question: score = 4 − answerIndex  (reverse-coded)
 * Each chakra's total = sum of its two questions (range 2–8).
 * Lowest total = most in need of care.
 */
export function scoreQuiz(answers: (number | null)[]): string {
  const chakraScores: Record<string, number> = {};

  for (let i = 0; i < QUESTIONS.length; i++) {
    const { chakraId, polarity } = QUESTIONS[i];
    const idx = answers[i] ?? 0;
    const score = polarity === '+' ? idx + 1 : 4 - idx;
    chakraScores[chakraId] = (chakraScores[chakraId] ?? 0) + score;
  }

  const minScore = Math.min(...Object.values(chakraScores));
  const winner = TIEBREAK_ORDER.find(id => chakraScores[id] === minScore);
  return winner ?? 'root';
}
