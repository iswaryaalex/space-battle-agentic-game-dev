# 🚀 Space Blaster — Agentic Game Development Workshop

> **Watch three specialized AI agents build a space-shooter from a blank file —
> live, on your local GPU, no cloud, no API keys.**

---

## How this workshop works

You start with a single nearly-empty `game.html`. Three pre-written AI
sub-agents — each a specialist in one layer of the game — will build it
from scratch in front of you using **OpenCode** talking to a local AI model
served by **Lemonade** on the **AMD Ryzen AI Max 395 (Strix Halo)**.

Once the game is running, **you** take over and push the agents further.

```
game.html  ←  blank canvas today
           ←  fully playable space-shooter by end of session
```

---

## Project structure

```
space-blaster-workshop/
├── game.html                      ← the ONE file everything gets built into
└── .opencode/
    ├── config.toml                ← points OpenCode at Lemonade (pre-filled)
    └── agents/
        ├── ui-renderer.md         ← Agent 1: canvas, drawing, HUD, particles
        ├── physics-movement.md    ← Agent 2: movement, input, collision
        ├── gameplay-rules.md      ← Agent 3: score, levels, enemies, game-over
        ├── vfx-polish.md          ← Agent 4 (optional): screen shake, trails
        └── boss-ai.md             ← Agent 5 (optional): boss fights
```

---

## Part 1 — Install Lemonade Server

Lemonade runs large AI models locally on your AMD GPU via ROCm.

```bash
pip install lemonade-server[rocm]
```

Pull the workshop model:

```bash
lemonade pull Qwen3-Coder-30B-A3B-Instruct-GGUF
```

> ⏱ ~18 GB download. Do this before the session on workshop Wi-Fi.

Start the server — **keep this terminal open all session:**

```bash
lemonade serve --port 8000
```

Verify it's running:

```bash
curl http://localhost:8000/api/v0/models | python3 -m json.tool
```

You should see `Qwen3-Coder-30B-A3B-Instruct-GGUF` in the list. ✅

---

## Part 2 — Install OpenCode

```bash
npm install -g @opencode-ai/opencode
opencode --version
```

---

## Part 3 — Get the workshop files

```bash
# From USB or workshop share:
cp -r /media/workshop/space-blaster-workshop ~/
cd ~/space-blaster-workshop
```

Open `game.html` in a text editor and a browser side by side. Right now it
is almost empty — just a `<canvas>` tag and an empty `<script>` block.
That blank file is where the magic happens.

---

## Part 4 — Launch OpenCode with Lemonade

```bash
cd ~/space-blaster-workshop
lemonade launch opencode
```

This single command starts OpenCode and wires it to Lemonade. The
`.opencode/config.toml` in the project folder handles all the routing —
`http://localhost:8000/api/v0` with `Qwen3-Coder-30B-A3B-Instruct-GGUF`.

Confirm everything is connected:

```
/status
```

Expected:
```
✓ Provider : openai-compatible (Lemonade)
✓ Endpoint : http://localhost:8000/api/v0
✓ Model    : Qwen3-Coder-30B-A3B-Instruct-GGUF
✓ Agents   : ui-renderer · physics-movement · gameplay-rules
```

---

## Part 5 — Build the game live with the agents

This is the main event. You will invoke the three agents in order.
Each one reads `game.html`, adds its layer, and hands off to the next.

---

### Step 1 · Invoke `ui-renderer` first

```
@ui-renderer build the visual foundation of the game
```

The agent will:
- Set up and style the canvas (800×600, black deep-space background)
- Create the scrolling star-field
- Write the `draw()` loop — player ship, enemy shapes, bullets, particles, HUD
- Wire it into `requestAnimationFrame`

**After it finishes:** refresh `game.html` in the browser. You should see
a glowing cyan spaceship on a star-field. Nothing moves yet — that comes next.

---

### Step 2 · Invoke `physics-movement`

```
@physics-movement add player movement, shooting, and collision detection
```

The agent will:
- Add keyboard input (WASD / arrows to move, Space to shoot)
- Write bullet physics — fire upward, remove when off-screen
- Write enemy movement — fall downward at varying speeds
- Write AABB collision — bullets vs enemies, enemies vs player

**After it finishes:** refresh the browser. Your ship moves. Space fires.
Enemies fall. Collisions work.

---

### Step 3 · Invoke `gameplay-rules`

```
@gameplay-rules add scoring, levels, enemy spawning, lives, and game-over
```

The agent will:
- Define the central `state` object tying everything together
- Wire up score increments, level progression, and spawn rate scaling
- Add lives system, game-over screen, and R-to-restart
- Bootstrap the game loop so everything starts automatically

