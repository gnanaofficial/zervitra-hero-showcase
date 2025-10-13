import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaymentButton from "@/components/PaymentButton";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatCurrency } from "@/lib/payments";
import { format } from "date-fns";
import {
  FolderOpen,
  FileText,
  CreditCard,
  TrendingUp,
  Calendar,
  MessageCircle,
  Download,
  ExternalLink,
  RefreshCw,
  Clock,
  CheckCircle
} from "lucide-react";
import { ExpandButton } from "@/components/dashboard/ExpandButton";
import { ExpandedViewContainer } from "@/components/dashboard/ExpandedViewContainer";
import { ExpandedProjectsTable } from "@/components/dashboard/ExpandedProjectsTable";
import { ExpandedQuotationsTable } from "@/components/dashboard/ExpandedQuotationsTable";
import { ExpandedInvoicesTable } from "@/components/dashboard/ExpandedInvoicesTable";
import {
  exportProjectsToCSV,
  exportProjectsToPDF,
  exportQuotationsToCSV,
  exportQuotationsToPDF,
  exportInvoicesToCSV,
  exportInvoicesToPDF,
} from "@/lib/exportUtils";

type ExpandedView = "projects" | "quotations" | "invoices" | null;

const Dashboard = () => {
  const { user, role } = useAuth();
  const { loading, error, projects, quotations, invoices, allProjects, allQuotations, allInvoices, overview, refreshData } = useDashboardData();
  const [expandedView, setExpandedView] = useState<ExpandedView>(null);
  
  const isAdmin = role === 'admin';

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'accepted':
      case 'paid':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'pending':
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
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Client Dashboard - Zervitra</title>
          <meta name="description" content="View your projects, quotations, and invoices in your Zervitra client dashboard." />
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
          <meta name="description" content="View your projects, quotations, and invoices in your Zervitra client dashboard." />
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
        <meta name="description" content="View your projects, quotations, and invoices in your Zervitra client dashboard." />
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
                {role && (
                  <Badge 
                    variant={isAdmin ? 'destructive' : 'default'}
                    className="text-lg px-4 py-1"
                  >
                    {isAdmin ? 'Admin Dashboard' : 'Client Dashboard'}
                  </Badge>
                )}
              </div>
              <p className="text-xl text-muted-foreground mb-8">
                {isAdmin 
                  ? "Manage all clients, projects, and financial records."
                  : "Here's an overview of your projects and account status."}
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
                className="premium-glass rounded-3xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10
                                  flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-primary" />
                  </div>
                  <ExpandButton
                    onClick={() => setExpandedView("projects")}
                    iconOnly
                    expanded={expandedView === "projects"}
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Projects</h3>
                  <Button onClick={refreshData} variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
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
                className="premium-glass rounded-3xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10
                                  flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <ExpandButton
                    onClick={() => setExpandedView("quotations")}
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

              {/* Invoices Overview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="premium-glass rounded-3xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10
                                  flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <ExpandButton
                    onClick={() => setExpandedView("invoices")}
                    iconOnly
                    expanded={expandedView === "invoices"}
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Invoices</h3>
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
                  {isAdmin && (
                    <Button variant="ghost" size="sm" onClick={() => setExpandedView("projects")}>
                      View All
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {projects.map((project) => (
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
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {quotations.map((quote) => (
                      <div key={quote.id} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                        <div>
                          <h4 className="font-medium text-foreground text-sm">
                            {quote.projects?.title || 'Untitled Project'}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(quote.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            {formatCurrency(quote.amount, quote.currency)}
                          </div>
                          <Badge variant={getStatusBadgeVariant(quote.status)} className="text-xs">
                            {quote.status}
                          </Badge>
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
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">
                            {invoice.projects?.title || 'Untitled Project'}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Due {format(new Date(invoice.due_date), 'MMM d, yyyy')} • 
                            Created {format(new Date(invoice.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-foreground">
                              {formatCurrency(invoice.amount, invoice.currency)}
                            </div>
                            <Badge variant={getStatusBadgeVariant(invoice.status)} className="text-xs">
                              {invoice.status}
                            </Badge>
                          </div>
                          {invoice.status === 'pending' && (
                            <PaymentButton
                              invoiceId={invoice.id}
                              amount={invoice.amount}
                              currency={invoice.currency}
                              onPaymentSuccess={refreshData}
                            />
                          )}
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

        {/* Quick Actions */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-4xl mx-auto text-center premium-glass rounded-3xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Need Help or Have Questions?
            </h2>
            <p className="text-muted-foreground mb-8">
              Our team is here to support you throughout your project journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open("mailto:hello@zervitra.com?subject=Support Request", "_blank")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("mailto:hello@zervitra.com?subject=New Project Inquiry", "_blank")}
                className="border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Expanded Views */}
        <ExpandedViewContainer
          isOpen={expandedView === "projects"}
          onClose={() => setExpandedView(null)}
          title="All Projects"
          description="View and manage all your projects with filtering and export options."
        >
          <ExpandedProjectsTable
            projects={allProjects}
            onExportCSV={() => exportProjectsToCSV(allProjects)}
            onExportPDF={() => exportProjectsToPDF(allProjects)}
          />
        </ExpandedViewContainer>

        <ExpandedViewContainer
          isOpen={expandedView === "quotations"}
          onClose={() => setExpandedView(null)}
          title="All Quotations"
          description="View and manage all your quotations with filtering and export options."
        >
          <ExpandedQuotationsTable
            quotations={allQuotations}
            onExportCSV={() => exportQuotationsToCSV(allQuotations)}
            onExportPDF={() => exportQuotationsToPDF(allQuotations)}
          />
        </ExpandedViewContainer>

        <ExpandedViewContainer
          isOpen={expandedView === "invoices"}
          onClose={() => setExpandedView(null)}
          title="All Invoices"
          description="View and manage all your invoices with filtering and export options."
        >
          <ExpandedInvoicesTable
            invoices={allInvoices}
            onExportCSV={() => exportInvoicesToCSV(allInvoices)}
            onExportPDF={() => exportInvoicesToPDF(allInvoices)}
            onPaymentSuccess={refreshData}
          />
        </ExpandedViewContainer>
      </div>
    </>
  );
};

export default Dashboard;