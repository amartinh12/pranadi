import { chakraColors } from '../theme/tokens';

// ─── i18n Primitives ─────────────────────────────────────────────────────────
// No library dependency — plain typed structure. A proper i18n library can be
// layered on top later if needed.

export type LocalizedString = { en: string; es: string };
export type LocalizedList   = { en: string[]; es: string[] };

export type PranaEnergy = {
  low:      LocalizedString;
  balanced: LocalizedString;
  high:     LocalizedString;
};

// ─── Practice Session Types ──────────────────────────────────────────────────
// Text only — no images are bundled, to keep the app small. `key` matches the
// illustration file name in Drive (e.g. "root_pose1") so images can be added later.

export type SessionStep = {
  key:  string;
  name: LocalizedString;
};

export type SessionLevel = 'pause' | 'flow' | 'journey';

export interface PracticeSession {
  level:   SessionLevel;
  name:    LocalizedString;
  minutes: number;
  warmups: SessionStep[];   // may be empty (Pause has no warm-up)
  poses:   SessionStep[];   // in the numbered order of the source files
}

// ─── Chakra Type ─────────────────────────────────────────────────────────────

export interface Chakra {
  number:         1 | 2 | 3 | 4 | 5 | 6 | 7;
  id:             string;                        // non-translated key
  sanskritName:   string;                        // non-translated
  displayName:    LocalizedString;
  colorToken:     keyof typeof chakraColors;     // references design token, no hardcoded hex
  mantra:         string;                        // non-translated
  element:        LocalizedString;
  energy:         LocalizedString;
  shortStatement: LocalizedString;               // "I AM", "I FEEL", etc.
  descriptor:     LocalizedString;               // italic poetic line
  affirmation:    LocalizedString;
  influences:     LocalizedList;
  whenActive:     LocalizedList;
  whenBlocked:    LocalizedList;
  pranaEnergy:    PranaEnergy;
  journalPrompt:  LocalizedString;
  practices:      LocalizedList;
  asanas:         LocalizedList;
  pranayama:      LocalizedList;
  foods:          LocalizedList;
  blockedSummary:  LocalizedString;
  balancedSummary: LocalizedString;
  sessions?:       PracticeSession[];            // Pause / Flow / Journey; filled per chakra as ready
}

// ─── Session Data (Root & Sacral) ────────────────────────────────────────────
// Source: Drive "PraNadi" folder → "Naming and pose" docs. Numbers match the
// illustration file names, and sessions always run in numbered order.

const step = (key: string, en: string): SessionStep => ({ key, name: { en, es: '' } });
const pick = (list: SessionStep[], numbers: number[]): SessionStep[] => numbers.map((n) => list[n - 1]);

const rootWarmups: SessionStep[] = [
  step('root_warmup1', 'Ankle rolls'),
  step('root_warmup2', 'Toe spreading'),
  step('root_warmup3', 'Calf rocks'),
  step('root_warmup4', 'Standing forward fold sway'),
  step('root_warmup5', 'Hip circles standing'),
  step('root_warmup6', 'Cat-cow on hands and knees'),
  step('root_warmup7', 'Knee-to-chest hugs'),
  step('root_warmup8', 'Hip flexor opener kneeling'),
];

const rootPoses: SessionStep[] = [
  step('root_pose1',  'Mountain pose'),
  step('root_pose2',  'Mountain with arms up'),
  step('root_pose3',  'Tree pose'),
  step('root_pose4',  'Warrior I'),
  step('root_pose5',  'Warrior II'),
  step('root_pose6',  'Goddess pose'),
  step('root_pose7',  'Chair pose'),
  step('root_pose8',  'Big toe pose'),
  step('root_pose9',  'Easy seat'),
  step('root_pose10', 'Bound angle'),
  step('root_pose11', 'Staff pose'),
  step('root_pose12', 'Garland pose'),
  step('root_pose13', 'Low lunge'),
  step('root_pose14', 'Child\'s pose'),
  step('root_pose15', 'Cat-Cow'),
  step('root_pose16', 'Half lord of the fishes'),
  step('root_pose17', 'Cobra'),
  step('root_pose18', 'Bridge'),
  step('root_pose19', 'Knees-to-chest'),
  step('root_pose20', 'Legs up the wall'),
  step('root_pose21', 'Savasana'),
];

