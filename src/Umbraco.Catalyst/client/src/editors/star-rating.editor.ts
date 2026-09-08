import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import type {
  UmbPropertyEditorUiElement,
  UmbPropertyEditorConfigCollection,
} from "@umbraco-cms/backoffice/property-editor";
import { css, customElement, html, property, state } from "@umbraco-cms/backoffice/external/lit";

interface StarRatingData {
  rating: number;
  maxStars: number;
  allowHalfStars: boolean;
}

@customElement("catalyst-star-rating-editor")
export class CatalystStarRatingEditor extends UmbLitElement implements UmbPropertyEditorUiElement {
  @property({ type: Object })
  public value: StarRatingData | undefined;

  @property({ attribute: false })
  public config: UmbPropertyEditorConfigCollection | undefined;

  @state() private _hoverRating = 0;

  private get _maxStars(): number {
    return this.config?.getValueByAlias<number>("maxStars") ?? 5;
  }

  private get _allowHalfStars(): boolean {
    return this.config?.getValueByAlias<boolean>("allowHalfStars") ?? true;
  }

  private get _currentRating(): number {
    return this.value?.rating ?? 0;
  }

  private _onStarClick(starIndex: number, isHalf: boolean) {
    const rating = isHalf ? starIndex - 0.5 : starIndex;
    this.value = {
      rating,
      maxStars: this._maxStars,
      allowHalfStars: this._allowHalfStars,
    };
    this.dispatchEvent(new UmbChangeEvent());
  }

  private _onStarHover(starIndex: number, isHalf: boolean) {
    this._hoverRating = isHalf ? starIndex - 0.5 : starIndex;
  }

  private _onMouseLeave() {
    this._hoverRating = 0;
  }

  private _getStarState(index: number): "full" | "half" | "empty" {
    const rating = this._hoverRating || this._currentRating;
    if (index <= Math.floor(rating)) return "full";
    if (index === Math.ceil(rating) && rating % 1 !== 0) return "half";
    return "empty";
  }

  override render() {
    const stars = Array.from({ length: this._maxStars }, (_, i) => i + 1);
    return html`
      <div
        class="catalyst-star-rating"
        @mouseleave=${this._onMouseLeave}
        aria-label="Star rating editor"
      >
        ${stars.map(
          (i) => html`
            <span class="star star--${this._getStarState(i)}">
              ${this._allowHalfStars
                ? html`
                    <span
                      class="half-zone left"
                      @click=${() => this._onStarClick(i, true)}
                      @mouseover=${() => this._onStarHover(i, true)}
                    >
                    </span>
                    <span
                      class="half-zone right"
                      @click=${() => this._onStarClick(i, false)}
                      @mouseover=${() => this._onStarHover(i, false)}
                    >
                    </span>
                  `
                : html`
                    <span
                      class="full-zone"
                      @click=${() => this._onStarClick(i, false)}
                      @mouseover=${() => this._onStarHover(i, false)}
                    >
                    </span>
                  `}
              ★
            </span>
          `,
        )}
        <span class="label">
          ${this._currentRating > 0
            ? html`${this._currentRating} / ${this._maxStars}`
            : html`<span class="no-rating">No rating set</span>`}
        </span>
      </div>
    `;
  }

  static override readonly styles = css`
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
}

declare global {
  interface HTMLElementTagNameMap {
    "catalyst-star-rating-editor": CatalystStarRatingEditor;
  }
}
