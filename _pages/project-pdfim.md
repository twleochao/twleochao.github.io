
---
layout: single
title: "PDFim: Terminal PDF Reader"
permalink: /projects/pdfim/
toc: true
toc_label: "Technical Design"
toc_icon: "terminal"
header:
  overlay_image: /assets/images/pdfim-demo.gif
  overlay_filter: 0.5
  caption: "PDFim in Action"
sidebar:
  - title: "Role"
    text: "Sole Developer"
  - title: "Tech Stack"
    text: "Python, curses, PyMuPDF (fitz)"
  - title: "Date"
    text: "Jan 2025 - Feb 2025"
  - title: "Focus"
    text: "HCI & Low-Resource Computing"
---

<p class="notice--info">
  <strong>The UX Problem:</strong> Reading multi-column academic papers on a remote server or low-end machine is painful. You either lag with X11 forwarding or struggle with <code>pdftotext</code> losing all formatting. I wanted a tool that respected the document structure while staying purely in the terminal.
</p>

PDFim is a Vim-like terminal PDF viewer that intelligently reflows academic papers for reading in a CLI environment.

## 1. The "Adaptive Layout" Engine

The core engineering challenge was converting static PDF coordinates into a responsive text stream without losing the reading order of multi-column papers.

* **Heuristic Parsing:** I built a custom layout engine using **PyMuPDF**. It analyzes text block coordinates to detect column boundaries and headers dynamically.
* **Re-Flow Logic:** Instead of naive text extraction, the system identifies "reading zones." It serializes the left column first, then the right, stitching them into a single readable stream for the terminal window.

## 2. Vim-like HCI Design

As a developer, I live in the terminal. I wanted a tool that fit my existing muscle memory.

* **Keybindings:** Implemented `j/k` for scrolling, `G` for bottom, and `/` for regex search using the **curses** library.
* **Visual Mode:** Added a visual selection mode for copying citations or code snippets directly to the system clipboard, bridging the gap between the CLI viewer and external editors.

## 3. Performance & Impact

* **Efficiency:** By stripping away the GUI overhead, PDFim reduces memory usage by **30%** compared to standard viewers like Evince or Okular.
* **Accessibility:** It enables reading complex PDFs over SSH connections with zero latency, making it ideal for researchers working on remote compute clusters.

## 🛠️ Key Takeaway

This project was an exercise in **constraint-based design**. By removing the GUI, I had to solve the "layout problem" algorithmically, proving that user experience is about *flow*, not just pixels.kl