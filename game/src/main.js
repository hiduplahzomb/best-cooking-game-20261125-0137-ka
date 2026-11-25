// Kedai Mie Beruap — main: game loop, serving, scoring, win/lose, overlays.
import {
  SHIFT_SECONDS, TARGET_SCORE, MAX_STRIKES, SERVES_PER_LEVEL,
  NOODLE_COOK_SECONDS, NOODLE_BURN_SECONDS, BASE_POINTS,
  TIME_BONUS_PER_SECOND, WRONG_PENALTY, BROTHS,
} from './config.js';
import { freshState } from './state.js';
import { createTicket, bowlMatchesTicket, levelParams } from './orders.js';
import { renderHud, renderTickets, renderStations, renderBowl, showFeedback, showToast } from './render.js';
import { bindInput, brothCycleOrder } from './input.js';
import * as sfx from './audio.js';
import { stageShot } from './shots.js';

let state = freshState();
let lastTick = 0;
let lastRender = 0;

const overlay = document.getElementById('overlay');
const overlayCard = document.getElementById('overlay-card');

function activeTicket() {
  return state.tickets.find((t) => t.id === state.activeTicketId) || state.tickets[0] || null;
}

function renderAll() {
  const ticket = activeTicket();
  const ready = ticket ? bowlMatchesTicket(state.bowl, ticket) : false;
  renderHud(state);
  renderTickets(state);
  renderStations(state);
  renderBowl(state, ready);
}

function showOverlay(html) {
  overlayCard.innerHTML = html;
  overlay.classList.remove('hidden');
}

function hideOverlay() { overlay.classList.add('hidden'); }

function showTitle() {
  state.phase = 'title';
  showOverlay(`
    <h1>🍜 Kedai Mie Beruap</h1>
    <h2>Ramen Rush — a 2½-minute shift at the busiest noodle shop in the world</h2>
    <p>Customers arrive with orders on the board. Pour broth, boil noodles until
    just done (don't let them burn!), add the right toppings, then serve before
    their patience runs out.</p>
    <ul class="rules">
      <li>🥘 Click a broth pot, then 🍜 boil noodles — click again when <b>READY!</b></li>
      <li>🥚 Click toppings (or keys <b>1–6</b>) to match the active ticket.</li>
      <li>🍽 Click <b>SERVE</b> or press <b>Space</b> when the bowl matches the ticket.</li>
      <li>🔥 Fast &amp; correct serves build your combo — up to <b>×4</b>!</li>
      <li>😠 3 customers walking out = failed shift. Reach <b>${TARGET_SCORE} points</b> to win.</li>
    </ul>
    <button class="big-btn" id="btn-start">▶ START SHIFT</button>
    <p style="font-size:12px;color:#8a6d4b">Mouse + keyboard · no internet needed · sound can be muted (M)</p>`);
  document.getElementById('btn-start').addEventListener('click', startShift);
}

function startShift() {
  state = freshState();
  state.phase = 'playing';
  hideOverlay();
  spawnTicket();
  renderAll();
  showToast('Shift started — the first customer is here!');
  sfx.ensureAudio();
  sfx.playDing();
}

function spawnTicket() {
  const params = levelParams(state.level);
  if (state.tickets.length >= params.maxTickets) return;
  const ticket = createTicket(state);
  state.tickets.push(ticket);
  if (!state.activeTicketId) state.activeTicketId = ticket.id;
  sfx.playDing();
}

function endShift(won) {
  state.phase = won ? 'won' : 'lost';
  const reason = won
    ? `Target of ${TARGET_SCORE} points reached — the shop is full, everyone goes home happy!`
    : state.strikes >= MAX_STRIKES
      ? 'Three customers left angry — the shop is empty…'
      : 'The shift ended before the target was reached.';
  showOverlay(`
    <h1>${won ? '🏆 SHIFT COMPLETE!' : '😢 SHIFT FAILED'}</h1>
    <h2>${reason}</h2>
    <div class="stat-row">
      <div>Final score<b>${state.score}</b></div>
      <div>Orders served<b>${state.serves}</b></div>
      <div>Level<b>${state.level}</b></div>
      <div>Best combo<b>×${Math.max(1, state.bestCombo || 1)}</b></div>
    </div>
    <button class="big-btn" id="btn-again">↻ PLAY AGAIN (R)</button>
    <p style="font-size:12px;color:#8a6d4b">Target: ${TARGET_SCORE} points in a ${Math.floor(SHIFT_SECONDS / 60)}:${String(SHIFT_SECONDS % 60).padStart(2, '0')} shift</p>`);
  document.getElementById('btn-again').addEventListener('click', startShift);
  if (won) sfx.playWin(); else sfx.playLose();
}

