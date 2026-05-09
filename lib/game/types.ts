export type Rect = { x: number; y: number; w: number; h: number };

export type Player = {
  x: number; y: number; w: number; h: number;
  vx: number; vy: number;
  speed: number; jumpPower: number;
  grounded: boolean; facing: 1 | -1;
  hatOn: boolean; invuln: number;
  walkFrame: number; powerUp: number;
};

export type Hat = {
  active: boolean;
  x: number; y: number; vx: number;
  age: number; rotation: number; returning: boolean;
};

export type Cat = {
  x: number; y: number; w: number; h: number;
  vx: number; alive: boolean;
  type: "cat" | "bigcat";
  minX: number; maxX: number;
  hp: number;
};

export type Mountain = {
  x: number; y: number; w: number; h: number;
  hit: boolean; animTime: number;
};

export type Flag = {
  x: number; y: number; w: number; h: number;
  got: boolean;
};

export type Boss = {
  x: number; y: number; w: number; h: number;
  hp: number; alive: boolean;
  vx: number; vy: number;
  attackTimer: number; hurtFlash: number; defeated: boolean;
};

export type Particle = {
  x: number; y: number; vx: number; vy: number;
  life: number; color: string; size: number;
};

export type Platform = {
  x: number; y: number; w: number; h: number;
  type: "ground" | "platform";
};

export type Camera = { x: number };

export type HeartStone = {
  id: string;
  word: string;
  x: number;
  y: number;
  w: number;
  h: number;
  collected: boolean;
  pulse: number;
};

export type Owl = {
  x: number;
  y: number;
  w: number;
  h: number;
  triggered: boolean;
};

export type WordGhost = {
  x: number;
  y: number;
  word: string;
  life: number;
  maxLife: number;
};

export type GameState = {
  camera: Camera;
  player: Player;
  hat: Hat;
  lives: number;
  score: number;
  flagsGot: number;
  platforms: Platform[];
  dogMountains: Mountain[];
  cats: Cat[];
  flags: Flag[];
  boss: Boss;
  particles: Particle[];
  heartStones: HeartStone[];
  collectedWords: Record<string, boolean>;
  owl: Owl;
  gateOpen: boolean;
  paused: boolean;
  wordGhosts: WordGhost[];
};

export type LabelKind =
  | "dog"
  | "cat"
  | "boss"
  | "hat"
  | "flag"
  | "mountain"
  | "owl"
  | "sun"
  | "cloud";

export type LabelTarget = {
  kind: LabelKind;
  word: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Keys = Record<string, boolean>;

export type EngineEvents = {
  onWin?: () => void;
  onLose?: () => void;
  onHeartStone?: (stone: HeartStone) => void;
  onOwl?: () => void;
};
