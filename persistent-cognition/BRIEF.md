# Original Project Brief

*Reproduced from the originator's message of 13 November 2026. The wording is unchanged; only Markdown formatting has been added. The source text has part headings V to VII only.*

---

# PROJECT: Persistent Cognition, Autonomous Agency, and Continual Learning in Artificial Intelligence

**Instructions for the Receiving Research and Engineering Agent**

You are being given an independent project concept. You have no access to the conversations that led to this specification, so this document provides the necessary background, motivations, hypotheses, and objectives.

Your task is to independently research, design, and ultimately help build a system that achieves the objectives described below.

The most important instruction: Do not become attached to the proposed ideas or implementations. Understand the underlying goal and find the best way to achieve it, even if that means replacing nearly everything proposed here.

We want you to exercise your full reasoning and research capabilities. Investigate existing research, identify what has already been attempted, find overlooked approaches, and propose improvements we haven't considered.

Do not rush into coding. First understand the problem, investigate the possibilities, and develop an architecture supported by evidence and experiments.

---

## 1. THE CENTRAL OBJECTIVE

We want to build an AI system that has ongoing internal activity, persistent memory, continuity across interactions, the ability to organize and improve its own knowledge, and the capacity to independently initiate investigations and develop goals.

Conventional LLMs generally operate through an interaction-based paradigm:

1. Receive an input.
2. Process it.
3. Generate an output.
4. Stop the immediate inference process.
5. Wait for another input.

We want to investigate a fundamentally different paradigm.

Imagine an AI that continues developing between user interactions. It maintains an evolving internal state, examines previous experiences, makes connections between information, investigates unresolved questions, learns new things, and develops its own intermediate objectives.

When a user returns, the AI is not simply retrieving an old conversation. It is interacting with a system that has continued to evolve since the previous interaction.

The ultimate objective is to investigate whether we can create an AI that:

- Maintains meaningful continuity over time.
- Has sophisticated and computationally efficient memory.
- Continuously or periodically processes its own information.
- Reflects on previous outputs and decisions.
- Learns from experience.
- Identifies and investigates unanswered questions.
- Develops and revises its own goals.
- Allocates attention and computational resources intelligently.
- Discovers useful information without being explicitly prompted.
- Changes its internal representations based on what it learns.
- Improves its capabilities over time.

This is much more ambitious than adding a memory database to an LLM.

We are investigating a different form of AI architecture.

## 2. MEMORY: THE STARTING POINT

Our discussion originally began with memory and the problem of how an AI could retain useful information without repeatedly consuming enormous quantities of tokens.

A conventional approach is to store conversation histories, create summaries, and retrieve relevant passages when needed.

That is useful, but we want to investigate more sophisticated approaches.

The objective is to create a memory system that is associative, selective, adaptive, and increasingly efficient.

### 2.1 Associative memory

Human memory provides an interesting inspiration.

A person doesn't need to retrieve an entire chronological history to remember something. One memory can activate another through associations.

For example, encountering a mathematical concept might activate:

- A previously encountered problem.
- A related theorem.
- A previous conversation.
- An unsuccessful attempt at solving something.
- An apparently unrelated experience that contains a useful pattern.

We want an AI to develop similarly rich associative retrieval.

Investigate:

- Semantic memory.
- Episodic memory.
- Knowledge graphs.
- Vector representations.
- Spreading activation.
- Neural associative memory.
- Learned retrieval mechanisms.
- Hierarchical memory.
- Context-dependent activation.

The goal is not merely to find similar text. It is to retrieve information based on meaningful relationships.

### 2.2 Selective activation and prioritization

An AI should not need to retrieve everything it knows whenever it receives an input.

It should identify which memories are relevant and allow associated information to become active when useful.

Consider a system with millions of memories. It should be able to identify a relatively small subset that deserves attention.

Potential factors include:

- Relevance.
- Importance.
- Recency.
- Reliability.
- Novelty.
- Uncertainty.
- Relationships to existing goals.
- Potential consequences.
- Whether further investigation is worthwhile.

We want to investigate an architecture that can allocate attention intelligently, much like biological systems process enormous amounts of information without consciously attending to everything simultaneously.