function serve() {
  if (state.phase !== 'playing') return;
  const ticket = activeTicket();
  if (!ticket) { showFeedback('No orders yet!', false); return; }
  if (!state.bowl.broth || !state.bowl.noodle) {
    showFeedback('Bowl incomplete — broth + noodles first!', false);
    sfx.playWrong();
    return;
  }
  if (bowlMatchesTicket(state.bowl, ticket)) {
    const timeBonus = Math.round(ticket.patience * TIME_BONUS_PER_SECOND);
    state.combo = Math.min(4, state.combo + 1);
    state.bestCombo = Math.max(state.bestCombo || 1, state.combo);
    const gained = (BASE_POINTS + timeBonus) * state.combo;
    state.score += gained;
    state.serves += 1;
    state.servedPerfect += 1;
    showFeedback(`+${gained} points! ${ticket.customer} is happy! 🎉`, true);
    showToast(`Serve #${state.serves} • combo ×${state.combo}`);
    sfx.playServe();
    state.tickets = state.tickets.filter((t) => t.id !== ticket.id);
    state.activeTicketId = state.tickets[0] ? state.tickets[0].id : null;
    state.bowl = { broth: null, noodle: false, toppings: [] };
    if (state.serves % SERVES_PER_LEVEL === 0) {
      state.level += 1;
      showToast(`⬆ LEVEL ${state.level}! Orders are getting busier & trickier!`);
    }
    if (state.score >= TARGET_SCORE) { renderAll(); endShift(true); return; }
  } else {
    state.combo = 0;
    state.score = Math.max(0, state.score - WRONG_PENALTY);
    showFeedback(`Wrong recipe! −${WRONG_PENALTY} points, bowl discarded.`, false);
    sfx.playWrong();
    state.bowl = { broth: null, noodle: false, toppings: [] };
  }
  renderAll();
}

const handlers = {
  selectTicket(id) {
    if (state.phase !== 'playing') return;
    state.activeTicketId = id;
    sfx.playClick();
    renderAll();
  },
  cycleTicket() {
    if (state.phase !== 'playing' || state.tickets.length < 2) return;
    const idx = state.tickets.findIndex((t) => t.id === state.activeTicketId);
    state.activeTicketId = state.tickets[(idx + 1) % state.tickets.length].id;
    sfx.playClick();
    renderAll();
  },
  pourBroth(id) {
    if (state.phase !== 'playing') return;
    state.bowl.broth = id;
    sfx.playPour();
    renderAll();
  },
  cycleBroth() {
    if (state.phase !== 'playing') return;
    const order = brothCycleOrder();
    const idx = order.indexOf(state.bowl.broth);
    handlers.pourBroth(order[(idx + 1) % order.length]);
  },
  noodleAction() {
    if (state.phase !== 'playing') return;
    const n = state.noodle;
    if (n.state === 'idle') { n.state = 'cooking'; n.progress = 0; sfx.playPour(); }
    else if (n.state === 'cooking') { showToast('Still raw — wait until READY!'); return; }
    else if (n.state === 'ready') {
      if (state.bowl.noodle) { showToast('Noodles are already in the bowl.'); return; }
      state.bowl.noodle = true;
      n.state = 'idle'; n.progress = 0;
      sfx.playDing();
    } else if (n.state === 'burnt') { n.state = 'idle'; n.progress = 0; sfx.playWrong(); }
    renderAll();
  },
  addTopping(id) {
    if (state.phase !== 'playing') return;
    if (!state.bowl.broth) { showToast('Pour broth before adding toppings!'); return; }
    if (state.bowl.toppings.includes(id)) {
      state.bowl.toppings = state.bowl.toppings.filter((t) => t !== id);
    } else {
      state.bowl.toppings.push(id);
    }
    sfx.playChop();
    renderAll();
  },
  removeFromBowl(what) {
    if (state.phase !== 'playing') return;
    if (what === 'broth') state.bowl.broth = null;
    else if (what === 'noodle') state.bowl.noodle = false;
    else state.bowl.toppings = state.bowl.toppings.filter((t) => t !== what);
    sfx.playClick();
    renderAll();
  },
  dumpBowl() {
    if (state.phase !== 'playing') return;
    state.bowl = { broth: null, noodle: false, toppings: [] };
    sfx.playWrong();
    renderAll();
  },
  serve,
  togglePause() {
    if (state.phase === 'playing') {
      state.phase = 'paused';
      showOverlay(`<h1>⏸ PAUSED</h1><h2>Take a breather — the broth stays warm.</h2>
        <button class="big-btn" id="btn-resume">▶ RESUME</button>`);
      document.getElementById('btn-resume').addEventListener('click', () => {
        state.phase = 'playing'; hideOverlay();
      });
    } else if (state.phase === 'paused') {
      state.phase = 'playing'; hideOverlay();
    }
  },
  toggleMute() {
    state.muted = !state.muted;
    if (state.muted) sfx.ensureAudio();
    renderHud(state);
  },
};

