/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Compressor } from './components/Compressor';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { FAQ } from './components/FAQ';
import { RecommendedTools } from './components/RecommendedTools';
import { AdPlaceholder } from './components/AdPlaceholder';
import { Footer } from './components/Footer';
import { LegalModal, LegalType } from './components/LegalModal';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';

export default function App() {
  const [legalModalType, setLegalModalType] = useState<LegalType | null>(null);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const sampleTriggerRef = React.useRef<(() => void) | null>(null);

  const scrollToCompressor = () => {
    const el = document.getElementById('compressor-tool');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f5f9] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenContact={() => setContactModalOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
        onScrollToCompressor={scrollToCompressor}
      />

      <main className="flex-1">
        {/* Core Compression Interactive Tool: Main Hero Workflow */}
        <Compressor onSampleTrigger={(fn) => { sampleTriggerRef.current = fn; }} />

        {/* AdSense Space 1: Mid-page responsive container */}
        <AdPlaceholder format="responsive" className="my-10" />

        {/* How It Works 3-Step Section */}
        <HowItWorks />

        {/* Features Bento-Grid Section */}
        <Features />

        {/* Frequently Asked Questions */}
        <FAQ />

        {/* Recommended Affiliate Tools Section */}
        <RecommendedTools />
      </main>

      {/* Footer with legal and navigational mirrors */}
      <Footer
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
        onScrollToCompressor={scrollToCompressor}
      />

      {/* Legal Modal (Privacy, Terms, Disclaimer) */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* About Us Modal */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

      {/* Contact Us Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
}
