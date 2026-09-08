import { UMB_TIPTAP_EMOJI_MODAL_ALIAS } from "./constants.js";

export const emojiManifests = [
  {
    type: "tiptapToolbarExtension",
    kind: "button",
    alias: "Catalyst.Tiptap.Emoji.Toolbar",
    name: "Catalyst TipTap Emoji Toolbar Button",
    js: () => import("./emoji.tiptap-toolbar"),
    meta: {
      alias: "emoji",
      label: "Emoji",
      icon: "icon-smiley",
    },
  },
  {
    type: "modal",
    alias: UMB_TIPTAP_EMOJI_MODAL_ALIAS,
    name: "Emoji Picker Modal",
    element: () => import("./emoji-modal.element"),
  },
] as const;
