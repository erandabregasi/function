const biomarkers = [
  { key: "apob", label: "ApoB", unit: "mg/dL", better: "down", color: "#147a72", range: [60, 145], target: 80 },
  { key: "insulin", label: "Fasting insulin", unit: "uIU/mL", better: "down", color: "#d8664f", range: [4, 19], target: 7 },
  { key: "crp", label: "hs-CRP", unit: "mg/L", better: "down", color: "#376fa8", range: [0.3, 5.2], target: 1 },
  { key: "alt", label: "ALT", unit: "U/L", better: "down", color: "#b7791f", range: [12, 58], target: 23 },
  { key: "omega", label: "Omega-3 index", unit: "%", better: "up", color: "#2f7d4d", range: [3.5, 9.5], target: 8 }
];

const levers = [
  { key: "lipid", label: "Lipid clinician pathway", color: "#147a72" },
  { key: "metabolic", label: "Metabolic pathway", color: "#d8664f" },
  { key: "training", label: "Strength training", color: "#376fa8" },
  { key: "recovery", label: "Sleep + alcohol reset", color: "#b7791f" },
  { key: "nutrition", label: "Omega-3 + nutrition", color: "#2f7d4d" },
  { key: "adherence", label: "Adherence confidence", color: "#17201d" }
];

const objectives = [
  { key: "best", label: "Best overall", short: "Overall" },
  { key: "lowBurden", label: "Lowest burden", short: "Easy" },
  { key: "noMeds", label: "No-med path", short: "No meds" },
  { key: "cardio", label: "Fast ApoB drop", short: "ApoB" },
  { key: "metabolic", label: "Metabolic reset", short: "Metabolic" },
  { key: "aggressive", label: "Maximum change", short: "Max" }
];

const members = [
  {
    id: "M-1042",
    name: "Metabolic ApoB riser",
    age: 46,
    sex: "Female",
    tags: ["ApoB rising", "insulin high", "ALT drift"],
    values: {
      apob: [86, 94, 103, 112],
      insulin: [9.5, 11.2, 13.5, 16.1],
      crp: [1.3, 1.6, 2.1, 2.4],
      alt: [20, 24, 29, 34],
      omega: [5.2, 5.0, 4.8, 4.6]
    },
    latent: { lipid: 0.74, metabolic: 0.93, inflammatory: 0.42, liver: 0.58, recovery: 0.34 }
  },
  {
    id: "M-2217",
    name: "Inflammation volatility",
    age: 39,
    sex: "Male",
    tags: ["hs-CRP volatile", "omega-3 low", "recovery sensitive"],
    values: {
      apob: [82, 84, 83, 86],
      insulin: [7.7, 8.2, 8.1, 8.5],
      crp: [1.0, 3.8, 1.6, 4.4],
      alt: [23, 22, 25, 24],
      omega: [4.6, 4.2, 4.4, 4.1]
    },
    latent: { lipid: 0.28, metabolic: 0.33, inflammatory: 0.98, liver: 0.22, recovery: 0.82 }
  },
  {
    id: "M-3090",
    name: "Liver strain pattern",
    age: 52,
    sex: "Male",
    tags: ["ALT rising", "insulin drift", "alcohol signal"],
    values: {
      apob: [91, 93, 95, 99],
      insulin: [8.8, 9.8, 11.0, 12.3],
      crp: [1.2, 1.5, 1.7, 2.0],
      alt: [28, 34, 42, 49],
      omega: [5.8, 5.7, 5.5, 5.4]
    },
    latent: { lipid: 0.44, metabolic: 0.61, inflammatory: 0.36, liver: 0.96, recovery: 0.72 }
  },
  {
    id: "M-4488",
    name: "Isolated lipid risk",
    age: 34,
    sex: "Female",
    tags: ["ApoB high", "insulin normal", "family-risk proxy"],
    values: {
      apob: [118, 124, 127, 132],
      insulin: [5.9, 6.1, 6.0, 6.3],
      crp: [0.8, 0.9, 0.7, 0.9],
      alt: [19, 18, 19, 20],
      omega: [6.1, 6.0, 5.9, 5.9]
    },
    latent: { lipid: 0.99, metabolic: 0.18, inflammatory: 0.15, liver: 0.12, recovery: 0.21 }
  },
  {
    id: "M-5150",
    name: "Fitness plateau",
    age: 43,
    sex: "Female",
    tags: ["mostly in range", "sleep debt", "slow drift"],
    values: {
      apob: [78, 79, 81, 82],
      insulin: [6.9, 7.4, 7.8, 8.4],
      crp: [0.9, 1.1, 1.2, 1.5],
      alt: [17, 19, 18, 20],
      omega: [7.2, 7.0, 6.8, 6.7]
    },
    latent: { lipid: 0.18, metabolic: 0.42, inflammatory: 0.42, liver: 0.2, recovery: 0.88 }
  }
];

const state = {
  memberIndex: 0,
  objective: "best",
  medsAllowed: true,
  lowBurden: false,
  focus: "apob",
  futures: [],
  pareto: [],
  selected: null,
  hover: null,
  sliders: {
    lipid: 62,
    metabolic: 74,
    training: 56,
    recovery: 48,
    nutrition: 46,
    adherence: 72
  },
  seed: 42
};

