---
layout: single
title: "Acer: Multi-Agent SDLC Automation"
permalink: /projects/massdlc/
classes: wide
---
**Role:** SWE Intern (Acer AI Cloud) | **Stack:** Google Vertex AI, Agent Dev Kit (ADK), LangGraph, Google Cloud | **Status:** Intern Project (Summer 2025)

Generative AI can write code, but it often lacks the state management required for enterprise workflows. During my internship at Acer's AI Cloud team, I designed a **Human-in-the-Loop (HITL)** multi-agent system to automate the Software Development Life Cycle (SDLC).

<figure>
  <img src="/assets/images/mas_architecture.jpg" alt="Multi-Agent System Architecture">
  <figcaption>Figure 1: Diagram showing the interaction/workflow of the Multi-Agent System.</figcaption>
</figure>

## The Architecture: Orchestration Agent
The system would first converse with the user to get a good understanding of their idea, requirements, preferred tech stack etc. It then started the entire SDLC, creating Software Requirement Specification (SRS), High-Level Design (HLD) diagrams, code, testcases etc. I initially prototyped this in LangGraph but migrated to **Google's Agent Development Kit (ADK)** to leverage GCP's tools and memory management.

The final system orchestrates 10+ dynamic subtasks, ranging from SRS to architecture diagram translation to API stub generation. We tightly coupled this with **6 GCP services**, using Firestore to maintain persistent agent state and Cloud Storage for artifact management.

## The Problem: Agent Control
To prevent the agents from hallucinating or going off-topic, I enforced strict observability attributes. I built guardrails that prevent the system from transitioning between critical phases (e.g., SRS to HLD) without explicit human approval. Every tool call is serialized to Firestore, creating a traceable audit log of why and what decision was made.

## Outcome
We containerized the system for our internal Google Agentspace. In a controlled one-week evaluation, the system reduced manual implementation time by **35%** compared to the team's baseline sprint time.