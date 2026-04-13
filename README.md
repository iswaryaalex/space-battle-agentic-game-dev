# 🚀 Space Blaster — Agentic Game Development Workshop

> **Build a real space-shooter game using specialized AI sub-agents running
> entirely on your local GPU — no cloud, no API keys, no data leaves your
> machine.**

---

## What you will build

**Space Blaster** is a 2-D canvas space-shooter featuring:
- Animated player ship with engine glow and wing geometry
- Three enemy types (Drone, Cruiser, Bomber) with distinct behaviors
- Particle explosion system and parallax star-field
- Level progression, scoring, and lives system
- Power-up architecture ready for expansion

You will evolve this game using **three specialized AI sub-agents**, each
owning a different layer of the codebase. By the end of the session you will
understand how to decompose a real software project across focused agents that
collaborate through a shared codebase.

---

## System requirements

| Component | Requirement |
|-----------|-------------|
| OS | Ubuntu 24.04 LTS |
| GPU | AMD GPU with ROCm pre-installed (RX 7000-series or MI-series) |
| RAM | 16 GB minimum (32 GB recommended) |
| Disk | ~10 GB free (model weights) |
| Node.js | 18 or later |

---

## Part 1 — Install Lemonade Server (Local AI Inference)

Lemonade is a lightweight OpenAI-compatible inference server optimised for
AMD ROCm GPUs. It serves models locally so every agent call stays on-device.

### 1.1 Install Lemonade

```bash
pip install lemonade-server
```

If you prefer the ROCm-optimised wheel:

```bash
pip install lemonade-server[rocm]
```

### 1.2 Pull the workshop model

```bash
lemonade pull Qwen3-Coder-30B-A3B-Instruct-GGUF
```

> ⏱ This downloads ~18 GB. Do this on workshop Wi-Fi before the session starts
> if possible. The model is cached at `~/.lemonade/models/`.

### 1.3 Start the Lemonade server

Open a **dedicated terminal tab** — keep this running throughout the workshop:

```bash
lemonade serve --port 8000
```

You should see:

```
✓ Lemonade server listening on http://localhost:8000
✓ Loaded: Qwen3-Coder-30B-A3B-Instruct-GGUF
✓ ROCm device: AMD Radeon RX 7900 XTX
```

### 1.4 Verify the endpoint

```bash
curl http://localhost:8000/api/v0/models | python3 -m json.tool
```

You should see `Qwen3-Coder-30B-A3B-Instruct-GGUF` in the model list. ✅

---

## Part 2 — Install OpenCode

OpenCode is an AI-powered terminal coding assistant that understands your
project structure and can invoke named sub-agents.

### 2.1 Install via npm

```bash
npm install -g @opencode-ai/opencode
```

Verify:

```bash
opencode --version
```

### 2.2 (Optional) Confirm Node.js version

```bash
node --version   # Should be v18+
```

---

## Part 3 — Clone the Workshop Project

```bash
git clone https://github.com/workshop/space-blaster-workshop
# — or — if running from a USB drive:
cp -r /media/workshop/space-blaster-workshop ~/
cd ~/space-blaster-workshop
```

Project layout:

```
space-blaster-workshop/
├── .opencode/
│   ├── config.toml            ← Lemonade endpoint config (pre-filled)
│   └── agents/
│       ├── ui-renderer.md     ← Agent 1: canvas drawing & HUD
│       ├── physics-movement.md← Agent 2: movement & collision
│       ├── gameplay-rules.md  ← Agent 3: scoring, levels, power-ups
│       ├── vfx-polish.md      ← Agent 4 (optional): screen FX & trails
│       └── boss-ai.md         ← Agent 5 (optional): boss fights & AI
└── src/
    ├── index.html             ← Game shell
    └── game.js                ← Complete game source (single file)
```

---

## Part 4 — Launch OpenCode with Lemonade