const els = {
  memberSelect: document.getElementById("memberSelect"),
  objectiveButtons: document.getElementById("objectiveButtons"),
  medsToggle: document.getElementById("medsToggle"),
  lowBurdenToggle: document.getElementById("lowBurdenToggle"),
  generateBtn: document.getElementById("generateBtn"),
  sliderStack: document.getElementById("sliderStack"),
  avatar: document.getElementById("avatar"),
  memberName: document.getElementById("memberName"),
  memberMeta: document.getElementById("memberMeta"),
  tagRow: document.getElementById("tagRow"),
  signalGrid: document.getElementById("signalGrid"),
  futureCanvas: document.getElementById("futureCanvas"),
  canvasTooltip: document.getElementById("canvasTooltip"),
  markerFocus: document.getElementById("markerFocus"),
  forecastChart: document.getElementById("forecastChart"),
  markerPills: document.getElementById("markerPills"),
  frontierMetrics: document.getElementById("frontierMetrics"),
  frontierCallout: document.getElementById("frontierCallout"),
  futureList: document.getElementById("futureList"),
  selectedScore: document.getElementById("selectedScore"),
  selectedBurden: document.getElementById("selectedBurden"),
  deltaGrid: document.getElementById("deltaGrid"),
  reasoningBox: document.getElementById("reasoningBox"),
  futureCount: document.getElementById("futureCount"),
  paretoCount: document.getElementById("paretoCount"),
  selectedPath: document.getElementById("selectedPath")
};

const ctx = els.futureCanvas.getContext("2d");