const sacralWarmups: SessionStep[] = [
  step('sacral_warmup1', 'Pelvic tilts on the floor'),
  step('sacral_warmup2', 'Hip circles on hands and knees'),
  step('sacral_warmup3', 'Windshield wiper legs'),
  step('sacral_warmup4', 'Standing side bends'),
  step('sacral_warmup5', 'Cat-cow with hip sway'),
  step('sacral_warmup6', 'Standing hip openers'),
  // The naming doc lists "Standing hip openers" twice (6 and 7); the pose list
  // has "Belly breathing" as the 7th warm-up, so that name is used here.
  step('sacral_warmup7', 'Belly breathing'),
  step('sacral_warmup8', 'Knees-to-chest with sway'),
];

const sacralPoses: SessionStep[] = [
  step('sacral_pose1',  'Mountain pose'),
  step('sacral_pose2',  'Standing forward fold'),
  step('sacral_pose3',  'Wide-legged forward fold'),
  step('sacral_pose4',  'Goddess pose'),
  step('sacral_pose5',  'Warrior II'),
  step('sacral_pose6',  'Triangle pose'),
  step('sacral_pose7',  'Downward-facing dog'),
  step('sacral_pose8',  'Low lunge'),
  step('sacral_pose9',  'Lizard pose'),
  step('sacral_pose10', 'Pigeon pose'),
  step('sacral_pose11', 'Bound angle'),
  step('sacral_pose12', 'Reclined bound angle'),
  step('sacral_pose13', 'Happy baby'),
  step('sacral_pose14', 'Cat-Cow with hip movement'),
  step('sacral_pose15', 'Supine spinal twist'),
  step('sacral_pose16', 'Bridge with pelvic flow'),
  step('sacral_pose17', 'Knees-to-chest with sway'),
  step('sacral_pose18', 'Savasana'),
];

const sessionNames = {
  pause:   { en: 'Pause',   es: '' },
  flow:    { en: 'Flow',    es: '' },
  journey: { en: 'Journey', es: '' },
};

const rootSessions: PracticeSession[] = [
  { level: 'pause',   name: sessionNames.pause,   minutes: 5,  warmups: [],
    poses: pick(rootPoses, [9, 14, 19, 20, 21]) },
  { level: 'flow',    name: sessionNames.flow,    minutes: 20, warmups: pick(rootWarmups, [1, 5, 6]),
    poses: pick(rootPoses, [1, 3, 4, 5, 6, 13, 14, 21]) },
  { level: 'journey', name: sessionNames.journey, minutes: 45, warmups: rootWarmups,
    poses: rootPoses },
];

const sacralSessions: PracticeSession[] = [
  { level: 'pause',   name: sessionNames.pause,   minutes: 5,  warmups: [],
    poses: pick(sacralPoses, [11, 12, 13, 17, 18]) },
  { level: 'flow',    name: sessionNames.flow,    minutes: 20, warmups: pick(sacralWarmups, [1, 2, 5]),
    poses: pick(sacralPoses, [1, 3, 4, 5, 8, 10, 13, 15, 18]) },
  { level: 'journey', name: sessionNames.journey, minutes: 45, warmups: sacralWarmups,
    poses: sacralPoses },
];

// ─── Chakra Data ─────────────────────────────────────────────────────────────
// Source: "Journey Through the Chakras — Energetic Guide for Inner Balance"
//         by Manuela Tabares & Valeria Martín.
//
// "en" slots: filled with official English content from the guide.
// "es" slots: empty — to be filled in a future translation pass.

