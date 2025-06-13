export function drawScale(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  min: number,
  max: number,
  includeZero = false // new optional parameter to include zero in scale
) {

  const padding = getChartPadding();
  const drawableHeight = height - (padding.top + padding.bottom);

  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  // Include zero in the range if requested
  if (includeZero) {
    if (min > 0) min = 0;
    if (max < 0) max = 0;
  }

  const range = max - min;
  if (range === 0) return;
  const approxSteps = 10;
  let rawStep = range / approxSteps;
  const pow10 = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const digit = rawStep / pow10;

  let niceDigit;
  if (digit <= 1) niceDigit = 1;
  else if (digit <= 2) niceDigit = 2;
  else if (digit <= 4) niceDigit = 5;
  else niceDigit = 10;

  const step = niceDigit * pow10;
  
  // Calculate nice rounded start and end values
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;

  const scaleValues = new Set<number>();

  for (let val = start; val <= end + step / 2; val += step) {
    scaleValues.add(Number(val.toFixed(10)));
  }

  const sortedValues: number[] = Array.from(scaleValues).sort((a, b) => b - a);

  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#666666';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  const textMargin = 5;

  const valueToY = (val: number) => {
    return padding.top + ((end - val) / (end - start)) * drawableHeight;
  };

  ctx.strokeStyle = '#e5e5e5';
  ctx.lineWidth = 1;

  sortedValues.forEach(val => {
    const y = Math.round(valueToY(val)) + 0.5;

    // Draw horizontal grid line
    ctx.beginPath();
    ctx.moveTo(padding.left + 0.5, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    // Draw label text
    ctx.fillText(
      val.toFixed(Number.isInteger(step) ? 0 : 1),
      padding.left - textMargin,
      y
    );
  });

  const lineX = padding.left + 0.5;


  // Draw vertical line at the left edge of the chart
  ctx.beginPath();
  ctx.moveTo(lineX, padding.top);
  ctx.lineTo(lineX, height - padding.bottom);
  ctx.stroke();

  // Draw horizontal line at the top of the chart
  ctx.beginPath();
  ctx.moveTo(width - padding.right, padding.top);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.stroke();
}


export function drawBottomScale(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  labels: string[],
  centerLabels: boolean = true
) {
  const padding = getChartPadding();
  const usableWidth = width - padding.left - padding.right;
  const labelAreaHeight = 10;

  const numLabels = labels.length;
  const numTicks = numLabels - 1;
  ctx.fillStyle = '#666';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.lineWidth = 1;

  if (centerLabels) {
    // Calculate segment width between labels (like bar width + spacing)
    const segmentWidth = usableWidth / numLabels;

    for (let i = 0; i < numLabels; i++) {
      // x is center of each segment
      const x = padding.left + segmentWidth * (i + 0.5);

      // draw vertical grid line at tick positions (between labels)
      if (i < numTicks) {
        const tickX = padding.left + segmentWidth * (i + 1);
        ctx.strokeStyle = '#e5e5e5';
        ctx.beginPath();
        ctx.moveTo(tickX, padding.top);
        ctx.lineTo(tickX, height - labelAreaHeight - 20);
        ctx.stroke();
      }

      ctx.fillText(labels[i], x, height - labelAreaHeight - 10);
    }
  } else {
    // Original behavior: labels aligned directly with ticks
    for (let i = 0; i <= numTicks; i++) {
      const x = padding.left + (usableWidth / numTicks) * i;

      ctx.strokeStyle = '#e5e5e5';
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - labelAreaHeight - 20);
      ctx.stroke();

      ctx.fillText(labels[i], x, height - labelAreaHeight - 10);
    }
  }
}


export function getChartPadding(extraPadding?: Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>) {
  const basePadding = { top: 10, right: 20, bottom: 30, left: 50 };

  return {
    top: basePadding.top + (extraPadding?.top ?? 0),
    right: basePadding.right + (extraPadding?.right ?? 0),
    bottom: basePadding.bottom + (extraPadding?.bottom ?? 0),
    left: basePadding.left + (extraPadding?.left ?? 0),
  };
}
