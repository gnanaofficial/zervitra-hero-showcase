import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

interface Quotation {
  id: string;
  project_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  projects: { title: string };
}

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

export const useDashboardData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get or create client record for the user
      let { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (clientError && clientError.code === 'PGRST116') {
        // No client found, create one
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert({
            user_id: user?.id,
            contact_email: user?.email,
            company_name: 'Default Company'
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating client:', createError);
          setError('Failed to initialize client data');
          return;
        }
        clientData = newClient;
      } else if (clientError) {
        console.error('Error fetching client:', clientError);
        setError('Failed to fetch client data');
        return;
      }

      const clientId = clientData.id;

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
      } else {
        setProjects(projectsData || []);
      }

      // Fetch quotations
      const { data: quotationsData, error: quotationsError } = await supabase
        .from('quotations')
        .select(`
          *,
          projects(title)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (quotationsError) {
        console.error('Error fetching quotations:', quotationsError);
      } else {
        setQuotations(quotationsData || []);
      }

      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          projects(title)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (invoicesError) {
        console.error('Error fetching invoices:', invoicesError);
      } else {
        setInvoices(invoicesData || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  // Calculate overview metrics
  const overview = {
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalProjects: projects.length,
    pendingQuotations: quotations.filter(q => q.status === 'pending').length,
    acceptedQuotations: quotations.filter(q => q.status === 'accepted').length,
    totalQuotations: quotations.length,
    pendingInvoices: invoices.filter(i => i.status === 'pending').length,
    paidInvoices: invoices.filter(i => i.status === 'paid').length,
    totalInvoices: invoices.length,
    totalPaid: invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount, 0)
  };

  return {
    loading,
    error,
    projects,
    quotations,
    invoices,
    overview,
    refreshData
  };
};