import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Building2 } from 'lucide-react';

interface LoginFormProps {
  isSuperAdmin?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ isSuperAdmin = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password, isSuperAdmin);
    
    if (success) {
      if (isSuperAdmin) {
        navigate('/super-admin');
      } else {
        navigate('/dashboard');
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="auth-form w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSuperAdmin ? 'Super Admin Login' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSuperAdmin 
              ? 'Access the super admin portal'
              : 'Sign in to your account to continue'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={isSuperAdmin ? "admin@saas.com" : "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-custom focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isSuperAdmin ? "admin123" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 transition-custom focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-primary hover:opacity-90 transition-custom"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          {!isSuperAdmin && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-primary hover:text-primary-hover transition-custom"
                >
                  Sign up
                </Link>
              </p>
            </div>
          )}
          
          {isSuperAdmin && (
            <div className="mt-4 p-3 bg-warning-light rounded-lg">
              <p className="text-xs text-warning-foreground">
                Demo credentials: admin@saas.com / admin123
              </p>
            </div>
          )}
          
          {!isSuperAdmin && (
            <div className="mt-4 p-3 bg-primary-light rounded-lg">
              <p className="text-xs text-primary">
                Demo: Use any email with password length &gt; 3
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;