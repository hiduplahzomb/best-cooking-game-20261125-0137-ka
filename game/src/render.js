// Kedai Mie Beruap — render: every DOM update, from HUD to tickets to bowl.
import { BROTHS, TOPPINGS, SHIFT_SECONDS, NOODLE_COOK_SECONDS, NOODLE_BURN_SECONDS } from './config.js';
import { ticketProgress } from './orders.js';

const $ = (id) => document.getElementById(id);

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function renderHud(state) {
  $('score').textContent = state.score;
  $('target').textContent = state.target;
  $('shift-time').textContent = fmtTime(state.shiftLeft);
  const fill = $('shift-fill');
  fill.style.width = `${(state.shiftLeft / SHIFT_SECONDS) * 100}%`;
  fill.classList.toggle('low', state.shiftLeft < 30);
  const comboEl = $('combo');
  comboEl.textContent = `×${Math.max(1, state.combo)}`;
  comboEl.classList.toggle('hot', state.combo >= 3);
  $('level').textContent = state.level;
  const faces = [];
  for (let i = 0; i < state.maxStrikes; i++) faces.push(i < state.strikes ? '😠' : '😊');
  $('strikes').textContent = faces.join(' ');
  $('btn-mute').textContent = state.muted ? '🔇' : '🔊';
}

function needChip(label, done) {
  return `<span class="need${done ? ' done' : ''}">${done ? '✓ ' : ''}${label}</span>`;
}

export function renderTickets(state) {
  const box = $('tickets');
  box.innerHTML = '';
  for (const ticket of state.tickets) {
    const done = ticketProgress(state.bowl, ticket);
    const broth = BROTHS.find((b) => b.id === ticket.broth);
    const pct = (ticket.patience / ticket.patienceMax) * 100;
    const urgent = ticket.patience < 12;
    const el = document.createElement('div');
    el.className = `ticket${ticket.id === state.activeTicketId ? ' active' : ''}${urgent ? ' urgent' : ''}`;
    el.dataset.ticketId = ticket.id;
    el.innerHTML = `
      <div class="ticket-head">
        <span class="ticket-customer">${ticket.face} ${ticket.customer}<small>${ticket.note}</small></span>
        <span class="ticket-time${urgent ? ' low' : ''}">${fmtTime(ticket.patience)}</span>
      </div>
      <div class="patience-bar"><div class="patience-fill${urgent ? ' low' : ''}" style="width:${pct}%"></div></div>
      <div class="ticket-needs">
        ${needChip(`${broth.icon} ${broth.name}`, done.has(ticket.broth))}
        ${needChip('🍜 Noodles', done.has('noodle'))}
        ${ticket.toppings.map((t) => {
          const top = TOPPINGS.find((x) => x.id === t);
          return needChip(`${top.icon} ${top.name}`, done.has(t));
        }).join('')}
      </div>`;
    box.appendChild(el);
  }
  if (state.tickets.length === 0) {
    box.innerHTML = '<p style="color:var(--cream);text-align:center">No orders yet… customers are on their way!</p>';
  }
}

export function renderStations(state) {
  const broths = $('broths');
  broths.innerHTML = '';
  for (const broth of BROTHS) {
    const el = document.createElement('div');
    el.className = `station broth${state.bowl.broth === broth.id ? ' selected' : ''}`;
    el.dataset.broth = broth.id;
    el.innerHTML = `<span class="icon">${broth.icon}</span><span class="name">${broth.name}</span><span class="key-hint">${broth.desc} · press B to switch</span>`;
    broths.appendChild(el);
  }

  const noodle = $('noodle-station');
  const n = state.noodle;
  const pct = Math.min(100, (n.progress / NOODLE_BURN_SECONDS) * 100);
  const stateText = n.state === 'idle' ? 'Click to boil noodles!' :
    n.state === 'cooking' ? 'Boiling…' :
    n.state === 'ready' ? 'READY! Click to add to the bowl!' : 'BURNT! Click to discard.';
  noodle.innerHTML = `
    <div class="station noodle${n.state === 'ready' ? ' cooking' : ''}" id="noodle-btn">
      <span class="icon">🍜</span><span class="name">Noodle Pot</span>
      <span class="key-hint">press N</span>
      <div class="noodle-progress"><div style="width:${pct}%"></div></div>
      <span class="noodle-state">${stateText}</span>
    </div>`;

  const tops = $('toppings');
  tops.innerHTML = '';
  for (const top of TOPPINGS) {
    const inBowl = state.bowl.toppings.includes(top.id);
    const el = document.createElement('div');
    el.className = `station topping${inBowl ? ' selected' : ''}`;
    el.dataset.topping = top.id;
    el.innerHTML = `<span class="icon">${top.icon}</span><span class="name">${top.name}</span><span class="key-hint">key ${top.key}</span>`;
    tops.appendChild(el);
  }
}

export function renderBowl(state, ready) {
  const box = $('bowl-contents');
  box.innerHTML = '';
  const bowl = state.bowl;
  if (bowl.broth) {
    const broth = BROTHS.find((b) => b.id === bowl.broth);
    box.innerHTML += `<div class="bowl-item" data-remove="broth" title="Click to remove broth">${broth.icon}</div>`;
  }
  if (bowl.noodle) box.innerHTML += `<div class="bowl-item" data-remove="noodle" title="Click to remove noodles">🍜</div>`;
  for (const t of bowl.toppings) {
    const top = TOPPINGS.find((x) => x.id === t);
    box.innerHTML += `<div class="bowl-item" data-remove="${t}" title="Click to remove ${top.name}">${top.icon}</div>`;
  }
  if (!bowl.broth && !bowl.noodle && bowl.toppings.length === 0) {
    box.innerHTML = '<div style="font-size:40px;opacity:.35">🥣</div>';
  }
  const status = $('bowl-status');
  const serveBtn = $('btn-serve');
  if (ready) {
    status.textContent = '✅ READY TO SERVE! Matches the order!';
    status.classList.add('ready');
    serveBtn.disabled = false;
    serveBtn.classList.add('glow');
  } else {
    status.classList.remove('ready');
    serveBtn.classList.remove('glow');
    if (!bowl.broth) { status.textContent = 'Bowl empty — pour broth first!'; serveBtn.disabled = true; }
    else if (!bowl.noodle) { status.textContent = 'Broth is in — now boil the noodles!'; serveBtn.disabled = true; }
    else { status.textContent = 'Add toppings to match the ticket, then serve.'; serveBtn.disabled = false; }
  }
}

export function showFeedback(text, good) {
  const el = $('serve-feedback');
  el.textContent = text;
  el.className = good ? 'good' : 'bad';
}

export function showToast(text) { $('toast').textContent = text; }
