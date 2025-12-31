import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, ChevronDown, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAvailablePaymentProviders, 
  processStripePayment, 
  processRazorpayPayment,
  formatCurrency
} from '@/lib/payments';
import BankDetailsCard from '@/components/BankDetailsCard';
import PaymentVerificationForm from '@/components/PaymentVerificationForm';

interface PaymentButtonProps {
  invoiceId: string;
  clientId: string;
  amount: number;
  currency?: string;
  onPaymentSuccess?: () => void;
  disabled?: boolean;
}

const PaymentButton = ({ 
  invoiceId, 
  clientId,
  amount, 
  currency = 'USD',
  onPaymentSuccess,
  disabled = false
}: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const { toast } = useToast();
  const providers = getAvailablePaymentProviders();

  const handlePayment = async (provider: 'stripe' | 'razorpay') => {
    try {
      setLoading(true);
      
      let result;
      // Use appropriate currency for each provider
      const paymentCurrency = provider === 'razorpay' ? 'INR' : currency;
      
      if (provider === 'stripe') {
        result = await processStripePayment(invoiceId, amount, paymentCurrency);
      } else {
        result = await processRazorpayPayment(invoiceId, amount, paymentCurrency);
      }

      if (result.success) {
        toast({
          title: "Payment initiated",
          description: "You will be redirected to complete the payment."
        });
      } else {
        toast({
          title: "Payment failed", 
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Payment error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={disabled || loading}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {loading ? 'Processing...' : `Pay ${formatCurrency(amount, currency)}`}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {providers.map((provider) => (
            <DropdownMenuItem
              key={provider.id}
              onClick={() => handlePayment(provider.id)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {provider.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowBankDetails(true)}>
            <Building2 className="w-4 h-4 mr-2" />
            Bank Transfer / UPI
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showBankDetails} onOpenChange={setShowBankDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bank Transfer / UPI Payment</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Bank Details</TabsTrigger>
              <TabsTrigger value="verify">Submit Verification</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Transfer <span className="font-semibold text-foreground">{formatCurrency(amount, currency)}</span> to the following account:
              </p>
              <BankDetailsCard invoiceId={invoiceId} amount={amount} />
              <p className="text-xs text-muted-foreground mt-4">
                After completing the transfer, go to the "Submit Verification" tab to upload proof.
              </p>
            </TabsContent>
            <TabsContent value="verify" className="mt-4">
              <PaymentVerificationForm 
                invoiceId={invoiceId}
                clientId={clientId}
                amount={amount}
                onSuccess={() => {
                  setShowBankDetails(false);
                  onPaymentSuccess?.();
                }}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentButton;