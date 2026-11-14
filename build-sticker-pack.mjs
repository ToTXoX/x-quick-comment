import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

function gifDuration(bytes) {
  if (!/^GIF8[79]a$/.test(bytes.toString('ascii', 0, 6)) || bytes.length < 14) {
    throw new Error('Invalid GIF header');
  }
  const colorTableSize = flags => flags & 128 ? 3 * 2 ** ((flags & 7) + 1) : 0;
  let cursor = 13 + colorTableSize(bytes[10]);
  let frames = 0;
  let delay = 100;
  let duration = 0;

  function skipBlocks() {
    while (cursor < bytes.length) {
      const size = bytes[cursor++];
      if (!size) return;
      cursor += size;
    }
    throw new Error('Truncated GIF block');
  }

  while (cursor < bytes.length) {
    const marker = bytes[cursor++];
    if (marker === 0x3b && frames > 1) return duration;
    if (marker === 0x2c && cursor + 9 < bytes.length) {
      cursor += 9 + colorTableSize(bytes[cursor + 8]) + 1;
      skipBlocks();
      frames++;
      duration += delay;
      delay = 100;
    } else if (marker === 0x21 && cursor < bytes.length) {
      const type = bytes[cursor++];
      if (type === 0xf9) {
        if (bytes[cursor] !== 4 || bytes[cursor + 5] !== 0) throw new Error('Invalid GIF frame delay');
        const centiseconds = bytes.readUInt16LE(cursor + 2);
        delay = centiseconds <= 1 ? 100 : centiseconds * 10;
      }
      skipBlocks();
      if (type === 0x01) delay = 100;
    } else {
      break;
    }
  }
  throw new Error('Expected an animated GIF with a complete trailer');
}

export async function buildStickerPack() {
  const directory = new URL('./docs/like-gifs/', import.meta.url);
  const manifest = JSON.parse(await readFile(new URL('manifest.json', directory), 'utf8'));
  if (manifest.version !== 1 || !Array.isArray(manifest.stickers)) {
    throw new Error('Expected sticker manifest v1');
  }

  const entries = [];
  const gifs = [];
  const ids = new Set();
  for (const { file, name, id = typeof file === 'string' ? file.slice(0, -4) : undefined } of manifest.stickers) {
    if (typeof file !== 'string' || !/^[\p{L}\p{N}][\p{L}\p{N}-]*\.gif$/u.test(file) ||
        typeof id !== 'string' || !/^[\p{L}\p{N}][\p{L}\p{N}-]*$/u.test(id) ||
        typeof name !== 'string' || !name.trim() || ids.has(id)) {
      throw new Error('Invalid or duplicate sticker entry: ' + file);
    }
    const gif = await readFile(new URL(encodeURIComponent(file), directory));
    let duration;
    try { duration = gifDuration(gif); }
    catch (error) { throw new Error(file + ': ' + error.message); }
    ids.add(id);
    entries.push({ id, name, duration, size: gif.length });
    gifs.push(gif);
  }
  if (!ids.has('peekala-peek')) throw new Error('Sticker manifest is missing the default sticker');

  const catalog = { version: manifest.version, stickers: entries };
  const header = Buffer.from(JSON.stringify(catalog));
  const length = Buffer.alloc(4);
  length.writeUInt32LE(header.length);
  const pack = Buffer.concat([length, header, ...gifs]);
  const hash = createHash('sha256').update(pack).digest();
  const file = 'stickers.' + hash.toString('hex') + '.bin';
  await writeFile(new URL(file, directory), pack);
  return { path: 'docs/like-gifs/' + file, integrity: 'sha256-' + hash.toString('base64'), catalog };
}
