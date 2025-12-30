import { useState, useRef } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, CheckCircle, XCircle, ExternalLink, Calendar, Clock, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/payments";
import { QuotationAcceptanceFlow } from "./QuotationAcceptanceFlow";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
interface QuotationService {
  description: string;
  amount: number;
  price?: number;
  discount?: number;
  isFree?: boolean;
}

interface Quotation {
  id: string;
  quotation_id: string | null;
  amount: number;
  currency: string | null;
  status: string;
  created_at: string;
  valid_until: string | null;
  services: QuotationService[] | null;
  notes: string | null;
  pdf_url: string | null;
  discount_percent: number | null;
  tax_percent: number | null;
  projects?: {
    id: string;
    title: string;
  } | null;
}

interface QuotationDetailDialogProps {
  quotation: Quotation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: () => void;
  clientName: string;
  clientEmail: string;
}

export const QuotationDetailDialog = ({
  quotation,
  open,
  onOpenChange,
  onStatusUpdate,
  clientName,
  clientEmail
}: QuotationDetailDialogProps) => {
  const { toast } = useToast();
  const [showAcceptanceFlow, setShowAcceptanceFlow] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  if (!quotation) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'sent': return 'outline';
      case 'pending': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'sent': return 'Pending';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const canAcceptReject = quotation.status === 'sent' || quotation.status === 'pending';

  const handleAccept = () => {
    setShowAcceptanceFlow(true);
  };

  const handleAcceptanceComplete = () => {
    setShowAcceptanceFlow(false);
    onStatusUpdate();
    onOpenChange(false);
  };

  const handleDownloadPdf = async () => {
    if (quotation.pdf_url) {
      window.open(quotation.pdf_url, '_blank');
      return;
    }
    
    // Generate PDF on-the-fly
    setIsGeneratingPdf(true);
    try {
      await generateAndDownloadPdf();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "PDF Generation Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const generateAndDownloadPdf = async () => {
    if (!pdfContentRef.current) return;
    
    const canvas = await html2canvas(pdfContentRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 10;
    
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
    
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    
    pdf.save(`Quotation-${quotation.quotation_id || quotation.id}.pdf`);
    
    toast({
      title: "PDF Downloaded",
      description: "Quotation PDF has been generated and downloaded."
    });
  };

  const isExpired = quotation.valid_until && new Date(quotation.valid_until) < new Date();

  return (
    <>
      <Dialog open={open && !showAcceptanceFlow} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Quotation Details</span>
              <Badge variant={getStatusBadgeVariant(quotation.status)} className="capitalize">
                {getStatusLabel(quotation.status)}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Review the details of this quotation for {quotation.projects?.title || 'your project'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Brief Description */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <p className="text-sm text-muted-foreground">
                This quotation outlines the proposed services and pricing for your project. 
                {canAcceptReject && !isExpired && (
                  <span className="text-foreground"> Review the details below and accept or reject to proceed.</span>
                )}
                {isExpired && (
                  <span className="text-destructive"> This quotation has expired. Please contact us for a new quote.</span>
                )}
                {quotation.status === 'accepted' && (
                  <span className="text-green-600"> You have accepted this quotation. An invoice will be sent shortly.</span>
                )}
                {quotation.status === 'rejected' && (
                  <span className="text-destructive"> You have declined this quotation.</span>
                )}
              </p>
            </div>

            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Quotation ID</p>
                <p className="font-mono font-semibold text-primary">
                  {quotation.quotation_id || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Project</p>
                <p className="font-semibold">{quotation.projects?.title || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date Created</p>
                  <p className="font-medium">
                    {format(new Date(quotation.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Valid Until</p>
                  <p className={`font-medium ${isExpired ? 'text-destructive' : ''}`}>
                    {quotation.valid_until
                      ? format(new Date(quotation.valid_until), 'MMM dd, yyyy')
                      : 'N/A'}
                    {isExpired && ' (Expired)'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Services */}
            {quotation.services && quotation.services.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Services Included</h4>
                <div className="space-y-2">
                  {quotation.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                    >
                      <span>{service.description}</span>
                      <span className="font-medium">
                        {service.isFree ? (
                          <Badge variant="secondary">Free</Badge>
                        ) : (
                          formatCurrency(service.amount, quotation.currency)
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Total */}
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(quotation.amount, quotation.currency)}
                </span>
              </div>
              {quotation.tax_percent && quotation.tax_percent > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Includes {quotation.tax_percent}% GST
                </p>
              )}
            </div>

            {/* Notes */}
            {quotation.notes && (
              <div>
                <h4 className="font-semibold mb-2">Additional Notes</h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {quotation.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>

              {canAcceptReject && !isExpired && (
                <>
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleAccept}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Quotation
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowAcceptanceFlow(true)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Hidden PDF Content for Generation */}
          <div 
            ref={pdfContentRef} 
            className="fixed left-[-9999px] top-0 w-[800px] bg-white p-8"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            <div className="border-b-2 border-primary pb-4 mb-6">
              <h1 className="text-2xl font-bold text-primary">QUOTATION</h1>
              <p className="text-gray-600">#{quotation.quotation_id || quotation.id}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">From:</h3>
                <p className="text-gray-600">Zervitra</p>
                <p className="text-gray-600">contact@zervitra.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">To:</h3>
                <p className="text-gray-600">{clientName}</p>
                <p className="text-gray-600">{clientEmail}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div><span className="text-gray-500">Project:</span> {quotation.projects?.title || 'N/A'}</div>
              <div><span className="text-gray-500">Date:</span> {format(new Date(quotation.created_at), 'MMM dd, yyyy')}</div>
              <div><span className="text-gray-500">Valid Until:</span> {quotation.valid_until ? format(new Date(quotation.valid_until), 'MMM dd, yyyy') : 'N/A'}</div>
              <div><span className="text-gray-500">Status:</span> {getStatusLabel(quotation.status)}</div>
            </div>
            
            {quotation.services && quotation.services.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Services:</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2">
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.services.map((service, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{service.description}</td>
                        <td className="text-right py-2">
                          {service.isFree ? 'Free' : formatCurrency(service.amount, quotation.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="border-t-2 pt-4 text-right">
              <p className="text-xl font-bold text-primary">
                Total: {formatCurrency(quotation.amount, quotation.currency)}
              </p>
              {quotation.tax_percent && quotation.tax_percent > 0 && (
                <p className="text-sm text-gray-500">Includes {quotation.tax_percent}% GST</p>
              )}
            </div>
            
            {quotation.notes && (
              <div className="mt-6 p-4 bg-gray-100 rounded">
                <h4 className="font-semibold text-gray-800 mb-2">Notes:</h4>
                <p className="text-sm text-gray-600">{quotation.notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Acceptance Flow */}
      {showAcceptanceFlow && quotation && (
        <QuotationAcceptanceFlow
          quotation={quotation}
          open={showAcceptanceFlow}
          onOpenChange={setShowAcceptanceFlow}
          onComplete={handleAcceptanceComplete}
          clientName={clientName}
          clientEmail={clientEmail}
        />
      )}
    </>
  );
};
