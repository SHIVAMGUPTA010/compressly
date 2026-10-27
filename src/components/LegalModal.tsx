/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

export type LegalType = 'privacy' | 'terms' | 'disclaimer';

interface LegalModalProps {
  type: LegalType | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-indigo-600" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-indigo-600" />}
            {type === 'disclaimer' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            <h2 id="legal-modal-title" className="text-lg font-bold text-slate-900">
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'terms' && 'Terms of Service'}
              {type === 'disclaimer' && 'General Disclaimer'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-slate-600 leading-relaxed">
          {type === 'privacy' && (
            <>
              <div>
                <p className="text-xs text-slate-400 mb-2">Effective Date: October 2026</p>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  1. Zero Server-Side Data Retention Pledge
                </h3>
                <p>
                  At Compressly, user privacy is fundamental to our architecture. All image compression algorithms execute entirely on your client device using the standard HTML5 Canvas and Web APIs built into modern web browsers.
                </p>
                <p className="mt-2 font-medium text-indigo-900 bg-indigo-50/80 p-3 rounded-lg border border-indigo-100">
                  We do NOT transmit, upload, inspect, copy, or store your photos, documents, or personal images on any server or cloud database.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  2. Local Device Processing & Browser Storage
                </h3>
                <p>
                  Image files added to Compressly are loaded temporarily into your browser’s volatile memory (`Blob` and `HTMLCanvasElement`). When you refresh or close the tab, all image buffers are immediately discarded from your device’s memory.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  3. Cookies and Third-Party Advertising
                </h3>
                <p>
                  Compressly does not require account creation, logins, or credit cards. If third-party advertising services (such as Google AdSense) or web analytics are enabled in the future, they may use cookies or web beacons to display relevant contextual advertisements subject to their respective privacy policies. You may disable cookies at any time through your browser preferences.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  4. Contact & Inquiries
                </h3>
                <p>
                  For any privacy questions or clarification regarding client-side data handling, please reach out via our Contact section.
                </p>
              </div>
            </>
          )}

          {type === 'terms' && (
            <>
              <div>
                <p className="text-xs text-slate-400 mb-2">Effective Date: October 2026</p>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  1. Acceptance of Terms
                </h3>
                <p>
                  By accessing or using Compressly ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any portion of these terms, please discontinue use immediately.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  2. Permitted Use & Intellectual Property
                </h3>
                <p>
                  You retain full ownership and intellectual property rights over all images, photography, and graphics processed through Compressly. Because files are processed strictly in your local browser, Compressly claims no rights, licenses, or ownership over your content.
                </p>
                <p className="mt-2">
                  You agree not to use the Service for any unlawful activities or in a manner that disrupts the integrity or performance of web standards.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  3. Service Availability & Modifications
                </h3>
                <p>
                  Compressly is provided free of charge on an "AS IS" and "AS AVAILABLE" basis. We reserve the right to modify, enhance, or discontinue parts of the tool without prior notice.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  4. Limitation of Liability
                </h3>
                <p>
                  In no event shall Compressly or its creators be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this tool, including file corruption or unexpected browser behavior. Users are advised to retain original backups of high-value media assets.
                </p>
              </div>
            </>
          )}

          {type === 'disclaimer' && (
            <>
              <div>
                <p className="text-xs text-slate-400 mb-2">Effective Date: October 2026</p>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  1. Compression Results & File Fidelity
                </h3>
                <p>
                  Compression ratios and resulting file sizes depend on numerous variables, including the source image format, color complexity, dimensional resolution, noise levels, and browser canvas implementation. No specific percentage reduction or exact byte target can be guaranteed for every uploaded image.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  2. Browser Compatibility
                </h3>
                <p>
                  Compressly utilizes modern Web standards including HTML5 Canvas, WebP encoding, and Blob APIs supported by modern browsers (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge). Certain legacy browsers may lack native WebP export support, in which case files fall back to standard JPEG.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  3. No Professional Warranty
                </h3>
                <p>
                  Compressly is an automated browser utility and does not constitute professional graphic design or archiving advice. Always maintain secure, unmodified backups of mission-critical raw photographs before applying lossy compression.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
