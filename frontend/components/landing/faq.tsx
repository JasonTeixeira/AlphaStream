"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How are signals generated?",
    answer:
      "Our signals are generated using an ensemble of 5 machine learning models (XGBoost, LightGBM, LSTM, Random Forest, and a meta-ensemble). Each model analyzes 200+ technical indicators computed across multiple timeframes. All models are trained using walk-forward validation to prevent overfitting and ensure no look-ahead bias.",
  },
  {
    question: "What markets do you cover?",
    answer:
      "Currently, we cover major futures (NQ, ES, CL, GC, YM, RTY) and cryptocurrencies (BTC, ETH). We're actively expanding to include more crypto pairs, forex, and eventually equities. Premium users can request specific instruments.",
  },
  {
    question: "Can I use the API programmatically?",
    answer:
      "Yes! Pro and Premium plans include full API access. We offer both REST and WebSocket endpoints. Python and JavaScript SDKs are coming soon. See our API documentation for endpoints, authentication, and examples.",
  },
  {
    question: "How often are models retrained?",
    answer:
      "Models are retrained weekly using rolling windows of historical data. This ensures our models adapt to changing market conditions while maintaining robust out-of-sample performance. We publish retraining metrics in the dashboard.",
  },
  {
    question: "Is this financial advice?",
    answer:
      "No. AlphaStream provides algorithmic trading signals for educational and informational purposes only. This is not financial advice. We are not a registered investment advisor. Trading involves substantial risk of loss. Always do your own research before making trading decisions.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. All plans are month-to-month with no long-term commitment. You can cancel anytime from your account settings. If you cancel, you'll retain access until the end of your current billing period.",
  },
]

export function FAQ() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0A0B]">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">Frequently Asked Questions</h2>
          <p className="text-[#A1A1AA]">Everything you need to know about AlphaStream</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-[#18181B] border border-[#27272A] rounded-lg px-6 data-[state=open]:border-teal/30"
            >
              <AccordionTrigger className="text-[#FAFAFA] hover:text-teal hover:no-underline py-4 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#A1A1AA] pb-4 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
