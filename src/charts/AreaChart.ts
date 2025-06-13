import { getChartPadding } from "../utils/chart";

export default class LineChart extends HTMLElement {
  draw(ctx: CanvasRenderingContext2D, width: number, height: number, data: number[], globalMin: number, globalMax: number) {
  const padding = getChartPadding();
  const drawableWidth = width - padding.left - padding.right;
  const drawableHeight = height - padding.top - padding.bottom;

  ctx.save();
  ctx.translate(padding.left, height - padding.bottom); // move origin to padded corner
  ctx.scale(1, -1); // flip vertically

  const range = globalMax - globalMin || 1;
  ctx.strokeStyle = "rgba(46, 204, 113, 0.9)";
  ctx.lineWidth = 1;

  const gap = 10;
  const barCount = data.length;
  const totalGap = gap * (barCount - 1);
  const barWidth = (drawableWidth - totalGap) / barCount;

  const points: { x: number, y: number }[] = data.map((val, i) => {
    const x = i * (barWidth + gap) + barWidth / 2;
    const y = ((val - globalMin) / range) * drawableHeight;
    return { x, y };
  });

  const gradient = ctx.createLinearGradient(0, 0, 0, drawableHeight);
  gradient.addColorStop(0, "rgba(46, 204, 113, 0)");
  gradient.addColorStop(1, "rgba(46, 204, 113, 0.4)");
  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.moveTo(points[0].x, 0);
  for (const point of points) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.lineTo(points[points.length - 1].x, 0);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();

  ctx.restore();
}

}