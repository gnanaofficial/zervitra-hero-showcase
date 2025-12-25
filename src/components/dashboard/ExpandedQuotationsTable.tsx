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
import { Search, Download, ArrowUpDown, FileDown, FileText, Plus, Eye } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/payments";
import { useDebounce } from "@/hooks/useDebounce";

interface Quotation {
  id: string;
  project_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  valid_until?: string;
  pdf_url?: string;
  quotation_id?: string;
  projects: { title: string };
}

interface ExpandedQuotationsTableProps {
  quotations: Quotation[];
  onExportCSV: () => void;
  onExportPDF: () => void;
  loading?: boolean;
}

export const ExpandedQuotationsTable = memo(({
  quotations,
  onExportCSV,
  onExportPDF,
  loading = false,
}: ExpandedQuotationsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"amount" | "created_at" | "status">("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const savedState = sessionStorage.getItem('quotations-table-state');
    if (savedState) {
      const { searchQuery: sq, statusFilter: sf, sortField: sof, sortDirection: sd } = JSON.parse(savedState);
      setSearchQuery(sq || "");
      setStatusFilter(sf || "all");
      setSortField(sof || "created_at");
      setSortDirection(sd || "desc");
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('quotations-table-state', JSON.stringify({
      searchQuery,
      statusFilter,
      sortField,
      sortDirection
    }));
  }, [searchQuery, statusFilter, sortField, sortDirection]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default";
      case "pending":
        return "outline";
      case "rejected":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleSort = useCallback((field: "amount" | "created_at" | "status") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField, sortDirection]);

  const filteredQuotations = useMemo(() => {
    return quotations
      .filter((quotation) => {
        const matchesSearch =
          quotation.projects?.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          quotation.id.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || quotation.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        if (sortField === "amount") {
          return direction * (a.amount - b.amount);
        } else if (sortField === "created_at") {
          return (
            direction *
            (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          );
        } else if (sortField === "status") {
          return direction * a.status.localeCompare(b.status);
        }
        return 0;
      });
  }, [quotations, debouncedSearch, statusFilter, sortField, sortDirection]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search quotations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search quotations"
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
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1"
                    aria-label="Sort by status"
                  >
                    Status
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("created_at")}
                    className="flex items-center gap-1"
                    aria-label="Sort by date"
                  >
                    Created
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredQuotations.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {filteredQuotations.map((quotation, index) => (
                    <motion.tr
                      key={quotation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div>{quotation.projects?.title || "Untitled Project"}</div>
                          {quotation.quotation_id && (
                            <div className="text-xs text-muted-foreground">{quotation.quotation_id}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(quotation.amount, quotation.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(quotation.status)}>
                          {quotation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(quotation.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {quotation.pdf_url ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(quotation.pdf_url, '_blank')}
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View PDF
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">No PDF</span>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-12 h-12 text-muted-foreground" />
                      <p className="text-muted-foreground font-medium">No quotations found</p>
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
        Showing {filteredQuotations.length} of {quotations.length} quotations
      </div>
    </div>
  );
});

ExpandedQuotationsTable.displayName = "ExpandedQuotationsTable";
