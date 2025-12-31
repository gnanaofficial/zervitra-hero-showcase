import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';
import { ExpandedInvoicesTable } from '@/components/dashboard/ExpandedInvoicesTable';
import { exportInvoicesToCSV, exportInvoicesToPDF } from '@/lib/exportUtils';

const ManagerInvoices = () => {
  const { managerId } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState('');

  const fetchRows = async () => {
    if (!managerId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('invoices')
      .select(`*, projects(title)`)
      .eq('manager_id', managerId)
      .order('created_at', { ascending: false });

    if (!error) setRows((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managerId]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((r) => {
      return (
        (r.projects?.title || '').toLowerCase().includes(query) ||
        (r.invoice_id || '').toLowerCase().includes(query)
      );
    });
  }, [rows, q]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Manager Invoices - Zervitra</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Invoices</h1>
              <p className="text-muted-foreground">View all invoices for your clients.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchRows} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="ghost" onClick={() => navigate('/manager/dashboard')}>
                Back
              </Button>
            </div>
          </header>

          <section className="premium-glass rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search invoices..."
                className="pl-10"
              />
            </div>

            <ExpandedInvoicesTable
              invoices={filtered}
              onExportCSV={() => exportInvoicesToCSV(filtered)}
              onExportPDF={() => exportInvoicesToPDF(filtered)}
              onPaymentSuccess={() => undefined}
              showPaymentActions={false}
            />
          </section>
        </div>
      </main>
    </>
  );
};

export default ManagerInvoices;
