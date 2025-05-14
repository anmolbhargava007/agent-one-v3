
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a stored user in localStorage (for persistence)
    const storedUser = localStorage.getItem('agentone-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('agentone-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // For this demo, we'll accept password "1234" and check if the email exists in our mock data
    if (password !== "1234") {
      toast.error('Invalid password. Please try again.');
      setIsLoading(false);
      return false;
    }
    
    // Find user by email
    const foundUser = mockUsers.find(u => u.email === email);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('agentone-user', JSON.stringify(foundUser));
      toast.success(`Welcome back, ${foundUser.name}!`);
      setIsLoading(false);
      return true;
    }
    
    toast.error('Invalid credentials. Please try again.');
    setIsLoading(false);
    return false;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('agentone-user');
    toast.info('You have been logged out');
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
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
