import { useState, useMemo, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Trash2, 
  Printer,
  Moon,
  Zap,
  CheckCircle,
  Info,
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
  discount: number;
  isFree: boolean;
}

interface ClientDetails {
  id: string;
  name: string;
  phone: string;
  address: string;
  clientId: string;
  email: string;
}

interface QuotationSettings {
  gstPercentage: number;
  exchangeRate: number;
  validityDays: number;
  advancePercentage: number;
}

interface DatabaseClient {
  id: string;
  company_name: string | null;
  contact_email: string | null;
}

const defaultServices: ServiceItem[] = [
  { id: "1", name: "UI/UX", price: 45.95, discount: 10.25, isFree: false },
  { id: "2", name: "FRONT END", price: 57.44, discount: 9.00, isFree: false },
  { id: "3", name: "BACKEND", price: 57.44, discount: 15.00, isFree: false },
  { id: "4", name: "DATABASE", price: 34.46, discount: 13.03, isFree: false },
  { id: "5", name: "DOMAIN", price: 0, discount: 0, isFree: true },
  { id: "6", name: "HOSTING", price: 0, discount: 0, isFree: true },
  { id: "7", name: "TESTING", price: 0, discount: 0, isFree: true },
];

const complimentaryAddons = [
  "Weekly Updates",
  "SSL",
  "Business Email",
  "Lifetime Support",
  "Confirmation Emails",
  "WHOIS Privacy",
  "User Account Management",
];

