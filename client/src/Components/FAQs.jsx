import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is E-healthcare management?",
      answer:
        "E-healthcare management is the use of technology to streamline and enhance the management of healthcare services. It includes the integration of various healthcare processes into a digital platform for easier access, management, and delivery of healthcare services.",
    },
    {
      question: "How can I book an appointment?",
      answer:
        "You can book an appointment by logging into your account, navigating to the appointments section, and selecting an available time slot with your preferred healthcare provider.",
    },
    {
      question: "Is my medical information secure?",
      answer:
        "Yes, your medical information is stored securely following industry standards and regulations to ensure your privacy and the confidentiality of your health records.",
    },
    {
      question: "Can I access my medical history online?",
      answer:
        "Yes, you can access your medical history by logging into your account. Go to the medical records section to view and download your past medical reports and history.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can contact our customer support team via the 'send us a message' section on our website or by calling our support helpline no. at (123) 456-7890.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-teal-600">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left text-lg font-medium text-teal-600 focus:outline-none"
            >
              <span>{faq.question}</span>
              {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {activeIndex === index && (
              <div className="mt-2 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
