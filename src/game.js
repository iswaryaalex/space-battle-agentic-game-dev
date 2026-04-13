// ============================================================
//  SPACE BLASTER — Main Game Entry Point
//  Generated / evolved by the multi-agent pipeline
// ============================================================

const canvas  = document.getElementById("gameCanvas");
const ctx     = canvas.getContext("2d");

canvas.width  = 800;
canvas.height = 600;

// ── State ──────────────────────────────────────────────────
const state = {
  player:    null,
  bullets:   [],
  enemies:   [],
  particles: [],
  stars:     [],
  score:     0,
  lives:     3,
  level:     1,
  gameOver:  false,
  paused:    false,
  keys:      {},
  lastTime:  0,
  enemySpawnTimer: 0,
  bossActive: false,
};

// ── Player ─────────────────────────────────────────────────
function createPlayer() {
  return {
    x: canvas.width / 2,
    y: canvas.height - 80,
    w: 40, h: 40,
    speed: 5,
    shootCooldown: 0,
    shootRate: 15,
    color: "#00e5ff",
    shield: 0,
    powerup: null,
  };
}

// ── Enemy factory ──────────────────────────────────────────
function spawnEnemy(level) {
  const types = ["drone", "cruiser", "bomber"];
  const type  = types[Math.floor(Math.random() * Math.min(types.length, level))];
  const cfg = {
    drone:   { w:28, h:28, hp:1, speed:1.5+level*0.2, color:"#ff4757", pts:10 },
    cruiser: { w:42, h:36, hp:3, speed:0.9+level*0.1, color:"#ffa502", pts:30 },
    bomber:  { w:50, h:44, hp:5, speed:0.6+level*0.1, color:"#eccc68", pts:60 },
  }[type];
  return {
    x:    Math.random() * (canvas.width - cfg.w) + cfg.w/2,
    y:    -cfg.h,
    type, ...cfg,
    angle: 0,
  };
}

// ── Bullet factory ─────────────────────────────────────────
function createBullet(x, y, vy=-10, color="#00e5ff", w=4, h=12) {
  return { x, y, vy, color, w, h, fromPlayer: vy < 0 };
}

// ── Particles ──────────────────────────────────────────────
function explode(x, y, color="#ff4757", count=18) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const spd   = 1 + Math.random() * 4;
    state.particles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: 1, decay: 0.025 + Math.random() * 0.025,
      r: 2 + Math.random() * 4,
      color,
    });
  }
}

// ── Stars ──────────────────────────────────────────────────
function initStars() {
  for (let i = 0; i < 120; i++) {
    state.stars.push({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 1.5 + 0.3,
      spd:  Math.random() * 1.2 + 0.3,
      bright: Math.random(),
    });
  }
}

// ── Input ──────────────────────────────────────────────────
window.addEventListener("keydown", e => { state.keys[e.code] = true;  });
window.addEventListener("keyup",   e => { state.keys[e.code] = false; });

