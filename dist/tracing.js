const stops = 24;
const tolerance = 34;

function sample(path) {
  const length = path.getTotalLength();
  return Array.from({ length: stops + 1 }, (_, i) => path.getPointAtLength(length * i / stops));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function setupTracing(svg, startIndex, onStroke) {
  const paths = [...svg.querySelectorAll('.trace-path')];
  const startDot = svg.querySelector('.trace-start');
  const samples = paths.map(sample);
  let index = startIndex;
  let cursor = 0;
  let pointer = null;

  function showStroke() {
    paths.forEach((path, i) => {
      path.classList.toggle('inked', i < index);
      path.classList.toggle('active', i === index);
      path.style.removeProperty('--draw');
    });
    const start = samples[index]?.[0];
    startDot.style.display = start ? '' : 'none';
    if (start) {
      startDot.setAttribute('cx', start.x);
      startDot.setAttribute('cy', start.y);
    }
  }

  function finishStroke() {
    if (index === paths.length) return;
    index++;
    cursor = 0;
    pointer = null;
    showStroke();
    onStroke(index);
  }

  function point(event) {
    const inverse = svg.getScreenCTM()?.inverse();
    return inverse ? new DOMPoint(event.clientX, event.clientY).matrixTransform(inverse) : null;
  }

  svg.addEventListener('pointerdown', (event) => {
    if (pointer !== null || index === paths.length || event.button !== 0) return;
    const p = point(event);
    if (!p || distance(p, samples[index][0]) > tolerance) return;
    event.preventDefault();
    cursor = 0;
    pointer = event.pointerId;
    svg.setPointerCapture(pointer);
  });

  svg.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointer) return;
    const p = point(event);
    if (!p) return;
    const points = samples[index];
    // Check a small forward window so a child must follow a bend, not just touch the end.
    for (let i = cursor + 1; i <= Math.min(stops, cursor + 7); i++) {
      if (distance(p, points[i]) < tolerance) cursor = i;
      else break;
    }
    paths[index].style.setProperty('--draw', cursor / stops);
    if (cursor >= stops - 1 && distance(p, points[stops]) < 24) finishStroke();
  });

  function release(event) {
    if (event.pointerId !== pointer) return;
    cursor = 0;
    pointer = null;
    paths[index]?.style.removeProperty('--draw');
  }
  svg.addEventListener('pointerup', release);
  svg.addEventListener('pointercancel', release);
  svg.addEventListener('lostpointercapture', release);
  showStroke();

  return () => {
    const path = paths[index];
    if (!path || pointer !== null) return;
    path.classList.add('demo');
    finishStroke();
  };
}
