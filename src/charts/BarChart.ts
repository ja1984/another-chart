import { colorToRgba } from "../utils/colors";
import { getChartPadding } from "../utils/chart";

export default class BarChart extends HTMLElement {
  #color?: string;
  #width: string = 'auto';
  #space: number | undefined = 10;

  connectedCallback() {
    this.#width = this.getAttribute("width") ?? 'auto';
    this.#color = this.getAttribute("color") || undefined;
    this.#space = parseFloat(this.getAttribute("space") || '10');
  }

  static get observedAttributes() {
    return ['color', 'bar-width'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    if (name === 'color') {
      this.#color = newValue || undefined;
    }

    if (name === 'bar-width') {
      this.#width = newValue ?? 'auto';
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: number[],
    globalMin: number,
    globalMax: number,
    totalLabels: number,
    color?: string,
  ) {
    const totalPoints = totalLabels ?? data.length;

    const padding = getChartPadding();
    const drawableWidth = width - (padding.left + padding.right);
    const drawableHeight = height - (padding.top + padding.bottom);

    const range = globalMax - globalMin || 1;

    ctx.save();
    ctx.translate(padding.left + 0.5, height - padding.bottom + 0.5);
    ctx.scale(1, -1);

    const barSpacing = drawableWidth / totalPoints;
    const space = this.#width !== 'auto' ? 0 : this.#space ?? 0;
    const barWidth = this.#width === 'auto'
      ? barSpacing - space
      : Math.min(parseFloat(this.#width), barSpacing - space);

    ctx.fillStyle = colorToRgba(this.#color ?? color ?? 'black');

    data.forEach((val, i) => {
      const x = i * barSpacing + (barSpacing - barWidth) / 2;
      const y = ((val - globalMin) / range) * drawableHeight;
      ctx.fillRect(x, 0, barWidth, y);

      // Dispatch click area (note: reverse the scale Y again)
      this.dispatchEvent(new CustomEvent('register-click-area', {
        detail: {
          x: x + padding.left,
          y: height - padding.bottom - y,
          width: barWidth,
          height: y,
          value: val,
        },
        bubbles: true,
        composed: true
      }));
    });

    ctx.restore();
  }
}
