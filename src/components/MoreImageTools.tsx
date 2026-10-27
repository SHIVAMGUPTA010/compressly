/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Scaling,
  Crop,
  RotateCw,
  FileImage,
  Stamp,
  ChevronRight,
  Share2,
  Check,
  Star,
  Twitter,
  Facebook,
  Linkedin,
} from 'lucide-react';
import {
  rotateImage90,
  convertToJpg,
  applyWatermark,
  resizeImageScale,
  cropImageToAspect,
} from '../utils/imageOperations';

interface MoreImageToolsProps {
  currentFile: File | null;
  onImageTransformed: (newFile: File) => void;
}

export const MoreImageTools: React.FC<MoreImageToolsProps> = ({
  currentFile,
  onImageTransformed,
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkInput, setWatermarkInput] = useState('Compressly');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleRotate = async () => {
    if (!currentFile) return;
    setIsProcessing(true);
    try {
      const rotated = await rotateImage90(currentFile);
      onImageTransformed(rotated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertToJpg = async () => {
    if (!currentFile) return;
    setIsProcessing(true);
    try {
      const jpg = await convertToJpg(currentFile);
      onImageTransformed(jpg);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWatermark = async () => {
    if (!currentFile) return;
    setIsProcessing(true);
    try {
      const watermarked = await applyWatermark(currentFile, watermarkInput || 'Compressly');
      onImageTransformed(watermarked);
      setActiveAction(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResize = async (scale: number) => {
    if (!currentFile) return;
    setIsProcessing(true);
    try {
      const resized = await resizeImageScale(currentFile, scale);
      onImageTransformed(resized);
      setActiveAction(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCrop = async (aspect: '1:1' | '16:9') => {
    if (!currentFile) return;
    setIsProcessing(true);
    try {
      const cropped = await cropImageToAspect(currentFile, aspect);
      onImageTransformed(cropped);
      setActiveAction(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent('Compress images online for free without losing quality with Compressly!');
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    } else {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      {/* "Continue to..." Card matching the reference screenshot */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-base font-bold text-slate-900 tracking-tight">
            Continue to...
          </h4>
          {isProcessing && (
            <span className="text-xs font-semibold text-blue-600 animate-pulse">
              Processing image tool...
            </span>
          )}
        </div>

        {/* Tools Grid: 2 rows matching reference screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {/* Resize Tool */}
          <div className="relative">
            <button
              onClick={() => setActiveAction(activeAction === 'resize' ? null : 'resize')}
              type="button"
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                activeAction === 'resize'
                  ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/10'
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 bg-slate-50/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center">
                  <Scaling className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">Resize IMAGE</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Inline Resize Controls */}
            {activeAction === 'resize' && (
              <div className="mt-2 p-3 bg-white rounded-xl border border-blue-200 shadow-sm flex items-center gap-2">
                <span className="text-xs text-slate-600">Scale:</span>
                <button
                  onClick={() => handleResize(0.75)}
                  className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded"
                >
                  75%
                </button>
                <button
                  onClick={() => handleResize(0.5)}
                  className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded"
                >
                  50%
                </button>
                <button
                  onClick={() => handleResize(0.25)}
                  className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded"
                >
                  25%
                </button>
              </div>
            )}
          </div>

          {/* Crop Tool */}
          <div className="relative">
            <button
              onClick={() => setActiveAction(activeAction === 'crop' ? null : 'crop')}
              type="button"
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                activeAction === 'crop'
                  ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/10'
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 bg-slate-50/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center">
                  <Crop className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">Crop IMAGE</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Inline Crop Controls */}
            {activeAction === 'crop' && (
              <div className="mt-2 p-3 bg-white rounded-xl border border-teal-200 shadow-sm flex items-center gap-2">
                <span className="text-xs text-slate-600">Aspect:</span>
                <button
                  onClick={() => handleCrop('1:1')}
                  className="px-2.5 py-1 text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded"
                >
                  1:1 Square
                </button>
                <button
                  onClick={() => handleCrop('16:9')}
                  className="px-2.5 py-1 text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded"
                >
                  16:9 Wide
                </button>
              </div>
            )}
          </div>

          {/* Rotate Tool */}
          <div>
            <button
              onClick={handleRotate}
              type="button"
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 bg-slate-50/40 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center">
                  <RotateCw className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">Rotate IMAGE</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Convert to JPG */}
          <div>
            <button
              onClick={handleConvertToJpg}
              type="button"
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 bg-slate-50/40 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                  <FileImage className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">Convert to JPG</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Watermark IMAGE */}
          <div className="relative">
            <button
              onClick={() => setActiveAction(activeAction === 'watermark' ? null : 'watermark')}
              type="button"
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                activeAction === 'watermark'
                  ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/10'
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 bg-slate-50/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Stamp className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">Watermark IMAGE</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Inline Watermark Input */}
            {activeAction === 'watermark' && (
              <div className="mt-2 p-3 bg-white rounded-xl border border-indigo-200 shadow-sm flex items-center gap-2">
                <input
                  type="text"
                  value={watermarkInput}
                  onChange={(e) => setWatermarkInput(e.target.value)}
                  placeholder="Watermark text"
                  className="px-2.5 py-1 text-xs border border-slate-200 rounded flex-1 focus:outline-blue-500"
                />
                <button
                  onClick={handleWatermark}
                  className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social / Word of Mouth Footer strip matching reference screenshot */}
      <div className="mt-12 text-center">
        <h5 className="text-sm font-bold text-slate-900">
          How can you thank us? Spread the word!
        </h5>
        <p className="mt-1 text-xs text-slate-500">
          Please share the tool to inspire more productive people!
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => handleShare('trustpilot')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>{copiedLink ? 'Link Copied!' : 'Trustpilot'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleShare('facebook')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            <Facebook className="w-3.5 h-3.5 text-blue-600" />
            <span>Facebook</span>
          </button>

          <button
            type="button"
            onClick={() => handleShare('twitter')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            <Twitter className="w-3.5 h-3.5 text-slate-900" />
            <span>Twitter</span>
          </button>

          <button
            type="button"
            onClick={() => handleShare('linkedin')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            <Linkedin className="w-3.5 h-3.5 text-blue-700" />
            <span>LinkedIn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
