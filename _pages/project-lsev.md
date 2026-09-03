---
layout: single
title: "LSEV USA Corp"
permalink: /projects/lsev/
classes: wide
---
**Role:** AI Intern | **Stack:** Python, TypeScript, DeepSeek, Postgres | **Time:** June 2026 - August 2026

A product intelligence pipeline uses LLMs to extract claims from user reviews and map them onto canonical product traits. The open question was which of those published claims could be trusted, across 2,444 products and 14,005 mappings.

## Certification Problem

The pipeline already had a verification pass: one model flagged suspect mappings, and a three-judge consensus from the same model family certified the flags at 92% precision. That number cleared the bar for automated removal.

We hand-labeled 50 flagged cases before enabling it. Agreement came out at roughly 13%.

A controlled ablation isolated the cause. Running the same cases with a judge from a different model family dropped the estimate from 92% to 25%. It turns out the original certification's agreement between models was affected by whether they shared a training lineage.

## What the Errors Were

Roughly 85% of mappings had real human reviews as evidence but with a wrong sentiment label attached. We don't have to delete a positive comment labeled as a negative review, we only have to label it correctly.

That distinction drove the redesign. Instead of one judge asking "is this bad," our validation split into two passes: does the supporting evidence exist, and is the sentiment correct. Published claim errors dropped 65% across all 2,444 product pages.

## Rebuilt Filter

The replacement uses cross-family judging and source re-grounding, verifying claims against the original review text rather than asking a model whether another model was right. Measured against a 300-product gold set labeled by two annotators, it reaches 96% agreement.

Enforcement is in-place and reversible, validated end-to-end by mutating and fully restoring published records with no residual corruption.

## Cost Control at the Front End

Product search queries hit a three-layer cascade before reaching any judge: a deterministic gibberish gate, then web-search grounding, then an LLM judge. 80% of queries resolve at the first layer in under 40ms at zero API cost, cutting LLM spend 82% against judging every query.

The judge extracts structured facts; deterministic code makes the final call. That separation is what keeps announced-but-unreleased products from being classified as real.