export const chakras: Chakra[] = [
  // ── 1. Root ────────────────────────────────────────────────────────────────
  {
    number:      1,
    id:          'root',
    sanskritName: 'Muladhara',
    displayName:  { en: 'Root Chakra',  es: '' },
    colorToken:   'root',
    mantra:       'LAM',
    element:      { en: 'Earth',      es: '' },
    energy:       { en: 'Masculine',  es: '' },
    shortStatement: { en: 'I AM',     es: '' },
    descriptor:   {
      en: 'The anchor, the foundation. It is your grounding place, where your sense of security in the world is born.',
      es: '',
    },
    affirmation:  { en: 'I am safe. I belong. Life supports me.', es: '' },
    influences: {
      en: ['Security', 'Survival', 'Financial stability', 'Home & belonging', 'Trust in life', 'Grounding'],
      es: [],
    },
    whenActive: {
      en: ['Inner sense of safety', 'Presence & calm', 'Trust in life', 'Connection with the physical body', 'Sustained energy'],
      es: [],
    },
    whenBlocked: {
      en: ['Constant anxiety or fear', 'Financial or emotional insecurity', 'Feeling of not belonging', 'Disconnection from the body', 'Tension in legs or feet', 'Sleep problems'],
      es: [],
    },
    pranaEnergy: {
      low:      { en: 'Uprooting, instability',    es: '' },
      balanced: { en: 'Grounding, solid foundation', es: '' },
      high:     { en: 'Feeling stuck',              es: '' },
    },
    journalPrompt: { en: 'What makes me feel safe right now in my life?', es: '' },
    practices: {
      en: ['Walking barefoot', 'Gardening', 'Strength training', 'Structured routines', 'Organizing spaces', 'Deep rest'],
      es: [],
    },
    asanas: {
      en: ['Tadasana (Mountain)', 'Virabhadrasana I & II (Warrior 1 & 2)', 'Balasana (Child\'s Pose)', 'Uttanasana (Forward Fold)'],
      es: [],
    },
    pranayama: {
      en: ['Dirgha — Three-part breath'],
      es: [],
    },
    foods: {
      en: ['Ginger', 'Potato', 'Legumes', 'Red foods'],
      es: [],
    },
    blockedSummary:  { en: 'Fears, anxiety, insecurity, financial problems, disconnection from the body, fatigue', es: '' },
    balancedSummary: { en: 'Sense of stability, basic trust, connection with the body, vital energy, grounding', es: '' },
    sessions: rootSessions,
  },

  // ── 2. Sacral ──────────────────────────────────────────────────────────────
  {
    number:      2,
    id:          'sacral',
    sanskritName: 'Svadhisthana',
    displayName:  { en: 'Sacral Chakra', es: '' },
    colorToken:   'sacral',
    mantra:       'VAM',
    element:      { en: 'Water',     es: '' },
    energy:       { en: 'Feminine',  es: '' },
    shortStatement: { en: 'I FEEL',  es: '' },
    descriptor: {
      en: 'Your own place, the dwelling of the self. The space where your emotions, pleasure and creativity reside.',
      es: '',
    },
    affirmation: { en: 'I allow myself to feel, flow and enjoy.', es: '' },
    influences: {
      en: ['Pleasure', 'Creativity', 'Sexuality', 'Emotions', 'Relationships', 'Worthiness', 'Flow in life'],
      es: [],
    },
    whenActive: {
      en: ['Emotional fluidity', 'Spontaneity', 'Connection with pleasure without guilt', 'Expansive creativity', 'Natural sensuality', 'Healthy & open relationships'],
      es: [],
    },
    whenBlocked: {
      en: ['Emotional rigidity', 'Difficulty feeling pleasure', 'Guilt around desire', 'Low creativity', 'Hip or lower back tension', 'Excessive control'],
      es: [],
    },
    pranaEnergy: {
      low:      { en: 'Over-seriousness, skepticism', es: '' },
      balanced: { en: 'Flow with responsibility',     es: '' },
      high:     { en: 'Addictions, Peter Pan',        es: '' },
    },
    journalPrompt: { en: 'What does it mean for me to enjoy without guilt?', es: '' },
    practices: {
      en: ['Swimming', 'Conscious baths', 'Free dancing', 'Pelvic movement', 'Painting', 'Writing', 'Creating without structure'],
      es: [],
    },
    asanas: {
      en: ['Utkata Konasana (Goddess)', 'Eka Pada Rajakapotasana (Half Pigeon)', 'Anjaneyasana (Low Lunge)', 'Malasana (Garland Squat)', 'Setu Bandhasana (Bridge)'],
      es: [],
    },
    pranayama: {
      en: ['Chandra — Lunar breath'],
      es: [],
    },
    foods: {
      en: ['Papaya', 'Orange', 'Coconut', 'Watermelon', 'Avocado', 'Nuts', 'Honey', 'Dates'],
      es: [],
    },
    blockedSummary:  { en: 'Guilt, sexual repression, creative blocks, emotional dependency, addictions', es: '' },
    balancedSummary: { en: 'Emotional fluidity, active creativity, body enjoyment, healthy relationships', es: '' },
    sessions: sacralSessions,
  },

  // ── 3. Solar Plexus ────────────────────────────────────────────────────────
  {
    number:      3,
    id:          'solarPlexus',
    sanskritName: 'Manipura',
    displayName:  { en: 'Solar Plexus', es: '' },
    colorToken:   'solarPlexus',
    mantra:       'RAM',
    element:      { en: 'Fire',       es: '' },
    energy:       { en: 'Masculine',  es: '' },
    shortStatement: { en: 'I DO',     es: '' },
    descriptor: {
      en: 'City of jewels. Your inner power, your personal fire and your capacity for action.',
      es: '',
    },
    affirmation: { en: 'I trust myself. I have the power to create and sustain.', es: '' },
    influences: {
      en: ['Personal power', 'Manifestation', 'Confidence', 'Magnetism', 'Discipline', 'Willpower', 'Healthy boundaries'],
      es: [],
    },
    whenActive: {
      en: ['Self-confidence', 'Clarity in decisions', 'Sustained energy', 'Capacity to act', 'Balanced discipline', 'Natural leadership'],
      es: [],
    },
    whenBlocked: {
      en: ['Low self-esteem', 'Constant self-doubt', 'Procrastination', 'Lack of direction', 'Feeling of powerlessness', 'Fatigue or low energy'],
      es: [],
    },
    pranaEnergy: {
      low:      { en: 'Sedentary lifestyle, insecurity', es: '' },
      balanced: { en: 'Confidence, focus',               es: '' },
      high:     { en: 'Control, rigidity',               es: '' },
    },
    journalPrompt: { en: 'Where am I doubting myself when I actually already know the answer?', es: '' },
    practices: {
      en: ['Activities in the sun', 'HIIT / core exercise', 'Making decisions', 'Challenging yourself', 'Keeping commitments', 'Saying NO', 'Putting yourself first'],
      es: [],
    },
    asanas: {
      en: ['Navasana (Boat)', 'Phalakasana (Plank)', 'Virabhadrasana III (Warrior 3)', 'Spinal twists', 'Utkatasana (Chair)'],
      es: [],
    },
    pranayama: {
      en: ['Kapalabhati (Fire) & Bhastrika'],
      es: [],
    },
    foods: {
      en: ['Pineapple', 'Banana', 'Corn', 'Turmeric', 'Cinnamon', 'Oats', 'Brown rice'],
      es: [],
    },
    blockedSummary:  { en: 'Low self-esteem, need for control, anger, insecurity, passivity or aggressiveness', es: '' },
    balancedSummary: { en: 'Self-confidence, willpower, balanced inner power, self-discipline', es: '' },
  },

  // ── 4. Heart ───────────────────────────────────────────────────────────────
  {
    number:      4,
    id:          'heart',
    sanskritName: 'Anahata',
    displayName:  { en: 'Heart Chakra', es: '' },
    colorToken:   'heart',
    mantra:       'YAM',
    element:      { en: 'Air',      es: '' },
    energy:       { en: 'Balance',  es: '' },
    shortStatement: { en: 'I LOVE', es: '' },
    descriptor: {
      en: 'The sound of life, connection and unconditional compassion. The bridge between the earthly and the divine.',
      es: '',
    },
    affirmation: { en: 'I give and receive love freely.', es: '' },
    influences: {
      en: ['Self-love', 'Compassion', 'Forgiveness', 'Empathy', 'Vulnerability', 'Balance of giving & receiving', 'Handling pain'],
      es: [],
    },
    whenActive: {
      en: ['Solid self-love', 'Emotional openness', 'Loving without attachment', 'Balanced relationships', 'Genuine empathy', 'Inner peace'],
      es: [],
    },
    whenBlocked: {
      en: ['Difficulty opening up', 'Fear of being hurt', 'Closing off in relationships', 'Attachment or dependency', 'Tension in chest & shoulders', 'Shallow breathing'],
      es: [],
    },
    pranaEnergy: {
      low:      { en: 'Insensitivity',            es: '' },
      balanced: { en: 'Responsible sensitivity',  es: '' },
      high:     { en: 'Emotional overwhelm',      es: '' },
    },
    journalPrompt: { en: 'Am I giving from love or from need?', es: '' },
    practices: {
      en: ['Conscious breathing', 'Practicing gratitude', 'Conscious acts of love', 'Self-care', 'Forgiveness work', 'Physical touch'],
      es: [],
    },
    asanas: {
      en: ['Ustrasana (Camel)', 'Bhujangasana (Cobra)', 'Urdhva Mukha Svanasana (Upward Dog)', 'Setu Bandhasana (Bridge)', 'Uttana Shishosana (Puppy Pose)'],
      es: [],
    },
    pranayama: {
      en: ['Nadi Shodhana — Alternate nostril breathing'],
      es: [],
    },
    foods: {
      en: ['Green grapes', 'Green apple', 'Kiwi', 'Green tea', 'Chocolate', 'Peach', 'Yogurt'],
      es: [],
    },
    blockedSummary:  { en: 'Emotional closure, difficulty forgiving, emotional dependency, deep sadness', es: '' },
    balancedSummary: { en: 'Self-love, empathy, compassion, openness to give & receive love, relational harmony', es: '' },
  },

  // ── 5. Throat ──────────────────────────────────────────────────────────────
  {
    number:      5,
    id:          'throat',
    sanskritName: 'Vishuddha',
    displayName:  { en: 'Throat Chakra', es: '' },
    colorToken:   'throat',
    mantra:       'HAM',
    element:      { en: 'Ether / Space', es: '' },
    energy:       { en: 'Masculine',     es: '' },
    shortStatement: { en: 'I SPEAK',     es: '' },
    descriptor: {
      en: 'Purification. Truth is expressed with clarity and authenticity.',
      es: '',
    },
    affirmation: { en: 'I express my truth with clarity and love.', es: '' },
    influences: {
      en: ['Communication', 'Authenticity', 'Personal expression', 'Truth', 'Conscious listening', 'Verbal creativity', 'Coherence'],
      es: [],
    },
    whenActive: {
      en: ['Clear & honest communication', 'Expressing yourself with confidence', 'Active listening', 'Speaking with authenticity', 'Thought–emotion coherence'],
      es: [],
    },
    whenBlocked: {
      en: ['Difficulty expressing feelings', 'Holding things back out of fear', 'Low or insecure voice', 'Fear of judgment', 'Tension in neck or throat', 'Lump in the throat'],
      es: [],
    },
    pranaEnergy: {
      low:      { en: 'Insecurity & repression',       es: '' },
      balanced: { en: 'Clarity & authenticity',        es: '' },
      high:     { en: 'Impulsiveness, lack of control', es: '' },
    },
    journalPrompt: { en: 'What am I avoiding saying? Why?', es: '' },
    practices: {
      en: ['Conscious writing', 'Affirmations out loud', 'Intentional silence', 'Active listening', 'Journaling'],
      es: [],
    },
    asanas: {
      en: ['Matsyasana (Fish)', 'Sarvangasana (Shoulderstand)', 'Halasana (Plow)', 'Neck stretches'],
      es: [],
    },
    pranayama: {
      en: ['Ujjayi (Ocean breath) & Lion\'s breath'],
      es: [],
    },
    foods: {
      en: ['Blueberries', 'Blackberries', 'Water', 'Herbal infusions', 'Honey', 'Herbal teas'],
      es: [],
    },
    blockedSummary:  { en: 'Difficulty expressing oneself, fear of judgment, lies, sore throat, creative blocks', es: '' },
    balancedSummary: { en: 'Clear & loving communication, authentic expression, active listening, voice aligned with the soul', es: '' },
  },

  // ── 6. Third Eye ───────────────────────────────────────────────────────────
  {
    number:      6,
    id:          'thirdEye',
    sanskritName: 'Ajna',
    displayName:  { en: 'Third Eye',  es: '' },
    colorToken:   'thirdEye',
    mantra:       'OM / AUM',
    element:      { en: 'Light',     es: '' },
    energy:       { en: 'Feminine',  es: '' },
    shortStatement: { en: 'I SEE',   es: '' },
    descriptor: {
      en: 'To perceive, to know, to command. Center of intuition, inner wisdom and vision beyond the physical.',
      es: '',
    },
    affirmation: { en: 'I trust my intuition. I see clearly beyond the visible.', es: '' },
    influences: {
      en: ['Intuition', 'Inner vision', 'Wisdom', 'Imagination', 'Mental clarity', 'Perception', 'Dreams & vision'],
      es: [],
    },
    whenActive: {
      en: ['Mental clarity & focus', 'Sharp intuition', 'Big-picture perspective', 'Inner wisdom', 'Creative imagination', 'Deep perception'],
      es: [],
    },
    whenBlocked: {
      en: ['Mental confusion', 'Difficulty making decisions', 'Disconnection from intuition', 'Excessive rationalization', 'Headaches', 'Concentration problems'],
      es: [],
    },
    pranaEnergy: {
      low:      { en: 'Disconnection, confusion',           es: '' },
      balanced: { en: 'Balance of reason & intuition',      es: '' },
      high:     { en: 'Excessive fantasy, obsession',       es: '' },
    },
    journalPrompt: { en: 'What do I already know deep down but resist accepting?', es: '' },
    practices: {
      en: ['Eyes-closed meditation', 'Guided visualization', 'Intuitive journaling', 'Stargazing at night', 'Reducing screen time', 'Dream journal'],
      es: [],
    },
    asanas: {
      en: ['Balasana (Child\'s Pose)', 'Adho Mukha Svanasana (Downward Dog)', 'Garudasana (Eagle)', 'Paschimottanasana (Seated Forward Fold)'],
      es: [],
    },
    pranayama: {
      en: ['Brahmari — Bee breath'],
      es: [],
    },
    foods: {
      en: ['Blueberries', 'Purple grapes', 'Eggplant', 'Dark chocolate', 'Lavender', 'Peppermint tea', 'Chia seeds'],
      es: [],
    },
    blockedSummary:  { en: 'Spiritual disconnection, existential emptiness, depression, feeling of isolation', es: '' },
    balancedSummary: { en: 'Awakened intuition, inner clarity, active imagination, connection with the soul and dreams', es: '' },
  },

  // ── 7. Crown ───────────────────────────────────────────────────────────────
  {
    number:      7,
    id:          'crown',
    sanskritName: 'Sahasrara',
    displayName:  { en: 'Crown Chakra',    es: '' },
    colorToken:   'crown',
    mantra:       'OM / AUM',
    element:      { en: 'Pure Consciousness', es: '' },
    energy:       { en: 'Balance',            es: '' },
    shortStatement: { en: 'I UNDERSTAND',    es: '' },
    descriptor: {
      en: 'The thousand-petaled lotus. Connection with the divine, pure consciousness and transcendence.',
      es: '',
    },
    affirmation: { en: 'I am connected to the source. I am part of the whole.', es: '' },
    influences: {
      en: ['Spirituality', 'Divine connection', 'Life purpose', 'Expanded consciousness', 'Unity', 'Transcendence', 'Deep peace'],
      es: [],
    },
    whenActive: {
      en: ['Peace & wholeness', 'Connection with something greater', 'Clarity of purpose', 'Deep gratitude', 'Acceptance & surrender', 'Universal compassion', 'Full presence'],
      es: [],
    },
    whenBlocked: {
      en: ['Existential emptiness', 'Spiritual disconnection', 'Lack of purpose', 'Extreme cynicism', 'Attachment to the material', 'Deep loneliness', 'Resistance to the unknown'],
      es: [],
    },
    pranaEnergy: {
      low:      { en: 'Disconnection, emptiness', es: '' },
      balanced: { en: 'Grounded connection',      es: '' },
      high:     { en: 'Spiritual bypass',         es: '' },
    },
    journalPrompt: { en: 'What connects me to something greater than myself?', es: '' },
    practices: {
      en: ['Silent meditation', 'Prayer or spiritual connection', 'Contemplating nature', 'Deep gratitude', 'Conscious fasting', 'Releasing control', 'Seva (service)'],
      es: [],
    },
    asanas: {
      en: ['Padmasana (Lotus)', 'Sirsasana (Headstand)', 'Sasangasana (Rabbit Pose)', 'Ardha Padmasana (Half Lotus) with mudra'],
      es: [],
    },
    pranayama: {
      en: ['Conscious breathing in silence, So Hum'],
      es: [],
    },
    foods: {
      en: ['Conscious fasting', 'Pure water', 'Incense (complementary)'],
      es: [],
    },
    // Note: the source guide's blocked/balanced table for Crown appears to reuse
    // Root descriptors (likely a layout artifact). Using the wording confirmed
    // by the content guide notes.
    blockedSummary:  { en: 'Inner peace, wisdom, connection with the All, expanded awareness, trust in the divine path — when blocked: fears, disconnection, emptiness', es: '' },
    balancedSummary: { en: 'Inner peace, wisdom, connection with the All, expanded awareness, trust in the divine path', es: '' },
  },
];
