import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateClientDialog } from '@/components/dashboard/CreateClientDialog';
import { 
  Users, 
  FileText, 
  Receipt, 
  FolderKanban,
  Plus,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserPlus
} from 'lucide-react';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ManagerProfile {
  id: string;
  name: string;
  email: string;
  department: string | null;
  region: string | null;
  target_revenue: number | null;
  target_clients: number | null;
}

interface DashboardStats {
  totalClients: number;
  totalProjects: number;
  totalQuotations: number;
  totalInvoices: number;
  pendingQuotations: number;
  paidInvoices: number;
  totalRevenue: number;
}

const ManagerDashboard = () => {
  const { user, managerId } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ManagerProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalProjects: 0,
    totalQuotations: 0,
    totalInvoices: 0,
    pendingQuotations: 0,
    paidInvoices: 0,
    totalRevenue: 0
  });
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [recentQuotations, setRecentQuotations] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);

  const fetchData = async () => {
    if (!managerId) return;
    
    setLoading(true);
    try {
      // Fetch manager profile
      const { data: profileData } = await supabase
        .from('managers')
        .select('*')
        .eq('id', managerId)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch clients count
      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('manager_id', managerId);

      // Fetch projects count
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('manager_id', managerId);

      // Fetch quotations
      const { data: quotations, count: quotationsCount } = await supabase
        .from('quotations')
        .select('*', { count: 'exact' })
        .eq('manager_id', managerId)
        .neq('status', 'draft');

      const pendingQuotations = quotations?.filter(q => q.status === 'sent' || q.status === 'pending').length || 0;

      // Fetch invoices
      const { data: invoices, count: invoicesCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .eq('manager_id', managerId);

      const paidInvoices = invoices?.filter(i => i.status === 'paid').length || 0;
      const totalRevenue = invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total || i.amount), 0) || 0;

      setStats({
        totalClients: clientsCount || 0,
        totalProjects: projectsCount || 0,
        totalQuotations: quotationsCount || 0,
        totalInvoices: invoicesCount || 0,
        pendingQuotations,
        paidInvoices,
        totalRevenue
      });

      // Fetch recent clients
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('manager_id', managerId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentClients(clients || []);

      // Fetch recent quotations with client info
      const { data: recentQuots } = await supabase
        .from('quotations')
        .select(`
          *,
          clients:client_id (company_name, contact_email),
          projects:project_id (title)
        `)
        .eq('manager_id', managerId)
        .neq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentQuotations(recentQuots || []);

      // Fetch recent invoices with client info
      const { data: recentInvs } = await supabase
        .from('invoices')
        .select(`
          *,
          clients:client_id (company_name, contact_email),
          projects:project_id (title)
        `)
        .eq('manager_id', managerId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentInvoices(recentInvs || []);

    } catch (error) {
      console.error('Error fetching manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (managerId) {
      fetchData();
    }
  }, [managerId]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
      case 'accepted':
        return 'default';
      case 'pending':
      case 'sent':
        return 'secondary';
      case 'rejected':
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'accepted':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
      case 'sent':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Manager Dashboard - Zervitra</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome, {profile?.name || 'Manager'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {profile?.department && `${profile.department} • `}
                {profile?.region && `${profile.region} Region`}
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" onClick={fetchData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <CreateClientDialog onSuccess={fetchData} />
              <Button onClick={() => navigate('/manager/quotation-generator')}>
                <Plus className="w-4 h-4 mr-2" />
                New Quotation
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    My Clients
                  </CardTitle>
                  <Users className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalClients}</div>
                  {profile?.target_clients && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: {profile.target_clients}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Projects
                  </CardTitle>
                  <FolderKanban className="w-5 h-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalProjects}</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Quotations
                  </CardTitle>
                  <FileText className="w-5 h-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalQuotations}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.pendingQuotations} pending response
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Revenue
                  </CardTitle>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                  {profile?.target_revenue && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: {formatCurrency(profile.target_revenue)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Clients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Clients</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/manager/clients')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentClients.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No clients yet. Start by creating your first client.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {recentClients.map((client) => (
                        <div
                          key={client.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">{client.company_name || 'Unnamed Client'}</p>
                            <p className="text-sm text-muted-foreground">{client.contact_email}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(client.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Quotations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Quotations</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/manager/quotations')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentQuotations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No quotations yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {recentQuotations.map((quotation) => (
                        <div
                          key={quotation.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{quotation.quotation_id}</p>
                              <Badge variant={getStatusBadgeVariant(quotation.status)} className="gap-1">
                                {getStatusIcon(quotation.status)}
                                {quotation.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {quotation.clients?.company_name} • {quotation.projects?.title}
                            </p>
                          </div>
                          <p className="font-medium">{formatCurrency(Number(quotation.amount))}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Invoices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Invoices</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/manager/invoices')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentInvoices.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No invoices yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {recentInvoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{invoice.invoice_id}</p>
                              <Badge variant={getStatusBadgeVariant(invoice.status)} className="gap-1">
                                {getStatusIcon(invoice.status)}
                                {invoice.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {invoice.clients?.company_name} • {invoice.projects?.title}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(Number(invoice.total || invoice.amount))}</p>
                            <p className="text-xs text-muted-foreground">
                              Due: {format(new Date(invoice.due_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ManagerDashboard;
