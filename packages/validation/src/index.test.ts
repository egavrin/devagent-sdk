import { expect, test } from "bun:test";
import {
  validateApprovalDecision,
  validateApprovalRequest,
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
});

test("validates event result and approval fixtures", () => {
  expect(validateTaskExecutionEvent(taskEvent).type).toBe("progress");
  expect(validateTaskExecutionResult(taskResult).status).toBe("success");
  expect(validateApprovalRequest(approvalRequest).stage).toBe("plan");
  expect(validateApprovalDecision(approvalDecision).decision).toBe("approved");
});

test("validates the shared golden request fixture", () => {
  expect(validateTaskExecutionRequest(goldenRequest).taskType).toBe("plan");
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
    context: {
      ...request.context,
      extraInstructions: [...(request.context.extraInstructions ?? []), "Preserve branch reuse."],
    },
  };
  expect(validateTaskExecutionRequest(additiveRequest).context.extraInstructions).toContain("Preserve branch reuse.");

  const additiveResult = {
    ...taskResult,
    error: {
      code: "NONE",
      message: "No failure",
    },
  };
  expect(validateTaskExecutionResult(additiveResult).error?.code).toBe("NONE");

  const additiveApproval = {
    ...approvalDecision,
    note: "Approved during compatibility test",
  };
  expect(validateApprovalDecision(additiveApproval).note).toContain("compatibility");
});
