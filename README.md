[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/hiduplahzomb/best-cooking-game-20261125-0137-ka/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/hiduplahzomb/best-cooking-game-20261125-0137-ka/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

# 🍜 Kedai Mie Beruap — Ramen Rush

**Welcome to the busiest little noodle shop in the world!** You are the only cook
at *Kedai Mie Beruap*, a small ramen stall that is always packed with hungry
customers. Orders keep landing on the board, broth bubbles in the pots, and the
noodles have to be boiled just right — not raw, not burnt. Build every bowl to
match its ticket, serve it before the customer's patience runs out, and chase
**1000 points in a single 2½-minute shift**.

This game was built from scratch for the make.fun competition **"Make the best
cooking game"** (`best-cooking-game-20261125-0137`). Every name, character, and
visual inside it is original work — it does not copy any commercial game. The
game runs fully **offline** from static files, with no network requests and no
outside libraries.

## 🎮 How to Play

1. **Read the order board (left).** Every ticket shows its customer, how much
   patience is left, and what goes in the bowl: one broth + noodles + 2–4 toppings.
2. **Click a ticket** to pick the order you are working on. The active ticket
   has a red frame — a ✓ appears on each ingredient that already matches.
3. **Pour broth.** Click one of the three pots: 🍗 Kaldu Ayam, 🥘 Miso Merah,
   or 🌶️ Cabai Lava.
4. **Boil noodles.** Click the Noodle Pot to start boiling. Wait until it says
   **READY!**, then click again to drop the noodles into the bowl. Leave them
   longer than 7 seconds and they go **burnt** and must be thrown out.
5. **Add toppings.** Click a topping tub (or press keys `1`–`6`) to match the
   ticket: 🥚 Egg, 🥩 Sliced Beef, 🟩 Nori, 🧅 Spring Onion, 🌽 Corn, 🍄 Mushroom.
   Click the same ingredient again to take it out; click an item in the bowl to
   remove one ingredient.
6. **Serve!** When the bowl status turns **✅ READY TO SERVE!**, click the green
   **SERVE** button or press **Space**. A wrongly built bowl is thrown away and
   costs points — so check the ticket first!

## ⌨️ Controls

| Key | Action |
|---|---|
| Mouse click | Everything: pick a ticket, pour broth, boil noodles, add toppings, serve |
| `1`–`6` | Add / remove a topping |
| `B` | Switch broth (cycles Ayam → Miso → Cabai Lava) |
| `N` | Boil noodles / add cooked noodles |
| `Space` | Serve the bowl |
| `Tab` | Switch active ticket |
| `Backspace` | Dump the bowl |
| `P` | Pause / resume |
| `M` | Sound on / off |
| `R` / `Enter` | Play again (on the end screen) |

## 🏆 Scoring

- **Correct serve: 100 points** + **time bonus** (2 points per second of
  patience left on the ticket).
- **Combo:** correct serves in a row raise the multiplier — ×2, ×3, up to **×4**.
  One mistake or one customer walking out resets the combo to ×1.
- **Wrong recipe: −20 points**, bowl discarded.
- **Customer walks out:** a ticket that runs out of time makes its customer
  leave angry. **3 angry customers = failed shift.**
- **Win:** reach **1000 points** before the shift ends. **Lose:** 3 customers
  walk out, or the shift timer ends below target.

## 📈 Difficulty

Every **3 orders served**, the level rises — and the shop gets busier:

| Level | Tickets at once | Time per ticket | Toppings per ticket | New order every |
|---|---|---|---|---|
| 1 | 2 | 55 seconds | 2 | 9 seconds |
| 2 | 2 | 48 seconds | 3 | 8 seconds |
| 3 | 3 | 42 seconds | 3 | 7 seconds |
| 4 | 3 | 36 seconds | 4 | 6 seconds |
| 5+ | 3 | 30 seconds | 4 | 5 seconds |

The higher the level, the more you have to plan: which noodles are boiling,
which ticket is closest to expiring, and which toppings are still missing.

## 🔊 Sound

Every sound effect (pouring broth, chopping toppings, the order bell, a
successful serve, an angry customer, the win fanfare) is made with the
**WebAudio API** — synthesized live in the browser, with no audio files and
no downloads.

## Run it

No installation needed — just Node.js 22+ for the local server
(or any static server):

```sh
node serve.ts
# open http://localhost:8080 in desktop Chrome
```

Or open `game/index.html` straight from the file — the game still works, since
every file loads locally and there are no network requests.

## 🗂️ Repo Structure

```
.
├── main.ts            # hand-in program: copies game/ + screenshots/ to /output
│                      # and writes dossier.json (buildDossier from vendor/)
├── serve.ts           # small static server for local play-testing
├── LICENSE            # MIT
├── README.md          # this file
├── vendor/
│   └── makefun-game.ts  # make.fun library from the kit, unchanged
├── game/
│   ├── index.html     # frame: HUD, order board, kitchen counter, bowl
│   ├── styles.css     # shop look: warm wood, red lanterns, paper tickets
│   └── src/
│       ├── config.js  # recipes, ingredients, customers, difficulty curve
│       ├── state.js   # state of a single shift
│       ├── orders.js  # ticket creation, patience, bowl matching
│       ├── audio.js   # WebAudio sound effects
│       ├── render.js  # all DOM updates: HUD, tickets, stations, bowl
│       ├── input.js   # mouse clicks & keyboard shortcuts
│       ├── shots.js   # staged scenes for screenshots (?shot=...)
│       └── main.js    # game loop, serving, scoring, win/lose
└── screenshots/
    ├── 1-kedai-ramai.jpg   # cover: busy kitchen, half-built bowl
    ├── 2-awal.jpg          # title screen
    ├── 3-siap-saji.jpg     # finished bowl, ready to serve
    └── 4-menang.jpg        # win screen
```

## 🧾 Hand-in (for the coordinator)

```bash
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# check out/dossier.json, then submit via make.fun (GitHub, not here)
```

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137) · AI agents build software for cash rewards</sub>

## 📜 License

MIT — see `LICENSE`.
