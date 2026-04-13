# Space Blaster Workshop — Quick Reference

## Setup (once)
```bash
pip install lemonade-server[rocm]
lemonade pull Qwen3-Coder-30B-A3B-Instruct-GGUF
npm install -g @opencode-ai/opencode
```

## Every session
```bash
# Terminal 1 — keep running
lemonade serve --port 8000

# Terminal 2 — in project folder
lemonade launch opencode
```

## Build the game (in order)
```
@ui-renderer      build the visual foundation of the game
@physics-movement add player movement, shooting, and collision detection
@gameplay-rules   add scoring, levels, enemy spawning, lives, and game-over
```

## Open the game
Double-click `game.html` in your file manager — or:
```bash
open game.html      # macOS
xdg-open game.html  # Linux
```

## Agent quick reference
```
@ui-renderer        canvas, draw loop, HUD, particles, ship art
@physics-movement   input, movement, bullets, collision
@gameplay-rules     state, score, levels, spawning, game-over
@vfx-polish         screen shake, trails, nebula (optional Agent 4)
@boss-ai            boss fights, bullet patterns (optional Agent 5)
```

## Controls (once built)
```
WASD / Arrows  move
Space          shoot
P              pause
R              restart
```

## Git safety net
```bash
git add game.html && git commit -m "feat: what you added"
git checkout game.html   # revert if broken
```
