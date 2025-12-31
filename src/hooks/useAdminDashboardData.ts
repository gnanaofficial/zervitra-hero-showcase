import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  client_id: string;
  manager_id?: string;
}

interface Quotation {
  id: string;
  project_id: string;
  client_id: string;
  manager_id?: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  pdf_url?: string;
  quotation_id?: string;
  projects: { title: string };
  clients?: { company_name: string };
}

interface Invoice {
  id: string;
  project_id: string;
  client_id: string;
  manager_id?: string;
  amount: number;
  total?: number;
  currency: string;
  due_date: string;
  status: string;
  created_at: string;
  invoice_id?: string;
  payment_method?: string;
  projects: { title: string };
  clients?: { company_name: string };
}

interface Client {
  id: string;
  company_name: string;
  contact_email: string;
  created_at: string;
  manager_id?: string;
}

export const useAdminDashboardData = () => {
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allQuotations, setAllQuotations] = useState<Quotation[]>([]);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user || role !== 'admin') return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
      } else {
        setClients(clientsData || []);
      }

      // Fetch recent projects (limit 5)
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch all projects
      const { data: allProjectsData, error: allProjectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError || allProjectsError) {
        console.error('Error fetching projects:', projectsError || allProjectsError);
      } else {
        setProjects(projectsData || []);
        setAllProjects(allProjectsData || []);
      }

      // Fetch recent quotations (limit 5)
      const { data: quotationsData, error: quotationsError } = await supabase
        .from('quotations')
        .select(`
          *,
          projects(title),
          clients:client_id(company_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch all quotations
      const { data: allQuotationsData, error: allQuotationsError } = await supabase
        .from('quotations')
        .select(`
          *,
          projects(title),
          clients:client_id(company_name)
        `)
        .order('created_at', { ascending: false });

      if (quotationsError || allQuotationsError) {
        console.error('Error fetching quotations:', quotationsError || allQuotationsError);
      } else {
        setQuotations(quotationsData || []);
        setAllQuotations(allQuotationsData || []);
      }

      // Fetch recent invoices (limit 5)
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          projects(title),
          clients:client_id(company_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch all invoices
      const { data: allInvoicesData, error: allInvoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          projects(title),
          clients:client_id(company_name)
        `)
        .order('created_at', { ascending: false });

      if (invoicesError || allInvoicesError) {
        console.error('Error fetching invoices:', invoicesError || allInvoicesError);
      } else {
        setInvoices(invoicesData || []);
        setAllInvoices(allInvoicesData || []);
      }
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user, role]);

  useEffect(() => {
    if (user && role === 'admin') {
      fetchDashboardData();
    }
  }, [user, role, fetchDashboardData]);

  // Calculate overview metrics
  const overview = {
    totalClients: clients.length,
    activeClients: clients.length, // All clients are considered active for now
    totalProjects: allProjects.length,
    activeProjects: allProjects.filter(p => p.status === 'active').length,
    completedProjects: allProjects.filter(p => p.status === 'completed').length,
    totalQuotations: allQuotations.filter(q => q.status !== 'draft').length,
    pendingQuotations: allQuotations.filter(q => q.status === 'pending' || q.status === 'sent').length,
    acceptedQuotations: allQuotations.filter(q => q.status === 'accepted').length,
    draftQuotations: allQuotations.filter(q => q.status === 'draft').length,
    totalInvoices: allInvoices.length,
    pendingInvoices: allInvoices.filter(i => i.status === 'pending' || i.status === 'sent').length,
    paidInvoices: allInvoices.filter(i => i.status === 'paid').length,
    totalPaid: allInvoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + Number(i.total || i.amount), 0),
    totalRevenue: allInvoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + Number(i.total || i.amount), 0)
  };

  return {
    loading,
    error,
    projects,
    quotations,
    invoices,
    clients,
    allProjects,
    allQuotations,
    allInvoices,
    overview,
    refreshData: fetchDashboardData
  };
};
