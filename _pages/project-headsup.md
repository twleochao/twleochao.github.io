---
layout: single
title: "HeadsUp: Real-Time GTO Assistant"
permalink: /projects/headsup/
toc: true
toc_label: "System Design"
toc_icon: "stopwatch"
header:
  overlay_image: /assets/images/headsup-demo.gif
  overlay_filter: 0.5
  caption: "Real-Time Overlay in Action"
sidebar:
  - title: "Role"
    text: "Sole Developer"
  - title: "Tech Stack"
    text: "Python, PySide6 (Qt), Selenium, XGBoost, eval7, SQLite"
  - title: "Date"
    text: "July 2025 - Present"
  - title: "Focus"
    text: "Real-Time Systems & HCI"
---

<p class="notice--info">
  <strong>The Engineering Challenge:</strong> How do you inject "Game Theory Optimal" (GTO) intelligence into a fast-paced human workflow without breaking the user's flow state? The system needed to perceive, compute, and render advice in under <strong>120ms</strong> (the perceivable latency threshold).
</p>

HeadsUp is a computer-vision and API-based HUD that overlays real-time strategic advice onto a live poker table. It treats the game as a **co-working environment** where the AI handles the probability math, allowing the human to focus on strategy.

## 1. The Architecture: Speed as a Feature

To achieve the **< 20ms internal processing latency** required for a smooth experience, I had to decouple the system into isolated, non-blocking components.

* **Perception Layer:** Uses a **Selenium-based API** (and previously CV/OCR) to poll the live game state.
* **State Machine:** A failure-tolerant state machine acts as the "brain," sanitizing noisy data inputs and tracking the hand's progression (Pre-flop -> River).
* **Rendering Layer:** A multi-threaded **PySide6 (Qt)** transparent overlay draws the UI *over* the game window. By running the UI in a separate thread from the logic, the interface remains responsive even during heavy calculation bursts.

## 2. The AI: "GTO-Lite"

Running a full GTO solver (like PioSolver) takes minutes—too slow for live play. I needed an approximation that was instant.

* **The Oracle:** I built a custom data generator using **eval7** (a poker equity calculator) to simulate 50,000+ hands and calculate the "perfect" GTO decision for each.
* **The Model:** I trained an **XGBoost** classifier on this dataset.
* **The Result:** The model achieved **95.6% test accuracy** on validation data, effectively "compressing" the complex GTO logic into a lightweight inference engine that runs in milliseconds.

## 3. Human-Centric Evaluation

A tool is only useful if it improves human performance. I built an **Action-Inference Engine** to measure this.

* **Logging:** The system logs every decision made by the human ("Hero") vs. the suggested move by the AI to a SQLite database.
* **Analysis:** Post-session scripts using **Pandas** generate "Error Slices," helping me identify specific scenarios (e.g., "Out of Position vs. Aggressor") where my human intuition deviates from the optimal strategy.

## 🛠️ Key Takeaway

This project reinforced my belief in **Latency Budgets**. In co-working systems, speed isn't just a performance metric; it's a usability metric. If the AI lags, the human loses trust and agency.