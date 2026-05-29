// Gera os ícones PWA + splash screens iOS a partir do logo branco (logo-roxo.svg)
// sobre o fundo dark premium. Rodar uma vez: `node scripts/generate-pwa-icons.mjs`
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const LOGO = resolve(root, 'public/logo-roxo.svg'); // logo branco
const OUT = resolve(root, 'public/icons');
const BG = { r: 0x0f, g: 0x08, b: 0x20, alpha: 1 }; // #0F0820

async function renderLogo(targetPx) {
  // Rasteriza o SVG em alta densidade e ajusta ao tamanho alvo (contain).
  return sharp(LOGO, { density: 512 })
    .resize({ width: targetPx, height: targetPx, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function makeIcon(size, { ratio = 0.66, file, bg = BG } = {}) {
  const logoPx = Math.round(size * ratio);
  const logo = await renderLogo(logoPx);
  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(resolve(OUT, file ?? `icon-${size}.png`));
  console.log('icon', file ?? `icon-${size}.png`);
}

async function makeSplash(width, height, file) {
  const logoPx = Math.round(Math.min(width, height) * 0.4);
  const logo = await renderLogo(logoPx);
  await sharp({
    create: { width, height, channels: 4, background: BG },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(resolve(OUT, file));
  console.log('splash', file);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  // Ícones padrão (any)
  for (const size of [72, 96, 128, 144, 152, 192, 384, 512]) {
    await makeIcon(size, { ratio: 0.66 });
  }

  // Maskable (safe-zone: logo menor, fundo cheio)
  await makeIcon(192, { ratio: 0.5, file: 'maskable-192.png' });
  await makeIcon(512, { ratio: 0.5, file: 'maskable-512.png' });

  // Apple touch icon (fundo sólido, sem transparência)
  await makeIcon(180, { ratio: 0.62, file: 'apple-touch-icon.png' });

  // iOS splash screens (portrait) — tamanhos comuns
  const splashes = [
    [1290, 2796, 'splash-1290x2796.png'], // iPhone 15/14 Pro Max
    [1179, 2556, 'splash-1179x2556.png'], // iPhone 15/14 Pro
    [1170, 2532, 'splash-1170x2532.png'], // iPhone 13/12
    [1284, 2778, 'splash-1284x2778.png'], // iPhone 12/13 Pro Max
    [1125, 2436, 'splash-1125x2436.png'], // iPhone X/XS/11 Pro
    [828, 1792, 'splash-828x1792.png'], // iPhone XR/11
    [750, 1334, 'splash-750x1334.png'], // iPhone 8/SE2
    [1536, 2048, 'splash-1536x2048.png'], // iPad
  ];
  for (const [w, h, file] of splashes) {
    await makeSplash(w, h, file);
  }

  console.log('done');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
