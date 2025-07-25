const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://15.206.121.90:1915'

// API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: string;
  msg: string;
  data: T;
  accessToken?: string;
  refreshToken?: string;
  expiry_date?: string;
  is_app_valid?: boolean;
}

// Authentication interfaces
export interface SignupRequest {
  user_name: string;
  user_email: string;
  user_pwd: string;
  user_mobile: string;
  gender: string;
  is_active: boolean;
}

export interface SigninRequest {
  user_email: string;
  user_pwd: string;
}

export interface UserForManagement {
  user_id: number;
  user_name: string;
  user_email: string;
  user_mobile: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  is_active: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  is_active: boolean;
}

export interface AuthResponse {
  success: boolean;
  statusCode: string;
  msg: string;
  data?: any;
  accessToken?: string;
  refreshToken?: string;
  expiry_date?: string;
  is_app_valid?: boolean;
}

// Model interfaces
export interface CreateModelRequest {
  aimodel_name: string;
  descriptions: string;
  provider_name: string;
  model_type: string;
  model_size: string;
  parameters: string;
  context_token: number;
  capabilities: string[];
  is_active: boolean;
}

export interface UpdateModelRequest extends CreateModelRequest {
  aimodel_id: number;
}

export interface ToggleStatusRequest {
  aimodel_id?: number;
  aivector_id?: number;
  guardrail_id?: number;
  agent_id?: number;
  is_active: boolean;
}

// Vector DB interfaces
export interface CreateVectorRequest {
  aivector_name: string;
  descriptions: string;
  provider_name: string;
  version: string;
  scalability: string;
  features: string[];
  is_active: boolean;
}

export interface UpdateVectorRequest extends CreateVectorRequest {
  aivector_id: number;
}

// Agent interfaces
export interface CreateAgentRequest {
  agent_name: string;
  descriptions: string;
  agents_status: string;
  aimodel_id: number;
  aivector_id: number;
  integrator_ids: number[];
  guardrail_ids: number[];
  is_active: boolean;
}

// HTTP client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Authentication methods
  async signup(data: SignupRequest): Promise<ApiResponse> {
    return this.request('/api/v1/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signin(data: SigninRequest): Promise<ApiResponse> {
    return this.request('/api/v1/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // User management methods
  async getUsers(): Promise<ApiResponse<{ data: UserForManagement[] }>> {
    const response = await this.request<{ data: UserForManagement[] }>('/api/v1/user');
    return response;
  }  

  async updateUser(userData: UserForManagement | User): Promise<AuthResponse> {
    return this.request('/api/v1/user', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // AI Models methods
  async createModel(data: CreateModelRequest): Promise<ApiResponse> {
    return this.request('/api/v1/aimodels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getModels(params?: {
    aimodel_id?: number;
    aimodel_name?: string;
    is_active?: boolean;
  }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/aimodels${query ? `?${query}` : ''}`);
  }

  async updateModel(data: UpdateModelRequest): Promise<ApiResponse> {
    return this.request('/api/v1/aimodels', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async toggleModelStatus(data: ToggleStatusRequest): Promise<ApiResponse> {
    return this.request('/api/v1/aimodels', {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }

  async checkModelDuplicate(name: string): Promise<ApiResponse> {
    return this.request(`/api/v1/aimodels-isduplicate?aimodel_name=${encodeURIComponent(name)}`);
  }

  // AI Vectors methods
  async createVector(data: CreateVectorRequest): Promise<ApiResponse> {
    return this.request('/api/v1/aivectors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getVectors(params?: {
    aivector_id?: number;
    aivector_name?: string;
    is_active?: boolean;
  }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/aivectors${query ? `?${query}` : ''}`);
  }

  async updateVector(data: UpdateVectorRequest): Promise<ApiResponse> {
    return this.request('/api/v1/aivectors', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async toggleVectorStatus(data: ToggleStatusRequest): Promise<ApiResponse> {
    return this.request('/api/v1/aivectors', {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }

  // Guardrails methods
  async createGuardrail(data: any): Promise<ApiResponse> {
    return this.request('/api/v1/guardrails', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGuardrails(params?: {
    guardrail_id?: number;
    guardrail_name?: string;
    is_active?: boolean;
  }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/guardrails${query ? `?${query}` : ''}`);
  }

  async updateGuardrail(data: any): Promise<ApiResponse> {
    return this.request('/api/v1/guardrails', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async toggleGuardrailStatus(data: ToggleStatusRequest): Promise<ApiResponse> {
    return this.request('/api/v1/guardrails', {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }

  async checkGuardrailDuplicate(name: string): Promise<ApiResponse> {
    return this.request(`/api/v1/guardrails-isduplicate?guardrail_name=${encodeURIComponent(name)}`);
  }

  // Integrators methods
  async createIntegrator(data: any): Promise<ApiResponse> {
    return this.request('/api/v1/integrators', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getIntegrators(params?: {
    integrator_id?: number;
    integrator_name?: string;
    is_connected?: boolean;
    is_active?: boolean;
  }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    const url = `/api/v1/integrators${query ? `?${query}` : ''}`;
    return this.request(url);
  }

  async updateIntegrator(data: any): Promise<ApiResponse> {
    return this.request('/api/v1/integrators', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Agents methods
  async createAgent(data: CreateAgentRequest): Promise<ApiResponse> {
    return this.request('/api/v1/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAgents(params?: {
    agent_id?: number;
    agent_name?: string;
    is_active?: boolean;
  }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/api/v1/agents${query ? `?${query}` : ''}`);
  }

  async updateAgent(data: any): Promise<ApiResponse> {
    return this.request('/api/v1/agents', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Utility method to check if item is used in agents
  async checkItemUsageInAgents(itemType: 'aimodel_id' | 'aivector_id' | 'integrator_ids' | 'guardrail_ids', itemId: number): Promise<boolean> {
    try {
      const response = await this.getAgents({ is_active: true });
      if (response.success && response.data) {
        return response.data.some((agent: any) => {
          if (itemType === 'integrator_ids' || itemType === 'guardrail_ids') {
            const ids = agent[itemType] || [];
            return Array.isArray(ids) && ids.includes(itemId);
          } else {
            return agent[itemType] === itemId;
          }
        });
      }
      return false;
    } catch (error) {
      console.error('Error checking item usage:', error);
      return false;
    }
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);
