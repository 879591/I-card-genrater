import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Minimal PNG encoder with CRC32
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = makeCrcTable();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function createPng(width, height, isMaskable = false) {
  // Generate RGBA buffer
  const scanlines = [];
  const cx = width / 2;
  const cy = height / 2;
  const r = width / 2;

  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const idx = 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep vibrant Royal Blue gradient background
      const ny = y / height;
      let red = Math.round(18 + ny * 20);
      let green = Math.round(55 + ny * 60);
      let blue = Math.round(155 + ny * 80);
      let alpha = 255;

      // Outer rounded border or circular mask if not maskable
      if (!isMaskable) {
        // Rounded corner badge radius
        const cornerR = width * 0.22;
        const inLeft = x < cornerR;
        const inRight = x > width - cornerR;
        const inTop = y < cornerR;
        const inBottom = y > height - cornerR;

        let cornerDist = 0;
        if (inLeft && inTop) cornerDist = Math.hypot(x - cornerR, y - cornerR);
        else if (inRight && inTop) cornerDist = Math.hypot(x - (width - cornerR), y - cornerR);
        else if (inLeft && inBottom) cornerDist = Math.hypot(x - cornerR, y - (height - cornerR));
        else if (inRight && inBottom) cornerDist = Math.hypot(x - (width - cornerR), y - (height - cornerR));

        if (cornerDist > cornerR) {
          alpha = 0;
        }
      }

      // Draw stylized ID Card badge icon in the center safe zone
      // Central badge box
      const bw = width * 0.52;
      const bh = height * 0.65;
      const bx1 = cx - bw / 2;
      const bx2 = cx + bw / 2;
      const by1 = cy - bh / 2 + height * 0.04;
      const by2 = cy + bh / 2 + height * 0.04;

      if (alpha > 0 && x >= bx1 && x <= bx2 && y >= by1 && y <= by2) {
        // White card background
        red = 248;
        green = 250;
        blue = 252;

        // Card header banner (blue)
        if (y < by1 + bh * 0.28) {
          red = 30;
          green = 64;
          blue = 175; // #1e40af
        }

        // Lanyard slot at top of card
        const slotW = bw * 0.35;
        const slotH = bh * 0.06;
        if (x >= cx - slotW / 2 && x <= cx + slotW / 2 && y >= by1 + bh * 0.05 && y <= by1 + bh * 0.05 + slotH) {
          red = 15;
          green = 23;
          blue = 42;
        }

        // Star or photo silhouette
        // Photo box
        const pw = bw * 0.36;
        const ph = pw;
        const px1 = cx - pw / 2;
        const px2 = cx + pw / 2;
        const py1 = by1 + bh * 0.36;
        const py2 = py1 + ph;

        if (x >= px1 && x <= px2 && y >= py1 && y <= py2) {
          // Gold / Amber photo placeholder
          red = 245;
          green = 158;
          blue = 11; // #f59e0b
        }

        // Details lines
        const lw = bw * 0.65;
        const lx1 = cx - lw / 2;
        const lx2 = cx + lw / 2;
        const ly1 = py2 + bh * 0.08;
        const ly2 = ly1 + bh * 0.04;
        const ly3 = ly2 + bh * 0.06;
        const ly4 = ly3 + bh * 0.04;

        if (x >= lx1 && x <= lx2 && ((y >= ly1 && y <= ly2) || (y >= ly3 && y <= ly4))) {
          red = 71;
          green = 85;
          blue = 105;
        }
      }

      row[idx] = red;
      row[idx + 1] = green;
      row[idx + 2] = blue;
      row[idx + 3] = alpha;
    }
    scanlines.push(row);
  }

  const rawData = Buffer.concat(scanlines);
  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter standard
  ihdrData[12] = 0; // No interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = makeChunk('IDAT', deflated);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(64, 64, false));

console.log('Successfully generated all PWA PNG icons in /public!');
