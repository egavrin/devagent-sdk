import { PROTOCOL_VERSION } from "@devagent-sdk/types";

const protocolVersion = {
  type: "string",
  const: PROTOCOL_VERSION,
} as const;

export const protocolVersionSchema = protocolVersion;

const workflowTaskType = {
  type: "string",
  enum: [
    "task-intake",
    "design",
    "breakdown",
    "issue-generation",
    "test-plan",
    "triage",
    "plan",
    "implement",
    "verify",
    "review",
    "repair",
    "completion",
  ],
} as const;

export const workflowTaskTypeSchema = workflowTaskType;

const artifactKind = {
  type: "string",
  enum: [
    "task-spec",
    "design-doc",
    "breakdown-doc",
    "issue-spec",
    "implementation-plan",
    "test-plan",
    "change-set",
    "workflow-summary",
    "decision-log",
    "triage-report",
    "plan",
    "implementation-summary",
    "verification-report",
    "review-report",
    "final-summary",
  ],
} as const;

export const artifactKindSchema = artifactKind;

const workspaceProvider = {
  type: "string",
  enum: ["github", "local"],
} as const;

const workspaceRef = {
  type: "object",
  additionalProperties: false,
  required: ["id", "name", "provider", "primaryRepositoryId"],
  properties: {
    id: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1 },
    provider: workspaceProvider,
    primaryRepositoryId: { type: "string", minLength: 1 },
  },
} as const;

export const workspaceRefSchema = workspaceRef;

const repositoryRef = {
  type: "object",
  additionalProperties: false,
  required: ["id", "workspaceId", "alias", "name", "repoRoot"],
  properties: {
    id: { type: "string", minLength: 1 },
    workspaceId: { type: "string", minLength: 1 },
    alias: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1 },
    repoRoot: { type: "string", minLength: 1 },
    repoFullName: { type: "string", minLength: 1 },
    defaultBranch: { type: "string", minLength: 1 },
    provider: workspaceProvider,
  },
} as const;

export const repositoryRefSchema = repositoryRef;

const workItemRef = {
  type: "object",
  additionalProperties: false,
  required: ["kind", "externalId"],
  properties: {
    id: { type: "string", minLength: 1 },
    kind: { type: "string", enum: ["github-issue", "local-task"] },
    externalId: { type: "string", minLength: 1 },
    title: { type: "string" },
    url: { type: "string", minLength: 1 },
    repositoryId: { type: "string", minLength: 1 },
    state: { type: "string", minLength: 1 },
    labels: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
  },
} as const;

export const workItemRefSchema = workItemRef;

const reviewableRef = {
  type: "object",
  additionalProperties: false,
  required: ["provider", "type", "externalId", "repositoryId"],
  properties: {
    id: { type: "string", minLength: 1 },
    provider: { type: "string", const: "github" },
    type: { type: "string", const: "github-pr" },
    externalId: { type: "string", minLength: 1 },
    title: { type: "string" },
    url: { type: "string", minLength: 1 },
    repositoryId: { type: "string", minLength: 1 },
  },
} as const;

export const reviewableRefSchema = reviewableRef;

const repositoryWorkspaceSpec = {
  type: "object",
  additionalProperties: false,
  required: ["repositoryId", "alias", "sourceRepoPath", "workBranch", "isolation"],
  properties: {
    repositoryId: { type: "string", minLength: 1 },
    alias: { type: "string", minLength: 1 },
    sourceRepoPath: { type: "string", minLength: 1 },
    baseRef: { type: "string", minLength: 1 },
    workBranch: { type: "string", minLength: 1 },
    isolation: {
      type: "string",
      enum: ["git-worktree", "temp-copy"],
    },
    readOnly: { type: "boolean" },
  },
} as const;

const workspaceSpec = {
  type: "object",
  additionalProperties: false,
  required: ["primaryRepositoryId", "repositories"],
  properties: {
    workspaceRoot: { type: "string", minLength: 1 },
    primaryRepositoryId: { type: "string", minLength: 1 },
    repositories: {
      type: "array",
      minItems: 1,
      items: repositoryWorkspaceSpec,
    },
  },
} as const;

export const workspaceSpecSchema = workspaceSpec;

