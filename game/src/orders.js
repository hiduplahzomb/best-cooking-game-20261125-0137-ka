// Kedai Mie Beruap — orders: ticket creation, patience and matching.
import { BROTHS, TOPPINGS, CUSTOMERS, LEVELS } from './config.js';

export function levelParams(level) {
  return LEVELS[Math.min(level - 1, LEVELS.length - 1)];
}

function pickRandom(list, rng = Math.random) {
  return list[Math.floor(rng() * list.length)];
}

function shuffled(list, rng = Math.random) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createTicket(state, rng = Math.random) {
  const params = levelParams(state.level);
  const customer = pickRandom(CUSTOMERS, rng);
  const broth = pickRandom(BROTHS, rng);
  const toppings = shuffled(TOPPINGS, rng).slice(0, params.toppings).map((t) => t.id);
  return {
    id: state.nextTicketId++,
    customer: customer.name,
    face: customer.face,
    note: customer.note,
    broth: broth.id,
    toppings,
    patience: params.patience,
    patienceMax: params.patience,
  };
}

// Is the bowl exactly what this ticket asked for?
export function bowlMatchesTicket(bowl, ticket) {
  if (!bowl.broth || bowl.broth !== ticket.broth) return false;
  if (!bowl.noodle) return false;
  if (bowl.toppings.length !== ticket.toppings.length) return false;
  return ticket.toppings.every((t) => bowl.toppings.includes(t));
}

// Which needs of the ticket are already in the bowl (for the checkmarks)?
export function ticketProgress(bowl, ticket) {
  const done = new Set();
  if (bowl.broth === ticket.broth) done.add(ticket.broth);
  if (bowl.noodle) done.add('noodle');
  for (const t of bowl.toppings) if (ticket.toppings.includes(t)) done.add(t);
  return done;
}
