import { colorToRgba } from "../utils/colors";
import { getChartPadding } from "../utils/chart";

export default class LineChart extends HTMLElement {
  #color?: string;
  #tension: number = 0;
  #width: number = 2;

  connectedCallback() {
    this.#tension = parseFloat(this.getAttribute("tension") || '0');
    this.#width = parseFloat(this.getAttribute("width") ?? '') || 1;
    this.#color = this.getAttribute("color") || undefined;
  }

  static get observedAttributes() {
    return ['tension', 'color', 'width',];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    if (name === 'color') {
      this.#color = newValue || undefined;
    }

    if (name === 'tension') {
      this.#tension = parseFloat(this.getAttribute("tension") || '0');
    }

    if (name === 'width') {
      this.#width = parseFloat(this.getAttribute("width") ?? '') || 1;
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
const dataPoints = data.length;

// Calculate drawableWidth for all labels:
const padding = getChartPadding();
const drawableWidth = width - (padding.left + padding.right);
const drawableHeight = height - (padding.top + padding.bottom);

ctx.save();
ctx.translate(padding.left + 0.5, height - padding.bottom + 0.5);
ctx.scale(1, -1);

ctx.lineWidth = this.#width;

const range = globalMax - globalMin || 1;

const points = data.map((val, i) => {
  // X coordinate based on actual data index, scaled to fraction of total labels width:
  const x = (i / (totalPoints - 1)) * drawableWidth;
  const y = ((val - globalMin) / range) * drawableHeight;
  return { x, y };
});

// Draw lines and dots only for existing points (no stretching)
ctx.strokeStyle = colorToRgba(this.#color ?? color ?? 'black');
ctx.beginPath();
ctx.moveTo(points[0].x, points[0].y);

for (let i = 0; i < points.length - 1; i++) {
  // Bezier curve logic as before
  const p0 = points[i - 1] || points[i];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[i + 2] || p2;

  const tension = this.#tension;
  const cp1x = p1.x + ((p2.x - p0.x) * tension) / 6;
  const cp1y = p1.y + ((p2.y - p0.y) * tension) / 6;

  const cp2x = p2.x - ((p3.x - p1.x) * tension) / 6;
  const cp2y = p2.y - ((p3.y - p1.y) * tension) / 6;

  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
}

ctx.stroke();

ctx.fillStyle = colorToRgba(this.#color ?? color ?? 'black');
const dotRadius = 4;
points.forEach(({ x, y }) => {
  ctx.beginPath();
  ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
  ctx.fill();
});

ctx.restore();
  }
}
