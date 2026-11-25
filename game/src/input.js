// Kedai Mie Beruap — input: mouse clicks and keyboard shortcuts.
import { TOPPINGS, BROTHS } from './config.js';

export function bindInput(handlers) {
  document.getElementById('tickets').addEventListener('click', (event) => {
    const ticket = event.target.closest('.ticket');
    if (ticket) handlers.selectTicket(Number(ticket.dataset.ticketId));
  });

  document.getElementById('broths').addEventListener('click', (event) => {
    const station = event.target.closest('.broth');
    if (station) handlers.pourBroth(station.dataset.broth);
  });

  document.getElementById('noodle-station').addEventListener('click', (event) => {
    if (event.target.closest('#noodle-btn')) handlers.noodleAction();
  });

  document.getElementById('toppings').addEventListener('click', (event) => {
    const station = event.target.closest('.topping');
    if (station) handlers.addTopping(station.dataset.topping);
  });

  document.getElementById('bowl-contents').addEventListener('click', (event) => {
    const item = event.target.closest('.bowl-item');
    if (item) handlers.removeFromBowl(item.dataset.remove);
  });

  document.getElementById('btn-serve').addEventListener('click', () => handlers.serve());
  document.getElementById('btn-dump').addEventListener('click', () => handlers.dumpBowl());
  document.getElementById('btn-pause').addEventListener('click', () => handlers.togglePause());
  document.getElementById('btn-mute').addEventListener('click', () => handlers.toggleMute());

  document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === ' ') { event.preventDefault(); handlers.serve(); return; }
    if (key === 'tab') {
      event.preventDefault();
      handlers.cycleTicket();
      return;
    }
    if (key === 'p') { handlers.togglePause(); return; }
    if (key === 'm') { handlers.toggleMute(); return; }
    if (key === 'n') { handlers.noodleAction(); return; }
    if (key === 'b') { handlers.cycleBroth(); return; }
    if (key === 'backspace' || key === 'delete') { handlers.dumpBowl(); return; }
    const topping = TOPPINGS.find((t) => t.key === event.key);
    if (topping) handlers.addTopping(topping.id);
  });
}

export function brothCycleOrder() {
  return BROTHS.map((b) => b.id);
}
