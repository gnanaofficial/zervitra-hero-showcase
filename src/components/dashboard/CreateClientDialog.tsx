import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Plus, Building2, Mail, Phone, MapPin, Globe, Eye, EyeOff, Key, Copy, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generatePassword, validatePasswordStrength } from "@/utils/password-generator";

interface CreateClientFormData {
    company_name: string;
    contact_email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    password: string;
}

interface CreateClientDialogProps {
    onSuccess?: () => void;
}

export function CreateClientDialog({ onSuccess }: CreateClientDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [autoGeneratePassword, setAutoGeneratePassword] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [passwordCopied, setPasswordCopied] = useState(false);
    const [createdClientEmail, setCreatedClientEmail] = useState("");
    const { user } = useAuth();
    const { toast } = useToast();
    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<CreateClientFormData>();

    const password = watch("password");

    const handleAutoGenerateToggle = (checked: boolean) => {
        setAutoGeneratePassword(checked);
        if (checked) {
            const newPassword = generatePassword(12);
            setValue("password", newPassword);
            setGeneratedPassword(newPassword);
        } else {
            setValue("password", "");
            setGeneratedPassword("");
        }
    };

    const handleCopyPassword = () => {
        if (generatedPassword) {
            navigator.clipboard.writeText(generatedPassword);
            setPasswordCopied(true);
            toast({
                title: "Copied!",
                description: "Password copied to clipboard",
            });
            setTimeout(() => setPasswordCopied(false), 2000);
        }
    };

    const onSubmit = async (data: CreateClientFormData) => {
        if (!user) return;

        // Validate password
        const passwordValidation = validatePasswordStrength(data.password);
        if (!passwordValidation.isValid) {
            toast({
                title: "Weak Password",
                description: passwordValidation.message,
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            // Use edge function to create client (secure - no service role key in frontend)
            const { data: result, error } = await supabase.functions.invoke('create-client', {
                body: {
                    email: data.contact_email,
                    password: data.password,
                    companyName: data.company_name,
                    phone: data.phone || null,
                    address: data.address || null,
                    city: data.city || null,
                    state: data.state || null,
                    zip: data.zip || null,
                    country: data.country || 'IND',
                    projectCode: 'E',
                    platformCode: 'W',
                },
            });

            if (error) throw error;
            if (result?.error) throw new Error(result.error);

            // Store the generated password and email for display
            setGeneratedPassword(data.password);
            setCreatedClientEmail(data.contact_email);

            toast({
                title: "Success",
                description: `Client created successfully! Client ID: ${result?.clientId || 'Generated'}`,
            });

            reset();
            onSuccess?.();
        } catch (error: any) {
            console.error('Client creation error:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to create client",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDialogClose = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Reset all state when closing
            reset();
            setGeneratedPassword("");
            setCreatedClientEmail("");
            setPasswordCopied(false);
            setAutoGeneratePassword(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="w-5 h-5" />
                    Add Client
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                        Create a new client profile with login credentials. The client will receive an email with their access details.
                    </DialogDescription>
                </DialogHeader>

                {generatedPassword && createdClientEmail && (
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            <div className="space-y-2">
                                <p className="font-semibold">Client Created Successfully!</p>
                                <div className="bg-white p-3 rounded border border-green-200">
                                    <p className="text-sm"><strong>Email:</strong> {createdClientEmail}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <p className="text-sm"><strong>Password:</strong></p>
                                        <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">{generatedPassword}</code>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={handleCopyPassword}
                                        >
                                            {passwordCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-xs text-green-700 mt-2">
                                    ⚠️ Save these credentials now. The password won't be shown again.
                                </p>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Company Name */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="company_name" className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                Company Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="company_name"
                                placeholder="Acme Corp"
                                {...register("company_name", { required: "Company name is required" })}
                                className={errors.company_name ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.company_name && (
                                <p className="text-sm text-destructive">{errors.company_name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="contact_email" className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                Contact Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="contact_email"
                                type="email"
                                placeholder="contact@acme.com"
                                {...register("contact_email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className={errors.contact_email ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.contact_email && (
                                <p className="text-sm text-destructive">{errors.contact_email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                placeholder="+1 (555) 000-0000"
                                {...register("phone")}
                            />
                        </div>

                        {/* Password Section */}
                        <div className="space-y-3 md:col-span-2 border-t pt-4">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2">
                                    <Key className="w-4 h-4 text-muted-foreground" />
                                    Login Password <span className="text-destructive">*</span>
                                </Label>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="auto-generate"
                                        checked={autoGeneratePassword}
                                        onCheckedChange={handleAutoGenerateToggle}
                                    />
                                    <label
                                        htmlFor="auto-generate"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Auto-generate secure password
                                    </label>
                                </div>
                            </div>

                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={autoGeneratePassword ? "Password will be auto-generated" : "Enter password (min 8 characters)"}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters"
                                        }
                                    })}
                                    readOnly={autoGeneratePassword}
                                    className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                            {password && !autoGeneratePassword && (
                                <p className="text-xs text-muted-foreground">
                                    Strength: {validatePasswordStrength(password).strength}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address" className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                Address
                            </Label>
                            <Textarea
                                id="address"
                                placeholder="123 Business Blvd"
                                className="min-h-[80px]"
                                {...register("address")}
                            />
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                placeholder="New York"
                                {...register("city")}
                            />
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                            <Label htmlFor="state">State / Province</Label>
                            <Input
                                id="state"
                                placeholder="NY"
                                {...register("state")}
                            />
                        </div>

                        {/* Zip/Postal Code */}
                        <div className="space-y-2">
                            <Label htmlFor="zip">Zip / Postal Code</Label>
                            <Input
                                id="zip"
                                placeholder="10001"
                                {...register("zip")}
                            />
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                            <Label htmlFor="country" className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                Country
                            </Label>
                            <Input
                                id="country"
                                placeholder="United States"
                                {...register("country")}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleDialogClose(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="gap-2">
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Create Client Account
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
