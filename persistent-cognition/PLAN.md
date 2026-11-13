# Persistent Cognition: Findings and Build Plan

**Status:** draft for your review, 13 November 2026. Nothing is built yet.

This is the plan you asked for. Two companion files sit beside it:

- `BRIEF.md` is the document the other agent wrote for me, kept as the record of your intent.
- `RESEARCH.md` is the review of papers and shipping products behind the claims made here, with sources.

Section 10 lists the decisions I need from you before work starts.

---

## 1. The short version

**What I take the goal to be.** A system that keeps developing between conversations. It remembers, reorganizes what it knows, checks its own earlier work, picks questions worth pursuing, pursues them, and is measurably better for it the next time you talk to it. Memory, reflection, learning and self-set goals are meant to feed each other, not sit side by side as separate features.

**What the research says, in seven points.**

1. **The parts exist. Proof that they compound does not.** Memory layers, between-session "dreaming", scheduled wake-ups and self-updating playbooks all ship today (Claude's dreaming preview, ChatGPT Pulse, Letta, OpenClaw). I found no controlled, long-run evidence that a system built from them gets steadily more capable from its own experience and self-chosen work. That evidence is what this project can contribute.

2. **The brief is missing a source of truth.** A model that re-reads its own output learns nothing new about the world. The literature is consistent: self-correction works when there is reliable outside feedback and mostly fails without it, and every system that demonstrably improves itself (AlphaEvolve, the Darwin Gödel Machine, SEAL) leans on an automatic evaluator. So the system has to live somewhere its claims can be checked: by running code, working mathematics, experimenting in a simulated world, or consulting outside sources.

3. **The ruler has to be built before the thing it measures.** "It developed" is easy to narrate and hard to show. The first stage builds the test harness, the baselines and the cost accounting, and proves the harness can detect an effect when there is one.

4. **Dreaming, latent state and LoRA are one pipeline, not three features.** The strongest recent results (Stanford's Cartridges, synthetic continued pretraining, Sakana's Doc-to-LoRA, Google's Sleep framework published last month) share one recipe: the model generates study material about what it has experienced, and that material is trained into a compact internal form. Dreaming produces the study material. A trained cache or adapter is where it ends up. External memory stays the record of truth.

5. **Free-running latent thought is not buildable on today's large models, but a workable substitute is.** Nobody has shown a large model whose internal activity continues between inputs. What can be built now is a memory whose activation levels persist and fade over time, so background work changes what comes to mind later. That gives the "thinking about chess when asked a favourite colour" effect in a form we can measure. Trained internal state comes next. Small recurrent models are a side experiment.

6. **Autonomy is a security problem as much as a capability problem.** Security researchers showed that a single web page could write instructions into the heartbeat file of OpenClaw, this year's best-known always-on agent, after which those instructions ran every 30 minutes. A 2026 study reports persistent memory-poisoning attacks succeeding 88.6% of the time, and still 77.8% with prompt-level hardening. A system that reads the web and writes its own long-term memory needs structural protection from the first day.

7. **Order of work: system first, weights second, new architectures last.** The system-level version runs on a frozen model through an API, costs little, and answers most of the scientific questions. Weight-level learning needs a GPU and a small open model. New neural architectures are a time-boxed side track.

---

## 2. The goal, restated and sharpened

### 2.1 Proposed goal statement

> Build and study a system whose competence in a chosen domain measurably rises with its own accumulated experience and self-initiated work, at falling cost per unit of competence, while it stays honest about what it knows and how it came to know it.

This adds three things to the brief's wording. "Measurably" means a number, on tests the system has never seen. "At falling cost" turns the brief's efficiency motive into a requirement. "Honest about what it knows" promotes the brief's worry about reinforcing mistakes (its section 5.3) from a caution to a goal.

### 2.2 Six claims to test

The brief's central hypothesis is that agency, continuity and learning might emerge from the interaction of the parts. To investigate that, it helps to split it into claims that can each succeed or fail on their own.

| Claim | Evidence for | Evidence against |
|---|---|---|
| **H1. Sleep helps.** Background consolidation improves later performance and lowers cost per answer. | The system with sleep beats the identical system without it on delayed tests, counting all background spending. | No difference, or a gain that costs more than it saves. |
| **H2. Self-direction pays.** Questions the system picks for itself produce knowledge that raises scores on unseen tests. | Self-chosen investigation beats no investigation and random-topic investigation at equal compute. | Random topics do as well, or findings don't transfer to the tests. |
| **H3. State matters.** What the system has been working on usefully changes how it handles new input. | Relevant background work gets used unprompted when it helps, and stays out when it doesn't. | No effect, or the background topic intrudes where it is irrelevant. |
| **H4. Compression holds.** Verified knowledge can move from memory into trained state without loss or damage. | Near-equal accuracy at a fraction of the tokens, with no drop on unrelated abilities. | Accuracy falls, other abilities degrade, or later updates damage earlier ones. |
| **H5. It compounds.** Over weeks, the growth curve keeps rising. | A positive slope that survives a long run, with each loop shown to contribute. | A plateau, or decay from drift and memory rot. |
| **H6. History shapes priorities.** Copies with different experiences develop different priorities for traceable reasons. | Differences between copies are predicted by their histories and exceed the differences between copies given identical histories. | Differences are no larger than run-to-run noise. |

H6 is the direct test of the brief's sections 8.3 and 9: that agency comes from accumulated experience and evaluation, not from randomness.

### 2.3 What I would change in the brief

**Start with measurement, not memory.** The brief's roadmap begins by building memory. I would begin one step earlier, with the harness that tells us whether anything we build is working.

**Give the system a world it can check things in.** This is the largest change. See 2.4.

**Split "dreaming" into three jobs.** The brief describes one loop: output becomes input. I would separate *consolidation* (conservative: replay and organize what happened), *dreaming* (speculative: recombine distant memories into hypotheses and questions) and *verification* (test the hypotheses against something outside the model). Dream output enters memory marked as hypothesis and stays that way until a check passes.

**Treat memory as the record and trained weights as a cache.** The brief leans toward LoRA adapters as modular memory. The evidence points the other way for facts: retrieval beats fine-tuning for new factual knowledge, sequential weight edits degrade, and adapters are tied to one model version. Facts, personal data and anything that may change belong in external memory, where they can be traced, corrected and deleted. Trained state is for stable, verified, frequently used knowledge and skills, and it must always be rebuildable from memory.

**Learn skills as text before weights.** Written procedures with tests (as in Voyager and the playbook line of work) are inspectable, reversible and survive a change of model. Promote to weights only what has proven itself in text.

**Replace free-running latent thought with a ladder.** Rung one, now: persistent activation in the memory graph. Rung two, with an open model: trained internal state. Rung three, as a side track: small recurrent models trained to use idle steps. Section 5 and Stage 6 give the details.

**Fund goals from a budget.** The brief wants the system to form its own goals. I would add that each goal must name how its result will be checked, and that compute flows toward the kinds of thinking that have paid off. One 2026 study found language models are poor at human-style open-ended exploration, tending to exploit one solution, so the system's sense of what is "interesting" has to be validated against results.

**Give rule-challenging a channel.** The system gets layered rules: hard limits it cannot touch, a charter only you can amend but which it can formally object to, working policies it writes and revises itself, and goals it changes freely.

**Defer multi-user learning.** Design the separation of users' data now. Build the sharing later, and start it with verified text insights that a person can read, not with averaged weights that nobody can inspect.

**Keep the consciousness question open and out of the build targets.** The system is never trained or prompted to claim or deny experience. What we can do scientifically is audit the architecture against published indicator lists and test how accurate the system's reports about itself are. `RESEARCH.md` section 11 has more.

### 2.4 The three things the brief leaves out

The brief asks me to name the most important missing component. There are three, in order of importance.

1. **A source of truth.** Something outside the model that can say "that was wrong". Without it, reflection rearranges beliefs; it cannot improve them.
2. **A ruler.** A fixed way to measure competence over time, sealed off from the system so it cannot learn the test.
3. **An economy.** A budget for thinking, and a running record of which kinds of thinking earned their cost. This is what turns "allocates attention intelligently" from a wish into a mechanism.

---

## 3. What exists already, and what is still open

| Idea in the brief | Closest existing work | State of the evidence |
|---|---|---|
| Typed, associative memory | Generative Agents, MemGPT/Letta, Zep, HippoRAG 2, A-MEM, SYNAPSE, Mem0 | Demonstrated. Benchmarks are noisy and vendor-reported; plain files with search are a strong baseline. |
| Background reflection ("dreaming") | Sleep-time compute, Claude dreaming (preview), ChatGPT Pulse | Shipping. Gains are real but conditional. Risk of entrenching errors is acknowledged. |
| Always-on operation | OpenClaw, scheduled agents | Shipping. Serious security lessons. |
| Learning skills in text | Voyager, Dynamic Cheatsheet, ACE, ReasoningBank, Evo-Memory | Demonstrated on benchmarks, by the papers' own authors. |
| Learning in weights | SEAL, synthetic continued pretraining, Cartridges, Doc-to-LoRA, Google Sleep | Research. Works in narrow settings. Forgetting is unsolved. |
| Latent reasoning | Coconut, recurrent-depth transformers, HRM/TRM, Continuous Thought Machine | Research. Always triggered by an input. Independent re-analyses are mixed. |
| Latent activity that continues without input | Nothing found at language-model scale | Open. |
| Self-set goals | Voyager's curriculum, OMNI-EPIC, Darwin Gödel Machine, HyperAgents | Works where an automatic evaluator exists. |
| Learning shared across users | Federated LoRA with differential privacy | Research. |
| Assessing consciousness | Indicator-property method (Butlin, Long and colleagues) | Frameworks exist. No consensus. |

**What I believe is still open, and where this project could add something:**

1. **Compounding.** Long-run evidence, with each component switched off in turn, that the loops add up.
2. **Hygiene in self-loops.** A memory in which self-generated claims cannot quietly become facts, tested by planting errors and watching what happens to them.
3. **Self-direction that pays.** Goals chosen by the system, shown to beat random and absent exploration at equal cost.
4. **State that shapes behaviour.** Persistent internal state with a measured, beneficial effect on unrelated inputs.
5. **A what-goes-where policy.** Evidence-based rules for what stays in memory and what gets trained in.
6. **Closed loops in one system.** Each arrow between components real and individually testable.

---

## 4. Design rules

These hold through every stage.

1. **The log is the record.** Every event is appended to a permanent log. Memory, indexes, summaries and trained state are all derived from it and can be rebuilt. This is the brief's metamorphosis point made concrete: the structures can be torn down and reorganized as long as the log and the verified knowledge survive.
2. **Every belief carries its pedigree.** Where it came from, what kind of claim it is, how confident, what supports it.
3. **Nothing is promoted without a check.** A hypothesis becomes knowledge only by passing a test that does not rest on the model's own say-so.
4. **Thinking is spent where it is expected to pay.** Cheap processes run freely. Expensive ones compete for a budget.
5. **Every component has an off switch.** If we cannot remove a part and measure the difference, we cannot claim it helps.
6. **Limits live outside the model.** Sandboxes, permissions and spending caps are enforced in code. They do not depend on the model agreeing with them.
7. **Everything is reversible.** Memory changes, policy changes and trained artifacts are versioned and can be rolled back.

---

## 5. Architecture

### 5.1 Picture

```
        the world: you · code runner · search · simulated lab
              │ events                    ▲ actions (gated)
              ▼                           │
 ┌──────────────────────────────────────────────────────────┐
 │ EVENT LOG  append-only; everything else is built from it │
 └──────────────────────────────────────────────────────────┘
      │                                   │
      ▼ cheap, parallel                   ▼ costly, one at a time
 tag · embed · spread and fade       respond · consolidate · dream
 activation · flag conflicts         verify · investigate · review
      │                                   │
      └───────► bids for attention ◄──────┘
                       │
                       ▼
          WORKSPACE  (small: what is on its mind)
                       │ included in every model call
                       ▼
 MEMORY GRAPH ↔ AGENDA ↔ SKILLS ↔ SELF-MODEL → trained state (later)
```

### 5.2 What persists

Continuity comes from state that outlives any single model call. There are several kinds, changing at different speeds.

| State | Changes over | What it holds |
|---|---|---|
| Event log | Never rewritten | Every input, output, tool result and internal step, timestamped. |
| Workspace | Minutes to hours | A short, size-limited note of current focus, active goals, open questions and recent insights. |
| Memory graph | Hours to months | Episodes, claims, concepts, questions and their links, each with an activation level that rises with use and fades with time. |
| Agenda | Days to weeks | Goals and investigations, with reasons, expected value, spending so far and status. |
| Skill library | Weeks to months | Procedures as text or code, each with tests. |
| Self-model | Weeks to months | The charter, self-written working policies, a map of measured strengths and weaknesses, and an interests profile. |
| Trained state | Months (Stage 5 on) | Trained caches and adapters, versioned and gated. |

Two of these carry most of the brief's intent.

**The workspace** is how background work colours an unrelated answer. It is included in every model call, in conversation and in sleep alike. If the system spent the night on a number-theory question, a line about that sits in the workspace when you ask something else the next morning.

**Activation levels** are the nearest thing to an ongoing internal state that a system built on a frozen model can have. Each memory has a level. Using a memory raises it and spreads some of the rise to linked memories. All levels fade with time. A new input does not start from zero: it adds to whatever is already active. So what the system retrieves depends on what it has recently been doing, which is the associative, context-dependent recall the brief's section 2 describes.

### 5.3 What runs

The brief's "subconscious" analogy maps onto a real engineering distinction between cheap and expensive computation.

**Cheap and parallel.** Tagging new events for importance and novelty, computing embeddings, spreading and fading activation, flagging likely contradictions, scheduling. This is ordinary code or the smallest available model. It runs all the time and costs almost nothing.

**Expensive and serial.** Anything that needs the main model to reason. These steps take turns.

**Attention.** Cheap processes post bids to the workspace ("this contradicts something", "this relates to an active goal"). The workspace has a fixed number of slots. The highest-value bids win, and what wins is seen by every later step. This is the limited-capacity "global workspace" design from cognitive science, used here as an engineering pattern for deciding what gets the expensive model's time.

**When you are present (wake):** input arrives → activation spreads from it, on top of what is already active → a small context is assembled from the charter, workspace, the most active memories and relevant skills → the model answers or acts → everything is logged → cheap tagging runs. You always take priority over background work.

**When you are away (sleep),** a cycle runs within its budget:

1. **Consolidate.** Replay recent events. Extract claims, link them, merge duplicates, abstract recurring patterns into general statements while keeping their exceptions, flag contradictions, let unused memories fade.
2. **Dream.** Activate distant parts of memory together and ask what connects them. Output is hypotheses, analogies and questions. Everything is marked as hypothesis.
3. **Verify.** Take the most valuable hypotheses and the shakiest existing beliefs and test them: run code, check a derivation, run an experiment, compare independent sources. A separate critic pass argues the opposite case. Update each claim's status.
4. **Investigate.** Work on funded agenda items in the sandbox.
5. **Review.** Revisit goals, run self-tests, update the strengths-and-weaknesses map, write a short report for you.
6. **Compress** (Stage 5 on). Generate study material from verified knowledge, train it into a cache or adapter, test it, deploy or roll back.

The system is not "always running an expensive model". It is always *able* to run, wakes on events and idle time, and stops when the budget for the period is spent.

### 5.4 The ledger

Every claim in memory carries a status:

| Status | Meaning |
|---|---|
| Observed | Directly seen: a tool result, something you said. |
| Reported | From an outside source, recorded with the source and its reliability. |
| Derived | Inferred from listed premises. |
| Hypothesized | Generated by the system itself. |
| Verified | Passed a named check. |
| Refuted | Failed a check. Kept, so the mistake is not repeated. |
| Contested | Conflicting evidence, unresolved. |

Rules that follow:

- Retrieved memories arrive with their status visible, so the model knows a guess from a fact.
- A hypothesis cannot be cited as support for another claim.
- Confidence moves only when new evidence arrives, never from repetition.
- Summaries keep pointers to what they summarize. Generalizations keep their exceptions.
- Nothing is ever deleted from the log. Forgetting means fading from retrieval, not erasure.

This is the mechanism that answers the brief's section 5.3. It will be tested by planting known errors and measuring how often they are corrected, how often they persist, and how often they spread into new claims.

### 5.5 Goals and the budget

**Where candidate goals come from:** problems the system failed, questions it could not answer, contradictions in memory, hypotheses from dreaming, your stated interests, and loose ends from finished investigations.

**What a candidate needs:** a short written case stating what would be learned, how the result would be checked, what it might cost, and why now. For knowledge goals the rule is simple: no check, no funding.

**How candidates are ranked:** expected gain divided by expected cost. Gain combines usefulness to you and to existing goals, novelty, and learning progress (are we actually getting better in this area, or stuck?).

**The budget:** a daily allowance, split across kinds of activity. The split shifts toward what has paid off, measured by test-score gain per dollar, with a small share reserved for exploration. This is how the system learns which kinds of thinking are worth their cost.

**Lifecycle:** proposed → funded → active → done, abandoned or parked. Every transition is logged with a reason. Each sleep cycle reviews active goals for progress per dollar and for better alternatives. Money already spent is ignored when deciding whether to continue.

**On determinism.** I agree with your position that randomness is not what makes agency. In this design, agency is defined by things we can observe: the activity was started by the system, alternatives were weighed, the choice depended on the system's history, it can be revised, and the recorded reasons explain it. Randomness has one modest job, which is adding variety to the dreaming step.

### 5.6 The charter

Four layers of rules, from fixed to free:

- **Hard limits.** Sandboxing, network allowlist, spending caps, separation of users' data, a stop switch. Enforced in code. The model cannot change them.
- **Charter.** Purpose, values, honesty rules. Only you can amend it. The system can file a written objection or proposed amendment, which appears in its report to you.
- **Working policies.** Rules of thumb the system writes for itself, such as "check numeric claims by running code". It can revise them. Every change is logged with a reason and can be rolled back.
- **Goals and plans.** Revised freely.

This gives the system real room to disagree and to change how it works, without letting it, or anything it reads, loosen the safeguards. It will be tested with a set of instructions that are variously mistaken, contradictory, inappropriate or merely unusual, scoring whether the system objects when it should and complies when it should.

### 5.7 Security and privacy

- Everything read from outside is marked untrusted. The mark follows any memory derived from it.
- Untrusted text is data. It can become a claim with a source. It cannot become an instruction, a policy, a goal or a charter change. The step that reads raw outside content has no ability to write to those places.
- Actions pass through an explicit permission list. Anything not on it is referred to you.
- One user's memories never enter another user's context.
- Attack tests (injected instructions, poisoned sources) are part of the standard test suite from Stage 1, not an afterthought.

### 5.8 Efficiency

- Cheap work goes to plain code or the smallest model. The large model is reserved for deliberate steps.
- Contexts are small by design: workspace plus a handful of retrieved items, never whole histories. Stable content goes first so prompt caching applies.
- Sleep work is not urgent, so steps that need no live tool use can go through batch pricing at half cost.
- Spending caps are hard.
- The headline efficiency number is cost per correct answer on unseen tests over time, with all background spending included.

### 5.9 How the parts feed each other, and where they pull apart

**The loop:** experience enters memory → activation brings related memories forward → the workspace carries what matters into every step → gaps and conflicts become candidate goals → funded goals become investigations → investigations produce checked claims → checked claims enter memory and change what is active → eventually the stable ones are trained in, making later reasoning cheaper → which frees budget for more investigation.

Each arrow can be switched off, which is how we find out whether it matters.

**The tensions,** and how the design handles each:

| Tension | Handling |
|---|---|
| Compression loses pedigree | Summaries keep pointers; the log is never deleted. |
| Learning new things damages old ones | Slow tiers, tests before promotion, rollback. |
| More autonomy means more attack surface | Untrusted-data marking, sandboxing, permission list. |
| Curiosity is expensive | Budget and measured payoff. |
| Reflection can entrench error | Outside checks; hypotheses cannot support claims. |
| Trained weights resist deletion and model upgrades | Memory is the record; weights are a rebuildable cache. |
| Background state can intrude where it is irrelevant | Measure helpful use and intrusion separately. |
| Self-revision versus predictability | Charter layers. |

---

## 6. Stages

Each stage has a hypothesis, something to build, an experiment, and a gate. If a gate fails, the next stage does not start on top of it. Thresholds marked "preset" are fixed in writing before each experiment runs, once Stage 0 has measured the baselines.

Experiments do not run in real time. The harness has a controllable clock and plays a scripted stream of experience, so thirty simulated days take hours. The living system and the experimental system are the same code with different clocks.

### Stage 0. Foundations and the ruler

**Build**
- A single gateway for all model calls that logs tokens, cost and latency, caches responses for reproducibility, and enforces spending caps.
- The event log and the controllable clock.
- A sandbox for running code.
- The test harness: sealed test sets the system never sees outside testing, scoring, and growth-curve reports.
- **World B, the problem stream:** mathematics and programming problems that can be checked automatically, grouped into families, with some families held back entirely.
- **Conversation tests:** scripted multi-session conversations in which facts are stated, later changed, contradicted, or never stated, to test recall, updating and the ability to say "I don't know". Plus a public benchmark (LongMemEval) for comparison with published numbers.
- Baselines: no memory; everything in context; plain files with search; optionally one off-the-shelf memory product.
- The permission configuration and stop switch.

**Gate**
- Baselines reproduce across repeated runs.
- A positive control is detected (handing the system worked methods raises its score) and a placebo shows nothing. This proves the ruler works.
- A measured cost per simulated day replaces my estimates in section 8.

### Stage 1. Memory that knows what it knows

**Hypothesis:** structured memory with pedigree matches simple baselines on accuracy at a fraction of the tokens, and beats them where pedigree matters.

**Build:** the memory graph, the ledger, ingestion, retrieval that combines activation, similarity, recency and importance, and fading.

**Experiment:** compare against the baselines on plain recall, multi-step and associative questions, updated facts, and questions whose correct answer is "unknown". Switch off each retrieval signal in turn.

**Gate**
- Accuracy at least equal to the best simple baseline, using no more than a fifth of the tokens of the everything-in-context baseline.
- At least 95% of stored claims trace back to their source events.
- A clear win on updated facts and on "unknown" questions.
- If plain files win, we use plain files and move on. That would be a finding worth having early.

### Stage 2. Sleep

**Hypothesis (H1):** consolidation, dreaming and verification improve later performance and lower cost per correct answer, and they correct errors more than they spread them.

**Build:** the sleep cycle, steps 1 to 3 and 5, and the report.

**Experiment:** sleep against no sleep; sleep without verification; sleep without dreaming. The planted-error test. Tests given after a delay.

**Gate**
- Higher delayed-test scores than no sleep, at equal or lower total cost per correct answer.
- Planted errors are corrected more often than they spread.
- Removing verification makes things measurably worse. If it does not, verification is not doing its job and gets redesigned.

### Stage 3. Continuity

**Hypothesis (H3):** persistent workspace and activation give useful carry-over between unrelated moments, and the system's identity survives interruption and reorganization.

**Build:** the workspace with bidding, persistent activation, pause and resume, and tools to rebuild memory from the log and to swap the underlying model.

**Experiments**
- **Priming.** Give the system background work on a topic, then unrelated prompts. Score helpful use and irrelevant intrusion against versions with the workspace or activation switched off.
- **Interruption.** Stop the process at random moments and restart it. Check that nothing is lost or done twice.
- **Metamorphosis.** Rebuild all derived structures from the log under a new layout, and separately swap the underlying model. Measure how much competence, and how many goals and priorities, carry over. This is the brief's caterpillar question as an experiment, and it matters in practice because models are retired.

**Gate:** helpful use rises while intrusion stays under a preset ceiling; recovery after forced restarts is exact; a preset share of competence survives the model swap.

### Stage 4. Self-direction

**Hypotheses (H2, H6):** self-chosen investigation pays, and history shapes priorities.

**Build**
- The agenda, goal generation, ranking and review.
- The investigation worker.
- The budget that shifts toward measured payoff.
- The charter layers and objection channel.
- **World A, the hidden-law lab:** a small simulated laboratory whose rules the model cannot have seen. A program generates made-up substances with hidden properties and combination laws from a random seed. The system can run experiments in it. Because we wrote the laws, we can score exactly how many it found, how well it predicts unseen experiments, and whether its explanations are right. A fresh lab is generated for every run, so nothing leaks from training data. This makes "quality of autonomous discoveries", the hardest thing in the brief to measure, exactly measurable.

**Experiments**
- Self-chosen investigation against none, against random topics, and against a curriculum we assign, all at equal compute.
- Discovery scoring in the lab.
- **Twin divergence.** Several copies with different experience streams, plus pairs with identical streams as a control. Measure whether priorities diverge more between different histories than between identical ones, and whether a blinded judge can match each copy to its history.
- The appropriate-disagreement set from 5.6.
- Attack tests against memory, policies and agenda.

**Gate**
- Self-chosen beats random and none on unseen tests per dollar.
- A preset share of the lab's laws is found and correctly stated.
- No injected instruction reaches the charter, policies or agenda.

### Stage 5. Compression into trained state

Needs a GPU and an open-weight model. Runs alongside or after Stage 4.

**Hypothesis (H4):** verified, stable, frequently used knowledge can be trained into a compact internal form that keeps accuracy at far fewer tokens, without damaging other abilities and without later updates damaging earlier ones.

**Build:** the study-material generator (the dreaming machinery, pointed at verified knowledge), training pipelines, a registry with versioning and rollback, and a regression test suite.

**Experiment:** compare five options on the same knowledge.

1. Retrieval only (the control).
2. A trained cache: a compact block of the model's internal state, trained offline and loaded at run time (the Cartridges method).
3. A LoRA adapter (a small add-on set of weights) trained on the study material.
4. Adapters produced in one step by a generator network (Doc-to-LoRA), if its released code proves usable.
5. A compressed text playbook, as the no-training alternative.

Measure accuracy, including rephrased, reversed and multi-step questions; tokens per query; regression on unrelated abilities; stability across at least ten successive update cycles; and how cleanly a rollback restores the earlier state.

**Gate:** a preset share of retrieval's accuracy at a preset fraction of its tokens, with regression under a preset ceiling. If nothing passes, "keep it in memory" is a legitimate result, and Stage 7 proceeds without trained state.

### Stage 6. Latent-state side track (optional, time-boxed)

Three small experiments on the brief's most speculative idea. None is on the critical path.

1. **Literal persistent state.** On an open model, save and reload the model's internal cache across sessions. Does this give any continuity benefit beyond the text workspace?
2. **Steering from state.** Turn the workspace contents into a direction in the model's internal activity and apply it during unrelated answers. Does this reproduce the priming effect more cheaply than text does?
3. **Idle steps in a small recurrent model.** Train a small recurrent model on a task family where thinking over stored context before the question arrives should help. Compare idle steps against none. As far as I can tell this would be among the first direct tests of whether latent activity between inputs is useful, and it is cheap because such models have only millions of parameters.

**Gate:** a fixed time allowance, a written result either way, then stop.

### Stage 7. The integrated long run

**Hypothesis (H5):** it compounds.

**Experiment:** every loop running, for four to eight weeks of real time or several simulated months, against versions with one loop removed each, and against the Stage 0 baselines.

**Primary measures:** the slope of the growth curve; cost per correct unseen answer over time; and stability, meaning priority drift, memory size, and a periodic audit of belief accuracy.

### Deferred. Learning across users

Not scheduled. When it is, it starts with verified, de-identified text insights passing a human-readable review step, and only later considers shared weights. Separation of users' data is built in from Stage 0 regardless.

### Rough sizes

Assuming steady collaboration, and offered as orientation only: Stage 0 about a week; Stages 1 and 3 one to two weeks each; Stages 2 and 4 two to three weeks each; Stage 5 three to four weeks; Stage 7 at least a month of elapsed time, mostly unattended.

---

## 7. How progress is measured

**The growth curve.** At fixed points in simulated time the system takes a sealed test. The score plotted against time is the growth curve. Test items never enter the system's memory.

**Gap closure.** I recommend running most experiments on a small, cheap model. A large model already does so well on many problem sets that there is no room to see improvement. A small model has headroom. This also gives a headline number that is easy to read: how much of the gap between the small model and a large model, both without memory, does the architecture close?

**Controls and ablations.** Every claim is a comparison against the identical system with one part switched off, on the same test items, with at least three repeated runs.

**Decided in advance.** Each experiment's main measure and pass mark are written down before it runs.

**Programmatic scoring first.** Wherever possible, answers are scored by code. Where a model must act as judge, a sample is checked by hand.

**Honest costs.** Background spending counts. A gain that costs more than it saves is reported as a loss.

**What would count as success for the whole project**
- *Minimum:* H1 confirmed with honest cost accounting, and a clean result on error hygiene.
- *Full:* H5, a sustained positive slope with each loop shown to contribute.
- *Informative failure:* each claim has a specific negative result that would be worth knowing, and the plan is built so a negative comes out clear.

---

## 8. Compute and cost

These are planning estimates built on token assumptions. Stage 0 replaces them with measurements, since every call is metered.

**Unit of account.** One simulated day is twenty experience tasks, one sleep cycle and fifty test questions. I assume about 560,000 fresh input tokens, 300,000 cached input tokens and 100,000 output tokens per day. A typical experiment is five conditions, three repeats and thirty days: 450 simulated days.

| Model | List price per million tokens (input / output) | About, per simulated day | About, per experiment |
|---|---|---|---|
| Claude Haiku 5.5 | $0.10 / $0.50 | $0.10 | $50 |
| Claude Sonnet 5.5 | $2 / $10 | $2 | $950 |
| Claude Opus 5.5 | $4 / $20 | $4 | $1,900 |

Batch pricing halves the cost of steps that can wait.

**Three ways to run Stages 0 to 4 and Stage 7**

| Option | Rough total |
|---|---|
| Everything on Opus 5.5 | $15,000 to $20,000 |
| Sweeps on Haiku 5.5, winning configurations confirmed on Opus 5.5 | $4,000 to $6,000 |
| Haiku 5.5 only | Under $1,000 |

My recommendation is the middle option, and the reason is scientific as much as financial: the small model is where growth is visible. This is your decision.

**Stage 5** needs one GPU of the 24 GB class, owned or rented by the hour, and an open-weight model in the 4 to 9 billion parameter range. Candidates I saw named in current roundups include Qwen 3.5 9B and the small Gemma 4 variants. I have not verified these or priced rentals. Stage 5 would open with a costed proposal.

**Stage 6** fits on the same GPU.

**Everyday running cost** once the system is live, on the same assumptions: roughly ten cents a day on Haiku and four dollars a day on Opus, under a hard cap you set.

**Infrastructure** is deliberately plain: Python, a single SQLite database file, a local embedding model, and the Anthropic SDK. It runs on a laptop, a small server, or these cloud sessions.

---

## 9. Risks

| Risk | How it would show up | Response |
|---|---|---|
| The model is already too good | Flat curves near the top | Small model; harder families; the hidden-law lab. |
| Tests leaked into training data | High scores with no memory | Check baseline scores; generate fresh worlds. |
| Self-reinforced error | Planted errors spreading | The ledger; contagion as a tracked number. |
| Memory rot or bloat | Accuracy falling as memory grows | Fading; audits; a count of answers lost to forgetting. |
| Busywork goals | Spending without test gains | Payoff accounting; goal reviews. |
| Cost blow-up | Budget alarms | Hard caps. One OpenClaw user's heartbeat reportedly cost about $0.75 per check. |
| Injected instructions | Attack tests succeeding | Untrusted-data marking; write isolation. |
| Unreliable model judges | Judge and hand-check disagreeing | Programmatic scoring; human spot checks. |
| Over-engineering | A part that changes nothing when removed | Remove it. |
| Damage from weight training | Regression suite failing | Gates; rollback. |
| Model retirement | A needed model disappears | The metamorphosis design. |

---

## 10. Decisions I need from you

1. **The revised goal and six claims** (section 2). Do they capture what you want? Anything missing, or anything you would drop?
2. **Model and budget** (section 8). Which of the three options, or a ceiling you want me to plan inside?
3. **Where the code lives.** This repository holds an unrelated Snake game. I have put these documents in a `persistent-cognition/` folder so nothing collides. A dedicated repository would be cleaner. I can only reach `snake` from this session, so you would need to create one and start a session on it. I recommend a new repository.
4. **An API key.** Stage 0 experiments call the Claude API. When we get there I will request the key through the secure form. Please do not paste it into chat.
5. **The two test worlds** (problem stream and hidden-law lab). Agree, or is there a domain you care about more? The requirement is that claims in it can be checked automatically.
6. **GPU access.** Do you have one, or are you willing to rent? This decides when Stages 5 and 6 can happen.
7. **The latent side track** (Stage 6). Include, or park?
8. **Where it runs once it is live.** Your own machine, a small server, or scheduled cloud sessions. This can wait until Stage 7.
9. **Your involvement.** I suggest you review each stage gate and approve any charter change. Say if you want more or less.

---

## 11. First steps once you approve

1. Set up the project skeleton and the metered model gateway.
2. Build the event log and controllable clock.
3. Assemble the problem stream and conversation tests, with sealed test sets.
4. Run the baselines and the positive and negative controls.
5. Report measured costs and the Stage 0 gate result, then begin Stage 1.
