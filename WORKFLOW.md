# DevAgent SDK Workflow

## How work enters this repo

Most changes begin as one of:

- protocol additions for the validated Hub -> Runner -> DevAgent path
- schema/validator fixes
- fixture or compatibility test improvements

## Expected implementation path

1. Change types first.
2. Update JSON Schema exports.
3. Update validators.
4. Update fixtures, especially the golden request when needed.
5. Run downstream compatibility checks before merge.

## Required checks before merge

```bash
bun install
bun run typecheck
bun run test
bun run check:oss
```

## Done means

- protocol docs match the shipped types
- schemas and validators agree
- fixture coverage is current
- no drift is introduced into Runner, DevAgent, or Hub

## Supported vs experimental

- Supported: protocol work required by the current DevAgent-only production path
- Experimental: future protocol surfaces that are not yet exercised by the validated stack
