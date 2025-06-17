import { colorToRgba, defaultColor } from "../utils/colors";

export function draw(event: MouseEvent, canvas: HTMLCanvasElement, element: HTMLDivElement, context, position: 'mouse' | 'point') {
  if (!canvas || !element) {
    console.warn('[AC Tooltip] Canvas or tooltip element not found.');
    return;
  };

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const datasets = Array.from(context.querySelectorAll('ac-data-set')) as any[];
  const numberOfValues = context.getNumberOfValues();
  const { min, max } = context.getGlobals();
  const labels = context.getLabels();

  const padding = { top: 20, bottom: 30, left: 40, right: 20 };
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const drawableWidth = width - padding.left - padding.right;
  const drawableHeight = height - padding.top - padding.bottom;

  const mouseX = (x - padding.left) / drawableWidth;
  const closestIndex = Math.round(mouseX * (numberOfValues - 1));

  if (closestIndex < 0 || closestIndex >= numberOfValues) {
    element.style.display = 'none';
    return;
  }

  const items: string[] = [`<div>${labels[closestIndex]}</div>`];
  let tooltipX = 0;
  let tooltipY = 0;
  let foundPoint = false;

  datasets.forEach((ds, i) => {
    const data: number[] = JSON.parse(ds.getAttribute('data') || '[]');
    const value = data[closestIndex];
    if (value == null) return;

    const label = ds.getAttribute('label') || `Dataset ${i + 1}`;
    const color = colorToRgba(ds.getAttribute('color')) ?? defaultColor(i);
    items.push(`<div><span style="color:${color};">●</span> ${label}: ${value}</div>`);

    // Only use the first valid point for tooltip position
    if (!foundPoint) {
      tooltipX = padding.left + (closestIndex / (numberOfValues - 1)) * drawableWidth;
      tooltipY = padding.top + drawableHeight * (1 - (value - min) / (max - min));
      foundPoint = true;
    }
  });

  if (position === 'mouse') {
    if (items.length) {
        element.innerHTML = items.join('');
        element.style.left = `${x + 10}px`;
        element.style.top = `${y + 10}px`;
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
      return;
    }

    if (items.length && foundPoint) {
      element.innerHTML = items.join('');
      element.style.left = `${tooltipX + 10}px`; // Position to the right of the point
      element.style.top = `${tooltipY - 30}px`;  // Above the point
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
  }