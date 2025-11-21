---
layout: single
title: "Chat-Bloom: Measuring Cognitive Offloading"
permalink: /projects/arcala/
toc: true
toc_label: "Methodology"
header:
  overlay_image: /assets/images/chat-bloom-diagram.jpg
  overlay_filter: 0.5
  caption: "The Chat-Bloom Taxonomy"
sidebar:
  - title: "Role"
    text: "Lead Technical Implementation"
  - title: "Stack"
    text: "PyTorch, Hugging Face (BERT), Next.js, Vercel AI SDK"
  - title: "Output"
    text: "Paper in revision for ITiCSE 2026"
---

**Abstract:** While LLMs offer immediate help, they risk inducing "cognitive offloading," where students bypass critical thinking. At ARCALA Lab, I engineered the data collection infrastructure and machine learning pipelines to empirically measure this phenomenon across 8,000+ student interactions.

## 1. Data Infrastructure (iGPT)
To analyze student behavior, we needed granular logs that commercial interfaces (like ChatGPT) do not provide.
* **Custom Interface:** I designed and deployed "iGPT," a chat application built with **Next.js** and **Vercel AI SDK**.
* **Deployment:** The tool was integrated into CS0 and CS1 courses, maintaining server stability for 234 students over two quarters.
* **Dataset:** Successfully collected and anonymized **8,076 interaction turns**, creating the foundation for our empirical analysis.

## 2. The Classification Pipeline
Manual coding of chat logs is unscalable. I led the effort to automate the classification of "cognitive depth" using the Chat-Bloom taxonomy.
* **Model Architecture:** I fine-tuned **BERT-Large** and **DistilBERT** transformer models using the Hugging Face library.
* **Training Strategy:** Used a weighted loss function to handle class imbalance (e.g., the prevalence of "Analyze" vs. "Create" prompts).
* **Results:** The ensemble model achieved **~85-90% accuracy** (comparable to human inter-rater reliability), allowing us to evaluate student offloading behaviors at scale.

## 3. The "PREVAIL" Harness
Beyond static classification, I co-engineered the **PREVAIL** evaluation harness to measure "pedagogical effectiveness."
* **Predictive Replay:** The system simulates how a student's *next* turn changes based on different LLM responses (e.g., does a "Redirect" prompt lead to an "Analyze" response from the student?).
* **Outcome:** We identified that "Redirect" responses (withholding the answer) successfully shifted students from low-effort recall to higher-order analysis.