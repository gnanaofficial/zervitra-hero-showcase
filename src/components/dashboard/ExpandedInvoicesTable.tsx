import { useState, useMemo, memo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Search, Download, ArrowUpDown, FileDown, CreditCard, Plus } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/payments";
import PaymentButton from "@/components/PaymentButton";
import { useDebounce } from "@/hooks/useDebounce";

interface Invoice {
  id: string;
  project_id: string;
  client_id: string;
  amount: number;
  total?: number;
  currency: string;
  due_date: string;
  status: string;
  created_at: string;
  invoice_id?: string;
  projects: { title: string };
}

interface ExpandedInvoicesTableProps {
  invoices: Invoice[];
  onExportCSV: () => void;
  onExportPDF: () => void;
  onPaymentSuccess: () => void;
  onRowClick?: (invoice: Invoice) => void;
  loading?: boolean;
  showPaymentActions?: boolean;
}

export const ExpandedInvoicesTable = memo(({
  invoices,
  onExportCSV,
  onExportPDF,
  onPaymentSuccess,
  onRowClick,
  loading = false,
  showPaymentActions = true,
}: ExpandedInvoicesTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const savedState = sessionStorage.getItem('invoices-table-state');
    if (savedState) {
      const { searchQuery: sq, statusFilter: sf, sortField: sof, sortDirection: sd } = JSON.parse(savedState);
      setSearchQuery(sq || "");
      setStatusFilter(sf || "all");
      setSortField(sof || "due_date");
      setSortDirection(sd || "asc");
    }
  }, []);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"amount" | "due_date" | "status">("due_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    sessionStorage.setItem('invoices-table-state', JSON.stringify({
      searchQuery,
      statusFilter,
      sortField,
      sortDirection
    }));
  }, [searchQuery, statusFilter, sortField, sortDirection]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
      case "sent":
        return "outline";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Client-friendly status labels
  const getClientStatusLabel = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Pending';
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleSort = useCallback((field: "amount" | "due_date" | "status") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField, sortDirection]);

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((invoice) => {
        const matchesSearch =
          invoice.projects?.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          invoice.id.toLowerCase().includes(debouncedSearch.toLowerCase());
        // Map "pending" filter to include both "pending" and "sent" statuses
        const matchesStatus =
          statusFilter === "all" || 
          invoice.status === statusFilter ||
          (statusFilter === "pending" && invoice.status === "sent");
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
  }, [invoices, debouncedSearch, statusFilter, sortField, sortDirection]);

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
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredInvoices.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {filteredInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => onRowClick?.(invoice)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div>{invoice.projects?.title || "Untitled Project"}</div>
                          {invoice.invoice_id && (
                            <div className="text-xs text-muted-foreground">{invoice.invoice_id}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(invoice.total || invoice.amount, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(invoice.due_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(invoice.status)}>
                          {getClientStatusLabel(invoice.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {showPaymentActions && (invoice.status === "pending" || invoice.status === "overdue" || invoice.status === "sent") ? (
                          <PaymentButton
                            invoiceId={invoice.id}
                            clientId={invoice.client_id}
                            amount={invoice.total || invoice.amount}
                            currency={invoice.currency}
                            onPaymentSuccess={onPaymentSuccess}
                          />
                        ) : invoice.status === "paid" ? (
                          <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">
                            Paid
                          </Badge>
                        ) : null}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <CreditCard className="w-12 h-12 text-muted-foreground" />
                      <p className="text-muted-foreground font-medium">No invoices found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                    </div>
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
});

ExpandedInvoicesTable.displayName = "ExpandedInvoicesTable";
