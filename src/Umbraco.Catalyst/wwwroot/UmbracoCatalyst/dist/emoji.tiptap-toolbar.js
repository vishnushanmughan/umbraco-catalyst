import { UmbTiptapToolbarElementApiBase as i } from "@umbraco-cms/backoffice/tiptap";
import { UmbModalToken as r, UMB_MODAL_MANAGER_CONTEXT as s } from "@umbraco-cms/backoffice/modal";
import { U as m, p as c } from "./index.js";
const l = new r(
  m,
  { modal: { type: "dialog" } }
);
c();
class T extends i {
  async execute(o) {
    if (!o) return;
    const e = await this.getContext(s);
    if (!e) return;
    const n = e.open(this, l);
    if (!n) return;
    const t = await n.onSubmit().catch(() => {
    });
    if (t == null || t === "" || typeof t != "string") return;
    const a = String(t);
    setTimeout(() => {
      o.chain().focus().insertContent(a).run();
    }, 0);
  }
}
export {
  T as default
};