const executorSpec = {
  type: "object",
  additionalProperties: false,
  required: ["executorId"],
  properties: {
    executorId: {
      type: "string",
      enum: ["devagent", "codex", "claude", "opencode"],
    },
    profileName: { type: "string", minLength: 1 },
    provider: { type: "string", minLength: 1 },
    model: { type: "string", minLength: 1 },
    reasoning: { type: "string", enum: ["low", "medium", "high"] },
    approvalMode: { type: "string", enum: ["suggest", "auto-edit", "full-auto"] },
  },
} as const;

export const executorSpecSchema = executorSpec;

const taskConstraints = {
  type: "object",
  additionalProperties: false,
  properties: {
    maxIterations: { type: "integer", minimum: 1 },
    timeoutSec: { type: "integer", minimum: 1 },
    allowNetwork: { type: "boolean" },
    verifyCommands: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
  },
} as const;

export const taskConstraintsSchema = taskConstraints;

const continuationSession = {
  type: "object",
  additionalProperties: false,
  required: ["kind", "payload"],
  properties: {
    kind: { type: "string", minLength: 1 },
    payload: {
      type: "object",
    },
  },
} as const;

const taskContinuation = {
  type: "object",
  additionalProperties: false,
  properties: {
    session: continuationSession,
    mode: { type: "string", enum: ["fresh", "resume"] },
    reason: {
      type: "string",
      enum: ["retry_no_progress", "plan_rework", "repair_followup", "pr_followup"],
    },
    instructions: { type: "string" },
  },
} as const;

const commentRef = {
  type: "object",
  additionalProperties: false,
  required: ["body"],
  properties: {
    author: { type: "string" },
    body: { type: "string" },
  },
} as const;

export const commentRefSchema = commentRef;

const issueUnitRef = {
  type: "object",
  additionalProperties: false,
  required: ["id", "title", "sequence", "dependencyIds", "acceptanceCriteria", "linkedArtifactVersionIds"],
  properties: {
    id: { type: "string", minLength: 1 },
    title: { type: "string", minLength: 1 },
    sequence: { type: "integer", minimum: 1 },
    dependencyIds: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
    acceptanceCriteria: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
    linkedArtifactVersionIds: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
  },
} as const;

const contextBundleRef = {
  type: "object",
  additionalProperties: false,
  required: ["id", "artifactVersionIds", "summary"],
  properties: {
    id: { type: "string", minLength: 1 },
    artifactVersionIds: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
    summary: { type: "string", minLength: 1 },
  },
} as const;

const capabilitySet = {
  type: "object",
  additionalProperties: false,
  required: [
    "canSyncTasks",
    "canCreateTask",
    "canComment",
    "canReview",
    "canMerge",
    "canOpenReviewable",
  ],
  properties: {
    canSyncTasks: { type: "boolean" },
    canCreateTask: { type: "boolean" },
    canComment: { type: "boolean" },
    canReview: { type: "boolean" },
    canMerge: { type: "boolean" },
    canOpenReviewable: { type: "boolean" },
  },
} as const;

export const capabilitySetSchema = capabilitySet;

const breakdownTaskGroundingSchema = {
  type: "object",
  additionalProperties: false,
  required: ["designRefs", "repoPaths", "codeSymbols"],
  properties: {
    designRefs: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    repoPaths: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    codeSymbols: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
  },
} as const;

const breakdownTaskSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "id",
    "title",
    "checklistLabel",
    "objective",
    "rationale",
    "grounding",
    "dependencies",
    "acceptanceCriteria",
    "expectedChanges",
    "validation",
    "riskNotes",
    "sizeBudget",
  ],
  properties: {
    id: { type: "string", minLength: 1 },
    title: { type: "string", minLength: 1 },
    checklistLabel: { type: "string", minLength: 1 },
    objective: { type: "string", minLength: 1 },
    rationale: { type: "string", minLength: 1 },
    grounding: breakdownTaskGroundingSchema,
    dependencies: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
    acceptanceCriteria: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    expectedChanges: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    validation: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    riskNotes: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
    sizeBudget: {
      type: "object",
      additionalProperties: false,
      required: ["maxEstimatedChangedLines", "estimateReason"],
      properties: {
        maxEstimatedChangedLines: { type: "integer", minimum: 1, maximum: 500 },
        estimateReason: { type: "string", minLength: 1 },
      },
    },
  },
} as const;

