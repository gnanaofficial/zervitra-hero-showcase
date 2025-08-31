import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  FolderOpen, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  MessageCircle,
  Download,
  ExternalLink
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data - replace with real data from your backend
  const dashboardData = {
    projects: {
      active: 2,
      completed: 8,
      total: 10
    },
    quotations: {
      pending: 1,
      approved: 3,
      total: 4
    },
    invoices: {
      paid: 7,
      pending: 1,
      total: 8,
      totalAmount: 45000
    }
  };

  const recentProjects = [
    {
      id: 1,
      name: "E-commerce Platform",
      status: "In Progress",
      progress: 75,
      dueDate: "2024-02-15",
      type: "Web Development"
    },
    {
      id: 2,
      name: "Mobile App MVP",
      status: "In Review",
      progress: 90,
      dueDate: "2024-01-30",
      type: "App Development"
    },
    {
      id: 3,
      name: "Brand Website",
      status: "Completed",
      progress: 100,
      dueDate: "2024-01-15",
      type: "UI/UX Design"
    }
  ];

  const recentQuotations = [
    {
      id: 1,
      name: "Social Media Platform",
      amount: 35000,
      status: "Pending",
      createdDate: "2024-01-20"
    },
    {
      id: 2,
      name: "CRM Integration",
      amount: 15000,
      status: "Approved",
      createdDate: "2024-01-10"
    }
  ];

  const recentInvoices = [
    {
      id: 1,
      number: "INV-2024-001",
      amount: 15000,
      status: "Paid",
      dueDate: "2024-01-25",
      paidDate: "2024-01-23"
    },
    {
      id: 2,
      number: "INV-2024-002",
      amount: 8500,
      status: "Pending",
      dueDate: "2024-02-10"
    }
  ];

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
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Welcome back, {user?.email?.split('@')[0] || 'Client'}!
              </h1>
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
                className="premium-glass rounded-3xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 
                                  flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-primary" />
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Projects</h3>
                <div className="text-3xl font-bold text-foreground mb-2">{dashboardData.projects.total}</div>
                <p className="text-sm text-muted-foreground">
                  {dashboardData.projects.active} active • {dashboardData.projects.completed} completed
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
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Quotations</h3>
                <div className="text-3xl font-bold text-foreground mb-2">{dashboardData.quotations.total}</div>
                <p className="text-sm text-muted-foreground">
                  {dashboardData.quotations.pending} pending • {dashboardData.quotations.approved} approved
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
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Invoices</h3>
                <div className="text-3xl font-bold text-foreground mb-2">${dashboardData.invoices.totalAmount.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">
                  {dashboardData.invoices.paid} paid • {dashboardData.invoices.pending} pending
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
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/30">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.type}</p>
                        <div className="flex items-center mt-2">
                          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden mr-3">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{project.progress}%</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'Completed' 
                            ? 'bg-success/20 text-success' 
                            : 'bg-primary/20 text-primary'
                        }`}>
                          {project.status}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Due {project.dueDate}</p>
                      </div>
                    </div>
                  ))}
                  
                  {recentProjects.length === 0 && (
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
                    {recentQuotations.map((quote) => (
                      <div key={quote.id} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                        <div>
                          <h4 className="font-medium text-foreground text-sm">{quote.name}</h4>
                          <p className="text-xs text-muted-foreground">{quote.createdDate}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">${quote.amount.toLocaleString()}</div>
                          <div className={`text-xs ${
                            quote.status === 'Approved' 
                              ? 'text-success' 
                              : 'text-muted-foreground'
                          }`}>
                            {quote.status}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {recentQuotations.length === 0 && (
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
                    {recentInvoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                        <div>
                          <h4 className="font-medium text-foreground text-sm">{invoice.number}</h4>
                          <p className="text-xs text-muted-foreground">
                            Due {invoice.dueDate}
                            {invoice.paidDate && ` • Paid ${invoice.paidDate}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">${invoice.amount.toLocaleString()}</div>
                          <div className={`text-xs ${
                            invoice.status === 'Paid' 
                              ? 'text-success' 
                              : 'text-muted-foreground'
                          }`}>
                            {invoice.status}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {recentInvoices.length === 0 && (
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
      </div>
    </>
  );
};

export default Dashboard;