
import { 
  User, 
  Agent, 
  Model, 
  VectorDB, 
  Integration, 
  Guardrail, 
  GuardrailRule,
  Workflow, 
  WorkflowStep,
  MarketplaceItem,
  Deployment
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@agentone.com',
    role: 'admin',
    avatar: '/placeholder.svg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@agentone.com',
    role: 'manager',
    avatar: '/placeholder.svg',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: '3',
    name: 'Developer User',
    email: 'developer@agentone.com',
    role: 'developer',
    avatar: '/placeholder.svg',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: '4',
    name: 'Viewer User',
    email: 'viewer@agentone.com',
    role: 'viewer',
    avatar: '/placeholder.svg',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04')
  }
];

// Mock Models
export const mockModels: Model[] = [
  {
    id: '1',
    name: 'SmallLanguageModel',
    provider: 'OpenAI',
    type: 'language',
    size: 'small',
    description: 'Efficient language model for basic tasks',
    parameters: 1_000_000_000,
    capabilities: ['text-generation', 'classification', 'summarization'],
    contextWindow: 4096
  },
  {
    id: '2',
    name: 'MediumLanguageModel',
    provider: 'Anthropic',
    type: 'language',
    size: 'medium',
    description: 'Balanced language model for various tasks',
    parameters: 7_000_000_000,
    capabilities: ['text-generation', 'classification', 'summarization', 'question-answering'],
    contextWindow: 8192
  },
  {
    id: '3',
    name: 'LargeLanguageModel',
    provider: 'AgentOne',
    type: 'language',
    size: 'large',
    description: 'Powerful language model for complex tasks',
    parameters: 70_000_000_000,
    capabilities: ['text-generation', 'classification', 'summarization', 'question-answering', 'reasoning', 'code-generation'],
    contextWindow: 32768
  },
  {
    id: '4',
    name: 'MultiModalModel',
    provider: 'Google',
    type: 'multi-modal',
    size: 'large',
    description: 'Advanced model that handles text, images, and audio',
    parameters: 80_000_000_000,
    capabilities: ['text-generation', 'image-understanding', 'audio-processing', 'video-analysis'],
    contextWindow: 16384
  },
  {
    id: '5',
    name: 'VisionModel',
    provider: 'Microsoft',
    type: 'vision',
    size: 'medium',
    description: 'Specialized model for visual content analysis',
    parameters: 5_000_000_000,
    capabilities: ['image-classification', 'object-detection', 'image-generation'],
    contextWindow: 4096
  }
];

// Mock Vector Databases
export const mockVectorDBs: VectorDB[] = [
  {
    id: '1',
    name: 'FastVector',
    provider: 'AgentOne',
    description: 'High-performance vector database for smaller datasets',
    features: ['similarity-search', 'metadata-filtering', 'hybrid-search'],
    scalability: 'medium',
    version: '1.2.0'
  },
  {
    id: '2',
    name: 'ScalableVector',
    provider: 'Pinecone',
    description: 'Highly scalable vector database for enterprise applications',
    features: ['similarity-search', 'metadata-filtering', 'hybrid-search', 'multi-tenant'],
    scalability: 'high',
    version: '2.0.1'
  },
  {
    id: '3',
    name: 'SecureVector',
    provider: 'Weaviate',
    description: 'Secure vector database with advanced encryption',
    features: ['similarity-search', 'metadata-filtering', 'encryption', 'access-control'],
    scalability: 'medium',
    version: '1.5.3'
  }
];

// Mock Integrations
export const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'SQL Connector',
    description: 'Connect to SQL databases for data retrieval and storage',
    type: 'data',
    provider: 'AgentOne',
    authType: 'username-password',
    enabled: true
  },
  {
    id: '2',
    name: 'REST API Connector',
    description: 'Connect to REST APIs for data exchange',
    type: 'api',
    provider: 'AgentOne',
    authType: 'oauth2',
    enabled: true
  },
  {
    id: '3',
    name: 'Document Processing',
    description: 'Process and extract data from documents',
    type: 'tool',
    provider: 'AgentOne',
    authType: 'api-key',
    enabled: true
  },
  {
    id: '4',
    name: 'Email Service',
    description: 'Send and receive emails',
    type: 'service',
    provider: 'SendGrid',
    authType: 'api-key',
    enabled: true
  },
  {
    id: '5',
    name: 'CRM Integration',
    description: 'Connect to popular CRM systems',
    type: 'service',
    provider: 'Salesforce',
    authType: 'oauth2',
    enabled: true
  }
];

