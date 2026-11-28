# Project Validation Tracker

> Source of truth for project status and role-fit scores.
> Format contract lives in `AGENTS.md` — keep entries in this exact shape.
> Status: `validated` (proven, may appear on role resumes) or `pending` (not validated yet).
> Scores: 0–10 per role. Rubric: 9–10 flagship, 7–8 strong supporting, 5–6 partial, 3–4 tangential, 0–1 none.
> Role resume inclusion rule: validated projects with score ≥ 7 are auto-injected into that role's resume.

## Agent Smith

- status: validated
- done: false
- link:
- date:
- stack: Python 3.10, MCP, Docker, Pydantic, uv
- summary: Autonomous agentic framework that solves coding challenges by generating Python, executing it in a sandboxed environment with MCP tools, and iterating until solved.
- bullets:
  - Implemented a Thought → Code → Observation agent loop that extracts LLM-generated Python from multiple output formats and executes it in a configurable security sandbox with import, filesystem, network, timeout, and memory restrictions.
  - Built MCP servers exposing file-system, code-search, and execution tools over both stdio and HTTP transports, callable as functions inside the sandbox.
  - Developed multi-provider LLM integration with token rotation, fallback, retry handling, and full usage tracking logged per step in Pydantic structures.
  - Benchmarked 5+ models across SWE-bench tasks, comparing solve rates, token costs, and provider reliability with an ablation study.
- scores:
  - ai-engineer: 9
  - ml-engineer: 7
  - ai-security: 10
  - data-engineer: 7
  - ai-db-architect: 6
  - cv-nlp: 6
  - research-scientist: 4

## Datomic

- status: validated
- done: false
- link:
- date:
- stack: SQL, SQLite, PostgreSQL, Redis, ClickHouse, Neo4j (Cypher), DuckDB
- summary: Database mastery project across six engines — SQL foundations, relational PostgreSQL, key-value Redis, columnar ClickHouse, graph Neo4j, and federated DuckDB.
- bullets:
  - Cleared 20 graded levels covering joins, window functions, transactions, indexes, and schema design across SQLite and PostgreSQL.
  - Solved key-value, columnar, and graph query problems by selecting the engine and primitive fitting each problem's shape.
  - Wrote federated DuckDB queries answering questions across two engines simultaneously without copying data.
  - Defended live exam problems, justifying engine choice, trade-offs, and why federation beats duplication.
- scores:
  - ai-engineer: 5
  - ml-engineer: 7
  - ai-security: 6
  - data-engineer: 9
  - ai-db-architect: 10
  - cv-nlp: 4
  - research-scientist: 4

## Inception-of-Context

- status: validated
- done: false
- link:
- date:
- stack: Python, Ollama, ChromaDB, FastAPI
- summary: Fully local AI coding assistant that indexes a codebase into a vector store, answers grounded questions via RAG, and generates validated code patches with rollback.
- bullets:
  - Built an incremental code indexer with per-function/per-class logical chunking, local embeddings, persistent ChromaDB storage, and filesystem watch mode.
  - Exposed retrieval and RAG Q&A HTTP endpoints backed by a local LLM through Ollama, with BM25 re-ranking for identifier queries.
  - Implemented a generate-apply-validate patch loop emitting structured JSON patches with sanity checks, atomic writes, and full rollback on validation failure.
  - Delivered a dashboard tracking index state, retrieval results, and each patch attempt through generation, validation, and commit stages.
- scores:
  - ai-engineer: 7
  - ml-engineer: 6
  - ai-security: 8
  - data-engineer: 7
  - ai-db-architect: 9
  - cv-nlp: 5
  - research-scientist: 3

## Inception-of-Wisdom

