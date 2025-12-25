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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  discount: number;
  isFree: boolean;
}

interface ClientDetails {
  id: string;
  uuid: string;
  name: string;
  phone: string;
  address: string;
  clientId: string;
  email: string;
}

import { SignaturePad } from "@/components/ui/SignaturePad";

interface QuotationSettings {
  gstPercentage: number;
  exchangeRate: number;
  validityDays: number;
  advancePercentage: number;
  signatoryName: string;
  signatoryRole: string;
  signatureImage?: string | null;
}

interface DatabaseClient {
  id: string;
  company_name: string | null;
  contact_email: string | null;
  client_id: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
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
    uuid: "",
    name: "",
    phone: "",
    address: "",
    clientId: "",
    email: "",
  });

  const [quotationId, setQuotationId] = useState<string>("");
  const [savedPdfUrl, setSavedPdfUrl] = useState<string | null>(null);
  const [quotationSequences, setQuotationSequences] = useState<{
    clientSequence: number;
    globalSequence: number;
  } | null>(null);

  const [services, setServices] = useState<ServiceItem[]>(defaultServices);

  const [settings, setSettings] = useState<QuotationSettings>({
    gstPercentage: 0,
    exchangeRate: 87.05,
    validityDays: 7,
    advancePercentage: 67,
    signatoryName: "K.Gnana Sekhar",
    signatoryRole: "MANAGER",
    signatureImage: "/src/Resources/default-signature.png",
  });

  const [selectedAddons, setSelectedAddons] = useState<string[]>(complimentaryAddons);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('id, company_name, contact_email, phone, address, city, state, country');

    if (!error && data) {
      // Type assertion to handle the new columns that may not be in types yet
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
      const fullAddress = [client.address, client.city, client.state, client.country]
        .filter(Boolean)
        .join(', ');
      
      setClientDetails({
        id: client.client_id || '',
        uuid: client.id,
        name: client.company_name || 'Unnamed Client',
        email: client.contact_email || '',
        phone: client.phone || '',
        address: fullAddress,
        clientId: client.client_id || `TEMP-${client.id.substring(0, 8).toUpperCase()}`,
      });

      // Generate Quotation ID using database function
      try {
        const clientIdToUse = client.client_id || `TEMP-${client.id.substring(0, 8).toUpperCase()}`;
        
        const { data: quotationData, error: quotationError } = await supabase
          .rpc('generate_quotation_id', {
            p_client_uuid: client.id,
            p_client_id: clientIdToUse,
            p_version: 1
          });

        if (quotationError) {
          console.error('Error generating quotation ID:', quotationError);
          setQuotationId(`QN1-GEN-${Date.now().toString().slice(-4)}`);
        } else if (quotationData && quotationData.length > 0) {
          setQuotationId(quotationData[0].quotation_id);
          setQuotationSequences({
            clientSequence: quotationData[0].client_sequence,
            globalSequence: quotationData[0].global_sequence
          });
        }
      } catch (e) {
        console.error("Error generating quotation ID", e);
        setQuotationId(`QN-${Date.now()}`);
      }
    }
  };

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

  // Helper function to generate PDF from the preview
  const generatePDF = async (): Promise<Blob | null> => {
    if (!printRef.current) return null;
    
    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: isDarkPreview ? '#000000' : '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    return pdf.output('blob');
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
    if (!quotationId) {
      toast({
        title: "Error",
        description: "Quotation ID could not be generated. Please try again or select a different client.",
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

      // Generate PDF
      toast({ title: "Generating PDF...", description: "Please wait" });
      const pdfBlob = await generatePDF();
      
      let pdfUrl: string | null = null;
      
      if (pdfBlob) {
        // Upload PDF to Supabase storage
        const fileName = `${quotationId.replace(/[^a-zA-Z0-9-]/g, '_')}_${Date.now()}.pdf`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('quotations')
          .upload(fileName, pdfBlob, {
            contentType: 'application/pdf',
            upsert: true
          });

        if (uploadError) {
          console.error('PDF upload error:', uploadError);
          toast({
            title: "Warning",
            description: "PDF upload failed, but quotation will be saved without PDF",
            variant: "destructive"
          });
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('quotations')
            .getPublicUrl(fileName);
          pdfUrl = urlData.publicUrl;
        }
      }

      const servicesData = services.map(s => ({
        description: s.name,
        amount: s.isFree ? 0 : s.price * (1 - s.discount / 100),
        price: s.price,
        discount: s.discount,
        isFree: s.isFree
      }));

      const { error } = await supabase
        .from('quotations')
        .insert({
          client_id: selectedClientId,
          project_id: projects[0].id,
          amount: calculations.netPayableUSD,
          currency: 'USD',
          status: 'pending',
          quotation_id: quotationId,
          version: 1,
          client_sequence: quotationSequences?.clientSequence || 1,
          global_sequence: quotationSequences?.globalSequence || 1,
          valid_until: addDays(new Date(), settings.validityDays).toISOString(),
          services: servicesData,
          discount_percent: settings.gstPercentage > 0 ? 0 : calculations.totalDiscount,
          tax_percent: settings.gstPercentage,
          notes: `Validity: ${settings.validityDays} days. Advance: ${settings.advancePercentage}%`,
          pdf_url: pdfUrl
        } as any);

      if (error) throw error;

      // Store the PDF URL for email sending
      if (pdfUrl) {
        setSavedPdfUrl(pdfUrl);
      }

      toast({
        title: "Success",
        description: pdfUrl ? "Quotation saved with PDF to database" : "Quotation saved to database"
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
    if (!quotationId) {
      toast({
        title: "Error",
        description: "Quotation ID is missing, cannot send email.",
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
          signatoryName: settings.signatoryName,
          signatoryRole: settings.signatoryRole,
          services: services.filter(s => !s.isFree).map(s => ({
            description: s.name,
            amount: s.price * (1 - s.discount / 100)
          })),
          pdfUrl: savedPdfUrl
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
    window.print();
  };

  const getNetPrice = (service: ServiceItem) => {
    if (service.isFree) return 0;
    return service.price * (1 - service.discount / 100);
  };

  // Dynamic scale calculation for print
  const printScale = Math.max(0.65, 0.85 - Math.max(0, services.length - 4) * 0.03);
  const printWidth = 100 / printScale;

  return (
    <>
      <Helmet>
        <title>{quotationId ? quotationId : "Quotation Generator - Admin | Zervitra"}</title>
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
                    <div className="space-y-2">
                      <Label>Quotation ID</Label>
                      <Input
                        value={quotationId}
                        onChange={(e) => setQuotationId(e.target.value)}
                        placeholder="QN1-..."
                      />
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Signatory Name</Label>
                        <Input
                          value={settings.signatoryName ?? "K.Gnana Sekhar"}
                          onChange={(e) => setSettings({ ...settings, signatoryName: e.target.value })}
                          placeholder="K.Gnana Sekhar"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Signatory Role</Label>
                        <Input
                          value={settings.signatoryRole ?? "MANAGER"}
                          onChange={(e) => setSettings({ ...settings, signatoryRole: e.target.value })}
                          placeholder="MANAGER"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Digital Signature (Draw below)</Label>
                      <SignaturePad
                        initialData={settings.signatureImage}
                        onSave={(data) => setSettings({ ...settings, signatureImage: data })}
                      />
                      <div className="text-xs text-muted-foreground text-center my-2">- OR -</div>
                      <Label>Upload Signature Image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setSettings({ ...settings, signatureImage: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
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
                <style>{`
                    .quotation-preview { font-family: 'Inter', system-ui, sans-serif; background-color: #f3f4f6; color: #1a1a1a; padding: 40px; }
                    .main-card { background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; max-width: 800px; margin: 0 auto; position: relative; }
                    
                    /* Header */
                    .quotation-header { background-color: #000; color: white; padding: 40px; display: flex; justify-content: space-between; align-items: flex-start; }
                    .logo-box { display: flex; align-items: center; gap: 16px; }
                    .logo-img { height: 48px; width: auto; }
                    .logo-title { font-size: 28px; font-weight: 800; letter-spacing: 0.5px; line-height: 1; }
                    .logo-sub { font-size: 8px; color: #aaa; letter-spacing: 1.5px; margin-top: 6px; font-weight: 600; }
                    
                    .meta-info { text-align: right; font-size: 11px; font-weight: 700; }
                    .meta-row { margin-bottom: 6px; display: flex; justify-content: flex-end; gap: 8px; }
                    .meta-label { color: #888; }
                    
                    /* Client Bar */
                    .client-bar { background-color: #1a1a1a; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 10; margin-top: -1px; }
                    .client-pill-container { display: flex; align-items: center; gap: 12px; }
                    .client-to-label { color: #888; font-size: 12px; }
                    .client-pill { background-color: #222; color: white; padding: 8px 24px; border-radius: 50px; font-size: 18px; font-weight: 700; border: 1px solid #333; }
                    .client-contact { text-align: right; color: white; font-size: 11px; font-weight: 600; line-height: 1.5; }
                    
                    /* Title Strip */
                    .title-strip { background: #4338ca; background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 12px; margin: 0; text-align: center; border-radius: 0 0 40px 40px; }
                    .title-text { color: white; font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; }
                    
                    /* Table */
                    .table-wrapper { padding: 0 40px; margin-bottom: 30px; margin-top: 40px; }
                    .q-table { width: 100%; border-collapse: separate; border-spacing: 0; }
                    .q-table th { background-color: #1a1a1a; color: white; padding: 14px 20px; font-size: 13px; font-weight: 700; text-transform: uppercase; text-align: left; }
                    .q-table th:first-child { border-top-left-radius: 8px; }
                    .q-table th:last-child { border-top-right-radius: 8px; text-align: right; }
                    .q-table th:not(:first-child):not(:last-child) { text-align: center; }
                    
                    .q-table td { padding: 16px 20px; border-bottom: 1px solid #eee; font-size: 14px; font-weight: 600; color: #333; }
                    .q-table tr:nth-child(even) { background-color: #f9fafb; }
                    .q-table td:not(:first-child):not(:last-child) { text-align: center; }
                    .q-table td:last-child { text-align: right; font-weight: 800; }
                    
                    /* Boxes */
                    .content-grid { display: grid; grid-template-columns: 1fr 280px; gap: 30px; padding: 0 40px; margin-bottom: 40px; }
                    .info-box { background: #f9fafb; border-radius: 12px; padding: 24px; border: 1px solid #eee; }
                    .box-title { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 6px; }
                    .notes-list { list-style: none; padding: 0; margin: 0; font-size: 10px; color: #4b5563; line-height: 1.8; }
                    .notes-list li { margin-bottom: 6px; display: flex; gap: 8px; }
                    .bullet { width: 4px; height: 4px; background: #9ca3af; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
                    
                    .total-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px; font-weight: 600; }
                    .total-val { font-weight: 700; }
                    .final-total { border-top: 1px solid #e5e7eb; margin-top: 16px; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; }
                    .final-label { font-size: 15px; font-weight: 800; color: #1f2937; }
                    .final-amount { font-size: 24px; font-weight: 800; color: #111; }
                    
                    .inr-box { background: #eff6ff; border-radius: 8px; padding: 16px; text-align: center; margin-top: 16px; }
                    .inr-label { font-size: 10px; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.5px; }
                    .inr-amount { font-size: 20px; font-weight: 800; color: #2563eb; }
                    
                    /* Footer Cards */
                    .footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; padding: 0 40px 40px; }
                    .footer-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; height: 100%; display: flex; flex-direction: column; }
                    .fc-title { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
                    .fc-dot { width: 6px; height: 6px; border-radius: 50%; }
                    
                    .terms-content { font-size: 10px; color: #4b5563; }
                    .term-item { margin-bottom: 12px; }
                    .term-head { font-weight: 700; color: #111; margin-bottom: 4px; }
                    
                    .addons-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
                    .addon-tag { display: flex; align-items: center; gap: 8px; font-size: 10px; color: #374151; background: #fff; border: 1px solid #eee; padding: 8px 12px; border-radius: 6px; }
                    
                    .sig-area { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; flex: 1; }
                    .sig-draw { font-family: 'Brush Script MT', cursive; font-size: 32px; color: #111; margin-bottom: 12px; transform: rotate(-5deg); }
                    .sig-line { width: 100%; height: 1px; background: #e5e7eb; margin: 12px 0; }
                    .sig-name { font-size: 13px; font-weight: 800; text-transform: uppercase; }
                    .sig-role { background: #f3f4f6; color: #374151; font-size: 9px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-top: 6px; display: inline-block; }
                    
                    .thanks-strip { background: #e5e7eb; padding: 16px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; justify-content: center; gap: 6px; }
                    
                    @media print {
                      @page { size: A4 portrait; margin: 0; }
                      
                      html, body {
                        height: 10mm; /* Collapse original content */
                        overflow: hidden !important;
                        background: #fff !important;
                      }
                      
                      body * {
                        visibility: hidden;
                      }
                      
                      /* Container forces single page view */
                      .quotation-preview { 
                        visibility: visible !important;
                        position: fixed !important;
                        left: 0;
                        top: 0;
                        width: 100vw;
                        height: 100vh;
                        padding: 0 !important;
                        background: white !important;
                        z-index: 99999;
                        display: flow-root; /* Changed from flex to allow normal flow */
                      }
                      
                      .quotation-preview * { 
                        visibility: visible !important; 
                      }
                      
                      .main-card {
                        visibility: visible !important;
                        position: relative;
                        width: ${printWidth}% !important; /* Full Bleed Compensated Width */
                        max-width: none !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                        border-radius: 0 !important;
                        
                        transform: scale(${printScale});
                        transform-origin: top left; /* Scale from top-left corner */
                      }

                      /* Full Bleed Header Section */
                      .quotation-header {
                        width: 100% !important;
                        padding: 30px 50px !important;
                        border-radius: 0 !important;
                      }
                      .client-bar {
                        width: 100% !important;
                        padding: 15px 50px !important;
                      }
                      .title-strip {
                        width: 100% !important;
                        border-radius: 0 0 40px 40px !important; /* Keep the 'tongue' style */
                        margin-bottom: 20px !important;
                      }

                      /* Inset Content Section */
                      .table-wrapper {
                        margin: 40px 50px 20px 50px !important; /* Add Side Margins to Inset */
                        padding: 0 !important;
                      }
                      .content-grid {
                        margin: 0 50px 30px 50px !important; /* Add Side Margins to Inset */
                        padding: 0 !important;
                      }
                      .footer-grid {
                        margin: 0 50px 30px 50px !important; /* Add Side Margins to Inset */
                        padding: 0 !important; 
                      }
                      .thanks-strip {
                        margin: 0 !important;
                      }
                      
                      /* Print Font Size Overrides for Header */
                      .meta-info { font-size: 15px !important; }
                      .meta-row { gap: 12px !important; margin-bottom: 8px !important; }
                      .meta-label { font-size: 15px !important; }
                      .logo-sub { font-size: 15px !important; }
                      .client-contact { font-size: 15px !important; line-height: 1.6 !important; }
                      .client-pill { font-size: 24px !important; padding: 10px 30px !important; }
                      
                      /* Ensure text is black for clarity */
                      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    }
                  `}</style>

                <div className="quotation-preview">
                  <div className="main-card">
                    {/* Header */}
                    <div className="quotation-header">
                      <div className="logo-box">
                        <img src="/src/Resources/logo/zervimain.svg" alt="ZERVITRA" className="logo-img" style={{ height: '60px', width: 'auto' }} />
                      </div>
                      <div className="meta-info">
                        <div className="meta-row">
                          <span className="meta-label">QUOTATION ID :</span>
                          <span>{quotationId}</span>
                        </div>
                        <div className="meta-row">
                          <span className="meta-label">CLIENT ID :</span>
                          <span>{clientDetails.clientId}</span>
                        </div>
                        <div className="meta-row">
                          <span className="meta-label">DATE :</span>
                          <span>{format(new Date(), "dd/MMM/yy").toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Client Bar */}
                    <div className="client-bar">
                      <div className="client-pill-container">
                        {/* removed To label */}
                        <div className="client-pill">{clientDetails.name}</div>
                      </div>
                      <div className="client-contact">
                        <div>Phone : {clientDetails.phone}</div>
                        <div>Address : {clientDetails.address}</div>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="title-strip">
                      <div className="title-text">QUOTATION</div>
                    </div>

                    {/* Table */}
                    <div className="table-wrapper">
                      <table className="q-table">
                        <thead>
                          <tr>
                            <th style={{ width: '45%' }}>ITEM/SERVICE</th>
                            <th>PRICE</th>
                            <th>DISCOUNT</th>
                            <th>NET</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((service) => (
                            <tr key={service.id}>
                              <td>{service.name}</td>
                              <td>{service.isFree ? 'FREE' : `$${service.price.toFixed(2)}`}</td>
                              <td>{service.isFree ? 'NA' : `${service.discount.toFixed(2)}%`}</td>
                              <td>{service.isFree ? '$0.00' : `$${getNetPrice(service).toFixed(2)}`}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Info & Totals Grid */}
                    <div className="content-grid">
                      <div className="info-box">
                        <div className="box-title">
                          <Info className="w-3 h-3" /> IMPORTANT NOTES
                        </div>
                        <ul className="notes-list">
                          <li><div className="bullet"></div> USD Values are approximate using ₹ {settings.exchangeRate} = $ 1.</li>
                          <li><div className="bullet"></div> The total after discount is exactly ₹{calculations.netPayableINR.toFixed(0)}/- ({calculations.netPayableINR.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}).</li>
                          <li><div className="bullet"></div> Project timeline will be shared after confirmation of order.</li>
                        </ul>
                      </div>

                      <div className="info-box" style={{ background: 'white', borderColor: '#e5e7eb' }}>
                        <div className="total-row">
                          <span style={{ color: '#6b7280' }}>Subtotal</span>
                          <span className="total-val">${(calculations.subtotal + calculations.totalDiscount).toFixed(2)}</span>
                        </div>
                        <div className="total-row" style={{ color: '#ef4444' }}>
                          <span>Discount</span>
                          <span className="total-val">-${calculations.totalDiscount.toFixed(2)}</span>
                        </div>
                        <div className="total-row">
                          <span style={{ color: '#6b7280' }}>GST ({settings.gstPercentage}%)</span>
                          <span className="total-val">${calculations.gstAmount.toFixed(2)}</span>
                        </div>

                        <div className="final-total">
                          <span className="final-label">Net Payable (USD)</span>
                          <span className="final-amount">${calculations.netPayableUSD.toFixed(2)}</span>
                        </div>

                        <div className="inr-box">
                          <div className="inr-label">APPROXIMATE INR TOTAL</div>
                          <div className="inr-amount">₹{calculations.netPayableINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/-</div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Cards */}
                    <div className="footer-grid">
                      {/* Terms */}
                      <div className="footer-card">
                        <div className="fc-title">
                          <div className="fc-dot bg-blue-500"></div> TERMS & CONDITIONS
                        </div>
                        <div className="terms-content">
                          <div className="term-item">
                            <div className="term-head">VALIDITY</div>
                            <div>Valid for {settings.validityDays} days from issue.</div>
                          </div>
                          <div className="term-item">
                            <div className="term-head">SCOPE</div>
                            <div>Limited to quoted services.</div>
                          </div>
                          <div className="term-item">
                            <div className="term-head">PAYMENT</div>
                            <div>{settings.advancePercentage}% advance to confirm.</div>
                          </div>
                        </div>
                      </div>

                      {/* Addons */}
                      <div className="footer-card">
                        <div className="fc-title">
                          <div className="fc-dot bg-green-500"></div> COMPLIMENTARY ADD-ONS
                        </div>
                        <div className="addons-grid">
                          {selectedAddons.slice(0, 4).map(addon => (
                            <div key={addon} className="addon-tag">
                              <CheckCircle className="w-3 h-3 text-green-500" /> {addon}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Auth */}
                      <div className="footer-card">
                        <div className="fc-title">
                          <div className="fc-dot bg-purple-500"></div> AUTHORIZATION
                        </div>
                        <div className="sig-area">
                          {settings.signatureImage && (
                            <img
                              src={settings.signatureImage}
                              alt="Signature"
                              className="h-[80px] w-auto mb-2 object-contain mix-blend-multiply"
                              style={{ mixBlendMode: 'multiply' }}
                            />
                          )}
                          <div className="sig-line"></div>
                          <div className="sig-name">{settings.signatoryName}</div>
                          <div className="sig-role">{settings.signatoryRole}</div>
                        </div>
                      </div>
                    </div>

                    <div className="thanks-strip">
                      THANKS FOR CHOOSING US <span className="text-lg">😊</span>
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
