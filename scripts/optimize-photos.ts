import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const SRC = "/Users/matthewdemordaunt/.claude/image-cache/4b6c2eee-1d3e-403b-8644-ed1a89b46d63";
const OUT = join(process.cwd(), "public", "photos");

const targets: Array<{ src: string; out: string; width: number }> = [
  { src: "1.png", out: "harry-1-baby.jpg", width: 1200 },
  { src: "2.jpeg", out: "harry-2-shoulders.jpg", width: 1400 },
  { src: "3.jpeg", out: "harry-3-tron.jpg", width: 1400 },
  { src: "4.jpeg", out: "harry-4-buzz.jpg", width: 1400 },
  { src: "5.jpeg", out: "harry-5-bronco.jpg", width: 1600 },
  { src: "6.jpeg", out: "harry-6-sled.jpg", width: 1600 },
];

async function run() {
  await mkdir(OUT, { recursive: true });
  if (!existsSync(SRC)) {
    console.error("Source dir missing:", SRC);
    process.exit(1);
  }
  for (const t of targets) {
    const inPath = join(SRC, t.src);
    if (!existsSync(inPath)) {
      console.warn("missing source:", inPath);
      continue;
    }
    const outPath = join(OUT, t.out);
    await sharp(inPath, { failOn: "none" })
      .rotate()
      .resize({ width: t.width, withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(outPath);
    const stat = await readdir(OUT);
    void stat;
    console.log("optimized →", t.out);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
