---
layout: single
title: "HeadsUp: Real-Time GTO Assistant"
permalink: /projects/headsup/
classes: wide
---
**Role:** Sole Developer | **Stack:** Python, PySide6, XGBoost, Selenium | **Status:** Personal Project (July 2025 - Present)

Poker is a game of incomplete information, typically solved by "Game Theory Optimal" (GTO) solvers. The problem is that solvers take minutes to run—useless in a live game where you have seconds to act. I built **HeadsUp** to answer an engineering question: *Can we approximate a GTO solver's intelligence in real-time without breaking the user's flow state?*

<figure>
  <img src="/assets/images/headsup-demo.gif" alt="HeadsUp Poker Overlay Demo">
  <figcaption>Figure 1: The HeadsUp overlay acts as an augmented reality layer, functioning with <20ms internal latency.</figcaption>
</figure>

## The Constraint: 120ms Latency Budget
To feel "instant," an interface must respond in under ~100-120ms. This gave me a strict budget for the entire pipeline: perceiving the cards, calculating the odds, and rendering the advice.

I initially tried using OCR to read the screen, but it was CPU-intensive and prone to lighting errors. I switched to a **Selenium-based polling architecture** that hooks directly into the game client's DOM. To ensure the UI never froze during a network poll, I architected the app using **PySide6 (Qt) with a multi-threaded worker pattern**, keeping the rendering thread locked at 60fps.

## The Model: "GTO-Lite" Distillation
Since I couldn't run a heavy solver live, I used **Model Distillation**. I wrote scripts using `eval7` to simulate **50,000+ poker hands**, calculating the perfect mathematical play for each.

I then trained a lightweight **XGBoost classifier** on this dataset. The result was a model that mimics the solver with **95.6% accuracy** on validation data, but runs inference in microseconds rather than minutes.

## Outcome
The final system achieves an internal processing latency of **< 20ms**. It effectively acts as a real-time decision support system, proving that complex game theory can be made accessible through efficient systems design.