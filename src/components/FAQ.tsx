import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How much does a project cost?",
    a: "Our pricing starts from ₹25,000 for basic websites and goes up based on complexity. We offer transparent, project-based pricing with no hidden fees. Contact us for a free quote tailored to your needs."
  },
  {
    q: "How long does a typical project take?",
    a: "Basic websites take 2-4 weeks. Web applications and mobile apps typically take 6-12 weeks. MVPs can be delivered in 8-10 weeks. We'll provide a detailed timeline during our initial consultation."
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes! We offer milestone-based payments to make budgeting easier. Typically 30% upfront, 40% at mid-project, and 30% on delivery. We're flexible and can discuss options that work for you."
  },
  {
    q: "What's included in the support period?",
    a: "Our support includes bug fixes, minor adjustments, performance monitoring, security updates, and technical support via email and calls. Support duration varies by plan (1-6 months)."
  },
  {
    q: "Do you provide source code and documentation?",
    a: "Yes! You own all the code we develop. We provide complete source code, technical documentation, and can offer training sessions to help your team maintain the project."
  },
  {
    q: "What technologies do you use?",
    a: "We use modern technologies like React, Next.js, Flutter, Node.js, Python, and cloud platforms (AWS, Google Cloud). We choose the best stack based on your project requirements."
  },
  {
    q: "Do you sign NDAs?",
    a: "Absolutely. We're happy to sign Non-Disclosure Agreements before discussing your project. Your ideas and business information are always kept confidential."
  },
  {
    q: "Can you work with our existing team?",
    a: "Yes! We can collaborate with your in-house team, integrate with your existing systems, or work independently based on your preference."
  }
];

const FAQ = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Got questions? We've got answers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="premium-glass rounded-2xl border border-white/10 px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;