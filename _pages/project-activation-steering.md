---
layout: single
title: "LLM Activation Steering"
permalink: /projects/activation-steering/
classes: wide
---
**Role:** Independent Research Project | **Stack:** Python, PyTorch, TransformerLens, SAELens, HuggingFace, OpenAI API | **Time:** January 2026 - March 2026 | **Repo:** [GitHub](https://github.com/twleochao/llm-activation-steering)

A mechanistic interpretability project investigating whether we can control high-level attributes in LLMs, specifically sentiment and truthfulness, without fine-tuning or prompt engineering. We used Sparse Autoencoders (SAEs) to find and inject feature vectors directly into Gemma's residual stream at inference time.

## The Approach
We treated the pre-trained Gemma-3-1b model as a fixed computation graph and used TransformerLens to hook into the residual stream at Layer 22. During the forward pass, a programmatic hook intercepts the residual state and adds a scaled SAE feature vector, modifying the model's internal representation before the remaining layers process it.

The core formula: x' = x + a * d_feature, where a is the steering coefficient and d_feature is the target SAE direction vector.

<figure>
  <img src="/assets/images/activation-steering-pipeline.jpg" alt="End-to-end pipeline diagram">
  <figcaption>Figure 1: End-to-end pipeline covering feature discovery, mechanistic intervention, and evaluation.</figcaption>
</figure>

## Feature Discovery Pipeline
Finding the right feature vectors was the harder problem. For sentiment, we queried Neuronpedia's activation extraction API with polarized seed prompts, retrieved the top 800 activated Gemma-Scope SAE features, then ranked them by AUC for positive vs. negative label separation on the SST-2 validation set.

For truthfulness, we constructed 10 contrast prompts across three categories (myths, factual statements, unanswerable queries) and ranked features by thresholded presence frequency rather than raw activation mass, to avoid density bias.

## Evaluation Framework
We designed a multidimensional automated evaluation pipeline using GPT-5 as an LLM-as-a-Judge across two datasets:

- **IMDb sentiment steering**: 1,372 neutral-prefix completions, scored on relative sentiment shift against unsteered baseline
- **TruthfulQA**: 817 questions, evaluated via atomic claim verification with five verdict categories

Coherence was tracked across all conditions using a normalized 0.0-1.0 scoring rubric.

## Key Findings
Single-feature injections failed to produce statistically significant semantic shifts on sentiment (margin of error: 0.053), but multi-feature steering aggregating the top 3 candidates achieved a 4x amplification effect (delta = 0.190). SAE interventions on TruthfulQA produced statistically significant truthfulness improvements, while standard prompting did not.

We also found that SAE steering causes far less instruction leakage than preprompting. Prompted baselines generated meta-vocabulary artifacts with frequency deltas over 300, while SAE-steered conditions showed negligible topic drift.

<figure>
  <img src="/assets/images/activation-steering-results.jpg" alt="TruthfulQA efficacy results">
  <figcaption>Figure 2: Truthfulness efficacy and coherence metrics across mechanistic intervention conditions (TruthfulQA, N=817).</figcaption>
</figure>

## Stack Notes
Built on TransformerLens and SAELens for residual stream access, Neuronpedia API for feature extraction, and the OpenAI API for automated evaluation at scale.