// ── Update ─────────────────────────────────────────────────
function update(dt) {
  if (state.gameOver || state.paused) return;

  const p = state.player;

  // Move player
  if (state.keys["ArrowLeft"]  || state.keys["KeyA"]) p.x -= p.speed;
  if (state.keys["ArrowRight"] || state.keys["KeyD"]) p.x += p.speed;
  if (state.keys["ArrowUp"]    || state.keys["KeyW"]) p.y -= p.speed;
  if (state.keys["ArrowDown"]  || state.keys["KeyS"]) p.y += p.speed;
  p.x = Math.max(p.w/2, Math.min(canvas.width  - p.w/2, p.x));
  p.y = Math.max(p.h/2, Math.min(canvas.height - p.h/2, p.y));

  // Shoot
  if (p.shootCooldown > 0) p.shootCooldown--;
  if ((state.keys["Space"] || state.keys["KeyZ"]) && p.shootCooldown === 0) {
    state.bullets.push(createBullet(p.x, p.y - p.h/2));
    if (p.powerup === "spread") {
      state.bullets.push(createBullet(p.x-14, p.y - p.h/2, -9, "#00e5ff"));
      state.bullets.push(createBullet(p.x+14, p.y - p.h/2, -9, "#00e5ff"));
    }
    p.shootCooldown = p.shootRate;
  }

  // Stars
  state.stars.forEach(s => {
    s.y += s.spd;
    if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
  });

  // Bullets
  state.bullets = state.bullets.filter(b => {
    b.y += b.vy;
    return b.y > -20 && b.y < canvas.height + 20;
  });

  // Enemy spawn
  state.enemySpawnTimer++;
  const spawnRate = Math.max(40, 90 - state.level * 8);
  if (state.enemySpawnTimer >= spawnRate) {
    state.enemies.push(spawnEnemy(state.level));
    state.enemySpawnTimer = 0;
  }

  // Enemies
  state.enemies = state.enemies.filter(e => {
    e.y += e.speed;
    e.angle += 0.04;

    // Hit by player bullet
    state.bullets = state.bullets.filter(b => {
      if (!b.fromPlayer) return true;
      if (Math.abs(b.x - e.x) < (e.w/2 + b.w/2) && Math.abs(b.y - e.y) < (e.h/2 + b.h/2)) {
        e.hp--;
        explode(b.x, b.y, "#ffffff", 6);
        return false;
      }
      return true;
    });

    if (e.hp <= 0) {
      state.score += e.pts * state.level;
      explode(e.x, e.y, e.color, 22);
      checkLevelUp();
      return false;
    }

    // Hit player
    if (!state.gameOver &&
        Math.abs(e.x - p.x) < (e.w/2 + p.w/2 - 6) &&
        Math.abs(e.y - p.y) < (e.h/2 + p.h/2 - 6)) {
      if (p.shield > 0) {
        p.shield--;
        explode(e.x, e.y, "#00e5ff", 14);
      } else {
        state.lives--;
        explode(p.x, p.y, "#00e5ff", 30);
        if (state.lives <= 0) state.gameOver = true;
      }
      explode(e.x, e.y, e.color, 18);
      return false;
    }

    return e.y < canvas.height + 60;
  });

  // Particles
  state.particles = state.particles.filter(pt => {
    pt.x += pt.vx; pt.y += pt.vy;
    pt.vy += 0.05;
    pt.life -= pt.decay;
    return pt.life > 0;
  });
}

function checkLevelUp() {
  const threshold = state.level * 500;
  if (state.score >= threshold && state.level < 10) {
    state.level++;
  }
}

