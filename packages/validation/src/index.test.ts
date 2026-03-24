import { expect, test } from "vitest";
import {
  validateApprovalDecision,
  validateApprovalRequest,
  validateBreakdownDoc,
  validateIssueSpecDoc,
  validateTaskExecutionEvent,
  validateTaskExecutionRequest,
  validateTaskExecutionResult,
} from "./index.js";
import type {
  ApprovalDecision,
  ApprovalRequest,
  TaskExecutionEvent,
  TaskExecutionResult,
} from "@devagent-sdk/types";
import triageRequest from "../../../fixtures/request-triage.json" with { type: "json" };
import planRequest from "../../../fixtures/request-plan.json" with { type: "json" };
import implementRequest from "../../../fixtures/request-implement.json" with { type: "json" };
import verifyRequest from "../../../fixtures/request-verify.json" with { type: "json" };
import reviewRequest from "../../../fixtures/request-review.json" with { type: "json" };
import repairRequest from "../../../fixtures/request-repair.json" with { type: "json" };
import goldenRequest from "../../../fixtures/request-golden.json" with { type: "json" };
import localTaskRequest from "../../../fixtures/request-local-task.json" with { type: "json" };
import importedReviewRequest from "../../../fixtures/request-review-imported.json" with { type: "json" };
import taskEvent from "../../../fixtures/event-progress.json" with { type: "json" };
import taskResult from "../../../fixtures/result-success.json" with { type: "json" };
import approvalRequest from "../../../fixtures/approval-request.json" with { type: "json" };
import approvalDecision from "../../../fixtures/approval-decision.json" with { type: "json" };

test("validates all request fixtures", () => {
  expect(validateTaskExecutionRequest(triageRequest).taskType).toBe("triage");
  expect(validateTaskExecutionRequest(planRequest).taskType).toBe("plan");
  expect(validateTaskExecutionRequest(implementRequest).taskType).toBe("implement");
  expect(validateTaskExecutionRequest(verifyRequest).taskType).toBe("verify");
  expect(validateTaskExecutionRequest(reviewRequest).taskType).toBe("review");
  expect(validateTaskExecutionRequest(repairRequest).taskType).toBe("repair");
  expect(validateTaskExecutionRequest(localTaskRequest).workItem.kind).toBe("local-task");
  expect(validateTaskExecutionRequest(importedReviewRequest).reviewable?.type).toBe("github-pr");
});

test("validates event result and approval fixtures", () => {
  expect(validateTaskExecutionEvent(taskEvent).type).toBe("progress");
  expect(validateTaskExecutionResult(taskResult).status).toBe("success");
  expect(validateApprovalRequest(approvalRequest).stage).toBe("plan");
  expect(validateApprovalDecision(approvalDecision).decision).toBe("approved");
});

test("validates the shared golden request fixture", () => {
  const validated = validateTaskExecutionRequest(goldenRequest);
  expect(validated.taskType).toBe("design");
  expect(validated.targetRepositoryIds).toHaveLength(2);
  expect(validated.issueUnit?.title).toContain("workflow state");
  expect(validated.contextBundle?.artifactVersionIds).toHaveLength(2);
});

test("rejects invalid protocol version", () => {
  expect(() =>
    validateTaskExecutionRequest({
      ...triageRequest,
      protocolVersion: "0.2",
    }),
  ).toThrow("Invalid TaskExecutionRequest");
});

test("round-trips request serialization", () => {
  const serialized = JSON.stringify(planRequest);
  const parsed = JSON.parse(serialized);
  expect(validateTaskExecutionRequest(parsed)).toEqual(parsed);
});

test("round-trips result, event, and approval payloads", () => {
  expect(validateTaskExecutionResult(JSON.parse(JSON.stringify(taskResult)))).toEqual(taskResult as TaskExecutionResult);
  expect(validateTaskExecutionEvent(JSON.parse(JSON.stringify(taskEvent)))).toEqual(taskEvent as TaskExecutionEvent);
  expect(validateApprovalRequest(JSON.parse(JSON.stringify(approvalRequest)))).toEqual(approvalRequest as ApprovalRequest);
  expect(validateApprovalDecision(JSON.parse(JSON.stringify(approvalDecision)))).toEqual(approvalDecision as ApprovalDecision);
});

test("accepts additive fields within protocol 0.1", () => {
  const request = validateTaskExecutionRequest(goldenRequest);
  const additiveRequest = {
    ...request,
    continuation: {
      mode: "resume",
      reason: "retry_no_progress",
      instructions: "Continue from the previous session and make the code change.",
      session: {
        kind: "devagent-headless-v1",
        payload: {
          messages: [],
        },
      },
    },
    contextBundle: {
      id: "bundle-1",
      artifactVersionIds: ["artifact-1"],
      summary: "Approved upstream artifacts.",
    },
    context: {
      ...request.context,
      extraInstructions: [...(request.context.extraInstructions ?? []), "Preserve branch reuse."],
    },
  };
  expect(validateTaskExecutionRequest(additiveRequest).context.extraInstructions).toContain("Preserve branch reuse.");
  expect(validateTaskExecutionRequest(additiveRequest).continuation?.mode).toBe("resume");
  expect(validateTaskExecutionRequest(additiveRequest).contextBundle?.id).toBe("bundle-1");

  const additiveResult = {
    ...taskResult,
    session: {
      kind: "devagent-headless-v1",
      payload: {
        messages: [],
      },
    },
    outcome: "no_progress",
    outcomeReason: "iteration_limit",
    error: {
      code: "NONE",
      message: "No failure",
    },
  };
  expect(validateTaskExecutionResult(additiveResult).error?.code).toBe("NONE");
  expect(validateTaskExecutionResult(additiveResult).outcomeReason).toBe("iteration_limit");
  expect(validateTaskExecutionResult(additiveResult).artifacts[0]?.variant).toBe("structured");

  const additiveApproval = {
    ...approvalDecision,
    note: "Approved during compatibility test",
  };
  expect(validateApprovalDecision(additiveApproval).note).toContain("compatibility");
});

