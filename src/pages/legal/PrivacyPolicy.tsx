import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Zervitra</title>
        <meta 
          name="description" 
          content="Learn how Zervitra collects, uses, and protects your personal information." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        
        <main className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                <span className="text-primary">Privacy</span>{" "}
                <span className="text-foreground">Policy</span>
              </h1>
              
              <p className="text-muted-foreground mb-8 text-center">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>

              <div className="prose prose-invert max-w-none space-y-8">
                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We collect information you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Name and contact information (email, phone number)</li>
                    <li>Company information</li>
                    <li>Project requirements and specifications</li>
                    <li>Payment information for invoicing purposes</li>
                    <li>Communication records</li>
                  </ul>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Provide and deliver our services</li>
                    <li>Process payments and send invoices</li>
                    <li>Communicate with you about your project</li>
                    <li>Send updates about our services (with your consent)</li>
                    <li>Improve our services and customer experience</li>
                  </ul>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Information Sharing</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell or rent your personal information to third parties. We may share your information 
                    with trusted service providers who assist us in operating our business, such as payment processors 
                    and email service providers. These parties are bound by confidentiality agreements.
                  </p>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal information 
                    against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                    over the Internet is 100% secure.
                  </p>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Retention</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We retain your personal information for as long as necessary to fulfill the purposes for which 
                    it was collected, including to satisfy legal, accounting, or reporting requirements.
                  </p>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Rights</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt out of marketing communications</li>
                    <li>Data portability</li>
                  </ul>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our website may use cookies to enhance your browsing experience. You can control cookie settings 
                    through your browser preferences.
                  </p>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Changes to This Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this privacy policy from time to time. We will notify you of any changes by posting 
                    the new policy on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions about this privacy policy or our data practices, please contact us at{" "}
                    <a href="mailto:hello@zervitra.com" className="text-primary hover:underline">
                      hello@zervitra.com
                    </a>
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
