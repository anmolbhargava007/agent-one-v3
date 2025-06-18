
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { toast } from '@/components/ui/sonner';
import { apiClient, SigninRequest, SignupRequest } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupRequest) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a stored user and token in localStorage
    const storedUser = localStorage.getItem('agentone-user');
    const storedToken = localStorage.getItem('agentone-token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        apiClient.setToken(storedToken);
      } catch (error) {
        localStorage.removeItem('agentone-user');
        localStorage.removeItem('agentone-token');
        apiClient.clearToken();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const signInData: SigninRequest = {
        user_email: email,
        user_pwd: password,
      };
      
      const response = await apiClient.signin(signInData);
      
      if (response.success) {
        // Set the token in the API client
        if (response.accessToken) {
          apiClient.setToken(response.accessToken);
        }
        
        // Create user object from response data
        const userData: User = {
          id: response.data?.user_id || email,
          name: response.data?.user_name || email.split('@')[0],
          email: email,
          role: 'admin', // Default role - adjust based on API response
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setUser(userData);
        localStorage.setItem('agentone-user', JSON.stringify(userData));
        
        toast.success(response.msg || `Welcome back, ${userData.name}!`);
        setIsLoading(false);
        return true;
      } else {
        toast.error(response.msg || 'Login failed. Please try again.');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please check your connection and try again.');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (userData: SignupRequest): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiClient.signup(userData);
      
      if (response.success) {
        toast.success(response.msg || 'Account created successfully! Please login.');
        setIsLoading(false);
        return true;
      } else {
        toast.error(response.msg || 'Signup failed. Please try again.');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Network error. Please check your connection and try again.');
      setIsLoading(false);
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('agentone-user');
    localStorage.removeItem('agentone-token');
    apiClient.clearToken();
    toast.info('You have been logged out');
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
