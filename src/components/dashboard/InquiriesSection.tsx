import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Mail, Phone, Eye, UserPlus, RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Inquiry {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string;
  phone: string;
  country: string | null;
  city: string | null;
  service_interest: string;
  project_description: string | null;
  budget: string | null;
  timeline: string | null;
  status: string;
  notes: string | null;
  assigned_manager_id: string | null;
  converted_to_client_id: string | null;
  created_at: string;
}

interface InquiriesSectionProps {
  onRefresh?: () => void;
  onConvertToClient?: (inquiry: Inquiry) => void;
}

const InquiriesSection = ({ onRefresh, onConvertToClient }: InquiriesSectionProps) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase
        .from('client_inquiries' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10) as any);

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const { error } = await (supabase
        .from('client_inquiries' as any)
        .update({ status })
        .eq('id', inquiryId) as any);

      if (error) throw error;

      toast.success(`Inquiry marked as ${status}`);
      fetchInquiries();
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast.error('Failed to update inquiry status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="gap-1"><Phone className="w-3 h-3" /> Contacted</Badge>;
      case 'converted':
        return <Badge variant="default" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Converted</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
        <CardTitle className="text-lg">Client Inquiries</CardTitle>
        <Button variant="ghost" size="sm" onClick={fetchInquiries}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {inquiries.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No inquiries yet. Share the public form link to collect leads.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{inquiry.company_name}</p>
                        {inquiry.city && inquiry.country && (
                          <p className="text-xs text-muted-foreground">
                            {inquiry.city}, {inquiry.country}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{inquiry.contact_name || inquiry.email}</p>
                        <div className="flex gap-2">
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                          </a>
                          <a
                            href={`tel:${inquiry.phone}`}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{inquiry.service_interest}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(`mailto:${inquiry.email}`, '_blank')}>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`tel:${inquiry.phone}`, '_blank')}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </DropdownMenuItem>
                          {inquiry.status === 'pending' && (
                            <DropdownMenuItem onClick={() => updateInquiryStatus(inquiry.id, 'contacted')}>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Mark Contacted
                            </DropdownMenuItem>
                          )}
                          {inquiry.status !== 'converted' && inquiry.status !== 'rejected' && (
                            <>
                              <DropdownMenuItem onClick={() => onConvertToClient?.(inquiry)}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Convert to Client
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => updateInquiryStatus(inquiry.id, 'rejected')}
                                className="text-destructive"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Mark Rejected
                              </DropdownMenuItem>
                            </>
                          )}
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

export default InquiriesSection;
