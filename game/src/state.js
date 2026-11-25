// Kedai Mie Beruap — state: one plain object holding the whole shift.
import { SHIFT_SECONDS, TARGET_SCORE, MAX_STRIKES } from './config.js';

export function freshState() {
  return {
    phase: 'title', // title | playing | paused | won | lost
    score: 0,
    target: TARGET_SCORE,
    combo: 0,
    level: 1,
    serves: 0,
    servedPerfect: 0,
    strikes: 0,
    maxStrikes: MAX_STRIKES,
    shiftLeft: SHIFT_SECONDS,
    tickets: [],          // order tickets on the board
    activeTicketId: null,
    nextTicketId: 1,
    spawnIn: 1.5,         // seconds until the next ticket arrives
    bowl: { broth: null, noodle: false, toppings: [] },
    noodle: { state: 'idle', progress: 0 }, // idle | cooking | ready | burnt
    muted: false,
    lastServedAt: 0,
  };
}

export function levelConfig(state) {
  return state.level;
}
