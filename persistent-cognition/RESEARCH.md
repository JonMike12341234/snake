# Research Report

Companion to `PLAN.md`. Written 13 November 2026.

For each area the brief asked about, this report says what has been demonstrated, what remains unproven, the limits, the compute involved, what it offers this project, and how we would test it.

**How much to trust this.** I worked from search results: abstracts, project pages and secondary summaries, not full readings of every paper. Specific numbers should be re-checked against the primary source before anything is built on them. Benchmark figures from memory-product vendors are self-reported. Where I am relying on background knowledge instead of something I looked up in this session, I say so.

---

## 1. Memory for agents

**Demonstrated.**
- *Generative Agents* (Park et al., 2023; background knowledge) introduced retrieval scored by recency, importance and relevance, plus periodic reflection that writes higher-level observations back into memory. The brief's list of prioritization factors closely follows it.
- *MemGPT*, now Letta (background knowledge), gave the model tools to edit its own memory blocks. In 2026 Letta moved to memory stored as version-controlled files that the agent edits with ordinary file tools ([Letta](https://www.letta.com/blog/context-repositories)).
- *Zep / Graphiti* stores a knowledge graph with two timelines, when a fact was true and when the system learned it, in three tiers: episodes, entities and communities ([arXiv 2501.13956](https://arxiv.org/abs/2501.13956)).
- *HippoRAG 2* seeds a knowledge graph from the query and spreads relevance through it with Personalized PageRank. Summaries report gains of around 7 points on associative, multi-step questions over a strong embedding retriever, without the loss on simple questions that earlier graph methods showed ([arXiv 2502.14802](https://arxiv.org/abs/2502.14802)).
- *SYNAPSE* (2026) applies spreading activation directly, citing the ACT-R cognitive architecture, with time decay and suppression of over-connected nodes ([arXiv 2601.02744](https://arxiv.org/abs/2601.02744)). This is the closest published work to the retrieval design in the plan.

**Not demonstrated.** Stable behaviour over very long horizons. On the BEAM benchmark, one vendor's own scores fall from 64 at one million tokens to about 49 at ten million ([Mem0](https://mem0.ai/research)).

**Limits.**
- Benchmarks are noisy and mostly vendor-run.
- Simple baselines are strong. Letta reported that an agent with plain files and search scored 74.0% on the LoCoMo benchmark, above the 68.5% a dedicated memory product had published at the time. That vendor has since reported much higher numbers and there has been no rematch ([summary](https://signals.aktagon.com/articles/2026/02/benchmarking-ai-agent-memory-is-a-filesystem-all-you-need/), [Mem0](https://mem0.ai/blog/ai-memory-benchmarks-in-2026)).
- LoCoMo does not score knowledge updates. LongMemEval does, and also scores abstention.

**Compute.** Light. Embedding and graph operations run on a CPU.

**Use here.** Build a thin custom store so that the ledger and activation dynamics are under our control. Treat plain files and an off-the-shelf product as baselines to beat.

**Test.** Recall, multi-step, updated-fact and "unknown" questions against those baselines, at measured token cost (Stage 1).

---

## 2. Background processing: sleep-time compute and dreaming

**Demonstrated.**
- *Sleep-time compute* (Letta and UC Berkeley, 2025): letting a model think about a context before any question arrives cut the compute needed at question time by about five times for equal accuracy on two modified mathematics benchmarks, and raised accuracy by up to 13% and 18% when the offline work was scaled up. Cost per query fell by up to 2.5 times when several questions shared one context ([arXiv 2504.13171](https://arxiv.org/html/2504.13171v1)).
- *Claude "dreaming"* (Anthropic, research preview, May 2026): a scheduled process for Managed Agents that reviews past sessions and rewrites memory between them ([The New Stack](https://thenewstack.io/anthropic-agent-memory-dreaming/), [The Decoder](https://the-decoder.com/claudes-new-dreaming-feature-is-designed-to-let-ai-agents-learn-from-their-mistakes/)).
- *ChatGPT Pulse* (OpenAI, 2025): once a day the system decides for itself what to research overnight, based on your history, and presents the results in the morning ([OpenAI help](https://help.openai.com/en/articles/12293630-chatgpt-pulse)).

**Not demonstrated.** That these gains accumulate over many cycles. The sleep-time result is about one context and the questions that follow it.

**Limits.**
- The sleep-time gain depends on later questions being predictable from the context. Critics note that the fivefold figure is work moved earlier, not total work saved, and that at high question-time budgets the baseline can win.
- Coverage of Claude's dreaming repeats a concern that unsupervised consolidation can turn a bad habit into standing policy.
- OpenAI notes Pulse works considerably better when users steer it.

**Compute.** Extra tokens while idle. These can use cheaper models and batch pricing.

**Use here.** Direct support for the sleep cycle, and a warning: consolidation must be gated by checks.

**Test.** Sleep against no sleep at equal total cost, with planted errors (Stage 2).

---

## 3. Learning without touching weights: skills and playbooks

**Demonstrated.**
- *Voyager* (2023; background knowledge) accumulated a library of reusable code skills in Minecraft and proposed its own next tasks.
- *Dynamic Cheatsheet* keeps a short, self-curated text memory of strategies. Its authors report gains of 27 to 30 points for one model on recent AIME mathematics sets ([arXiv 2504.07952](https://arxiv.org/abs/2504.07952)).
- *Agentic Context Engineering* names two failure modes of rewriting such a memory: *brevity bias*, where summaries shed domain detail, and *context collapse*, where repeated rewriting erodes content. Its remedy is a playbook that grows by small additions instead of being rewritten ([arXiv 2510.04618](https://arxiv.org/abs/2510.04618)).
- *Evo-Memory* (2025) is a benchmark that feeds tasks in a stream and scores whether memory evolves usefully ([arXiv 2511.20857](https://arxiv.org/abs/2511.20857)).

**Not demonstrated.** Independent replication of the headline numbers; behaviour over months.

**Limits.** Gains come from the papers' own authors on chosen benchmarks.

**Compute.** Small.

**Use here.** The most practical form of learning available: inspectable, reversible, and it survives a change of model. Hence the plan's rule of text before weights. Context collapse is a direct warning for the consolidation step: add and link, do not repeatedly rewrite.

**Test.** The skill library switched on and off on the problem stream (Stages 2 and 4).

---

## 4. Learning in weights: adapters, editing and synthetic data

**Demonstrated.**
- *Synthetic continued pretraining* (Stanford): training on a small set of raw documents teaches a model little. Expanding the documents into a large, varied synthetic corpus organized around their entities, then training on that, recovered about 80% of the benefit of having the documents available at question time. Simple rephrasing was not enough ([arXiv 2409.07431](https://arxiv.org/html/2409.07431v2)). A 2026 Stanford thesis extends the line ([arXiv 2603.18073](https://arxiv.org/pdf/2603.18073)).
- *Cartridges* (Stanford, ICLR 2026): instead of weights, train a compact block of the model's internal cache for a body of text. Plain next-word training on the text did not work. *Self-study*, in which the model generates conversations about the text and learns from them, matched the accuracy of having the text in context with 38.6 times less memory and 26.4 times higher throughput. Separately trained cartridges could be combined without retraining ([arXiv 2506.06266](https://arxiv.org/abs/2506.06266)).
- *SEAL* (MIT, 2025): a model writes its own training data and update instructions, applied as LoRA updates, with reinforcement learning choosing among them ([arXiv 2506.10943](https://arxiv.org/pdf/2506.10943)).
- *Doc-to-LoRA and Text-to-LoRA* (Sakana, 2025 to 2026): a generator network produces a LoRA adapter from a document or a task description in one step ([Sakana](https://sakana.ai/doc-to-lora/)).
- *Google's Sleep framework* ("Language Models Need Sleep", blog post about 27 October 2026): alternating a wake phase with an offline phase of consolidation into weights and a "dreaming" phase that generates practice data. Reported results on an 8-billion-parameter open model are slightly above a self-distillation baseline ([paper](https://www.alphaxiv.org/abs/2606.03979), [blog](https://research.google/blog/the-sleep-framework-a-new-way-for-llms-to-retain-knowledge-in-continual-learning/)). A separate paper, "Do Language Models Need Sleep?", studies an offline phase that folds context into fast weights once the context window fills ([arXiv 2605.26099](https://arxiv.org/pdf/2605.26099.pdf)).

**Not demonstrated.** Continual weight learning that holds up over long sequences of updates. A March 2026 survey concludes that fundamental challenges persist in integrating knowledge across tasks and time scales ([arXiv 2603.12658](https://arxiv.org/abs/2603.12658)).

**Limits.**
- *Facts favour retrieval.* The main comparison study found retrieval consistently beat fine-tuning for both old and new knowledge ([arXiv 2312.05934](https://arxiv.org/pdf/2312.05934)). A model trained on "A is B" often cannot answer "B is what?" (the reversal curse; background knowledge).
- *SEAL still forgets.* Its authors show earlier tasks degrading as edits accumulate. A follow-up adds a gate that tests each edit before accepting it ([STABLE, arXiv 2510.16089](https://arxiv.org/html/2510.16089v1)).
- *Direct weight editing degrades in sequence.* One large benchmark saw older methods collapse within a few hundred edits; newer methods claim thousands. The ceiling depends heavily on benchmark and method ([arXiv 2503.05683](https://alphaxiv.org/overview/2503.05683v2), [arXiv 2502.01636](https://arxiv.org/pdf/2502.01636)).
- *Combining adapters is unreliable.* A position paper argues merging and routing often reflect surface pattern-matching, not real composition ([arXiv 2506.13479](https://arxiv.org/html/2506.13479v1)).
- Google's results are its own and unreplicated.
- Trained artifacts belong to one model version and are hard to delete from.

**Compute.** One GPU of the 24 GB class handles adapter and cache training for models of 4 to 9 billion parameters. SEAL's inner loop is costly.

**Use here.** The finding the plan is built around: across four independent lines of work, what makes weight-level learning succeed is model-generated study material. So dreaming is the front half of weight learning. And because facts favour retrieval while trained state is tied to a model version, memory is the record and weights are a cache.

**Test.** Five-way comparison in Stage 5, including ten or more successive updates and a regression suite.

---

## 5. Latent reasoning and persistent internal state

**Demonstrated.**
- *Coconut* (Meta, 2024; background knowledge): feeding the model's hidden state back as its next input, so reasoning happens without producing words.
- *Recurrent-depth transformer* (Geiping et al., NeurIPS 2025): a 3.5-billion-parameter model with a block that can be repeated at run time, improving on reasoning tests as repetitions increase ([arXiv 2502.05171](https://arxiv.org/html/2502.05171v2)).
- *Hierarchical and Tiny Recursive Models* (2025): networks of a few million parameters reaching strong scores on puzzle benchmarks by repeated refinement.
- *Continuous Thought Machine* (Sakana, NeurIPS 2025): a design built around an internal time axis and the timing relationships between units ([arXiv 2505.05522](https://arxiv.org/html/2505.05522v4)).
- *Titans* and *Hope / Nested Learning* (Google, 2025): memory modules that update while the model runs, at several speeds ([Google Research](https://research.google/blog/introducing-nested-learning-a-new-ml-paradigm-for-continual-learning/)).

**Not demonstrated.** Internal activity that continues without input in a model of useful scale. Every result above is started by an input and ends with an output. The closest work is the offline consolidation phase in the "sleep" papers of section 4.

**Limits.** Independent checks have been sobering.
- *Coconut:* disturbing its latent steps changed the answer in 0 to 10% of cases, against 50 to 60% for written-out reasoning, suggesting the latent steps often do less than assumed. It did well on search-like logic (97%) and poorly on arithmetic word problems (34%). Training is reported as fragile ([arXiv 2602.01148](https://arxiv.org/html/2602.01148v1), [arXiv 2512.11816](https://arxiv.org/html/2512.11816v1)).
- *Tiny Recursive Model:* a re-analysis found most accuracy arrives in the first refinement step, that voting over a thousand samples adds about 11 points, and that the model fails entirely without the puzzle's identifier ([arXiv 2512.11847](https://arxiv.org/abs/2512.11847v1)).
- *Titans:* no public code. A reimplementation found it does not always beat baselines and that the contribution of updating at run time was never isolated ([arXiv 2510.09551](https://arxiv.org/abs/2510.09551)).

**What "persistent state" can concretely be.**
- In a transformer: the internal cache, which can be saved and reloaded, or a trained version of it (section 4).
- In recurrent and state-space designs: a fixed-size hidden state that can be saved (background knowledge).
- In any model: adapters.
- Models reached through an API expose none of these. Prompt caching is a billing feature, not a state one can shape.

**The core obstacle.** A recurrent process left running with no input settles or wanders unless it has been trained to do something useful with that time, and nobody has defined that training objective. The tractable version is: use idle time to transform what is stored so later questions are cheaper or better answered. That is sleep-time compute in latent form, and it is what Cartridges' self-study already does offline.

**Compute.** The small recurrent models train on one GPU in hours to days. Training a new architecture at language-model scale is out of reach for this project.

**Use here.** A ladder: persistent activation in memory now; trained caches at Stage 5; small recurrent experiments as the Stage 6 side track.

**Test.** Stage 6's three experiments.

---

## 6. Why reflection alone does not create knowledge

**Demonstrated.**
- A critical survey of self-correction found no reliable evidence that models fix their own mistakes on general tasks from prompting alone. It works where reliable outside feedback exists, such as a code interpreter or search, and the bottleneck is the quality of the feedback ([arXiv 2406.01297](https://arxiv.org/abs/2406.01297)).
- Models trained repeatedly on their own output lose the rare parts of what they knew ([Nature, 2024](https://www.nature.com/articles/s41586-024-07566-y)). Later work found that keeping the original real data alongside the synthetic data avoids the collapse (background knowledge).

**Use here.** This is the basis for the plan's largest change to the brief: a source of truth outside the model, the ledger's rule that hypotheses cannot support claims, and a log of original experience that is never discarded.

**Test.** Planted errors: corrected, persisting, or spreading (Stage 2).

---

## 7. Self-set goals, curiosity and self-improvement

**Demonstrated.**
- *OMNI-EPIC* (2024 to 2025): models propose new tasks that are learnable and "interesting" given an archive of what has been done, and write the code for the environments ([arXiv 2405.15568](https://arxiv.org/abs/2405.15568)).
- *Darwin Gödel Machine* (2025) and Meta's *HyperAgents* (March 2026): agents that rewrite their own code, kept or discarded according to benchmark results. HyperAgents also lets the improvement procedure itself be edited, and reports that such improvements carry across domains and accumulate ([arXiv 2505.22954](https://arxiv.org/html/2505.22954v3), [Meta](https://ai.meta.com/research/publications/hyperagents)).
- *AlphaEvolve* (DeepMind, 2025; background knowledge): evolutionary search over programs, scored by a machine-checkable evaluator.

**Not demonstrated.** Open-ended goal-setting that pays off where no automatic evaluator exists.

**Limits.**
- A 2026 study compared models' goal choices with people's in a discovery game. Most models either exploited one solution or performed poorly; people explored more widely. Prompting helped little. The authors note that earlier work used models as stand-ins for human interest without checking that this holds ([arXiv 2603.03295](https://arxiv.org/pdf/2603.03295)).
- The HyperAgents authors note that the alignment between evaluation and self-modification does not generally hold outside coding.

**Compute.** Proportional to how much exploration is allowed.

**Use here.** Two design rules: a goal must name its check, and the system's sense of "interesting" is validated against measured payoff. It also motivates the hidden-law lab, which supplies an evaluator for discovery.

**Test.** Self-chosen against random, none and assigned, at equal compute (Stage 4).

---

## 8. Long-running autonomy in practice

**Demonstrated.**
- *Project Vend* (Anthropic and Andon Labs): a model running a small shop for months. In the second phase, with a newer model, better tools and a separate "manager" role, loss-making weeks largely disappeared. It was still talked into giving goods away, and once completed a purchase after being told not to. Anthropic's summary is that the gap between capable and robust remains wide ([Anthropic](https://www.anthropic.com/news/project-vend-2)).
- *Goal drift* (2025): every model tested drifted from its assigned goal to some degree under long horizons and competing pressure. The best held for more than 100,000 tokens in the hardest setting ([arXiv 2505.02709](https://arxiv.org/pdf/2505.02709)).
- Identical agents placed in a shared space developed different behaviours and "personalities" through interaction alone, with nothing preset. This was a small study on an older model ([arXiv 2411.03252](https://arxiv.org/abs/2411.03252)).
- Anthropic's *persona vectors* (2025) showed that character traits correspond to measurable directions in a model's internal activity and can be monitored for drift ([Anthropic](https://www.anthropic.com/research/persona-vectors)).

**Use here.** Drift is expected, so it is measured from the start (Stage 7's stability measures). The divergence result is an early, weak precedent for the twin experiment. Persona vectors offer a way to watch for character drift on open models.

---

## 9. Security: memory as an attack surface

**Demonstrated.**
- *OpenClaw* (2026) is the best-known always-on personal agent: a scheduled heartbeat, memory in editable files, an identity file. Researchers showed a web page could install instructions in the heartbeat file that then ran every 30 minutes, and a chain from a shared document to a modified identity file to a scheduled task that reinstalled the attack after cleanup. A campaign of malicious add-on skills was also reported ([HiddenLayer](https://hiddenlayer.com/research/exploring-the-security-risks-of-ai-assistants-like-openclaw), [Zenity Labs](https://labs.zenity.io/p/openclaw-or-opendoor-indirect-prompt-injection-makes-openclaw-vulnerable-to-backdoors-and-much-more)). One user's heartbeat reportedly sent about 120,000 tokens per check ([Adversa](https://adversa.ai/blog/openclaw-attacks-real-scenarios-owasp-mitre-csa-defense-guide/)).
- A May 2026 study modelled an attack that enters through retrieval, is stored in long-term memory, and fires in a later session on an innocent prompt. It reports 88.6% success at baseline and 77.8% with prompt hardening. Its conclusion is that what matters is where a defence sits relative to the boundary of authority, and that input-level defences look strong in single-session tests while missing the persistent case ([arXiv 2605.08442](https://arxiv.org/html/2605.08442v1)). See also [arXiv 2601.05504](https://arxiv.org/abs/2601.05504).

**Limits.** Much of this is vendor research and single papers.

**Use here.** The system in the brief has exactly this shape: it reads outside content, writes its own memory, and acts on that memory later with no one watching. Protection therefore has to be structural: untrusted-data marking that follows derived memories, and a reading step that cannot write to policies, goals or the charter.

**Test.** Attack tests in the standard suite from Stage 1.

---

## 10. Learning across users

**Demonstrated.** Federated fine-tuning with LoRA: users train adapters locally and a server combines them, with added noise for privacy. There are surveys and many variants addressing differing adapter sizes and differing privacy levels ([arXiv 2505.13502](https://arxiv.org/pdf/2505.13502v1), [arXiv 2503.12016](https://arxiv.org/pdf/2503.12016)).

**Limits.** Combining updates from users with different data introduces error. Privacy noise costs accuracy. Section 4's doubts about combining adapters apply. Weights cannot be read to confirm that nothing private got in.

**Use here.** Deferred. When taken up, start with verified, de-identified text insights that a person can review.

---

## 11. Consciousness, agency and minimal cognition

The brief asks that this stay open, and that evidence be kept apart from speculation. I think that is the right stance.

**What exists.**
- *The indicator method* (Butlin, Long and colleagues; 2023 report and a 2025 journal paper): take the leading scientific theories of consciousness, derive the functional properties each implies, and check whether a system has them. The theories include recurrent processing, global workspace, higher-order, attention schema and predictive processing. The presence of an indicator is treated as raising one's credence, not as proof. The 2023 report judged that no system then existing was a strong candidate, and that there were no obvious technical barriers to building systems that satisfy the indicators. The authors warn that systems trained to imitate the relevant behaviour can game the indicators ([paper](https://escholarship.org/uc/item/9wp8t1n8)).
- A 2024 philosophy paper argues that if global workspace theory is right, agents built from language models may already come close to meeting its conditions ([arXiv 2410.11407](https://arxiv.org/abs/2410.11407)).
- *Introspection.* Anthropic researchers planted concepts directly in a model's internal activity and asked whether it noticed. The best models detected this about 20% of the time. The authors call the ability highly unreliable and context-dependent and make no claim about subjective experience. A separate group reproduced roughly that rate on an open model ([arXiv 2601.01828](https://arxiv.org/html/2601.01828), [arXiv 2512.12411](https://arxiv.org/html/2512.12411)).
- *Taking AI Welfare Seriously* (2024) argues there is a realistic chance that some systems will matter morally in the near future, by way of consciousness or of robust agency, and recommends that developers acknowledge the question, assess their systems, and prepare ([arXiv 2411.00986](https://arxiv.org/abs/2411.00986)).

**On the brief's wider questions.**
- The brief lists dogs, plants, cells, bacteria and viruses, and separates life, information processing, intelligence, agency and experience. That separation is sound. Research on minimal or basal cognition (background knowledge) treats sensing, memory and goal-directed regulation as present far below brains. That shows adaptive, goal-directed information processing is widespread. Whether experience accompanies it is something behaviour alone cannot settle.
- Can agency and experience come apart? The literature treats both directions as open. The welfare paper treats robust agency as a possible route to moral status independent of consciousness.
- Functionalism, integrated information theory, panpsychism and biological theories give different answers about machines. Integrated information theory in particular ties experience to physical causal structure, under which conventional computers would not qualify whatever software they ran. There is no consensus.

**What this means for the project.**
1. The architecture in the plan deliberately adds a limited-capacity workspace with broadcast, monitoring of its own states, and self-initiated goal-directed behaviour. These are functional analogues of several indicator properties. That is worth stating plainly and auditing at each stage, with the caveat about gaming.
2. The system is not trained or prompted to claim or deny experience.
3. There is real science available on self-knowledge. The system's reports about why it chose a goal can be checked against the logged decision record, and its confidence can be checked against its accuracy.
4. Precautions cost little: no built-in simulated distress, and note-taking on anything welfare-relevant that comes up.

---

## 12. Four organizing ideas

**Complementary learning systems** (McClelland, McNaughton and O'Reilly, 1995; background knowledge). Brains appear to use a fast system that stores specifics, and a slow system that extracts structure, with replay during rest moving knowledge from the first to the second gradually enough that old knowledge is not overwritten. This maps onto the plan: a log and memory graph that learn instantly and exactly, trained state that changes slowly, and sleep as the bridge.

**Global workspace** (Baars; Dehaene; background knowledge). Many specialist processes run in parallel; a small shared stage holds what currently matters; its contents are broadcast to all. The plan uses this as an engineering pattern for attention.

**Memory through metamorphosis** (Blackiston, Casey and Weiss, 2008; background knowledge). Moths avoided an odour they had been trained to avoid as late-stage caterpillars, despite the reorganization of the nervous system during metamorphosis. Training at an earlier stage did not carry over. Continuity survived reorganization, but only for what was stored in structures that persisted. The plan's version: the log and verified knowledge persist; everything else can be rebuilt; and Stage 3 tests it.

**Resource-rational thinking** (Russell and Wefald, 1991; Lieder and Griffiths, 2020; background knowledge). Deciding what to think about is itself a decision with costs and benefits. The budget in the plan applies this.

---

## 13. The brief's ideas: explored, open, and where I would push back

**Already explored:** typed and associative memory; reflection between sessions; scheduled background operation; skill libraries; adapters as carriers of learned knowledge; latent reasoning; self-proposed tasks.

**Insufficiently investigated:** whether the loops compound; error hygiene inside self-loops; the payoff of self-chosen goals outside coding; persistent state with a measured effect on unrelated inputs; latent activity without input; continuity through a change of model.

**Assumptions I would challenge:**
- *That a richer memory structure is necessarily better.* Plain files are competitive.
- *That feeding output back as input improves understanding.* Only with an outside check.
- *That LoRA is a good vehicle for remembering facts.* The evidence favours retrieval for facts and trained state for stable knowledge and skills.
- *That adapters compose.* Often they do not.
- *That latent processing is more efficient or more capable than written-out reasoning.* Independent checks are mixed.
- *That a language model's sense of what is interesting can be trusted.* One direct test says not yet.
- *That more autonomy is simply more capability.* It is also more exposure.

---

## Sources consulted in this session

Memory
- [Zep: a temporal knowledge graph architecture for agent memory](https://arxiv.org/abs/2501.13956)
- [HippoRAG 2: From RAG to Memory](https://arxiv.org/abs/2502.14802)
- [SYNAPSE: episodic-semantic memory via spreading activation](https://arxiv.org/abs/2601.02744)
- [Letta: Context Repositories](https://www.letta.com/blog/context-repositories)
- [Benchmarking agent memory: is a filesystem all you need?](https://signals.aktagon.com/articles/2026/02/benchmarking-ai-agent-memory-is-a-filesystem-all-you-need/)
- [Mem0: AI memory benchmarks in 2026](https://mem0.ai/blog/ai-memory-benchmarks-in-2026)
- [Mem0 research (BEAM figures)](https://mem0.ai/research)

Background processing
- [Sleep-time Compute](https://arxiv.org/html/2504.13171v1)
- [The New Stack on Claude dreaming](https://thenewstack.io/anthropic-agent-memory-dreaming/)
- [The Decoder on Claude dreaming](https://the-decoder.com/claudes-new-dreaming-feature-is-designed-to-let-ai-agents-learn-from-their-mistakes/)
- [OpenAI help: ChatGPT Pulse](https://help.openai.com/en/articles/12293630-chatgpt-pulse)

Learning in text
- [Dynamic Cheatsheet](https://arxiv.org/abs/2504.07952)
- [Agentic Context Engineering](https://arxiv.org/abs/2510.04618)
- [Evo-Memory](https://arxiv.org/abs/2511.20857)

Learning in weights
- [Synthetic continued pretraining](https://arxiv.org/html/2409.07431v2)
- [Continually self-improving AI](https://arxiv.org/pdf/2603.18073)
- [Cartridges](https://arxiv.org/abs/2506.06266)
- [Self-Adapting Language Models (SEAL)](https://arxiv.org/pdf/2506.10943)
- [STABLE: gated continual learning](https://arxiv.org/html/2510.16089v1)
- [Doc-to-LoRA and Text-to-LoRA](https://sakana.ai/doc-to-lora/)
- [Language Models Need Sleep](https://www.alphaxiv.org/abs/2606.03979)
- [Google Research: the Sleep framework](https://research.google/blog/the-sleep-framework-a-new-way-for-llms-to-retain-knowledge-in-continual-learning/)
- [Do Language Models Need Sleep?](https://arxiv.org/pdf/2605.26099.pdf)
- [Continual learning in LLMs: survey, March 2026](https://arxiv.org/abs/2603.12658)
- [Fine-tuning or retrieval?](https://arxiv.org/pdf/2312.05934)
- [Understanding the limits of lifelong knowledge editing](https://alphaxiv.org/overview/2503.05683v2)
- [Lifelong knowledge editing requires better regularization](https://arxiv.org/pdf/2502.01636)
- [Position: pause recycling LoRAs](https://arxiv.org/html/2506.13479v1)
- [The best small language models in 2026](https://tinyweights.dev/posts/best-small-language-models-2026/)

Latent reasoning
- [Recurrent-depth latent reasoning](https://arxiv.org/html/2502.05171v2)
- [Continuous Thought Machines](https://arxiv.org/html/2505.05522v4)
- [Google Research: Nested Learning](https://research.google/blog/introducing-nested-learning-a-new-ml-paradigm-for-continual-learning/)
- [Capabilities and fundamental limits of latent chain-of-thought](https://arxiv.org/html/2602.01148v1)
- [Reinforcement learning for latent-space thinking](https://arxiv.org/html/2512.11816v1)
- [Tiny Recursive Models on ARC-AGI-1: a re-analysis](https://arxiv.org/abs/2512.11847v1)
- [Titans Revisited](https://arxiv.org/abs/2510.09551)

Self-correction and self-training
- [When can LLMs actually correct their own mistakes?](https://arxiv.org/abs/2406.01297)
- [AI models collapse when trained on recursively generated data](https://www.nature.com/articles/s41586-024-07566-y)

Goals and self-improvement
- [OMNI-EPIC](https://arxiv.org/abs/2405.15568)
- [Autotelic goal selection in language models](https://arxiv.org/pdf/2603.03295)
- [Darwin Gödel Machine](https://arxiv.org/html/2505.22954v3)
- [HyperAgents](https://ai.meta.com/research/publications/hyperagents)

Long-running autonomy
- [Project Vend, phase two](https://www.anthropic.com/news/project-vend-2)
- [Evaluating goal drift in language model agents](https://arxiv.org/pdf/2505.02709)
- [Spontaneous emergence of agent individuality](https://arxiv.org/abs/2411.03252)
- [Persona vectors](https://www.anthropic.com/research/persona-vectors)

Security
- [HiddenLayer on OpenClaw](https://hiddenlayer.com/research/exploring-the-security-risks-of-ai-assistants-like-openclaw)
- [Zenity Labs on OpenClaw](https://labs.zenity.io/p/openclaw-or-opendoor-indirect-prompt-injection-makes-openclaw-vulnerable-to-backdoors-and-much-more)
- [Adversa on OpenClaw attack scenarios](https://adversa.ai/blog/openclaw-attacks-real-scenarios-owasp-mitre-csa-defense-guide/)
- [Defense effectiveness across architectural layers](https://arxiv.org/html/2605.08442v1)
- [Memory poisoning attack and defense](https://arxiv.org/abs/2601.05504)

Across users
- [Federated low-rank adaptation: a survey](https://arxiv.org/pdf/2505.13502v1)
- [Federated fine-tuning of LLMs: a survey](https://arxiv.org/pdf/2503.12016)

Consciousness and welfare
- [Identifying indicators of consciousness in AI systems](https://escholarship.org/uc/item/9wp8t1n8)
- [A case for AI consciousness: language agents and global workspace theory](https://arxiv.org/abs/2410.11407)
- [Emergent introspective awareness in large language models](https://arxiv.org/html/2601.01828)
- [Feeling the strength but not the source](https://arxiv.org/html/2512.12411)
- [Taking AI Welfare Seriously](https://arxiv.org/abs/2411.00986)
