/**
 * Emoji category and item types. Full set is loaded from `emoji-picker-data.json` (built from @emoji-mart/data).
 */
export interface EmojiCategory {
    id: string;
    name: string;
    emojis: string[];
}

export interface EmojiItem {
    id: string;
    name: string;
    native: string;
    keywords?: string[];
    shortcodes?: string[];
}

const REGIONAL_INDICATOR_START = 0x1f1e6; // A
const REGIONAL_INDICATOR_END = 0x1f1ff;   // Z

/** True if native string is a flag (two regional indicator symbols U+1F1E6..U+1F1FF). */
export function isFlagNative(native: string): boolean {
    const chars = Array.from(native);
    if (chars.length !== 2) return false;
    const a = chars[0].codePointAt(0) ?? 0;
    const b = chars[1].codePointAt(0) ?? 0;
    return (
        a >= REGIONAL_INDICATOR_START && a <= REGIONAL_INDICATOR_END &&
        b >= REGIONAL_INDICATOR_START && b <= REGIONAL_INDICATOR_END
    );
}

/** True if emoji is a country/region flag (by id or by native content). Used to hide flags from the picker. */
export function isFlagEmoji(emoji: EmojiItem): boolean {
    if (isFlagNative(emoji.native)) return true;
    return emoji.id.length === 2 && /^[a-z]{2}$/i.test(emoji.id);
}

export interface EmojiDataSet {
    categories: EmojiCategory[];
    emojis: Record<string, EmojiItem>;
}

const CATEGORY_NAMES: Record<string, string> = {
    frequent: 'Frequently Used',
    people: 'Smileys & People',
    nature: 'Animals & Nature',
    foods: 'Food & Drink',
    activity: 'Activity',
    places: 'Travel & Places',
    objects: 'Objects',
    symbols: 'Symbols',
    flags: 'Flags',
};

/** Fallback emoji set (popular emojis) when emoji-picker-data.json is missing or fails to load */
export const FALLBACK_EMOJI_DATA: EmojiDataSet = {
    categories: [
        { id: 'frequent', name: 'Frequently Used', emojis: [] },
        { id: 'people', name: 'Smileys & People', emojis: ['grinning', 'smiley', 'smile', 'grin', 'sweat_smile', 'joy', 'rofl', 'relaxed', 'blush', 'innocent', 'slight_smile', 'upside_down', 'wink', 'relieved', 'heart_eyes', 'kissing_heart', 'kissing', 'yum', 'stuck_out_tongue', 'zany', 'raised_hands', 'clap', 'thumbsup', 'wave', 'pray'] },
        { id: 'nature', name: 'Animals & Nature', emojis: ['see_no_evil', 'hear_no_evil', 'speak_no_evil', 'monkey_face', 'dog', 'cat', 'rabbit', 'fox', 'bear', 'panda', 'lion', 'tiger', 'wolf', 'pig', 'cow', 'boar', 'unicorn', 'dragon', 'bee', 'butterfly', 'sunny', 'cloud', 'rainbow', 'star', 'fire', 'snowflake', 'cherry_blossom', 'rose', 'tulip', 'tree', 'leaf'] },
        { id: 'foods', name: 'Food & Drink', emojis: ['grape', 'melon', 'watermelon', 'tangerine', 'lemon', 'banana', 'apple', 'pear', 'peach', 'cherries', 'strawberry', 'hamburger', 'pizza', 'taco', 'burrito', 'cake', 'cookie', 'chocolate_bar', 'coffee', 'tea', 'beer', 'champagne', 'wine_glass'] },
        { id: 'activity', name: 'Activity', emojis: ['soccer', 'basketball', 'football', 'baseball', 'tennis', 'golf', 'running', 'surfing', 'swimming', 'cycling', 'weight_lifting', 'dart', 'bowling', 'video_game', 'slot_machine', 'musical_score', 'guitar', 'drum', 'saxophone', 'trumpet', 'art', 'microphone', 'headphones', 'movie_camera'] },
        { id: 'places', name: 'Travel & Places', emojis: ['car', 'taxi', 'bus', 'train', 'airplane', 'rocket', 'bicycle', 'house', 'office', 'hospital', 'school', 'hotel', 'church', 'stadium', 'statue_of_liberty', 'fountain', 'mountain', 'beach', 'camping', 'sunrise', 'cityscape', 'night_with_stars'] },
        { id: 'objects', name: 'Objects', emojis: ['bulb', 'flashlight', 'battery', 'electric_plug', 'computer', 'keyboard', 'desktop', 'printer', 'lock', 'key', 'wrench', 'hammer', 'gear', 'scissors', 'envelope', 'email', 'inbox_tray', 'package', 'calendar', 'bookmark', 'books', 'notebook', 'pencil2', 'paintbrush', 'crayon', 'paperclip', 'pushpin'] },
        { id: 'symbols', name: 'Symbols', emojis: ['heart', 'orange_heart', 'yellow_heart', 'green_heart', 'blue_heart', 'purple_heart', 'black_heart', 'broken_heart', 'star2', 'sparkles', 'zap', 'checkmark', 'cross', 'question', 'exclamation', 'plus', 'minus', 'divide', 'hash', 'arrow_right', 'arrow_left', 'recycle', 'tm', 'copyright', 'registered'] },
    ],
    emojis: {} as Record<string, EmojiItem>,
};

