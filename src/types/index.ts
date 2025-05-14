
// User Types
export type UserRole = 'admin' | 'manager' | 'developer' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Agent Types
export type AgentStatus = 'active' | 'inactive' | 'draft' | 'archived';
export type ModelSize = 'small' | 'medium' | 'large';
export type ModelType = 'language' | 'vision' | 'multi-modal';

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
  model: Model;
  vectorDB: VectorDB;
  integrations: Integration[];
  guardrails: Guardrail[];
  workflow: Workflow;
}

// Model Types
export interface Model {
  id: string;
  name: string;
  provider: string;
  type: ModelType;
  size: ModelSize;
  description: string;
  parameters: number;
  capabilities: string[];
  contextWindow: number;
}

// Vector Database Types
export interface VectorDB {
  id: string;
  name: string;
  provider: string;
  description: string;
  features: string[];
  scalability: string;
  version: string;
}

// Integration Types
export type IntegrationType = 'data' | 'api' | 'tool' | 'service';

export interface Integration {
  id: string;
  name: string;
  description: string;
  type: IntegrationType;
  provider: string;
  authType: string;
  enabled: boolean;
}

// Guardrail Types
export type GuardrailType = 'content' | 'security' | 'ethics' | 'compliance' | 'performance';

export interface Guardrail {
  id: string;
  name: string;
  description: string;
  type: GuardrailType;
  enabled: boolean;
  rules: GuardrailRule[];
}

export interface GuardrailRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  enabled: boolean;
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  nextSteps: string[];
}

// Marketplace Types
export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  provider: string;
  pricing: string;
  rating: number;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
  type: 'agent' | 'integration' | 'model' | 'template' | 'workflow';
}

// Deployment Types
export type DeploymentEnvironment = 'development' | 'staging' | 'production';
export type DeploymentType = 'cloud' | 'on-premise' | 'hybrid';

export interface Deployment {
  id: string;
  name: string;
  environment: DeploymentEnvironment;
  type: DeploymentType;
  status: 'running' | 'stopped' | 'failed' | 'deploying';
  resources: DeploymentResources;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeploymentResources {
  cpu: string;
  memory: string;
  storage: string;
  gpu?: string;
}

// Analytics Types
export interface AnalyticsData {
  id: string;
  period: string;
  metrics: Record<string, number>;
  createdAt: Date;
}
