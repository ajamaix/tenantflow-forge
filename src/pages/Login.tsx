import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginForm from "@/components/Auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const isSuperAdmin = searchParams.get('super') === 'true';

  useEffect(() => {
    if (user) {
      if (user.role === 'super_admin') {
        navigate('/super-admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <LoginForm isSuperAdmin={isSuperAdmin} />
      </div>
    </div>
  );
};

export default Login;