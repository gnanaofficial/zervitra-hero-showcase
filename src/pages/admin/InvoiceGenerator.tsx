import { useState, useMemo, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  Printer,
  Moon,
  Zap,
  Mail,
  Save,
  Loader2
} from "lucide-react";
import { format, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ClientDetails {
  id: string;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientId: string;
}

interface InvoiceSettings {
  gstPercentage: number;
  exchangeRate: number;
  paymentTermsDays: number;
}

interface DatabaseClient {
  id: string;
  company_name: string | null;
  contact_email: string | null;
  client_id: string | null;
  phone: string | null;
  address: string | null;
}

const defaultServices: ServiceItem[] = [
  { id: "1", name: "Website Development", price: 500, quantity: 1 },
  { id: "2", name: "UI/UX Design", price: 300, quantity: 1 },
];

const InvoiceGenerator = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isDarkPreview, setIsDarkPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [clients, setClients] = useState<DatabaseClient[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    id: "",
    uuid: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    clientId: "",
  });

  const [invoiceId, setInvoiceId] = useState<string>("");
  const [invoiceSequences, setInvoiceSequences] = useState<{
    clientSequence: number;
    globalSequence: number;
    financialYear: string;
  } | null>(null);

  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  
  const [settings, setSettings] = useState<InvoiceSettings>({
    gstPercentage: 18,
    exchangeRate: 87.05,
    paymentTermsDays: 30,
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('id, company_name, contact_email, phone, address');
    
    if (!error && data) {
      setClients(data.map(c => ({
        ...c,
        client_id: (c as any).client_id || null,
      })));
    }
  };

  const handleClientSelect = async (clientUuid: string) => {
    setSelectedClientId(clientUuid);
    const client = clients.find(c => c.id === clientUuid);
    if (client) {
      setClientDetails({
        id: client.client_id || '',
        uuid: client.id,
        name: client.company_name || 'Unnamed Client',
        email: client.contact_email || '',
        phone: client.phone || '',
        address: client.address || '',
        clientId: client.client_id || `TEMP-${client.id.substring(0, 8).toUpperCase()}`,
      });

      // Generate Invoice ID using database function
      try {
        const clientIdToUse = client.client_id || `TEMP-${client.id.substring(0, 8).toUpperCase()}`;
        
        const { data: invoiceData, error: invoiceError } = await supabase
          .rpc('generate_invoice_id', {
            p_client_uuid: client.id,
            p_client_id: clientIdToUse,
            p_version: 1,
            p_date: new Date().toISOString().split('T')[0]
          });

        if (invoiceError) {
          console.error('Error generating invoice ID:', invoiceError);
          setInvoiceId(`INV-${format(new Date(), "yyyyMMdd")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
        } else if (invoiceData && invoiceData.length > 0) {
          setInvoiceId(invoiceData[0].invoice_id);
          setInvoiceSequences({
            clientSequence: invoiceData[0].client_sequence,
            globalSequence: invoiceData[0].global_sequence,
            financialYear: invoiceData[0].financial_year
          });
        }
      } catch (e) {
        console.error("Error generating invoice ID", e);
        setInvoiceId(`INV-${Date.now()}`);
      }
    }
  };

  const dueDate = useMemo(() => {
    return addDays(new Date(), settings.paymentTermsDays);
  }, [settings.paymentTermsDays]);

  const calculations = useMemo(() => {
    const subtotal = services.reduce((acc, service) => {
      return acc + (service.price * service.quantity);
    }, 0);

    const gstAmount = subtotal * (settings.gstPercentage / 100);
    const totalUSD = subtotal + gstAmount;
    const totalINR = totalUSD * settings.exchangeRate;

    return {
      subtotal,
      gstAmount,
      totalUSD,
      totalINR,
    };
  }, [services, settings.gstPercentage, settings.exchangeRate]);

  const handleAddService = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      name: "New Service",
      price: 0,
      quantity: 1,
    };
    setServices([...services, newService]);
  };

  const handleRemoveService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const handleServiceChange = (id: string, field: keyof ServiceItem, value: any) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const handleSaveInvoice = async () => {
    if (!selectedClientId) {
      toast({
        title: "Error",
        description: "Please select a client first",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Get client's project
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('client_id', selectedClientId)
        .limit(1);

      if (!projects?.length) {
        toast({
          title: "Error",
          description: "No project found for this client",
          variant: "destructive"
        });
        return;
      }

      const servicesData = services.map(s => ({
        description: s.name,
        amount: s.price * s.quantity,
        price: s.price,
        quantity: s.quantity
      }));

      const { error } = await supabase
        .from('invoices')
        .insert({
          client_id: selectedClientId,
          project_id: projects[0].id,
          amount: calculations.subtotal,
          currency: 'USD',
          status: 'pending',
          due_date: dueDate.toISOString(),
          invoice_id: invoiceId,
          version: 1,
          client_sequence: invoiceSequences?.clientSequence || 1,
          global_sequence: invoiceSequences?.globalSequence || 1,
          financial_year: invoiceSequences?.financialYear || '',
          tax: calculations.gstAmount,
          total: calculations.totalUSD,
          services: servicesData,
          tax_percent: settings.gstPercentage,
        } as any);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invoice saved successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendEmail = async () => {
    if (!clientDetails.email) {
      toast({
        title: "Error",
        description: "Client email is required",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await supabase.functions.invoke('send-quotation-email', {
        body: {
          to: clientDetails.email,
          clientName: clientDetails.name,
          quotationId: invoiceId,
          amount: calculations.totalUSD.toFixed(2),
          currency: 'USD',
          validUntil: format(dueDate, "MMMM d, yyyy"),
          services: services.map(s => ({
            description: s.name,
            amount: s.price * s.quantity
          }))
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Invoice sent to client's email"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send email",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoiceId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', system-ui, sans-serif; background: white; color: #1a1a1a; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <Helmet>
        <title>Invoice Generator - Admin | Zervitra</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        
        <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1800px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground">Invoice Generator</h1>
                <p className="text-muted-foreground mt-1">Create and export professional invoices - {invoiceId || 'Select a client'}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDarkPreview(!isDarkPreview)}
                  className="rounded-full"
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSaveInvoice} 
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className="gap-2"
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  Email
                </Button>
                <Button onClick={handlePrint} className="gap-2">
                  <Printer className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left Side - Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Client Selection */}
                <Card className="premium-glass border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Client Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Existing Client</Label>
                      <Select value={selectedClientId} onValueChange={handleClientSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a client..." />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.company_name || 'Unnamed Client'} {client.client_id ? `(${client.client_id})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Client Name</Label>
                        <Input
                          value={clientDetails.name}
                          onChange={(e) => setClientDetails({ ...clientDetails, name: e.target.value })}
                          placeholder="Enter client name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={clientDetails.email}
                          onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                          placeholder="client@email.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Services */}
                <Card className="premium-glass border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Line Items</CardTitle>
                    <Button size="sm" onClick={handleAddService} className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Item
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30">
                        <div className="flex-1 grid grid-cols-4 gap-3">
                          <Input
                            value={service.name}
                            onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                            placeholder="Service name"
                            className="col-span-2"
                          />
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Price ($)</Label>
                            <Input
                              type="number"
                              value={service.price}
                              onChange={(e) => handleServiceChange(service.id, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <div className="flex-1 space-y-1">
                              <Label className="text-xs text-muted-foreground">Qty</Label>
                              <Input
                                type="number"
                                value={service.quantity}
                                onChange={(e) => handleServiceChange(service.id, 'quantity', parseInt(e.target.value) || 1)}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveService(service.id)}
                              className="text-destructive hover:text-destructive h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Settings */}
                <Card className="premium-glass border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>GST (%)</Label>
                        <Input
                          type="number"
                          value={settings.gstPercentage}
                          onChange={(e) => setSettings({ ...settings, gstPercentage: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Exchange Rate (₹/$)</Label>
                        <Input
                          type="number"
                          value={settings.exchangeRate}
                          onChange={(e) => setSettings({ ...settings, exchangeRate: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Terms (Days)</Label>
                        <Input
                          type="number"
                          value={settings.paymentTermsDays}
                          onChange={(e) => setSettings({ ...settings, paymentTermsDays: parseInt(e.target.value) || 30 })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Side - Live Preview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24"
              >
                <div 
                  ref={printRef}
                  className={`rounded-2xl shadow-2xl overflow-hidden ${isDarkPreview ? 'bg-[#1a1a2e]' : 'bg-white'}`}
                  style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}
                >
                  <div className={`p-8 ${isDarkPreview ? 'text-gray-100' : 'text-gray-900'}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#5956e9] rounded-xl flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold tracking-wider">ZERVITRA</h2>
                          <p className="text-xs text-gray-500">ZERO BEGINS. VISION LEADS. RESULTS LAST.</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <h3 className="text-2xl font-bold text-[#5956e9]">INVOICE</h3>
                        <p className="text-sm text-gray-500">{invoiceId}</p>
                      </div>
                    </div>

                    {/* Client & Invoice Info */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div>
                        <p className="text-sm font-semibold text-gray-500 mb-2">BILL TO</p>
                        <p className="font-bold text-lg">{clientDetails.name || 'Client Name'}</p>
                        <p className="text-sm">{clientDetails.email || 'email@example.com'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Date: {format(new Date(), "MMM d, yyyy")}</p>
                        <p className="text-sm text-gray-500">Due Date: {format(dueDate, "MMM d, yyyy")}</p>
                      </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full mb-8">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 font-semibold">Description</th>
                          <th className="text-right py-3 font-semibold">Qty</th>
                          <th className="text-right py-3 font-semibold">Price</th>
                          <th className="text-right py-3 font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((service) => (
                          <tr key={service.id} className="border-b border-gray-100">
                            <td className="py-3">{service.name}</td>
                            <td className="text-right py-3">{service.quantity}</td>
                            <td className="text-right py-3">${service.price.toFixed(2)}</td>
                            <td className="text-right py-3">${(service.price * service.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span>${calculations.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">GST ({settings.gstPercentage}%)</span>
                          <span>${calculations.gstAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t-2 border-gray-200 pt-2 font-bold text-lg">
                          <span>Total (USD)</span>
                          <span className="text-[#5956e9]">${calculations.totalUSD.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Total (INR)</span>
                          <span>₹{calculations.totalINR.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                      <p>Thank you for your business!</p>
                      <p className="mt-1">Payment due within {settings.paymentTermsDays} days</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default InvoiceGenerator;
