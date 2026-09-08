import { css, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { state } from 'lit/decorators/state.js';
import { repeat } from 'lit/directives/repeat.js';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import type { EmojiDataSet, EmojiItem } from './emoji-data.js';
import { loadEmojiData, isFlagEmoji } from './emoji-data.js';
import { EMOJI_RECENT_STORAGE_KEY, EMOJI_RECENT_MAX } from './constants.js';

interface EmojiSection {
    id: string;
    name: string;
    emojis: EmojiItem[];
}

@customElement('umb-tiptap-emoji-modal')
export class UmbTiptapEmojiModalElement extends UmbModalBaseElement<Record<string, never>, string> {
    @state() private _emojiDataSet: EmojiDataSet | null = null;
    @state() private _loading = true;
    @state() private _searchQuery = '';
    @state() private _recentIds: string[] = [];

    private _boundHandleOutsideClick = (e: MouseEvent) => this._handleOutsideClick(e);

    override connectedCallback(): void {
        super.connectedCallback();
        this._loadRecent();
        this._loadData();
        setTimeout(() => document.addEventListener('mousedown', this._boundHandleOutsideClick, true), 0);
    }

    override disconnectedCallback(): void {
        document.removeEventListener('mousedown', this._boundHandleOutsideClick, true);
        super.disconnectedCallback();
    }

    private _handleOutsideClick(e: MouseEvent): void {
        const path = e.composedPath() as Node[];
        const layout = this.shadowRoot?.getElementById('emoji-popup-layout');
        if (layout && path.includes(layout)) return;
        this._rejectModal();
    }

    private _loadRecent(): void {
        try {
            const raw = localStorage.getItem(EMOJI_RECENT_STORAGE_KEY);
            if (raw) {
                const arr = JSON.parse(raw) as string[];
                this._recentIds = Array.isArray(arr) ? arr.slice(0, EMOJI_RECENT_MAX) : [];
            }
        } catch {
            this._recentIds = [];
        }
    }

    private async _loadData(): Promise<void> {
        this._loading = true;
        try {
            this._emojiDataSet = await loadEmojiData();
        } finally {
            this._loading = false;
        }
    }

    /** Sections in order: recent (if any), then each data category (skip frequent). */
    private _getSections(): EmojiSection[] {
        if (!this._emojiDataSet) return [];
        const { categories, emojis } = this._emojiDataSet;
        const out: EmojiSection[] = [];
        const recent = this._getRecentEmojis();
        if (recent.length > 0) {
            out.push({ id: 'recent', name: 'Recently used', emojis: recent });
        }
        for (const cat of categories) {
            if (cat.id === 'frequent' || cat.id === 'flags') continue;
            const list = cat.emojis
                .map((id) => emojis[id])
                .filter((e): e is EmojiItem => !!e && !isFlagEmoji(e));
            if (list.length > 0) {
                out.push({ id: cat.id, name: cat.name, emojis: list });
            }
        }
        return out;
    }

    /** Flat list when searching. */
    private _getFilteredEmojis(): EmojiItem[] {
        if (!this._emojiDataSet) return [];
        const q = this._searchQuery.trim().toLowerCase();
        if (!q) return [];
        const emojis = this._emojiDataSet.emojis;
        const ids = Object.keys(emojis).filter((id) => {
            const item = emojis[id];
            if (!item) return false;
            const name = (item.name || '').toLowerCase();
            const keywords = (item.keywords || []).join(' ').toLowerCase();
            const shortcodes = (item.shortcodes || []).join(' ').toLowerCase();
            return name.includes(q) || keywords.includes(q) || shortcodes.includes(q) || id.toLowerCase().includes(q);
        });
        return ids
            .map((id) => emojis[id])
            .filter((e): e is EmojiItem => !!e && !isFlagEmoji(e));
    }

    private _getRecentEmojis(): EmojiItem[] {
        if (!this._emojiDataSet || this._recentIds.length === 0) return [];
        const emojis = this._emojiDataSet.emojis;
        return this._recentIds
            .map((id) => emojis[id])
            .filter((e): e is EmojiItem => !!e && !isFlagEmoji(e));
    }

    private _onSelect(emoji: EmojiItem): void {
        const char = emoji.native;
        this.value = char;
        this.modalContext?.setValue(char);
        this._addToRecent(emoji.id);
        this._submitModal();
    }

    private _addToRecent(id: string): void {
        let list = [...this._recentIds];
        list = list.filter((x) => x !== id);
        list.unshift(id);
        list = list.slice(0, EMOJI_RECENT_MAX);
        this._recentIds = list;
        try {
            localStorage.setItem(EMOJI_RECENT_STORAGE_KEY, JSON.stringify(list));
        } catch {
            /**/
        }
    }

    private _onSearchInput(e: Event): void {
        const input = e.target as HTMLInputElement;
        this._searchQuery = input?.value ?? '';
    }

    /** Unicode only — no images or CDN URLs. */
    private _renderEmojiChar(emoji: EmojiItem): ReturnType<typeof html> {
        return html`<span class="emoji-char" title=${emoji.name}>${emoji.native}</span>`;
    }

    override render(): ReturnType<typeof html> {
        const sections = this._getSections();
        const filteredEmojis = this._getFilteredEmojis();
        const searching = this._searchQuery.trim().length > 0;

        return html`
            <umb-body-layout id="emoji-popup-layout" headline="">
                <div id="emoji-picker">
                    <div class="search-row">
                        <uui-input
                            class="search-input"
                            type="search"
                            placeholder="Search"
                            .value=${this._searchQuery}
                            @input=${this._onSearchInput}
                            label="Search">
                            <div slot="prepend">
                                <uui-icon name="search"></uui-icon>
                            </div>
                        </uui-input>
                    </div>
                    ${this._loading
                        ? html`<div class="loading">Loading</div>`
                        : searching
                          ? html`
                                <div class="scroll-wrap">
                                    <div class="emojis-grid emojis-grid-all">
                                        ${filteredEmojis.length === 0
                                            ? html`<p class="empty">No matches.</p>`
                                            : repeat(
                                                  filteredEmojis,
                                                  (e: EmojiItem) => e.id,
                                                  (emoji: EmojiItem) => html`
                                                      <button
                                                          type="button"
                                                          class="emoji-btn"
                                                          title=${emoji.name}
                                                          @click=${() => this._onSelect(emoji)}>
                                                          ${this._renderEmojiChar(emoji)}
                                                      </button>
                                                  `
                                              )}
                                    </div>
                                </div>
                            `
                          : html`
                                <div class="scroll-wrap">
                                    ${repeat(
                                        sections,
                                        (s) => s.id,
                                        (sec) => html`
                                            <section
                                                class="emoji-section"
                                                data-section-id=${sec.id}
                                                aria-labelledby="sec-label-${sec.id}">
                                                <h4 class="section-title" id="sec-label-${sec.id}">${sec.name}</h4>
                                                <div class="emojis-grid">
                                                    ${repeat(
                                                        sec.emojis,
                                                        (e: EmojiItem) => e.id,
                                                        (emoji: EmojiItem) => html`
                                                            <button
                                                                type="button"
                                                                class="emoji-btn"
                                                                title=${emoji.name}
                                                                @click=${() => this._onSelect(emoji)}>
                                                                ${this._renderEmojiChar(emoji)}
                                                            </button>
                                                        `
                                                    )}
                                                </div>
                                            </section>
                                        `
                                    )}
                                </div>
                            `}
                </div>
            </umb-body-layout>
        `;
    }

    static styles = [
        css`
            :host {
                --umb-body-layout-color-background: var(--uui-color-surface, #f5f5f5);
            }
            #emoji-picker {
                display: flex;
                flex-direction: column;
                gap: 0;
                width: 300px;
                max-width: 300px;
                height: 240px;
                max-height: 240px;
                min-height: 240px;
                border-radius: 0;
                overflow: hidden;
            }
            .search-row {
                flex-shrink: 0;
                width: 100%;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                z-index: 1;
            }
            .search-row uui-input {
                width: 100%;
            }
            .loading {
                padding: 1rem;
                text-align: center;
                color: var(--uui-color-text-alt, #666);
            }
            .scroll-wrap {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 4px 4px 8px 0;
            }
            .scroll-wrap::-webkit-scrollbar {
                width: 5px;
            }
            .scroll-wrap::-webkit-scrollbar-thumb {
                background: var(--uui-color-border, #ccc);
                border-radius: 0;
            }
            .emoji-section {
                scroll-margin-top: 4px;
            }
            .section-title {
                margin: 8px 4px 4px;
                padding: 0;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.03em;
                color: var(--uui-color-text-alt, #666);
            }
            .emojis-grid {
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                gap: 2px;
                border-radius: 0;
            }
            .emojis-grid-all {
                padding-bottom: 6px;
            }
            .emoji-btn {
                width: 32px;
                height: 32px;
                padding: 0;
                border: none;
                border-radius: 0;
                background: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.12s ease;
            }
            .emoji-char {
                font-size: 22px;
                line-height: 1;
                font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', sans-serif;
            }
            .emoji-btn:hover {
                background: var(--uui-color-surface-emphasis, rgba(0, 0, 0, 0.06));
            }
            .empty {
                color: var(--uui-color-text-alt, #666);
                margin: 0.5rem 0;
                grid-column: 1 / -1;
            }
        `,
    ];
}

export { UmbTiptapEmojiModalElement as element };
export default UmbTiptapEmojiModalElement;

declare global {
    interface HTMLElementTagNameMap {
        'umb-tiptap-emoji-modal': UmbTiptapEmojiModalElement;
    }
}
