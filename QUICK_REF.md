# Space Blaster Workshop — Quick Reference Card

## Setup (run once)
```bash
pip install lemonade-server[rocm]
lemonade pull Qwen3-Coder-30B-A3B-Instruct-GGUF
npm install -g @opencode-ai/opencode
```

## Every session
```bash
# Terminal 1 — keep running
lemonade serve --port 8000

# Terminal 2 — coding assistant
cd ~/space-blaster-workshop && lemonade launch opencode

# Terminal 3 — game in browser
python3 -m http.server 3000 --directory src/
# Open http://localhost:3000
```

## Agent quick-invoke
```
@ui-renderer       → canvas drawing, HUD, particles, CSS
@physics-movement  → movement, collision, bullet paths
@gameplay-rules    → score, levels, power-ups, waves
@audio-sfx         → Web Audio SFX (optional, Agent 4)
@boss-ai           → boss fights, formations (optional, Agent 5)
```

## Lemonade endpoint (hardcoded in config.toml)
```
http://localhost:8000/api/v0/chat/completions
model: Qwen3-Coder-30B-A3B-Instruct-GGUF
```

## Git safety net
```bash
git add src/game.js && git commit -m "feat: <what you added>"
git checkout src/game.js    # revert if something breaks
```
