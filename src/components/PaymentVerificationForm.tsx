import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentVerificationFormProps {
  invoiceId: string;
  clientId: string;
  amount: number;
  onSuccess?: () => void;
}

const PaymentVerificationForm = ({ 
  invoiceId, 
  clientId, 
  amount,
  onSuccess 
}: PaymentVerificationFormProps) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentMode, setPaymentMode] = useState('upi');
  const [remarks, setRemarks] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setScreenshotFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!utrNumber.trim()) {
      toast({
        title: "UTR Required",
        description: "Please enter the UTR/Reference number",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      let screenshotUrl = null;

      // Upload screenshot if provided
      if (screenshotFile) {
        const fileExt = screenshotFile.name.split('.').pop();
        const fileName = `${invoiceId}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-screenshots')
          .upload(fileName, screenshotFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Failed to upload screenshot');
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('payment-screenshots')
          .getPublicUrl(fileName);
        
        screenshotUrl = publicUrl;
      }

      // Insert verification record
      const { error: insertError } = await supabase
        .from('payment_verifications')
        .insert({
          invoice_id: invoiceId,
          client_id: clientId,
          utr_number: utrNumber.trim(),
          payment_mode: paymentMode,
          amount: amount,
          screenshot_url: screenshotUrl,
          remarks: remarks.trim() || null,
          status: 'pending'
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Failed to submit verification');
      }

      // Update invoice status to pending_verification
      await supabase
        .from('invoices')
        .update({ 
          status: 'pending_verification',
          payment_method: paymentMode === 'upi' ? 'upi' : 'bank_transfer'
        })
        .eq('id', invoiceId);

      // Send notification email to admin
      await supabase.functions.invoke('send-payment-verification-email', {
        body: { 
          invoiceId, 
          utrNumber: utrNumber.trim(),
          paymentMode,
          amount
        }
      });

      setSubmitted(true);
      toast({
        title: "Verification Submitted",
        description: "Your payment verification has been submitted for review."
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-500/50 bg-green-500/10">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div>
              <h3 className="font-semibold text-lg">Verification Submitted!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We'll review your payment and update the invoice status shortly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Submit Payment Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Mode</Label>
            <RadioGroup value={paymentMode} onValueChange={setPaymentMode} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="cursor-pointer">UPI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank_transfer" id="bank" />
                <Label htmlFor="bank" className="cursor-pointer">Bank Transfer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neft" id="neft" />
                <Label htmlFor="neft" className="cursor-pointer">NEFT/RTGS</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="utr">UTR / Reference Number *</Label>
            <Input
              id="utr"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="Enter UTR or transaction reference number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Payment Screenshot</Label>
            <div className="flex items-center gap-2">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            {screenshotFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {screenshotFile.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Additional Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Any additional information about the payment"
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit Verification
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentVerificationForm;