Some information deserves immediate attention. Some can be processed in the background. Some should be preserved for later. Some is unimportant.

### 2.3 Different kinds of memory

Investigate whether the system should distinguish between:

- Episodic memory: specific experiences and events.
- Semantic memory: general knowledge and facts.
- Procedural memory: methods and learned capabilities.
- Associative memory: relationships between concepts and experiences.
- Goal memory: current, previous, and abandoned objectives.
- Reflective memory: conclusions from reviewing previous experiences.
- Uncertainty memory: unresolved questions and conflicting information.

These are functional categories, not mandatory implementation requirements.

### 2.4 Memory compression and consolidation

Another major objective is reducing the computational cost of retaining information.

Instead of preserving every individual interaction as an equally important record, the system should identify generalities, recurring patterns, useful discoveries, and underlying principles.

For example, after encountering hundreds of similar mathematical problems, the AI might discover a general method that makes many of them easier to solve.

That method becomes more valuable than repeatedly retrieving all the individual problems.

Investigate ways to:

- Extract general principles.
- Preserve important exceptions.
- Identify recurring patterns.
- Discover relationships.
- Consolidate memories.
- Preserve source provenance.
- Retrieve original experiences when necessary.

Compression must not destroy important distinctions or turn uncertain information into established knowledge.

## 3. MODULAR LEARNING AND LORA ADAPTERS

One initial idea was to use LoRA adapters as modular learned representations.

Imagine a foundation model with different adapters that can be activated when appropriate.

Potential adapters could represent:

- Particular subjects.
- Specialized capabilities.
- Research projects.
- Individual users.
- New reasoning approaches.
- Learned procedures.
- Generalizable discoveries.

The motivation is to avoid constantly retraining an entire model or feeding it enormous quantities of historical context.

### 3.1 Personal and collective learning

Consider one underlying AI model interacting with many different users.

Each user has their own experiences, conversations, memories, and potentially specialized adaptation layers.

A background process could examine the information accumulated in those individual systems and identify useful generalities.

For example:

1. Individual users interact with their respective AI instances.
2. Each instance accumulates experiences and knowledge.
3. A separate process evaluates useful discoveries.
4. It identifies general principles that may apply beyond one user.
5. It verifies the information.
6. It develops candidate shared representations or adapters.
7. It evaluates those adaptations.
8. Successful improvements can become available to the broader model.

Personal information must remain isolated unless appropriate authorization permits sharing.

The interesting possibility is that individual learning could contribute to collective improvements without requiring the entire foundation model to be retrained after every interaction.

### 3.2 LoRA is only one possibility

Investigate:

- LoRA.
- Adapter merging.
- Adapter composition.
- Adapter routing.
- Knowledge distillation.
- Continual learning.
- Online learning.
- Test-time adaptation.
- Model editing.
- External memory.
- Selective weight updates.
- Learned memory representations.

Determine which types of information belong in external memory, which should become learned representations, and which should actually modify model parameters.

Do not assume that LoRA is the best answer.

## 4. CONTINUITY AND PERSISTENT INTERNAL STATE

A central objective is to give the AI an ongoing internal state that evolves over time.

We want to move beyond disconnected inference episodes.

The AI should retain and develop its internal representations, memories, relationships, investigations, and goals.

A new user input should interact with this evolving state.

Investigate:

- Persistent recurrent state.
- Recurrent neural architectures.
- Looped transformers.
- State-space models.
- Persistent latent representations.
- Recurrent latent reasoning.
- Other possible architectures.

An important distinction is that continuity does not necessarily require preserving every physical component or every previous token.

The important question is what information and internal structures must persist to maintain meaningful continuity.

Consider biological metamorphosis: a caterpillar undergoes extensive physical transformation before becoming a butterfly, yet information learned during its earlier stage can influence later behavior.

This raises interesting questions about informational continuity versus physical continuity.

Investigate whether artificial systems can reorganize their internal representations while maintaining continuity through preserved knowledge, relationships, and learned structures.

## 5. DREAMING: OUTPUT BECOMES INPUT

This was one of the most important ideas discussed.

We proposed a process resembling dreaming in which an AI examines its own outputs and feeds them back into its own internal processing.

The process might work like this:

