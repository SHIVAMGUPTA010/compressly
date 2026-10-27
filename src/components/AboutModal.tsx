/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Layers, ShieldCheck, Zap, Heart, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 id="about-modal-title" className="text-lg font-bold text-slate-900">
                About Compressly
              </h2>
              <p className="text-xs text-slate-500">Free Online Image Compressor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-slate-600 leading-relaxed">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Our Mission</h3>
            <p>
              Compressly was built with a simple conviction: optimizing high-resolution imagery for the web should be completely free, lightning fast, and privacy-respecting by design.
            </p>
            <p className="mt-2">
              Most online compression utilities force users to upload their sensitive personal photos, ID documents, or client assets to mystery cloud servers. We engineered Compressly to run 100% locally on your own CPU/GPU via client-side Canvas and modern WebP rendering engines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Server Uploads</span>
              </div>
              <p className="text-xs text-slate-500">
                Every byte stays inside your browser sandbox. Absolute privacy guaranteed.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-1">
                <Zap className="w-4 h-4" />
                <span>Instant Offline Speed</span>
              </div>
              <p className="text-xs text-slate-500">
                No network upload bottlenecks or waiting in server conversion queues.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">The Architecture</h3>
            <p>
              Built using React 19, TypeScript, and modern HTML5 APIs, Compressly leverages hardware-accelerated canvas resampling to downsample high-resolution images while preserving perceptual sharpness.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900">
            <strong>Placeholder Team & Organization Notice:</strong> Compressly is an open web utility created for digital creators worldwide. Replace this section with your own organization credentials, company history, or founder bio as desired.
          </div>
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
