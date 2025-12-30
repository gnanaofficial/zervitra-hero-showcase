import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { SignaturePad } from "@/components/ui/SignaturePad";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle, ArrowLeft, ExternalLink } from "lucide-react";

interface Quotation {
  id: string;
  quotation_id: string | null;
  amount: number;
  currency: string | null;
  projects?: {
    id: string;
    title: string;
  } | null;
}

interface QuotationAcceptanceFlowProps {
  quotation: Quotation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  clientName: string;
  clientEmail: string;
}

type FlowStep = "action" | "signature" | "rejection";

export const QuotationAcceptanceFlow = ({
  quotation,
  open,
  onOpenChange,
  onComplete,
  clientName,
  clientEmail
}: QuotationAcceptanceFlowProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<FlowStep>("action");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Signature state
  const [signatureType, setSignatureType] = useState<"draw" | "type">("draw");
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);
  const [typedName, setTypedName] = useState("");
  
  // Rejection state
  const [rejectionReason, setRejectionReason] = useState("");

  const handleAccept = () => {
    setStep("signature");
  };

  const handleReject = () => {
    setStep("rejection");
  };

  const openTermsAndConditions = () => {
    window.open('/legal/terms-and-conditions', '_blank');
  };

  const handleSignatureSubmit = async () => {
    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive"
      });
      return;
    }

    const signatureName = signatureType === "type" ? typedName : clientName;
    
    if (signatureType === "draw" && !drawnSignature) {
      toast({
        title: "Signature Required",
        description: "Please provide your signature to accept the quotation.",
        variant: "destructive"
      });
      return;
    }
    
    if (signatureType === "type" && !typedName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to accept the quotation.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Update quotation status
      const { error: updateError } = await supabase
        .from('quotations')
        .update({ status: 'accepted' })
        .eq('id', quotation.id);

      if (updateError) throw updateError;

      // Send notification email to admin
      const { error: adminEmailError } = await supabase.functions.invoke('send-quotation-acceptance-email', {
        body: {
          clientName,
          clientEmail,
          quotationId: quotation.quotation_id,
          amount: quotation.amount.toLocaleString(),
          currency: quotation.currency || 'USD',
          projectTitle: quotation.projects?.title || 'Project',
          signatureName,
          signatureType: signatureType === "draw" ? "drawn" : "typed",
          acceptedAt: format(new Date(), 'PPpp'),
          action: 'accepted'
        }
      });

      if (adminEmailError) {
        console.error("Admin email notification error:", adminEmailError);
      }

      // Send confirmation email to client with next steps
      const { error: clientEmailError } = await supabase.functions.invoke('send-client-quotation-notification', {
        body: {
          clientName,
          clientEmail,
          quotationId: quotation.quotation_id,
          amount: quotation.amount.toLocaleString(),
          currency: quotation.currency || 'USD',
          projectTitle: quotation.projects?.title || 'Project',
          action: 'accepted'
        }
      });

      if (clientEmailError) {
        console.error("Client email notification error:", clientEmailError);
      }

      toast({
        title: "Quotation Accepted",
        description: "Thank you! Your acceptance has been recorded. Check your email for next steps."
      });

      onComplete();
    } catch (error: any) {
      console.error("Error accepting quotation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept quotation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectionSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Update quotation status
      const { error: updateError } = await supabase
        .from('quotations')
        .update({ status: 'rejected' })
        .eq('id', quotation.id);

      if (updateError) throw updateError;

      // Send notification email to admin
      await supabase.functions.invoke('send-quotation-acceptance-email', {
        body: {
          clientName,
          clientEmail,
          quotationId: quotation.quotation_id,
          amount: quotation.amount.toLocaleString(),
          currency: quotation.currency || 'USD',
          projectTitle: quotation.projects?.title || 'Project',
          signatureName: clientName,
          signatureType: 'typed',
          acceptedAt: format(new Date(), 'PPpp'),
          action: 'rejected',
          rejectionReason
        }
      });

      // Send confirmation email to client
      await supabase.functions.invoke('send-client-quotation-notification', {
        body: {
          clientName,
          clientEmail,
          quotationId: quotation.quotation_id,
          amount: quotation.amount.toLocaleString(),
          currency: quotation.currency || 'USD',
          projectTitle: quotation.projects?.title || 'Project',
          action: 'rejected'
        }
      });

      toast({
        title: "Quotation Rejected",
        description: "Your response has been recorded. The team has been notified."
      });

      onComplete();
    } catch (error: any) {
      console.error("Error rejecting quotation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit rejection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Step: Action Selection */}
        {step === "action" && (
          <>
            <DialogHeader>
              <DialogTitle>Quotation Response</DialogTitle>
              <DialogDescription>
                Quotation {quotation.quotation_id} for {quotation.projects?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-6">
              <p className="text-center text-muted-foreground mb-4">
                Please select your response to this quotation:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="h-24 bg-green-600 hover:bg-green-700 flex flex-col gap-2"
                  onClick={handleAccept}
                >
                  <CheckCircle className="w-8 h-8" />
                  <span>Accept Quotation</span>
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  className="h-24 flex flex-col gap-2"
                  onClick={handleReject}
                >
                  <XCircle className="w-8 h-8" />
                  <span>Reject Quotation</span>
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Step: Signature with T&C Link */}
        {step === "signature" && (
          <>
            <DialogHeader>
              <DialogTitle>Accept Quotation</DialogTitle>
              <DialogDescription>
                Provide your digital signature to confirm acceptance
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Signature Section */}
              <Tabs value={signatureType} onValueChange={(v) => setSignatureType(v as "draw" | "type")} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="draw">Draw Signature</TabsTrigger>
                  <TabsTrigger value="type">Type Name</TabsTrigger>
                </TabsList>
                <TabsContent value="draw" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Use your mouse or finger to draw your signature below:
                    </p>
                    <SignaturePad
                      onSave={(dataUrl) => setDrawnSignature(dataUrl)}
                      initialData={drawnSignature}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="type" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enter your full name to use as your signature:
                    </p>
                    <Input
                      placeholder="Enter your full name"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      className="text-lg"
                    />
                    {typedName && (
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                        <p className="text-3xl font-signature text-foreground">
                          {typedName}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Terms and Conditions Checkbox with Link */}
              <div className="border-t pt-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I have read and agree to the{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          openTermsAndConditions();
                        }}
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Terms & Conditions
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      {" "}and Rules & Regulations
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      By accepting, you agree to the payment terms and project scope outlined in this quotation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("action")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSignatureSubmit}
                disabled={isSubmitting || !termsAccepted || (signatureType === "draw" && !drawnSignature) || (signatureType === "type" && !typedName.trim())}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Acceptance
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {/* Step: Rejection */}
        {step === "rejection" && (
          <>
            <DialogHeader>
              <DialogTitle>Reject Quotation</DialogTitle>
              <DialogDescription>
                Please let us know why you're declining this quotation (optional)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Enter your reason for rejection (optional)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Your feedback helps us improve our services and offerings.
              </p>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("action")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectionSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Confirm Rejection
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
