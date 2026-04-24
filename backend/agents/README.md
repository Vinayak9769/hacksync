# Use Case Verifier Agents

These standalone agents verify whether a provided use case has evidence across a curated list of trusted domains by using Google Custom Search.

## Requirements

- Node.js with `fetch` available
- Google Custom Search API credentials

Set environment variables:

- `GOOGLE_API_KEY`
- `GOOGLE_CX`

## Run

```bash
node dist/agents/useCaseVerifierAgent.js "your use case here"
```

```bash
node dist/agents/useCaseVerifierAgentLanggraph.js "your use case here"
```

## Build

```bash
npm run build
```

## Output

Returns JSON with verification status, confidence, and evidence per domain.
