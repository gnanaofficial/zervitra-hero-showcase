import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  MoreHorizontal, 
  Edit, 
  UserX, 
  UserCheck,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import CreateManagerDialog from './CreateManagerDialog';

interface Manager {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  region: string | null;
  hire_date: string | null;
  commission_percent: number;
  target_revenue: number | null;
  target_clients: number | null;
  status: string;
  created_at: string;
  clientCount?: number;
  revenue?: number;
}

interface ManagersSectionProps {
  onRefresh?: () => void;
}

const ManagersSection = ({ onRefresh }: ManagersSectionProps) => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchManagers = async () => {
    setLoading(true);
    try {
      // Fetch managers
      const { data: managersData, error } = await supabase
        .from('managers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // For each manager, get client count and revenue
      const managersWithStats = await Promise.all(
        (managersData || []).map(async (manager) => {
          const { count: clientCount } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('manager_id', manager.id);

          const { data: invoices } = await supabase
            .from('invoices')
            .select('total, amount, status')
            .eq('manager_id', manager.id)
            .eq('status', 'paid');

          const revenue = invoices?.reduce((sum, inv) => sum + Number(inv.total || inv.amount), 0) || 0;

          return {
            ...manager,
            clientCount: clientCount || 0,
            revenue
          };
        })
      );

      setManagers(managersWithStats);
    } catch (error) {
      console.error('Error fetching managers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load managers',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const toggleManagerStatus = async (managerId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('managers')
        .update({ status: newStatus })
        .eq('id', managerId);

      if (error) throw error;

      toast({
        title: 'Status updated',
        description: `Manager has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`
      });

      fetchManagers();
    } catch (error) {
      console.error('Error updating manager status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update manager status',
        variant: 'destructive'
      });
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
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Managers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Managers ({managers.length})
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchManagers}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <CreateManagerDialog onSuccess={fetchManagers} />
        </div>
      </CardHeader>
      <CardContent>
        {managers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No managers yet. Add your first manager.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-center">Clients</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{manager.name}</p>
                        <p className="text-sm text-muted-foreground">{manager.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {manager.department || '-'}
                    </TableCell>
                    <TableCell className="capitalize">
                      {manager.region || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-medium">{manager.clientCount}</span>
                        {manager.target_clients && (
                          <span className="text-xs text-muted-foreground">
                            / {manager.target_clients}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="font-medium">{formatCurrency(manager.revenue || 0)}</span>
                      </div>
                      {manager.target_revenue && (
                        <p className="text-xs text-muted-foreground">
                          Target: {formatCurrency(manager.target_revenue)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={manager.status === 'active' ? 'default' : 'secondary'}
                      >
                        {manager.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleManagerStatus(manager.id, manager.status)}
                          >
                            {manager.status === 'active' ? (
                              <>
                                <UserX className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManagersSection;
