import { useState } from "react";
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
import { FileText, Download, CheckCircle, XCircle, ExternalLink, Calendar, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/payments";
import { QuotationAcceptanceFlow } from "./QuotationAcceptanceFlow";

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
  const [showAcceptanceFlow, setShowAcceptanceFlow] = useState(false);

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

  const handleDownloadPdf = () => {
    if (quotation.pdf_url) {
      window.open(quotation.pdf_url, '_blank');
    }
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
              {quotation.pdf_url && (
                <Button variant="outline" onClick={handleDownloadPdf}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              )}

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
