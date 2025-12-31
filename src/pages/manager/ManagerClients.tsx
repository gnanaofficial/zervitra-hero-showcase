import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ManagerClientRow {
  id: string;
  company_name: string | null;
  contact_email: string | null;
  phone: string | null;
  created_at: string;
}

const ManagerClients = () => {
  const navigate = useNavigate();
  const { managerId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ManagerClientRow[]>([]);
  const [q, setQ] = useState('');

  const fetchRows = async () => {
    if (!managerId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('id, company_name, contact_email, phone, created_at')
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
        (r.company_name || '').toLowerCase().includes(query) ||
        (r.contact_email || '').toLowerCase().includes(query)
      );
    });
  }, [rows, q]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Manager Clients - Zervitra</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Clients</h1>
              <p className="text-muted-foreground">View all clients assigned to you.</p>
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

          <section className="premium-glass rounded-3xl p-6 border border-white/10">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search clients..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.company_name || 'Unnamed Client'}</TableCell>
                        <TableCell>{r.contact_email || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell">{r.phone || '-'}</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          No clients found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default ManagerClients;
