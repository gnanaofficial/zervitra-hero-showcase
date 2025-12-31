import { useState, useEffect, useCallback, useRef } from 'react';
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
  pdf_url?: string;
  quotation_id?: string;
  projects: { title: string };
}

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

type ClientId = string | null;

type RefreshReason = 'manual' | 'realtime' | 'payment_success';

export const useDashboardData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allQuotations, setAllQuotations] = useState<Quotation[]>([]);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<ClientId>(null);

  const lastRefreshReasonRef = useRef<RefreshReason>('manual');

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Create a minimal client row if missing (legacy behavior)
      if (clientError && clientError.code === 'PGRST116') {
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert({
            user_id: user.id,
            contact_email: user.email,
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

      const resolvedClientId = clientData.id as string;
      setClientId(resolvedClientId);

      const [{ data: projectsData, error: projectsError }, { data: allProjectsData, error: allProjectsError }] =
        await Promise.all([
          supabase
            .from('projects')
            .select('*')
            .eq('client_id', resolvedClientId)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('projects')
            .select('*')
            .eq('client_id', resolvedClientId)
            .order('created_at', { ascending: false })
        ]);

      if (projectsError || allProjectsError) {
        console.error('Error fetching projects:', projectsError || allProjectsError);
      } else {
        setProjects(projectsData || []);
        setAllProjects(allProjectsData || []);
      }

      // Filter out draft quotations - clients should not see drafts
      const [{ data: quotationsData, error: quotationsError }, { data: allQuotationsData, error: allQuotationsError }] =
        await Promise.all([
          supabase
            .from('quotations')
            .select(`*, projects(title)`)
            .eq('client_id', resolvedClientId)
            .neq('status', 'draft')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('quotations')
            .select(`*, projects(title)`)
            .eq('client_id', resolvedClientId)
            .neq('status', 'draft')
            .order('created_at', { ascending: false })
        ]);

      if (quotationsError || allQuotationsError) {
        console.error('Error fetching quotations:', quotationsError || allQuotationsError);
      } else {
        setQuotations(quotationsData || []);
        setAllQuotations(allQuotationsData || []);
      }

      const [{ data: invoicesData, error: invoicesError }, { data: allInvoicesData, error: allInvoicesError }] =
        await Promise.all([
          supabase
            .from('invoices')
            .select(`*, projects(title)`)
            .eq('client_id', resolvedClientId)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('invoices')
            .select(`*, projects(title)`)
            .eq('client_id', resolvedClientId)
            .order('created_at', { ascending: false })
        ]);

      if (invoicesError || allInvoicesError) {
        console.error('Error fetching invoices:', invoicesError || allInvoicesError);
      } else {
        setInvoices(invoicesData || []);
        setAllInvoices(allInvoicesData || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user, fetchDashboardData]);

  // Realtime refresh (projects/quotations/invoices) so dashboards update without manual reload.
  useEffect(() => {
    if (!user || !clientId) return;

    const channel = supabase
      .channel(`client-dashboard-realtime:${clientId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices', filter: `client_id=eq.${clientId}` },
        () => {
          lastRefreshReasonRef.current = 'realtime';
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects', filter: `client_id=eq.${clientId}` },
        () => {
          lastRefreshReasonRef.current = 'realtime';
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quotations', filter: `client_id=eq.${clientId}` },
        () => {
          lastRefreshReasonRef.current = 'realtime';
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, clientId, fetchDashboardData]);

  const refreshData = useCallback((reason: RefreshReason = 'manual') => {
    lastRefreshReasonRef.current = reason;
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Calculate overview metrics - include 'sent' as pending for clients
  const overview = {
    activeProjects: projects.filter((p) => p.status === 'active').length,
    completedProjects: projects.filter((p) => p.status === 'completed').length,
    totalProjects: projects.length,
    pendingQuotations: quotations.filter((q) => q.status === 'pending' || q.status === 'sent').length,
    acceptedQuotations: quotations.filter((q) => q.status === 'accepted').length,
    totalQuotations: quotations.length,
    pendingInvoices: invoices.filter((i) => i.status === 'pending' || i.status === 'sent').length,
    paidInvoices: invoices.filter((i) => i.status === 'paid').length,
    totalInvoices: invoices.length,
    totalPaid: invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  };

  return {
    loading,
    error,
    projects,
    quotations,
    invoices,
    allProjects,
    allQuotations,
    allInvoices,
    overview,
    refreshData,
    // exposed for debugging/diagnostics
    clientId,
    lastRefreshReason: lastRefreshReasonRef.current
  };
};