function init() {
  members.forEach((member, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${member.id} - ${member.name}`;
    els.memberSelect.appendChild(option);
  });

  objectives.forEach((objective) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.objective = objective.key;
    button.textContent = objective.label;
    button.addEventListener("click", () => {
      state.objective = objective.key;
      if (objective.key === "noMeds") state.medsAllowed = false;
      if (objective.key === "lowBurden") state.lowBurden = true;
      syncControls();
      regenerate({ keepSeed: true });
    });
    els.objectiveButtons.appendChild(button);
  });

  levers.forEach((lever) => {
    const control = document.createElement("div");
    control.className = "slider-control";
    control.innerHTML = `
      <div class="slider-label">
        <span>${lever.label}</span>
        <span id="${lever.key}Value">${state.sliders[lever.key]}%</span>
      </div>
      <input type="range" min="0" max="100" value="${state.sliders[lever.key]}" data-lever="${lever.key}" aria-label="${lever.label}">
    `;
    els.sliderStack.appendChild(control);
  });

  biomarkers.forEach((marker) => {
    const option = document.createElement("option");
    option.value = marker.key;
    option.textContent = marker.label;
    els.markerFocus.appendChild(option);
  });

  els.memberSelect.addEventListener("change", (event) => {
    state.memberIndex = Number(event.target.value);
    state.seed += 17;
    regenerate({ keepSeed: false });
  });
  els.medsToggle.addEventListener("change", () => {
    state.medsAllowed = els.medsToggle.checked;
    if (!state.medsAllowed && state.objective !== "noMeds") state.objective = "noMeds";
    regenerate({ keepSeed: true });
  });
  els.lowBurdenToggle.addEventListener("change", () => {
    state.lowBurden = els.lowBurdenToggle.checked;
    regenerate({ keepSeed: true });
  });
  els.generateBtn.addEventListener("click", () => {
    state.seed += 101;
    regenerate({ keepSeed: false, animate: true });
  });
  els.markerFocus.addEventListener("change", (event) => {
    state.focus = event.target.value;
    renderForecast();
    renderMarkerPills();
  });
  els.sliderStack.addEventListener("input", (event) => {
    if (!event.target.matches("input[type='range']")) return;
    const key = event.target.dataset.lever;
    state.sliders[key] = Number(event.target.value);
    document.getElementById(`${key}Value`).textContent = `${state.sliders[key]}%`;
    const custom = buildCustomFuture();
    state.selected = custom;
    renderAll();
  });

  els.futureCanvas.addEventListener("mousemove", handleCanvasMove);
  els.futureCanvas.addEventListener("mouseleave", () => {
    state.hover = null;
    els.canvasTooltip.hidden = true;
    renderCanvas();
  });
  els.futureCanvas.addEventListener("click", () => {
    if (!state.hover) return;
    state.selected = state.hover;
    syncSlidersFromFuture(state.selected);
    renderAll();
  });

  syncControls();
  regenerate({ keepSeed: true });
}

function currentMember() {
  return members[state.memberIndex];
}

function syncControls() {
  els.memberSelect.value = String(state.memberIndex);
  els.medsToggle.checked = state.medsAllowed;
  els.lowBurdenToggle.checked = state.lowBurden;
  els.markerFocus.value = state.focus;
  els.objectiveButtons.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.objective === state.objective);
    button.setAttribute("aria-pressed", button.dataset.objective === state.objective ? "true" : "false");
  });
}

function regenerate({ keepSeed = true, animate = false } = {}) {
  const oldText = els.generateBtn.textContent;
  if (animate) {
    els.generateBtn.textContent = "Simulating futures...";
    els.generateBtn.disabled = true;
  }
  window.setTimeout(() => {
    const seed = keepSeed ? state.seed : state.seed + 1;
    state.futures = generateFutures(seed, 12000);
    state.pareto = computePareto(state.futures);
    state.selected = selectBestFuture();
    syncSlidersFromFuture(state.selected);
    renderAll();
    if (animate) {
      els.generateBtn.disabled = false;
      els.generateBtn.textContent = oldText;
      els.futureCanvas.classList.add("pulse");
      window.setTimeout(() => els.futureCanvas.classList.remove("pulse"), 650);
    }
  }, animate ? 180 : 0);
}

function generateFutures(seed, count) {
  const rand = mulberry32(seed + state.memberIndex * 999);
  const member = currentMember();
  const futures = [];
  const medsAllowed = state.medsAllowed;
  const burdenCap = state.lowBurden ? 58 : 100;
  for (let i = 0; i < count; i += 1) {
    const mix = {
      lipid: medsAllowed ? shapedRandom(rand, member.latent.lipid) : rand() * 0.28,
      metabolic: shapedRandom(rand, member.latent.metabolic),
      training: shapedRandom(rand, 0.48 + member.latent.metabolic * 0.25),
      recovery: shapedRandom(rand, member.latent.recovery),
      nutrition: shapedRandom(rand, 0.45 + member.latent.inflammatory * 0.25),
      adherence: clamp(0.42 + rand() * 0.54 - (state.lowBurden ? 0.02 : 0), 0.25, 0.97)
    };

    let effort = effortScore(mix);
    if (effort > burdenCap) {
      const scale = burdenCap / effort;
      mix.lipid *= scale;
      mix.metabolic *= scale;
      mix.training *= scale;
      mix.recovery *= scale;
      mix.nutrition *= scale;
      effort = effortScore(mix);
    }

    const future = evaluateFuture(member, mix, `F-${i + 1}`);
    future.kind = classifyFuture(future);
    futures.push(future);
  }

  const baseline = evaluateFuture(member, {
    lipid: 0,
    metabolic: 0,
    training: 0,
    recovery: 0,
    nutrition: 0,
    adherence: 0.65
  }, "baseline");
  baseline.kind = "Baseline";
  baseline.isBaseline = true;
  futures.push(baseline);
  return futures;
}

function shapedRandom(rand, affinity) {
  const a = rand();
  const b = rand();
  const base = (a + b) / 2;
  return clamp(base * 0.78 + affinity * 0.22 + (rand() - 0.5) * 0.2, 0, 1);
}

function effortScore(mix) {
  return clamp(
    mix.lipid * 25 +
    mix.metabolic * 28 +
    mix.training * 22 +
    mix.recovery * 16 +
    mix.nutrition * 12 +
    Math.max(0, mix.adherence - 0.62) * 18,
    0,
    100
  );
}

function evaluateFuture(member, mix, id) {
  const last = lastValues(member);
  const adherence = mix.adherence;
  const synergy = {
    metabolicTraining: Math.min(mix.metabolic, mix.training) * 0.18,
    recoveryInflammation: Math.min(mix.recovery, mix.nutrition) * 0.14,
    lipidMetabolic: Math.min(mix.lipid, mix.metabolic) * 0.08
  };

  const effect = {
    apob: -34 * mix.lipid * (0.72 + member.latent.lipid * 0.42)
      - 8 * mix.metabolic * (0.4 + member.latent.metabolic)
      - 3 * mix.training
      - 2 * mix.nutrition
      - 5 * synergy.lipidMetabolic,
    insulin: -5.6 * mix.metabolic * (0.65 + member.latent.metabolic * 0.55)
      - 2.7 * mix.training
      - 1.8 * mix.recovery
      - 1.1 * synergy.metabolicTraining,
    crp: -1.15 * mix.recovery * (0.62 + member.latent.inflammatory * 0.56)
      - 0.8 * mix.nutrition
      - 0.34 * mix.training
      - 0.22 * mix.metabolic
      - 0.45 * synergy.recoveryInflammation,
    alt: -12.4 * mix.recovery * (0.52 + member.latent.liver * 0.64)
      - 7.6 * mix.metabolic
      - 2.2 * mix.training
      - 1.5 * synergy.metabolicTraining,
    omega: 2.6 * mix.nutrition * (0.75 + member.latent.inflammatory * 0.35)
      + 0.25 * mix.recovery
  };

  const regression = {
    apob: stateValueDrift(member, "apob", last.apob),
    insulin: stateValueDrift(member, "insulin", last.insulin),
    crp: stateValueDrift(member, "crp", last.crp),
    alt: stateValueDrift(member, "alt", last.alt),
    omega: stateValueDrift(member, "omega", last.omega)
  };

  const predicted = {};
  const delta = {};
  biomarkers.forEach((marker) => {
    const rawDelta = (effect[marker.key] || 0) * adherence + regression[marker.key];
    const [min, max] = marker.range;
    predicted[marker.key] = clamp(last[marker.key] + rawDelta, min * 0.78, max * 1.04);
    delta[marker.key] = predicted[marker.key] - last[marker.key];
  });

  const gain = healthGain(member, predicted);
  const effort = effortScore(mix);
  const variability = uncertaintyScore(mix, member);
  const adherenceBurden = clamp(effort * (1.05 - adherence), 0, 100);
  const score = objectiveScore({ gain, effort, delta, predicted, mix, variability, adherenceBurden });

  return {
    id,
    mix,
    predicted,
    delta,
    gain,
    effort,
    score,
    variability,
    adherenceBurden,
    confidence: clamp(1 - variability, 0.48, 0.94),
    x: effort,
    y: gain.overall
  };
}

function stateValueDrift(member, key, value) {
  const values = member.values[key];
  const slope = values[values.length - 1] - values[0];
  const marker = biomarkers.find((item) => item.key === key);
  const direction = marker.better === "down" ? 1 : -1;
  const momentum = slope * 0.34;
  const baselinePull = (marker.target - value) * 0.03;
  return direction > 0 ? Math.max(momentum + baselinePull, -1.8) : Math.min(momentum + baselinePull, 0.45);
}

function healthGain(member, predicted) {
  const last = lastValues(member);
  const gains = {};
  biomarkers.forEach((marker) => {
    const [min, max] = marker.range;
    const scale = max - min;
    const movement = marker.better === "down"
      ? last[marker.key] - predicted[marker.key]
      : predicted[marker.key] - last[marker.key];
    const targetBonus = marker.better === "down"
      ? Math.max(0, last[marker.key] - marker.target) - Math.max(0, predicted[marker.key] - marker.target)
      : Math.max(0, marker.target - last[marker.key]) - Math.max(0, marker.target - predicted[marker.key]);
    gains[marker.key] = clamp((movement + targetBonus * 0.35) / scale, -0.22, 0.72);
  });

  const cardio = gains.apob * 0.68 + gains.crp * 0.18 + gains.omega * 0.14;
  const metabolic = gains.insulin * 0.52 + gains.alt * 0.28 + gains.apob * 0.12 + gains.crp * 0.08;
  const inflammation = gains.crp * 0.58 + gains.omega * 0.28 + gains.insulin * 0.14;
  const energy = gains.insulin * 0.32 + gains.crp * 0.22 + gains.alt * 0.16 + gains.omega * 0.3;
  const overall = (cardio * 0.34 + metabolic * 0.32 + inflammation * 0.2 + energy * 0.14) * 100;
  return {
    markers: gains,
    cardio: clamp(cardio * 100, -25, 100),
    metabolic: clamp(metabolic * 100, -25, 100),
    inflammation: clamp(inflammation * 100, -25, 100),
    energy: clamp(energy * 100, -25, 100),
    overall: clamp(overall, -24, 100)
  };
}

function objectiveScore(future) {
  const { gain, effort, delta, mix, variability, adherenceBurden } = future;
  const medsPenalty = state.medsAllowed ? 0 : mix.lipid * 38;
  const burdenPenalty = state.lowBurden ? effort * 0.46 : effort * 0.18;
  if (state.objective === "lowBurden") {
    return gain.overall * 0.58 + gain.energy * 0.16 - effort * 0.76 - variability * 12 - medsPenalty;
  }
  if (state.objective === "noMeds") {
    return gain.overall * 0.84 + gain.metabolic * 0.12 + gain.inflammation * 0.1 - effort * 0.24 - mix.lipid * 52;
  }
  if (state.objective === "cardio") {
    return gain.cardio * 1.1 + Math.max(0, -delta.apob) * 0.65 - effort * 0.18 - medsPenalty * 0.22;
  }
  if (state.objective === "metabolic") {
    return gain.metabolic * 1.15 + Math.max(0, -delta.insulin) * 1.4 + Math.max(0, -delta.alt) * 0.3 - effort * 0.2;
  }
  if (state.objective === "aggressive") {
    return gain.overall * 1.16 + gain.cardio * 0.2 + gain.metabolic * 0.18 - variability * 5 - medsPenalty * 0.12;
  }
  return gain.overall + gain.cardio * 0.14 + gain.metabolic * 0.14 + gain.energy * 0.08 - burdenPenalty - variability * 9 - adherenceBurden * 0.05 - medsPenalty * 0.3;
}

function uncertaintyScore(mix, member) {
  const interventionLoad = mix.lipid + mix.metabolic + mix.training + mix.recovery + mix.nutrition;
  const complexity = Math.max(0, interventionLoad - 2.35) * 0.08;
  const phenotypeConfidence = 0.16 - Math.max(...Object.values(member.latent)) * 0.05;
  return clamp(0.12 + complexity + phenotypeConfidence + (1 - mix.adherence) * 0.18, 0.06, 0.48);
}

function classifyFuture(future) {
  const entries = Object.entries(future.mix)
    .filter(([key]) => key !== "adherence")
    .sort((a, b) => b[1] - a[1]);
  const top = entries[0][0];
  const second = entries[1][0];
  if (future.effort < 38) return "Low-friction";
  if (future.effort > 82) return "Maximum";
  if (top === "lipid") return second === "metabolic" ? "Cardio-metabolic" : "Lipid";
  if (top === "metabolic") return "Metabolic";
  if (top === "recovery") return "Recovery";
  if (top === "nutrition") return "Inflammation";
  return "Training";
}

function computePareto(futures) {
  const candidates = futures.filter((future) => !future.isBaseline);
  const sorted = [...candidates].sort((a, b) => a.effort - b.effort || b.gain.overall - a.gain.overall);
  const frontier = [];
  let bestGain = -Infinity;
  sorted.forEach((future) => {
    if (future.gain.overall > bestGain + 0.18) {
      frontier.push(future);
      bestGain = future.gain.overall;
    }
  });
  return frontier;
}

function selectBestFuture() {
  const candidates = state.futures.filter((future) => !future.isBaseline);
  return candidates.reduce((best, future) => future.score > best.score ? future : best, candidates[0]);
}

function buildCustomFuture() {
  const member = currentMember();
  const mix = {};
  levers.forEach((lever) => {
    mix[lever.key] = state.sliders[lever.key] / 100;
  });
  if (!state.medsAllowed) mix.lipid = Math.min(mix.lipid, 0.22);
  const custom = evaluateFuture(member, mix, "custom");
  custom.kind = "Custom";
  custom.isCustom = true;
  return custom;
}

function syncSlidersFromFuture(future) {
  if (!future || !future.mix) return;
  levers.forEach((lever) => {
    const value = Math.round((future.mix[lever.key] || 0) * 100);
    state.sliders[lever.key] = value;
    const input = els.sliderStack.querySelector(`[data-lever="${lever.key}"]`);
    const label = document.getElementById(`${lever.key}Value`);
    if (input) input.value = value;
    if (label) label.textContent = `${value}%`;
  });
}

function renderAll() {
  syncControls();
  renderMember();
  renderSignals();
  renderCanvas();
  renderForecast();
  renderMarkerPills();
  renderFrontier();
  renderFutureList();
  renderSelected();
  renderReasoning();
  renderHeader();
}

function renderMember() {
  const member = currentMember();
  els.avatar.textContent = member.id.slice(2, 4);
  els.memberName.textContent = member.name;
  els.memberMeta.textContent = `${member.age}, ${member.sex} | ${member.id} | synthetic`;
  els.tagRow.innerHTML = member.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
}

function renderSignals() {
  const member = currentMember();
  const rows = biomarkers.map((marker) => {
    const values = member.values[marker.key];
    const change = last(values) - values[0];
    const good = marker.better === "down" ? change < 0 : change > 0;
    const sign = change > 0 ? "+" : "";
    return `
      <div class="signal">
        <span>${marker.label}</span>
        <strong>${formatNumber(last(values), marker.key)}</strong>
        <small class="${good ? "good" : "bad"}">${sign}${formatNumber(change, marker.key)} ${marker.unit} drift</small>
      </div>
    `;
  }).join("");
  els.signalGrid.innerHTML = rows;
}

function renderCanvas() {
  const canvas = els.futureCanvas;
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || 1040;
  const cssHeight = Math.max(420, cssWidth * 0.52);
  if (canvas.width !== Math.round(cssWidth * dpr) || canvas.height !== Math.round(cssHeight * dpr)) {
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = cssWidth;
  const h = cssHeight;
  const pad = { left: 58, right: 24, top: 30, bottom: 48 };
  ctx.clearRect(0, 0, w, h);
  drawCanvasBackground(w, h, pad);

  const scale = getCanvasScale(w, h, pad);
  state.futures.forEach((future) => {
    if (future.isBaseline) return;
    drawPoint(future, scale, 0.28, 2.3);
  });

  drawPareto(scale);

  const baseline = state.futures.find((future) => future.isBaseline);
  if (baseline) drawSpecialPoint(baseline, scale, "#6b7470", 8, "baseline");
  if (state.hover && !state.hover.isBaseline) drawSpecialPoint(state.hover, scale, "#17201d", 8, "hover");
  if (state.selected) drawSpecialPoint(state.selected, scale, "#d8664f", 11, "selected");

  drawAxes(w, h, pad);
}

function drawCanvasBackground(w, h, pad) {
  ctx.fillStyle = "#fbfcfa";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(23,32,29,0.07)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i += 1) {
    const y = pad.top + i * ((h - pad.top - pad.bottom) / 5);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
  }
  for (let i = 0; i <= 5; i += 1) {
    const x = pad.left + i * ((w - pad.left - pad.right) / 5);
    ctx.beginPath();
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, h - pad.bottom);
    ctx.stroke();
  }
}

function getCanvasScale(w, h, pad) {
  const gains = state.futures.map((future) => future.gain.overall);
  const minGain = Math.min(-8, ...gains);
  const maxGain = Math.max(36, ...gains);
  return {
    x: (effort) => pad.left + (effort / 100) * (w - pad.left - pad.right),
    y: (gain) => h - pad.bottom - ((gain - minGain) / (maxGain - minGain || 1)) * (h - pad.top - pad.bottom),
    minGain,
    maxGain,
    w,
    h,
    pad
  };
}

function drawPoint(future, scale, alpha, radius) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = colorForKind(future.kind);
  ctx.beginPath();
  ctx.arc(scale.x(future.effort), scale.y(future.gain.overall), radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawSpecialPoint(future, scale, color, radius, type) {
  const x = scale.x(future.effort);
  const y = scale.y(future.gain.overall);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = type === "baseline" ? "#fff" : color;
  ctx.lineWidth = type === "selected" ? 4 : 3;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (type === "selected") {
    ctx.strokeStyle = "rgba(216,102,79,0.24)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPareto(scale) {
  if (!state.pareto.length) return;
  ctx.save();
  ctx.strokeStyle = "#b7791f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  state.pareto.forEach((future, index) => {
    const x = scale.x(future.effort);
    const y = scale.y(future.gain.overall);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = "#b7791f";
  state.pareto.forEach((future) => {
    ctx.beginPath();
    ctx.arc(scale.x(future.effort), scale.y(future.gain.overall), 3.2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawAxes(w, h, pad) {
  ctx.save();
  ctx.strokeStyle = "#cfd6d1";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, h - pad.bottom);
  ctx.lineTo(w - pad.right, h - pad.bottom);
  ctx.stroke();
  ctx.fillStyle = "#5d6863";
  ctx.font = "12px Inter, system-ui, sans-serif";
  ctx.fillText("Higher best-self score", pad.left, 18);
  ctx.fillText("Lower effort", pad.left, h - 17);
  ctx.textAlign = "right";
  ctx.fillText("Higher effort", w - pad.right, h - 17);
  ctx.textAlign = "center";
  ctx.fillText("intervention burden", w / 2, h - 17);
  ctx.restore();
}

function handleCanvasMove(event) {
  const rect = els.futureCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const scale = getCanvasScale(rect.width, Math.max(420, rect.width * 0.52), { left: 58, right: 24, top: 30, bottom: 48 });
  let nearest = null;
  let nearestDist = Infinity;
  const candidates = state.pareto.length ? state.pareto : state.futures;
  candidates.forEach((future) => {
    if (future.isBaseline) return;
    const dx = scale.x(future.effort) - x;
    const dy = scale.y(future.gain.overall) - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = future;
    }
  });

  if (nearest && nearestDist < 34) {
    state.hover = nearest;
    els.canvasTooltip.hidden = false;
    els.canvasTooltip.style.left = `${Math.min(rect.width - 245, x + 18)}px`;
    els.canvasTooltip.style.top = `${Math.max(10, y - 24)}px`;
    els.canvasTooltip.innerHTML = `
      <strong>${nearest.kind} future</strong>
      <span>Score ${Math.round(nearest.gain.overall)} | effort ${Math.round(nearest.effort)} | confidence ${Math.round(nearest.confidence * 100)}%</span>
      <span>ApoB ${formatDelta(nearest.delta.apob, "apob")} | insulin ${formatDelta(nearest.delta.insulin, "insulin")}</span>
    `;
  } else {
    state.hover = null;
    els.canvasTooltip.hidden = true;
  }
  renderCanvas();
}

function renderForecast() {
  const member = currentMember();
  const selected = state.selected || selectBestFuture();
  const marker = biomarkers.find((item) => item.key === state.focus);
  const values = member.values[marker.key];
  const last = values[values.length - 1];
  const futureValue = selected.predicted[marker.key];
  const baseline = state.futures.find((future) => future.isBaseline);
  const baselineValue = baseline ? baseline.predicted[marker.key] : last;
  const selectedSeries = [
    values[0],
    values[1],
    values[2],
    values[3],
    interpolate(last, futureValue, 0.35),
    interpolate(last, futureValue, 0.72),
    futureValue
  ];
  const baselineSeries = [
    values[0],
    values[1],
    values[2],
    values[3],
    interpolate(last, baselineValue, 0.35),
    interpolate(last, baselineValue, 0.72),
    baselineValue
  ];
  const uncertainty = selected.variability * (marker.range[1] - marker.range[0]) * 0.18;
  const upper = selectedSeries.map((value, index) => index < 4 ? value : value + uncertainty * (index - 3) * 0.42);
  const lower = selectedSeries.map((value, index) => index < 4 ? value : value - uncertainty * (index - 3) * 0.42);

  const all = [...selectedSeries, ...baselineSeries, ...upper, ...lower, marker.target];
  const min = Math.min(marker.range[0], ...all) - (marker.range[1] - marker.range[0]) * 0.04;
  const max = Math.max(marker.range[1], ...all) + (marker.range[1] - marker.range[0]) * 0.04;
  const width = 760;
  const height = 300;
  const pad = { left: 46, right: 24, top: 24, bottom: 38 };
  const x = (index) => pad.left + index * ((width - pad.left - pad.right) / 6);
  const y = (value) => height - pad.bottom - ((value - min) / (max - min || 1)) * (height - pad.top - pad.bottom);
  const path = (series) => series.map((value, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(value)}`).join(" ");
  const area = `${upper.map((value, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(value)}`).join(" ")} ${lower.map((value, index) => `L ${x(6 - index)} ${y(lower[6 - index])}`).join(" ")} Z`;
  const labels = ["-18m", "-12m", "-6m", "now", "+60d", "+120d", "+180d"];

  els.forecastChart.innerHTML = `
    ${[0, 1, 2, 3, 4].map((tick) => {
      const yy = pad.top + tick * ((height - pad.top - pad.bottom) / 4);
      return `<line x1="${pad.left}" y1="${yy}" x2="${width - pad.right}" y2="${yy}" stroke="#edf0ed" />`;
    }).join("")}
    ${labels.map((label, index) => `<text x="${x(index)}" y="${height - 13}" fill="#5d6863" font-size="11" text-anchor="middle">${label}</text>`).join("")}
    <line x1="${pad.left}" y1="${y(marker.target)}" x2="${width - pad.right}" y2="${y(marker.target)}" stroke="${marker.color}" stroke-dasharray="4 5" opacity="0.34" />
    <path d="${area}" fill="${marker.color}" opacity="0.12"></path>
    <path d="${path(baselineSeries)}" fill="none" stroke="#9aa39e" stroke-width="3" stroke-dasharray="6 6" />
    <path d="${path(selectedSeries)}" fill="none" stroke="${marker.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    ${selectedSeries.map((value, index) => `<circle cx="${x(index)}" cy="${y(value)}" r="${index === 6 ? 6 : 4}" fill="#fff" stroke="${marker.color}" stroke-width="3" />`).join("")}
    <text x="${pad.left}" y="17" fill="#5d6863" font-size="11">${marker.label} (${marker.unit})</text>
    <text x="${width - pad.right}" y="${y(futureValue) - 10}" fill="${marker.color}" font-size="12" font-weight="750" text-anchor="end">${formatNumber(futureValue, marker.key)} ${marker.unit}</text>
    <text x="${width - pad.right}" y="${y(baselineValue) + 18}" fill="#6b7470" font-size="11" text-anchor="end">baseline ${formatNumber(baselineValue, marker.key)}</text>
  `;
}

function renderMarkerPills() {
  const selected = state.selected || selectBestFuture();
  els.markerPills.innerHTML = biomarkers.map((marker) => {
    const delta = selected.delta[marker.key];
    const good = marker.better === "down" ? delta < 0 : delta > 0;
    return `<button class="marker-pill" data-marker="${marker.key}" style="${state.focus === marker.key ? `border-color:${marker.color};color:${marker.color}` : ""}">
      ${marker.label}: <strong class="${good ? "good" : "bad"}">${formatDelta(delta, marker.key)}</strong>
    </button>`;
  }).join("");
  els.markerPills.querySelectorAll("[data-marker]").forEach((button) => {
    button.addEventListener("click", () => {
      state.focus = button.dataset.marker;
      els.markerFocus.value = state.focus;
      renderForecast();
      renderMarkerPills();
    });
  });
}

function renderFrontier() {
  const selected = state.selected || selectBestFuture();
  const frontierBest = state.pareto.reduce((best, future) => future.gain.overall > best.gain.overall ? future : best, state.pareto[0] || selected);
  const easy = state.pareto.filter((future) => future.effort < 45).sort((a, b) => b.gain.overall - a.gain.overall)[0] || selected;
  els.frontierMetrics.innerHTML = `
    <div class="frontier-metric">
      <span>Top frontier score</span>
      <strong>${Math.round(frontierBest.gain.overall)}</strong>
      <small>${frontierBest.kind}, effort ${Math.round(frontierBest.effort)}</small>
    </div>
    <div class="frontier-metric">
      <span>Low-burden option</span>
      <strong>${Math.round(easy.gain.overall)}</strong>
      <small>${easy.kind}, effort ${Math.round(easy.effort)}</small>
    </div>
    <div class="frontier-metric">
      <span>Selected confidence</span>
      <strong>${Math.round(selected.confidence * 100)}%</strong>
      <small>From cohort density and intervention complexity</small>
    </div>
    <div class="frontier-metric">
      <span>Time to signal</span>
      <strong>${timeToSignal(selected)}d</strong>
      <small>First likely measurable lab movement</small>
    </div>
  `;
  els.frontierCallout.innerHTML = `<strong>Pareto framing:</strong> the selected path buys ${Math.round(selected.gain.overall)} points of biomarker improvement for ${Math.round(selected.effort)} effort. A user can trade speed, medication preference, and adherence burden without pretending one path is universally best.`;
}

function renderFutureList() {
  const ranked = curatedFutureChoices();
  els.futureList.innerHTML = ranked.map((item, index) => `
    <button class="future-button ${item.future.id === state.selected?.id ? "active" : ""}" data-id="${item.future.id}">
      <span>
        <strong>${index + 1}. ${item.label}</strong>
        <span>${dominantLevers(item.future).join(" + ")} | effort ${Math.round(item.future.effort)}</span>
      </span>
      <b>${Math.round(item.future.gain.overall)}</b>
    </button>
  `).join("");
  els.futureList.querySelectorAll("[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const future = state.futures.find((item) => item.id === button.dataset.id);
      if (!future) return;
      state.selected = future;
      syncSlidersFromFuture(future);
      renderAll();
    });
  });
}

function curatedFutureChoices() {
  const candidates = state.futures.filter((future) => !future.isBaseline);
  const byScore = [...candidates].sort((a, b) => b.score - a.score);
  const byGain = [...candidates].sort((a, b) => b.gain.overall - a.gain.overall);
  const lowFriction = candidates
    .filter((future) => future.effort < 46)
    .sort((a, b) => b.gain.overall - a.gain.overall)[0] || byScore[0];
  const noMeds = candidates
    .filter((future) => future.mix.lipid < 0.24)
    .sort((a, b) => b.gain.overall - a.gain.overall - b.effort * 0.12 + a.effort * 0.12)[0] || byScore[0];
  const cardio = candidates
    .sort((a, b) => b.gain.cardio - a.gain.cardio || b.delta.apob * -1 - a.delta.apob * -1)[0] || byScore[0];
  const metabolic = candidates
    .sort((a, b) => b.gain.metabolic - a.gain.metabolic || b.delta.insulin * -1 - a.delta.insulin * -1)[0] || byScore[0];
  const maximum = byGain[0] || byScore[0];

  const seen = new Set();
  return [
    { label: "Best match for objective", future: byScore[0] },
    { label: "Low-friction self", future: lowFriction },
    { label: "No-med self", future: noMeds },
    { label: "Fast ApoB self", future: cardio },
    { label: "Metabolic reset self", future: metabolic },
    { label: "Maximum-change self", future: maximum }
  ].filter((item) => {
    if (!item.future || seen.has(item.future.id)) return false;
    seen.add(item.future.id);
    return true;
  }).slice(0, 5);
}

function renderSelected() {
  const selected = state.selected || selectBestFuture();
  els.selectedScore.textContent = `${Math.round(selected.gain.overall)}`;
  els.selectedBurden.textContent = `${Math.round(selected.effort)}`;
  els.deltaGrid.innerHTML = biomarkers.map((marker) => {
    const delta = selected.delta[marker.key];
    const good = marker.better === "down" ? delta < 0 : delta > 0;
    return `
      <div class="delta-card">
        <span>${marker.label}</span>
        <strong class="${good ? "good" : "bad"}">${formatDelta(delta, marker.key)}</strong>
        <small>${formatNumber(selected.predicted[marker.key], marker.key)} ${marker.unit} forecast</small>
      </div>
    `;
  }).join("");
}

function renderReasoning() {
  const selected = state.selected || selectBestFuture();
  const member = currentMember();
  const drivers = dominantLevers(selected);
  const signals = member.tags.join(", ");
  els.reasoningBox.innerHTML = `
    <p><strong>Latent state:</strong> ${signals}. The twin maps recent slopes, volatility, and cross-marker coupling into a trajectory state.</p>
    <p><strong>Selected future:</strong> ${selected.kind} path using ${drivers.join(" + ")}. Forecast gain is ${Math.round(selected.gain.overall)} with ${Math.round(selected.confidence * 100)}% confidence.</p>
    <p><strong>Closed loop:</strong> retest in 90-180 days; prediction error recalibrates the member twin and improves cohort-level counterfactuals.</p>
  `;
}

function renderHeader() {
  const selected = state.selected || selectBestFuture();
  els.futureCount.textContent = state.futures.filter((future) => !future.isBaseline).length.toLocaleString();
  els.paretoCount.textContent = state.pareto.length.toString();
  els.selectedPath.textContent = selected ? selected.kind : "None";
}

function lastValues(member) {
  const output = {};
  biomarkers.forEach((marker) => {
    output[marker.key] = last(member.values[marker.key]);
  });
  return output;
}

function dominantLevers(future) {
  return Object.entries(future.mix)
    .filter(([key]) => key !== "adherence")
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => levers.find((lever) => lever.key === key)?.label.replace(" clinician pathway", "").replace(" pathway", "") || key);
}

function colorForKind(kind) {
  return {
    Baseline: "#8a948f",
    "Low-friction": "#6b7470",
    Maximum: "#17201d",
    "Cardio-metabolic": "#147a72",
    Lipid: "#147a72",
    Metabolic: "#d8664f",
    Recovery: "#b7791f",
    Inflammation: "#376fa8",
    Training: "#2f7d4d",
    Custom: "#d8664f"
  }[kind] || "#376fa8";
}

function timeToSignal(future) {
  const intensity = future.mix.lipid + future.mix.metabolic + future.mix.training + future.mix.recovery + future.mix.nutrition;
  return Math.round(clamp(105 - intensity * 16 - future.mix.adherence * 12, 42, 120));
}

function formatDelta(value, key) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, key)}`;
}

function formatNumber(value, key) {
  const decimals = key === "apob" || key === "alt" ? 0 : 1;
  return round(value, decimals).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function last(values) {
  return values[values.length - 1];
}

function interpolate(a, b, t) {
  return a + (b - a) * t;
}

function round(value, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mulberry32(seed) {
  return function random() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

window.addEventListener("resize", () => {
  renderCanvas();
});

init();
