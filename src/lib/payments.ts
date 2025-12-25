// Payment service utilities for Stripe and Razorpay
import { supabase } from '@/integrations/supabase/client';

// Publishable keys (safe to expose in frontend)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RL05dAd97NChG5dLdJi9RQmrXqjc5l3QdCbSqj4LuvQcmLCnL1qZOPJ8JCOJlK5xgvjPKOiQZoPlTq4OKs0cLpU00QbE3xjXw';
const RAZORPAY_KEY_ID = 'rzp_test_1234567890'; // Replace with your actual test key

export interface PaymentProvider {
  id: 'stripe' | 'razorpay';
  name: string;
  enabled: boolean;
}

export const getAvailablePaymentProviders = (): PaymentProvider[] => {
  const providers: PaymentProvider[] = [
    {
      id: 'stripe',
      name: 'Stripe (Card)',
      enabled: !!STRIPE_PUBLISHABLE_KEY
    },
    {
      id: 'razorpay',
      name: 'Razorpay (UPI/Card)',
      enabled: !!RAZORPAY_KEY_ID
    }
  ];

  return providers.filter(p => p.enabled);
};

export const processStripePayment = async (invoiceId: string, amount: number, currency: string = 'USD') => {
  try {
    // Create checkout session via Supabase edge function
    const { data, error } = await supabase.functions.invoke('create-stripe-payment', {
      body: { invoiceId, amount, currency }
    });

    if (error) throw error;

    // Redirect to Stripe checkout URL
    if (data.url) {
      window.location.href = data.url;
      return { success: true };
    }

    // Fallback to redirectToCheckout if URL not provided
    const stripe = await loadStripe();
    if (!stripe) throw new Error('Stripe failed to load');

    const result = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Stripe payment error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Payment failed' 
    };
  }
};

export const processRazorpayPayment = async (invoiceId: string, amount: number, currency: string = 'INR') => {
  try {
    // Create Razorpay order via Supabase edge function
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { invoiceId, amount, currency }
    });

    if (error) throw error;

    // Load Razorpay script dynamically
    await loadRazorpayScript();

    return new Promise((resolve, reject) => {
      const options = {
        key: data.keyId || RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Zervitra',
        description: `Payment for Invoice ${invoiceId}`,
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment via Supabase edge function
            const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                invoiceId,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              }
            });

            if (verifyError) {
              reject(new Error('Payment verification failed'));
              return;
            }

            // Payment successful - reload to show updated status
            window.location.href = window.location.origin + '/client-dashboard?payment=success&invoice=' + invoiceId;
            resolve({ success: true });
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () => {
            resolve({ success: false, error: 'Payment cancelled' });
          }
        },
        theme: {
          color: '#6366f1'
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    });
  } catch (error) {
    console.error('Razorpay payment error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Payment failed' 
    };
  }
};

// Helper functions
const loadStripe = async () => {
  if (!(window as any).Stripe) {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    document.head.appendChild(script);
    
    await new Promise((resolve) => {
      script.onload = resolve;
    });
  }
  
  return (window as any).Stripe ? (window as any).Stripe(STRIPE_PUBLISHABLE_KEY) : null;
};

const loadRazorpayScript = async () => {
  if (!(window as any).Razorpay) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);
    
    await new Promise((resolve) => {
      script.onload = resolve;
    });
  }
};

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};