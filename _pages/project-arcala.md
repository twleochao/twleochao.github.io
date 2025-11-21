---
layout: single
title: "Chat-Bloom: Measuring Cognitive Offloading"
permalink: /projects/arcala/
sidebar:
  - title: "Lab"
    text: "ARCALA (Prof. Thomas Yeh)"
  - title: "Output"
    text: "Paper under revision (ITiCSE '26)"
---

As Large Language Models enter the classroom, there is a fear that students are "offloading" their thinking to AI—getting the answer without understanding the concept. But how do we actually measure this?

Existing metrics like "correctness" or "time-on-task" don't capture *cognitive effort*. My work at ARCALA Lab focused on building the **observability layer** to quantify exactly how much students rely on AI.

## The Instrument: iGPT
We couldn't use standard ChatGPT logs because they lack granular telemetry. I built **iGPT**, a custom chat interface using **Next.js and the Vercel AI SDK**. 
Unlike a standard chatbot, iGPT was instrumented to capture interaction metadata in real-time. We deployed this to 234 students across CS0/CS1 courses, collecting a dataset of **8,076 interactions**.

<figure>
  <img src="/assets/images/chat-bloom-diagram.jpg" alt="The Chat-Bloom Taxonomy Diagram">
  <figcaption>Figure 1: The Chat-Bloom framework used to classify student intent, ranging from low-effort "Recall" to high-effort "Create".</figcaption>
</figure>

## The Methodology: Automating Bloom's Taxonomy
Manually coding thousands of chat logs is impossible at scale. We needed a way to classify the "cognitive depth" of every prompt (e.g., is the student asking "Answer this" or "Explain this"?).

I led the training of our automated classifiers:
* I fine-tuned **BERT-Large and DistilBERT** models on our manually labeled "ground truth" dataset.
* To handle class imbalance (since most students just ask for answers), I implemented a **weighted loss function** during training.
* The final ensemble achieved **~85-90% accuracy**, allowing us to visualize the "cognitive trajectory" of a student over an entire quarter.

## Key Finding
We discovered that "system design" dictates behavior. When we tweaked the AI to withhold direct answers (a "Redirect" strategy), we saw a measurable shift in student prompting from "Recall" (low effort) to "Analyze" (high effort). This suggests that "cognitive offloading" isn't just a student trait—it's a UI design choice.