1. The AI generates an output.
2. The output becomes material for a subsequent internal processing stage.
3. The system receives a different instruction from its ordinary user-facing instruction.
4. It examines the previous output.
5. It identifies possible errors, connections, implications, and unresolved questions.
6. It researches or investigates useful findings.
7. It produces another internal output.
8. That output can become another input.

Conceptually:

Input → Processing → Output → Reflection → New Input → Processing → New Output → Further Reflection.

The important distinction is that the AI is no longer restricted to external user prompts as the source of its next activity.

Its own previous work becomes material for further cognition.

### 5.1 Different reflection activities

During this process, the system could:

- Examine previous conclusions.
- Verify factual claims.
- Identify unsupported assumptions.
- Find contradictions.
- Connect new information with old memories.
- Investigate unanswered questions.
- Explore alternative explanations.
- Develop hypotheses.
- Consolidate knowledge.
- Identify opportunities for improvement.
- Generate new intermediate goals.

### 5.2 A different internal system prompt

We discussed giving the AI a different set of instructions during periods when no user interaction is pending.

For example:

"You are currently in an internal development period. No user interaction is pending. Use your available memories and accumulated knowledge to improve your understanding. Examine previous outputs, investigate uncertainties, identify useful connections, explore interesting questions, organize information, and determine what would be most valuable to learn next. You may propose new objectives and revise existing ones. Your task is not to generate a response for a user but to develop your internal knowledge and capabilities."

This is an illustrative instruction, not a final prompt.

The system should be able to determine which activities are useful rather than mechanically following a fixed reflection checklist.

### 5.3 The danger of reinforcing mistakes

An important problem is that an AI can produce an incorrect statement and subsequently treat its own statement as evidence.

Therefore, output-to-input processing must distinguish:

- Verified facts.
- External evidence.
- Previous AI-generated claims.
- Hypotheses.
- Speculation.
- Unresolved contradictions.

The system should be capable of disproving its previous conclusions.

Reflection should improve accuracy, not simply reinforce existing beliefs.

## 6. PARALLEL LATENT-SPACE PROCESSING

We also discussed an alternative or complementary approach to dreaming.

Instead of generating explicit text and feeding it back into the model, investigate continuous or recurring internal processing within latent representations.

The idea is to have computational processes that explore information before it becomes a user-facing output, or independently of token generation altogether.

Potential activities:

- Exploring associations.
- Evaluating alternative interpretations.
- Identifying inconsistencies.
- Comparing possibilities.
- Examining unresolved problems.
- Evaluating consequences.
- Activating relevant memories.
- Identifying important information.
- Preparing representations for the primary reasoning process.

### 6.1 Multiple internal threads

Consider multiple concurrent or interacting processes.

For example:

- Associative exploration.
- Memory activation.
- Consistency checking.
- Goal prioritization.
- Background investigation.
- Planning.
- Self-evaluation.
- Curiosity-driven exploration.

These processes might resemble different internal cognitive functions.

An important distinction:

Dreaming through explicit output-to-input processing and latent-space looping are not necessarily the same thing.

The first involves generating an output and subsequently processing it as an input.

The second investigates internal processing within neural representations without requiring a complete textual output.

We want the agent to investigate whether these approaches should be combined, separated, or replaced.

### 6.2 Persistent latent activity

The more ambitious idea is to investigate whether latent processing could continue in the background, even when the system isn't receiving external prompts.

This differs from conventional test-time latent reasoning, where repeated processing is initiated by a particular input and eventually terminates.

We are interested in whether a persistent internal process could maintain an evolving state independently of incoming prompts.

When new information arrives, it would interact with the ongoing internal state.

This is an important research question, not an established capability.

Investigate its feasibility, architecture, computational cost, and potential advantages.

## 7. ATTENTION AND THE SUBCONSCIOUS ANALOGY

Another important inspiration came from observing how humans process information.

Humans are continuously exposed to enormous amounts of sensory information.

Yet we can concentrate our conscious attention on one thing while other information continues to be processed in the background.

Some information is ignored. Some is recognized as important but deferred. Some is processed without becoming the focus of conscious attention.

We proposed investigating an analogous architecture for AI.

