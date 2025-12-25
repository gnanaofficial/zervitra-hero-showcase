import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/payments';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

interface PaymentSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
}

interface InvoiceDetails {
  invoice_id: string;
  amount: number;
  total: number;
  currency: string;
  status: string;
  due_date: string;
  payment_method: string;
  payment_id: string;
  created_at: string;
  clients: {
    company_name: string;
    contact_email: string;
  };
  projects: {
    title: string;
  };
}

const PaymentSuccessDialog = ({ open, onClose, invoiceId }: PaymentSuccessDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const { toast } = useToast();

  // Fetch invoice details when dialog opens
  useEffect(() => {
    if (open && invoiceId) {
      fetchInvoiceDetails();
    }
  }, [open, invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (company_name, contact_email),
          projects (title)
        `)
        .eq('id', invoiceId)
        .single();

      if (error) throw error;
      setInvoice(data as unknown as InvoiceDetails);
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
    }
  };

  const generateReceipt = async () => {
    setLoading(true);
    try {
      // Fetch latest invoice data
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (company_name, contact_email, address, city, state, country),
          projects (title)
        `)
        .eq('id', invoiceId)
        .single();

      if (error) throw error;

      const invoiceData = data as any;
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Header
      pdf.setFillColor(99, 102, 241);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PAYMENT RECEIPT', pageWidth / 2, 25, { align: 'center' });
      
      // Success Badge
      pdf.setFillColor(34, 197, 94);
      pdf.roundedRect(pageWidth / 2 - 30, 45, 60, 12, 3, 3, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text('PAYMENT SUCCESSFUL', pageWidth / 2, 53, { align: 'center' });
      
      // Invoice Details
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      let y = 75;
      const leftCol = 20;
      const rightCol = 110;
      
      // Invoice Info
      pdf.setFont('helvetica', 'bold');
      pdf.text('Invoice Number:', leftCol, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(invoiceData.invoice_id || invoiceId, rightCol, y);
      
      y += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Payment Date:', leftCol, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(format(new Date(), 'MMM d, yyyy'), rightCol, y);
      
      y += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Payment Method:', leftCol, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(invoiceData.payment_method?.toUpperCase() || 'Card', rightCol, y);
      
      y += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Transaction ID:', leftCol, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(invoiceData.payment_id || 'N/A', rightCol, y);
      pdf.setFontSize(12);
      
      // Divider
      y += 15;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(leftCol, y, pageWidth - leftCol, y);
      
      // Client Info
      y += 15;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Billed To:', leftCol, y);
      pdf.setFont('helvetica', 'normal');
      y += 8;
      pdf.text(invoiceData.clients?.company_name || 'Client', leftCol, y);
      y += 6;
      pdf.setFontSize(10);
      pdf.text(invoiceData.clients?.contact_email || '', leftCol, y);
      pdf.setFontSize(12);
      
      // Project
      y += 15;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Project:', leftCol, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(invoiceData.projects?.title || 'N/A', rightCol, y);
      
      // Amount Box
      y += 25;
      pdf.setFillColor(249, 250, 251);
      pdf.roundedRect(leftCol, y, pageWidth - 2 * leftCol, 30, 3, 3, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Amount Paid', leftCol + 10, y + 12);
      
      pdf.setFontSize(20);
      pdf.setTextColor(34, 197, 94);
      const amountPaid = invoiceData.total || invoiceData.amount;
      pdf.text(formatCurrency(amountPaid, invoiceData.currency || 'USD'), pageWidth - leftCol - 10, y + 20, { align: 'right' });
      
      // Footer
      pdf.setTextColor(128, 128, 128);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Thank you for your payment!', pageWidth / 2, 250, { align: 'center' });
      pdf.text('Zervitra - Professional Services', pageWidth / 2, 258, { align: 'center' });
      
      // Save PDF
      pdf.save(`Receipt_${invoiceData.invoice_id || invoiceId}.pdf`);
      
      toast({
        title: "Receipt Downloaded",
        description: "Your payment receipt has been downloaded successfully."
      });
    } catch (error) {
      console.error('Failed to generate receipt:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate receipt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-2xl text-center">Payment Successful!</DialogTitle>
          <DialogDescription className="text-center">
            Your payment has been processed successfully. You can download your receipt below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <Button 
            onClick={generateReceipt} 
            className="w-full" 
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download Receipt
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="w-full"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessDialog;
