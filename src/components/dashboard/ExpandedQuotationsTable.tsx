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

interface Quotation {
  id: string;
  project_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  valid_until?: string;
  projects: { title: string };
}

interface ExpandedQuotationsTableProps {
  quotations: Quotation[];
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export const ExpandedQuotationsTable = ({
  quotations,
  onExportCSV,
  onExportPDF,
}: ExpandedQuotationsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"amount" | "created_at" | "status">("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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

  const handleSort = (field: "amount" | "created_at" | "status") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredQuotations = quotations
    .filter((quotation) => {
      const matchesSearch =
        quotation.projects?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quotation.id.toLowerCase().includes(searchQuery.toLowerCase());
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.length > 0 ? (
                filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">
                      {quotation.projects?.title || "Untitled Project"}
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No quotations found matching your criteria.
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
};