test("validates new stage and artifact enums", () => {
  expect(validateTaskExecutionRequest({
    ...triageRequest,
    taskType: "task-intake",
    expectedArtifacts: ["task-spec", "decision-log"],
  }).taskType).toBe("task-intake");

  expect(validateTaskExecutionRequest({
    ...triageRequest,
    taskType: "test-plan",
    expectedArtifacts: ["test-plan"],
  }).expectedArtifacts[0]).toBe("test-plan");

  expect(validateTaskExecutionResult({
    ...taskResult,
    artifacts: [
      {
        kind: "workflow-summary",
        path: "/tmp/artifacts/task-plan-1/workflow-summary.md",
        variant: "rendered",
        mimeType: "text/markdown",
        createdAt: "2026-03-10T08:05:00.000Z",
      },
    ],
  }).artifacts[0]?.kind).toBe("workflow-summary");
});

test("validates strict breakdown and issue spec documents", () => {
  const breakdown = validateBreakdownDoc({
    summary: "Ordered delivery breakdown",
    executionOrder: ["B1", "B2"],
    tasks: [
      {
        id: "B1",
        title: "Add input normalization",
        checklistLabel: "B1. Add input normalization in src/cli.ts",
        objective: "Normalize CLI input before formatting output.",
        rationale: "Blank names currently slip through.",
        grounding: {
          designRefs: ["DesignDoc#InputValidation"],
          repoPaths: ["src/cli.ts", "src/cli.test.ts"],
          codeSymbols: ["parseName"],
        },
        dependencies: [],
        acceptanceCriteria: ["Blank names are rejected."],
        expectedChanges: ["Update input parsing.", "Add tests for blank names."],
        validation: ["bun test"],
        riskNotes: [],
        sizeBudget: {
          maxEstimatedChangedLines: 120,
          estimateReason: "One parser function and one test file change.",
        },
      },
      {
        id: "B2",
        title: "Add JSON output mode",
        checklistLabel: "B2. Add JSON output mode in src/render.ts",
        objective: "Expose JSON output for greeting responses.",
        rationale: "Acceptance criteria require machine-readable output.",
        grounding: {
          designRefs: ["DesignDoc#OutputContract"],
          repoPaths: ["src/render.ts", "README.md"],
          codeSymbols: ["renderGreeting"],
        },
        dependencies: ["B1"],
        acceptanceCriteria: ["JSON output includes template and message fields."],
        expectedChanges: ["Add renderer branch.", "Document --json mode."],
        validation: ["bun test", "bun run build"],
        riskNotes: ["Keep existing text output stable."],
        sizeBudget: {
          maxEstimatedChangedLines: 180,
          estimateReason: "Renderer, tests, and docs stay within a small slice.",
        },
      },
    ],
  });
  expect(breakdown.executionOrder).toEqual(["B1", "B2"]);

  const issueSpec = validateIssueSpecDoc({
    summary: "Executable issue queue from approved breakdown",
    issues: [
      {
        id: "I1",
        title: "Normalize names before rendering",
        problemStatement: "The CLI accepts blank names and fails acceptance criteria.",
        rationale: "This closes breakdown task B1 first.",
        scope: ["Normalize whitespace", "Reject blank names"],
        acceptanceCriteria: ["Blank names throw a validation error."],
        dependencies: [],
        linkedDesignSections: ["DesignDoc#InputValidation"],
        linkedBreakdownTaskIds: ["B1"],
        grounding: {
          repoPaths: ["src/cli.ts", "src/cli.test.ts"],
          codeSymbols: ["parseName"],
        },
        requiredTests: ["Add regression coverage for blank input."],
        outOfScope: ["JSON output changes"],
        implementationNotes: ["Keep renderer untouched in this issue."],
      },
    ],
  });
  expect(issueSpec.issues[0]?.linkedBreakdownTaskIds).toEqual(["B1"]);
});

test("rejects oversized breakdown tasks and issue specs without breakdown links", () => {
  expect(() =>
    validateBreakdownDoc({
      summary: "Invalid breakdown",
      executionOrder: ["B1"],
      tasks: [
        {
          id: "B1",
          title: "Do everything",
          checklistLabel: "B1. Do everything",
          objective: "Too large",
          rationale: "Oversized",
          grounding: {
            designRefs: ["DesignDoc#All"],
            repoPaths: ["src/index.ts"],
            codeSymbols: [],
          },
          dependencies: [],
          acceptanceCriteria: ["Works"],
          expectedChanges: ["Many files"],
          validation: ["bun test"],
          riskNotes: [],
          sizeBudget: {
            maxEstimatedChangedLines: 900,
            estimateReason: "Too large",
          },
        },
      ],
    }),
  ).toThrow("Invalid BreakdownDoc");

  expect(() =>
    validateIssueSpecDoc({
      summary: "Invalid issue specs",
      issues: [
        {
          id: "I1",
          title: "Ungrounded issue",
          problemStatement: "Missing breakdown link",
          rationale: "Invalid",
          scope: ["Something"],
          acceptanceCriteria: ["Something"],
          dependencies: [],
          linkedDesignSections: ["DesignDoc#A"],
          linkedBreakdownTaskIds: [],
          grounding: {
            repoPaths: ["src/index.ts"],
            codeSymbols: [],
          },
          requiredTests: ["Add a test"],
          outOfScope: [],
          implementationNotes: [],
        },
      ],
    }),
  ).toThrow("Invalid IssueSpecDoc");
});