- status: validated
- done: false
- link:
- date:
- stack: Python, Docker, Ollama, ChromaDB, FastAPI
- summary: Self-healing agent that observes a Dockerized service, diagnoses crashes with a local LLM over a code index, patches code, and verifies or rolls back the fix.
- bullets:
  - Built an Observer streaming container state, logs, and HTTP probe results with deduplicated crash and suggestion event detection over the Docker socket.
  - Implemented an Analyst maintaining an incremental ChromaDB index and producing structured LLM diagnoses that cite real indexed files.
  - Created a Wisdom Loop that applies sanity-checked patches, commits to Git, restarts the target, and verifies healing within configurable bounds.
  - Enforced safety controls: single-flight heals, per-signature cooldowns, rate limits, lifetime caps, a killswitch, and byte-exact Git rollback.
- scores:
  - ai-engineer: 7
  - ml-engineer: 8
  - ai-security: 8
  - data-engineer: 7
  - ai-db-architect: 9
  - cv-nlp: 8
  - research-scientist: 5

## RAG against the machine

- status: validated
- done: false
- link:
- date:
- stack: Python, pydantic, Python Fire, tqdm, Qwen3-0.6B
- summary: Retrieval-Augmented Generation pipeline that indexes the vLLM codebase, retrieves with TF-IDF/BM25, and generates grounded answers with a local LLM, scored by recall@k.
- bullets:
  - Built an indexer with distinct Python and Markdown chunking strategies, persisting a millisecond-queryable index in under 5 minutes.
  - Implemented lexical retrieval returning file-path and character-span sources, exceeding 80% recall@5 on docs and 50% on code.
  - Generated grounded answers with Qwen/Qwen3-0.6B validated through pydantic data models.
  - Delivered a robust CLI with dataset-batch search and answer commands, progress reporting, and graceful edge-case handling.
- scores:
  - ai-engineer: 7
  - ml-engineer: 6
  - ai-security: 8
  - data-engineer: 8
  - ai-db-architect: 9
  - cv-nlp: 6
  - research-scientist: 3

## Digital Twin IoT Platform

- status: validated
- done: false
- kind: experience
- link: https://um6p.ma/
- date: Jun 2024 – Nov 2026
- stack: MQTT, Kafka, Redis, Python, Digital Twins, Predictive Maintenance
- summary: Led architecture and delivery of a digital twin platform for IoT monitoring and predictive maintenance, ingesting industrial sensor data through MQTT with real-time analytics.
- bullets:
  - Led architecture and delivery of a digital twin platform for IoT monitoring and predictive maintenance, ingesting industrial equipment sensor data through MQTT with real-time analytics.
  - Built Kafka and Python microservices with Redis caching, keeping consumers and the whole system stateless.
  - Evaluated multiple SPOF on the platform to ensure the system remains resilient.
- scores:
  - ai-engineer: 3
  - ml-engineer: 6
  - ai-security: 4
  - data-engineer: 10
  - ai-db-architect: 10
  - cv-nlp: 6
  - research-scientist: 3

## Multi-Agent IoT Operations Assistant

- status: validated
- done: false
- kind: experience
- link: https://um6p.ma/
- date: 2024 – Present
- stack: Google ADK, MCP, LiteLLM, Ollama, Python
- summary: Built a multi-agent IoT operations assistant on Google ADK with specialist sub-agents, ~98 tools exposed via MCP, guardrails, and trajectory-based evaluation.
- bullets:
  - Built a multi-agent IoT operations assistant on Google ADK: specialist sub-agents (assets/devices finder, telemetry agent, PdM agent) in an agent-as-tool pattern.
  - ~98 tools exposed through MCP with guardrails against hallucination; LiteLLM as the proxy layer for reliable tool calls and streaming.
  - Local Ollama models for sensitive deployments; evaluated models and agent behavior with trajectory-based benchmarks.
- scores:
  - ai-engineer: 10
  - ml-engineer: 7
  - ai-security: 9
  - data-engineer: 6
  - ai-db-architect: 6
  - cv-nlp: 5
  - research-scientist: 4

## Ship Movement Platform

