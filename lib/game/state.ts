import { GROUND_Y, WORLD_W } from "./constants";
import type { Cat, GameState, HeartStone } from "./types";
import { HEART_WORDS } from "@/lib/words/heart-words";

// Twenty unique words evenly distributed across the reachable world (x≈100..2400).
// Each x-slot is at least ~100px from its neighbors, and heights alternate between
// open ground, platform tops, and mountain peaks so no two stones look duplicated
// next to each other. The 120px buffer on the right keeps stones clear of the owl.
const STONE_PLACEMENTS: Array<{ x: number; y: number }> = [
  { x: 120,  y: GROUND_Y - 36 },        // 0  the    — ground
  { x: 240,  y: GROUND_Y - 36 },        // 1  a      — ground
  { x: 340,  y: 254 },                  // 2  I      — platform 280-390
  { x: 460,  y: GROUND_Y - 36 },        // 3  to     — ground
  { x: 560,  y: 194 },                  // 4  is     — platform 480-590
  { x: 680,  y: GROUND_Y - 36 },        // 5  you    — ground (past mountain at 600)
  { x: 800,  y: 254 },                  // 6  are    — platform 720-830
  { x: 940,  y: GROUND_Y - 36 },        // 7  of     — ground
  { x: 1080, y: GROUND_Y - 36 },        // 8  was    — ground
  { x: 1200, y: 214 },                  // 9  said   — platform 1100-1230
  { x: 1320, y: 244 },                  // 10 they   — mountain peak (apex ~1330)
  { x: 1440, y: GROUND_Y - 36 },        // 11 have   — ground
  { x: 1560, y: 164 },                  // 12 my     — platform 1450-1560
  { x: 1680, y: GROUND_Y - 36 },        // 13 do     — ground
  { x: 1800, y: 244 },                  // 14 what   — platform 1700-1830
  { x: 1940, y: GROUND_Y - 36 },        // 15 there  — ground
  { x: 2080, y: 204 },                  // 16 were   — platform 2050-2170
  { x: 2240, y: 244 },                  // 17 one    — mountain peak (apex ~2250)
  { x: 2340, y: 144 },                  // 18 by     — platform 2300-2420 (high)
  { x: 2400, y: GROUND_Y - 36 },        // 19 from   — ground (140px buffer to owl)
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
    wordGhosts: [],
  };
}
