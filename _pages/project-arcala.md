---
layout: single
title: "ARCALA Lab: Measuring Cognitive Offloading"
permalink: /projects/arcala/
toc: true
toc_label: "Project Overview"
toc_icon: "book"
header:
  overlay_image: /assets/images/chat-bloom-diagram.png
  overlay_filter: 0.5
  caption: "The Chat-Bloom Taxonomy"
sidebar:
  - title: "Role"
    text: "Undergraduate Research Assistant"
  - title: "Tech Stack"
    text: "Python, PyTorch, BERT/DistilBERT, Next.js, Vercel AI SDK"
  - title: "Date"
    text: "Jan 2025 - Present"
  - title: "Lab"
    text: "ARCALA (Prof. Thomas Yeh)"
---

<p class="notice--info">
  <strong>Research Question:</strong> As LLMs enter the classroom, how can we systematically measure the "cognitive effort" students delegate to AI, and how does interface design influence this behavior?
</p>

Modern LLMs excel at generating answers, but in an educational context, we need to ensure they support—rather than replace—human learning. My work at ARCALA Lab focuses on creating the **observability layer** for this human-AI interaction.

## 1. The Framework: Chat-Bloom

We introduced **Chat-Bloom**, a novel taxonomy derived from Bloom's Taxonomy. Unlike traditional metrics that simply count "correctness," Chat-Bloom measures the **cognitive depth** of a student's prompt and the AI's response.

* **Goal:** Differentiate between "passive offloading" (asking for the answer) and "active scaffolding" (asking for an explanation).
* **Implementation:** I co-developed the coding scheme and organized a dataset of **8,076 human-LLM interactions** from 234 students across CS0/CS1 courses.

## 2. Technical Execution: Automating Evaluation

Manually coding thousands of chat logs is unscalable. I led the technical effort to automate this classification pipeline.

* **Data Collection:** I co-designed and deployed **iGPT**, a custom chatbot app built with **Next.js** and **Vercel AI SDK**. This allowed us to capture granular interaction logs that standard tools (like ChatGPT) do not provide.
* **Model Training:** I trained and fine-tuned **BERT and DistilBERT** transformer classifiers on our labeled dataset.
* **Performance:** The final ensemble model achieved **~85-90% accuracy** at adjustable coverage, allowing us to evaluate student behavior at scale in near real-time.

## 3. The "PREVAIL" Harness

To go beyond static analysis, I co-built the **PREVAIL** evaluation harness. This system uses "predictive replay" to estimate how different LLM responses change a student's *next* turn.

* **Why it matters:** It allows us to benchmark "pedagogical effectiveness." We found that certain system prompts could successfully shift students from low-effort "Recall" prompts to high-effort "Analysis" prompts.

## 📄 Outcomes & Publications

This work challenges the binary view that "AI in class is cheating." By quantifying cognitive offloading, we provide the data needed to design steerable AI tutors.

* **Park, H., et al.** "PREVAIL: Predictive Replay-based Evaluation and Validation of AI’s Impact on Learning." *Under Review at EAAI-26*.
* **Ganesh, S., et al.** "Chat-Bloom Taxonomy: Reimagining Bloom’s to Empirically Evaluate Human–LLM Interactions in CS Education." *In Revision, 2026*.