This is the key integration step. One command wires everything together:

```bash
cd ~/space-blaster-workshop
lemonade launch opencode
```

> **What this does:**
> `lemonade launch opencode` starts OpenCode and automatically injects the
> Lemonade endpoint (`http://localhost:8000/api/v0`) as the OpenAI-compatible
> provider. The `.opencode/config.toml` in the project folder then maps this
> to `Qwen3-Coder-30B-A3B-Instruct-GGUF`. All agent calls flow through your
> local GPU — zero cloud, zero telemetry.

You will see the OpenCode TUI appear. At the bottom prompt:

```
> ▌
```

Type:

```
/status
```

Expected output:

```
✓ Provider : openai-compatible (Lemonade)
✓ Endpoint : http://localhost:8000/api/v0
✓ Model    : Qwen3-Coder-30B-A3B-Instruct-GGUF
✓ Agents   : ui-renderer · physics-movement · gameplay-rules
```

🎉 **OpenCode is now talking to your local AI.** Everything from here runs
on-device.

---

## Part 5 — Play the Base Game First

Before involving any agents, open the game in a browser to understand what
you are starting with.

```bash
# Simple local server — any of these work
python3 -m http.server 3000 --directory src/
# or
npx serve src/ -l 3000
```

Open `http://localhost:3000` in Firefox or Chrome.

**Controls:**
| Key | Action |
|-----|--------|
| `WASD` / `Arrow keys` | Move |
| `Space` / `Z` | Shoot |
| `P` | Pause |
| `R` | Restart after game-over |

**Spend 2–3 minutes playing.** Notice:
- Enemies spawn and fall faster each level
- Three enemy shapes with different HP pools
- Explosion particles on every death
- Lives counter in the top-right

Then come back and start evolving it with the agents.

---

## Part 6 — Working with the Three Core Sub-Agents

Each agent is a Markdown file in `.opencode/agents/`. OpenCode reads these
and uses them to route your requests to the right specialist with the right
system prompt and context.

### How to invoke an agent

Inside OpenCode, prefix your message with `@agent-name`:

```
@ui-renderer add a screen-shake effect when the player loses a life
```

```
@physics-movement make cruiser enemies fly in a sine wave at level 3+
```

```
@gameplay-rules add a rapid-fire power-up that lasts 8 seconds
```

OpenCode will:
1. Load the agent's system prompt from the `.md` file
2. Include `src/game.js` as context (configured in `config.toml`)
3. Send the request to Lemonade → Qwen3-Coder
4. Stream the response back and offer to apply the diff

---

### Agent 1 · `ui-renderer` — Visual Rendering Specialist

**Owns:** `draw()` function, canvas 2D API, HUD, particles, CSS

**Try these prompts:**

```
@ui-renderer Add a pulsing cyan ring around the player ship when shield > 0
```

```
@ui-renderer Create a warp-speed hyperjump animation when the level increases
```

```
@ui-renderer Add a combo multiplier display that fades out after 2 seconds of
             not shooting
```

```
@ui-renderer Replace the plain score text with a stylized segmented-display
             style counter in the top-left
```

**What to observe:** The agent only touches `draw()` and visual helpers. It
explicitly avoids modifying `update()`, score logic, or collision code. That
is *specialization in action*.

---

### Agent 2 · `physics-movement` — Physics & Collision Specialist

**Owns:** `update()` physics tick, velocity math, hitbox collision

**Try these prompts:**

```
@physics-movement Add a dodge-roll for the player triggered by Shift — brief
                  invincibility frames with a 2-second cooldown
```

```
@physics-movement Make bomber enemies slow down and hover for 1 second before
                  dropping a cluster bomb
```

```
@physics-movement Add a homing missile weapon the player fires with X key —
                  tracks the nearest enemy
```

```
@physics-movement Make drone enemies form a V-formation and attack in groups
                  of 5 starting at level 4
```

