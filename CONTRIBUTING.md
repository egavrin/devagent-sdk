# Contributing to DevAgent SDK

## Who this repo is for

Contributors working on shared protocol types, JSON Schema, validators, and cross-repo fixtures for
the DevAgent stack.

## Prerequisites

- Bun `1.3.10+`
- Node `20+`
- the four sibling repos checked out side by side:
  - `devagent-sdk`
  - `devagent-runner`
  - `devagent`
  - `devagent-hub`

For the supported multi-repo setup path, start from
[`devagent-hub`](../devagent-hub/README.md) and run:

```bash
cd ../devagent-hub
bun install
bun run bootstrap:local
```

## Local checks before opening a PR

```bash
bun install
bun run typecheck
bun run test
bun run check:oss
```

If your protocol change affects downstream behavior, also run the Hub baseline checks from
`../devagent-hub`.

## Contribution rules

- Keep protocol changes additive unless a coordinated version bump is planned.
- Update fixtures, schemas, validators, and docs together.
- Do not add private duplicate protocol definitions to downstream repos.
- Keep PRs small and protocol-focused.
- If docs change behavior claims, update tests or validation evidence in the same PR.