/** Build fallback emojis from native chars (id -> item) */
const FALLBACK_NATIVES: Record<string, string> = {
    grinning: '😀', smiley: '😃', smile: '😄', grin: '😁', sweat_smile: '😅', joy: '😂', rofl: '🤣', relaxed: '😌', blush: '😊', innocent: '😇',
    slight_smile: '🙂', upside_down: '🙃', wink: '😉', relieved: '😌', heart_eyes: '😍', kissing_heart: '😘', kissing: '😗', yum: '😋', stuck_out_tongue: '😛', zany: '🤪',
    raised_hands: '🙌', clap: '👏', thumbsup: '👍', wave: '👋', pray: '🙏',
    see_no_evil: '🙈', hear_no_evil: '🙉', speak_no_evil: '🙊', monkey_face: '🐵', dog: '🐕', cat: '🐱', rabbit: '🐰', fox: '🦊', bear: '🐻', panda: '🐼', lion: '🦁', tiger: '🐯', wolf: '🐺', pig: '🐷', cow: '🐮', boar: '🐗', unicorn: '🦄', dragon: '🐉', bee: '🐝', butterfly: '🦋',
    sunny: '☀️', cloud: '☁️', rainbow: '🌈', star: '⭐', fire: '🔥', snowflake: '❄️', cherry_blossom: '🌸', rose: '🌹', tulip: '🌷', tree: '🌳', leaf: '🍃',
    grape: '🍇', melon: '🍈', watermelon: '🍉', tangerine: '🍊', lemon: '🍋', banana: '🍌', apple: '🍎', pear: '🍐', peach: '🍑', cherries: '🍒', strawberry: '🍓',
    hamburger: '🍔', pizza: '🍕', taco: '🌮', burrito: '🌯', cake: '🍰', cookie: '🍪', chocolate_bar: '🍫', coffee: '☕', tea: '🍵', beer: '🍺', champagne: '🍾', wine_glass: '🍷',
    soccer: '⚽', basketball: '🏀', football: '🏈', baseball: '⚾', tennis: '🎾', golf: '⛳', running: '🏃', surfing: '🏄', swimming: '🏊', cycling: '🚴', weight_lifting: '🏋️', dart: '🎯', bowling: '🎳', video_game: '🎮', slot_machine: '🎰',
    musical_score: '🎼', guitar: '🎸', drum: '🥁', saxophone: '🎷', trumpet: '🎺', art: '🎨', microphone: '🎤', headphones: '🎧', movie_camera: '🎬',
    car: '🚗', taxi: '🚕', bus: '🚌', train: '🚂', airplane: '✈️', rocket: '🚀', bicycle: '🚲', house: '🏠', office: '🏢', hospital: '🏥', school: '🏫', hotel: '🏨', church: '⛪', stadium: '🏟️', statue_of_liberty: '🗽', fountain: '⛲', mountain: '⛰️', beach: '🏖️', camping: '🏕️', sunrise: '🌅', cityscape: '🏙️', night_with_stars: '🌃',
    bulb: '💡', flashlight: '🔦', battery: '🔋', electric_plug: '🔌', computer: '💻', keyboard: '⌨️', desktop: '🖥️', printer: '🖨️', lock: '🔒', key: '🔑', wrench: '🔧', hammer: '🔨', gear: '⚙️', scissors: '✂️', envelope: '✉️', email: '📧', inbox_tray: '📥', package: '📦', calendar: '📅', bookmark: '🔖', books: '📚', notebook: '📓', pencil2: '✏️', paintbrush: '🖌️', crayon: '🖍️', paperclip: '📎', pushpin: '📌',
    heart: '❤️', orange_heart: '🧡', yellow_heart: '💛', green_heart: '💚', blue_heart: '💙', purple_heart: '💜', black_heart: '🖤', broken_heart: '💔', star2: '🌟', sparkles: '✨', zap: '⚡', checkmark: '✔️', cross: '❌', question: '❓', exclamation: '❗', plus: '➕', minus: '➖', divide: '➗', hash: '#️⃣', arrow_right: '➡️', arrow_left: '⬅️', recycle: '♻️', tm: '™️', copyright: '©️', registered: '®️',
};

