# Best-Self Digital Twin

## Core Thesis

A lab chatbot explains what happened. A best-self digital twin lets a member rehearse what could happen next.

This demo simulates thousands of clinically plausible futures for a member, exposes the tradeoffs between outcome and effort, and lets the user choose the future self they want to optimize toward.

## What The Demo Shows

- 12,000 simulated 180-day futures for one synthetic member.
- A Pareto frontier of biomarker improvement versus intervention burden.
- Objective presets such as best overall, lowest burden, no-med path, fast ApoB drop, metabolic reset, and maximum change.
- Manual what-if levers for lipid/ApoB pathway, metabolic support, training, recovery, nutrition, and adherence.
- Biomarker forecasts with uncertainty for ApoB, fasting insulin, hs-CRP, ALT, and omega-3 index.
- A selected future-self panel showing expected deltas and a model-facing explanation.

## AI 

This is a counterfactual digital twin plus multi-objective optimizer.

- State: longitudinal biomarker trajectory, including level, slope, volatility, and cross-marker coupling.
- World model: forecasts biomarker movement under plausible intervention combinations.
- Optimization: surfaces a Pareto frontier instead of pretending there is one universally correct path.
- Feedback loop: every follow-up lab compares predicted versus actual movement and recalibrates the twin.

## Local Preview

```sh
python3 -m http.server 4327 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4327/index.html
```