- status: validated
- done: false
- kind: experience
- link: https://um6p.ma/
- date: Dec 2023 – May 2024
- stack: Flask, MySQL, React.js, Leaflet.js
- summary: Platform tracking 200+ daily ship movements for fertilizer trade with real-time supply chain insights and interactive maps.
- bullets:
  - Developed a platform tracking 200+ daily ship movements for fertilizer trade, delivering real-time supply chain insights with interactive React.js and Leaflet.js maps.
  - Engineered a Flask REST API with MySQL, improving dashboard performance via query optimization and caching.
- scores:
  - ai-engineer: 3
  - ml-engineer: 6
  - ai-security: 1
  - data-engineer: 9
  - ai-db-architect: 5
  - cv-nlp: 6
  - research-scientist: 4

## Leaffliction

- status: validated
- done: false
- link:
- date:
- stack: Python, plantCV, image-processing libraries
- summary: Computer vision pipeline classifying plant leaf diseases: dataset analysis, data augmentation, image transformations, and a classifier reaching above 90% accuracy.
- bullets:
  - Built a distribution analyzer producing pie and bar charts per plant type and disease category.
  - Implemented six image augmentation techniques (flip, rotate, skew, shear, crop, distortion) to balance the dataset.
  - Applied six feature-extraction transformations including Gaussian blur, masks, pseudolandmarks, and color histograms.
  - Trained and validated a disease classifier reaching above 90% accuracy on 100+ validation images.
- scores:
  - ai-engineer: 3
  - ml-engineer: 6
  - ai-security: 5
  - data-engineer: 7
  - ai-db-architect: 4
  - cv-nlp: 7
  - research-scientist: 3

## Multilayer Perceptron

- status: validated
- done: true
- link: https://github.com/mylastresort/multilayer-perceptron
- date: Aug 2026
- stack: Rust, Neural Networks, Backpropagation, SGD, Adam
- summary: Configurable MLP with backpropagation from scratch in Rust, YAML-driven training, SGD and Adam optimizers, early stopping, learning-curve exports.
- bullets:
  - Built a configurable MLP with backpropagation from scratch in Rust, driven by YAML training configs.
  - Implemented SGD and Adam optimizers, early stopping, and per-epoch metrics with learning-curve exports.
- scores:
  - ai-engineer: 5
  - ml-engineer: 10
  - ai-security: 5
  - data-engineer: 5
  - ai-db-architect: 4
  - cv-nlp: 10
  - research-scientist: 10

## Job Control System

- status: validated
- done: true
- link: https://github.com/mylastresort/taskmaster
- date: Sep 2026
- stack: Go, Job Orchestration, Docker Compose, TOML
- summary: Supervisor-style job control daemon managing child processes from a config file, with restart policies, hot-reload, and an interactive control shell.
- bullets:
  - Implemented process supervision starting jobs as child processes, tracking alive/dead state, and restarting per configurable policies (always, never, unexpected exits only).
  - Built hot-reloading configuration via SIGHUP applying program changes without disturbing unaffected processes.
  - Extended the Go client/server core with an internal queue handling 1,000+ async tasks/min, dead-letter queues, and automatic retries, shipped via Docker Compose with CI tests.
- scores:
  - ai-engineer: 5
  - ml-engineer: 7
  - ai-security: 5
  - data-engineer: 6
  - ai-db-architect: 1
  - cv-nlp: 5
  - research-scientist: 4

## Learn2Slither

- status: validated
- done: false
- link:
- date:
- stack: Python, Q-learning, GUI/display library
- summary: Reinforcement learning agent controlling a snake on a 10x10 board, trained via Q-learning across sessions and exported as reusable models.
- bullets:
  - Implemented a Q-learning agent (Q-table or neural network) that learns from reward-based feedback on a graphical Snake board.
  - Designed a limited snake vision state and reward system balancing exploration versus exploitation.
  - Trained, exported, and reloaded models across sessions with a non-learning evaluation mode, reaching length 10+ snakes with long lifetimes.
- scores:
  - ai-engineer: 3
  - ml-engineer: 5
  - ai-security: 1
  - data-engineer: 5
  - ai-db-architect: 1
  - cv-nlp: 4
  - research-scientist: 4