export const breakdownDocSchema = {
  $id: "BreakdownDoc",
  type: "object",
  additionalProperties: false,
  required: ["summary", "executionOrder", "tasks"],
  properties: {
    summary: { type: "string", minLength: 1 },
    executionOrder: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    tasks: {
      type: "array",
      minItems: 1,
      items: breakdownTaskSchema,
    },
  },
} as const;

const issueSpecGroundingSchema = {
  type: "object",
  additionalProperties: false,
  required: ["repoPaths", "codeSymbols"],
  properties: {
    repoPaths: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    codeSymbols: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
  },
} as const;

const issueSpecRecordSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "id",
    "title",
    "problemStatement",
    "rationale",
    "scope",
    "acceptanceCriteria",
    "dependencies",
    "linkedDesignSections",
    "linkedBreakdownTaskIds",
    "grounding",
    "requiredTests",
    "outOfScope",
    "implementationNotes",
  ],
  properties: {
    id: { type: "string", minLength: 1 },
    title: { type: "string", minLength: 1 },
    problemStatement: { type: "string", minLength: 1 },
    rationale: { type: "string", minLength: 1 },
    scope: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    acceptanceCriteria: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    dependencies: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
    linkedDesignSections: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    linkedBreakdownTaskIds: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    grounding: issueSpecGroundingSchema,
    requiredTests: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    outOfScope: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
    implementationNotes: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
  },
} as const;

export const issueSpecDocSchema = {
  $id: "IssueSpecDoc",
  type: "object",
  additionalProperties: false,
  required: ["summary", "issues"],
  properties: {
    summary: { type: "string", minLength: 1 },
    issues: {
      type: "array",
      minItems: 1,
      items: issueSpecRecordSchema,
    },
  },
} as const;

const artifactRef = {
  type: "object",
  additionalProperties: false,
  required: ["kind", "path", "createdAt"],
  properties: {
    kind: artifactKind,
    path: { type: "string", minLength: 1 },
    variant: { type: "string", enum: ["structured", "rendered"] },
    mimeType: { type: "string", minLength: 1 },
    createdAt: { type: "string", format: "date-time" },
  },
} as const;

export const artifactRefSchema = artifactRef;

export const taskExecutionRequestSchema = {
  $id: "TaskExecutionRequest",
  type: "object",
  additionalProperties: false,
  required: [
    "protocolVersion",
    "taskId",
    "taskType",
    "workspaceRef",
    "repositories",
    "workItem",
    "execution",
    "targetRepositoryIds",
    "executor",
    "constraints",
    "capabilities",
    "context",
    "expectedArtifacts",
  ],
  properties: {
    protocolVersion,
    taskId: { type: "string", minLength: 1 },
    taskType: workflowTaskType,
    workspaceRef,
    repositories: {
      type: "array",
      minItems: 1,
      items: repositoryRef,
    },
    workItem: workItemRef,
    reviewable: reviewableRef,
    execution: workspaceSpec,
    targetRepositoryIds: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    executor: executorSpec,
    constraints: taskConstraints,
    continuation: taskContinuation,
    issueUnit: issueUnitRef,
    contextBundle: contextBundleRef,
    capabilities: capabilitySet,
    context: {
      type: "object",
      additionalProperties: false,
      properties: {
        summary: { type: "string" },
        issueBody: { type: "string" },
        comments: {
          type: "array",
          items: commentRef,
        },
        changedFilesHint: {
          type: "array",
          items: { type: "string", minLength: 1 },
        },
        skills: {
          type: "array",
          items: { type: "string", minLength: 1 },
        },
        extraInstructions: {
          type: "array",
          items: { type: "string", minLength: 1 },
        },
      },
    },
    expectedArtifacts: {
      type: "array",
      items: artifactKind,
    },
  },
} as const;

