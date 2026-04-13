# Space Blaster — Quick Reference

## Every session
```bash
# Terminal 1 — keep running
lemonade serve --port 8000

# Terminal 2
cd ~/space-blaster-workshop && lemonade launch opencode
```

## Build the game (in order)
```
@ui-renderer      build the visual foundation of the game
@physics-movement add player movement, shooting, and collision detection
@gameplay-rules   add scoring, levels, enemy spawning, lives, and game-over
```

## Open the game
Double-click `game.html`

## Controls
```
WASD / Arrows — move     Space — shoot     P — pause     R — restart
```

## Optional agents (uncomment in config.toml first)
```
@vfx-polish   screen shake, trails, nebula
@boss-ai      3-phase boss at level 5
```

## Git safety net
```bash
git add game.html && git commit -m "feat: what you added"
git checkout game.html   # revert if broken
```
