import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import zerviraLogo from '@/Resources/logo/zervimain.svg';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, role, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error, redirectTo } = await signIn(email, password, 'admin');
      if (!error && redirectTo) {
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Access - Zervitra</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-destructive/20 rounded-2xl shadow-lg p-8">
            <div className="flex flex-col items-center mb-8">
              <img 
                src={zerviraLogo} 
                alt="Zervitra" 
                className="h-12 w-auto mb-4"
              />
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-6 h-6 text-destructive" />
                <h1 className="text-3xl font-bold text-foreground">Admin Portal</h1>
              </div>
              <p className="text-muted-foreground text-sm">Authorized personnel only</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@zervitra.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11 border-destructive/20 focus:border-destructive"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-11 pr-10 border-destructive/20 focus:border-destructive"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="destructive"
                className="w-full h-11 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Access Admin Portal
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Back to home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;