const QuotationGenerator = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isDarkPreview, setIsDarkPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [clients, setClients] = useState<DatabaseClient[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    id: "",
    name: "Sandeep Goud",
    phone: "+919951999114",
    address: "Settipalli, kamam dist",
    clientId: "Z0701-IND-2509",
    email: "",
  });

  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  
  const [settings, setSettings] = useState<QuotationSettings>({
    gstPercentage: 0,
    exchangeRate: 87.05,
    validityDays: 7,
    advancePercentage: 67,
  });

  const [selectedAddons, setSelectedAddons] = useState<string[]>(complimentaryAddons);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('id, company_name, contact_email');
    
    if (!error && data) {
      setClients(data);
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setClientDetails(prev => ({
        ...prev,
        id: client.id,
        name: client.company_name || 'Unnamed Client',
        email: client.contact_email || '',
        clientId: `Z-${client.id.substring(0, 8).toUpperCase()}`,
      }));
    }
  };

  const quotationId = useMemo(() => {
    const date = new Date();
    return `${format(date, "ddMM")}-Z0701-QN01`;
  }, []);

  const calculations = useMemo(() => {
    const subtotal = services.reduce((acc, service) => {
      if (service.isFree) return acc;
      const net = service.price * (1 - service.discount / 100);
      return acc + net;
    }, 0);

    const totalDiscount = services.reduce((acc, service) => {
      if (service.isFree) return acc;
      return acc + (service.price * service.discount / 100);
    }, 0);

    const gstAmount = subtotal * (settings.gstPercentage / 100);
    const netPayableUSD = subtotal + gstAmount;
    const netPayableINR = netPayableUSD * settings.exchangeRate;

    return {
      subtotal,
      totalDiscount,
      gstAmount,
      netPayableUSD,
      netPayableINR,
    };
  }, [services, settings.gstPercentage, settings.exchangeRate]);

  const handleAddService = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      name: "NEW SERVICE",
      price: 0,
      discount: 0,
      isFree: false,
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

  const handleSaveQuotation = async () => {
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
          description: "No project found for this client. Please create a project first.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }

      const { error } = await supabase
        .from('quotations')
        .insert({
          client_id: selectedClientId,
          project_id: projects[0].id,
          amount: calculations.netPayableUSD,
          currency: 'USD',
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quotation saved to database"
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
        description: "Client email is required to send quotation",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      const validUntil = format(addDays(new Date(), settings.validityDays), "MMMM d, yyyy");
      
      const response = await supabase.functions.invoke('send-quotation-email', {
        body: {
          to: clientDetails.email,
          clientName: clientDetails.name,
          quotationId: quotationId,
          amount: calculations.netPayableUSD.toFixed(2),
          currency: 'USD',
          validUntil: validUntil,
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Quotation sent to client's email"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send email. Make sure RESEND_API_KEY is configured.",
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
          <title>Quotation - ${quotationId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', system-ui, sans-serif; 
              background: white;
              color: #1a1a1a;
            }
            ${printContent.querySelector('style')?.textContent || ''}
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

  const getNetPrice = (service: ServiceItem) => {
    if (service.isFree) return 0;
    return service.price * (1 - service.discount / 100);
  };

  return (
    <>
      <Helmet>
        <title>Quotation Generator - Admin | Zervitra</title>
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
                <h1 className="text-3xl font-bold text-foreground">Quotation Generator</h1>
                <p className="text-muted-foreground mt-1">Create and export professional quotations</p>
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
                  onClick={handleSaveQuotation} 
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
                {/* Client Details */}
                <Card className="premium-glass border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Client Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Existing Client</Label>
                      <Select value={selectedClientId} onValueChange={handleClientSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a client from database..." />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.company_name || 'Unnamed Client'} - {client.contact_email || 'No email'}
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
                        <Label>Client ID</Label>
                        <Input
                          value={clientDetails.clientId}
                          onChange={(e) => setClientDetails({ ...clientDetails, clientId: e.target.value })}
                          placeholder="Z0701-IND-2509"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={clientDetails.email}
                          onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                          placeholder="client@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={clientDetails.phone}
                          onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
                          placeholder="+91XXXXXXXXXX"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={clientDetails.address}
                        onChange={(e) => setClientDetails({ ...clientDetails, address: e.target.value })}
                        placeholder="Enter address"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Services */}
                <Card className="premium-glass border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Services</CardTitle>
                    <Button size="sm" onClick={handleAddService} className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Service
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
                            className="font-medium"
                          />
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Price ($)</Label>
                            <Input
                              type="number"
                              value={service.isFree ? '' : service.price}
                              onChange={(e) => handleServiceChange(service.id, 'price', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              disabled={service.isFree}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Discount (%)</Label>
                            <Input
                              type="number"
                              value={service.isFree ? '' : service.discount}
                              onChange={(e) => handleServiceChange(service.id, 'discount', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              disabled={service.isFree}
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`free-${service.id}`}
                                checked={service.isFree}
                                onCheckedChange={(checked) => handleServiceChange(service.id, 'isFree', checked)}
                              />
                              <Label htmlFor={`free-${service.id}`} className="text-sm">Free</Label>
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>GST (%)</Label>
                        <Input
                          type="number"
                          value={settings.gstPercentage}
                          onChange={(e) => setSettings({ ...settings, gstPercentage: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Exchange Rate (₹ per $)</Label>
                        <Input
                          type="number"
                          value={settings.exchangeRate}
                          onChange={(e) => setSettings({ ...settings, exchangeRate: parseFloat(e.target.value) || 0 })}
                          placeholder="87.05"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Validity (Days)</Label>
                        <Input
                          type="number"
                          value={settings.validityDays}
                          onChange={(e) => setSettings({ ...settings, validityDays: parseInt(e.target.value) || 7 })}
                          placeholder="7"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Advance Payment (%)</Label>
                        <Input
                          type="number"
                          value={settings.advancePercentage}
                          onChange={(e) => setSettings({ ...settings, advancePercentage: parseInt(e.target.value) || 67 })}
                          placeholder="67"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Complimentary Add-ons */}
                <Card className="premium-glass border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Complimentary Add-ons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {complimentaryAddons.map((addon) => (
                        <div key={addon} className="flex items-center gap-2">
                          <Checkbox
                            id={addon}
                            checked={selectedAddons.includes(addon)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAddons([...selectedAddons, addon]);
                              } else {
                                setSelectedAddons(selectedAddons.filter(a => a !== addon));
                              }
                            }}
                          />
                          <Label htmlFor={addon} className="text-sm">{addon}</Label>
                        </div>
                      ))}
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
                  <style>{`
                    .quotation-preview { font-family: 'Segoe UI', system-ui, sans-serif; }
                    .quotation-preview table { width: 100%; border-collapse: collapse; }
                    .quotation-preview th, .quotation-preview td { padding: 12px 16px; text-align: left; }
                  `}</style>
                  
                  <div className={`quotation-preview ${isDarkPreview ? 'text-gray-100' : 'text-gray-900'}`}>
                    {/* Header */}
                    <div className="bg-[#1e1e3f] text-white p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#5956e9] rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold tracking-wider">ZERVITRA</h2>
                            <p className="text-xs text-gray-400 tracking-widest">ZERO BEGINS. VISION LEADS. RESULTS LAST.</p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-gray-400">QUOTATION ID :</span>
                            <span className="font-bold">{quotationId}</span>
                          </div>
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-gray-400">CLIENT ID :</span>
                            <span className="font-bold">{clientDetails.clientId}</span>
                          </div>
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-gray-400">DATE :</span>
                            <span className="font-bold">{format(new Date(), "dd/MMM/yy").toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Client Info Bar */}
                    <div className="bg-[#2d2d5a] text-white px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">To</span>
                          <div className="bg-[#3d3d6a] px-4 py-2 rounded-r-full">
                            <span className="font-semibold text-lg">{clientDetails.name}</span>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div><span className="text-gray-400">Email :</span> {clientDetails.email || 'N/A'}</div>
                          <div><span className="text-gray-400">Phone :</span> {clientDetails.phone}</div>
                          <div><span className="text-gray-400">Address :</span> {clientDetails.address}</div>
                        </div>
                      </div>
                    </div>

                    {/* Quotation Title */}
                    <div className="bg-[#1e1e3f] py-4">
                      <h1 className="text-center text-3xl font-bold tracking-[0.3em] text-[#c8c8ff]">
                        QUOTATION
                      </h1>
                    </div>

                    {/* Services Table */}
                    <div className={`p-6 ${isDarkPreview ? 'bg-[#1a1a2e]' : 'bg-white'}`}>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#2d2d5a] text-white">
                            <th className="py-3 px-4 text-left font-semibold">ITEM/SERVICE</th>
                            <th className="py-3 px-4 text-center font-semibold">PRICE</th>
                            <th className="py-3 px-4 text-center font-semibold">DISCOUNT</th>
                            <th className="py-3 px-4 text-center font-semibold">NET</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((service) => (
                            <tr 
                              key={service.id} 
                              className={`border-b ${isDarkPreview ? 'border-gray-700' : 'border-gray-200'}`}
                            >
                              <td className="py-3 px-4 font-semibold">{service.name}</td>
                              <td className="py-3 px-4 text-center">
                                {service.isFree ? 'FREE' : `$${service.price.toFixed(2)}`}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {service.isFree ? 'NA' : `${service.discount.toFixed(2)}%`}
                              </td>
                              <td className="py-3 px-4 text-center font-bold">
                                ${getNetPrice(service).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Notes and Summary */}
                      <div className="grid grid-cols-2 gap-6 mt-6">
                        {/* Important Notes */}
                        <div className={`p-4 rounded-lg border ${isDarkPreview ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                          <div className="flex items-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-muted-foreground" />
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Important Notes</h4>
                          </div>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• USD Values are approximate using ₹ {settings.exchangeRate} = $ 1. Per-line USD may not sum exactly due to rounding.</li>
                            <li>• The total after discount is exactly ₹{calculations.netPayableINR.toFixed(0)}/- ($ {calculations.netPayableUSD.toFixed(2)}).</li>
                            <li>• Project timeline will be shared after confirmation of order.</li>
                          </ul>
                        </div>

                        {/* Summary */}
                        <div className={`p-4 rounded-lg border ${isDarkPreview ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span className="font-bold">${(calculations.subtotal + calculations.totalDiscount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-red-500">
                              <span>Discount</span>
                              <span>-${calculations.totalDiscount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>GST ({settings.gstPercentage}%)</span>
                              <span>${calculations.gstAmount.toFixed(2)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold text-base">
                              <span>Net Payable (USD)</span>
                              <span>${calculations.netPayableUSD.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-[#f0f0ff] rounded-lg text-center">
                            <div className="text-xs text-purple-600 font-semibold uppercase tracking-wider">
                              Approximate INR Total
                            </div>
                            <div className="text-2xl font-bold text-purple-700">
                              ₹{calculations.netPayableINR.toFixed(0)}/-
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Sections */}
                      <div className="grid grid-cols-3 gap-6 mt-8">
                        {/* Terms & Conditions */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Terms & Conditions</h4>
                          </div>
                          <div className={`p-4 rounded-lg border space-y-3 ${isDarkPreview ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div>
                              <div className="font-semibold text-sm">VALIDITY</div>
                              <p className="text-xs text-muted-foreground">Valid for {settings.validityDays} days from issue. Prices subject to revision thereafter.</p>
                            </div>
                            <div>
                              <div className="font-semibold text-sm">SCOPE</div>
                              <p className="text-xs text-muted-foreground">Limited to quoted services. Additional work charged separately.</p>
                            </div>
                            <div>
                              <div className="font-semibold text-sm">PAYMENT</div>
                              <p className="text-xs text-muted-foreground">{settings.advancePercentage}% advance to confirm. Balance due upon completion.</p>
                            </div>
                          </div>
                        </div>

                        {/* Complimentary Add-ons */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Complimentary Add-ons</h4>
                          </div>
                          <div className={`p-4 rounded-lg border ${isDarkPreview ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedAddons.map((addon) => (
                                <div key={addon} className="flex items-center gap-2 text-xs">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span>{addon}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Authorization */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Authorization</h4>
                          </div>
                          <div className={`p-4 rounded-lg border text-center ${isDarkPreview ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="h-16 flex items-center justify-center">
                              <div className="font-script text-2xl italic text-muted-foreground">
                                Sekhar
                              </div>
                            </div>
                            <div className="font-bold mt-2">K.GNANA SEKHAR</div>
                            <div className={`text-xs px-3 py-1 rounded-full inline-block mt-1 ${isDarkPreview ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              MANAGER
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="text-center mt-8 py-4 border-t border-dashed">
                        <span className="font-semibold">THANKS FOR CHOOSING US</span>
                        <span className="ml-2">🤗</span>
                      </div>
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

export default QuotationGenerator;