**What to observe:** The agent returns position/velocity math only. When it
needs a visual flash for the dodge-roll, it notes "hand off to ui-renderer"
rather than writing draw code itself.

---

### Agent 3 · `gameplay-rules` — Gameplay Systems Specialist

**Owns:** scoring, levelling, power-ups, spawn waves, win/lose conditions

**Try these prompts:**

```
@gameplay-rules Add a combo chain system — consecutive kills within 1.5 seconds
                multiply the score by the chain length (max ×8)
```

```
@gameplay-rules Add a shield power-up that drops from bombers with 15% chance
                and gives the player 3 shield charges
```

```
@gameplay-rules Implement a high-score leaderboard stored in localStorage that
                shows the top 5 scores on the game-over screen
```

```
@gameplay-rules Add a 10-second survival bonus wave at level 3 where only
                drones swarm — no other enemy types spawn
```

**What to observe:** The agent edits `checkLevelUp()`, `state`, and spawn
logic. It deliberately avoids touching `ctx.fillRect` or physics vectors.

---

## Part 7 — Watching Agents Collaborate

The real power of multi-agent systems is chained execution. Try this sequence:

**Step 1** — Ask gameplay-rules to add a boss at level 5:
```
@gameplay-rules At level 5 set state.bossActive = true and stop normal spawning
```

**Step 2** — Ask physics-movement to add boss movement:
```
@physics-movement When state.bossActive is true, spawn a boss entity that
                  patrols left-right and shoots downward every 60 frames
```

**Step 3** — Ask ui-renderer to make the boss look dramatic:
```
@ui-renderer Draw the boss as a large hexagonal dreadnought with a pulsing
             red core and a health bar at the top of the screen
```

Watch how each agent reads the shared `game.js` and builds on what the
previous agent added — without any of them overwriting each other's work.

---

## Part 8 — Adding Optional Agents (Expand to 4–5)

### Activating Agent 4 · `vfx-polish`

The agent file is already present at `.opencode/agents/vfx-polish.md`.

This agent adds **purely visual feedback** — every game event that would
normally have a sound cue is communicated through screen-space effects:
shakes, flashes, trails, vignettes, and animated nebulae.

**Activate it with these prompts in sequence:**

```
@vfx-polish Add screen shake when the player takes damage, and a red
            vignette that intensifies when lives drop to 1
```

```
@vfx-polish Add an animated purple-blue nebula cloud background that
            slowly drifts across the star-field
```

```
@vfx-polish Add a motion trail behind the player ship that fades over
            8 frames using ghost images at decreasing opacity
```

**Visual-to-sound mapping the agent knows about:**

| Game event | Visual cue it adds |
|------------|-------------------|
| Player hit | Red full-screen flash + screen shake |
| Enemy explodes | Trauma shake proportional to enemy size |
| Level up | White wipe across the screen |
| Shield absorbs hit | Expanding cyan ring from player position |
| Boss spawns | Zoom-punch + red scanline sweep |
| Lives = 1 | Persistent red vignette around screen edges |

**Expected outcome:** The game feels dramatically more responsive and
cinematic — entirely through visuals, which is actually more powerful in
a workshop setting where attendees can *see* the effects immediately.

---

### Activating Agent 5 · `boss-ai`

The agent file is at `.opencode/agents/boss-ai.md`.

**Activate it:**

```
@boss-ai Design a 3-phase boss called "The Void Sovereign" — phase 1 is a
         fan-shot pattern, phase 2 adds a spiral, phase 3 goes berserk
```

The agent will generate:
- `spawnBoss()` factory function
- Boss update logic (movement + phase transitions)
- `fanShot()` and `spiralShot()` bullet-pattern emitters
- Integration instructions for the collision system

Wire the boss into the game by following the agent's output instructions.

---

## Part 9 — DIY Challenge Tasks

Use the agents independently to implement one of these features before the
session ends. No hand-holding — see how far you get!

