import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { CreditCard, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAvailablePaymentProviders, 
  processStripePayment, 
  processRazorpayPayment,
  formatCurrency
} from '@/lib/payments';

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

  if (providers.length === 0) {
    return (
      <Button disabled variant="outline" size="sm">
        <CreditCard className="w-4 h-4 mr-2" />
        Payment Not Available
      </Button>
    );
  }

  if (providers.length === 1) {
    return (
      <Button
        onClick={() => handlePayment(providers[0].id)}
        disabled={disabled || loading}
        size="sm"
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        {loading ? 'Processing...' : `Pay ${formatCurrency(amount, currency)}`}
      </Button>
    );
  }

  return (
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
      <DropdownMenuContent align="end">
        {providers.map((provider) => (
          <DropdownMenuItem
            key={provider.id}
            onClick={() => handlePayment(provider.id)}
          >
            Pay with {provider.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PaymentButton;