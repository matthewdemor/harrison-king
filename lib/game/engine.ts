import { GRAVITY, GROUND_Y, H, W, WORLD_W } from "./constants";
import type { EngineEvents, GameState, HeartStone, Keys, LabelTarget, Rect } from "./types";

const GATE_WALL_X = 2680;

function rectOverlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function circleRectHit(cx: number, cy: number, cr: number, r: Rect): boolean {
  const dx = Math.max(r.x, Math.min(cx, r.x + r.w)) - cx;
  const dy = Math.max(r.y, Math.min(cy, r.y + r.h)) - cy;
  return dx * dx + dy * dy < cr * cr;
}

export function spawnParticles(state: GameState, x: number, y: number, n: number, color: string) {
  for (let i = 0; i < n; i++) {
    state.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 2,
      life: 30 + Math.random() * 20,
      color,
      size: 3 + Math.random() * 4,
    });
  }
}

export function tryJump(state: GameState) {
  if (state.paused) return;
  const { player } = state;
  if (player.grounded) {
    player.vy = -player.jumpPower;
    player.grounded = false;
    spawnParticles(state, player.x + player.w / 2, player.y + player.h, 6, "#FFF8E7");
  }
}

export function throwHat(state: GameState) {
  if (state.paused) return;
  const { hat, player } = state;
  if (hat.active || !player.hatOn) return;
  hat.active = true;
  hat.x = player.x + player.w / 2;
  hat.y = player.y + 10;
  hat.vx = 9 * player.facing;
  hat.age = 0;
  hat.returning = false;
  hat.rotation = 0;
  player.hatOn = false;
}

function hurtPlayer(state: GameState, events: EngineEvents, reset = false) {
  state.lives--;
  state.player.invuln = 90;
  spawnParticles(state, state.player.x + state.player.w / 2, state.player.y + state.player.h / 2, 16, "#E94B4B");
  if (reset) {
    state.player.x = Math.max(80, state.camera.x + 80);
    state.player.y = GROUND_Y - 100;
    state.player.vy = 0;
  } else {
    state.player.vy = -8;
    state.player.vx = -3 * state.player.facing;
  }
  if (state.lives <= 0 && events.onLose) {
    events.onLose();
  }
}

