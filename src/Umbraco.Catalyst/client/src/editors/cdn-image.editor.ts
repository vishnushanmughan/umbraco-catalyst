import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import type {
  UmbPropertyEditorUiElement,
  UmbPropertyEditorConfigCollection,
} from "@umbraco-cms/backoffice/property-editor";
import { css, customElement, html, property, state } from "@umbraco-cms/backoffice/external/lit";

interface CdnImageData {
  url: string;
  altText: string;
}

type PreviewState = "empty" | "loading" | "loaded" | "error";
type EditableField = "url" | "altText" | null;

@customElement("catalyst-cdn-image-editor")
export class CatalystCdnImageEditor extends UmbLitElement implements UmbPropertyEditorUiElement {
  @property({ type: Object }) public value: CdnImageData | string | undefined;
  @property({ attribute: false }) public config: UmbPropertyEditorConfigCollection | undefined;

  @state() private _previewState: PreviewState = "empty";
  @state() private _imageDimensions = "";
  @state() private _editableField: EditableField = null;

  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _lastPreviewUrl = "";

  private get _requireAltText(): boolean {
    return this.config?.getValueByAlias<boolean>("requireAltText") ?? true;
  }

  private get _imageValue(): CdnImageData {
    if (typeof this.value === "object" && this.value !== null) {
      return this.value;
    }

    if (typeof this.value === "string") {
      try {
        const parsed = JSON.parse(this.value) as Partial<CdnImageData>;
        return {
          url: parsed.url ?? "",
          altText: parsed.altText ?? "",
        };
      } catch {
        return { url: this.value, altText: "" };
      }
    }

    return { url: "", altText: "" };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("pointerdown", this._onDocumentPointerDown, true);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("pointerdown", this._onDocumentPointerDown, true);
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    super.disconnectedCallback();
  }

  protected override updated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has("value")) {
      this._loadPreview(this._imageValue.url);
    }
  }

  private _onDocumentPointerDown = (event: PointerEvent) => {
    if (this._editableField && !event.composedPath().includes(this)) {
      this._editableField = null;
    }
  };

  private _setEditableField(field: EditableField) {
    this._editableField = field;
  }

  private _onAreaFocusOut(event: FocusEvent) {
    const nextTarget = event.relatedTarget as Node | null;
    const area = event.currentTarget;
    if (nextTarget && area instanceof HTMLElement && area.contains(nextTarget)) {
      return;
    }

    this._editableField = null;
  }

  private _onUrlInput(event: InputEvent) {
    const url = (event.target as HTMLInputElement).value;
    this.value = { url, altText: this._imageValue.altText };
    this.dispatchEvent(new UmbChangeEvent());
    this._loadPreview(url);
  }

  private _onAltInput(event: InputEvent) {
    const altText = (event.target as HTMLInputElement).value;
    this.value = { url: this._imageValue.url, altText };
    this.dispatchEvent(new UmbChangeEvent());
  }

  private _loadPreview(url: string) {
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    this._lastPreviewUrl = url;
    this._imageDimensions = "";

    if (!url) {
      this._previewState = "empty";
      return;
    }

    this._debounceTimer = setTimeout(() => {
      this._previewState = "loading";
      const image = new Image();
      image.onload = () => {
        if (this._lastPreviewUrl !== url) return;
        this._previewState = "loaded";
        this._imageDimensions = `${image.naturalWidth} x ${image.naturalHeight}`;
      };
      image.onerror = () => {
        if (this._lastPreviewUrl !== url) return;
        this._previewState = "error";
      };
      image.src = url;
    }, 500);
  }

  private _onClear() {
    this.value = { url: "", altText: "" };
    this._editableField = null;
    this._previewState = "empty";
    this._imageDimensions = "";
    this.dispatchEvent(new UmbChangeEvent());
  }

  override render() {
    const imageValue = this._imageValue;
    const urlLocked = imageValue.url.length > 0 && this._editableField !== "url";
    const altTextLocked = imageValue.altText.length > 0 && this._editableField !== "altText";

    return html`
      <div class="catalyst-cdn-image" @focusout=${this._onAreaFocusOut}>
        <uui-input
          class="grid-url"
          label="Image URL"
          placeholder="https://cdn.example.com/image.jpg"
          .value=${imageValue.url}
          ?readonly=${urlLocked}
          @focus=${() => {
            if (!imageValue.url) this._setEditableField("url");
          }}
          @input=${this._onUrlInput}
        >
          ${imageValue.url
            ? html`<uui-button
                slot="append"
                compact
                label="Edit image URL"
                @click=${() => this._setEditableField("url")}
                ><uui-icon name="edit"></uui-icon
              ></uui-button>`
            : ""}
        </uui-input>

        <uui-input
          class="grid-alt"
          label="Alt text"
          placeholder=${this._requireAltText ? "Alt text" : "Alt text (optional)"}
          .value=${imageValue.altText}
          ?readonly=${altTextLocked}
          @focus=${() => {
            if (!imageValue.altText) this._setEditableField("altText");
          }}
          @input=${this._onAltInput}
        >
          ${imageValue.altText
            ? html`<uui-button
                slot="append"
                compact
                label="Edit alt text"
                @click=${() => this._setEditableField("altText")}
                ><uui-icon name="edit"></uui-icon
              ></uui-button>`
            : ""}
        </uui-input>

        <div class="grid-actions">
          ${this._imageDimensions ? html`<small class="grid-pixels">${this._imageDimensions}</small>` : ""}
        </div>

        <div class="preview grid-preview">
          ${this._previewState === "loaded" && imageValue.url
            ? html`<img src=${imageValue.url} alt=${imageValue.altText} />`
            : this._previewState === "loading"
              ? html`<span>Loading preview...</span>`
              : this._previewState === "error"
                ? html`<span class="error">Could not load image</span>`
                : html`<span class="empty">No image set</span>`}
        </div>
      </div>
    `;
  }

  static override readonly styles = css`
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
}

declare global {
  interface HTMLElementTagNameMap {
    "catalyst-cdn-image-editor": CatalystCdnImageEditor;
  }
}
