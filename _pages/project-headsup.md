---
layout: single
title: "HeadsUp: Real-Time Game Theory"
permalink: /projects/headsup/
sidebar:
  - title: "Role"
    text: "Sole Developer"
  - title: "Stack"
    text: "Python, PySide6, Selenium, XGBoost, eval7"
  - title: "Metric"
    text: "<20ms internal latency"
---

**The Challenge:** Game Theory Optimal (GTO) solvers (like PioSolver) take minutes to run. A live poker HUD needs to perceive the board, calculate equity, and render advice in under **120ms** to maintain the user's flow state.

## 1. Concurrency & Perception
To meet the latency budget, I decoupled perception from rendering.
* **Perception:** Uses a **Selenium-based API** polling mechanism to scrape live game state data.
* **Threading Model:** I utilized **PySide6 (Qt)** with a multi-threaded architecture. The UI overlay runs on a separate thread from the calculation logic, ensuring the HUD remains responsive even during data spikes.
* **Result:** Achieved an internal processing latency of **< 20ms**, well within the perceivable threshold.

## 2. "GTO-Lite": Model Distillation
Since running a solver in real-time is impossible, I trained a lightweight approximation model.
* **Data Generation:** I built a custom oracle using **eval7** (a poker equity calculator) to simulate **50,000+ hands**, labeling each with the perfect GTO decision.
* **The Model:** Trained an **XGBoost** classifier on this dataset to approximate the solver's logic.
* **Performance:** The model achieved **95.6% test accuracy** on validation data, effectively "compressing" complex game theory into a millisecond-inference engine.

## 3. Action-Inference Engine
To measure the tool's utility, I built an evaluation loop.
* **Logging:** The system logs "Hero" decisions vs. "GTO" advice to a local SQLite database.
* **Analysis:** Post-session Pandas scripts generate "Error Slices," identifying specific scenarios (e.g., "Out of Position vs. Aggressor") where human intuition diverged from the model's optimal strategy.