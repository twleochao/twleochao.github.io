---
layout: single
title: "PDFim: Adaptive Terminal Reader"
permalink: /projects/pdfim/
classes: wide
---
**Role:** Sole Developer | **Stack:** Python, curses, PyMuPDF | **Status:** Personal Project (Jan 2025)

Reading multi-column academic papers on remote servers (via SSH) is painful due to X11 forwarding lag. Existing tools like `pdftotext` destroy formatting, making papers unreadable. I built **PDFim** to solve the "layout problem" algorithmically in the terminal.

<figure>
  <img src="/assets/images/pdfim-demo.gif" alt="PDFim Terminal Reader Demo">
  <figcaption>Figure 1: PDFim reflowing a two-column academic paper into a linear stream inside a terminal window.</figcaption>
</figure>

## The "Layout" Challenge
The core engineering challenge was converting absolute PDF coordinates into a linear text stream that preserves reading order (e.g., reading the bottom of column 1 before the top of column 2).

I built a custom **adaptive layout engine** using **PyMuPDF**. It extracts text block coordinates and statistically clusters them to detect column boundaries and headers dynamically. The system then serializes the blocks into a coherent stream suitable for a TUI (Text User Interface).

## UX & Efficiency
To fit into a developer's workflow, I implemented standard Vim navigation (`j/k`, `G`, `/` search) using the **curses** library. I also added a visual selection mode for copying citations directly to the system clipboard.

## Outcome
By eliminating the GUI rendering overhead, PDFim reduces memory usage by **30%** compared to standard viewers like Evince. It enables zero-latency scrolling of complex PDFs over SSH connections, streamlining the workflow for researchers on compute clusters.