| # | Challenge | Suggested agent |
|---|-----------|----------------|
| 🥉 | Add a warp-speed trail and speed-lines during level-up | `vfx-polish` |
| 🥈 | Enemies dodge player bullets at level 6+ | `physics-movement` |
| 🥇 | Full 5-level campaign with a credits screen on completion | `gameplay-rules` |
| 🏆 | Boss that splits into two mini-bosses at 25% HP | `boss-ai` + `physics-movement` |

---

## Troubleshooting

### Lemonade won't start

```bash
# Check ROCm sees your GPU
rocm-smi

# Reinstall with ROCm extras
pip install lemonade-server[rocm] --force-reinstall
```

### OpenCode shows "connection refused"

Make sure Lemonade is running in a separate terminal **before** launching
OpenCode:

```bash
# Terminal 1
lemonade serve --port 8000

# Terminal 2
lemonade launch opencode
```

### Model is slow / running on CPU

```bash
lemonade serve --port 8000 --device gpu --gpu-layers 40
```

If ROCm is installed but not detected, export:

```bash
export HSA_OVERRIDE_GFX_VERSION=11.0.0   # adjust for your GPU
lemonade serve --port 8000
```

### Agent returns code that breaks the game

OpenCode diffs are not auto-applied — you must press `y` to accept. If
something breaks:

```bash
git diff src/game.js     # see what changed
git checkout src/game.js # revert to last commit
```

Commit after each working feature:

```bash
git add src/game.js && git commit -m "feat: add shield powerup"
```

---

## Architecture reference

```
┌─────────────────────────────────────────────────────────────┐
│  Your Terminal  (Ubuntu 24.04 + ROCm)                       │
│                                                             │
│   ┌───────────────┐    lemonade launch opencode             │
│   │  Lemonade     │◄────────────────────────────────────┐  │
│   │  Server       │  http://localhost:8000/api/v0        │  │
│   │  :8000        │                                     │  │
│   └──────┬────────┘                                     │  │
│          │  ROCm inference                              │  │
│   ┌──────▼────────┐                                     │  │
│   │  Qwen3-Coder  │                                     │  │
│   │  30B GGUF     │                                     │  │
│   └───────────────┘                                     │  │
│                                                         │  │
│   ┌─────────────────────────────────────────────────┐  │  │
│   │  OpenCode TUI                                   │  │  │
│   │                                                 │──┘  │
│   │  @ui-renderer ──► .opencode/agents/ui-renderer.md    │
│   │  @physics-movement ► physics-movement.md             │
│   │  @gameplay-rules ──► gameplay-rules.md               │
│   │  @vfx-polish (opt) ► vfx-polish.md                     │
│   │  @boss-ai   (opt) ► boss-ai.md                       │
│   │                                                 │     │
│   │  Shared context: src/game.js ◄──────────────── │     │
│   └─────────────────────────────────────────────────┘     │
│                                                             │
│   Browser: http://localhost:3000  (your game live!)        │
└─────────────────────────────────────────────────────────────┘
```

---

## Key workshop takeaways

1. **Specialization reduces errors** — each agent has a narrow surface area
   so it doesn't accidentally break unrelated code.

2. **Shared context is the glue** — all agents read the same `game.js`, so
   their outputs compose naturally without a central orchestrator.

3. **Local inference = full control** — Lemonade + ROCm means the model runs
   on your GPU. Latency is low, privacy is total, and you can experiment
   freely without rate limits or costs.

4. **Agent files are just Markdown** — `.opencode/agents/*.md` are human-readable
   specs. You can read, edit, and version-control them like any other source file.

5. **Expanding to 5 agents is additive** — `vfx-polish.md` and `boss-ai.md`
   are drop-in additions that don't require restructuring the existing three.

---

*Happy hacking! 🚀  Questions? Ask your facilitator or ping the workshop Slack.*
