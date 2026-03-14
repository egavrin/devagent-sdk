export const PROTOCOL_VERSION = "0.1" as const;

export type ProtocolVersion = typeof PROTOCOL_VERSION;

export type WorkspaceProvider = "github" | "local";

export type WorkspaceRef = {
  id: string;
  name: string;
  provider: WorkspaceProvider;
  primaryRepositoryId: string;
};

export type RepositoryRef = {
  id: string;
  workspaceId: string;
  alias: string;
  name: string;
  repoRoot: string;
  repoFullName?: string;
  defaultBranch?: string;
  provider?: WorkspaceProvider;
};

export type WorkItemKind = "github-issue" | "local-task";

export type WorkItemRef = {
  id?: string;
  kind: WorkItemKind;
  externalId: string;
  title?: string;
  url?: string;
  repositoryId?: string;
  state?: string;
  labels?: string[];
};

export type ReviewableType = "github-pr";

export type ReviewableRef = {
  id?: string;
  provider: "github";
  type: ReviewableType;
  externalId: string;
  title?: string;
  url?: string;
  repositoryId: string;
};

export type WorkflowTaskType =
  | "triage"
  | "plan"
  | "implement"
  | "verify"
  | "review"
  | "repair";

export type RepositoryWorkspaceSpec = {
  repositoryId: string;
  alias: string;
  sourceRepoPath: string;
  baseRef?: string;
  workBranch: string;
  isolation: "git-worktree" | "temp-copy";
  readOnly?: boolean;
};

export type WorkspaceSpec = {
  workspaceRoot?: string;
  primaryRepositoryId: string;
  repositories: RepositoryWorkspaceSpec[];
};

export type ExecutorSpec = {
  executorId: "devagent" | "codex" | "claude" | "opencode";
  profileName?: string;
  provider?: string;
  model?: string;
  reasoning?: "low" | "medium" | "high";
  approvalMode?: "suggest" | "auto-edit" | "full-auto";
};

export type TaskConstraints = {
  maxIterations?: number;
  timeoutSec?: number;
  allowNetwork?: boolean;
  verifyCommands?: string[];
};

export type ContinuationMode = "fresh" | "resume";

export type ContinuationReason =
  | "retry_no_progress"
  | "plan_rework"
  | "repair_followup"
  | "pr_followup";

export type ContinuationSession = {
  kind: string;
  payload: Record<string, unknown>;
};

export type TaskContinuation = {
  session?: ContinuationSession;
  mode?: ContinuationMode;
  reason?: ContinuationReason;
  instructions?: string;
};

export type CommentRef = {
  author?: string;
  body: string;
};

export type CapabilitySet = {
  canSyncTasks: boolean;
  canCreateTask: boolean;
  canComment: boolean;
  canReview: boolean;
  canMerge: boolean;
  canOpenReviewable: boolean;
};

export type ArtifactKind =
  | "triage-report"
  | "plan"
  | "implementation-summary"
  | "verification-report"
  | "review-report"
  | "final-summary";

export type ArtifactRef = {
  kind: ArtifactKind;
  path: string;
  mimeType?: string;
  createdAt: string;
};

export type TaskExecutionRequest = {
  protocolVersion: ProtocolVersion;
  taskId: string;
  taskType: WorkflowTaskType;
  workspaceRef: WorkspaceRef;
  repositories: RepositoryRef[];
  workItem: WorkItemRef;
  reviewable?: ReviewableRef;
  execution: WorkspaceSpec;
  targetRepositoryIds: string[];
  executor: ExecutorSpec;
  constraints: TaskConstraints;
  continuation?: TaskContinuation;
  capabilities: CapabilitySet;
  context: {
    summary?: string;
    issueBody?: string;
    comments?: CommentRef[];
    changedFilesHint?: string[];
    skills?: string[];
    extraInstructions?: string[];
  };
  expectedArtifacts: ArtifactKind[];
};

export type TaskOutcome = "completed" | "no_progress";

export type TaskOutcomeReason =
  | "no_code"
  | "iteration_limit"
  | "empty_artifact"
  | "no_repo_changes";

export type TaskExecutionEvent =
  | {
      protocolVersion: ProtocolVersion;
      type: "started";
      at: string;
      taskId: string;
    }
  | {
      protocolVersion: ProtocolVersion;
      type: "progress";
      at: string;
      taskId: string;
      message: string;
    }
  | {
      protocolVersion: ProtocolVersion;
      type: "log";
      at: string;
      taskId: string;
      stream: "stdout" | "stderr";
      message: string;
    }
  | {
      protocolVersion: ProtocolVersion;
      type: "artifact";
      at: string;
      taskId: string;
      artifact: ArtifactRef;
    }
  | {
      protocolVersion: ProtocolVersion;
      type: "approval_required";
      at: string;
      taskId: string;
      reason: string;
    }
  | {
      protocolVersion: ProtocolVersion;
      type: "completed";
      at: string;
      taskId: string;
      status: "success" | "failed" | "cancelled";
    };

export type TaskExecutionResult = {
  protocolVersion: ProtocolVersion;
  taskId: string;
  status: "success" | "failed" | "cancelled";
  artifacts: ArtifactRef[];
  session?: ContinuationSession;
  outcome?: TaskOutcome;
  outcomeReason?: TaskOutcomeReason;
  metrics: {
    startedAt: string;
    finishedAt: string;
    durationMs: number;
  };
  error?: {
    code: string;
    message: string;
  };
};

export type ApprovalRequest = {
  protocolVersion: ProtocolVersion;
  taskId: string;
  stage: WorkflowTaskType;
  reason: string;
};

export type ApprovalDecision = {
  protocolVersion: ProtocolVersion;
  taskId: string;
  stage: WorkflowTaskType;
  decision: "approved" | "rejected";
  note?: string;
  decidedAt: string;
};
