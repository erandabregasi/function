# Best-Self Digital Twin

An interactive AI demo that shows how longitudinal biomarker data could power a personalized “future self” simulator.

Instead of only explaining a member’s latest lab results, the demo simulates thousands of possible 180-day futures and helps the member choose the path that best matches their goals, constraints, and willingness to change.

## What It Shows

- 12,000 simulated future health paths for a synthetic member
- A tradeoff map of biomarker improvement vs. intervention burden
- Goal presets like “best overall,” “lowest burden,” “no-med path,” and “fast ApoB drop”
- What-if controls for training, recovery, nutrition, metabolic support, and adherence
- Forecasts for ApoB, fasting insulin, hs-CRP, ALT, and omega-3 index
- A selected plan with expected biomarker changes and reasoning

## Why It Matters

A chatbot can explain what a lab result means.

A digital twin can answer a more powerful question:

**“Which version of my future self should I work toward?”**

The defensible AI angle is that every follow-up lab creates feedback. The system can compare predicted vs. actual biomarker movement, then improve the model over time.

## How It Works

The demo combines:

- Longitudinal biomarker trends
- Counterfactual simulation
- Multi-objective optimization
- A Pareto frontier for outcome vs. effort
- Retest-based model learning

All data in this demo is synthetic and for product demonstration only.

## Run Locally

```sh
python3 -m http.server 4327 --bind 127.0.0.1
