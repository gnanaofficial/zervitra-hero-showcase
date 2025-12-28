import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Zervitra</title>
        <meta 
          name="description" 
          content="Read the terms and conditions for using Zervitra's services." 
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
                <span className="text-primary">Terms</span>{" "}
                <span className="text-foreground">& Conditions</span>
              </h1>
              
              <p className="text-muted-foreground mb-8 text-center">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>

              <div className="prose prose-invert max-w-none space-y-8">
                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using Zervitra's services, you agree to be bound by these Terms and Conditions. 
                    If you do not agree to these terms, please do not use our services.
                  </p>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Services</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Zervitra provides web development, app development, UI/UX design, MVP development, digital marketing, 
                    and AI automation services. The specific scope of work for each project will be outlined in a separate 
                    agreement or proposal.
                  </p>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Intellectual Property</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Upon full payment, all deliverables created specifically for the client become the client's property. 
                    Zervitra retains the right to use general techniques, skills, and experience gained during the project. 
                    Zervitra may also include the project in its portfolio unless otherwise agreed.
                  </p>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Payment Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Payment terms will be specified in individual project proposals. Generally, we require a deposit 
                    before starting work, with the remainder due upon completion or according to an agreed milestone schedule.
                  </p>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Confidentiality</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Both parties agree to keep confidential any proprietary information shared during the course of the 
                    project. This includes business strategies, technical specifications, and any other sensitive information.
                  </p>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Zervitra's liability is limited to the amount paid for the services. We are not liable for any 
                    indirect, incidental, or consequential damages arising from the use of our services.
                  </p>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Termination</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Either party may terminate the agreement with written notice. In case of termination, the client 
                    is responsible for payment for work completed up to the termination date.
                  </p>
                </section>

                <section className="premium-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Contact</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For questions about these terms, please contact us at{" "}
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

export default TermsAndConditions;
