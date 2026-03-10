# DevAgent SDK

Canonical protocol packages shared by `devagent-hub`, `devagent-runner`, `devagent`, and future executor adapters.

## Packages

- `@devagent-sdk/types`
  Exports the public protocol types for requests, events, results, artifacts, and approvals.
- `@devagent-sdk/schema`
  Exports JSON Schema objects for the protocol entities.
- `@devagent-sdk/validation`
  Exports runtime validators backed by the SDK schemas.
- `@devagent-sdk/changelog`
  Tracks protocol versions and summary notes.

## Protocol

All protocol payloads use `protocolVersion: "0.1"`.

Primary entities:

- `TaskExecutionRequest`
- `TaskExecutionEvent`
- `TaskExecutionResult`
- `ApprovalRequest`
- `ApprovalDecision`

Supporting entities:

- `ProjectRef`
- `WorkItemRef`
- `WorkspaceSpec`
- `ExecutorSpec`
- `TaskConstraints`
- `ArtifactKind`
- `ArtifactRef`

## Validation

```ts
import { validateTaskExecutionRequest } from "@devagent-sdk/validation";

const request = validateTaskExecutionRequest(payload);
```

Example with the shared golden request fixture:

```bash
cat fixtures/request-golden.json
```

## Fixtures

`fixtures/` contains request fixtures for every workflow task type plus event, result, approval, and a shared golden request payload for downstream tests.

## Local Development Wiring

During local MVP development the downstream repos consume these packages through file dependencies:

- `../devagent-runner`
- `../devagent`
- `../devagent-hub`

That keeps the protocol cutover synchronized across all four repos without publishing interim packages.

For the supported local install path, use the bootstrap flow documented in
[`../devagent-hub/README.md`](../devagent-hub/README.md) and
[`../devagent-hub/BASELINE_VALIDATION.md`](../devagent-hub/BASELINE_VALIDATION.md).

## Validated Flow

The current validated loop is:

```text
Hub -> SDK request -> Runner -> DevAgent execute -> SDK events/results/artifacts -> Hub
```

Hub, Runner, and DevAgent all validate the shared `fixtures/request-golden.json` payload during test runs.

## Development

```bash
bun install
bun run typecheck
bun run test
```
