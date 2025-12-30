import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  CreditCard, 
  Building2,
  QrCode,
  ExternalLink
} from "lucide-react";
import { formatCurrency } from "@/lib/payments";
import PaymentButton from "@/components/PaymentButton";
import PaymentVerificationForm from "@/components/PaymentVerificationForm";
import BankDetailsCard from "@/components/BankDetailsCard";

interface InvoiceService {
  description: string;
  amount: number;
  price?: number;
  discount?: number;
  isFree?: boolean;
}

interface Invoice {
  id: string;
  invoice_id: string | null;
  amount: number;
  total?: number;
  currency: string | null;
  status: string;
  created_at: string;
  due_date: string;
  services?: InvoiceService[] | null;
  notes: string | null;
  tax?: number | null;
  tax_percent?: number | null;
  discount_percent?: number | null;
  client_id: string;
  projects?: {
    id: string;
    title: string;
  } | null;
}

interface InvoiceDetailDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess?: () => void;
}

export const InvoiceDetailDialog = ({
  invoice,
  open,
  onOpenChange,
  onPaymentSuccess
}: InvoiceDetailDialogProps) => {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showPaymentVerification, setShowPaymentVerification] = useState(false);

  if (!invoice) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'sent': case 'pending': return 'outline';
      case 'overdue': return 'destructive';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  const canPay = invoice.status === 'sent' || invoice.status === 'pending' || invoice.status === 'overdue';
  const totalAmount = invoice.total || invoice.amount;

  const handleBankPaymentClick = () => {
    setShowBankDetails(true);
  };

  const handlePaymentVerificationClick = () => {
    setShowPaymentVerification(true);
  };

  const handleVerificationSuccess = () => {
    setShowPaymentVerification(false);
    setShowBankDetails(false);
    onPaymentSuccess?.();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !showPaymentVerification} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Invoice Details</span>
              <Badge variant={getStatusBadgeVariant(invoice.status)} className="capitalize">
                {invoice.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Invoice ID</p>
                <p className="font-mono font-semibold text-primary">
                  {invoice.invoice_id || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Project</p>
                <p className="font-semibold">{invoice.projects?.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Created</p>
                <p className="font-medium">
                  {format(new Date(invoice.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className={`font-medium ${
                  new Date(invoice.due_date) < new Date() && invoice.status !== 'paid' 
                    ? 'text-destructive' 
                    : ''
                }`}>
                  {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            <Separator />

            {/* Services */}
            {invoice.services && invoice.services.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Services</h4>
                <div className="space-y-2">
                  {invoice.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                    >
                      <span>{service.description}</span>
                      <span className="font-medium">
                        {service.isFree ? (
                          <Badge variant="secondary">Free</Badge>
                        ) : (
                          formatCurrency(service.amount, invoice.currency)
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tax Info */}
            {invoice.tax_percent && invoice.tax_percent > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">GST ({invoice.tax_percent}%)</span>
                <span>{formatCurrency(invoice.tax || 0, invoice.currency)}</span>
              </div>
            )}

            <Separator />

            {/* Total */}
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(totalAmount, invoice.currency)}
                </span>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div>
                <h4 className="font-semibold mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {invoice.notes}
                </p>
              </div>
            )}

            {/* Bank Details Section */}
            {showBankDetails && (
              <div className="space-y-4">
                <Separator />
                <BankDetailsCard />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBankDetails(false)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handlePaymentVerificationClick}
                    className="flex-1"
                  >
                    I've Made the Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Actions */}
            {!showBankDetails && (
              <div className="flex flex-wrap gap-3 pt-4">
                {canPay && (
                  <>
                    <PaymentButton
                      invoiceId={invoice.id}
                      clientId={invoice.client_id}
                      amount={totalAmount}
                      currency={invoice.currency}
                      onPaymentSuccess={() => {
                        onPaymentSuccess?.();
                        onOpenChange(false);
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={handleBankPaymentClick}
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Bank/UPI Transfer
                    </Button>
                  </>
                )}

                {invoice.status === 'paid' && (
                  <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30 px-4 py-2">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Complete
                  </Badge>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Verification Form */}
      {showPaymentVerification && invoice && (
        <Dialog open={showPaymentVerification} onOpenChange={setShowPaymentVerification}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Payment Verification</DialogTitle>
            </DialogHeader>
            <PaymentVerificationForm
              invoiceId={invoice.id}
              clientId={invoice.client_id}
              amount={totalAmount}
              onSuccess={handleVerificationSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
