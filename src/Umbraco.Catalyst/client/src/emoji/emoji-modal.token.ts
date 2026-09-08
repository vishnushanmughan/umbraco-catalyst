import { UmbModalToken } from '@umbraco-cms/backoffice/modal';
import { UMB_TIPTAP_EMOJI_MODAL_ALIAS } from './constants.js';

export type UmbTiptapEmojiModalData = Record<string, never>;
export type UmbTiptapEmojiModalValue = string;

export const UMB_TIPTAP_EMOJI_MODAL = new UmbModalToken<UmbTiptapEmojiModalData, UmbTiptapEmojiModalValue>(
    UMB_TIPTAP_EMOJI_MODAL_ALIAS,
    { modal: { type: 'dialog' } }
);
