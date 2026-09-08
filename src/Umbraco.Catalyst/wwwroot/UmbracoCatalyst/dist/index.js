import { UmbLitElement as x } from "@umbraco-cms/backoffice/lit-element";
import { UmbChangeEvent as m } from "@umbraco-cms/backoffice/event";
import { css as k, property as h, state as d, customElement as T, html as o } from "@umbraco-cms/backoffice/external/lit";
var E = Object.defineProperty, S = Object.getOwnPropertyDescriptor, g = (e, t, a, i) => {
  for (var r = i > 1 ? void 0 : i ? S(t, a) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (i ? s(t, a, r) : s(r)) || r);
  return i && r && E(t, a, r), r;
};
let c = class extends x {
  constructor() {
    super(...arguments), this._hoverRating = 0;
  }
  get _maxStars() {
    var e;
    return ((e = this.config) == null ? void 0 : e.getValueByAlias("maxStars")) ?? 5;
  }
  get _allowHalfStars() {
    var e;
    return ((e = this.config) == null ? void 0 : e.getValueByAlias("allowHalfStars")) ?? !0;
  }
  get _currentRating() {
    var e;
    return ((e = this.value) == null ? void 0 : e.rating) ?? 0;
  }
  _onStarClick(e, t) {
    const a = t ? e - 0.5 : e;
    this.value = {
      rating: a,
      maxStars: this._maxStars,
      allowHalfStars: this._allowHalfStars
    }, this.dispatchEvent(new m());
  }
  _onStarHover(e, t) {
    this._hoverRating = t ? e - 0.5 : e;
  }
  _onMouseLeave() {
    this._hoverRating = 0;
  }
  _getStarState(e) {
    const t = this._hoverRating || this._currentRating;
    return e <= Math.floor(t) ? "full" : e === Math.ceil(t) && t % 1 !== 0 ? "half" : "empty";
  }
  render() {
    const e = Array.from({ length: this._maxStars }, (t, a) => a + 1);
    return o`
      <div
        class="catalyst-star-rating"
        @mouseleave=${this._onMouseLeave}
        aria-label="Star rating editor"
      >
        ${e.map(
      (t) => o`
            <span class="star star--${this._getStarState(t)}">
              ${this._allowHalfStars ? o`
                    <span
                      class="half-zone left"
                      @click=${() => this._onStarClick(t, !0)}
                      @mouseover=${() => this._onStarHover(t, !0)}
                    >
                    </span>
                    <span
                      class="half-zone right"
                      @click=${() => this._onStarClick(t, !1)}
                      @mouseover=${() => this._onStarHover(t, !1)}
                    >
                    </span>
                  ` : o`
                    <span
                      class="full-zone"
                      @click=${() => this._onStarClick(t, !1)}
                      @mouseover=${() => this._onStarHover(t, !1)}
                    >
                    </span>
                  `}
              ★
            </span>
          `
    )}
        <span class="label">
          ${this._currentRating > 0 ? o`${this._currentRating} / ${this._maxStars}` : o`<span class="no-rating">No rating set</span>`}
        </span>
      </div>
    `;
  }
};
c.styles = k`
    .catalyst-star-rating {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 28px;
      user-select: none;
    }
    .star {
      position: relative;
      cursor: pointer;
      color: #d0d0d0;
      transition: color 0.1s;
    }
    .star--full {
      color: #f5a623;
    }
    .star--half {
      color: #f5a623;
      opacity: 0.6;
    }
    .half-zone {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 50%;
    }
    .half-zone.left {
      left: 0;
    }
    .half-zone.right {
      right: 0;
    }
    .full-zone {
      position: absolute;
      inset: 0;
    }
    .label {
      margin-left: 8px;
      font-size: 13px;
      color: var(--uui-color-text-alt);
    }
    .no-rating {
      color: var(--uui-color-disabled-contrast);
    }
  `;
