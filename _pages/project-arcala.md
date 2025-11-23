---
layout: single
title: "UCI ARACLA Research Lab"
permalink: /projects/arcala/
---

Our research lab under Prof. Thomas Yeh tackles the following question: "As Large Language Models and other AI assistants enter the classroom, how can we measure the amount of students' thinking that is  being "offloaded" to the model? 

Our work at ARCALA Lab aims to building the **observability framework** for this level of offloading, and discover ways to reduce this offloading so LLMs can be used in beneficial ways. 
<figure>
  <img src="/assets/images/chat-bloom-diagram.jpg" alt="The Chat-Bloom Taxonomy Diagram">
  <figcaption>Figure 1: The Chat-Bloom framework used to classify student/assistant interaction intent, ranging from low-effort "Recall" to high-effort "Create".</figcaption>
</figure>

## The Instrument: iGPT
We developed a custom LLM chatbot that uses various "response speed" and style to measure how students would react differently. We built **iGPT**, a custom chat interface using **Next.js and the Vercel AI SDK**. 
Unlike a standard chatbot, iGPT was instrumented to capture interaction metadata in real-time. We deployed this to 234 students across CS0/CS1 courses, collecting a dataset of **8,076 interactions**.

## The Methodology: Bloom's Taxonomy Classification
We needed a way to classify the chat-bloom level of every prompt (e.g., is the student asking "Remind me of the syntax" or "Complete this assignment"?). 

We had multiple lab members manually classify logs, developing strategies and guidelines so we achived interrater reliability of >70%. 
Then with BERT-Large and DistilBERT models trained on our manually labeled "ground truth" dataset, our final ensemble model achieved 85-90% accuracy, allowing us to visualize the "cognitive trajectory" of students and models over entire quarters. 

## Key Finding
We discovered that "system design" dictates behavior. When we tweaked the AI to withhold direct answers (a "Redirect" strategy), we saw a measurable shift in student prompting from "Recall" (low effort) to "Analyze" (high effort). This suggests that "cognitive offloading" can be impacted by model design choice. 