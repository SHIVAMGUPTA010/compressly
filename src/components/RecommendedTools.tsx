/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExternalLink, Palette, HardDrive, Server, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ToolCard {
  id: string;
  name: string;
  category: string;
  description: string;
  placeholderUrl: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const RecommendedTools: React.FC = () => {
  const tools: ToolCard[] = [
    {
      id: 'vector-editor',
      name: 'Vector & UI Design Suite',
      category: 'Design & Illustration',
      description:
        'Professional vector graphic software and UI mockup editor for preparing production-ready web graphics and SVG assets.',
      placeholderUrl: '#',
      icon: Palette,
    },
    {
      id: 'cloud-backup',
      name: 'Secure Cloud Media Storage',
      category: 'Storage & Backup',
      description:
        'Encrypted, high-redundancy cloud storage platform for archiving raw high-resolution photography and creative portfolios.',
      placeholderUrl: '#',
      icon: HardDrive,
    },
    {
      id: 'high-speed-hosting',
      name: 'High-Performance CDN & Hosting',
      category: 'Web Infrastructure',
      description:
        'Fast static web hosting and global edge CDN network designed for delivering optimized media assets with sub-50ms latency.',
      placeholderUrl: '#',
      icon: Server,
    },
    {
      id: 'stock-library',
      name: 'Royalty-Free Creative Assets',
      category: 'Media Stock Library',
      description:
        'Commercial royalty-free stock imagery, video clips, and vector graphics library for digital marketing and web publications.',
      placeholderUrl: '#',
      icon: ImageIcon,
    },
  ];

  return (
    <section id="recommended-tools" className="py-16 sm:py-24 bg-white border-t border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-2">
            Ecosystem & Resources
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl text-balance">
            Recommended Tools for Creators
          </h2>
          <p className="mt-3 text-base text-slate-600 text-balance">
            Hand-picked companion software, hosting platforms, and creative tools to optimize your digital workflow.
          </p>
        </div>

        {/* Affiliate Placeholder Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white shadow-2xs hover:shadow-xs transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      Partner
                    </span>
                  </div>

                  <span className="text-xs font-medium text-indigo-600 block mb-1">
                    {tool.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => {
                      alert('Affiliate Placeholder: Insert your partner referral link here.');
                    }}
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Affiliate Disclosure Placeholder */}
        <div className="mt-10 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
          <p className="text-xs text-slate-500 leading-relaxed max-w-3xl mx-auto">
            <strong className="font-semibold text-slate-700">Affiliate Disclosure:</strong> Compressly may earn a referral commission from recommended partner products purchased through affiliate links at no additional cost to you. We only recommend software and services that align with high standards for speed, security, and developer productivity.
          </p>
        </div>
      </div>
    </section>
  );
};
