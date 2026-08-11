import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";

const faqs = [
  {
    question: "Do you offer emergency locksmith services in Chicago?",
    answer:
      "Yes, our team provides emergency lockout and locksmith services throughout the Chicago area during business hours, including same-day service for most jobs.",
  },
  {
    question: "Can you duplicate keys on-site?",
    answer:
      "Yes. Our mobile locksmiths carry the tools and key blanks needed to cut duplicate keys on-site. You can also visit our storefronts.",
  },
  {
    question: "What areas do you serve in the Chicago area?",
    answer:
      "We serve Chicago and the surrounding suburbs, including Elk Grove Village, Lombard, Wheaton, Schaumburg, Oak Brook, and more. Contact us to confirm coverage in your area.",
  },
  {
    question: "Do you provide commercial locksmith services?",
    answer:
      "Yes, we install and service commercial-grade locks, master key systems, and access control for offices, retail spaces, and multi-unit buildings.",
  },
  {
    question: "What should I do if I lose my only car key?",
    answer:
      "Give us a call — our mobile locksmiths can cut and program a replacement key or fob on-site for most makes and models, often the same day.",
  },
  {
    question: "Can you rekey my home after a move?",
    answer:
      "Yes, rekeying your locks after a move is one of our most common residential services. We can rekey your existing hardware or install new locks entirely.",
  },
  {
    question: "What types of safes do you work with?",
    answer:
      "We sell, install, service, and open a wide range of safes for both residential and commercial clients, including combination and electronic lock upgrades.",
  },
];

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div id ="faqs" className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-bold text-gray-800 text-lg">{question}</span>
        {isOpen ? (
          <X className="w-5 h-5 text-red-600 flex-shrink-0" strokeWidth={3} />
        ) : (
          <ChevronDown className="w-5 h-5 text-red-600 flex-shrink-0" strokeWidth={3} />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-gray-50 px-6 md:px-16 py-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
          Home, Business &amp; Auto Locksmith FAQs
        </h2>
        <div className="w-24 h-1 bg-red-600 mb-10" />

        <div className="bg-white rounded-md shadow-sm px-6 md:px-8">
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
