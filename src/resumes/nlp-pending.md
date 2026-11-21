# Pending projects — NLP Specialist

Highest-scoring *not-done* projects for this role (resume: `nlp.pdf`).
Completing one and marking it `done: true` in `src/data/projects.md` makes it eligible
for injection into the resume (needs role score >= 7).

## Understanding Customer — 9/10

- Bike-shop chatbot intent classifier built with RNN, LSTM, and BERT architectures, with a fallback intent for out-of-scope phrases.
- Stack: Python, PyTorch, transformers (BERT), pickle

## RAG against the machine — 7/10

- Retrieval-Augmented Generation pipeline that indexes the vLLM codebase, retrieves with TF-IDF/BM25, and generates grounded answers with a local LLM, scored by recall@k.
- Stack: Python, pydantic, Python Fire, tqdm, Qwen3-0.6B

## Inception-of-Context — 6/10

- Fully local AI coding assistant that indexes a codebase into a vector store, answers grounded questions via RAG, and generates validated code patches with rollback.
- Stack: Python, Ollama, ChromaDB, FastAPI

