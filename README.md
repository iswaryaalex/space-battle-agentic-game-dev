# 🚀 Space Blaster — Agentic Game Development Workshop

> **Watch three specialized AI agents build a space-shooter from a blank file —
> live, on your local GPU. No cloud. No API keys.**

---

## How this workshop works

You start with a single nearly-empty `game.html`. Three pre-written AI
sub-agents build it from scratch in front of you using **OpenCode** connected
to **Lemonade Server** running locally on the **AMD Ryzen AI Max 395 (Strix Halo)**.

Once the game is running, you take over and push the agents further.

---

## Project structure

```
space-blaster-workshop/
├── game.html                  ← the one file everything gets built into
└── .opencode/
    ├── config.toml            ← points OpenCode at Lemonade (pre-filled)
    └── agents/
        ├── ui-renderer.md         Agent 1 — canvas, draw loop, HUD, particles
        ├── physics-movement.md    Agent 2 — input, movement, collision
        ├── gameplay-rules.md      Agent 3 — state, score, levels, game-over
        ├── vfx-polish.md          Agent 4 (optional) — screen shake, trails
        └── boss-ai.md             Agent 5 (optional) — boss fights
```

---

## Setup (do this before the session)

### 1 — Install Lemonade
```bash
pip install lemonade-server[rocm]
lemonade pull Qwen3-Coder-30B-A3B-Instruct-GGUF
```
> ~18 GB download — do this on workshop Wi-Fi ahead of time.

### 2 — Install OpenCode
```bash
npm install -g @opencode-ai/opencode
```

### 3 — Get the workshop files
```bash
cp -r /media/workshop/space-blaster-workshop ~/
cd ~/space-blaster-workshop
```

---

## Workshop flow

### Start Lemonade — keep this terminal open all session
```bash
lemonade serve --port 8000
```

### Launch OpenCode in the project folder
```bash
cd ~/space-blaster-workshop
lemonade launch opencode
```

OpenCode is now talking to your local GPU. Confirm with `/status`.

---

## Build the game — invoke agents in order

### Step 1
```
@ui-renderer build the visual foundation of the game
```
→ Canvas, star-field, ship art, enemy shapes, HUD, draw loop appear in `game.html`

### Step 2
```
@physics-movement add player movement, shooting, and collision detection
```
→ Ship moves, bullets fire, enemies fall, hits register

### Step 3
```
@gameplay-rules add scoring, levels, enemy spawning, lives, and game-over
```
→ Fully playable game. Double-click `game.html` to play.

---

## Controls
| Key | Action |
|-----|--------|
| `WASD` / Arrows | Move |
| `Space` | Shoot |
| `P` | Pause |
| `R` | Restart |

---

## Attendee challenges — push the agents further

### `@ui-renderer`
```
add a pulsing cyan ring around the player when shield > 0
add a warp-speed animation when the level increases
make explosions leave a smoke cloud that fades slowly
```

### `@physics-movement`
```
add a dodge-roll on Shift with invincibility frames and 2s cooldown
make cruiser enemies strafe side to side while descending
add a homing missile on the X key
```

### `@gameplay-rules`
```
add a score combo — consecutive kills within 1.5s multiply points
add a shield power-up that drops from bombers with 15% chance
save the high score to localStorage and show it on game-over
```

---

## Optional — expand to 4 or 5 agents

Uncomment the relevant agent in `.opencode/config.toml`, then:

### Agent 4 — VFX Polish
```
@vfx-polish add screen shake on player hit and red vignette when lives = 1
@vfx-polish add an animated nebula drifting across the star-field
@vfx-polish add a motion trail behind the player ship
```

### Agent 5 — Boss AI
```
@boss-ai add a 3-phase boss called The Void Sovereign that spawns at level 5
```

---

## Troubleshooting

**Arrow keys not working** — click the canvas first to give it focus, or ask:
```
@physics-movement arrow keys are not working — fix keyboard focus on the canvas
```

**Lemonade not starting**
```bash
rocm-smi   # confirm GPU is visible
pip install lemonade-server[rocm] --force-reinstall
```

**Model slow or running on CPU**
```bash
lemonade serve --port 8000 --device gpu --gpu-layers 40
```

**Agent broke the game**
```bash
git checkout game.html   # revert to last working state
```

Commit after each working feature:
```bash
git add game.html && git commit -m "feat: dodge roll"
```

---

## Architecture

```
  AMD Ryzen AI Max 395 — Strix Halo — Ubuntu 24.04 + ROCm
  ┌────────────────────────────────────────────────────┐
  │                                                    │
  │  Lemonade Server :8000                             │
  │  └─► Qwen3-Coder-30B  (on-device GPU inference)   │
  │                                                    │
  │  OpenCode TUI                                      │
  │  ├─ @ui-renderer      ──► ui-renderer.md           │
  │  ├─ @physics-movement ──► physics-movement.md      │
  │  ├─ @gameplay-rules   ──► gameplay-rules.md        │
  │  ├─ @vfx-polish       ──► vfx-polish.md  (opt)    │
  │  └─ @boss-ai          ──► boss-ai.md     (opt)     │
  │                 ↓                                  │
  │            game.html  ←  single file, browser-ready│
  └────────────────────────────────────────────────────┘
```
