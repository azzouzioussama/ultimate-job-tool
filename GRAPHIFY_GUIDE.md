# Graphify Knowledge Graph Guide

This guide explains how to use the Graphify knowledge graph tool integrated into this project. Graphify transforms your codebase, documentation, and assets into a queryable semantic knowledge graph. This prevents AI coding assistants from blindly searching (grepping) the code and significantly reduces LLM token limits by providing instant context.

## 1. What is Graphify?
Graphify uses local parsing (`tree-sitter`) combined with an LLM backend to extract the architecture, call flows, and structural relationships of your project into a highly compressed graph map (`graph.json`).

## 2. Basic Installation & Setup (One-Time)
If you ever need to set this up on a new machine:

1. **Install Dependencies**:
   ```bash
   pip install graphifyy
   pip install openai  # Required for most LLM semantic extraction backends
   ```
2. **Register the AI Agent Skill**:
   ```bash
   graphify antigravity install
   ```
   *(This creates the local `.agents/rules` and allows Antigravity/Claude/etc. to read the graph).*

3. **Install Automation Hooks**:
   ```bash
   graphify hook install
   ```
   *(This sets up Git hooks so the graph updates automatically in the background whenever you commit or checkout branches).*

## 3. How to Query the Graph (As a Developer)

### Using the AI Assistant (Easiest)
You can directly ask your AI assistant (e.g., Antigravity) to query the graph for you:
> *"Query graphify to trace the exact call flow of how a PDF is generated."*
> *"What files will be affected if I change `storageService.js` according to the graph?"*

### Using the Terminal
You can also run commands yourself directly in the terminal:

* **Generate a UI Map**:
  ```bash
  graphify tree
  ```
  *(Creates an interactive HTML file at `graphify-out/GRAPH_TREE.html` that you can open in your browser to explore the architecture).*

* **Query the Graph manually**:
  ```bash
  graphify query "How does the Dexie database synchronize with App.jsx?"
  ```

* **Impact Analysis**:
  ```bash
  graphify affected "storageService"
  ```

## 4. How to Update the Graph
By default, the Git hooks will keep the graph updated automatically. However, if you make massive changes or delete lots of files and want to manually update it:
```bash
graphify update .
```
> **Tip:** The `update` command uses caching. It only re-extracts files that have actually changed since the last run!

## 5. 💡 PRO TIP: Changing the LLM Backend for Semantic Extraction
When generating the semantic meanings of files, Graphify needs an LLM. By default, it detects your environment variables (like `GEMINI_API_KEY`).

If you want to use a different provider (or a local offline LLM like Ollama) to save money or protect privacy, you can force Graphify to use a specific backend during extraction using the `--backend` flag.

```bash
# Example: Using Anthropic (Claude)
export ANTHROPIC_API_KEY="your-key-here"
graphify extract . --backend claude

# Example: Using OpenAI
export OPENAI_API_KEY="your-key-here"
graphify extract . --backend openai

# Example: Using DeepSeek
export DEEPSEEK_API_KEY="your-key-here"
graphify extract . --backend deepseek

# Example: Using a local, offline LLM (e.g., Ollama - completely free & private!)
graphify extract . --backend ollama
```

### Supported Backends:
* `gemini` (Requires `GEMINI_API_KEY` or `GOOGLE_API_KEY`)
* `claude` (Requires `ANTHROPIC_API_KEY`)
* `openai` (Requires `OPENAI_API_KEY`)
* `deepseek` (Requires `DEEPSEEK_API_KEY`)
* `kimi` (Requires `MOONSHOT_API_KEY`)
* `ollama` (Requires local Ollama server running)

---
*Generated: May 2026*
