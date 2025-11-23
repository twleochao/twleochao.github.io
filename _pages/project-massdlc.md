---
layout: single
title: "Acer: Multi-Agent SDLC Automation"
permalink: /projects/massdlc/
classes: wide
---
**Role:** SWE Intern (Acer AI Cloud) | **Stack:** Google Vertex AI, Agent Dev Kit (ADK), LangGraph, Firestore | **Status:** Intern Project (Summer 2025)

Generative AI can write code, but it often lacks the state management required for enterprise workflows. During my internship at Acer's AI Cloud team, I architected a **Human-in-the-Loop (HITL)** multi-agent system to automate the Software Development Life Cycle (SDLC).

<figure>
  <img src="/assets/images/acer-architecture.png" alt="Multi-Agent System Architecture">
  <figcaption>Figure 1: The orchestration layer that coordinates 10+ subtasks while enforcing human approval gates.</figcaption>
</figure>

## The Architecture: Orchestration
The system needed to decompose a raw Software Requirement Specification (SRS) into executable artifacts. I initially prototyped this in LangGraph but migrated to **Google's Agent Development Kit (ADK)** to leverage robust memory management.

The final system orchestrates **10+ dynamic subtasks**, ranging from SRS-to-Architecture translation to API stub generation. We tightly coupled this with **6 GCP services**, using **Firestore** to maintain persistent agent state and Cloud Storage for artifact management.

## The "Controllability" Problem
To prevent the agents from hallucinating or going off-rails, I enforced strict observability patterns. I built **State Guardrails** that prevent the system from transitioning between critical phases (e.g., Architecture $\to$ Code) without explicit human approval. Every tool call is serialized to Firestore, creating a traceable audit log of *why* a decision was made.

## Outcome
We containerized the system for the internal Google Agentspace. In a controlled one-week evaluation, the system reduced manual implementation time by **35%** compared to the team's baseline sprint velocity.