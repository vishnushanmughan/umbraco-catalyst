import { UmbTiptapToolbarElementApiBase } from '@umbraco-cms/backoffice/tiptap';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { prefetchEmojiData } from './emoji-data.js';
import { UMB_TIPTAP_EMOJI_MODAL } from './emoji-modal.token.js';

/** Toolbar chunk may load after the main manifest; prefetch again (same cached promise). */
void prefetchEmojiData();

export default class EmojiToolbarExtension extends UmbTiptapToolbarElementApiBase {
    override async execute(editor?: import('@tiptap/core').Editor): Promise<void> {
        if (!editor) return;
        const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
        if (!modalManager) return;
        const modal = modalManager.open(this, UMB_TIPTAP_EMOJI_MODAL);
        if (!modal) return;
        const value = await modal.onSubmit().catch(() => undefined);
        if (value == null || value === '' || typeof value !== 'string') return;
        const text = String(value);
        setTimeout(() => {
            editor.chain().focus().insertContent(text).run();
        }, 0);
    }
}