## Total Perspective Vortex

- status: validated
- done: true
- link:
- date:
- stack: Python, MNE, scikit-learn, NumPy, SciPy
- summary: Brain-computer interface preprocessing EEG motor-imagery data and classifying motion types in near real time with a custom dimensionality-reduction pipeline.
- bullets:
  - Parsed and visualized PhysioNet EEG data with MNE, filtering raw signals and extracting per-channel frequency power features.
  - Implemented a CSP-style dimensionality reduction algorithm integrated as a scikit-learn transformer via BaseEstimator and TransformerMixin.
  - Built a train/predict pipeline with cross-validation achieving over 60% mean accuracy on unseen subjects.
  - Delivered real-time streaming prediction on playback EEG chunks within a 2-second latency constraint.
- scores:
  - ai-engineer: 4
  - ml-engineer: 6
  - ai-security: 5
  - data-engineer: 7
  - ai-db-architect: 1
  - cv-nlp: 7
  - research-scientist: 4

## Ftl quantum

- status: validated
- done: false
- link:
- date:
- stack: Python, Qiskit, IBM Quantum
- summary: Quantum computing project building circuits with Qiskit, culminating in a Grover-style quantum search algorithm executed on real IBM quantum hardware.
- bullets:
  - Implemented quantum circuits demonstrating superposition and entanglement, validated through 500-shot simulation histograms.
  - Executed identical circuits on a real IBM quantum computer and analyzed noise-induced differences from simulation.
  - Built the Deutsch-Jozsa algorithm on 4 qubits to classify constant versus balanced oracles.
  - Implemented a Grover-style quantum search scaling to arbitrary qubit counts with O(√N) complexity.
- scores:
  - ai-engineer: 4
  - ml-engineer: 5
  - ai-security: 4
  - data-engineer: 4
  - ai-db-architect: 1
  - cv-nlp: 1
  - research-scientist: 3

## Supercharge

- status: validated
- done: false
- link:
- date:
- stack: Python, FastAPI, Qiskit Aer, Leaflet.js, React, Docker Compose
- summary: Dockerized web app placing EV charging stations on a real map, comparing a classical brute-force maximum-coverage solver against a self-implemented QAOA quantum solver.
- bullets:
  - Built a classical brute-force exact solver for the NP-hard maximum-coverage problem under budget constraints as ground truth.
  - Formulated the placement problem as a QUBO with penalty-encoded constraints and implemented a QAOA circuit with a classical-quantum optimization loop in local simulation.
  - Delivered a map-based web interface with configurable budget and zone weights, side-by-side solver comparison, and log-scale complexity curves.
  - Packaged the full application with docker-compose for one-command startup, including graceful QAOA degradation past simulator ceilings.
- scores:
  - ai-engineer: 5
  - ml-engineer: 7
  - ai-security: 5
  - data-engineer: 6
  - ai-db-architect: 6
  - cv-nlp: 4
  - research-scientist: 4

## ft kalman

- status: validated
- done: false
- link:
- date:
- stack: C, C++17, Rust, UDP
- summary: Kalman filter tracking a vehicle's 3D trajectory from noisy accelerometer, gyroscope, and GPS measurements streamed over UDP under accuracy and latency limits.
- bullets:
  - Implemented a Kalman filter without ML or filtering libraries, fusing biased Gaussian-noise inertial and GPS readings with covariance matrices and Euler-angle rotation handling.
  - Built a real-time UDP client exchanging sensor data and position estimates under a 1-second response and 5-meter accuracy constraint.
  - Optimized the filter to run continuously over trajectories up to 90 minutes without timeouts or crashes.
- scores:
  - ai-engineer: 1
  - ml-engineer: 4
  - ai-security: 0
  - data-engineer: 5
  - ai-db-architect: 1
  - cv-nlp: 4
  - research-scientist: 3

## Hypertube Video Streaming Platform

