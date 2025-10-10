import { format } from "date-fns";
import { formatCurrency } from "./payments";

interface ProjectExport {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

interface QuotationExport {
  id: string;
  project_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  projects: { title: string };
}

interface InvoiceExport {
  id: string;
  project_id: string;
  amount: number;
  currency: string;
  due_date: string;
  status: string;
  created_at: string;
  projects: { title: string };
}

const createCSV = (headers: string[], rows: string[][]): string => {
  const escapeCSVValue = (value: string) => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvContent = [
    headers.map(escapeCSVValue).join(","),
    ...rows.map((row) => row.map(escapeCSVValue).join(",")),
  ].join("\n");

  return csvContent;
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportProjectsToCSV = (projects: ProjectExport[]) => {
  const headers = ["ID", "Title", "Description", "Status", "Created At"];
  const rows = projects.map((project) => [
    project.id,
    project.title,
    project.description,
    project.status,
    format(new Date(project.created_at), "MMM d, yyyy HH:mm"),
  ]);

  const csvContent = createCSV(headers, rows);
  const filename = `projects_${format(new Date(), "yyyy-MM-dd_HH-mm")}.csv`;
  downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
};

export const exportQuotationsToCSV = (quotations: QuotationExport[]) => {
  const headers = ["ID", "Project", "Amount", "Currency", "Status", "Created At"];
  const rows = quotations.map((quotation) => [
    quotation.id,
    quotation.projects?.title || "Untitled",
    quotation.amount.toString(),
    quotation.currency,
    quotation.status,
    format(new Date(quotation.created_at), "MMM d, yyyy HH:mm"),
  ]);

  const csvContent = createCSV(headers, rows);
  const filename = `quotations_${format(new Date(), "yyyy-MM-dd_HH-mm")}.csv`;
  downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
};

export const exportInvoicesToCSV = (invoices: InvoiceExport[]) => {
  const headers = ["ID", "Project", "Amount", "Currency", "Due Date", "Status", "Created At"];
  const rows = invoices.map((invoice) => [
    invoice.id,
    invoice.projects?.title || "Untitled",
    invoice.amount.toString(),
    invoice.currency,
    format(new Date(invoice.due_date), "MMM d, yyyy"),
    invoice.status,
    format(new Date(invoice.created_at), "MMM d, yyyy HH:mm"),
  ]);

  const csvContent = createCSV(headers, rows);
  const filename = `invoices_${format(new Date(), "yyyy-MM-dd_HH-mm")}.csv`;
  downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
};

export const exportProjectsToPDF = (projects: ProjectExport[]) => {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Projects Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f4f4f4; font-weight: bold; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .header { margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Projects Report</h1>
    <p>Generated on ${format(new Date(), "MMMM d, yyyy 'at' HH:mm")}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Status</th>
        <th>Created At</th>
      </tr>
    </thead>
    <tbody>
      ${projects
        .map(
          (project) => `
        <tr>
          <td>${project.title}</td>
          <td>${project.description}</td>
          <td>${project.status}</td>
          <td>${format(new Date(project.created_at), "MMM d, yyyy")}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
</body>
</html>
  `;

  const blob = new Blob([content], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank");

  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

export const exportQuotationsToPDF = (quotations: QuotationExport[]) => {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Quotations Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f4f4f4; font-weight: bold; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .header { margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Quotations Report</h1>
    <p>Generated on ${format(new Date(), "MMMM d, yyyy 'at' HH:mm")}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>Project</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Created At</th>
      </tr>
    </thead>
    <tbody>
      ${quotations
        .map(
          (quotation) => `
        <tr>
          <td>${quotation.projects?.title || "Untitled"}</td>
          <td>${formatCurrency(quotation.amount, quotation.currency)}</td>
          <td>${quotation.status}</td>
          <td>${format(new Date(quotation.created_at), "MMM d, yyyy")}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
</body>
</html>
  `;

  const blob = new Blob([content], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank");

  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

export const exportInvoicesToPDF = (invoices: InvoiceExport[]) => {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoices Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f4f4f4; font-weight: bold; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .header { margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Invoices Report</h1>
    <p>Generated on ${format(new Date(), "MMMM d, yyyy 'at' HH:mm")}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>Project</th>
        <th>Amount</th>
        <th>Due Date</th>
        <th>Status</th>
        <th>Created At</th>
      </tr>
    </thead>
    <tbody>
      ${invoices
        .map(
          (invoice) => `
        <tr>
          <td>${invoice.projects?.title || "Untitled"}</td>
          <td>${formatCurrency(invoice.amount, invoice.currency)}</td>
          <td>${format(new Date(invoice.due_date), "MMM d, yyyy")}</td>
          <td>${invoice.status}</td>
          <td>${format(new Date(invoice.created_at), "MMM d, yyyy")}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
</body>
</html>
  `;

  const blob = new Blob([content], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank");

  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};
