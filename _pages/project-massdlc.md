---
layout: single
title: "Acer: Multi-Agent SDLC Automation"
permalink: /projects/massdlc/
toc: true
toc_label: "Architecture"
header:
  overlay_image: /assets/images/acer-architecture.png
  overlay_filter: 0.5
  caption: "Controllable Multi-Agent Systems"
sidebar:
  - title: "Role"
    text: "Software Engineering Intern"
  - title: "Stack"
    text: "Google Vertex AI, Agent Dev Kit (ADK), LangGraph, Firestore"
  - title: "Impact"
    text: "35% reduction in manual iteration time"
---

**Problem:** Generative AI often lacks the state management and reliability required for enterprise workflows. During my internship at Acer's AI Cloud team, I architected a **Human-in-the-Loop (HITL)** multi-agent system to automate the Software Development Life Cycle (SDLC).

## 1. Orchestration Architecture
The system decomposes a Software Requirement Specification (SRS) into executable subtasks.
* **Migration to ADK:** I initially prototyped the system in LangGraph but migrated to **Google's Agent Development Kit (ADK)** to leverage robust memory management and enterprise integration.
* **Dynamic Workflows:** The system orchestrates 10+ dynamic subtasks, including SRS-to-Architecture translation, API stub generation, and automated test case drafting.
* **Integration:** Tightly coupled with **6 GCP services**, using **Firestore** for persistent agent memory (state) and Cloud Storage for artifact management.

## 2. Controllability & Observability
To address the "black box" nature of agents, I enforced strict observability patterns:
* **State Guardrails:** The system cannot transition between critical phases (e.g., Architecture $\to$ Code) without explicit human approval.
* **Audit Logging:** Every agent decision and tool call is serialized to Firestore, creating a traceable lineage of *why* code was generated a certain way.

## 3. Production Deployment
* **Containerization:** I containerized the agent system for deployment into the internal Google Agentspace.
* **Performance:** In a controlled one-week evaluation, the system reduced manual implementation time by **35%** compared to the team's baseline sprint velocity.