// ── Draw ───────────────────────────────────────────────────
function draw() {
  // Background
  ctx.fillStyle = "#03060f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  state.stars.forEach(s => {
    const alpha = 0.4 + s.bright * 0.6;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(200,220,255,${alpha})`;
    ctx.fill();
  });

  // Particles
  state.particles.forEach(pt => {
    ctx.globalAlpha = pt.life;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI*2);
    ctx.fillStyle = pt.color;
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Bullets
  state.bullets.forEach(b => {
    ctx.shadowBlur = 10;
    ctx.shadowColor = b.color;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h);
    ctx.shadowBlur = 0;
  });

  // Enemies
  state.enemies.forEach(e => {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.type === "drone" ? e.angle : 0);
    ctx.shadowBlur = 12;
    ctx.shadowColor = e.color;
    ctx.fillStyle = e.color;

    if (e.type === "drone") {
      // Diamond shape
      ctx.beginPath();
      ctx.moveTo(0, -e.h/2);
      ctx.lineTo(e.w/2, 0);
      ctx.lineTo(0, e.h/2);
      ctx.lineTo(-e.w/2, 0);
      ctx.closePath();
      ctx.fill();
    } else if (e.type === "cruiser") {
      // Arrow shape
      ctx.beginPath();
      ctx.moveTo(0, e.h/2);
      ctx.lineTo(e.w/2, -e.h/4);
      ctx.lineTo(e.w/4, -e.h/2);
      ctx.lineTo(-e.w/4, -e.h/2);
      ctx.lineTo(-e.w/2, -e.h/4);
      ctx.closePath();
      ctx.fill();
    } else {
      // Bomber — wide trapezoid
      ctx.beginPath();
      ctx.moveTo(-e.w/2, e.h/3);
      ctx.lineTo(e.w/2, e.h/3);
      ctx.lineTo(e.w/3, -e.h/2);
      ctx.lineTo(-e.w/3, -e.h/2);
      ctx.closePath();
      ctx.fill();
    }

    // HP bar
    if (e.hp > 1) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(-e.w/2, -e.h/2 - 10, e.w, 5);
      ctx.fillStyle = "#2ed573";
      ctx.fillRect(-e.w/2, -e.h/2 - 10, e.w * (e.hp / (e.type === "bomber" ? 5 : 3)), 5);
    }

    ctx.shadowBlur = 0;
    ctx.restore();
  });

  // Player ship
  if (!state.gameOver) {
    const p = state.player;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowBlur = 18;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;

    // Main fuselage
    ctx.beginPath();
    ctx.moveTo(0, -p.h/2);
    ctx.lineTo(p.w/4, p.h/4);
    ctx.lineTo(0, p.h/2 - 8);
    ctx.lineTo(-p.w/4, p.h/4);
    ctx.closePath();
    ctx.fill();

    // Left wing
    ctx.beginPath();
    ctx.moveTo(-p.w/4, p.h/4);
    ctx.lineTo(-p.w/2, p.h/2);
    ctx.lineTo(-p.w/2 + 8, 0);
    ctx.closePath();
    ctx.fillStyle = "#0097a7";
    ctx.fill();

    // Right wing
    ctx.beginPath();
    ctx.moveTo(p.w/4, p.h/4);
    ctx.lineTo(p.w/2, p.h/2);
    ctx.lineTo(p.w/2 - 8, 0);
    ctx.closePath();
    ctx.fill();

    // Engine glow
    ctx.shadowColor = "#ff6b35";
    ctx.shadowBlur  = 14;
    ctx.fillStyle   = "#ff6b35";
    ctx.fillRect(-6, p.h/2 - 10, 12, 8);

    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // HUD
  ctx.fillStyle = "#00e5ff";
  ctx.font = "bold 18px 'Courier New', monospace";
  ctx.fillText(`SCORE: ${state.score}`, 14, 28);
  ctx.fillText(`LEVEL: ${state.level}`, 14, 52);

  // Lives
  ctx.fillText("SHIPS: " + "♦ ".repeat(state.lives), canvas.width - 160, 28);

  // Game over
  if (state.gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff4757";
    ctx.font = "bold 52px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2 - 30);
    ctx.fillStyle = "#ffffff";
    ctx.font = "22px 'Courier New', monospace";
    ctx.fillText(`FINAL SCORE: ${state.score}`, canvas.width/2, canvas.height/2 + 20);
    ctx.fillText("Press R to restart", canvas.width/2, canvas.height/2 + 60);
    ctx.textAlign = "left";
  }

  // Paused
  if (state.paused && !state.gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00e5ff";
    ctx.font = "bold 42px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width/2, canvas.height/2);
    ctx.textAlign = "left";
  }
}

// ── Restart ────────────────────────────────────────────────
window.addEventListener("keydown", e => {
  if (e.code === "KeyR" && state.gameOver) resetGame();
  if (e.code === "KeyP") state.paused = !state.paused;
});

function resetGame() {
  state.player    = createPlayer();
  state.bullets   = [];
  state.enemies   = [];
  state.particles = [];
  state.score     = 0;
  state.lives     = 3;
  state.level     = 1;
  state.gameOver  = false;
  state.paused    = false;
  state.enemySpawnTimer = 0;
}

// ── Loop ───────────────────────────────────────────────────
function loop(ts) {
  const dt = (ts - state.lastTime) / 16.67;
  state.lastTime = ts;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

// ── Boot ───────────────────────────────────────────────────
initStars();
resetGame();
requestAnimationFrame(loop);