g([
  h({ type: Object })
], c.prototype, "value", 2);
g([
  h({ attribute: !1 })
], c.prototype, "config", 2);
g([
  d()
], c.prototype, "_hoverRating", 2);
c = g([
  T("catalyst-star-rating-editor")
], c);
var A = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, u = (e, t, a, i) => {
  for (var r = i > 1 ? void 0 : i ? $(t, a) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (i ? s(t, a, r) : s(r)) || r);
  return i && r && A(t, a, r), r;
};
let l = class extends x {
  constructor() {
    super(...arguments), this._previewState = "empty", this._imageDimensions = "", this._editableField = null, this._debounceTimer = null, this._lastPreviewUrl = "", this._onDocumentPointerDown = (e) => {
      this._editableField && !e.composedPath().includes(this) && (this._editableField = null);
    };
  }
  get _requireAltText() {
    var e;
    return ((e = this.config) == null ? void 0 : e.getValueByAlias("requireAltText")) ?? !0;
  }
  get _imageValue() {
    if (typeof this.value == "object" && this.value !== null)
      return this.value;
    if (typeof this.value == "string")
      try {
        const e = JSON.parse(this.value);
        return {
          url: e.url ?? "",
          altText: e.altText ?? ""
        };
      } catch {
        return { url: this.value, altText: "" };
      }
    return { url: "", altText: "" };
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("pointerdown", this._onDocumentPointerDown, !0);
  }
  disconnectedCallback() {
    document.removeEventListener("pointerdown", this._onDocumentPointerDown, !0), this._debounceTimer && clearTimeout(this._debounceTimer), super.disconnectedCallback();
  }
  updated(e) {
    super.updated(e), e.has("value") && this._loadPreview(this._imageValue.url);
  }
  _setEditableField(e) {
    this._editableField = e;
  }
  _onAreaFocusOut(e) {
    const t = e.relatedTarget, a = e.currentTarget;
    t && a instanceof HTMLElement && a.contains(t) || (this._editableField = null);
  }
  _onUrlInput(e) {
    const t = e.target.value;
    this.value = { url: t, altText: this._imageValue.altText }, this.dispatchEvent(new m()), this._loadPreview(t);
  }
  _onAltInput(e) {
    const t = e.target.value;
    this.value = { url: this._imageValue.url, altText: t }, this.dispatchEvent(new m());
  }
  _loadPreview(e) {
    if (this._debounceTimer && clearTimeout(this._debounceTimer), this._lastPreviewUrl = e, this._imageDimensions = "", !e) {
      this._previewState = "empty";
      return;
    }
    this._debounceTimer = setTimeout(() => {
      this._previewState = "loading";
      const t = new Image();
      t.onload = () => {
        this._lastPreviewUrl === e && (this._previewState = "loaded", this._imageDimensions = `${t.naturalWidth} x ${t.naturalHeight}`);
      }, t.onerror = () => {
        this._lastPreviewUrl === e && (this._previewState = "error");
      }, t.src = e;
    }, 500);
  }
  _onClear() {
    this.value = { url: "", altText: "" }, this._editableField = null, this._previewState = "empty", this._imageDimensions = "", this.dispatchEvent(new m());
  }
  render() {
    const e = this._imageValue, t = e.url.length > 0 && this._editableField !== "url", a = e.altText.length > 0 && this._editableField !== "altText";
    return o`
      <div class="catalyst-cdn-image" @focusout=${this._onAreaFocusOut}>
        <uui-input
          class="grid-url"
          label="Image URL"
          placeholder="https://cdn.example.com/image.jpg"
          .value=${e.url}
          ?readonly=${t}
          @focus=${() => {
      e.url || this._setEditableField("url");
    }}
          @input=${this._onUrlInput}
        >
          ${e.url ? o`<uui-button
                slot="append"
                compact
                label="Edit image URL"
                @click=${() => this._setEditableField("url")}
                ><uui-icon name="edit"></uui-icon
              ></uui-button>` : ""}
        </uui-input>

        <uui-input
          class="grid-alt"
          label="Alt text"
          placeholder=${this._requireAltText ? "Alt text" : "Alt text (optional)"}
          .value=${e.altText}
          ?readonly=${a}
          @focus=${() => {
      e.altText || this._setEditableField("altText");
    }}
          @input=${this._onAltInput}
        >
          ${e.altText ? o`<uui-button
                slot="append"
                compact
                label="Edit alt text"
                @click=${() => this._setEditableField("altText")}
                ><uui-icon name="edit"></uui-icon
              ></uui-button>` : ""}
        </uui-input>

        <div class="grid-actions">
          ${e.url ? o`<uui-button class="grid-clear" label="Clear" @click=${this._onClear}>Clear</uui-button>` : ""}
          ${this._imageDimensions ? o`<small class="grid-pixels">${this._imageDimensions}</small>` : ""}
        </div>

        <div class="preview grid-preview">
          ${this._previewState === "loaded" && e.url ? o`<img src=${e.url} alt=${e.altText} />` : this._previewState === "loading" ? o`<span>Loading preview...</span>` : this._previewState === "error" ? o`<span class="error">Could not load image</span>` : o`<span class="empty">No image set</span>`}
        </div>
      </div>
    `;
  }
};
l.styles = k`
    .catalyst-cdn-image {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 100px;
      grid-template-rows: auto auto auto;
      column-gap: 12px;
      align-items: start;
    }
    .grid-url {
      grid-column: 1;
      min-width: 0;
    }
    .grid-alt {
      grid-column: 1;
      min-width: 0;
      margin-top: 0;
    }
    .grid-actions {
      grid-column: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      gap: 8px;
    }
    .grid-clear {
      flex: 0 0 auto;
    }
    .grid-pixels {
      flex: 1;
      text-align: right;
      color: var(--uui-color-text-alt);
      font-size: 11px;
    }
    .preview {
      grid-column: 2;
      grid-row: 1 / 4;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      min-width: 100px;
      min-height: 100px;
      border: 1px dashed var(--uui-color-border);
      border-radius: var(--uui-border-radius);
      overflow: hidden;
    }
    .preview img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .empty,
    .error {
      padding: 4px;
      color: var(--uui-color-text-alt);
      font-size: 11px;
      text-align: center;
    }
    .error {
      color: var(--uui-color-danger);
    }
  `;
