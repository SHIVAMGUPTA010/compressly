/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UploadCloud, SlidersHorizontal, Download, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload or Drop Images',
      description:
        'Drag and drop multiple JPG, PNG, or WebP images up to 50MB each, or choose files directly from your computer or mobile device.',
      icon: UploadCloud,
      color: 'blue',
    },
    {
      step: '02',
      title: 'Fine-Tune Quality & Format',
      description:
        'Adjust the compression slider from 10% to 100% (default 75%), convert formats to high-efficiency WebP, or downscale resolution if desired.',
      icon: SlidersHorizontal,
      color: 'indigo',
    },
    {
      step: '03',
      title: 'Inspect & Download',
      description:
        'Review the before-and-after split view to verify sharpness, then download individual optimized images or grab everything in a single ZIP archive.',
      icon: Download,
      color: 'purple',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white border-y border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-2">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl text-balance">
            How Compressly Works
          </h2>
          <p className="mt-3 text-base text-slate-600 text-balance">
            Designed for photographers, web developers, content creators, and everyday users who need fast, lossless-feeling compression.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-xs ${
                      item.color === 'blue'
                        ? 'bg-blue-600 shadow-blue-200'
                        : item.color === 'indigo'
                        ? 'bg-indigo-600 shadow-indigo-200'
                        : 'bg-purple-600 shadow-purple-200'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-300">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