- status: validated
- done: true
- link: https://github.com/mylastresort/hypertube
- date: Dec 2025
- stack: Go, Next.js, PostgreSQL, Node.js, OAuth2, HLS
- summary: Scalable Go backend with HLS streaming, PostgreSQL schema with query optimization and connection pooling, Agile delivery with 3 developers.
- bullets:
  - Built a scalable Go backend with HLS streaming and optimized cache management for efficient video delivery.
  - Designed a PostgreSQL schema with query optimization and connection pooling for improved data retrieval performance.
  - Drove Agile delivery with 3 developers through sprint planning and daily stand-ups.
- scores:
  - ai-engineer: 4
  - ml-engineer: 7
  - ai-security: 3
  - data-engineer: 7
  - ai-db-architect: 6
  - cv-nlp: 4
  - research-scientist: 3

## Expert System

- status: validated
- done: false
- link:
- date:
- stack: Propositional calculus, backward chaining, graph of fact and rule nodes
- summary: Backward-chaining inference engine evaluating propositional calculus rules from a text file to determine whether queried facts are true, false, or undetermined.
- bullets:
  - Implemented a backward-chaining engine resolving queries against rules supporting AND, OR, XOR, negation, multi-conclusion rules, and parenthesized expressions.
  - Parsed a custom input format of rules, initial facts, and queries with syntax error and contradiction detection.
  - Designed a graph-of-fact-and-rule-nodes data structure chosen for performance and justified during defense.
- scores:
  - ai-engineer: 4
  - ml-engineer: 5
  - ai-security: 6
  - data-engineer: 5
  - ai-db-architect: 9
  - cv-nlp: 6
  - research-scientist: 4

## Music Room

- status: validated
- done: false
- link:
- date:
- stack: Mobile, REST/JSON API, OAuth, Docker
- summary: Mobile-first collaborative music platform with a server and REST API supporting track voting, control delegation, and real-time multi-user playlist editing.
- bullets:
  - Built a back-end reference server with a documented REST/JSON API and social-network authentication.
  - Implemented live music track voting with public/private visibility and license-based access rules.
  - Delivered real-time multi-user playlist editing handling concurrency and competition conflicts.
  - Hardened the API with anti-bruteforce and session protection, benchmarking simultaneous user capacity.
- scores:
  - ai-engineer: 1
  - ml-engineer: 4
  - ai-security: 1
  - data-engineer: 3
  - ai-db-architect: 1
  - cv-nlp: 1
  - research-scientist: 1

## Gomoku

- status: validated
- done: true
- link:
- date:
- stack: Minimax, game-tree search, GUI
- summary: AI opponent for Gomoku on a 19x19 board with capture and double-three rules, using Minimax with a custom heuristic and a graphical interface.
- bullets:
  - Implemented a Minimax-based AI searching at least 10 levels deep that beats human players within a half-second average move time.
  - Designed and tuned a custom heuristic evaluation function for terminal nodes in the game tree.
  - Enforced full game rules including stone captures, endgame capture win conditions, and free-three/double-three move restrictions.
- scores:
  - ai-engineer: 3
  - ml-engineer: 3
  - ai-security: 4
  - data-engineer: 4
  - ai-db-architect: 1
  - cv-nlp: 4
  - research-scientist: 3

## ft kleene

- status: validated
- done: false
- link:
- date:
- stack: Automata theory, regex-to-DFA pipeline, pushdown automata
- summary: Language-theory project building string algorithms up the Chomsky hierarchy: Kleene star generation, Levenshtein distance, and finite/pushdown/linear-bounded automata.
- bullets:
  - Implemented Kleene star generation and acceptance, power concatenation, and Levenshtein distance within mandated complexity bounds.
  - Built a non-deterministic finite automaton from regex expressions, converted it to a DFA, minimized it, and matched strings through the full pipeline.
  - Wrote pushdown-automaton palindrome acceptance and a linear-bounded automaton for context-sensitive languages.
- scores:
  - ai-engineer: 3
  - ml-engineer: 4
  - ai-security: 4
  - data-engineer: 6
  - ai-db-architect: 1
  - cv-nlp: 4
  - research-scientist: 2

