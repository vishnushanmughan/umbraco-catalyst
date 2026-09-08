/**
 * Builds public/emoji-picker-data.json from @emoji-mart/data (Unicode 15 / sets/15/all.json).
 * Keeps id, name, keywords, and default skin native only — drops unified/x/y/version/emoticons
 * and flag emojis (same filtering as the picker UI). Run via npm prebuild.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INPUT = join(ROOT, 'node_modules/@emoji-mart/data/sets/15/all.json');
const OUT = join(ROOT, 'public/emoji-picker-data.json');

function isFlagNative(native) {
    const chars = [...native];
    if (chars.length !== 2) return false;
    const a = chars[0].codePointAt(0) ?? 0;
    const b = chars[1].codePointAt(0) ?? 0;
    return a >= 0x1f1e6 && a <= 0x1f1ff && b >= 0x1f1e6 && b <= 0x1f1ff;
}

function isFlagEmoji(e, native) {
    if (isFlagNative(native)) return true;
    return e.id.length === 2 && /^[a-z]{2}$/i.test(e.id);
}

const raw = JSON.parse(readFileSync(INPUT, 'utf8'));
const slimEmojis = {};

for (const e of Object.values(raw.emojis || {})) {
    const native = e.skins?.[0]?.native ?? '';
    if (!native) continue;
    if (isFlagEmoji(e, native)) continue;
    slimEmojis[e.id] = {
        id: e.id,
        name: e.name,
        keywords: e.keywords,
        skins: [{ native }],
    };
}

const slimCategories = [];
for (const c of raw.categories || []) {
    if (c.id === 'flags') continue;
    const emojis = (c.emojis || []).filter((id) => slimEmojis[id]);
    slimCategories.push({ id: c.id, emojis });
}

const slim = { categories: slimCategories, emojis: slimEmojis };
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(slim));

const orig = readFileSync(INPUT).length;
const outLen = readFileSync(OUT).length;
console.log(`emoji-picker-data.json: ${outLen} bytes (source all.json: ${orig} bytes)`);
