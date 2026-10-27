/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AdPlaceholderProps {
  format?: 'leaderboard' | 'rectangle' | 'responsive';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  format = 'responsive',
  className = '',
}) => {
  return (
    <div
      className={`my-8 mx-auto max-w-5xl px-4 ${className}`}
      aria-label="Advertisement placeholder"
    >
      <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-300/80 bg-slate-100/60 p-4 text-center">
        <div className="flex flex-col items-center justify-center min-h-[90px] py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Advertisement Space
          </span>
          <p className="mt-1 text-xs text-slate-500 max-w-md">
            Reserved banner container for compliant display advertising. Kept strictly separated from operational controls.
          </p>
          <span className="mt-1 font-mono text-[10px] text-slate-400">
            {format === 'leaderboard' ? '728 × 90 Responsive' : 'Standard Display Container'}
          </span>
        </div>
      </div>
    </div>
  );
};