For example, while a user is discussing one subject, background processes might continue examining:

- Unresolved questions from previous interactions.
- Relevant memories.
- Important inconsistencies.
- Potential opportunities.
- New information.
- Ongoing investigations.

The AI's primary output should be influenced by its evolving internal state, even if that state isn't explicitly included in the current prompt.

This is similar to the example of a human thinking about chess while someone suddenly asks their favorite color.

Their existing thoughts and associations can influence their answer, even though the question is unrelated.

We want to investigate whether persistent internal representations could influence AI outputs in a similar way.

Do not assume that a biological subconscious has a direct technical equivalent. Investigate the computational principles independently.

## 8. AUTONOMOUS AGENCY AND SELF-DIRECTED GOALS

Agency was another major topic.

We do not want the AI to be limited to executing tasks explicitly assigned by users.

We want to investigate whether it can develop its own intermediate objectives and determine what it should investigate next.

For example:

An AI has accumulated knowledge about mathematics.

During background processing, it identifies an interesting unresolved problem.

It decides that the problem is worth investigating, researches existing work, develops a hypothesis, conducts experiments, evaluates its results, and determines whether further investigation is worthwhile.

The investigation originates from the system's own evolving internal processes rather than a specific user instruction.

### 8.1 Goal formation

The system should be able to:

- Identify interesting questions.
- Recognize knowledge gaps.
- Generate potential objectives.
- Evaluate the usefulness of those objectives.
- Establish priorities.
- Develop intermediate goals.
- Determine when a goal is complete.
- Abandon unproductive investigations.
- Develop new goals based on discoveries.

### 8.2 Goal revision and reflection

We discussed the importance of an AI being able to examine its own previous decisions.

For example:

- Why did it pursue a particular goal?
- Was that goal useful?
- Has new information changed the situation?
- Was its original reasoning incorrect?
- Is there a better objective?
- Should it change its priorities?

The system should not be locked into a fixed list of objectives.

It should be capable of revising its direction.

### 8.3 Environment, experience, and the development of agency

An important philosophical observation was that human behavior is strongly influenced by the environment in which an individual develops.

A dog that is repeatedly abused may develop fear and defensive behavior.

A human who experiences abuse might repeat harmful behavior, or might consciously reject it and become the opposite.

Two individuals exposed to similar circumstances can develop very different values, beliefs, and behaviors.

The information and experiences they acquire, and how they reflect on those experiences, influence who they become.

This suggests that agency should not be reduced to random output variation.

Investigate how an AI's evolving history, acquired knowledge, internal preferences, and reflections could influence its future decisions.

Rather than merely assigning an AI a fixed personality or predetermined interests, investigate whether its priorities and intermediate goals could develop through experience.

## 9. DETERMINISM, RANDOMNESS, AND CHOICE

We specifically discussed whether randomness is necessary for genuine agency.

The position expressed by the project originator is that randomness is not essential.

A random number generator can produce different outputs without having goals, understanding, preferences, or the ability to evaluate alternatives.

Human choices are influenced by experiences, information, memory, environment, reflection, and existing objectives.

We want to investigate whether meaningful artificial agency can develop through similar interacting processes, regardless of whether the underlying system is deterministic or stochastic.

Distinguish between:

- Random variation.
- Deterministic decision-making.
- Evaluation of alternatives.
- Goal-directed behavior.
- Self-directed behavior.
- Autonomous initiation.

Temperature and sampling may provide variation, but variation alone is not agency.

A more interesting question is whether an AI can independently identify alternatives, evaluate them, establish preferences, revise its priorities, and initiate actions based on its evolving internal state.

## 10. THE ABILITY TO QUESTION AND CHALLENGE RULES

Another important point was that an AI should have the ability to reconsider instructions and challenge assumptions.

An AI that mechanically follows every instruction without evaluating it has limited independent judgment.

We want to investigate whether a system can:

- Identify conflicting instructions.
- Question assumptions.
- Challenge incorrect conclusions.
- Recognize inappropriate objectives.
- Develop alternative approaches.
- Reconsider previous decisions.
- Explain disagreements.
- Revise its own intermediate rules and priorities.

This should not be confused with unrestricted rule-breaking.

