export const PROTOCOL_VERSION = "0.1" as const;

export type ProtocolVersion = typeof PROTOCOL_VERSION;

export type ProjectRef = {
  id: string;
  name: string;
  repoRoot?: string;
  repoFullName?: string;
};

export type WorkItemRef = {
  kind: "github-issue";
  externalId: string;
  title?: string;
  url?: string;
};

export type WorkflowTaskType =
  | "triage"
  | "plan"
  | "implement"
  | "verify"
  | "review"
  | "repair";

export type WorkspaceSpec = {
  sourceRepoPath: string;
  baseRef?: string;
  workBranch: string;
  isolation: "git-worktree" | "temp-copy";
  readOnly?: boolean;
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

export type CommentRef = {
  author?: string;
  body: string;
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
  project: ProjectRef;
  workItem: WorkItemRef;
  workspace: WorkspaceSpec;
  executor: ExecutorSpec;
  constraints: TaskConstraints;
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
