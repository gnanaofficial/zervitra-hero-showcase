import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/payments";
import { format } from "date-fns";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Bell,
  ExternalLink,
  RefreshCw
} from "lucide-react";

interface QuotationResponse {
  id: string;
  quotation_id: string | null;
  amount: number;
  currency: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  clients: {
    company_name: string | null;
    contact_email: string | null;
  } | null;
  projects: {
    title: string;
  } | null;
}

interface QuotationResponsesSectionProps {
  onRefresh?: () => void;
}

export const QuotationResponsesSection = ({ onRefresh }: QuotationResponsesSectionProps) => {
  const [responses, setResponses] = useState<QuotationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      // Fetch recently accepted, rejected, or sent quotations
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          id,
          quotation_id,
          amount,
          currency,
          status,
          created_at,
          updated_at,
          clients(company_name, contact_email),
          projects(title)
        `)
        .in('status', ['accepted', 'rejected', 'sent', 'pending'])
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching responses:', error);
        return;
      }

      setResponses(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'accepted':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          variant: 'default' as const,
          bgColor: 'bg-green-500/10 border-green-500/30',
          iconColor: 'text-green-500',
          label: 'Accepted'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-4 h-4" />,
          variant: 'destructive' as const,
          bgColor: 'bg-red-500/10 border-red-500/30',
          iconColor: 'text-red-500',
          label: 'Rejected'
        };
      case 'sent':
        return {
          icon: <Clock className="w-4 h-4" />,
          variant: 'outline' as const,
          bgColor: 'bg-blue-500/10 border-blue-500/30',
          iconColor: 'text-blue-500',
          label: 'Awaiting Response'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          variant: 'secondary' as const,
          bgColor: 'bg-muted border-border',
          iconColor: 'text-muted-foreground',
          label: status
        };
    }
  };

  const acceptedCount = responses.filter(r => r.status === 'accepted').length;
  const rejectedCount = responses.filter(r => r.status === 'rejected').length;
  const pendingCount = responses.filter(r => r.status === 'sent' || r.status === 'pending').length;

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="text-2xl font-bold text-green-500">{acceptedCount}</div>
          <div className="text-xs text-muted-foreground">Accepted</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="text-2xl font-bold text-red-500">{rejectedCount}</div>
          <div className="text-xs text-muted-foreground">Rejected</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-500">{pendingCount}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
      </div>

      {/* Response List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {responses.map((response, index) => {
          const config = getStatusConfig(response.status);
          return (
            <motion.div
              key={response.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-xl border ${config.bgColor} transition-colors`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <span className={config.iconColor}>{config.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground text-sm truncate">
                        {response.clients?.company_name || 'Unknown Client'}
                      </h4>
                      <Badge variant={config.variant} className="text-xs capitalize shrink-0">
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {response.projects?.title || 'Untitled Project'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-primary">
                        {response.quotation_id}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(response.updated_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-foreground">
                    {formatCurrency(response.amount, response.currency)}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {responses.length === 0 && (
          <div className="text-center py-8">
            <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No quotation responses yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Responses will appear here when clients accept or reject quotations
            </p>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => {
          fetchResponses();
          onRefresh?.();
        }}
        className="w-full"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
};