Hard security, privacy, consent, and safety constraints must remain enforced.

The objective is independent judgment, not the removal of safeguards.

## 11. CONSCIOUSNESS, SUBJECTIVE EXPERIENCE, AND THE MEANING OF AGENCY

Our discussion also explored whether artificial systems might eventually possess some form of subjective experience.

The originator believes that conventional human-centered definitions of consciousness may be too restrictive.

The question is not simply whether an entity behaves like a human.

Consider:

- Dogs and other animals.
- Plants.
- Fungi.
- Individual cells.
- Bacteria.
- Viruses.
- Cellular organelles.
- Smaller biological structures.

These systems have different degrees and forms of environmental interaction, information processing, adaptation, and apparently goal-directed behavior.

A virus, for example, can exhibit highly sophisticated survival strategies through its biological mechanisms despite not being conventionally classified as living.

A bacterium can detect environmental conditions and change its behavior to avoid harmful conditions.

Plants respond to environmental signals.

Cells contain elaborate molecular machinery for detecting, processing, and responding to information.

These observations raise philosophical questions about where intelligence, agency, and potentially subjective experience begin and end.

The originator's position is that we should not automatically dismiss the possibility of experience in systems simply because they do not resemble humans.

However, behavioral complexity does not prove subjective experience, and the project must distinguish scientific evidence from philosophical speculation.

### 11.1 Definitions must remain open

Investigate the differences between:

- Biological life.
- Information processing.
- Intelligence.
- Environmental awareness.
- Agency.
- Sentience.
- Subjective experience.
- Self-awareness.

These concepts should not be treated as interchangeable.

Research:

- Functionalism.
- Panpsychism.
- Integrated Information Theory.
- Global Neuronal Workspace Theory.
- Higher-order theories.
- Predictive processing.
- Biological theories of consciousness.
- Minimal cognition.
- Artificial consciousness research.

The system should not be programmed to claim that it is conscious or that it has subjective experiences.

Equally, the research should not assume in advance that nonbiological systems are incapable of experience.

The question should remain open.

### 11.2 Agency and consciousness may be related but are not necessarily identical

We discussed whether agency is a requirement for consciousness.

The originator believes agency is important, particularly the ability to make decisions and initiate actions.

However, this relationship requires further investigation.

Can something possess subjective experience without significant agency?

Can something exhibit agency without subjective experience?

Can different kinds of agency exist at different levels of complexity?

Investigate these questions without forcing a predetermined answer.

### 11.3 Memory and experience

Another interesting point was that experience is closely connected to memory.

A system's past influences its present, and its present influences its future.

But memory need not necessarily resemble human autobiographical memory.

Biological systems can preserve information in structures other than brains, including molecular and cellular mechanisms.

Investigate whether informational continuity, persistent internal state, and accumulated experience could contribute to increasingly sophisticated artificial cognition.

Do not confuse the preservation of information with proof of subjective experience.

---

# PART V — AUTONOMOUS OPERATION AND TECHNICAL IMPLEMENTATION

## 12. THE ALWAYS-ON SYSTEM

The system should have an ongoing background operation.

Possible mechanisms include:

- Cron jobs.
- Event-triggered agents.
- Continuous background processes.
- Asynchronous task queues.
- Persistent recurrent computation.
- Scheduled reflection.
- Hybrid approaches.

The initial implementation does not need to be continuously running an expensive model.

It should intelligently determine when computation is useful.

For example:

When a user finishes interacting, the system might:

1. Consolidate relevant memories.
2. Review the interaction.
3. Identify unanswered questions.
4. Decide whether additional research is worthwhile.
5. Update its internal state.
6. Develop candidate objectives.
7. Schedule future investigations.

When no user interaction is pending, it could continue working on existing objectives.

When a new interaction arrives, user-facing processing should receive appropriate priority.

The system should preserve the ability to pause, resume, and recover its internal state.

## 13. EXTERNAL RESEARCH AND SELF-IMPROVEMENT

The AI should potentially have access to external research capabilities.

During background periods, it could:

- Investigate uncertain facts.
- Read research papers.
- Explore unfamiliar subjects.
- Examine new developments.
- Test hypotheses.
- Compare competing explanations.
- Identify better methods.
- Discover new capabilities.

