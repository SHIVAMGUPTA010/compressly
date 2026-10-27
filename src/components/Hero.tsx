/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Zap, Sparkles, ArrowDown, Lock } from 'lucide-react';

interface HeroProps {
  onCompressClick: () => void;
  onTrySample: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCompressClick, onTrySample }) => {
  return (
    <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 overflow-hidden">
      {/* Subtle background ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 blur-3xl -z-10"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-200 via-indigo-100 to-purple-200" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle trust badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-indigo-50/90 border border-indigo-100/80 text-xs font-medium text-indigo-700 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>100% Client-Side Privacy · Images Never Leave Your Browser</span>
        </div>

        {/* Hero heading requested by user */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 text-balance leading-[1.15]">
          Compress Images{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Without Losing Quality
          </span>
        </h1>

        {/* Subtitle requested by user */}
        <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
          Reduce image file sizes in seconds. Free, fast and secure.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onCompressClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-200 transition-all duration-150 cursor-pointer focus-visible:outline-indigo-600 focus-visible:ring-2"
          >
            <span>Compress Your Image</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>

          <button
            onClick={onTrySample}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Try With Sample Image</span>
          </button>
        </div>

        {/* 3-Pillar Trust Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 border border-slate-100 shadow-2xs">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Zero Server Uploads</h4>
              <p className="text-xs text-slate-500 mt-0.5">Images stay entirely on your local machine. No tracking, no logs.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 border border-slate-100 shadow-2xs">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Up to 90% Smaller</h4>
              <p className="text-xs text-slate-500 mt-0.5">Intelligent compression algorithms preserve human visual sharpness.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 border border-slate-100 shadow-2xs">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Multi-Format Support</h4>
              <p className="text-xs text-slate-500 mt-0.5">Compress and convert across JPG, PNG, and modern WebP effortlessly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
