// Kedai Mie Beruap — shots: deterministic staged scenes for screenshots only.
// ?shot=start shows the title screen, ?shot=play a busy mid-shift kitchen,
// ?shot=serve a finished bowl ready to serve, ?shot=end the win screen.
// The real game never uses these; opening the page without a query is the title screen.
import { createTicket } from './orders.js';

function seedTickets(state, count, patienceLeft) {
  state.tickets = [];
  for (let i = 0; i < count; i++) {
    const ticket = createTicket(state);
    ticket.patience = patienceLeft[i % patienceLeft.length];
    ticket.patienceMax = 55;
    state.tickets.push(ticket);
  }
  state.activeTicketId = state.tickets[0].id;
}

export function stageShot(shot, state) {
  const overlay = document.getElementById('overlay');
  if (shot === 'start') {
    state.phase = 'title';
    return state;
  }
  overlay.classList.add('hidden');
  state.phase = 'playing';
  if (shot === 'play') {
    state.score = 350;
    state.combo = 2;
    state.level = 2;
    state.serves = 4;
    state.shiftLeft = 96;
    seedTickets(state, 3, [41, 18, 9]);
    const first = state.tickets[0];
    state.bowl = { broth: first.broth, noodle: true, toppings: first.toppings.slice(0, 1) };
    state.noodle = { state: 'cooking', progress: 1.8 };
    return state;
  }
  if (shot === 'serve') {
    state.score = 820;
    state.combo = 3;
    state.level = 3;
    state.serves = 7;
    state.shiftLeft = 61;
    seedTickets(state, 2, [33, 24]);
    const first = state.tickets[0];
    state.bowl = { broth: first.broth, noodle: true, toppings: [...first.toppings] };
    state.noodle = { state: 'idle', progress: 0 };
    return state;
  }
  if (shot === 'end') {
    state.phase = 'won';
    state.score = 1240;
    state.serves = 11;
    state.level = 4;
    state.bestCombo = 4;
    state.shiftLeft = 12;
    seedTickets(state, 1, [30]);
    const overlayCard = document.getElementById('overlay-card');
    overlay.classList.remove('hidden');
    overlayCard.innerHTML = `
      <h1>🏆 SHIFT COMPLETE!</h1>
      <h2>Target of 1000 points reached — the shop is full, everyone goes home happy!</h2>
      <div class="stat-row">
        <div>Final score<b>1240</b></div>
        <div>Orders served<b>11</b></div>
        <div>Level<b>4</b></div>
        <div>Best combo<b>×4</b></div>
      </div>
      <button class="big-btn">↻ PLAY AGAIN (R)</button>
      <p style="font-size:12px;color:#8a6d4b">Target: 1000 points in a 2:30 shift</p>`;
    return state;
  }
  return state;
}
