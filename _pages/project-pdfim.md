---
layout: single
title: "PDFim: Adaptive Terminal Reader"
permalink: /projects/pdfim/
sidebar:
  - title: "Stack"
    text: "Python, curses, PyMuPDF"
  - title: "Focus"
    text: "HCI & Low-Resource Computing"
  - title: "Metric"
    text: "30% memory reduction vs. GUI"
---

**Motivation:** Reading multi-column academic papers on remote servers (via SSH) is painful due to X11 forwarding lag. Existing tools like `pdftotext` destroy formatting. I built **PDFim** to solve the "layout problem" algorithmically in the terminal.

## 1. Adaptive Layout Engine
The core challenge was converting absolute PDF coordinates into a linear text stream that preserves reading order.
* **Heuristic Parsing:** Built a custom engine using **PyMuPDF**. It extracts text block coordinates and statistically clusters them to detect column boundaries and headers dynamically.
* **Reflow Logic:** The system serializes the "left column" blocks before "right column" blocks, stitching them into a coherent stream suitable for a TUI (Text User Interface), regardless of the original paper's formatting.

## 2. Interface Design (Curses)
* **Vim Bindings:** Implemented standard Vim navigation (`j/k`, `G`, `/` search) using the Python **curses** library to minimize context switching for developers.
* **Visual Mode:** Added a visual selection mode that allows users to copy citations or code snippets from the terminal directly to the system clipboard.

## 3. Optimization
* **Efficiency:** By eliminating the GUI rendering overhead, PDFim reduces memory usage by **30%** compared to standard viewers like Evince.
* **Latency:** Enables zero-latency scrolling of complex PDFs over SSH connections, streamlining the workflow for researchers on compute clusters.