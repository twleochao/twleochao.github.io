---
layout: single
title: "Acer: Multi-Agent SDLC Automation"
permalink: /projects/massdlc/
toc: true
toc_label: "System Architecture"
toc_icon: "network-wired"
header:
  overlay_image: /assets/images/acer-architecture.png
  overlay_filter: 0.5
  caption: "Multi-Agent System Architecture"
sidebar:
  - title: "Role"
    text: "Software Engineering Intern"
  - title: "Tech Stack"
    text: "Google Vertex AI, Agent Development Kit (ADK), LangGraph, GCP (Firestore, Cloud Storage)"
  - title: "Date"
    text: "June 2025 - Aug 2025"
  - title: "Team"
    text: "Acer AI Cloud (Taipei)"
---

<p class="notice--info">
  <strong>Engineering Challenge:</strong> Generative AI can write code, but can it manage a project? This project explored how to orchestrate multiple AI agents to handle the full Software Development Life Cycle (SDLC)—from requirements to deployment—while keeping humans strictly in the loop.
</p>

At Acer's AI Cloud team, I initiated and developed a multi-agent system designed to automate the high-friction coordination steps of software engineering.

## 1. The Architecture: Orchestration over Generation

The core innovation wasn't just generating code; it was **process control**. I migrated our initial prototype from LangGraph to **Google’s Agent Development Kit (ADK)** to achieve enterprise-grade reliability.

* **The Workflow:** The system breaks down a Software Requirement Specification (SRS) into 10+ dynamic subtasks, including:
    * SRS-to-Architecture Diagram translation.
    * API Stub Generation.
    * Test Case Drafting.
* **Integration:** I architected the integration with **6 GCP services**, using Cloud Storage for artifact management and Firestore for persistent agent memory.

## 2. Controllability: The Human-in-the-Loop

A key theme of my research is that AI should be steerable. I designed this system to be **observable by default**.

* **Approval Gates:** Unlike "black box" agents, this system pauses at critical state transitions (e.g., before merging code or deploying infrastructure), requiring explicit human sign-off.
* **Audit Logs:** Every agent decision and tool call is logged to Firestore, allowing engineers to trace *why* an architectural decision was made.

## 3. Deployment & Impact

This wasn't just a toy project; it was built for production.

* **Containerization:** I containerized the entire agent system and deployed it to GCP, creating the production path for its integration into the internal **Google Agentspace**.
* **Results:** In a controlled one-week prototype evaluation, the system reduced manual implementation time by **35%** compared to the team's previous sprint baseline.

## 🛠️ Technical Deep Dive

* **Refactoring for Reliability:** Moving from LangGraph to ADK required refactoring the entire memory management layer to support long-running, stateful agent interactions.
* **Dynamic Execution:** The system doesn't just follow a script; it dynamically drafts test cases based on the generated API stubs, closing the loop between design and verification.