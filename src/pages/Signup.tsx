
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Eye, EyeOff } from "lucide-react";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";
import logo from './../../public/logo.png'
import logoWhite from './../../public/logo-white.png'
import { useTheme } from "@/context/ThemeContext";

const Signup = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_pwd: "",
    user_mobile: "",
    gender: "MALE",
    is_active: true,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.user_name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.user_email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.user_pwd) {
      toast.error("Please enter your password");
      return;
    }

    if (formData.user_pwd !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.user_mobile.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(formData);
      if (success) {
        toast.success("Account created successfully! Please login.");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img className="w-60" src={theme === "dark" ? logoWhite : logo} alt="logo" />
          </div>
          <p className="text-muted-foreground mt-2">
            AI Accelerator Platform for Enterprise Deployment
          </p>
        </div>

        <Card className="w-full shadow-lg animate-fade-in">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-semibold">Create Account</h2>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user_name">Full Name</Label>
                <Input
                  id="user_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.user_name}
                  onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_email">Email</Label>
                <Input
                  id="user_email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.user_email}
                  onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_mobile">Mobile Number</Label>
                <Input
                  id="user_mobile"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.user_mobile}
                  onChange={(e) => setFormData({ ...formData, user_mobile: e.target.value })}
                  disabled={isLoading}
                />
              </div>
{/* 
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: "MALE" | "FEMALE") => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2 relative">
                <Label htmlFor="user_pwd">Password</Label>
                <Input
                  id="user_pwd"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.user_pwd}
                  onChange={(e) => setFormData({ ...formData, user_pwd: e.target.value })}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={toggleConfirmPasswordVisibility}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="col-span-1 md:col-span-2">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
