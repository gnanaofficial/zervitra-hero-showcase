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
import { CreditCard, ChevronDown, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAvailablePaymentProviders, 
  processStripePayment, 
  processRazorpayPayment,
  formatCurrency
} from '@/lib/payments';
import BankDetailsCard from '@/components/BankDetailsCard';

interface PaymentButtonProps {
  invoiceId: string;
  amount: number;
  currency?: string;
  onPaymentSuccess?: () => void;
  disabled?: boolean;
}

const PaymentButton = ({ 
  invoiceId, 
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
        onPaymentSuccess?.();
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bank Transfer Details</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Transfer <span className="font-semibold text-foreground">{formatCurrency(amount, currency)}</span> to the following account:
            </p>
            <BankDetailsCard invoiceId={invoiceId} amount={amount} />
            <p className="text-xs text-muted-foreground mt-4">
              After completing the transfer, please send the payment confirmation to our support team.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentButton;