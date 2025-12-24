import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Lock, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validatePasswordStrength } from '@/utils/password-generator';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Check if we have a valid session (from reset link)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsValidToken(true);
            } else {
                toast({
                    title: "Invalid or expired link",
                    description: "Please request a new password reset link",
                    variant: "destructive",
                });
                setTimeout(() => navigate('/forgot-password'), 2000);
            }
        });
    }, [navigate, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "Please make sure both passwords are identical",
                variant: "destructive",
            });
            return;
        }

        // Validate password strength
        const validation = validatePasswordStrength(password);
        if (!validation.isValid) {
            toast({
                title: "Weak password",
                description: validation.message,
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            toast({
                title: "Password updated!",
                description: "Your password has been successfully reset",
            });

            // Sign out and redirect to login
            await supabase.auth.signOut();
            setTimeout(() => navigate('/admin'), 1500);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to reset password",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isValidToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    const passwordValidation = password ? validatePasswordStrength(password) : null;

    return (
        <>
            <Helmet>
                <title>Reset Password - Zervitra</title>
                <meta name="description" content="Set your new Zervitra account password" />
            </Helmet>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Lock className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
                            <p className="text-muted-foreground mt-2 text-center">
                                Enter your new password below
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 pr-10"
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
                                {passwordValidation && (
                                    <p className={`text-xs ${passwordValidation.isValid ? 'text-green-600' : 'text-destructive'}`}>
                                        {passwordValidation.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="h-11 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-xs text-destructive">Passwords don't match</p>
                                )}
                                {confirmPassword && password === confirmPassword && (
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Passwords match
                                    </p>
                                )}
                            </div>

                            <Alert>
                                <AlertDescription className="text-sm">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>At least 8 characters long</li>
                                        <li>Include uppercase and lowercase letters</li>
                                        <li>Include numbers and symbols</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>

                            <Button
                                type="submit"
                                disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                                className="w-full h-11"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default ResetPassword;
