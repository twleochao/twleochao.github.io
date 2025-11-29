---
layout: single
title: "HeadsUp: Real-Time GTO Assistant"
permalink: /projects/headsup/
classes: wide
---
**Role:** Sole Developer | **Stack:** Python, PySide6, XGBoost, Selenium | **Time:** July 2025 - Present 

Poker is a game of incomplete information, typically solved by "Game Theory Optimal" (GTO) solvers. However, for solveres take a while to generate outcome for specific scenarios, useful for post-game practice but not helpful for live game advice. I built **HeadsUp** to solve this problem: *Can we build an assistant that leverages GTO solver's intelligence while also updating information in real-time?* 

<figure>
  <img src="/assets/images/headsup_demo.gif" alt="HeadsUp Poker Overlay Demo">
  <figcaption>Figure 1: The HeadsUp display acts as a transparent overlay directly on the game window. In this demo, I intentionally deviate from the suggested actions to showcase the engine's real-time state updates.

Pre-Flop: The engine recommended a standard 3BB raise from UTG+2 with suited connectors. I executed a min-raise.

Post-Flop: On a low-equity board, the engine correctly identified a negative-EV scenario and advised folding. I checked to extend the state machine's active duration before folding to the opponent's raise.

Note: The engine projects the Game Theory Optimal (GTO) trajectory for the current turn's highest EV strategy (e.g., folding strategies) over default actions like free checks."</figcaption>
</figure>

## The Constraint: Low Latency Budget
Poker is a fast-paced game, for the advice to come in-time and feel instant, I gave myself a goal to have the interface respond in ~100ms. This gave me a strict budget for the entire pipeline: reading the cards, calculating the best move, rendering the advice. 

I initially tried using OCR to read the screen, but it was CPU-intensive and prone to imaging errors. I switched to a Selenium-based polling architecture that hooks directly into the game client. To ensure the UI doesn't freeze during background workl, I designed the app using PySide6 (Qt) with a multi-threaded worker pattern, keeping the rendering thread locked at 60fps.

## The Model: GTO-Lite from Distillation
Since we can't run a heavy solver live, I used a process called Model Distillation. I wrote scripts using `eval7` to simulate **50,000+ poker hands**, calculating the GTO play for each.

I then trained a lightweight XGBoost classifier on this dataset. The result was a model that mimics standard GTO solvers with **95.6% accuracy** on validation data, but runs within our latency budget.

## Outcome
The final system achieved an internal processing latency of <20ms. It effectively acts as a real-time decision support system, proving that complex game theory can be made accessible through efficient systems design.