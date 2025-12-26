import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/payments';
import {
  FileEdit,
  Send,
  Trash2,
  Loader2,
  FileText,
  RefreshCw
} from 'lucide-react';

interface DraftQuotation {
  id: string;
  quotation_id: string;
  amount: number;
  currency: string;
  created_at: string;
  valid_until: string | null;
  pdf_url: string | null;
  clients: {
    company_name: string | null;
    contact_email: string | null;
  } | null;
  projects: {
    title: string;
  } | null;
}

interface DraftQuotationsSectionProps {
  onEdit?: (quotationId: string) => void;
  onRefresh?: () => void;
}

export function DraftQuotationsSection({ onEdit, onRefresh }: DraftQuotationsSectionProps) {
  const [drafts, setDrafts] = useState<DraftQuotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDrafts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quotations')
      .select(`
        id,
        quotation_id,
        amount,
        currency,
        created_at,
        valid_until,
        pdf_url,
        clients (company_name, contact_email),
        projects (title)
      `)
      .eq('status', 'draft')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDrafts(data as unknown as DraftQuotation[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleSendQuotation = async (draft: DraftQuotation) => {
    if (!draft.clients?.contact_email) {
      toast({
        title: "Error",
        description: "Client email not found",
        variant: "destructive"
      });
      return;
    }

    setSendingId(draft.id);

    try {
      // Update status to 'sent'
      const { error: updateError } = await supabase
        .from('quotations')
        .update({ status: 'sent' })
        .eq('id', draft.id);

      if (updateError) throw updateError;

      // Send email
      const { error: emailError } = await supabase.functions.invoke('send-quotation-email', {
        body: {
          to: draft.clients.contact_email,
          clientName: draft.clients.company_name || 'Valued Customer',
          quotationId: draft.quotation_id,
          amount: draft.amount.toFixed(2),
          currency: draft.currency || 'USD',
          validUntil: draft.valid_until ? format(new Date(draft.valid_until), 'MMMM d, yyyy') : 'N/A',
          pdfUrl: draft.pdf_url
        }
      });

      if (emailError) {
        console.error('Email send error:', emailError);
        toast({
          title: "Quotation Sent",
          description: "Status updated but email delivery may have failed. Check logs."
        });
      } else {
        toast({
          title: "Quotation Sent",
          description: `Quotation sent to ${draft.clients.contact_email}`
        });
      }

      fetchDrafts();
      onRefresh?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSendingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;

    const { error } = await supabase
      .from('quotations')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete draft",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Deleted",
        description: "Draft quotation deleted"
      });
      fetchDrafts();
      onRefresh?.();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No draft quotations</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {drafts.map((draft) => (
        <motion.div
          key={draft.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/30"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground">
                {draft.quotation_id || 'Unnamed'}
              </h4>
              <Badge variant="outline" className="text-xs">Draft</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {draft.clients?.company_name || 'Unknown Client'} • {draft.projects?.title || 'No Project'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Created {format(new Date(draft.created_at), 'MMM d, yyyy')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right mr-4">
              <div className="font-semibold text-foreground">
                {formatCurrency(draft.amount, draft.currency)}
              </div>
            </div>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit?.(draft.id)}
              className="gap-1"
            >
              <FileEdit className="w-4 h-4" />
              Edit
            </Button>
            
            <Button
              size="sm"
              onClick={() => handleSendQuotation(draft)}
              disabled={sendingId === draft.id}
              className="gap-1"
            >
              {sendingId === draft.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(draft.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
