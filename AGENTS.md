# DevAgent SDK Agent Guide

## Purpose

`devagent-sdk` is the protocol source of truth for the DevAgent stack. Keep requests, events,
results, artifacts, approvals, schemas, and validators aligned here first.

## Rules

1. Do not introduce private duplicate protocol types in downstream repos.
2. Keep protocol changes additive within `0.1.x` unless a coordinated version bump is planned.
3. Update fixtures, schemas, validators, and tests together.
4. Treat `fixtures/request-golden.json` as the cross-repo contract sample.
5. Run `bun run typecheck`, `bun run test`, and `bun run check:oss` before finishing.

## Review focus

- protocol compatibility
- schema tightness
- validator behavior
- fixture coverage
- downstream drift risk
