---
layout: single
title: "UCI ARCALA Research Lab"
permalink: /projects/arcala/
classes: wide
---

**Role:** Research Assistant | **Stack:** PyTorch, HuggingFace Transformers (BERT/DistilBERT), Next.js, Vercel AI SDK | **Time:** January 2025 - June 2026

Research at ARCALA Lab under Prof. Thomas Yeh, focused on LLM evaluation methodology and automated interaction classification in deployed LLM systems.

<figure>
  <img src="/assets/images/chat-bloom-diagram.jpg" alt="The Chat-Bloom Taxonomy Diagram">
  <figcaption>Figure 1: The Chat-Bloom framework used to classify interaction intent in human-LLM logs.</figcaption>
</figure>

## The Deployment: iGPT
We built and deployed **iGPT**, a custom LLM chatbot instrumented to capture interaction metadata in real-time, across CS0/CS1 courses with 234 students — collecting a dataset of **8,076 interaction logs**.

## The Evaluation Framework: Chat-Bloom
We designed **Chat-Bloom**, an LLM evaluation taxonomy derived from Bloom's taxonomy, to classify behavioral shifts in human-LLM interaction logs — measuring the cognitive effort level delegated per user turn.

To automate classification at scale, I trained **BERT-Large and DistilBERT** ensemble classifiers on a manually labeled ground-truth dataset (75.9% inter-rater reliability), achieving **~90% accuracy**, enabling systematic analysis of LLM-assisted workflow patterns across entire quarters.

## Eval Harness: PREVAIL
I built **PREVAIL**, a predictive-replay evaluation harness to measure next-turn behavioral shift in LLM-assisted workflows, testing how different model design choices affect downstream interaction patterns.

## LLM-as-a-Judge Pipeline
I built an LLM-as-a-Judge classification pipeline using OpenAI models for automated Chat-Bloom taxonomy labeling, benchmarking against the trained BERT baseline.

### Manuscripts
* **Chao, L., et al.** "Chat-Bloom: A Taxonomy for Classifying Cognitive Offloading in Student-AI Interactions in CS Education." *(Accepted, SIGCSE Virtual 2026)*