import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Building2, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { COMPANY_BANK_DETAILS, generateUPILink } from '@/lib/bank-details';

interface BankDetailsCardProps {
  amount?: number;
  invoiceId?: string;
  showQR?: boolean;
}

const BankDetailsCard = ({ amount, invoiceId, showQR = true }: BankDetailsCardProps) => {
  const { toast } = useToast();
  const { bankName, accountHolderName, accountNumber, ifscCode, branchName, upiId } = COMPANY_BANK_DETAILS;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const upiLink = amount && invoiceId ? generateUPILink(amount, invoiceId) : null;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-primary" />
          Bank Transfer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Bank Name</span>
            <span className="font-medium">{bankName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Account Holder</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{accountHolderName}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => copyToClipboard(accountHolderName, 'Account holder name')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Account Number</span>
            <div className="flex items-center gap-2">
              <span className="font-medium font-mono">{accountNumber}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => copyToClipboard(accountNumber, 'Account number')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">IFSC Code</span>
            <div className="flex items-center gap-2">
              <span className="font-medium font-mono">{ifscCode}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => copyToClipboard(ifscCode, 'IFSC code')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Branch</span>
            <span className="font-medium">{branchName}</span>
          </div>
          
          {upiId && (
            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <span className="text-muted-foreground">UPI ID</span>
              <div className="flex items-center gap-2">
                <span className="font-medium font-mono text-xs">{upiId}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(upiId, 'UPI ID')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {showQR && upiLink && (
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Scan to Pay</span>
            </div>
            <div className="flex justify-center p-4 bg-background rounded-lg">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`}
                alt="UPI QR Code"
                className="w-36 h-36"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Scan with any UPI app to pay ₹{amount?.toLocaleString('en-IN')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BankDetailsCard;