document.addEventListener('keydown', (event) => {
  if ((event.key === 'r' || event.key === 'R' || event.key === 'Enter') &&
      (state.phase === 'won' || state.phase === 'lost' || state.phase === 'title')) {
    startShift();
  }
});

bindInput(handlers);

function tick(now) {
  requestAnimationFrame(tick);
  if (!lastTick) lastTick = now;
  const dt = Math.min(0.1, (now - lastTick) / 1000);
  lastTick = now;
  if (state.phase !== 'playing') return;
  state.shiftLeft -= dt;
  const params = levelParams(state.level);

  // Noodle cooking progresses in real time.
  const n = state.noodle;
  if (n.state === 'cooking' || n.state === 'ready') {
    n.progress += dt;
    if (n.state === 'cooking' && n.progress >= NOODLE_COOK_SECONDS) n.state = 'ready';
    if (n.progress >= NOODLE_BURN_SECONDS) { n.state = 'burnt'; showToast('Noodles burnt! Click the pot to discard.'); }
  }

  // Tickets lose patience; an expired ticket walks out angry.
  let changed = false;
  for (const ticket of [...state.tickets]) {
    ticket.patience -= dt;
    if (ticket.patience <= 0) {
      state.tickets = state.tickets.filter((t) => t.id !== ticket.id);
      state.strikes += 1;
      state.combo = 0;
      showFeedback(`${ticket.customer} walked out angry! 😠 (${state.strikes}/${MAX_STRIKES})`, false);
      sfx.playAngry();
      if (state.activeTicketId === ticket.id) state.activeTicketId = state.tickets[0]?.id ?? null;
      changed = true;
      if (state.strikes >= MAX_STRIKES) { renderAll(); endShift(false); return; }
    }
  }

  // New tickets arrive on a timer.
  state.spawnIn -= dt;
  if (state.spawnIn <= 0 && state.tickets.length < params.maxTickets) {
    spawnTicket();
    state.spawnIn = params.spawnGap;
    changed = true;
  }

  if (state.shiftLeft <= 0) {
    state.shiftLeft = 0;
    renderAll();
    endShift(state.score >= TARGET_SCORE);
    return;
  }
  // Re-render at most 4x a second: timers stay live, but clicked elements
  // are never detached from the DOM mid-click.
  if (now - lastRender > 250) { lastRender = now; renderAll(); }
}

// Boot: title screen, or a staged scene for screenshots (?shot=start|play|serve|end).
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot) {
  state = stageShot(shot, state);
  renderAll();
  if (shot === 'start') showTitle();
  else if (state.phase === 'playing') requestAnimationFrame(tick);
} else {
  renderAll();
  showTitle();
  requestAnimationFrame(tick);
}
