---
layout: single
title: "PDFim: Adaptive Terminal Reader"
permalink: /projects/pdfim/
classes: wide
---
**Role:** Sole Developer | **Stack:** Python, curses, PyMuPDF | **Time:** Janurary 2025

Reading, gathering information, and citing multi-column academic papers on standard pdf viewers can be a hassle with manual highlighting and copying. I built **PDFim** to make reading papers fast and familiar for terminal users that enjoy vim-like shortcuts. 

<figure>
  <img src="/assets/images/PDFim-demo.gif" alt="PDFim Terminal Reader Demo">
  <figcaption>Figure 1: PDFim loading a paper, and navigating through the paper, copying lines, creating citations, all using keyboard shortcuts. </figcaption>
</figure>

## The Challenge: Layout Difficulties
The main challenge was converting absolute PDF coordinates/layout into a linear text stream that still preserves reading order (e.g., reading the bottom of left column before top of right column).

I built a custom adaptive layout engine using PyMuPDF. It extracts text block coordinates and statistically clusters them to detect column boundaries and headers. The system then serializes the blocks into a coherent stream which is displayed in the terminal

## The Workflow: Keyboard Shortcuts
I wanted the workflow with PDFim to fit into a terminal developer, i.e. using the keyboard as much as possible. I implemented standard Vim navigation (`j/k`, `G`, `/` search) using the curses ibrary. I also added a visual selection mode for copying citations directly to the system clipboard.

## Outcome
By not requiring GUI rendeding, PDFim uses 30% less memory than standard PDF viewers. The shortcuts with zero-latency scrolling enables a very efficient workflow for researchers.