export function update(state: GameState, dtRaw: number, keys: Keys, events: EngineEvents): void {
  // Game freezes while a word card / gate / overlay is showing.
  if (state.paused) return;

  const dt = Math.min(33, dtRaw);
  void dt;

  const { player, hat, boss } = state;

  player.vx = 0;
  if (keys["ArrowLeft"] || keys["KeyA"]) {
    player.vx = -player.speed * (player.powerUp > 0 ? 1.4 : 1);
    player.facing = -1;
  }
  if (keys["ArrowRight"] || keys["KeyD"]) {
    player.vx = player.speed * (player.powerUp > 0 ? 1.4 : 1);
    player.facing = 1;
  }

  player.vy += GRAVITY;
  if (player.vy > 16) player.vy = 16;

  player.x += player.vx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > WORLD_W) player.x = WORLD_W - player.w;

  // Boss-arena gate wall: until the gate is open the player can't pass.
  if (!state.gateOpen && player.x + player.w > GATE_WALL_X) {
    player.x = GATE_WALL_X - player.w;
    if (player.vx > 0) player.vx = 0;
  }

  player.y += player.vy;

  player.grounded = false;
  for (const p of state.platforms) {
    if (rectOverlap(player, p)) {
      if (player.vy > 0 && player.y + player.h - player.vy <= p.y + 2) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.grounded = true;
      } else if (player.vy < 0 && player.y >= p.y + p.h - 2 && p.type === "platform") {
        player.y = p.y + p.h;
        player.vy = 0;
      }
    }
  }
  for (const m of state.dogMountains) {
    if (rectOverlap(player, m)) {
      if (player.vy > 0 && player.y + player.h - player.vy <= m.y + 4) {
        player.y = m.y - player.h;
        player.vy = 0;
        player.grounded = true;
      }
    }
  }

  if (Math.abs(player.vx) > 0.1) player.walkFrame += 0.25;

  let targetCam = player.x - W / 3;
  if (targetCam < 0) targetCam = 0;
  if (targetCam > WORLD_W - W) targetCam = WORLD_W - W;
  state.camera.x += (targetCam - state.camera.x) * 0.1;

  if (hat.active) {
    hat.age++;
    hat.rotation += 0.4;
    hat.x += hat.vx;
    if (!hat.returning) {
      hat.vx *= 0.97;
      if (hat.age > 18 || Math.abs(hat.vx) < 2) hat.returning = true;
    } else {
      const dx = player.x + player.w / 2 - hat.x;
      const dy = player.y + 10 - hat.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 25) {
        hat.active = false;
        player.hatOn = true;
      } else {
        hat.x += (dx / dist) * 10;
        hat.y += (dy / dist) * 10;
      }
    }
  }

  // Heart Word Stone collection — by player overlap or hat hit. Seamless: no pause,
  // no modal. Engine marks the stone collected, fires sparkles + a floating ghost
  // word, then notifies React so it can speak the word aloud.
  for (const s of state.heartStones) {
    if (s.collected) continue;
    const playerHit = rectOverlap(player, s);
    const hatHit = hat.active && circleRectHit(hat.x, hat.y, 18, s);
    if (playerHit || hatHit) {
      s.collected = true;
      state.collectedWords[s.word] = true;
      spawnParticles(state, s.x + s.w / 2, s.y + s.h / 2, 18, "#FFE066");
      spawnParticles(state, s.x + s.w / 2, s.y + s.h / 2, 14, "#E97AC1");
      state.wordGhosts.push({
        x: s.x + s.w / 2,
        y: s.y - 12,
        word: s.word,
        life: 70,
        maxLife: 70,
      });
      if (hatHit) hat.returning = true;
      events.onHeartStone?.(s);
    }
  }

  // Owl gate trigger — when player walks up to the owl on the ground.
  if (!state.gateOpen) {
    const dx = Math.abs(player.x + player.w / 2 - (state.owl.x + state.owl.w / 2));
    if (dx < 90 && player.grounded && !state.owl.triggered) {
      state.owl.triggered = true;
      events.onOwl?.();
      return;
    }
    if (dx > 240) state.owl.triggered = false;
  }

  if (hat.active) {
    for (const c of state.cats) {
      if (!c.alive) continue;
      if (circleRectHit(hat.x, hat.y, 16, c)) {
        c.hp--;
        spawnParticles(state, c.x + c.w / 2, c.y + c.h / 2, 10, "#FFB088");
        if (c.hp <= 0) {
          c.alive = false;
          state.score += 100;
          spawnParticles(state, c.x + c.w / 2, c.y + c.h / 2, 16, "#FFE066");
        }
        hat.returning = true;
      }
    }
    for (const f of state.flags) {
      if (f.got) continue;
      if (circleRectHit(hat.x, hat.y, 16, f)) {
        f.got = true;
        state.flagsGot++;
        state.score += 200;
        spawnParticles(state, f.x + f.w / 2, f.y, 14, "#5BA8D0");
      }
    }
    for (const m of state.dogMountains) {
      if (m.hit) continue;
      if (circleRectHit(hat.x, hat.y, 16, m)) {
        m.hit = true;
        m.animTime = 60;
        state.score += 150;
        player.powerUp = 240;
        spawnParticles(state, m.x + m.w / 2, m.y, 22, "#7DC383");
        hat.returning = true;
      }
    }
    if (boss.alive && circleRectHit(hat.x, hat.y, 16, boss)) {
      boss.hp--;
      boss.hurtFlash = 30;
      spawnParticles(state, boss.x + boss.w / 2, boss.y + boss.h / 2, 18, "#E94B4B");
      state.score += 300;
      hat.returning = true;
      if (boss.hp <= 0) {
        boss.alive = false;
        boss.defeated = true;
        state.score += 1000;
        spawnParticles(state, boss.x + boss.w / 2, boss.y + boss.h / 2, 40, "#FFE066");
        if (events.onWin) events.onWin();
      }
    }
  }

  for (const c of state.cats) {
    if (!c.alive) continue;
    c.x += c.vx;
    if (c.x < c.minX) {
      c.x = c.minX;
      c.vx *= -1;
    }
    if (c.x + c.w > c.maxX) {
      c.x = c.maxX - c.w;
      c.vx *= -1;
    }
  }

  if (player.invuln > 0) player.invuln--;
  if (player.powerUp > 0) player.powerUp--;
  if (boss.hurtFlash > 0) boss.hurtFlash--;

  if (player.invuln === 0) {
    for (const c of state.cats) {
      if (!c.alive) continue;
      if (rectOverlap(player, c)) {
        if (player.vy > 1 && player.y + player.h - c.y < 20) {
          c.hp--;
          player.vy = -10;
          state.score += 50;
          spawnParticles(state, c.x + c.w / 2, c.y, 8, "#FFB088");
          if (c.hp <= 0) {
            c.alive = false;
            state.score += 50;
            spawnParticles(state, c.x + c.w / 2, c.y + c.h / 2, 14, "#FFE066");
          }
        } else {
          hurtPlayer(state, events);
          break;
        }
      }
    }
    if (boss.alive && rectOverlap(player, boss)) {
      hurtPlayer(state, events);
    }
  }

  if (boss.alive && Math.abs(player.x - boss.x) < 500) {
    boss.attackTimer++;
    if (boss.attackTimer % 90 === 0) {
      const dir = player.x < boss.x ? -1 : 1;
      boss.vx = dir * 3;
      if (boss.y >= GROUND_Y - boss.h) {
        boss.vy = -10;
      }
    }
  }
  if (boss.alive) {
    boss.vy = (boss.vy || 0) + GRAVITY;
    boss.x += boss.vx || 0;
    boss.y += boss.vy;
    if (boss.y >= GROUND_Y - boss.h) {
      boss.y = GROUND_Y - boss.h;
      boss.vy = 0;
    }
    boss.vx = (boss.vx || 0) * 0.92;
    if (boss.x < 2700) boss.x = 2700;
    if (boss.x + boss.w > WORLD_W - 20) boss.x = WORLD_W - 20 - boss.w;
  }

  for (const m of state.dogMountains) if (m.animTime > 0) m.animTime--;

  state.particles = state.particles.filter((p) => p.life > 0);
  for (const p of state.particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.3;
    p.life--;
  }

  // Ghost-word feedback (the floating word that rises after collection).
  state.wordGhosts = state.wordGhosts.filter((g) => g.life > 0);
  for (const g of state.wordGhosts) {
    g.y -= 0.7;
    g.life--;
  }

  if (player.y > H + 100) hurtPlayer(state, events, true);
}

/** Build the list of labeled entities currently in the visible camera window. */
export function getLabelTargets(state: GameState): LabelTarget[] {
  const list: LabelTarget[] = [];
  const { player, hat, boss, owl } = state;

  list.push({ kind: "dog", word: "dog", x: player.x, y: player.y, w: player.w, h: player.h });
  for (const c of state.cats) {
    if (c.alive) list.push({ kind: "cat", word: "cat", x: c.x, y: c.y, w: c.w, h: c.h });
  }
  if (boss.alive) {
    list.push({ kind: "boss", word: "boss", x: boss.x, y: boss.y, w: boss.w, h: boss.h });
  }
  for (const m of state.dogMountains) {
    list.push({ kind: "mountain", word: "mountain", x: m.x, y: m.y, w: m.w, h: m.h });
  }
  for (const f of state.flags) {
    if (!f.got) list.push({ kind: "flag", word: "flag", x: f.x, y: f.y, w: f.w, h: f.h });
  }
  if (hat.active) {
    list.push({ kind: "hat", word: "hat", x: hat.x - 16, y: hat.y - 12, w: 32, h: 24 });
  }
  list.push({ kind: "owl", word: "owl", x: owl.x, y: owl.y, w: owl.w, h: owl.h });

  return list;
}
