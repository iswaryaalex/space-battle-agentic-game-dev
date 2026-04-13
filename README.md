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

## Setup

> No Node.js. No pip. No npm. Just two apt installs and a git clone.

### 1 — Install Lemonade Server

Lemonade runs large AI models locally on your AMD GPU via ROCm.
Full details at: **https://lemonade-server.ai**

```bash
sudo add-apt-repository ppa:lemonade-team/stable
sudo apt install lemonade-server
```

### 2 — Install OpenCode

```bash
curl -fsSL https://opencode.ai/install.sh | sh
```

### 3 — Clone the workshop repo

```bash
git clone https://github.com/iswaryaalex/space-battle-agentic-game-dev.git
cd space-battle-agentic-game-dev
```

---

## Workshop flow

### Step 1 — Launch OpenCode with Lemonade

From inside the project folder:

```bash
lemonade launch opencode
```

Lemonade starts the inference server and launches OpenCode in one command.
You will be prompted to select a model recipe:

```
Select a recipe to import and use with Opencode:
  0) Browse downloaded models
  1) GLM-4.7-Flash-GGUF-NoThinking.json
  2) GLM-4.7-Flash-GGUF-ThinkingCoder.json
  3) Gemma-4-26B-A4B-NoThinking.json
  4) Gemma-4-26B-A4B-ThinkingCoder.json
  5) Qwen3.5-35B-A3B-NoThinking.json
  6) Qwen3.5-35B-A3B-ThinkingCoder.json
```

**Select option 6 — `Qwen3.5-35B-A3B-ThinkingCoder`**

> Option 5 (NoThinking) is faster. Option 6 reasons through the code more
> carefully — recommended for the best results during the workshop.

### Step 2 — Confirm agents are loaded

Inside OpenCode, type:

```
/agents
```

You should see:
```
ui-renderer
physics-movement
gameplay-rules
vfx-polish      (optional)
boss-ai         (optional)
```

You are all set. Now build the game.

---

## Build the game — invoke agents in order

### Step 3 — Visual layer
```
@ui-renderer build the visual foundation of the game
```
→ Canvas, star-field, ship art, enemy shapes, HUD, and draw loop written into `game.html`

### Step 4 — Physics layer
```
@physics-movement add player movement, shooting, and collision detection
```
→ Ship moves, bullets fire, enemies fall, hits register

### Step 5 — Gameplay layer
```
@gameplay-rules add scoring, levels, enemy spawning, lives, and game-over
```
→ Fully playable game. Open `game.html` in your browser:

```bash
xdg-open game.html
```

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
make enemies shoot back at the player starting at level 4
```

### `@gameplay-rules`
```
add a score combo — consecutive kills within 1.5s multiply points
add a shield power-up that drops from bombers with 15% chance
save the high score to localStorage and show it on game-over
add a survival wave at level 3 — only drones for 10 seconds
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

**Arrow keys not working** — click the canvas to give it focus, or ask:
```
@physics-movement arrow keys not working — fix keyboard focus on the canvas
```

**Wrong model selected** — exit OpenCode, run `lemonade launch opencode` again
and select option 5 or 6.

**Agent broke the game**
```bash
git checkout game.html   # revert to last working state
```

Commit after each working feature:
```bash
git add game.html && git commit -m "feat: what you added"
```

---

## Architecture

```
  AMD Ryzen AI Max 395 — Strix Halo — Ubuntu 24.04 + ROCm
  ┌────────────────────────────────────────────────────┐
  │                                                    │
  │  lemonade launch opencode                          │
  │  └─► Lemonade Server  (on-device GPU inference)   │
  │       └─► Qwen3.5-35B-A3B-ThinkingCoder           │
  │                                                    │
  │  OpenCode TUI                                      │
  │  ├─ @ui-renderer      ──► ui-renderer.md           │
  │  ├─ @physics-movement ──► physics-movement.md      │
  │  ├─ @gameplay-rules   ──► gameplay-rules.md        │
  │  ├─ @vfx-polish       ──► vfx-polish.md  (opt)    │
  │  └─ @boss-ai          ──► boss-ai.md     (opt)     │
  │                 ↓                                  │
  │            game.html  ←  single file, double-click │
  └────────────────────────────────────────────────────┘
```