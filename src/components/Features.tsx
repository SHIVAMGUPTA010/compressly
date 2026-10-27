/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  Zap,
  Sliders,
  Layers,
  FolderArchive,
  Eye,
  Cpu,
  Sparkles,
} from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-2">
            Engineered For Performance
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl text-balance">
            Why Professionals Choose Compressly
          </h2>
          <p className="mt-3 text-base text-slate-600 text-balance">
            Every feature is built around privacy, speed, and uncompromising visual quality.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 100% Browser Processing (2 cols span) */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 border border-indigo-100 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-indigo-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Absolute Privacy with In-Browser Processing
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
                Unlike traditional image compressors that upload your personal documents and photos to remote cloud servers, Compressly performs 100% of the compression right inside your browser using HTML5 Canvas. Your images never touch an external network.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-indigo-900 font-medium">
              <span className="px-2.5 py-1 rounded-md bg-indigo-100/70">No Server Storage</span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-100/70">Zero Data Retention</span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-100/70">GDPR & HIPAA Friendly</span>
            </div>
          </div>

          {/* Card 2: Next-Gen WebP (1 col span) */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-blue-200">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Next-Gen WebP Conversion
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Convert heavy legacy JPEG and PNG files into Google WebP format to reduce website payload by up to 80% while retaining razor-sharp transparency.
              </p>
            </div>
            <div className="mt-6 text-xs text-blue-700 font-medium">
              Up to 30% smaller than standard JPEG at equivalent fidelity.
            </div>
          </div>

          {/* Card 3: Interactive Visual Quality Inspection (1 col) */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-purple-200">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Interactive Before & After Split
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Inspect every fine detail before downloading. Slide back and forth with our split view and 200% zoom to verify there are no unwanted compression artifacts.
              </p>
            </div>
            <div className="mt-6 text-xs text-purple-700 font-medium">
              Pixel-level scrutiny with zero guesswork.
            </div>
          </div>

          {/* Card 4: Batch Processing & ZIP Export (2 cols) */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-emerald-200">
                <FolderArchive className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Batch Compression & 1-Click ZIP Download
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
                Have dozens of photos from a shoot, product catalog, or blog post? Drop them all simultaneously. Compressly processes them in parallel and packages your compressed assets into a tidy .zip file with a single click.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">Parallel Workers</span>
              <span>·</span>
              <span className="font-semibold text-slate-800">Custom Dimension Limiting</span>
              <span>·</span>
              <span className="font-semibold text-slate-800">No Rate Limits</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
