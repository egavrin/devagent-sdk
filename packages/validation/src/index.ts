import AjvImport, { type ErrorObject } from "ajv";
import addFormatsImport from "ajv-formats";
import {
  approvalDecisionSchema,
  approvalRequestSchema,
  taskExecutionEventSchema,
  taskExecutionRequestSchema,
  taskExecutionResultSchema,
} from "@devagent-sdk/schema";
import type {
  ApprovalDecision,
  ApprovalRequest,
  TaskExecutionEvent,
  TaskExecutionRequest,
  TaskExecutionResult,
} from "@devagent-sdk/types";

const AjvCtor = ((AjvImport as unknown as { default?: unknown }).default ?? AjvImport) as new (
  options?: Record<string, unknown>,
) => any;
const addFormats = ((addFormatsImport as unknown as { default?: unknown }).default ??
  addFormatsImport) as (ajv: any) => void;

const ajv = new AjvCtor({
  allErrors: true,
  strict: true,
});

addFormats(ajv);

const taskExecutionRequestValidator = ajv.compile(taskExecutionRequestSchema);
const taskExecutionResultValidator = ajv.compile(taskExecutionResultSchema);
const taskExecutionEventValidator = ajv.compile(taskExecutionEventSchema);
const approvalRequestValidator = ajv.compile(approvalRequestSchema);
const approvalDecisionValidator = ajv.compile(approvalDecisionSchema);

function buildValidationError(prefix: string, errors: ErrorObject[] | null | undefined): Error {
  const details =
    errors?.map((error) => `${error.instancePath || "/"} ${error.message ?? "invalid"}`).join("; ") ??
    "invalid payload";
  return new Error(`${prefix}: ${details}`);
}

export function validateTaskExecutionRequest(value: unknown): TaskExecutionRequest {
  if (!taskExecutionRequestValidator(value)) {
    throw buildValidationError("Invalid TaskExecutionRequest", taskExecutionRequestValidator.errors);
  }
  return value as TaskExecutionRequest;
}

export function validateTaskExecutionResult(value: unknown): TaskExecutionResult {
  if (!taskExecutionResultValidator(value)) {
    throw buildValidationError("Invalid TaskExecutionResult", taskExecutionResultValidator.errors);
  }
  return value as TaskExecutionResult;
}

export function validateTaskExecutionEvent(value: unknown): TaskExecutionEvent {
  if (!taskExecutionEventValidator(value)) {
    throw buildValidationError("Invalid TaskExecutionEvent", taskExecutionEventValidator.errors);
  }
  return value as TaskExecutionEvent;
}

export function validateApprovalRequest(value: unknown): ApprovalRequest {
  if (!approvalRequestValidator(value)) {
    throw buildValidationError("Invalid ApprovalRequest", approvalRequestValidator.errors);
  }
  return value as ApprovalRequest;
}

export function validateApprovalDecision(value: unknown): ApprovalDecision {
  if (!approvalDecisionValidator(value)) {
    throw buildValidationError("Invalid ApprovalDecision", approvalDecisionValidator.errors);
  }
  return value as ApprovalDecision;
}
