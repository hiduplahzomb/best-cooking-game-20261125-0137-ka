// Kedai Mie Beruap — config: every recipe, ingredient and difficulty knob.
export const SHIFT_SECONDS = 150;
export const TARGET_SCORE = 1000;
export const MAX_STRIKES = 3;
export const SERVES_PER_LEVEL = 3;

export const BROTHS = [
  { id: 'ayam',  name: 'Kaldu Ayam',  icon: '🍗', color: '#f5c542', desc: 'classic savoury' },
  { id: 'miso',  name: 'Miso Merah',  icon: '🥘', color: '#c0392b', desc: 'salty-sweet' },
  { id: 'pedas', name: 'Cabai Lava',  icon: '🌶️', color: '#e74c3c', desc: 'fiery hot' },
];

export const TOPPINGS = [
  { id: 'telur',   name: 'Egg',          icon: '🥚', key: '1' },
  { id: 'daging',  name: 'Sliced Beef',  icon: '🥩', key: '2' },
  { id: 'nori',    name: 'Nori',         icon: '🟩', key: '3' },
  { id: 'bawang',  name: 'Spring Onion', icon: '🧅', key: '4' },
  { id: 'jagung',  name: 'Corn',         icon: '🌽', key: '5' },
  { id: 'jamur',   name: 'Mushroom',     icon: '🍄', key: '6' },
];

export const CUSTOMERS = [
  { name: 'Bu Sari',  face: '👵', note: 'a regular since forever' },
  { name: 'Pak Dedi', face: '👨', note: 'hungry after work' },
  { name: 'Mbak Rina', face: '👩', note: 'loves it spicy' },
  { name: 'Dimas',    face: '🧑', note: 'student on a budget' },
  { name: 'Nenek Uti', face: '👴', note: 'wants it fast' },
  { name: 'Kak Lala', face: '👧', note: 'just out of school' },
  { name: 'Bang Ozi', face: '🧔', note: 'hungry ride-hailing driver' },
  { name: 'Tante Wi', face: '👩‍🦰', note: 'ordering for the family' },
];

// Difficulty curve: level -> {maxTickets, patienceSeconds, toppingCount, spawnGapSeconds}
export const LEVELS = [
  { maxTickets: 2, patience: 55, toppings: 2, spawnGap: 9 },
  { maxTickets: 2, patience: 48, toppings: 3, spawnGap: 8 },
  { maxTickets: 3, patience: 42, toppings: 3, spawnGap: 7 },
  { maxTickets: 3, patience: 36, toppings: 4, spawnGap: 6 },
  { maxTickets: 3, patience: 30, toppings: 4, spawnGap: 5 },
];

export const NOODLE_COOK_SECONDS = 3;
export const NOODLE_BURN_SECONDS = 7;
export const BASE_POINTS = 100;
export const TIME_BONUS_PER_SECOND = 2;
export const WRONG_PENALTY = 20;
