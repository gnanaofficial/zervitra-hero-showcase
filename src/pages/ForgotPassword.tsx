import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setEmailSent(true);
            toast({
                title: "Email sent!",
                description: "Check your inbox for password reset instructions.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send reset email",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Forgot Password - Zervitra</title>
                <meta name="description" content="Reset your Zervitra account password" />
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
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground">Forgot Password?</h1>
                            <p className="text-muted-foreground mt-2 text-center">
                                Enter your email and we'll send you a reset link
                            </p>
                        </div>

                        {emailSent ? (
                            <Alert className="bg-green-50 border-green-200">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    <p className="font-semibold mb-2">Email Sent Successfully!</p>
                                    <p className="text-sm">
                                        We've sent a password reset link to <strong>{email}</strong>.
                                        Please check your inbox and follow the instructions.
                                    </p>
                                    <p className="text-sm mt-2">
                                        Didn't receive the email? Check your spam folder or try again.
                                    </p>
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        className="h-11"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </Button>
                            </form>
                        )}

                        <div className="mt-6 text-center">
                            <Link
                                to="/admin"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to login
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default ForgotPassword;
