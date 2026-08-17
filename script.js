// ---- Dados dos boxplots (estatísticas resumo: min, q1, mediana, q3, max) ----
const dataTrans = {
  0: { min: 11, q1: 54, median: 71, q3: 82, max: 139 },
  1: { min: 10, q1: 37, median: 43, q3: 51, max: 94 }
};

const dataInact = {
  0: { min: 0, q1: 1, median: 2, q3: 3, max: 6 },
  1: { min: 0, q1: 2, median: 3, q3: 3, max: 6 }
};

// ---- Função de desenho de um boxplot em SVG ----
function drawBox(svgId, data, xMaxDomain, unitLabel) {
  const svg = document.getElementById(svgId);
  const W = svgId === 'box1' ? 460 : 380, H = 220;
  const padL = 50, padR = 20, padT = 20, padB = 36;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const scale = v => padL + (v / xMaxDomain) * plotW;
  const colors = { 0: '#FF7A00', 1: '#F5F5F5' };
  const labels = { 0: 'Ativo (0)', 1: 'Churn (1)' };
  const svgns = "http://www.w3.org/2000/svg";

  function el(tag, attrs) {
    const e = document.createElementNS(svgns, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  // Eixo
  const axis = el('line', { x1: padL, y1: padT + plotH, x2: padL + plotW, y2: padT + plotH, stroke: '#2A3B57', 'stroke-width': 1 });
  svg.appendChild(axis);

  [0, xMaxDomain / 2, xMaxDomain].forEach(v => {
    const x = scale(v);
    const t = el('text', { x: x, y: padT + plotH + 16, 'text-anchor': 'middle', class: 'axis-label' });
    t.textContent = Math.round(v);
    svg.appendChild(t);
  });

  const axisLabel = el('text', { x: padL + plotW / 2, y: H - 4, 'text-anchor': 'middle', class: 'axis-label' });
  axisLabel.textContent = unitLabel;
  svg.appendChild(axisLabel);

  const groups = [0, 1];
  const rowH = plotH / groups.length;

  groups.forEach((g, i) => {
    const d = data[g];
    const cy = padT + rowH * i + rowH / 2;
    const boxH = 22;
    const color = colors[g];

    // Whiskers
    svg.appendChild(el('line', { x1: scale(d.min), y1: cy, x2: scale(d.q1), y2: cy, stroke: color, 'stroke-width': 1.5 }));
    svg.appendChild(el('line', { x1: scale(d.q3), y1: cy, x2: scale(d.max), y2: cy, stroke: color, 'stroke-width': 1.5 }));
    svg.appendChild(el('line', { x1: scale(d.min), y1: cy - 6, x2: scale(d.min), y2: cy + 6, stroke: color, 'stroke-width': 1.5 }));
    svg.appendChild(el('line', { x1: scale(d.max), y1: cy - 6, x2: scale(d.max), y2: cy + 6, stroke: color, 'stroke-width': 1.5 }));

    // Caixa
    svg.appendChild(el('rect', { x: scale(d.q1), y: cy - boxH / 2, width: scale(d.q3) - scale(d.q1), height: boxH, fill: color, opacity: 0.22, stroke: color, 'stroke-width': 1.5, rx: 3 }));

    // Mediana
    svg.appendChild(el('line', { x1: scale(d.median), y1: cy - boxH / 2, x2: scale(d.median), y2: cy + boxH / 2, stroke: color, 'stroke-width': 2 }));

    // Rótulo
    const lbl = el('text', { x: 8, y: cy + 4, class: 'box-title' });
    lbl.textContent = labels[g];
    lbl.setAttribute('fill', color);
    svg.appendChild(lbl);
  });
}

// ---- Renderização dos gráficos ----
drawBox('box1', dataTrans, 150, 'Total de transações no ano');
drawBox('box2', dataInact, 7, 'Meses inativos');
