import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const root = join(process.cwd(), "public", "icons");

const dogSvg = (size: number, padForMaskable = false): string => {
  const pad = padForMaskable ? size * 0.12 : 0;
  const cx = size / 2;
  const cy = size / 2;
  const inner = size - pad * 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="35%" r="75%">
      <stop offset="0%" stop-color="#FFE066"/>
      <stop offset="40%" stop-color="#FFB088"/>
      <stop offset="100%" stop-color="#5BA8D0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  <g transform="translate(${cx - inner / 2}, ${cy - inner / 2}) scale(${inner / 200})">
    <ellipse cx="100" cy="135" rx="55" ry="40" fill="#D4A574" stroke="#2D3142" stroke-width="6"/>
    <circle cx="100" cy="85" r="48" fill="#D4A574" stroke="#2D3142" stroke-width="6"/>
    <ellipse cx="65" cy="55" rx="14" ry="22" fill="#8B5A3C" stroke="#2D3142" stroke-width="6" transform="rotate(-25 65 55)"/>
    <ellipse cx="135" cy="55" rx="14" ry="22" fill="#8B5A3C" stroke="#2D3142" stroke-width="6" transform="rotate(25 135 55)"/>
    <ellipse cx="100" cy="48" rx="38" ry="6" fill="#C73E3E" stroke="#2D3142" stroke-width="4"/>
    <path d="M 75 48 Q 100 10, 125 48" fill="#E94B4B" stroke="#2D3142" stroke-width="4"/>
    <circle cx="100" cy="22" r="6" fill="#FFE066" stroke="#2D3142" stroke-width="3"/>
    <circle cx="85" cy="85" r="6" fill="#2D3142"/>
    <circle cx="115" cy="85" r="6" fill="#2D3142"/>
    <circle cx="87" cy="83" r="2" fill="white"/>
    <circle cx="117" cy="83" r="2" fill="white"/>
    <ellipse cx="100" cy="105" rx="18" ry="13" fill="#F5DEB3" stroke="#2D3142" stroke-width="4"/>
    <ellipse cx="100" cy="98" rx="6" ry="4" fill="#2D3142"/>
    <path d="M 100 105 Q 100 115 92 115" fill="none" stroke="#2D3142" stroke-width="4" stroke-linecap="round"/>
    <path d="M 100 105 Q 100 115 108 115" fill="none" stroke="#2D3142" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="100" cy="118" rx="5" ry="4" fill="#FF6B9D" stroke="#2D3142" stroke-width="3"/>
    <rect x="72" y="160" width="16" height="20" rx="6" fill="#D4A574" stroke="#2D3142" stroke-width="4"/>
    <rect x="112" y="160" width="16" height="20" rx="6" fill="#D4A574" stroke="#2D3142" stroke-width="4"/>
  </g>
</svg>`;
};

async function generate() {
  await mkdir(root, { recursive: true });

  const targets: Array<{ name: string; size: number; maskable?: boolean; outDir?: string }> = [
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
    { name: "icon-maskable-512.png", size: 512, maskable: true },
  ];

  for (const t of targets) {
    const buf = Buffer.from(dogSvg(t.size, t.maskable));
    await sharp(buf).png().toFile(join(root, t.name));
  }

  await sharp(Buffer.from(dogSvg(180)))
    .png()
    .toFile(join(process.cwd(), "public", "apple-touch-icon.png"));

  await sharp(Buffer.from(dogSvg(32)))
    .png()
    .toFile(join(process.cwd(), "public", "favicon-32.png"));

  await sharp(Buffer.from(dogSvg(180)))
    .resize(32, 32)
    .toFormat("png")
    .toFile(join(process.cwd(), "public", "favicon.ico"));

  console.log("Generated PWA icons in public/icons/");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
