import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What's included in the support period?",
    a: "Our support period includes bug fixes, minor feature adjustments, performance monitoring, security updates, and technical support via email and scheduled calls. We ensure your project runs smoothly after launch."
  },
  {
    q: "Can I upgrade my plan later?",
    a: "Absolutely! You can upgrade at any time. We'll credit your current plan towards the upgrade cost and seamlessly transition your project to include additional features and support."
  },
  {
    q: "Do you offer custom pricing for enterprise clients?",
    a: "Yes, we offer custom solutions for larger organizations with specific requirements. Our enterprise solutions include dedicated teams, custom SLAs, advanced security features, and tailored pricing. Contact us for a personalized quote."
  },
  {
    q: "What if I'm not satisfied with the results?",
    a: "We offer a 30-day satisfaction guarantee. If you're not happy with the deliverables, we'll work closely with you to address all concerns. If we still can't meet your expectations, we provide a full refund—no questions asked."
  },
  {
    q: "How long does a typical project take?",
    a: "Project timelines vary based on complexity. A Starter project typically takes 4-6 weeks, Growth projects run 8-12 weeks, and Scale projects may take 12-16 weeks. We'll provide a detailed timeline during our initial consultation."
  },
  {
    q: "What technologies do you use?",
    a: "We use modern, battle-tested technologies including React, Next.js, Flutter, Node.js, Python, and cloud platforms like AWS and Google Cloud. We choose the best stack based on your project requirements and scalability needs."
  },
  {
    q: "Do you provide source code and documentation?",
    a: "Yes! You own all the code we develop for you. We provide complete source code, technical documentation, and deployment guides. We also offer training sessions to help your team maintain the project."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept bank transfers, credit/debit cards, and UPI payments. For larger projects, we offer milestone-based payment plans to make budgeting easier for you."
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, we're happy to sign Non-Disclosure Agreements before discussing your project details. Your ideas and business information are always kept confidential."
  },
  {
    q: "What happens after the project is completed?",
    a: "After launch, you'll have the support period included in your plan. Beyond that, we offer ongoing maintenance packages, feature additions, and scaling support. Many of our clients continue working with us for years!"
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
