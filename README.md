# DevAgent SDK

Canonical protocol packages shared by `devagent-hub`, `devagent-runner`, `devagent`, and future executor adapters.

## Maturity

Public alpha component. The repo is public, but the workspace packages remain unpublished and are
currently consumed through the four-repo sibling bootstrap flow.

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

- `WorkspaceRef`
- `RepositoryRef`
- `WorkItemRef`
- `ReviewableRef`
- `WorkspaceSpec`
- `ExecutorSpec`
- `TaskConstraints`
- `CapabilitySet`
- `ArtifactKind`
- `ArtifactRef`

`TaskExecutionRequest` now models workspace-aware execution explicitly:

- `workspaceRef` identifies the workspace and its primary repository.
- `repositories` describes the repositories available to the task.
- `execution` describes per-repository checkout/isolation details for the run.
- `targetRepositoryIds` marks the repositories a writable stage is allowed to change.
- `reviewable` carries imported PR context for review flows when present.
- `capabilities` advertises the platform actions available to the executor.

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

`fixtures/` contains request fixtures for every workflow task type plus event, result, approval, local-task, imported-review, and a shared golden multi-repository request payload for downstream tests.

## Local Development Wiring

During local MVP development the downstream repos consume these packages through file dependencies:

- `../devagent-runner`
- `../devagent`
- `../devagent-hub`

That keeps the protocol cutover synchronized across all four repos without publishing interim packages.

For the supported local install path, use the bootstrap flow documented in
[`../devagent-hub/README.md`](../devagent-hub/README.md) and
[`../devagent-hub/BASELINE_VALIDATION.md`](../devagent-hub/BASELINE_VALIDATION.md).

## Limitations

- The packages are not published to a package registry yet.
- The supported contributor setup is the four-repo sibling checkout flow.
- The validated production path today is the DevAgent executor path, not a multi-executor parity story.

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
bun run check:oss
```
