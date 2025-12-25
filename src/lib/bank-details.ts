// Bank details configuration for invoice payments
export interface BankDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  upiId?: string;
}

// Company bank details for direct payments
export const COMPANY_BANK_DETAILS: BankDetails = {
  bankName: "HDFC",
  accountHolderName: "Kalapati Gnana Sekhar",
  accountNumber: "50100706409018",
  ifscCode: "HDFC0007817",
  branchName: "Mangalam Branch",
  upiId: "gnanasekharofficial-2@okaxis"
};

// Generate UPI payment link
export const generateUPILink = (amount: number, invoiceId: string): string => {
  const upiId = COMPANY_BANK_DETAILS.upiId;
  if (!upiId) return "";
  
  const params = new URLSearchParams({
    pa: upiId, // Payee address
    pn: COMPANY_BANK_DETAILS.accountHolderName, // Payee name
    am: amount.toString(), // Amount
    cu: "INR", // Currency
    tn: `Payment for Invoice ${invoiceId}` // Transaction note
  });
  
  return `upi://pay?${params.toString()}`;
};

// Format bank details for display
export const formatBankDetailsForDisplay = (): string => {
  const { bankName, accountHolderName, accountNumber, ifscCode, branchName, upiId } = COMPANY_BANK_DETAILS;
  
  let details = `Bank: ${bankName}\n`;
  details += `Account Holder: ${accountHolderName}\n`;
  details += `Account Number: ${accountNumber}\n`;
  details += `IFSC Code: ${ifscCode}\n`;
  details += `Branch: ${branchName}`;
  
  if (upiId) {
    details += `\nUPI ID: ${upiId}`;
  }
  
  return details;
};
