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

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  budget?: number;
  currency?: string;
}

interface ExpandedProjectsTableProps {
  projects: Project[];
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export const ExpandedProjectsTable = ({
  projects,
  onExportCSV,
  onExportPDF,
}: ExpandedProjectsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"title" | "created_at" | "status">("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "pending":
        return "outline";
      case "on_hold":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleSort = (field: "title" | "created_at" | "status") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortField === "title") {
        return direction * a.title.localeCompare(b.title);
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
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search projects"
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
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
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-1"
                    aria-label="Sort by title"
                  >
                    Project
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
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
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {project.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(project.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No projects found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>
    </div>
  );
};