**After it finishes:** refresh the browser. You now have a **complete,
playable space-shooter** — built from scratch by three AI agents in minutes.

Play it. Break it. Then push it further.

---

## Part 6 — Now you drive: attendee challenges

The agents are still running. Use them to evolve the game however you want.

### Challenge the `ui-renderer`

```
@ui-renderer add a pulsing cyan shield ring around the player when shield > 0
```
```
@ui-renderer add a warp-speed animation when the level increases
```
```
@ui-renderer make explosions leave a lingering smoke cloud that fades out
```

### Challenge `physics-movement`

```
@physics-movement add a dodge-roll on Shift with invincibility frames and 2s cooldown
```
```
@physics-movement make cruiser enemies strafe side to side while descending
```
```
@physics-movement add a homing missile weapon on the X key
```

### Challenge `gameplay-rules`

```
@gameplay-rules add a score combo — consecutive kills within 1.5s multiply points
```
```
@gameplay-rules add a shield power-up that drops from bombers with 15% chance
```
```
@gameplay-rules save the high score to localStorage and show it on game-over
```

---

## Part 7 — Optional: expand to 4–5 agents

### Add Agent 4 · `vfx-polish`

Activate it by uncommenting in `.opencode/config.toml`, then:

```
@vfx-polish add screen shake on player hit and a red vignette when lives = 1
```
```
@vfx-polish add an animated purple nebula drifting across the star-field
```
```
@vfx-polish add a motion trail behind the player ship
```

Every game event gets a dramatic visual response — no audio needed.

---

### Add Agent 5 · `boss-ai`

Uncomment in `.opencode/config.toml`, then:

```
@boss-ai add a 3-phase boss called The Void Sovereign that spawns at level 5
```

The agent builds a full boss with:
- Left-right patrol → charge attack → erratic zigzag across phases
- Fan shot → spiral shot → both simultaneously
- Boss health bar HUD at the top of the screen

---

## Controls (once the game is built)

| Key | Action |
|-----|--------|
| `WASD` / Arrows | Move |
| `Space` | Shoot |
| `P` | Pause |
| `R` | Restart |

---

## Troubleshooting

**Lemonade not starting:**
```bash
rocm-smi                                      # confirm GPU is visible
pip install lemonade-server[rocm] --force-reinstall
```

**OpenCode can't connect:**
Make sure Lemonade is running in a separate terminal *before* launching OpenCode.

**Model running slow / on CPU:**
```bash
lemonade serve --port 8000 --device gpu --gpu-layers 40
# If ROCm not auto-detected:
export HSA_OVERRIDE_GFX_VERSION=11.0.0
lemonade serve --port 8000
```

**Agent broke the game:**
```bash
git diff game.html          # see what changed
git checkout game.html      # revert to last working state
```

Commit after each working feature:
```bash
git add game.html && git commit -m "feat: dodge roll"
```

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│  AMD Ryzen AI Max 395 (Strix Halo) — Ubuntu 24.04   │
│                                                      │
│  ┌─────────────────┐                                │
│  │ Lemonade Server │  http://localhost:8000          │
│  │ :8000  (ROCm)   │                                │
│  └────────┬────────┘                                │
│           │                                         │
│  ┌────────▼────────┐                                │
│  │ Qwen3-Coder 30B │  on-device GPU inference       │
│  └────────┬────────┘                                │
│           │                                         │
│  ┌────────▼──────────────────────────────────────┐  │
│  │  OpenCode TUI                                 │  │
│  │                                               │  │
│  │  @ui-renderer      ──► agents/ui-renderer.md  │  │
│  │  @physics-movement ──► physics-movement.md    │  │
│  │  @gameplay-rules   ──► gameplay-rules.md      │  │
│  │  @vfx-polish       ──► vfx-polish.md (opt)   │  │
│  │  @boss-ai          ──► boss-ai.md (opt)       │  │
│  │                                               │  │
│  │  Shared target: game.html ◄─────────────────  │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  Browser: double-click game.html  →  play instantly │
└──────────────────────────────────────────────────────┘
```

---

## Key takeaways

- **One file, three agents** — specialized agents collaborate on a single
  `game.html` without stepping on each other
- **On-device inference** — Strix Halo + Lemonade means the 30B model runs
  entirely on your local GPU, no cloud required
- **Agents are just Markdown** — readable, editable, version-controllable
- **You can go further** — the challenge prompts are a starting point,
  not a ceiling. The agents respond to anything you throw at them.

---

*Happy hacking! 🚀*
