import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      <Helmet>
        <title>Login - Zervitra</title>
        <meta name="description" content="Sign in to access your Zervitra dashboard" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <img
              src="/src/Resources/logo/zervimain.svg"
              alt="Zervitra Logo"
              className="h-14 w-auto mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome to Zervitra
            </h1>
            <p className="text-muted-foreground">
              Choose your login type to continue
            </p>
          </div>

          <div className="premium-glass rounded-3xl p-8 border border-white/10 space-y-4">
            {/* Admin Login */}
            <Button
              onClick={() => navigate('/admin-login')}
              className="w-full h-20 text-lg flex items-center justify-center gap-3 bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground border-2 border-destructive/30 hover:border-destructive"
              variant="outline"
            >
              <Shield className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold">Admin Login</div>
                <div className="text-xs opacity-70">For administrators only</div>
              </div>
            </Button>

            {/* User/Client Login */}
            <Button
              onClick={() => navigate('/user-login')}
              className="w-full h-20 text-lg flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground border-2 border-primary/30 hover:border-primary"
              variant="outline"
            >
              <User className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold">Client Login</div>
                <div className="text-xs opacity-70">For clients and users</div>
              </div>
            </Button>

            <div className="pt-4 text-center">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;