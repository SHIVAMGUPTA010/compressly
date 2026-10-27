/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'Is Compressly truly free to use without limits?',
      answer:
        'Yes, 100%. Compressly is completely free for personal and commercial use. Because compression is computed locally by your own computer or smartphone browser via HTML5 Canvas, we incur no expensive server GPU costs, allowing us to keep the service free forever with no account required.',
    },
    {
      question: 'Are my images uploaded to or stored on any server?',
      answer:
        'No. Never. Your images never leave your computer or phone. The entire compression process takes place in your local web browser using client-side JavaScript. Unlike other image tools that transmit files to third-party cloud servers, Compressly offers total data privacy.',
    },
    {
      question: 'Which image formats are supported?',
      answer:
        'Compressly currently supports JPG, JPEG, PNG, and WebP image formats. You can also convert between formats—such as converting a heavy PNG into a modern lightweight WebP file to save substantial bandwidth.',
    },
    {
      question: 'What is the recommended compression quality setting?',
      answer:
        'Our default setting of 75% delivers the best balance between aggressive file size reduction (often 60% to 85% smaller) and crystal-clear visual fidelity. For photographs intended for printing or high-end portfolios, 85% to 90% is ideal. For website banners or email attachments, 65% to 75% works wonders.',
    },
    {
      question: 'Why should I convert my images to WebP format?',
      answer:
        'WebP is a modern image format developed by Google that provides superior lossless and lossy compression for images on the web. WebP images are typically 25% to 35% smaller than comparable JPEGs at equivalent visual quality, and they support transparent alpha channels.',
    },
    {
      question: 'Can I compress multiple images at the same time?',
      answer:
        'Yes! You can drop multiple images into the upload area at once. Compressly will process each image in parallel and allow you to download them individually or download all compressed images together as a single ZIP file.',
    },
    {
      question: 'Does Compressly work offline?',
      answer:
        'Yes. Once the web application is loaded in your browser tab, all compression algorithms run strictly on your local device. Even if your internet connection drops or you are in airplane mode, compression and downloads will continue working without interruption.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-2">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600 text-balance">
            Learn more about how client-side compression works and how to achieve the best results.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