u([
  h({ type: Object })
], l.prototype, "value", 2);
u([
  h({ attribute: !1 })
], l.prototype, "config", 2);
u([
  d()
], l.prototype, "_previewState", 2);
u([
  d()
], l.prototype, "_imageDimensions", 2);
u([
  d()
], l.prototype, "_editableField", 2);
l = u([
  T("catalyst-cdn-image-editor")
], l);
const v = 127462, y = 127487;
function C(e) {
  const t = Array.from(e);
  if (t.length !== 2) return !1;
  const a = t[0].codePointAt(0) ?? 0, i = t[1].codePointAt(0) ?? 0;
  return a >= v && a <= y && i >= v && i <= y;
}
function P(e) {
  return C(e.native) ? !0 : e.id.length === 2 && /^[a-z]{2}$/i.test(e.id);
}
const w = {
  frequent: "Frequently Used",
  people: "Smileys & People",
  nature: "Animals & Nature",
  foods: "Food & Drink",
  activity: "Activity",
  places: "Travel & Places",
  objects: "Objects",
  symbols: "Symbols",
  flags: "Flags"
}, j = {
  categories: [
    { id: "frequent", name: "Frequently Used", emojis: [] },
    { id: "people", name: "Smileys & People", emojis: ["grinning", "smiley", "smile", "grin", "sweat_smile", "joy", "rofl", "relaxed", "blush", "innocent", "slight_smile", "upside_down", "wink", "relieved", "heart_eyes", "kissing_heart", "kissing", "yum", "stuck_out_tongue", "zany", "raised_hands", "clap", "thumbsup", "wave", "pray"] },
    { id: "nature", name: "Animals & Nature", emojis: ["see_no_evil", "hear_no_evil", "speak_no_evil", "monkey_face", "dog", "cat", "rabbit", "fox", "bear", "panda", "lion", "tiger", "wolf", "pig", "cow", "boar", "unicorn", "dragon", "bee", "butterfly", "sunny", "cloud", "rainbow", "star", "fire", "snowflake", "cherry_blossom", "rose", "tulip", "tree", "leaf"] },
    { id: "foods", name: "Food & Drink", emojis: ["grape", "melon", "watermelon", "tangerine", "lemon", "banana", "apple", "pear", "peach", "cherries", "strawberry", "hamburger", "pizza", "taco", "burrito", "cake", "cookie", "chocolate_bar", "coffee", "tea", "beer", "champagne", "wine_glass"] },
    { id: "activity", name: "Activity", emojis: ["soccer", "basketball", "football", "baseball", "tennis", "golf", "running", "surfing", "swimming", "cycling", "weight_lifting", "dart", "bowling", "video_game", "slot_machine", "musical_score", "guitar", "drum", "saxophone", "trumpet", "art", "microphone", "headphones", "movie_camera"] },
    { id: "places", name: "Travel & Places", emojis: ["car", "taxi", "bus", "train", "airplane", "rocket", "bicycle", "house", "office", "hospital", "school", "hotel", "church", "stadium", "statue_of_liberty", "fountain", "mountain", "beach", "camping", "sunrise", "cityscape", "night_with_stars"] },
    { id: "objects", name: "Objects", emojis: ["bulb", "flashlight", "battery", "electric_plug", "computer", "keyboard", "desktop", "printer", "lock", "key", "wrench", "hammer", "gear", "scissors", "envelope", "email", "inbox_tray", "package", "calendar", "bookmark", "books", "notebook", "pencil2", "paintbrush", "crayon", "paperclip", "pushpin"] },
    { id: "symbols", name: "Symbols", emojis: ["heart", "orange_heart", "yellow_heart", "green_heart", "blue_heart", "purple_heart", "black_heart", "broken_heart", "star2", "sparkles", "zap", "checkmark", "cross", "question", "exclamation", "plus", "minus", "divide", "hash", "arrow_right", "arrow_left", "recycle", "tm", "copyright", "registered"] }
  ],
  emojis: {}
}, O = {
  grinning: "😀",
  smiley: "😃",
  smile: "😄",
  grin: "😁",
  sweat_smile: "😅",
  joy: "😂",
  rofl: "🤣",
  relaxed: "😌",
  blush: "😊",
  innocent: "😇",
  slight_smile: "🙂",
  upside_down: "🙃",
  wink: "😉",
  relieved: "😌",
  heart_eyes: "😍",
  kissing_heart: "😘",
  kissing: "😗",
  yum: "😋",
  stuck_out_tongue: "😛",
  zany: "🤪",
  raised_hands: "🙌",
  clap: "👏",
  thumbsup: "👍",
  wave: "👋",
  pray: "🙏",
  see_no_evil: "🙈",
  hear_no_evil: "🙉",
  speak_no_evil: "🙊",
  monkey_face: "🐵",
  dog: "🐕",
  cat: "🐱",
  rabbit: "🐰",
  fox: "🦊",
  bear: "🐻",
  panda: "🐼",
  lion: "🦁",
  tiger: "🐯",
  wolf: "🐺",
  pig: "🐷",
  cow: "🐮",
  boar: "🐗",
  unicorn: "🦄",
  dragon: "🐉",
  bee: "🐝",
  butterfly: "🦋",
  sunny: "☀️",
  cloud: "☁️",
  rainbow: "🌈",
  star: "⭐",
  fire: "🔥",
  snowflake: "❄️",
  cherry_blossom: "🌸",
  rose: "🌹",
  tulip: "🌷",
  tree: "🌳",
  leaf: "🍃",
  grape: "🍇",
  melon: "🍈",
  watermelon: "🍉",
  tangerine: "🍊",
  lemon: "🍋",
  banana: "🍌",
  apple: "🍎",
  pear: "🍐",
  peach: "🍑",
  cherries: "🍒",
  strawberry: "🍓",
  hamburger: "🍔",
  pizza: "🍕",
  taco: "🌮",
  burrito: "🌯",
  cake: "🍰",
  cookie: "🍪",
  chocolate_bar: "🍫",
  coffee: "☕",
  tea: "🍵",
  beer: "🍺",
  champagne: "🍾",
  wine_glass: "🍷",
  soccer: "⚽",
  basketball: "🏀",
  football: "🏈",
  baseball: "⚾",
  tennis: "🎾",
  golf: "⛳",
  running: "🏃",
  surfing: "🏄",
  swimming: "🏊",
  cycling: "🚴",
  weight_lifting: "🏋️",
  dart: "🎯",
  bowling: "🎳",
  video_game: "🎮",
  slot_machine: "🎰",
  musical_score: "🎼",
  guitar: "🎸",
  drum: "🥁",
  saxophone: "🎷",
  trumpet: "🎺",
  art: "🎨",
  microphone: "🎤",
  headphones: "🎧",
  movie_camera: "🎬",
  car: "🚗",
  taxi: "🚕",
  bus: "🚌",
  train: "🚂",
  airplane: "✈️",
  rocket: "🚀",
  bicycle: "🚲",
  house: "🏠",
  office: "🏢",
  hospital: "🏥",
  school: "🏫",
  hotel: "🏨",
  church: "⛪",
  stadium: "🏟️",
  statue_of_liberty: "🗽",
  fountain: "⛲",
  mountain: "⛰️",
  beach: "🏖️",
  camping: "🏕️",
  sunrise: "🌅",
  cityscape: "🏙️",
  night_with_stars: "🌃",
  bulb: "💡",
  flashlight: "🔦",
  battery: "🔋",
  electric_plug: "🔌",
  computer: "💻",
  keyboard: "⌨️",
  desktop: "🖥️",
  printer: "🖨️",
  lock: "🔒",
  key: "🔑",
  wrench: "🔧",
  hammer: "🔨",
  gear: "⚙️",
  scissors: "✂️",
  envelope: "✉️",
  email: "📧",
  inbox_tray: "📥",
  package: "📦",
  calendar: "📅",
  bookmark: "🔖",
  books: "📚",
  notebook: "📓",
  pencil2: "✏️",
  paintbrush: "🖌️",
  crayon: "🖍️",
  paperclip: "📎",
  pushpin: "📌",
  heart: "❤️",
  orange_heart: "🧡",
  yellow_heart: "💛",
  green_heart: "💚",
  blue_heart: "💙",
  purple_heart: "💜",
  black_heart: "🖤",
  broken_heart: "💔",
  star2: "🌟",
  sparkles: "✨",
  zap: "⚡",
  checkmark: "✔️",
  cross: "❌",
  question: "❓",
  exclamation: "❗",
  plus: "➕",
  minus: "➖",
  divide: "➗",
  hash: "#️⃣",
  arrow_right: "➡️",
  arrow_left: "⬅️",
  recycle: "♻️",
  tm: "™️",
  copyright: "©️",
  registered: "®️"
};
function D() {
  const e = {};
  for (const [t, a] of Object.entries(O))
    e[t] = { id: t, name: t.replace(/_/g, " "), native: a, keywords: [t] };
  return e;
}
const F = D();
j.emojis = F;
let _ = null;
function z(e) {
  var i, r, n;
  if (!((i = e == null ? void 0 : e.categories) != null && i.length) || !(e != null && e.emojis) || Object.keys(e.emojis).length === 0)
    return null;
  const t = [
    { id: "frequent", name: w.frequent, emojis: [] },
    ...e.categories.filter((s) => s.id !== "flags").map((s) => ({
      id: s.id,
      name: w[s.id] ?? s.id.replace(/_/g, " "),
      emojis: s.emojis || []
    }))
  ], a = {};
  for (const [s, p] of Object.entries(e.emojis)) {
    const f = ((n = (r = p.skins) == null ? void 0 : r[0]) == null ? void 0 : n.native) ?? "";
    if (!f) continue;
    const b = {
      id: p.id,
      name: p.name ?? s,
      native: f,
      keywords: p.keywords
    };
    P(b) || (a[s] = b);
  }
  return { categories: t, emojis: a };
}
async function R() {
  try {
    const e = "/App_Plugins/UmbracoCatalyst/dist/emoji-picker-data.json".replace(/\/{2,}/g, "/"), t = await fetch(e, { cache: "force-cache" });
    if (!t.ok) throw new Error(`HTTP ${t.status}`);
    const a = await t.json(), i = z(a);
    if (i) return i;
  } catch {
  }
  return j;
}
async function I() {
  return _ == null && (_ = R()), _;
}
function L() {
  I();
}
const M = "Catalyst.Modal.Tiptap.Emoji", V = "catalyst-tiptap-emoji-recent", B = 20, N = [
  {
    type: "tiptapToolbarExtension",
    kind: "button",
    alias: "Catalyst.Tiptap.Emoji.Toolbar",
    name: "Catalyst TipTap Emoji Toolbar Button",
    js: () => import("./emoji.tiptap-toolbar.js"),
    meta: {
      alias: "emoji",
      label: "Emoji",
      icon: "icon-smiley"
    }
  },
  {
    type: "modal",
    alias: M,
    name: "Emoji Picker Modal",
    element: () => import("./emoji-modal.element.js")
  }
];
L();
const J = [...N];
export {
  l as C,
  V as E,
  M as U,
  B as a,
  c as b,
  P as i,
  I as l,
  J as m,
  L as p
};