## Ready Set Boole

- status: validated
- done: false
- link:
- date:
- stack: Boolean algebra, SAT solving, bitwise operators
- summary: Boolean algebra and set theory toolkit implementing bitwise arithmetic, propositional formula evaluation, normal forms, SAT solving, and space-filling curve mappings.
- bullets:
  - Implemented bitwise adder and multiplier with O(log n)/O(1) complexity using only AND, OR, XOR, and shift operators, plus Gray code conversion.
  - Built a reverse polish notation propositional logic engine evaluating formulas, printing truth tables, and converting to Negation and Conjunctive Normal Forms.
  - Developed a SAT checker over propositional formulas and set-theory operations including powerset generation.
- scores:
  - ai-engineer: 3
  - ml-engineer: 5
  - ai-security: 1
  - data-engineer: 5
  - ai-db-architect: 1
  - cv-nlp: 4
  - research-scientist: 3

## Enter the Matrix

- status: validated
- done: true
- link:
- date:
- stack: Rust, generics, linear algebra from scratch
- summary: Generic linear algebra library built from scratch: vector and matrix arithmetic, dot/cross products, norms, determinant, rank, and inversion.
- bullets:
  - Implemented vector and matrix addition, subtraction, scaling, linear combinations, and linear interpolation with O(n) complexity.
  - Built dot product, norms, angle cosine, and cross product without any math library.
  - Implemented matrix multiplication, trace, transpose, row-echelon form, determinant, inverse, and rank, generically over a scalar field type.
- scores:
  - ai-engineer: 3
  - ml-engineer: 5
  - ai-security: 1
  - data-engineer: 1
  - ai-db-architect: 1
  - cv-nlp: 6
  - research-scientist: 5

## krpsim

- status: validated
- done: false
- link:
- date:
- stack: Optimization, scheduling, verifier
- summary: Optimizer reading process and stock configuration files, scheduling a process chain to minimize time or maximize target stocks, plus a schedule verifier.
- bullets:
  - Built a simulator parsing stock and process definitions and scheduling process chains under a hard runtime budget.
  - Optimized process graphs to minimize completion time or maximize target stocks, including self-sustaining loops.
  - Implemented a verifier replaying schedules and detecting invalid cycles and stock accounting errors.
- scores:
  - ai-engineer: 1
  - ml-engineer: 5
  - ai-security: 1
  - data-engineer: 4
  - ai-db-architect: 1
  - cv-nlp: 5
  - research-scientist: 3

## Amazon Co-purchase

- status: validated
- done: false
- link:
- date:
- stack: Python, Apache Spark (PySpark), GraphFrames
- summary: Spark/GraphFrames pipeline that builds and analyzes the Amazon co-purchase graph and generates 5 recommendations per item.
- bullets:
  - Parsed the raw item dataset into Spark DataFrames and built a GraphFrames co-purchase graph of Amazon goods.
  - Computed graph metrics: triangle counts, PageRank, in/out-degree maxima, and reciprocity fraction to 7 decimals.
  - Detected recommendation bundles and reciprocal-path collections, including the largest strongly connected component.
  - Implemented 3 graph-based ideas generating 5-item recommendations for every item with a real-world testing methodology.
- scores:
  - ai-engineer: 4
  - ml-engineer: 7
  - ai-security: 5
  - data-engineer: 8
  - ai-db-architect: 5
  - cv-nlp: 6
  - research-scientist: 4

## Churn Prediction

- status: validated
- done: true
- link:
- date:
- stack: Python, NumPy, pandas, scikit-learn, TensorFlow, Keras
- summary: Bank customer churn classifier built as a fully-connected neural network across scikit-learn, Keras, and raw TensorFlow, plus a NumPy implementation from scratch.
- bullets:
  - Established naive-classifier and random-forest baselines with grid-searched hyperparameters and stratified train/test splitting.
  - Solved churn with MLPClassifier (scikit-learn), Keras, and raw TensorFlow, using dropout for regularization.
  - Reimplemented the best architecture from scratch in NumPy with matrix-based forward and backward propagation.
  - Preprocessed anomalies, missing values, and engineered features, reaching AUC ≥ 0.8183 with a results comparison table.