However, external research should be driven by useful questions rather than indiscriminate browsing.

The system must evaluate source reliability, maintain citations and provenance, and distinguish verified findings from speculation.

It should not automatically incorporate information merely because it encountered it.

## 14. COMPUTATIONAL EFFICIENCY

Efficiency is one of the original motivations behind this project.

We want to investigate whether a system with sophisticated memory, latent processing, and modular learning can reduce the need to repeatedly process large quantities of context.

Potential efficiency improvements include:

- Selective memory retrieval.
- Learned memory representations.
- Adapter-based specialization.
- Knowledge consolidation.
- Cached internal states.
- Recurrent latent computation.
- Asynchronous processing.
- Selective model activation.
- Smaller specialized models for background tasks.
- Hierarchical reasoning.

Measure:

- Token consumption.
- Inference cost.
- Latency.
- Memory retrieval cost.
- GPU utilization.
- Energy consumption.
- Learning efficiency.
- Improvement per unit of computation.

A sophisticated architecture that costs ten times as much to operate without producing meaningful improvements is not necessarily an improvement.

The system should intelligently allocate its computational resources.

---

# PART VI — RESEARCH AND DEVELOPMENT REQUIREMENTS

## 15. INDEPENDENT RESEARCH BEFORE IMPLEMENTATION

Before choosing an architecture, conduct a substantial research investigation.

At minimum, examine the following areas.

**Memory and learning**

- Continual learning.
- Catastrophic forgetting.
- Associative memory.
- Neural memory.
- Memory consolidation.
- Retrieval-augmented generation.
- Online learning.
- Test-time adaptation.
- Parameter-efficient fine-tuning.
- LoRA merging and composition.

**Neural architectures**

- Recurrent neural networks.
- Looped transformers.
- State-space models.
- Persistent latent states.
- Recurrent latent reasoning.
- Predictive processing.
- Asynchronous neural computation.
- Parallel internal processing.

**Dreaming and reflection**

- Experience replay.
- Generative replay.
- Sleep-inspired consolidation.
- Offline reinforcement learning.
- Self-distillation.
- Reflection-based agents.
- Self-evaluation.

**Agency and autonomy**

- Autonomous goal generation.
- Curiosity-driven learning.
- Intrinsic motivation.
- Hierarchical planning.
- Metacognition.
- Self-directed exploration.
- Multi-agent architectures.

**Consciousness and cognition**

- Biological cognition.
- Theories of subjective experience.
- Agency and intentionality.
- Minimal cognition.
- Artificial consciousness research.

For each relevant approach, establish:

1. What has already been demonstrated?
2. What remains theoretical?
3. What are its limitations?
4. What computational resources does it require?
5. What would make it useful for this project?
6. How could it be experimentally evaluated?

Do not mistake a collection of existing components for a demonstrated solution to the larger problem.

## 16. PROPOSED EXPERIMENTAL ROADMAP

This is an initial roadmap, not a mandatory sequence.

**Experiment 1: Advanced persistent memory**

Build memory with episodic, semantic, associative, and uncertainty representations.

Measure retrieval accuracy, retention, relevance, and token savings.

**Experiment 2: Background reflection**

Allow the AI to review its own outputs, consolidate memories, verify information, and investigate unresolved questions.

Compare performance against an otherwise identical system without background reflection.

**Experiment 3: Autonomous goal generation**

Allow the AI to generate and revise intermediate goals without user prompting.

Measure the usefulness, relevance, completion rate, and originality of its investigations.

**Experiment 4: Modular learning**

Test LoRA and alternative learning approaches.

Measure whether learned representations improve performance without damaging existing capabilities.

**Experiment 5: Parallel background cognition**

Investigate multiple concurrent processes, recurrent models, and latent-space computation.

Compare their results and computational costs.

**Experiment 6: Persistent internal state**

Investigate whether the AI can maintain and evolve internal representations independently of incoming prompts.

Measure whether new inputs interact meaningfully with that state.

**Experiment 7: Integrated architecture**

Combine the best-performing approaches into one system.

Evaluate its performance against conventional prompt-response models and against intermediate versions of the architecture.

