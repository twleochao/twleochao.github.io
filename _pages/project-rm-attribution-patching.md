---
layout: single
title: "Investigating what activation patching measures in reward models"
permalink: /projects/rm-attribution-patching/
classes: wide
---
**Role:** Independent Research Project | **Stack:** Python, PyTorch, HuggingFace Transformers, reward-lens | **Time:** July 2026 - September 2026 | **Repo:** [GitHub](https://github.com/twleochao/rm-attribution-patching)


## TL;DR

In [reward-lens: A Mechanistic Interpretability Library for Reward Models](https://arxiv.org/abs/2604.26130) (Nadaf, 2026), the author reports that linear attribution does not predict the effect of causal activation patching. This work reproduces that at scale and re-diagnoses what it means:

- At early layers, splicing in activations from an unrelated conversation moves the reward more than splicing in the rejected answer, in 84 of 100 pairs.
- When controlling for how much disturbance reaches the scoring position, the rejected answer produces no more effect than the unrelated conversation.
- This indicates that an early-layer patch effect measures how easily the reward is impacted when its early computation is disturbed, not how much information that component carried.
- Reproducing the paper's attribution-patching disagreement at n=100 gives a mean of -0.276. 34 pairs sits below the noise floor, 10 come out positive, and the paper's single helpfulness pair (-0.445) sits at the 19th percentile. The disagreement varies far more from pair to pair than a single pair can show.
- Fixing a bug in the attribution formula only closed ~4% of the disagreement, even though the formula misses 47-58% of the reward. Matching where the attribution reads to where the intervention acts has no detectable effect.
- The disagreement concentrates where the preferred answer is longer (-0.355 vs -0.077 where it is shorter). Freezing the never-patched tail shows that it has a big impact on early-layer effect size but only minor impact for ranking disagreement. The tail inflates early effects proportionally without reordering them.


## 1. Why this matters

Activation patching has become the closest thing interpretability has to a ground truth. To find out whether a component matters, we intervene on it and watch how the output moves, and we trust that number more than any correlational method. Cheaper methods like linear attribution get judged by how well they line up with it: if they agree with patching, then the cheap method is taken as validated.

However, that only works if patching measures what we think it does. This work is about a case where it does not, at least in the early layers, and about what a patch effect there is really reporting. If the causal ground truth is tracking something other than importance, then the results validated against it inherit the problem.

Reward models are a good place to look, because the whole network resolves to a single number. There is one output to attribute, so "how much did this component contribute" is well defined, without the which-token, which-logit ambiguity of a language model.


## 2. The claim we're extending
The paper we are extending is Nadaf's reward-lens, a library that ports mechanistic interpretability tools over to reward models. Its headline result is negative, across two production reward models linear attribution does not predict the causal effect of activation patching. However, the check behind that claim is very small: they only had one preference pair per dimension, patched under noising (splicing activations from the rejected answer's forward pass into the preferred answer's), comparing the attribution and patching rankings across the 64 components (each layer's attention and MLP block, over 32 layers). On Skywork-Reward-Llama-3.1-8B, for helpfulness, the single pair gives a Spearman correlation of -0.445 (the reported mean across their three dimensions is -0.256). Interpreting the disagreement, they trace it to the early layers and take those layers to be load-bearing, carrying content the later layers cannot reconstruct.

We take the negative result seriously and try to take it apart, in three steps and in this order. First, correct the attribution formula in the library, it skips the reward head's final normalization. Second, check whether the disagreement survives the correction, and survives matching the two methods' token scope. Third, if it survives, explain what is left.

We disagree with the paper on only one factual point. Their appendix says the per-component accounting identity, that the contributions plus the bias recover the model's own reward, holds to floating-point precision. We could not reproduce that for the formula as shipped on this model: the contributions miss between 47 and 58 percent of the reward. We take no position on their own test fixture, which may well be a setting where the identity does hold. We only report that it does not hold for the shipped formula on a Llama-family reward model.

## 3. Reproducing the disagreement

To reproduce the disagreement, we take 100 helpfulness pairs from the Chat category of RewardBench and for each one rank the 64 components twice: once by their attribution scores, and once by their patching effects. Then we measure how closely the two rankings agree with a Spearman rank correlation. Averaged across the 100 pairs, that correlation is -0.276, with a bootstrap 95% interval of [-0.316, -0.236]. The interval sits well below zero, so we were able to reproduce the disagreement: the components attribution calls important are not the ones patching calls important.

However, the average doesn't show how uneven this is. The per-pair correlations were spread across a wide range and many of them carried no signal. We set a value of ±0.22 as the noise floor, the correlation that you would get by chance from random attribution directions. Measured against it, 34 of the 100 pairs fall inside the floor, so for a third of the helpfulness pairs there is no detectable disagreement. 10 pairs come out positive, meaning the two methods agree, with the most agreeing pair at +0.287. So the disagreement is not a uniform property of the model. It's strong on some pairs, gone on many, and reversed on a few.

![Distribution of per-pair correlation across the 100 pairs.](/assets/images/rm-faithfulness/fr_rho_distribution.png)
*The shaded band is the ±0.22 noise floor; the paper's single helpfulness pair (-0.445) is marked at the 19th percentile.*

Placing the paper's reported value for helpfulness, the single pair at -0.445, on our distribution lands it at the 19th percentile: a strong example but not a typical one. Reading it this way is an inference on our part. Their exact pair is not recoverable from the paper, so we cannot confirm this, though we used the same model and the same category. The typical disagreement is much milder, and more variable, than a single pair can show.

## 4. Two explanations that don't work
Before we try to explain the disagreement, we should rule out a boring possibility: that the disagreement is an artifact of how we compute the two sides, not an actual difference between them. There are two obvious ways that could happen. The first comes down to a single formula, so let's start there. Throughout this section the comparisons are paired: the patching effects stay fixed and we change only how attribution is computed. This way, when we measure the change in correlation pair by pair any movement comes strictly from the attribution side. 

The reward model scores a response by taking the residual stream $h$ at the final token, normalizing it, and reading it out along a learned direction:

$$\text{reward} = w_r \cdot \left( \frac{\gamma \odot h}{\text{rms}(h)} \right) + b$$

That is just an RMSNorm followed by a linear head. $\gamma$ is a learned per-dimension gain, $rms(h)$ is a single number for how big the stream is on this input, $w_r$ is the direction the head reads, and $b$ is a bias. Attribution takes this score apart into one number per component so we can ask which components the reward leans on. Two terms come up repeatedly from here on. **Completeness** is whether the per-component numbers add back up to the reward and **Disagreement** is whether attribution and patching put the components in the same order. Intuitively, Completeness is about size and Disagreement is about order.

Start with the formula itself. To score a component, the library projects it onto the raw direction $w_r$ and ignores the normalization the head does. The fix is to put the normalization back: project onto $\gamma \odot w_r$ then divide by $rms(h)$. Completeness tells us what the library's shortcut method costs. We add up the contributions and compare the total to the reward the model gave, on five pairs (both sides of each). The library's version comes up 47-58% short. The corrected version lands within 0.004 to 0.025 reward units of the reward, so it recovers basically the whole score.

Since the formula is off by about half the reward, one might expect fixing it to matter a lot. It barely does. The correlation moves by +0.0104 [+0.0037, +0.0171], about 4 percent of the way to zero. This is because most of the correction is a single number applied to a whole side at once, and scaling every component on a side by the same amount leaves their order alone, so a rank correlation hardly moves.

Splitting the fix in two makes this more clear. The per-dimension gain $\gamma$ is the part that could reorder components, and it does nothing (if anything it hurts a little, -0.0040 [-0.0072, -0.0010]). The per-forward scale $\frac{1}{\text{rms}(h)}$ is the part that moves the number (+0.0145 [+0.0084, +0.0204]), and it moves it for a particular reason: each side of the pair is divided by its own rms, so it only bites when the two sides are scaled differently. That gives us something to check. If that is the mechanism, the pairs whose two sides are scaled most differently should move the most, and they do. A pair's ranking change tracks how far apart its two scales are (Spearman +0.454), and the third of pairs with the widest mismatch move about three times as much as the narrowest (0.039 vs 0.014). We also checked that the scale mismatch is a separate variable from answer length, since length asymmetry matters so much later on: the two are essentially unrelated (-0.105). We are inferring here rather than measuring, since we watched the ranking move where the mechanism predicts instead of setting the scale ourselves.

| step | paired change in correlation | 95% interval |
|---|---|---|
| fix the formula | +0.0104 | [+0.0037, +0.0171] |
| match the scope | -0.0046 | [-0.0347, +0.0252] |
| both together | +0.0058 | [-0.0236, +0.0350] |
| over-match to all positions | +0.0560 | [+0.0340, +0.0789] |

Positive means the correlation moved toward zero.

![The correction steps and their intervals.](/assets/images/rm-faithfulness/fr_gap_ladder.png)
*Each step is a paired per-pair change. The formula fix and the scope match barely move the correlation off where it reproduced.*

The second thing to rule out is scope. The library's attribution reads only the final token, while patching touches every position in the response window. If we line them up by computing attribution over that same window, on average still nothing happens (-0.0046, the interval spans zero). Go the other way, reading attribution over every position including the long tail patching never reaches, and the two methods agree less rather than more (+0.0560 toward zero). The tail holds more than half of attribution's mass on average (57 percent), and patching never touches it, so the natural read is that this mass is just noise for predicting patch effects. We can't fully pin that down: if the tail were the culprit, the pairs with the biggest tails should lose the most agreement, and they don't (+0.075). What we can say with confidence though is the direction. Reading past the response window only ever hurts, so there is no reason to attribute over positions the intervention can't reach.

One tempting shortcut is worth warning against. Instead of lining attribution up to the patched window, you might want to line the patching up to a single position and patch only the last token. That approach backfires: last-token patching suppresses the early layers and inflates the late ones. It produces under a tenth of the full-patching effect early (0.087) and more than double it late (2.554). Related figure is in the appendix.

Neither of these explains the disagreement. After both corrections, about 95 percent of it is still there.

## 5. What patching measures

After fixing the formula and matching the scope, 95 percent of the disagreement still stood. So since attribution and patching obviously disagree, we now have to figure out why. We found that the two methods differ because they simply don't measure the same thing at early layers.

Our experiment started with a control, for each pair and each of the 64 components we will run the patch two ways. (1) splice in the activation from the dispreferred completion, i.e. the answer that the model rejected. (2) splice in the activation from a completely unrelated pair, content free with respect to this one. We hypothesize that if an early-layer patch effect is about information, the alternative should matter more and have a stronger impact than a stranger; on the other hand, if the two produce the same effect, then the effect is not about content.

The unrelated donors are assigned by a seeded and length-matched derangement: pairs are sorted by length and cyclically shifted. This way no pair ever donates to itself and the donor lengths match roughly, which keeps the two conditions' perturbation sizes comparable. We also never patch the full sequence, only the response region. The matched donor shares the pair's prompt, so patching a prompt position would have no effect; the unrelated donor's prompt is different text, and would cause a meaningful effect if its prompt positions were patched. Meaning if we patched the whole sequence, the unrelated condition would have extra disruption that the matched condition doesn't have (testing this got +1.08 of mean effect on the early layers). Tests show that our patching works nicely: splicing in a run's own activation back produces exactly zero effect as expected, against a floor of 0.158 (1% of the typical reward difference, below which we treat an effect as noise).

We found that in the early layers (L0-7) the unrelated donor moves the reward more than the alternative, a mean ratio of 1.255, and 84 of 100 pairs individually. The ratio stays above 1 through the middle of the network and only drops below it near the output, where the late layers (L24-31) show a small reversal, at 0.893. Meaning, the model only begins to care about what you splice in when you're close to the score.

![Mean |patch effect| by layer for the two donor conditions, and their ratio.](/assets/images/rm-faithfulness/fr_e5_specificity.png)
*In the early layers the unrelated donor disrupts the reward more than the real alternative; the ratio only drops below 1 near the scoring position.*

One could argue that unrelated activations are further out of distribution, so of course they have a larger impact. Therefore the alternative could still be carrying a content signal underneath a gentler perturbation. Fact is, random is a bigger hit, it delivers about 8% more disturbance to the score and 12% more early. So rather than looking for hit size we decided to hold it fixed and look again. For each patched forward pass we record how far the residual stream at the scoring position has moved from its original value, i.e. the disturbance that was delivered to the score, and ask how much reward movement each unit of that disturbance causes. Per unit delivered, the alternative produces no more effect than a stranger. Binned by delivered disturbance, the two curves lie almost on top of each other, and the paired per-operation comparison favors the matched donor in 47% of cases, nearly a coin flip. There is a slight excess for random if a line is fitted onto it (an interaction of -2.53 interval [-5.44, -0.34]), but that occurs in the high-disturbance bins only. We rest our argument on the absence of any matched premium.

![Reward movement per unit of disturbance delivered to the scoring position, binned.](/assets/images/rm-faithfulness/fr_e4_binned.png)
*At equal delivered disturbance, the real alternative and the unrelated donor are indistinguishable.*

If the effect scales with how out-of-distribution the insert is rather than with how meaningful it is, then the effect is content-independent, which is what we're claiming.

Therefore, we infer that an early-layer patch effect measures how easily the reward is knocked around when its early computation is disturbed, not how much information that component carried. We build the premise on the two controls: the unrelated donor disrupts at least as much as the alternative, and that content adds nothing to the per unit of disturbance that reaches the scoring position. If content mattered, one of those would have favored the alternative. It is also what you would expect given the reward is read off the last token, so a perturbation introduced early has a long chain to propagate through and compound, while one near the output has almost none. One weak point is that the disturbance measure is observational, a regression across patch operations and not a randomized manipulation. Another is that disturbance at the scoring position sits close to the reward movement by construction; we lean on the comparison between the two donors at equal disturbance because whatever circularity the measure has is the same for both, and cancels out of the contrast.

When we split the pairs by whether the preferred answer is longer, the same length, or shorter, the unrelated donor still wins in each group, at 84%, 93%, and 78% of pairs respectively, so the pattern does not depend on length.

Finally, this locates the surviving disagreement in the network. We recompute the per-pair correlation on subsets of components by depth. Dropping the 16 early-layer components moves the mean from -0.276 to -0.114 (paired +0.155, interval [+0.133, +0.177], 89 of the 100 pairs toward zero, fifteen times the size of the formula fix). When restricted to the late half of the network, the two methods agree weakly, at +0.136. The correlation flips sign around layer 15, close to where the unrelated donor's advantage fades, so the two boundaries roughly line up. However, this is post-hoc and supporting rather than pre-registered, and correlations taken over different numbers of components are not directly comparable, so the paired within-pair contrast is the more trustworthy statistic. The -0.114 that remains lives around layer 8-15, still inside the content-free zone. More than half of the anticorrelation is carried by the components the control shows to be content independent. Putting the two measurements together, the disagreement lives in the early layers and the early layers do content-independent disruption, so we conclude that the surviving disagreement is dominated by early-layer disruption.

![Per-pair correlation recomputed on depth subsets of the network.](/assets/images/rm-faithfulness/fr_layer_decomposition.png)
*Dropping the early-layer components removes most of the anticorrelation; the late half of the network alone weakly agrees.*


## 6. Where the disagreement lives

The disagreement tracks answer length. Split the 100 pairs by whether the preferred answer is longer than the rejected one, about the same length, or shorter. Where the preferred answer is longer the mean correlation is -0.355, with 11 of 63 pairs below the noise floor. Where the two are about the same it is -0.169 (6 of 14). Where the preferred answer is shorter it is -0.077, and 17 of those 23 pairs sit inside the noise floor, so on most of them there is nothing to explain.

![The disagreement by length group.](/assets/images/rm-faithfulness/fr_length_story.png)
*Per-pair correlation against how much longer the preferred answer is, with the three group means. The disagreement is a preferred-longer phenomenon; shorter-preferred pairs sit mostly in the noise band.*

Length is not the only thing that predicts the disagreement. How confidently the model prefers one answer, i.e. the size of the score difference between the two, predicts it as well, though more weakly. Across the full pool of 100 pairs, a pair's disagreement correlates -0.24 with confidence and -0.52 with length. So which one is doing the work? To separate them we build matched subsets, groups of pairs in which one property is held nearly constant, and check whether the other still predicts the disagreement inside them. This only works because the two properties barely move together in our pool (they correlate at -0.19), so matching on length leaves confidence free to vary and the other way around. Had they been tightly coupled, matching one would have flattened the other and the comparison would have meant nothing.

There is one reading we should rule out first. Length's estimate stays clearly below zero once we control for confidence, while confidence's slides toward zero once we control for length, and it is tempting to call length significant and confidence not , and declare length the winner. The argument is invalid because the difference between "significant" and "not significant" is itself not significant, and with 30 to 58 pairs per subset the intervals are wide enough that the comparison settles nothing. So we argue from the shape of the estimates instead. The three matching widths per direction were fixed before the sweep ran, so no single cutoff drives the verdict.

| held fixed | effect tested | n | estimate [95%] | fraction of pool |
|---|---|---|---|---|
| length, tight | confidence | 30 | -0.174 [-0.53, +0.24] | 74% |
| length, medium | confidence | 35 | -0.138 [-0.49, +0.24] | 59% |
| length, wide | confidence | 44 | -0.089 [-0.40, +0.24] | 38% |
| confidence, tight | length | 34 | -0.412 [-0.69, -0.01] | 79% |
| confidence, medium | length | 51 | -0.411 [-0.64, -0.11] | 79% |
| confidence, wide | length | 58 | -0.426 [-0.65, -0.14] | 81% |
| confidence, subsampled to n=44 | length | 44 | -0.295 [-0.59, +0.06] | 56% |

Pool correlations: confidence -0.235, length -0.523. Fraction of pool is the estimate over that pool value. The last row cuts the confidence-matched subset down to 44 pairs, the size of the largest length-matched subset, so both directions can be compared at equal size.

Three things line up. First, confidence decays as we let the length-matched subset grow: -0.174 at the tightest match, then -0.138, then -0.089 by the time it reaches 44 pairs. Second, length does the reverse. Held inside confidence-matched subsets it keeps about 80 percent of its pool value at every band. Third, reading each as a fraction of its own pool value makes the split clear: confidence retains 74, then 59, then 38 percent and dropping, while length holds near 80 and flat.

So the disagreement tracks length or something related to it and not confidence. However, since we didn't actually intervene on length, this is an inference from the matched estimates and not a direct measurement.

## 7. Freezing the tail

The last thread is the tail. Every pair has a stretch of response that patching never touches. Since we only patch the shared window which runs up to the length of the shorter answer, anything past it is left alone. That leftover stretch is the tail, and two things make it worth a look. On average it holds more than half of attribution's mass (57 percent), and the amount sitting there tracks whether the preferred answer is the longer one (+0.531). The disagreement concentrates in those same preferred-longer pairs, so the natural guess is that the tail is how length feeds it.

If the tail feeds the disagreement, it can do so in one of two ways. The first is that attribution reads the tail directly, which is plausible since most of its mass sits there. We tested that in section 4: matching attribution's scope to the window did nothing, and the penalty from reading past the window does not track how big a pair's tail is (+0.075). So the tail is not acting through attribution.

That leaves the forward pass. The reward is read off at a single position, the last token of the response. And for a preferred-longer pair that position sits out in the tail and therefore past the window. Our hypothesis is that when we patch a component inside the window, the disturbance to the residual stream there travels forward, layer by layer, through the tail positions before it reaches the position where the score is read. The longer the tail, the more of the forward pass that disturbance builds up across. 

We can test this by freezing the tail. We patch the window exactly as before, but at every tail position we pin every component's output back to its clean, unpatched value, so no disturbance is allowed to build up there. The one position we leave alone is the scoring position itself, since pinning that would just hand back the clean reward by construction (we checked: freezing it too collapses a +8.63 effect to zero). Whatever effect survives the freeze reached the score by the direct route from the window to the readout; whatever vanishes was travelling through the tail. We run this on the 30 preferred-longer pairs with the largest tails. The controls came out as expected: freezing with no patch, and patching a run into itself with the tail frozen, both give exactly zero on all 30, and the unfrozen condition reproduces the main sweep exactly.

Freezing the tail removes about 30 percent of the early-layer effect: the mean absolute effect in layers 0 to 7 falls from 2.89 to 2.05, a mass-weighted tail share of 0.29. The drop is broad, with 21 of 30 pairs attenuating by more than a fifth. It also has a shape. The share sits around 0.2 to 0.4 through the early layers, decays through the teens, and is essentially zero from layer 16 on. That is what forward propagation predicts, since a layer-2 perturbation has thirty layers to travel through and a layer-28 one has almost none. It is also the fourth separate measurement to put a boundary near layer 15. Both attention and MLP components show it.

If the tail carries that much of the early effect, freezing it should also pull the rankings back toward agreement. It barely does. The paired change in correlation is +0.040 [+0.008, +0.077], nominally toward zero on 19 of 30 pairs, but it is carried by three of them (+0.34, +0.24, +0.19); drop the top two and the interval crosses zero. The median pair closes +0.007. Against the unfrozen baseline of -0.39 on these 30 pairs that is about a tenth of the disagreement, and which pairs close does not track how long their tails are (-0.09) or how much their own effects attenuated (-0.21).

![Tail-frozen patching.](/assets/images/rm-faithfulness/fr_tail_frozen.png)
*Left: the tail-mediated share of the patch effect by layer, near a third in the early layers and zero from layer 16. Right: the per-pair change in correlation from freezing the tail, small and carried by a few pairs.*

So the tail's two possible roles come apart. Freezing the tail shrinks the effects but keeps their order: within a pair, the open and frozen effect rankings still agree at about 0.91. The disagreement is not a property of the early layers on their own. It comes from the contrast between early and late, where early effects run about 16 times larger than late ones while attribution ranks the late components highest. Freezing the tail shrinks that contrast in 26 of 30 pairs, but only from about 16.5 to 12.5. And a rank correlation does not move under a proportional shrink until the orderings actually cross, which they mostly do not. So the tail is a pathway for how big early-layer effects get, but only a minor one for why the rankings disagree.

## 8. Limitations & Boundaries

Everything here comes from one reward model, and several of the claims above are inferences rather than direct measurements. The main limits are these.

- The fragility reading is an inference. The disturbance we control for is something we observed across patch operations, not something we set, so what we can claim is that content adds nothing on top of disturbance, not that we isolated disturbance as the cause.
- Length as the driver is also an inference. We never intervened on length. We compared matched subsets and read off which effect held up.
- The size-equalized check is the weakest part of the length result. When the confidence-matched subset is cut down to 44 pairs, the size of the largest length-matched subset, length's estimate falls to -0.295 and its interval crosses zero. It points the same way, but it is underpowered at that size.
- The matched subsets are not a random sample of the pairs. Pairs whose answers are nearly equal in length are an unusual kind of pair, so the length-versus-confidence conclusion holds within the regimes we matched on and may not hold across the whole population.
- Something that travels with length could be what actually drives the disagreement. Freezing the tail showed it is at most a minor route for the ranking disagreement, so most of the link between length and the disagreement runs through a path we did not isolate.
- The tail's effect on the ranking is fragile. The closure is carried by three pairs, the median pair moves by +0.007, and the 30 pairs we froze are the ones with the largest tails, so the tail shares we report are likely at the high end. The claim that the tail inflates effects proportionally rests on the rankings being preserved; we did not manipulate it directly.
- Freezing the tail creates an unusual forward pass, because the frozen tail no longer matches the patched window in front of it. Freezing without patching does nothing, but that control cannot rule out an interaction between the freeze and the patch, so the effect that survives through the direct route may carry some artifact of combining the two.
- The layer decomposition was a post-hoc supporting analysis, not something we planned in advance, and the disagreement left after dropping the early layers (-0.114) is not zero.
- We never established why reading attribution past the patched window hurts, pair by pair. The penalty does not track how big a pair's tail is (+0.075).

There are also several things we are not claiming.

- We do not claim attribution is vindicated. What we show is that at early layers the two methods answer different questions. Where the correlation approaches zero, the two methods are unrelated, which is different from agreeing.
- We do not claim late layers are content-free. Near the readout the unrelated donor moves the reward slightly less than the rejected answer does (a ratio of 0.893), which is a small but real sensitivity to content.
- We do not claim generality. This is one reward model, one preference category, one GPU class, and one form of patching,.
- We do not claim the disagreement is resolved, only that we have characterized it.
- We do not claim the tail is the pathway from length to the disagreement. Freezing it closes about a tenth of the ranking disagreement. Our claim is the tail is a real pathway for how large early-layer effects get.
- We do not claim that restricting to pairs of similar length fixes attribution. On pairs where the two answers are about the same length, the disagreement is still -0.169 with an interval below zero, about half its full strength, and the fragility result holds in every length group.

## 9. Conclusion

We started from the observation that attribution and patching rank a reward model's components in opposite orders, and asked whether that meant the early layers were load-bearing. Two ordinary explanations do not account for it: fixing the attribution formula restores completeness but barely moves the ranking, and matching the two methods' scope does nothing. What does account for most of it is that, at early layers, the two methods measure different things. Splicing in an unrelated conversation disturbs the reward at least as much as splicing in the rejected answer, and at equal disturbance reaching the scoring position the rejected answer adds nothing, which indicates that an early-layer patch effect reports how fragile the reward is to its early computation rather than what that computation contains. The disagreement concentrates in pairs where the preferred answer is longer, and the untouched tail of those answers inflates early effects without reordering them.

This returns to the question in section 1. If activation patching serves as the ground truth for validating cheaper methods, our results suggest that at early layers a disagreement with patching is not, on its own, evidence that the cheaper method is wrong, because the two are not answering the same question there. We have only looked at one reward model, and whether the same split between fragility and content shows up in other reward models, or in language models, is the natural next thing to check.

## Appendix
**Setup.** The reward model is Skywork-Reward-Llama-3.1-8B-v0.2, run in bfloat16 with no quantization. The loaded model is stamped and checked against the requested one on every run, and no fallback was ever triggered. The data is the helpfulness (Chat) category of RewardBench, filtered split, 100 preference pairs. Patching is noising, over all 64 components, meaning each layer's attention and MLP block. We drop pairs where the reward model's own preference disagrees with the labeled one, about 4 percent of the pool (7 of 180), and every aggregate is over the label-agreeing pairs. The seed is 42 for everything.

**A numerical-precision finding. We found that two forward passes over inputs of different length do not produce identical activations, even when on the shared tokens. The divergence is exactly 0 at the embedding, about 1% at the first layer, and around 3.5% by the last, and it disappears when the two inputs happen to be the same length. On one pair we reran it a day apart and got the same value to the bit, so within a GPU class this is shape-dependent.

**Controls.** The unrelated-donor assignment is a length-matched derangement: no pair donates to itself (0 of 100), and donor lengths are close (median mismatch 5 tokens, with one length-extreme outlier at 1720). Our consolidated patching loop matches the library's on three archived pairs to zero effect difference. The matched-subset sweep reuses the main sweep's cached effects, which are identical on all 50 shared pairs (largest change in correlation, zero). Self-patching a run into itself gives exactly zero, against a floor of 0.158.

The remaining figures live here.

![Validity-check census across 136 pairs.](/assets/images/rm-faithfulness/fr_a9_census.png)
*The leftover prompt attribution tracks pair geometry, not pipeline correctness; the correctness residual stays healthy across all 136 pairs.*

![Scope diagnostic.](/assets/images/rm-faithfulness/fr_scope_diagnostic.png)
*Last-token patching suppresses the early layers and inflates the late ones, which is why we matched scope on the attribution side rather than the patching side.*

![Length versus confidence.](/assets/images/rm-faithfulness/fr_e2b_dissociation.png)
*Confidence collapses as the length-matched subsets grow; length holds near its pool value under confidence-matching.*

![Raw dose-response with fitted slopes.](/assets/images/rm-faithfulness/fr_e4_dose.png)
*The scatter behind the binned figure in the main text. The fitted slopes are 10.5 for the matched donor and 13.1 for the unrelated one.*

**Code and data.** [github.com/twleochao/rm-attribution-patching](https://github.com/twleochao/rm-attribution-patching)
