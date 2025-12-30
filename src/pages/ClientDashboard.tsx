import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaymentButton from "@/components/PaymentButton";
import PaymentSuccessDialog from "@/components/PaymentSuccessDialog";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatCurrency } from "@/lib/payments";
import { format } from "date-fns";
import {
  FolderOpen,
  FileText,
  CreditCard,
  RefreshCw,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";
import { ExpandButton } from "@/components/dashboard/ExpandButton";
import { ExpandedViewContainer } from "@/components/dashboard/ExpandedViewContainer";
import { ExpandedProjectsTable } from "@/components/dashboard/ExpandedProjectsTable";
import { ExpandedQuotationsTable } from "@/components/dashboard/ExpandedQuotationsTable";
import { ExpandedInvoicesTable } from "@/components/dashboard/ExpandedInvoicesTable";
import { QuotationDetailDialog } from "@/components/dashboard/QuotationDetailDialog";
import { InvoiceDetailDialog } from "@/components/dashboard/InvoiceDetailDialog";
import {
  exportProjectsToCSV,
  exportProjectsToPDF,
  exportQuotationsToCSV,
  exportQuotationsToPDF,
  exportInvoicesToCSV,
  exportInvoicesToPDF,
} from "@/lib/exportUtils";

type ExpandedView = "projects" | "quotations" | "invoices" | null;

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading, error, projects, quotations, invoices, allProjects, allQuotations, allInvoices, overview, refreshData } = useDashboardData();
  const [expandedView, setExpandedView] = useState<ExpandedView>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paidInvoiceId, setPaidInvoiceId] = useState<string | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [showQuotationDetail, setShowQuotationDetail] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);

  // Handle payment success redirect
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const invoiceId = searchParams.get('invoice');
    
    if (paymentStatus === 'success' && invoiceId) {
      setShowPaymentSuccess(true);
      setPaidInvoiceId(invoiceId);
      // Refresh data to get updated invoice status
      refreshData();
      // Clean up URL params
      setSearchParams({});
    } else if (paymentStatus === 'cancelled') {
      // Could show a cancelled toast here if needed
      setSearchParams({});
    }
  }, [searchParams, refreshData, setSearchParams]);

  const handlePaymentDialogClose = () => {
    setShowPaymentSuccess(false);
    setPaidInvoiceId(null);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'accepted':
      case 'paid':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'pending':
      case 'sent':
        return 'outline';
      case 'on_hold':
      case 'overdue':
        return 'destructive';
      case 'cancelled':
      case 'rejected':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'accepted':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
      case 'sent':
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // Client-friendly status labels
  const getClientStatusLabel = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
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

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Client Dashboard - Zervitra</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Client Dashboard - Zervitra</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={refreshData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Client Dashboard - Zervitra</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        
        {/* Header */}
        <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Welcome back, {user?.email?.split('@')[0] || 'Client'}!
                </h1>
                <Badge variant="default" className="text-lg px-4 py-1">
                  Client Portal
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground mb-8">
                Here's an overview of your projects and account status.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Dashboard Stats */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              
              {/* Projects Overview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="premium-glass rounded-3xl p-6 border border-white/10 cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setExpandedView("projects")}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10
                                  flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-primary" />
                  </div>
                  <ExpandButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedView("projects");
                    }}
                    iconOnly
                    expanded={expandedView === "projects"}
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">My Projects</h3>
                <div className="text-3xl font-bold text-foreground mb-2">{overview.totalProjects}</div>
                <p className="text-sm text-muted-foreground">
                  {overview.activeProjects} active • {overview.completedProjects} completed
                </p>
              </motion.div>

              {/* Quotations Overview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="premium-glass rounded-3xl p-6 border border-white/10 cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setExpandedView("quotations")}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10
                                  flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <ExpandButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedView("quotations");
                    }}
                    iconOnly
                    expanded={expandedView === "quotations"}
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Quotations</h3>
                <div className="text-3xl font-bold text-foreground mb-2">{overview.totalQuotations}</div>
                <p className="text-sm text-muted-foreground">
                  {overview.pendingQuotations} pending • {overview.acceptedQuotations} accepted
                </p>
              </motion.div>

              {/* Payments Overview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="premium-glass rounded-3xl p-6 border border-white/10 cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setExpandedView("invoices")}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10
                                  flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <ExpandButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedView("invoices");
                    }}
                    iconOnly
                    expanded={expandedView === "invoices"}
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Payments</h3>
                <div className="text-3xl font-bold text-foreground mb-2">{formatCurrency(overview.totalPaid)}</div>
                <p className="text-sm text-muted-foreground">
                  {overview.paidInvoices} paid • {overview.pendingInvoices} pending
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Projects */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="premium-glass rounded-3xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">Recent Projects</h3>
                  {projects.length > 3 && (
                    <Button variant="ghost" size="sm" onClick={() => setExpandedView("projects")}>
                      View All
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/30">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created {format(new Date(project.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <Badge variant={getStatusBadgeVariant(project.status)} className="flex items-center gap-1">
                          {getStatusIcon(project.status)}
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {projects.length === 0 && (
                    <div className="text-center py-8">
                      <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No projects yet—contact your project manager to get started.</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Recent Quotations & Invoices */}
              <div className="space-y-8">
                {/* Quotations */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="premium-glass rounded-3xl p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">Recent Quotations</h3>
                    {quotations.length > 3 && (
                      <Button variant="ghost" size="sm" onClick={() => setExpandedView("quotations")}>
                        View All
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {quotations.slice(0, 3).map((quote) => (
                      <div 
                        key={quote.id} 
                        className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30 cursor-pointer hover:border-primary/30 transition-colors"
                        onClick={() => {
                          setSelectedQuotation(quote);
                          setShowQuotationDetail(true);
                        }}
                      >
                        <div>
                          <h4 className="font-medium text-foreground text-sm">
                            {quote.projects?.title || 'Untitled Project'}
                          </h4>
                          {(quote as any).quotation_id && (
                            <p className="text-xs text-primary font-mono">{(quote as any).quotation_id}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(quote.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-foreground">
                              {formatCurrency(quote.amount, quote.currency)}
                            </div>
                            <Badge variant={getStatusBadgeVariant(quote.status)} className="text-xs capitalize">
                              {getClientStatusLabel(quote.status)}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuotation(quote);
                              setShowQuotationDetail(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {quotations.length === 0 && (
                      <div className="text-center py-6">
                        <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No quotations yet.</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Invoices */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="premium-glass rounded-3xl p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">Recent Invoices</h3>
                    {invoices.length > 3 && (
                      <Button variant="ghost" size="sm" onClick={() => setExpandedView("invoices")}>
                        View All
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {invoices.slice(0, 3).map((invoice) => (
                      <div 
                        key={invoice.id} 
                        className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30 cursor-pointer hover:border-primary/30 transition-colors"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowInvoiceDetail(true);
                        }}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">
                            {invoice.projects?.title || 'Untitled Project'}
                          </h4>
                          {(invoice as any).invoice_id && (
                            <p className="text-xs text-primary font-mono">{(invoice as any).invoice_id}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Due {format(new Date(invoice.due_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-foreground">
                              {formatCurrency((invoice as any).total || invoice.amount, invoice.currency)}
                            </div>
                            <Badge variant={getStatusBadgeVariant(invoice.status)} className="text-xs capitalize">
                              {getClientStatusLabel(invoice.status)}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvoice(invoice);
                              setShowInvoiceDetail(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {invoices.length === 0 && (
                      <div className="text-center py-6">
                        <CreditCard className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No invoices yet.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Expanded View (Read-only for clients) */}
        <ExpandedViewContainer 
          isOpen={expandedView !== null}
          onClose={() => setExpandedView(null)}
          title={
            expandedView === "projects" ? "My Projects" :
            expandedView === "quotations" ? "My Quotations" :
            "My Invoices"
          }
          description="View your records"
        >
          {expandedView === "projects" && (
            <ExpandedProjectsTable
              projects={allProjects}
              onExportCSV={() => exportProjectsToCSV(allProjects)}
              onExportPDF={() => exportProjectsToPDF(allProjects)}
            />
          )}
          {expandedView === "quotations" && (
            <ExpandedQuotationsTable
              quotations={allQuotations}
              onExportCSV={() => exportQuotationsToCSV(allQuotations)}
              onExportPDF={() => exportQuotationsToPDF(allQuotations)}
              onRowClick={(quotation) => {
                setSelectedQuotation(quotation);
                setShowQuotationDetail(true);
              }}
            />
          )}
          {expandedView === "invoices" && (
            <ExpandedInvoicesTable
              invoices={allInvoices}
              onExportCSV={() => exportInvoicesToCSV(allInvoices)}
              onExportPDF={() => exportInvoicesToPDF(allInvoices)}
              onPaymentSuccess={refreshData}
              onRowClick={(invoice) => {
                setSelectedInvoice(invoice);
                setShowInvoiceDetail(true);
              }}
            />
          )}
        </ExpandedViewContainer>

        {/* Payment Success Dialog */}
        <PaymentSuccessDialog
          open={showPaymentSuccess}
          onClose={handlePaymentDialogClose}
          invoiceId={paidInvoiceId || ''}
        />

        {/* Quotation Detail Dialog */}
        <QuotationDetailDialog
          quotation={selectedQuotation}
          open={showQuotationDetail}
          onOpenChange={setShowQuotationDetail}
          onStatusUpdate={() => {
            refreshData();
            setSelectedQuotation(null);
            setShowQuotationDetail(false);
          }}
          clientName={user?.email?.split('@')[0] || 'Client'}
          clientEmail={user?.email || ''}
        />

        {/* Invoice Detail Dialog */}
        <InvoiceDetailDialog
          invoice={selectedInvoice}
          open={showInvoiceDetail}
          onOpenChange={setShowInvoiceDetail}
          onPaymentSuccess={refreshData}
        />
      </div>
    </>
  );
};

export default ClientDashboard;