function buildFallbackEmojis(): Record<string, EmojiItem> {
    const emojis: Record<string, EmojiItem> = {};
    for (const [id, native] of Object.entries(FALLBACK_NATIVES)) {
        emojis[id] = { id, name: id.replace(/_/g, ' '), native, keywords: [id] };
    }
    return emojis;
}

const fallbackEmojis = buildFallbackEmojis();
FALLBACK_EMOJI_DATA.emojis = fallbackEmojis;

interface EmojiMartRaw {
    categories: Array<{ id: string; emojis: string[] }>;
    emojis: Record<string, { id: string; name: string; keywords: string[]; skins: Array<{ native: string }> }>;
}

let _emojiDataPromise: Promise<EmojiDataSet> | null = null;

function normalizeFromRaw(raw: EmojiMartRaw): EmojiDataSet | null {
    if (!raw?.categories?.length || !raw?.emojis || Object.keys(raw.emojis).length === 0) {
        return null;
    }
    const categories: EmojiCategory[] = [
        { id: 'frequent', name: CATEGORY_NAMES.frequent, emojis: [] },
        ...raw.categories
            .filter((c) => c.id !== 'flags')
            .map((c) => ({
                id: c.id,
                name: CATEGORY_NAMES[c.id] ?? c.id.replace(/_/g, ' '),
                emojis: c.emojis || [],
            })),
    ];
    const emojis: Record<string, EmojiItem> = {};
    for (const [id, e] of Object.entries(raw.emojis)) {
        const native = e.skins?.[0]?.native ?? '';
        if (!native) continue;
        const item: EmojiItem = {
            id: e.id,
            name: e.name ?? id,
            native,
            keywords: e.keywords,
        };
        if (isFlagEmoji(item)) continue;
        emojis[id] = item;
    }
    return { categories, emojis };
}

async function _loadEmojiDataImpl(): Promise<EmojiDataSet> {
    try {
        /** public/emoji-picker-data.json is emitted next to bundles; base matches umbraco-package paths. */
        const path = `${import.meta.env.BASE_URL}emoji-picker-data.json`.replace(/\/{2,}/g, '/');
        const res = await fetch(path, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = (await res.json()) as EmojiMartRaw;
        const normalized = normalizeFromRaw(raw);
        if (normalized) return normalized;
    } catch {
        /** Network / parse / missing file */
    }
    return FALLBACK_EMOJI_DATA;
}

/**
 * Load full emoji set (Unicode 15). Returns cached result if already loaded.
 */
export async function loadEmojiData(): Promise<EmojiDataSet> {
    if (_emojiDataPromise == null) _emojiDataPromise = _loadEmojiDataImpl();
    return _emojiDataPromise;
}

/**
 * Start loading emoji data as soon as the extension bundle loads (before the user opens the picker).
 */
export function prefetchEmojiData(): void {
    void loadEmojiData();
}
