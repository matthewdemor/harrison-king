import { GROUND_Y, H, W, WORLD_W } from "./constants";
import type { Boss, Cat, Flag, GameState, Hat, HeartStone, LabelTarget, Mountain, Owl, Player } from "./types";

const GATE_WALL_X_FOR_RENDER = 2680;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
  fill: boolean, stroke = false,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function drawSun(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = "rgba(255, 224, 102, 0.4)";
  ctx.beginPath();
  ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFE066";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawBgMountains(ctx: CanvasRenderingContext2D, cameraX: number) {
  const offset = -cameraX * 0.3;
  ctx.fillStyle = "#A8C9D8";
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  for (let i = 0; i < 8; i++) {
    const baseX = offset + i * 250;
    ctx.lineTo(baseX + 50, GROUND_Y - 80);
    ctx.lineTo(baseX + 120, GROUND_Y - 130);
    ctx.lineTo(baseX + 200, GROUND_Y - 70);
  }
  ctx.lineTo(W, GROUND_Y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 2;
  ctx.stroke();

  const offset2 = -cameraX * 0.5;
  ctx.fillStyle = "#8AAFC1";
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  for (let i = 0; i < 8; i++) {
    const baseX = offset2 + i * 200 - 100;
    ctx.lineTo(baseX + 30, GROUND_Y - 40);
    ctx.lineTo(baseX + 90, GROUND_Y - 90);
    ctx.lineTo(baseX + 160, GROUND_Y - 30);
  }
  ctx.lineTo(W, GROUND_Y);
  ctx.closePath();
  ctx.fill();
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  const x = player.x;
  const y = player.y;
  const blink = player.invuln > 0 && Math.floor(player.invuln / 5) % 2 === 0;
  if (blink) ctx.globalAlpha = 0.4;

  ctx.save();
  ctx.translate(x + player.w / 2, y + player.h / 2);
  ctx.scale(player.facing, 1);
  ctx.translate(-player.w / 2, -player.h / 2);

  const bounce = Math.abs(player.vx) > 0 ? Math.sin(player.walkFrame) * 2 : 0;
  ctx.fillStyle = "#D4A574";
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 2.5;
  ctx.fillRect(4, 35 + bounce, 8, 14);
  ctx.strokeRect(4, 35 + bounce, 8, 14);
  ctx.fillRect(26, 35 - bounce, 8, 14);
  ctx.strokeRect(26, 35 - bounce, 8, 14);
  ctx.beginPath();
  ctx.ellipse(19, 32, 16, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(2, 28);
  ctx.quadraticCurveTo(-8, 22 + Math.sin(Date.now() / 100) * 2, -4, 16);
  ctx.lineTo(0, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(28, 18, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#F5DEB3";
  ctx.beginPath();
  ctx.ellipse(36, 22, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#2D3142";
  ctx.beginPath();
  ctx.ellipse(40, 20, 2, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2D3142";
  ctx.beginPath();
  ctx.arc(30, 16, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8B5A3C";
  ctx.beginPath();
  ctx.ellipse(22, 8, 4, 7, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (player.hatOn) {
    ctx.strokeStyle = "#2D3142";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(28, 8, 14, 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#C73E3E";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#E94B4B";
    ctx.beginPath();
    ctx.moveTo(20, 8);
    ctx.quadraticCurveTo(28, -6, 36, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#FFE066";
    ctx.beginPath();
    ctx.arc(28, -2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawHatProjectile(ctx: CanvasRenderingContext2D, hat: Hat) {
  ctx.save();
  ctx.translate(hat.x, hat.y);
  ctx.rotate(hat.rotation);
  ctx.fillStyle = "#C73E3E";
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#E94B4B";
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.quadraticCurveTo(0, -14, 10, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#FFE066";
  ctx.beginPath();
  ctx.arc(0, -10, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawCat(ctx: CanvasRenderingContext2D, c: Cat) {
  const big = c.type === "bigcat";
  void big;
  const x = c.x;
  const y = c.y;
  const w = c.w;
  const h = c.h;
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.scale(c.vx > 0 ? 1 : -1, 1);
  ctx.translate(-w / 2, -h / 2);

  ctx.fillStyle = c.type === "bigcat" ? "#5A5A5A" : "#888888";
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.6);
  ctx.quadraticCurveTo(-12, h * 0.3, -8, h * 0.1);
  ctx.lineTo(-2, h * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.65, w * 0.45, h * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(w * 0.65, h * 0.35, w * 0.32, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.45, h * 0.18);
  ctx.lineTo(w * 0.5, 0);
  ctx.lineTo(w * 0.6, h * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.7, h * 0.15);
  ctx.lineTo(w * 0.8, 0);
  ctx.lineTo(w * 0.85, h * 0.18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#FFE066";
  ctx.beginPath();
  ctx.arc(w * 0.58, h * 0.32, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w * 0.74, h * 0.32, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2D3142";
  ctx.fillRect(w * 0.58 - 1, h * 0.3, 2, 4);
  ctx.fillRect(w * 0.74 - 1, h * 0.3, 2, 4);
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.6, h * 0.45);
  ctx.lineTo(w * 0.65, h * 0.5);
  ctx.lineTo(w * 0.7, h * 0.45);
  ctx.lineTo(w * 0.75, h * 0.5);
  ctx.stroke();

  ctx.restore();
}

function drawBoss(ctx: CanvasRenderingContext2D, boss: Boss, playerX: number) {
  const { x, y, w, h } = boss;
  const flash = boss.hurtFlash > 0;
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  const facing = playerX < x ? -1 : 1;
  ctx.scale(facing, 1);
  ctx.translate(-w / 2, -h / 2);

  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 4;
  ctx.fillStyle = flash ? "#FFAAAA" : "#3A3A3A";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.6);
  ctx.quadraticCurveTo(-30, h * 0.4, -25, h * 0.1);
  ctx.quadraticCurveTo(-15, 0, -8, h * 0.2);
  ctx.lineTo(-2, h * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = flash ? "#FFAAAA" : "#8B5A3C";
  ctx.beginPath();
  ctx.arc(-25, h * 0.1, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = flash ? "#FFAAAA" : "#3A3A3A";
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.65, w * 0.42, h * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(w * 0.6, h * 0.35, w * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = flash ? "#FFEE99" : "#F5DEB3";
  ctx.beginPath();
  ctx.moveTo(w * 0.45, h * 0.18);
  ctx.quadraticCurveTo(w * 0.3, h * -0.05, w * 0.4, h * -0.2);
  ctx.quadraticCurveTo(w * 0.5, 0, w * 0.5, h * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.7, h * 0.18);
  ctx.quadraticCurveTo(w * 0.85, h * -0.05, w * 0.78, h * -0.2);
  ctx.quadraticCurveTo(w * 0.68, 0, w * 0.65, h * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = flash ? "#FFAAAA" : "#3A3A3A";
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.2);
  ctx.lineTo(w * 0.55, h * 0.05);
  ctx.lineTo(w * 0.6, h * 0.18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.65, h * 0.18);
  ctx.lineTo(w * 0.7, h * 0.05);
  ctx.lineTo(w * 0.72, h * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#FF3333";
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.32, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w * 0.7, h * 0.32, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#2D3142";
  ctx.fillRect(w * 0.5 - 1.5, h * 0.3, 3, 5);
  ctx.fillRect(w * 0.7 - 1.5, h * 0.3, 3, 5);
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.48);
  ctx.lineTo(w * 0.55, h * 0.55);
  ctx.lineTo(w * 0.6, h * 0.48);
  ctx.lineTo(w * 0.65, h * 0.55);
  ctx.lineTo(w * 0.7, h * 0.48);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.4, h * 0.42);
  ctx.lineTo(w * 0.25, h * 0.4);
  ctx.moveTo(w * 0.4, h * 0.46);
  ctx.lineTo(w * 0.25, h * 0.48);
  ctx.moveTo(w * 0.78, h * 0.42);
  ctx.lineTo(w * 0.92, h * 0.4);
  ctx.moveTo(w * 0.78, h * 0.46);
  ctx.lineTo(w * 0.92, h * 0.48);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(x, y - 14);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < boss.hp ? "#E94B4B" : "#555";
    ctx.fillRect(i * 24 + 4, 0, 20, 8);
    ctx.strokeStyle = "#2D3142";
    ctx.lineWidth = 2;
    ctx.strokeRect(i * 24 + 4, 0, 20, 8);
  }
  ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
    const a2 = a + Math.PI / 5;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.lineTo(cx + Math.cos(a2) * r * 0.5, cy + Math.sin(a2) * r * 0.5);
  }
  ctx.closePath();
}

function drawDogMountain(ctx: CanvasRenderingContext2D, m: Mountain) {
  const { x, y, w, h } = m;
  const wob = m.animTime > 0 ? Math.sin(m.animTime * 0.5) * 3 : 0;
  ctx.save();
  ctx.translate(x + wob, y);
  ctx.fillStyle = m.hit ? "#A8D5A0" : "#8B5A3C";
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(w / 2, 0);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(w * 0.3, h * 0.4);
  ctx.lineTo(w * 0.5, 0);
  ctx.lineTo(w * 0.7, h * 0.4);
  ctx.quadraticCurveTo(w * 0.5, h * 0.5, w * 0.3, h * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#2D3142";
  ctx.beginPath();
  ctx.arc(w * 0.38, h * 0.55, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w * 0.62, h * 0.55, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#F5DEB3";
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.72, w * 0.12, h * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#2D3142";
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.68, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (m.hit) {
    ctx.moveTo(w * 0.42, h * 0.78);
    ctx.quadraticCurveTo(w * 0.5, h * 0.86, w * 0.58, h * 0.78);
  } else {
    ctx.moveTo(w * 0.42, h * 0.8);
    ctx.lineTo(w * 0.58, h * 0.8);
  }
  ctx.stroke();

  if (!m.hit) {
    const t = Date.now() / 200;
    ctx.fillStyle = "#FFE066";
    ctx.strokeStyle = "#2D3142";
    ctx.lineWidth = 2;
    drawStar(ctx, w / 2, -10 + Math.sin(t) * 3, 6);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawHeartStone(ctx: CanvasRenderingContext2D, s: HeartStone) {
  if (s.collected) return;
  const t = Date.now() / 600 + s.pulse;
  const halo = 16 + Math.sin(t * 2) * 4;
  const cx = s.x + s.w / 2;
  const cy = s.y + s.h / 2;

  ctx.save();
  // Soft halo
  const grd = ctx.createRadialGradient(cx, cy, 4, cx, cy, halo + 16);
  grd.addColorStop(0, "rgba(255, 192, 240, 0.85)");
  grd.addColorStop(0.5, "rgba(217, 145, 226, 0.45)");
  grd.addColorStop(1, "rgba(217, 145, 226, 0)");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy, halo + 18, 0, Math.PI * 2);
  ctx.fill();

  // Geode (hexagonal)
  const r = 16;
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 3;
  const facets = [
    { x: cx, y: cy - r, c: "#FFC2E5" },
    { x: cx + r * 0.85, y: cy - r * 0.4, c: "#E97AC1" },
    { x: cx + r * 0.85, y: cy + r * 0.4, c: "#C254B0" },
    { x: cx, y: cy + r, c: "#9C3E94" },
    { x: cx - r * 0.85, y: cy + r * 0.4, c: "#C254B0" },
    { x: cx - r * 0.85, y: cy - r * 0.4, c: "#E97AC1" },
  ];
  // outline
  ctx.fillStyle = "#FFC2E5";
  ctx.beginPath();
  ctx.moveTo(facets[0]!.x, facets[0]!.y);
  for (let i = 1; i < facets.length; i++) ctx.lineTo(facets[i]!.x, facets[i]!.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // accent facets
  ctx.fillStyle = "#E97AC1";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(facets[0]!.x, facets[0]!.y);
  ctx.lineTo(facets[1]!.x, facets[1]!.y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#9C3E94";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(facets[3]!.x, facets[3]!.y);
  ctx.lineTo(facets[4]!.x, facets[4]!.y);
  ctx.closePath();
  ctx.fill();

  // Floating word above
  const wordY = s.y - 22 + Math.sin(t * 1.5) * 2;
  ctx.font = "bold 26px 'Bagel Fat One', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#2D3142";
  ctx.strokeText(s.word, cx, wordY);
  ctx.fillStyle = "#FFE066";
  ctx.fillText(s.word, cx, wordY);

  ctx.restore();
}

function drawOwl(ctx: CanvasRenderingContext2D, owl: Owl, gateOpen: boolean) {
  const baseX = owl.x + owl.w / 2;
  const baseY = owl.y + owl.h;
  const t = Date.now() / 700;
  const wob = Math.sin(t) * 1.5;

  ctx.save();
  // Stack of books
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#2D3142";
  const books = [
    { y: baseY - 14, w: 70, c: "#5BA8D0" },
    { y: baseY - 28, w: 60, c: "#E94B4B" },
    { y: baseY - 42, w: 52, c: "#7DC383" },
  ];
  for (const b of books) {
    ctx.fillStyle = b.c;
    ctx.fillRect(baseX - b.w / 2, b.y, b.w, 14);
    ctx.strokeRect(baseX - b.w / 2, b.y, b.w, 14);
  }

  // Owl body
  const ox = baseX;
  const oy = baseY - 70 + wob;
  ctx.fillStyle = "#A47148";
  ctx.beginPath();
  ctx.ellipse(ox, oy + 2, 26, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Lighter belly
  ctx.fillStyle = "#F1D9B0";
  ctx.beginPath();
  ctx.ellipse(ox, oy + 8, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Head
  ctx.fillStyle = "#A47148";
  ctx.beginPath();
  ctx.arc(ox, oy - 24, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Eye discs (glasses)
  for (const off of [-9, 9]) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ox + off, oy - 24, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#2D3142";
    ctx.beginPath();
    ctx.arc(ox + off, oy - 24, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Glasses bridge
  ctx.beginPath();
  ctx.moveTo(ox - 1, oy - 24);
  ctx.lineTo(ox + 1, oy - 24);
  ctx.stroke();
  // Beak
  ctx.fillStyle = "#FFB000";
  ctx.beginPath();
  ctx.moveTo(ox - 4, oy - 14);
  ctx.lineTo(ox + 4, oy - 14);
  ctx.lineTo(ox, oy - 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Tufts
  ctx.fillStyle = "#A47148";
  ctx.beginPath();
  ctx.moveTo(ox - 16, oy - 36);
  ctx.lineTo(ox - 12, oy - 50);
  ctx.lineTo(ox - 6, oy - 34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox + 6, oy - 34);
  ctx.lineTo(ox + 12, oy - 50);
  ctx.lineTo(ox + 16, oy - 36);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Open book in wings
  ctx.fillStyle = "#FFF8E7";
  ctx.beginPath();
  ctx.moveTo(ox - 14, oy + 14);
  ctx.lineTo(ox - 6, oy + 8);
  ctx.lineTo(ox, oy + 12);
  ctx.lineTo(ox + 6, oy + 8);
  ctx.lineTo(ox + 14, oy + 14);
  ctx.lineTo(ox + 14, oy + 22);
  ctx.lineTo(ox, oy + 26);
  ctx.lineTo(ox - 14, oy + 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox, oy + 12);
  ctx.lineTo(ox, oy + 26);
  ctx.stroke();
  // Tiny "lines" of text on the book
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(ox - 11, oy + 16 + i * 3);
    ctx.lineTo(ox - 3, oy + 16 + i * 3);
    ctx.moveTo(ox + 3, oy + 16 + i * 3);
    ctx.lineTo(ox + 11, oy + 16 + i * 3);
    ctx.stroke();
  }
  ctx.lineWidth = 3;

  // "Read with me!" tag if gate not yet open
  if (!gateOpen) {
    const labelY = oy - 70;
    const text = "📖 read with me!";
    ctx.font = "bold 14px 'Fredoka', system-ui, sans-serif";
    const metrics = ctx.measureText(text);
    const tw = metrics.width + 16;
    const th = 22;
    ctx.fillStyle = "#FFF8E7";
    ctx.strokeStyle = "#2D3142";
    ctx.lineWidth = 2;
    roundRect(ctx, ox - tw / 2, labelY - th + 2, tw, th, 8, true, true);
    ctx.fillStyle = "#2D3142";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, ox, labelY - th / 2 + 2);
    // Tail pointing down
    ctx.beginPath();
    ctx.moveTo(ox - 4, labelY + 2);
    ctx.lineTo(ox + 4, labelY + 2);
    ctx.lineTo(ox, labelY + 8);
    ctx.closePath();
    ctx.fillStyle = "#FFF8E7";
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawGateWall(ctx: CanvasRenderingContext2D, gateOpen: boolean) {
  if (gateOpen) return;
  const x = GATE_WALL_X_FOR_RENDER;
  ctx.save();
  // Animated shimmer
  const t = Date.now() / 400;
  const grd = ctx.createLinearGradient(x, 0, x + 24, 0);
  const a = 0.45 + 0.2 * Math.sin(t);
  grd.addColorStop(0, `rgba(91, 168, 208, ${a})`);
  grd.addColorStop(0.5, `rgba(255, 224, 102, ${a + 0.15})`);
  grd.addColorStop(1, `rgba(91, 168, 208, ${a})`);
  ctx.fillStyle = grd;
  ctx.fillRect(x, 80, 24, GROUND_Y - 80);
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, 80, 24, GROUND_Y - 80);
  // Lock icon
  ctx.fillStyle = "#2D3142";
  ctx.font = "bold 20px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🔒", x + 12, GROUND_Y - 30);
  ctx.restore();
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  topY: number,
) {
  ctx.save();
  ctx.font = "600 14px 'Fredoka', system-ui, sans-serif";
  const metrics = ctx.measureText(text);
  const padX = 10;
  const padY = 4;
  const w = Math.max(34, Math.ceil(metrics.width) + padX * 2);
  const h = 22;
  const x = centerX - w / 2;
  const y = topY - h - 10;
  // Body
  ctx.fillStyle = "#FFF8E7";
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 7, true, true);
  // Tail
  ctx.fillStyle = "#FFF8E7";
  ctx.beginPath();
  ctx.moveTo(centerX - 4, y + h - 0.5);
  ctx.lineTo(centerX + 4, y + h - 0.5);
  ctx.lineTo(centerX, y + h + 6);
  ctx.closePath();
  ctx.fill();
  // re-stroke without overlapping body bottom edge
  ctx.beginPath();
  ctx.moveTo(centerX - 4, y + h);
  ctx.lineTo(centerX, y + h + 6);
  ctx.lineTo(centerX + 4, y + h);
  ctx.stroke();
  // Text
  ctx.fillStyle = "#2D3142";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  void padY;
  ctx.fillText(text, centerX, y + h / 2 + 1);
  ctx.restore();
}

export function drawLabels(
  ctx: CanvasRenderingContext2D,
  targets: LabelTarget[],
) {
  const t = Date.now() / 1000;
  for (const lt of targets) {
    const cx = lt.x + lt.w / 2;
    // Slight float
    const yOff = Math.sin(t * 2 + cx * 0.01) * 2;
    drawLabel(ctx, lt.word, cx, lt.y + yOff);
  }
}

function drawFlag(ctx: CanvasRenderingContext2D, f: Flag) {
  const t = Date.now() / 150;
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.fillStyle = "#8B5A3C";
  ctx.strokeStyle = "#2D3142";
  ctx.lineWidth = 2;
  ctx.fillRect(2, 0, 4, f.h);
  ctx.strokeRect(2, 0, 4, f.h);
  ctx.fillStyle = "#5BA8D0";
  ctx.beginPath();
  ctx.moveTo(6, 0);
  ctx.quadraticCurveTo(20 + Math.sin(t) * 3, 6, 24, 12);
  ctx.quadraticCurveTo(18, 18, 6, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#FFE066";
  drawStar(ctx, 14, 11, 4);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export type RenderOpts = {
  labelsOn?: boolean;
  labelTargets?: LabelTarget[];
};

export function render(ctx: CanvasRenderingContext2D, state: GameState, opts: RenderOpts = {}) {
  ctx.fillStyle = "#FFB088";
  ctx.fillRect(0, 0, W, H);
  const grd = ctx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, "#FFB088");
  grd.addColorStop(0.6, "#FFD4A3");
  grd.addColorStop(1, "#87CEEB");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  drawBgMountains(ctx, state.camera.x);
  drawSun(ctx, 680, 70, 35);

  ctx.save();
  ctx.translate(-state.camera.x, 0);

  ctx.fillStyle = "#7DC383";
  ctx.fillRect(0, GROUND_Y, WORLD_W, H - GROUND_Y);
  ctx.fillStyle = "#4FA85F";
  for (let i = 0; i < WORLD_W; i += 30) {
    ctx.fillRect(i, GROUND_Y - 4, 4, 4);
    ctx.fillRect(i + 12, GROUND_Y - 6, 4, 6);
  }
  ctx.fillStyle = "#8B5A3C";
  ctx.fillRect(0, GROUND_Y + 15, WORLD_W, H - GROUND_Y - 15);

  for (const p of state.platforms) {
    if (p.type === "platform") {
      ctx.fillStyle = "#8B5A3C";
      roundRect(ctx, p.x, p.y, p.w, p.h, 6, true);
      ctx.fillStyle = "#7DC383";
      ctx.fillRect(p.x, p.y, p.w, 6);
      ctx.strokeStyle = "#2D3142";
      ctx.lineWidth = 3;
      roundRect(ctx, p.x, p.y, p.w, p.h, 6, false, true);
    }
  }

  for (const m of state.dogMountains) drawDogMountain(ctx, m);
  for (const f of state.flags) if (!f.got) drawFlag(ctx, f);
  // Heart word stones (in world space)
  for (const s of state.heartStones) drawHeartStone(ctx, s);
  // Owl gate
  drawOwl(ctx, state.owl, state.gateOpen);
  // Magic gate wall (renders only while closed)
  drawGateWall(ctx, state.gateOpen);
  for (const c of state.cats) if (c.alive) drawCat(ctx, c);
  if (state.boss.alive) drawBoss(ctx, state.boss, state.player.x);
  drawPlayer(ctx, state.player);
  if (state.hat.active) drawHatProjectile(ctx, state.hat);

  // Speech-bubble labels (still in world space so they follow entities)
  if (opts.labelsOn && opts.labelTargets) {
    drawLabels(ctx, opts.labelTargets);
  }

  for (const p of state.particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, p.life / 50);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  if (state.boss.defeated) {
    ctx.fillStyle = "#FFE066";
    ctx.font = 'bold 40px "Bagel Fat One", cursive';
    ctx.textAlign = "center";
    ctx.strokeStyle = "#2D3142";
    ctx.lineWidth = 4;
    ctx.strokeText("🎉 SAVED! 🎉", 3050, 200);
    ctx.fillText("🎉 SAVED! 🎉", 3050, 200);
  }

  ctx.restore();

  if (state.player.powerUp > 0) {
    ctx.fillStyle = "rgba(125, 195, 131, 0.8)";
    ctx.fillRect(10, 10, (state.player.powerUp / 240) * 150, 10);
    ctx.strokeStyle = "#2D3142";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 150, 10);
    ctx.fillStyle = "#2D3142";
    ctx.font = 'bold 14px "Fredoka", sans-serif';
    ctx.textAlign = "left";
    ctx.fillText("🐶 DOG POWER!", 10, 36);
  }
}