export const taskExecutionEventSchema = {
  $id: "TaskExecutionEvent",
  oneOf: [
    {
      type: "object",
      additionalProperties: false,
      required: ["protocolVersion", "type", "at", "taskId"],
      properties: {
        protocolVersion,
        type: { type: "string", const: "started" },
        at: { type: "string", format: "date-time" },
        taskId: { type: "string", minLength: 1 },
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["protocolVersion", "type", "at", "taskId", "message"],
      properties: {
        protocolVersion,
        type: { type: "string", const: "progress" },
        at: { type: "string", format: "date-time" },
        taskId: { type: "string", minLength: 1 },
        message: { type: "string" },
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["protocolVersion", "type", "at", "taskId", "stream", "message"],
      properties: {
        protocolVersion,
        type: { type: "string", const: "log" },
        at: { type: "string", format: "date-time" },
        taskId: { type: "string", minLength: 1 },
        stream: { type: "string", enum: ["stdout", "stderr"] },
        message: { type: "string" },
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["protocolVersion", "type", "at", "taskId", "artifact"],
      properties: {
        protocolVersion,
        type: { type: "string", const: "artifact" },
        at: { type: "string", format: "date-time" },
        taskId: { type: "string", minLength: 1 },
        artifact: artifactRef,
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["protocolVersion", "type", "at", "taskId", "reason"],
      properties: {
        protocolVersion,
        type: { type: "string", const: "approval_required" },
        at: { type: "string", format: "date-time" },
        taskId: { type: "string", minLength: 1 },
        reason: { type: "string", minLength: 1 },
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["protocolVersion", "type", "at", "taskId", "status"],
      properties: {
        protocolVersion,
        type: { type: "string", const: "completed" },
        at: { type: "string", format: "date-time" },
        taskId: { type: "string", minLength: 1 },
        status: { type: "string", enum: ["success", "failed", "cancelled"] },
      },
    },
  ],
} as const;

export const taskExecutionResultSchema = {
  $id: "TaskExecutionResult",
  type: "object",
  additionalProperties: false,
  required: ["protocolVersion", "taskId", "status", "artifacts", "metrics"],
  properties: {
    protocolVersion,
    taskId: { type: "string", minLength: 1 },
    status: { type: "string", enum: ["success", "failed", "cancelled"] },
    artifacts: {
      type: "array",
      items: artifactRef,
    },
    session: continuationSession,
    outcome: {
      type: "string",
      enum: ["completed", "no_progress"],
    },
    outcomeReason: {
      type: "string",
      enum: ["no_code", "iteration_limit", "empty_artifact", "no_repo_changes"],
    },
    metrics: {
      type: "object",
      additionalProperties: false,
      required: ["startedAt", "finishedAt", "durationMs"],
      properties: {
        startedAt: { type: "string", format: "date-time" },
        finishedAt: { type: "string", format: "date-time" },
        durationMs: { type: "number", minimum: 0 },
      },
    },
    error: {
      type: "object",
      additionalProperties: false,
      required: ["code", "message"],
      properties: {
        code: { type: "string", minLength: 1 },
        message: { type: "string", minLength: 1 },
      },
    },
  },
} as const;

export const approvalRequestSchema = {
  $id: "ApprovalRequest",
  type: "object",
  additionalProperties: false,
  required: ["protocolVersion", "taskId", "stage", "reason"],
  properties: {
    protocolVersion,
    taskId: { type: "string", minLength: 1 },
    stage: workflowTaskType,
    reason: { type: "string", minLength: 1 },
  },
} as const;

export const approvalDecisionSchema = {
  $id: "ApprovalDecision",
  type: "object",
  additionalProperties: false,
  required: ["protocolVersion", "taskId", "stage", "decision", "decidedAt"],
  properties: {
    protocolVersion,
    taskId: { type: "string", minLength: 1 },
    stage: workflowTaskType,
    decision: { type: "string", enum: ["approved", "rejected"] },
    note: { type: "string" },
    decidedAt: { type: "string", format: "date-time" },
  },
} as const;

export default {
  protocolVersionSchema,
  workflowTaskTypeSchema,
  artifactKindSchema,
  workspaceRefSchema,
  repositoryRefSchema,
  workItemRefSchema,
  reviewableRefSchema,
  workspaceSpecSchema,
  executorSpecSchema,
  taskConstraintsSchema,
  commentRefSchema,
  capabilitySetSchema,
  breakdownDocSchema,
  issueSpecDocSchema,
  artifactRefSchema,
  taskExecutionRequestSchema,
  taskExecutionEventSchema,
  taskExecutionResultSchema,
  approvalRequestSchema,
  approvalDecisionSchema,
};
