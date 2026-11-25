// Kedai Mie Beruap — audio: tiny synthesized sounds, no audio files, no network.
let audioCtx = null;

export function ensureAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch { audioCtx = null; }
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function beep(freq, duration, type = 'sine', volume = 0.12, when = 0) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime + when);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + when + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + when);
  osc.stop(ctx.currentTime + when + duration + 0.02);
}

export function playClick() { beep(520, 0.07, 'triangle', 0.08); }
export function playPour() { beep(300, 0.18, 'sine', 0.1); beep(210, 0.22, 'sine', 0.08, 0.06); }
export function playChop() { beep(880, 0.05, 'square', 0.05); beep(660, 0.05, 'square', 0.05, 0.07); }
export function playDing() { beep(880, 0.15, 'sine', 0.12); beep(1318, 0.25, 'sine', 0.1, 0.12); }
export function playServe() {
  beep(523, 0.12, 'triangle', 0.12); beep(659, 0.12, 'triangle', 0.12, 0.1);
  beep(784, 0.2, 'triangle', 0.12, 0.2);
}
export function playWrong() { beep(180, 0.25, 'sawtooth', 0.08); beep(140, 0.3, 'sawtooth', 0.08, 0.12); }
export function playAngry() { beep(220, 0.15, 'square', 0.09); beep(165, 0.3, 'square', 0.09, 0.14); }
export function playWin() {
  [523, 659, 784, 1046].forEach((f, i) => beep(f, 0.22, 'triangle', 0.12, i * 0.13));
}
export function playLose() {
  [392, 330, 262, 196].forEach((f, i) => beep(f, 0.3, 'triangle', 0.1, i * 0.16));
}
