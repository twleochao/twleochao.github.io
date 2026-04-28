---
layout: single
permalink: /featured/
title: "What I've Made"
author_profile: true
classes: wide
feature_row:
  - icon: "fas fa-brain"
    alt: "ARCALA Lab"
    title: "ARCALA Lab"
    excerpt: "LLM evaluation methodology, transformer classifier training, and eval harness design."
    url: "/projects/arcala/"
    btn_label: "View Research"
    btn_class: "btn--primary"
    
  - icon: "fas fa-network-wired"
    alt: "MAS SDLC"
    title: "Acer: MAS SDLC"
    excerpt: "Automating software development lifecycle with multi-agent systems."
    url: "/projects/massdlc/"
    btn_label: "View Project"
    btn_class: "btn--primary"

  - icon: "fas fa-flask"
    alt: "LLM Activation Steering"
    title: "LLM Activation Steering"
    excerpt: "Inference-time SAE feature injection into Gemma's residual stream for sentiment and truthfulness steering, with LLM-as-a-Judge evaluation."
    url: "/projects/activation-steering/"
    btn_label: "View Project"
    btn_class: "btn--primary"
    
  - icon: "fas fa-diamond"
    alt: "HeadsUp"
    title: "HeadsUp: Real-Time HUD"
    excerpt: "Real-time game theory based pre & post-flop poker engine."
    url: "/projects/headsup/"
    btn_label: "View Project"
    btn_class: "btn--primary"
    
  - icon: "fas fa-terminal"
    alt: "PDFim"
    title: "PDFim: Terminal Reader"
    excerpt: "Adaptive layout engine for reading academic papers in the terminal."
    url: "/projects/pdfim/"
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
    background-color: #48c774 !important;
    border-color: #48c774 !important;
  }
  .btn--primary:hover {
    background-color: #3da863 !important; 
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
  Research, industry, and engineering projects focused on LLM evaluation, multi-agent systems, and ML systems.
</p>

{% include feature_row.html%}
