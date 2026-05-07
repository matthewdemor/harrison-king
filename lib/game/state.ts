import { GROUND_Y, WORLD_W } from "./constants";
import type { GameState, Cat } from "./types";

export function createInitialState(): GameState {
  const cats: Cat[] = [
    { x: 350, y: GROUND_Y - 35, w: 36, h: 35, vx: -1, alive: true, type: "cat", minX: 320, maxX: 460, hp: 1 },
    { x: 800, y: GROUND_Y - 35, w: 36, h: 35, vx: 1, alive: true, type: "cat", minX: 760, maxX: 920, hp: 1 },
    { x: 1200, y: GROUND_Y - 50, w: 50, h: 50, vx: -1, alive: true, type: "bigcat", minX: 1150, maxX: 1340, hp: 2 },
    { x: 1600, y: GROUND_Y - 35, w: 36, h: 35, vx: 1, alive: true, type: "cat", minX: 1560, maxX: 1750, hp: 1 },
    { x: 1900, y: GROUND_Y - 50, w: 50, h: 50, vx: -1, alive: true, type: "bigcat", minX: 1860, maxX: 2020, hp: 2 },
    { x: 2400, y: GROUND_Y - 35, w: 36, h: 35, vx: 1, alive: true, type: "cat", minX: 2360, maxX: 2520, hp: 1 },
  ];

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
  };
}