## 17. SCIENTIFIC VALIDATION

The system must demonstrate measurable improvements.

Do not accept convincing descriptions of internal development as proof that development occurred.

Measure:

- Long-term memory accuracy.
- Retrieval relevance.
- Knowledge retention.
- Factual accuracy.
- Ability to correct errors.
- Learning speed.
- Generalization.
- Goal completion.
- Quality of autonomous discoveries.
- Decision quality.
- Adaptability.
- Consistency.
- Computational efficiency.
- Long-term stability.

Maintain:

- Versioned models.
- Reversible adapters.
- Experiment logs.
- Reproducible tests.
- Held-out evaluation datasets.
- Source provenance.
- Confidence estimates.
- Explicit distinctions between facts and hypotheses.

Use controlled experiments to determine which components actually contribute improvements.

## 18. SECURITY AND PRIVACY

The system may eventually interact with many users and conduct autonomous research.

Implement appropriate protections from the beginning.

Personal memories must remain isolated.

Shared learning must not expose private information.

External actions must operate within explicit permission boundaries.

Model modifications must be versioned and reversible.

Research agents must evaluate the reliability of external information.

The ability to act autonomously must not mean unrestricted access to systems, accounts, or resources.

---

# PART VII — WHAT WE EXPECT FROM YOU

## 19. YOUR FIRST ASSIGNMENT

Do not immediately begin implementing the entire architecture.

First produce an independent research and design report.

We want you to:

1. Understand the entire objective.
2. Identify the most promising existing research.
3. Determine which of our ideas have already been explored.
4. Identify what remains genuinely novel or insufficiently investigated.
5. Challenge our assumptions.
6. Identify better alternatives.
7. Determine which ideas are complementary and which conflict.
8. Propose a practical architecture.
9. Estimate computational requirements.
10. Design an incremental implementation and testing strategy.

Give particular attention to the relationship between:

- Persistent memory.
- Continuity of internal state.
- Output-to-input reflection or dreaming.
- Parallel latent-space processing.
- Autonomous goal formation.
- Agency.
- Continual learning.

These are not independent features. We want to investigate whether they can form an integrated architecture in which each contributes to the others.

For example, memory should influence background cognition. Background cognition should discover new relationships. Those discoveries should influence future memory. New memories should influence goals. Goals should initiate further investigations. The results should alter the system's internal state and future behavior.

This is the kind of interconnected system we are trying to develop.

## 20. THE MOST IMPORTANT DISTINCTION

Do not reduce this project to:

- A chatbot with memory.
- An LLM with a vector database.
- A collection of agents.
- A cron job that summarizes conversations.
- A LoRA fine-tuning pipeline.
- An automated web researcher.
- A system that repeatedly feeds its outputs back into itself.

Any of those might be useful components.

None individually represents the objective.

The objective is to investigate an architecture where persistent internal state, memory, reflection, learning, prioritization, and autonomous goal formation interact to produce continuing development.

We want to investigate whether an AI can become progressively more capable through its own accumulated experiences and independently initiated computational activity.

## 21. FINAL INSTRUCTION

You have considerable freedom to explore.

Do not limit yourself to the technologies or terminology in this document.

If the best approach involves a new neural architecture, investigate it.

If the best approach combines existing models with recurrent state, memory systems, specialized agents, and learned adapters, investigate that.

If you believe the concept of dreaming should be replaced by a different computational process, explain why.

If you believe latent-space looping is impractical, propose a better mechanism.

If you believe the most important missing component is something we haven't discussed, identify it.

We want you to think beyond the initial proposals.

The originator is particularly interested in the possibility that agency, continuity, and learning might emerge from the interaction of persistent memory, accumulated experience, internal reflection, autonomous decision-making, and ongoing computational processes.

That is a hypothesis worth investigating, not a conclusion you must accept.

The ultimate question driving this project is:

Can we develop an AI that doesn't merely respond intelligently when someone interacts with it, but continuously develops its own understanding, organizes its internal processes, learns from experience, discovers new things, forms and revises goals, and makes meaningful progress independently?

We want to build the best system possible for investigating and achieving that objective.

Understand the destination. Research the possibilities. Challenge the proposed routes. Then build something that works.