// Mock Guardrail Rules
const contentFilteringRules: GuardrailRule[] = [
  {
    id: '1-1',
    name: 'Profanity Filter',
    description: 'Filter out profanity from text',
    condition: 'contains_profanity(text)',
    action: 'remove_profanity(text)',
    enabled: true
  },
  {
    id: '1-2',
    name: 'Harmful Content Detection',
    description: 'Detect and block harmful content',
    condition: 'is_harmful(text)',
    action: 'block_response()',
    enabled: true
  }
];

const securityRules: GuardrailRule[] = [
  {
    id: '2-1',
    name: 'PII Detection',
    description: 'Detect and mask personally identifiable information',
    condition: 'contains_pii(text)',
    action: 'mask_pii(text)',
    enabled: true
  },
  {
    id: '2-2',
    name: 'Injection Prevention',
    description: 'Prevent SQL, command, and other injection attacks',
    condition: 'is_injection_attempt(text)',
    action: 'block_and_log()',
    enabled: true
  }
];

const complianceRules: GuardrailRule[] = [
  {
    id: '3-1',
    name: 'GDPR Compliance',
    description: 'Ensure responses comply with GDPR',
    condition: 'violates_gdpr(text)',
    action: 'modify_for_gdpr_compliance(text)',
    enabled: true
  },
  {
    id: '3-2',
    name: 'HIPAA Compliance',
    description: 'Ensure responses comply with HIPAA',
    condition: 'violates_hipaa(text)',
    action: 'modify_for_hipaa_compliance(text)',
    enabled: true
  }
];

// Mock Guardrails
export const mockGuardrails: Guardrail[] = [
  {
    id: '1',
    name: 'Content Filtering',
    description: 'Filter inappropriate content from model outputs',
    type: 'content',
    enabled: true,
    rules: contentFilteringRules
  },
  {
    id: '2',
    name: 'Security Controls',
    description: 'Implement security controls for sensitive data',
    type: 'security',
    enabled: true,
    rules: securityRules
  },
  {
    id: '3',
    name: 'Compliance Framework',
    description: 'Ensure compliance with regulations',
    type: 'compliance',
    enabled: true,
    rules: complianceRules
  }
];

// Mock Workflow Steps
const customerServiceWorkflowSteps: WorkflowStep[] = [
  {
    id: '1-1',
    name: 'Extract Customer Intent',
    type: 'processing',
    config: {
      model: 'SmallLanguageModel',
      prompt: 'Extract the customer intent from this message.'
    },
    nextSteps: ['1-2']
  },
  {
    id: '1-2',
    name: 'Retrieve Knowledge',
    type: 'data-retrieval',
    config: {
      vectorDB: 'FastVector',
      collection: 'customer-service-knowledge'
    },
    nextSteps: ['1-3']
  },
  {
    id: '1-3',
    name: 'Generate Response',
    type: 'generation',
    config: {
      model: 'MediumLanguageModel',
      templateId: 'customer-service-response'
    },
    nextSteps: []
  }
];

const dataAnalysisWorkflowSteps: WorkflowStep[] = [
  {
    id: '2-1',
    name: 'Data Extraction',
    type: 'data-retrieval',
    config: {
      integration: 'SQL Connector',
      query: 'SELECT * FROM sales WHERE date >= :start_date AND date <= :end_date'
    },
    nextSteps: ['2-2']
  },
  {
    id: '2-2',
    name: 'Data Analysis',
    type: 'processing',
    config: {
      script: 'analyze_sales_data.py',
      params: {
        groupBy: 'product_category'
      }
    },
    nextSteps: ['2-3']
  },
  {
    id: '2-3',
    name: 'Report Generation',
    type: 'generation',
    config: {
      model: 'LargeLanguageModel',
      templateId: 'sales-report'
    },
    nextSteps: []
  }
];

// Mock Workflows
export const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Customer Service Workflow',
    description: 'Workflow for handling customer inquiries',
    steps: customerServiceWorkflowSteps,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '2',
    name: 'Data Analysis Workflow',
    description: 'Workflow for analyzing and reporting on data',
    steps: dataAnalysisWorkflowSteps,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-20')
  }
];

