import AjvImport, { type ErrorObject } from "ajv";
import addFormatsImport from "ajv-formats";
import {
  approvalDecisionSchema,
  approvalRequestSchema,
  breakdownDocSchema,
  issueSpecDocSchema,
  taskExecutionEventSchema,
  taskExecutionRequestSchema,
  taskExecutionResultSchema,
} from "@devagent-sdk/schema";
import type {
  ApprovalDecision,
  ApprovalRequest,
  BreakdownDoc,
  IssueSpecDoc,
  TaskExecutionEvent,
  TaskExecutionRequest,
  TaskExecutionResult,
} from "@devagent-sdk/types";

type AjvConstructor = typeof import("ajv")["default"];
type AddFormatsFn = typeof import("ajv-formats")["default"];

const AjvCtor = ((AjvImport as unknown as { default?: AjvConstructor }).default ?? AjvImport) as AjvConstructor;
const addFormats = ((addFormatsImport as unknown as { default?: AddFormatsFn }).default ??
  addFormatsImport) as AddFormatsFn;

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
const breakdownDocValidator = ajv.compile(breakdownDocSchema);
const issueSpecDocValidator = ajv.compile(issueSpecDocSchema);

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

export function validateBreakdownDoc(value: unknown): BreakdownDoc {
  if (!breakdownDocValidator(value)) {
    throw buildValidationError("Invalid BreakdownDoc", breakdownDocValidator.errors);
  }
  return value as BreakdownDoc;
}

export function validateIssueSpecDoc(value: unknown): IssueSpecDoc {
  if (!issueSpecDocValidator(value)) {
    throw buildValidationError("Invalid IssueSpecDoc", issueSpecDocValidator.errors);
  }
  return value as IssueSpecDoc;
}
