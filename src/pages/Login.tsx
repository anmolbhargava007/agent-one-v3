
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Eye, EyeOff } from "lucide-react";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast.success(`Welcome back! You've successfully logged in.`);
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    setIsLoading(true);
    let demoEmail = "admin@agentone.com";
    
    switch (role) {
      case "admin":
        demoEmail = "admin@agentone.com";
        break;
      case "manager":
        demoEmail = "manager@agentone.com";
        break;
      case "developer":
        demoEmail = "developer@agentone.com";
        break;
      case "viewer":
        demoEmail = "viewer@agentone.com";
        break;
    }
    
    try {
      const success = await login(demoEmail, "1234");
      if (success) {
        toast.success(`Welcome! You've logged in as a ${role} user.`);
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/images/e2a2616f-9ef6-4227-bad9-420362a39663.png" 
              alt="Agent One Logo" 
              className="h-16"
            />
          </div>
          <p className="text-muted-foreground mt-2">
            AI Accelerator Platform for Enterprise Deployment
          </p>
        </div>
        
        <Card className="w-full shadow-lg animate-fade-in">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-semibold">Login</h2>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground mb-2">
                Quick Demo Logins
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleDemoLogin("admin")}
                  disabled={isLoading}
                  size="sm"
                >
                  Admin User
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleDemoLogin("manager")}
                  disabled={isLoading}
                  size="sm"
                >
                  Manager User
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleDemoLogin("developer")}
                  disabled={isLoading}
                  size="sm"
                >
                  Developer User
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleDemoLogin("viewer")}
                  disabled={isLoading}
                  size="sm"
                >
                  Viewer User
                </Button>
              </div>
            </div>
            
            <div className="text-center w-full">
              <p className="text-xs text-muted-foreground">
                This is a demo application. Use password "1234" with any demo email.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