- scores:
  - ai-engineer: 4
  - ml-engineer: 9
  - ai-security: 5
  - data-engineer: 6
  - ai-db-architect: 5
  - cv-nlp: 7
  - research-scientist: 5

## Myspotify

- status: validated
- done: true
- link:
- date:
- stack: Python, pandas, NumPy, scikit-learn, gensim (word2vec)
- summary: Music recommender system on Million Songs Dataset data spanning non-personalized, content-based, and collaborative filtering approaches.
- bullets:
  - Built non-personalized top-250 overall and top-100-per-genre track charts from play-count data.
  - Created 50-track themed collections using keyword matching, word2vec similarity, and classification.
  - Delivered user-to-user and item-to-item collaborative filtering with train/test splits evaluated by precision@k.
  - Organized all five recommenders into classes and a script producing artist and title recommendation dataframes.
- scores:
  - ai-engineer: 4
  - ml-engineer: 7
  - ai-security: 4
  - data-engineer: 6
  - ai-db-architect: 4
  - cv-nlp: 3
  - research-scientist: 3

## Tweets Sentiment Analysis

- status: validated
- done: true
- link:
- date:
- stack: Python, NLTK, scikit-learn, pandas, NumPy
- summary: Tweet sentiment classifier (positive/negative/neutral) comparing text vectorizations and ML algorithms to beat 0.832 accuracy.
- bullets:
  - Vectorized tweets via bag-of-words and TFIDF with stemming, lemmatization, stop-word removal, and n-grams.
  - Found the top-10 most similar tweet pairs per preprocessing variant using cosine similarity.
  - Trained and compared multiple classifiers across differently preprocessed datasets with stratified splits.
  - Achieved accuracy ≥ 0.832 on the test set, with word2vec embeddings explored in the bonus.
- scores:
  - ai-engineer: 3
  - ml-engineer: 5
  - ai-security: 4
  - data-engineer: 6
  - ai-db-architect: 5
  - cv-nlp: 5
  - research-scientist: 3

## Uber Taxi Demand Forecast

- status: validated
- done: false
- link:
- date:
- stack: Python, pandas, statsmodels, scikit-learn
- summary: Taxi demand forecaster predicting the next 7 days in 15-minute intervals across 77 city areas, averaging MAE ≤ 10.
- bullets:
  - Forecasted per-area demand for 673 intervals using naive and moving averages validated by MAE.
  - Fitted single, double, and triple (Holt-Winters) exponential smoothing with optimized weights.
  - Selected the best SARIMA model per area by AIC for seasonal autoregressive forecasting.
  - Kept a research diary of approaches and metrics, submitting the best pipeline.
- scores:
  - ai-engineer: 3
  - ml-engineer: 4
  - ai-security: 1
  - data-engineer: 4
  - ai-db-architect: 1
  - cv-nlp: 3
  - research-scientist: 3

## Understanding Customer

- status: validated
- done: false
- link:
- date:
- stack: Python, PyTorch, transformers (BERT), pickle
- summary: Bike-shop chatbot intent classifier built with RNN, LSTM, and BERT architectures, with a fallback intent for out-of-scope phrases.
- bullets:
  - Trained RNN, LSTM, and BERT (Transformer) architectures on labeled intent phrases for a chatbot.
  - Handled unseen phrases with a Fallback Intent mechanism for out-of-scope predictions.
  - Kept a research diary tracking architectures, layers, weights, and train/validation metrics.
  - Serialized the final pickled model achieving ≥ 0.8 test accuracy, reproducible by peers.
- scores:
  - ai-engineer: 6
  - ml-engineer: 6
  - ai-security: 6
  - data-engineer: 6
  - ai-db-architect: 6
  - cv-nlp: 7
  - research-scientist: 5