// Mock Agents
export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Customer Service Agent',
    description: 'An agent designed to handle customer service inquiries',
    status: 'active',
    creator: mockUsers[0],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
    model: mockModels[1], // Medium Language Model
    vectorDB: mockVectorDBs[0], // FastVector
    integrations: [mockIntegrations[3]], // Email Service
    guardrails: [mockGuardrails[0], mockGuardrails[1]], // Content Filtering, Security Controls
    workflow: mockWorkflows[0] // Customer Service Workflow
  },
  {
    id: '2',
    name: 'Data Analysis Agent',
    description: 'An agent that analyzes business data and generates insights',
    status: 'active',
    creator: mockUsers[0],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-20'),
    model: mockModels[2], // Large Language Model
    vectorDB: mockVectorDBs[1], // ScalableVector
    integrations: [mockIntegrations[0], mockIntegrations[1]], // SQL Connector, REST API Connector
    guardrails: [mockGuardrails[1], mockGuardrails[2]], // Security Controls, Compliance Framework
    workflow: mockWorkflows[1] // Data Analysis Workflow
  },
  {
    id: '3',
    name: 'Document Processing Agent',
    description: 'An agent that extracts and processes information from documents',
    status: 'draft',
    creator: mockUsers[1],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05'),
    model: mockModels[3], // MultiModal Model
    vectorDB: mockVectorDBs[2], // SecureVector
    integrations: [mockIntegrations[2]], // Document Processing
    guardrails: [mockGuardrails[1], mockGuardrails[2]], // Security Controls, Compliance Framework
    workflow: {
      id: '3',
      name: 'Document Processing Workflow',
      description: 'Workflow for processing documents',
      steps: [],
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-05')
    }
  }
];

// Mock Marketplace Items
export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'DataGpt',
    description: 'An AI platform for querying and extracting insights from the content.',
    category: 'Business',
    provider: 'DataGpt',
    pricing: 'Paid',
    link: 'http://15.206.121.90:82',
    image: 'https://images.yourstory.com/cs/2/ba6b0930e8cd11edbf1c2f9de7fdeb77/DATAGPT-1698910425252.png?mode=crop&crop=faces&ar=16%3A9&format=auto&w=1920&q=75',
    featured: true,
    downloads: 4520,
    createdAt: '2025-06-01'
  },
  {
    id: '2',
    name: 'Testament',
    description: 'An AI tool to auto-generate and execute test cases from user stories.',
    category: 'Productivity',
    provider: 'Testament',
    pricing: 'Paid',
    link: 'http://15.206.121.90:81',
    image: 'https://bito.ai/wp-content/uploads/2024/01/W.png',
    featured: false,
    downloads: 8012,
    createdAt: '2025-06-15'
  },

];

// Mock Deployments
export const mockDeployments: Deployment[] = [
  {
    id: '1',
    name: 'Customer Service Agent - Production',
    environment: 'production',
    type: 'cloud',
    status: 'running',
    resources: {
      cpu: '4 cores',
      memory: '16 GB',
      storage: '100 GB'
    },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '2',
    name: 'Data Analysis Agent - Development',
    environment: 'development',
    type: 'on-premise',
    status: 'running',
    resources: {
      cpu: '2 cores',
      memory: '8 GB',
      storage: '50 GB'
    },
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: '3',
    name: 'Document Processing Agent - Staging',
    environment: 'staging',
    type: 'hybrid',
    status: 'deploying',
    resources: {
      cpu: '4 cores',
      memory: '16 GB',
      storage: '200 GB',
      gpu: '1 NVIDIA T4'
    },
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05')
  }
];

// Mock Analytics Data
export const mockAnalyticsData = {
  agentUsage: [
    { name: 'Customer Service Agent', value: 65 },
    { name: 'Data Analysis Agent', value: 25 },
    { name: 'Document Processing Agent', value: 10 }
  ],
  requestsOverTime: [
    { date: '2024-03-01', requests: 1200 },
    { date: '2024-03-02', requests: 1350 },
    { date: '2024-03-03', requests: 1100 },
    { date: '2024-03-04', requests: 1500 },
    { date: '2024-03-05', requests: 1800 },
    { date: '2024-03-06', requests: 1600 },
    { date: '2024-03-07', requests: 1400 }
  ],
  errorRate: 0.02,
  avgResponseTime: 1.2, // seconds
  totalRequests: 10000,
  activeUsers: 120
};
