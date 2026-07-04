---
layout: single
permalink: /featured/
title: "Research & Projects"
author_profile: true
classes: wide
feature_row:
  - icon: "fas fa-flask"
    alt: "LLM Activation Steering"
    title: "LLM Activation Steering"
    excerpt: "Inference-time SAE feature injection into Gemma's residual stream for sentiment and truthfulness steering, with LLM-as-a-Judge evaluation."
    url: "/projects/activation-steering/"
    btn_label: "View Project"
    btn_class: "btn--primary"

  - icon: "fas fa-brain"
    alt: "McAuley Lab"
    title: "McAuley Lab, UCSD"
    excerpt: "Mechanistic interpretability of music LLMs using sparse autoencoders and TransformerLens. Targeting the NeurIPS AI4Music Workshop 2026."

  - icon: "fas fa-sitemap"
    alt: "ARCALA Lab"
    title: "ARCALA Lab, UCI"
    excerpt: "LLM evaluation methodology: Chat-Bloom taxonomy, transformer classifier training, and eval harness design. Chat-Bloom accepted at SIGCSE Virtual 2026."
    url: "/projects/arcala/"
    btn_label: "View Research"
    btn_class: "btn--primary"

  - icon: "fas fa-magnifying-glass-chart"
    alt: "Mooov"
    title: "Mooov: Product-Existence Classifier"
    excerpt: "A 3-layer product-existence classifier for a consumer discovery platform (regex gibberish gate, web-search grounding, LLM judge), with a labeled eval harness."

  - icon: "fas fa-network-wired"
    alt: "MAS SDLC"
    title: "Acer: MAS SDLC"
    excerpt: "Automating the software development lifecycle with a multi-agent system on Google ADK and Vertex AI."
    url: "/projects/massdlc/"
    btn_label: "View Project"
    btn_class: "btn--primary"
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

<style>
  .archive__item-teaser i {
    display: block !important;
    font-size: 3.5em !important;
    color: #fff !important;
    margin-bottom: 15px;
    text-align: center;
    width: 100%;
    opacity: 0.9;
  }
  
  .btn--primary {
    background-color: #8AA391 !important;
    border-color: #8AA391 !important;
    color: #16201a !important;
  }
  .btn--primary:hover {
    background-color: #74907D !important; 
  }

  .archive__item-body {
    text-align: center !important;
  }
  
  .archive__item-excerpt {
    text-align: center !important;
    margin-bottom: 20px !important;
  }

  .archive__item-body p {
    text-align: center !important;
  }
</style>

<p style="font-size: 1.0em; color: #bbb; margin-top: 30px; margin-bottom: 40px;">
  Research and engineering focused on mechanistic interpretability, LLM evaluation, and ML systems.
</p>

{% include feature_row.html%}

<div style="clear: both;"></div>

<section style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #444;">
  <h2 style="color: #888; text-transform: uppercase; letter-spacing: 1px; font-size: 0.9em; margin-bottom: 15px;">Other Projects</h2>
  <ul style="color: #bbb; line-height: 1.9;">
    <li><a href="/projects/headsup/" style="color: #8AA391;">HeadsUp</a>: a low-latency poker decision engine that distills a GTO solver into an XGBoost model.</li>
    <li><a href="/projects/pdfim/" style="color: #8AA391;">PDFim</a>: an adaptive-layout terminal reader for academic papers.</li>
  </ul>
</section>
