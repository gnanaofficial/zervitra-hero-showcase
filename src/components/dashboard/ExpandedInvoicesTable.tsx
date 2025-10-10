import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, ArrowUpDown, FileDown } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/payments";
import PaymentButton from "@/components/PaymentButton";

interface Invoice {
  id: string;
  project_id: string;
  amount: number;
  currency: string;
  due_date: string;
  status: string;
  created_at: string;
  projects: { title: string };
}

interface ExpandedInvoicesTableProps {
  invoices: Invoice[];
  onExportCSV: () => void;
  onExportPDF: () => void;
  onPaymentSuccess: () => void;
}

export const ExpandedInvoicesTable = ({
  invoices,
  onExportCSV,
  onExportPDF,
  onPaymentSuccess,
}: ExpandedInvoicesTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"amount" | "due_date" | "status">("due_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "outline";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleSort = (field: "amount" | "due_date" | "status") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredInvoices = invoices
    .filter((invoice) => {
      const matchesSearch =
        invoice.projects?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortField === "amount") {
        return direction * (a.amount - b.amount);
      } else if (sortField === "due_date") {
        return (
          direction *
          (new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
        );
      } else if (sortField === "status") {
        return direction * a.status.localeCompare(b.status);
      }
      return 0;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search invoices"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by status">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportCSV}
            className="w-full sm:w-auto"
            aria-label="Export to CSV"
          >
            <FileDown className="w-4 h-4 mr-2" />
            CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportPDF}
            className="w-full sm:w-auto"
            aria-label="Export to PDF"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-1"
                    aria-label="Sort by amount"
                  >
                    Amount
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("due_date")}
                    className="flex items-center gap-1"
                    aria-label="Sort by due date"
                  >
                    Due Date
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1"
                    aria-label="Sort by status"
                  >
                    Status
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.projects?.title || "Untitled Project"}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.due_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.status === "pending" && (
                        <PaymentButton
                          invoiceId={invoice.id}
                          amount={invoice.amount}
                          currency={invoice.currency}
                          onPaymentSuccess={onPaymentSuccess}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No invoices found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredInvoices.length} of {invoices.length} invoices
      </div>
    </div>
  );
};
