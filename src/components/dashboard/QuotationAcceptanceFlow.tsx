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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignaturePad } from "@/components/ui/SignaturePad";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle, ArrowRight, ArrowLeft } from "lucide-react";

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

type FlowStep = "action" | "terms" | "signature" | "rejection";

const termsAndConditions = `
## Terms & Conditions

### 1. Scope of Work
The services outlined in this quotation represent the complete scope of work to be delivered. Any additional requirements or changes to the scope will be subject to a revised quotation.

### 2. Payment Terms
- **Advance Payment**: 50-67% of the total amount is required before project commencement.
- **Final Payment**: Remaining balance is due upon project completion and before final delivery.
- **Payment Methods**: Bank transfer, Stripe, or Razorpay.

### 3. Project Timeline
- Project timelines will be mutually agreed upon after quotation acceptance.
- Delays caused by client feedback or content provision may extend the timeline.

### 4. Intellectual Property
- Upon full payment, all deliverables become the property of the client.
- Source files and assets will be transferred upon request after final payment.

### 5. Revisions
- This quotation includes a reasonable number of revisions as discussed.
- Extensive changes beyond the original scope may incur additional charges.

### 6. Confidentiality
Both parties agree to keep all project-related information confidential.

### 7. Cancellation
- Cancellation requests must be made in writing.
- Advance payments are non-refundable for work already completed.

### 8. Warranty
We provide a 30-day warranty for bug fixes after project completion.

---

## Rules & Regulations

1. Communication should be professional and timely.
2. All feedback should be consolidated to ensure efficient revisions.
3. Content and materials should be provided within agreed timelines.
4. Testing and approvals should be completed within the specified review periods.

---

By accepting this quotation, you agree to the above terms and conditions.
`;

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
    setStep("terms");
  };

  const handleReject = () => {
    setStep("rejection");
  };

  const handleTermsNext = () => {
    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive"
      });
      return;
    }
    setStep("signature");
  };

  const handleSignatureSubmit = async () => {
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
      const { error: emailError } = await supabase.functions.invoke('send-quotation-acceptance-email', {
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

      if (emailError) {
        console.error("Email notification error:", emailError);
        // Don't fail the whole process for email error
      }

      toast({
        title: "Quotation Accepted",
        description: "Thank you! Your acceptance has been recorded and the team has been notified."
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
      <DialogContent className="max-w-2xl max-h-[90vh]">
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

        {/* Step: Terms & Conditions */}
        {step === "terms" && (
          <>
            <DialogHeader>
              <DialogTitle>Terms & Conditions</DialogTitle>
              <DialogDescription>
                Please review and accept the terms to proceed
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              <div className="prose prose-sm dark:prose-invert">
                <div dangerouslySetInnerHTML={{ 
                  __html: termsAndConditions.replace(/\n/g, '<br/>').replace(/## /g, '<h2>').replace(/### /g, '<h3>') 
                }} />
              </div>
            </ScrollArea>
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm">
                I have read and agree to the Terms & Conditions and Rules & Regulations
              </Label>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("action")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleTermsNext} disabled={!termsAccepted}>
                Continue to Signature
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}

        {/* Step: Signature */}
        {step === "signature" && (
          <>
            <DialogHeader>
              <DialogTitle>Digital Signature</DialogTitle>
              <DialogDescription>
                Please provide your signature to confirm acceptance
              </DialogDescription>
            </DialogHeader>
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
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("terms")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSignatureSubmit}
                disabled={isSubmitting || (signatureType === "draw" && !drawnSignature) || (signatureType === "type" && !typedName.trim())}
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
