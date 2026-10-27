/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Download, ZoomIn, ZoomOut, Maximize2, Sparkles, ArrowLeftRight } from 'lucide-react';
import { formatBytes, calculateReduction } from '../utils/compression';

export interface ComparisonItem {
  id: string;
  name: string;
  originalUrl: string;
  compressedUrl: string;
  originalSize: number;
  compressedSize: number;
  originalWidth: number;
  originalHeight: number;
  compressedWidth: number;
  compressedHeight: number;
  format: string;
  mimeType: string;
}

interface BeforeAfterModalProps {
  item: ComparisonItem | null;
  onClose: () => void;
  onDownload: (item: ComparisonItem) => void;
}

export const BeforeAfterModal: React.FC<BeforeAfterModalProps> = ({
  item,
  onClose,
  onDownload,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<'fit' | '1x' | '2x'>('fit');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const updateSliderPosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const width = rect.width;
      const percentage = Math.max(0, Math.min(100, (x / width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateSliderPosition(e.clientX);
      }
    };
    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        updateSliderPosition(e.touches[0].clientX);
      }
    };
    const handleTouchEnd = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, updateSliderPosition]);

  if (!item) return null;

  const { percent, savedBytes, isLarger } = calculateReduction(item.originalSize, item.compressedSize);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl max-h-[95vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <h2 id="comparison-dialog-title" className="text-lg font-bold text-slate-900 truncate max-w-md">
              Before & After Comparison
            </h2>
            <p className="text-xs text-slate-500 truncate max-w-md">{item.name}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              <button
                onClick={() => setZoomLevel('fit')}
                className={`px-2.5 py-1 text-xs font-medium rounded ${
                  zoomLevel === 'fit' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fit
              </button>
              <button
                onClick={() => setZoomLevel('1x')}
                className={`px-2.5 py-1 text-xs font-medium rounded ${
                  zoomLevel === '1x' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                100%
              </button>
              <button
                onClick={() => setZoomLevel('2x')}
                className={`px-2.5 py-1 text-xs font-medium rounded ${
                  zoomLevel === '2x' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                200%
              </button>
            </div>

            <button
              onClick={() => onDownload(item)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close comparison view"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Viewer Canvas */}
        <div className="relative flex-1 min-h-[350px] max-h-[65vh] bg-slate-900 overflow-auto flex items-center justify-center select-none">
          <div
            ref={containerRef}
            className={`relative overflow-hidden cursor-ew-resize ${
              zoomLevel === 'fit' ? 'max-w-full max-h-[60vh]' : zoomLevel === '1x' ? 'w-[1200px]' : 'w-[2000px]'
            }`}
            onClick={(e) => updateSliderPosition(e.clientX)}
          >
            {/* Compressed Image (Background) */}
            <img
              src={item.compressedUrl}
              alt="Compressed preview"
              className="w-full h-auto object-contain block pointer-events-none select-none"
            />

            {/* Original Image (Foreground, clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={item.originalUrl}
                alt="Original preview"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none max-w-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                  height: containerRef.current ? `${containerRef.current.clientHeight}px` : '100%',
                }}
              />
            </div>

            {/* Vertical Split Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize shadow-md"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              {/* Central Draggable Handle */}
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg border border-slate-200 hover:scale-110 active:scale-95 transition-transform">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>

            {/* Corner Badges */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/70 backdrop-blur-xs text-white text-xs font-medium pointer-events-none">
              Original: {formatBytes(item.originalSize)}
            </div>

            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-indigo-950/80 backdrop-blur-xs text-white text-xs font-medium pointer-events-none">
              Compressed: {formatBytes(item.compressedSize)} ({item.format})
            </div>
          </div>
        </div>

        {/* Footer Statistics */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-slate-500 block">Original Size</span>
              <span className="text-sm font-semibold text-slate-800 font-mono tabular-nums">
                {formatBytes(item.originalSize)} ({item.originalWidth} × {item.originalHeight}px)
              </span>
            </div>
            <div className="text-slate-300">→</div>
            <div>
              <span className="text-xs text-slate-500 block">Compressed Size</span>
              <span className="text-sm font-semibold text-slate-900 font-mono tabular-nums">
                {formatBytes(item.compressedSize)} ({item.compressedWidth} × {item.compressedHeight}px)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                !isLarger
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-amber-50 border border-amber-200 text-amber-700'
              }`}
            >
              {!isLarger
                ? `${percent}% Saved (${formatBytes(savedBytes)})`
                : `+${percent}% larger than original`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
