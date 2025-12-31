import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CheckCircle2, Loader2, Building2, Mail, Phone, Globe, MapPin, FileText } from 'lucide-react';

interface InquiryFormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  serviceInterest: string;
  projectDescription: string;
  budget: string;
  timeline: string;
}

const ClientInquiryForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<InquiryFormData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: 'India',
    city: '',
    serviceInterest: '',
    projectDescription: '',
    budget: '',
    timeline: ''
  });

  const handleInputChange = (field: keyof InquiryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.email || !formData.phone || !formData.serviceInterest) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Store the inquiry in the database
      const { error } = await supabase
        .from('client_inquiries')
        .insert({
          company_name: formData.companyName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          service_interest: formData.serviceInterest,
          project_description: formData.projectDescription,
          budget: formData.budget,
          timeline: formData.timeline,
          status: 'pending'
        });

      if (error) throw error;

      // Send notification email to admin
      try {
        await supabase.functions.invoke('send-inquiry-notification', {
          body: {
            inquiry: formData
          }
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
      }

      setIsSubmitted(true);
      toast.success('Your inquiry has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Thank You - Zervitra</title>
          <meta name="description" content="Thank you for your inquiry. Our team will contact you shortly." />
        </Helmet>

        <Navbar />

        <main className="min-h-screen bg-background pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="text-center">
                <CardContent className="pt-12 pb-8">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground mb-4">Thank You!</h1>
                  <p className="text-muted-foreground text-lg mb-6">
                    Your inquiry has been submitted successfully. Our team will review your requirements and contact you within 24-48 hours.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 mb-8 text-left">
                    <h3 className="font-semibold mb-2">What happens next?</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Our team will review your project requirements</li>
                      <li>• We'll schedule a call to discuss your needs</li>
                      <li>• You'll receive a detailed quotation after our discussion</li>
                      <li>• Once approved, we'll create your client account</li>
                    </ul>
                  </div>
                  <Button onClick={() => navigate('/')}>
                    Back to Home
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Get Started - Client Inquiry | Zervitra</title>
        <meta name="description" content="Submit your project inquiry to Zervitra. Tell us about your business needs and we'll get back to you with a customized solution." />
        <meta name="keywords" content="client inquiry, project inquiry, business inquiry, get started, Zervitra" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Let's Build Something Amazing
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tell us about your project and requirements. Our team will review your inquiry and reach out to discuss how we can help bring your vision to life.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Project Inquiry Form
                </CardTitle>
                <CardDescription>
                  Please fill out the form below. Fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Company Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      Company Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          placeholder="Your company name"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Person Name</Label>
                        <Input
                          id="contactName"
                          placeholder="Full name"
                          value={formData.contactName}
                          onChange={(e) => handleInputChange('contactName', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@company.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Location
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="UAE">UAE</SelectItem>
                            <SelectItem value="Singapore">Singapore</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Your city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Project Details
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="serviceInterest">Service Interest *</Label>
                        <Select value={formData.serviceInterest} onValueChange={(value) => handleInputChange('serviceInterest', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Web Development">Web Development</SelectItem>
                            <SelectItem value="App Development">App Development</SelectItem>
                            <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                            <SelectItem value="MVP Development">MVP Development</SelectItem>
                            <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                            <SelectItem value="AI & Automation">AI & Automation</SelectItem>
                            <SelectItem value="Multiple Services">Multiple Services</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectDescription">Project Description</Label>
                        <Textarea
                          id="projectDescription"
                          placeholder="Tell us about your project, goals, and specific requirements..."
                          value={formData.projectDescription}
                          onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                          rows={5}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="budget">Estimated Budget</Label>
                          <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="< ₹50,000">Less than ₹50,000</SelectItem>
                              <SelectItem value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</SelectItem>
                              <SelectItem value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</SelectItem>
                              <SelectItem value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</SelectItem>
                              <SelectItem value="₹5,00,000 - ₹10,00,000">₹5,00,000 - ₹10,00,000</SelectItem>
                              <SelectItem value="> ₹10,00,000">More than ₹10,00,000</SelectItem>
                              <SelectItem value="Not Sure">Not Sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeline">Expected Timeline</Label>
                          <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ASAP">ASAP</SelectItem>
                              <SelectItem value="1-2 Weeks">1-2 Weeks</SelectItem>
                              <SelectItem value="1 Month">1 Month</SelectItem>
                              <SelectItem value="1-3 Months">1-3 Months</SelectItem>
                              <SelectItem value="3-6 Months">3-6 Months</SelectItem>
                              <SelectItem value="Flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Inquiry'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => navigate('/')}
                    >
                      Cancel
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    By submitting this form, you agree to our{' '}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>{' '}
                    and{' '}
                    <a href="/terms" className="text-primary hover:underline">Terms of Service</a>.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ClientInquiryForm;
