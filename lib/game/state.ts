import { GROUND_Y, WORLD_W } from "./constants";
import type { Cat, GameState, HeartStone } from "./types";
import { HEART_WORDS } from "@/lib/words/heart-words";

// Twenty stones spread across the world (x = 0..2480), so the player walks past
// each one on the way to the owl gate at x≈2550 (boss arena starts around 2700).
// Heights vary: some on the ground, some perched on platforms, some on the snowy
// caps of dog mountains so the kid has to look up.
const STONE_PLACEMENTS: Array<{ x: number; y: number }> = [
  { x: 160, y: GROUND_Y - 30 },        // 0  the
  { x: 320, y: 260 },                  // 1  a       (on platform 280-390)
  { x: 460, y: GROUND_Y - 30 },        // 2  I
  { x: 540, y: 200 },                  // 3  to      (on platform 480-590)
  { x: 660, y: GROUND_Y - 30 },        // 4  is
  { x: 760, y: 260 },                  // 5  you     (on platform 720-830)
  { x: 980, y: GROUND_Y - 30 },        // 6  are
  { x: 1140, y: 220 },                 // 7  of      (on platform 1100-1230)
  { x: 1280, y: 250 },                 // 8  was     (on dog mountain peak)
  { x: 1490, y: 170 },                 // 9  said    (on platform 1450-1560)
  { x: 1610, y: GROUND_Y - 30 },       // 10 they
  { x: 1750, y: 250 },                 // 11 have    (on platform 1700-1830)
  { x: 1880, y: GROUND_Y - 30 },       // 12 my
  { x: 2090, y: 210 },                 // 13 do      (on platform 2050-2170)
  { x: 2200, y: 250 },                 // 14 what    (on dog mountain peak)
  { x: 2330, y: 150 },                 // 15 there   (on platform 2300-2420)
  { x: 2440, y: GROUND_Y - 30 },       // 16 were
  { x: 2540, y: GROUND_Y - 30 },       // 17 one
  { x: 2620, y: 250 },                 // 18 by      (on platform 2600-2710)
  { x: 250,  y: 200 },                 // 19 from    (extra stone reachable on return)
];

export function createInitialState(): GameState {
  const cats: Cat[] = [
    { x: 350, y: GROUND_Y - 35, w: 36, h: 35, vx: -1, alive: true, type: "cat", minX: 320, maxX: 460, hp: 1 },
    { x: 800, y: GROUND_Y - 35, w: 36, h: 35, vx: 1, alive: true, type: "cat", minX: 760, maxX: 920, hp: 1 },
    { x: 1200, y: GROUND_Y - 50, w: 50, h: 50, vx: -1, alive: true, type: "bigcat", minX: 1150, maxX: 1340, hp: 2 },
    { x: 1600, y: GROUND_Y - 35, w: 36, h: 35, vx: 1, alive: true, type: "cat", minX: 1560, maxX: 1750, hp: 1 },
    { x: 1900, y: GROUND_Y - 50, w: 50, h: 50, vx: -1, alive: true, type: "bigcat", minX: 1860, maxX: 2020, hp: 2 },
    { x: 2400, y: GROUND_Y - 35, w: 36, h: 35, vx: 1, alive: true, type: "cat", minX: 2360, maxX: 2520, hp: 1 },
  ];

  const heartStones: HeartStone[] = HEART_WORDS.map((word, i) => {
    const place = STONE_PLACEMENTS[i] ?? { x: 200 + i * 130, y: GROUND_Y - 30 };
    return {
      id: `heart-${i}`,
      word,
      x: place.x,
      y: place.y,
      w: 32,
      h: 36,
      collected: false,
      pulse: Math.random() * Math.PI * 2,
    };
  });

  return {
    camera: { x: 0 },
    player: {
      x: 80, y: GROUND_Y - 50, w: 38, h: 50,
      vx: 0, vy: 0, speed: 4, jumpPower: 13,
      grounded: false, facing: 1,
      hatOn: true, invuln: 0,
      walkFrame: 0, powerUp: 0,
    },
    hat: {
      active: false, x: 0, y: 0, vx: 0,
      age: 0, rotation: 0, returning: false,
    },
    lives: 3,
    score: 0,
    flagsGot: 0,
    platforms: [
      { x: 0, y: GROUND_Y, w: WORLD_W, h: 80, type: "ground" },
      { x: 280, y: 290, w: 110, h: 20, type: "platform" },
      { x: 480, y: 230, w: 110, h: 20, type: "platform" },
      { x: 720, y: 290, w: 110, h: 20, type: "platform" },
      { x: 1100, y: 250, w: 130, h: 20, type: "platform" },
      { x: 1450, y: 200, w: 110, h: 20, type: "platform" },
      { x: 1700, y: 280, w: 130, h: 20, type: "platform" },
      { x: 2050, y: 240, w: 120, h: 20, type: "platform" },
      { x: 2300, y: 180, w: 120, h: 20, type: "platform" },
      { x: 2600, y: 280, w: 110, h: 20, type: "platform" },
    ],
    dogMountains: [
      { x: 600, y: 280, w: 100, h: 100, hit: false, animTime: 0 },
      { x: 1280, y: 280, w: 100, h: 100, hit: false, animTime: 0 },
      { x: 2200, y: 280, w: 100, h: 100, hit: false, animTime: 0 },
    ],
    cats,
    flags: [
      { x: 510, y: 180, w: 24, h: 50, got: false },
      { x: 1140, y: 200, w: 24, h: 50, got: false },
      { x: 1480, y: 150, w: 24, h: 50, got: false },
      { x: 2080, y: 190, w: 24, h: 50, got: false },
      { x: 2330, y: 130, w: 24, h: 50, got: false },
    ],
    boss: {
      x: 2950, y: GROUND_Y - 80, w: 80, h: 80,
      hp: 3, alive: true, vx: 0, vy: 0,
      attackTimer: 0, hurtFlash: 0, defeated: false,
    },
    particles: [],
    heartStones,
    collectedWords: {},
    owl: {
      x: 2520,
      y: GROUND_Y - 110,
      w: 70,
      h: 110,
      triggered: false,
    },
    gateOpen: false,
    paused: false,
  };
}
