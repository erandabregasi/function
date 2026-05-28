# Best-Self Digital Twin Demo


The demo simulates 12,000 clinically plausible 180-day futures for a synthetic member, surfaces a Pareto frontier of outcome versus burden, and lets the presenter switch objectives such as lowest burden, no-med path, fast ApoB drop, metabolic reset, and maximum change.

## Run Locally

```sh
cd function-rl-demo
python3 -m http.server 4327 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:4327/index.html
```

## Included

- `function-rl-demo/index.html` - app shell
- `function-rl-demo/styles.css` - visual system
- `function-rl-demo/app.js` - synthetic simulator and interactions
- `function-rl-demo/best-self-digital-twin.pptx` - editable presentation deck
- `function-rl-demo/best-self-digital-twin.pdf` - shareable PDF export


> A chatbot tells members what their labs mean. A digital twin lets them choose which future self they want to work toward, then learns from every retest whether that future was real.

