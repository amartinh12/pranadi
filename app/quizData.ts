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
  { text: 'Right now, I feel safe and steady in my body.',                              chakraId: 'root',        polarity: '+' },
  { text: 'Something is hurting right now, so I\u2019m keeping myself closed off.',   chakraId: 'heart',       polarity: '-' },
  { text: 'Today, I feel sure of myself and able to act.',                             chakraId: 'solarPlexus', polarity: '+' },
  { text: 'Right now, there\u2019s something I\u2019m holding back from saying.',     chakraId: 'throat',      polarity: '-' },
  { text: 'Today, I feel open to enjoying and feeling pleasure.',                      chakraId: 'sacral',      polarity: '+' },
  { text: 'Right now, I feel disconnected, like nothing quite matters.',               chakraId: 'crown',       polarity: '-' },
  { text: 'Today, I trust what my intuition is telling me.',                           chakraId: 'thirdEye',    polarity: '+' },
  { text: 'Right now, I\u2019m carrying anxiety or unease I can\u2019t shake.',       chakraId: 'root',        polarity: '-' },
  { text: 'Today, I feel stuck or shut down creatively.',                              chakraId: 'sacral',      polarity: '-' },
  { text: 'Right now, I feel able to give love and receive it.',                       chakraId: 'heart',       polarity: '+' },
  { text: 'Today, I feel connected to something larger than myself.',                  chakraId: 'crown',       polarity: '+' },
  { text: 'Right now, I\u2019m putting things off even though I know what to do.',    chakraId: 'solarPlexus', polarity: '-' },
  { text: 'Today, I can say what I feel without holding back.',                        chakraId: 'throat',      polarity: '+' },
  { text: 'Right now, I\u2019m overthinking and can\u2019t quite land on anything.',  chakraId: 'thirdEye',    polarity: '-' },
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
