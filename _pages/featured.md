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
    excerpt: "Explroring frameworks to measure and reverse cognitive offloading in AI-assisted learning."
    url: "/projects/arcala/"
    btn_label: "View Research"
    btn_class: "btn--primary"
    
  - icon: "fas fa-network-wired"
    alt: "MAS SDLC"
    title: "Acer: MAS SDLC"
    excerpt: "Automating software development lifecycles with controllable multi-agent system."
    url: "/projects/massdlc/"
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
  Here's a collection of research, industry, and personal engineering/design projects I've worked on that emphasize human agency in software systems.
</p>

{% include feature_row.html%}