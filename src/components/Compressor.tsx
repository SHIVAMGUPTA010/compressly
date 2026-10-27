/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  UploadCloud,
  FileImage,
  Sliders,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Archive,
  ArrowLeft,
  Share2,
  HardDrive,
  Link as LinkIcon,
  Cloud,
  Info,
  HelpCircle,
} from 'lucide-react';
import JSZip from 'jszip';
import {
  formatBytes,
  calculateReduction,
  compressImageOnCanvas,
  generateCompressedFilename,
  validateImageFile,
  getFormatDisplayName,
  getOutputExtension,
  OutputFormat,
  CompressionOptions,
  CompressionResult,
} from '../utils/compression';
import { createSampleImageFile, createTransparentSamplePng } from '../utils/sampleImages';
import { BeforeAfterModal, ComparisonItem } from './BeforeAfterModal';
import { CircularProgress } from './CircularProgress';
import { MoreImageTools } from './MoreImageTools';

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'idle' | 'compressing' | 'done' | 'error';
  errorMessage?: string;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  compressedResult?: CompressionResult;
}

interface CompressorProps {
  onSampleTrigger?: (fn: () => void) => void;
}

export const Compressor: React.FC<CompressorProps> = ({ onSampleTrigger }) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  // Default output format is PNG as requested
  const [format, setFormat] = useState<OutputFormat>('image/png');
  // Default compression quality is 80% as requested
  const [quality, setQuality] = useState<number>(80);
  const [resizeMode, setResizeMode] = useState<'none' | '1920' | '1280' | '800'>('none');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [viewState, setViewState] = useState<'upload' | 'results'>('upload');
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [activeComparison, setActiveComparison] = useState<ComparisonItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep selected image valid
  useEffect(() => {
    if (images.length > 0) {
      if (!selectedImageId || !images.some((i) => i.id === selectedImageId)) {
        const completed = images.find((i) => i.status === 'done');
        setSelectedImageId(completed ? completed.id : images[0].id);
      }
    } else {
      setSelectedImageId(null);
      setViewState('upload');
    }
  }, [images, selectedImageId]);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        URL.revokeObjectURL(img.previewUrl);
        if (img.compressedResult?.url) {
          URL.revokeObjectURL(img.compressedResult.url);
        }
      });
    };
  }, []);

  // Helper to read image dimensions
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ width: 0, height: 0 });
      };
      img.src = url;
    });
  };

  // Compress a single image with current options
  const compressSingleImage = async (
    item: ImageItem,
    targetQuality: number = quality,
    targetFormat: OutputFormat = format,
    targetResize: 'none' | '1920' | '1280' | '800' = resizeMode
  ): Promise<CompressionResult> => {
    let maxWidth: number | undefined;
    if (targetResize === '1920') maxWidth = 1920;
    else if (targetResize === '1280') maxWidth = 1280;
    else if (targetResize === '800') maxWidth = 800;

    const options: CompressionOptions = {
      quality: targetQuality / 100,
      format: targetFormat,
      maxWidth,
    };

    return await compressImageOnCanvas(item.file, options);
  };

  // Handle files added via file input or drag-and-drop
  const handleFilesAdded = async (fileList: FileList | File[]) => {
    setGlobalError(null);
    const newItems: ImageItem[] = [];
    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setGlobalError(validation.error || 'Invalid file uploaded.');
        continue;
      }

      const dimensions = await getImageDimensions(file);
      const previewUrl = URL.createObjectURL(file);
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      newItems.push({
        id,
        file,
        previewUrl,
        status: 'idle',
        originalWidth: dimensions.width,
        originalHeight: dimensions.height,
        originalSize: file.size,
      });
    }

    if (newItems.length === 0) return;

    setSelectedImageId(newItems[0].id);
    setImages((prev) => [...prev, ...newItems]);
  };

  // Trigger compression of all selected images
  const handleCompressAll = async () => {
    if (images.length === 0) return;
    setIsCompressing(true);
    setGlobalError(null);

    const updatedImages = [...images];

    for (let i = 0; i < updatedImages.length; i++) {
      const item = updatedImages[i];
      setImages((prev) =>
        prev.map((img) => (img.id === item.id ? { ...img, status: 'compressing' } : img))
      );

      try {
        if (item.compressedResult?.url) {
          URL.revokeObjectURL(item.compressedResult.url);
        }
        const result = await compressSingleImage(item, quality, format, resizeMode);
        setImages((prev) =>
          prev.map((img) =>
            img.id === item.id ? { ...img, status: 'done', compressedResult: result } : img
          )
        );
      } catch (err: any) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === item.id
              ? { ...img, status: 'error', errorMessage: err.message || 'Compression failed.' }
              : img
          )
        );
      }
    }

    setIsCompressing(false);
    setViewState('results');
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  // Sample photo generator
  const handleAddSample = useCallback(async () => {
    try {
      const sampleFile = await createSampleImageFile('sample-photo.jpg', 1600, 1000);
      handleFilesAdded([sampleFile]);
    } catch {
      setGlobalError('Failed to generate sample photo.');
    }
  }, [handleFilesAdded]);

  // Transparent sample generator
  const handleAddTransparentSample = useCallback(async () => {
    try {
      const sampleFile = await createTransparentSamplePng('sample-transparent.png', 800);
      handleFilesAdded([sampleFile]);
    } catch {
      setGlobalError('Failed to generate transparent sample.');
    }
  }, [handleFilesAdded]);

  useEffect(() => {
    if (onSampleTrigger) {
      onSampleTrigger(handleAddSample);
    }
  }, [onSampleTrigger, handleAddSample]);

  // Download a single compressed image
  const handleDownloadSingle = (item: ImageItem) => {
    if (!item.compressedResult) return;
    const filename = generateCompressedFilename(item.file.name, item.compressedResult.mimeType);
    const link = document.createElement('a');
    link.href = item.compressedResult.url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all compressed images as ZIP archive
  const handleDownloadAll = async () => {
    const completedImages = images.filter((img) => img.status === 'done' && img.compressedResult);
    if (completedImages.length === 0) return;

    if (completedImages.length === 1) {
      handleDownloadSingle(completedImages[0]);
      return;
    }

    setIsZipping(true);
    try {
      const zip = new JSZip();

      for (let index = 0; index < completedImages.length; index++) {
        const img = completedImages[index];
        const blob = img.compressedResult!.blob;
        const filename = generateCompressedFilename(img.file.name, img.compressedResult!.mimeType);
        zip.file(filename, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `compressly-images-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch {
      setGlobalError('Failed to generate ZIP archive.');
    } finally {
      setIsZipping(false);
    }
  };

  // Remove a single image
  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
        if (item.compressedResult?.url) {
          URL.revokeObjectURL(item.compressedResult.url);
        }
      }
      const filtered = prev.filter((i) => i.id !== id);
      if (filtered.length === 0) {
        setViewState('upload');
      }
      return filtered;
    });
  };

  // Reset all images
  const handleReset = () => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.previewUrl);
      if (img.compressedResult?.url) {
        URL.revokeObjectURL(img.compressedResult.url);
      }
    });
    setImages([]);
    setSelectedImageId(null);
    setViewState('upload');
    setGlobalError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Replace image after secondary tool transformation (resize, crop, rotate, etc.)
  const handleImageTransformed = async (newFile: File) => {
    if (!selectedItem) return;
    const dimensions = await getImageDimensions(newFile);
    const newPreviewUrl = URL.createObjectURL(newFile);

    // Clean up old URLs
    URL.revokeObjectURL(selectedItem.previewUrl);
    if (selectedItem.compressedResult?.url) {
      URL.revokeObjectURL(selectedItem.compressedResult.url);
    }

    const updatedItem: ImageItem = {
      ...selectedItem,
      file: newFile,
      previewUrl: newPreviewUrl,
      originalWidth: dimensions.width,
      originalHeight: dimensions.height,
      originalSize: newFile.size,
      status: 'compressing',
      compressedResult: undefined,
    };

    setImages((prev) => prev.map((img) => (img.id === selectedItem.id ? updatedItem : img)));

    try {
      const result = await compressSingleImage(updatedItem);
      setImages((prev) =>
        prev.map((img) =>
          img.id === selectedItem.id ? { ...img, status: 'done', compressedResult: result } : img
        )
      );
    } catch (e: any) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === selectedItem.id
            ? { ...img, status: 'error', errorMessage: e.message || 'Processing failed' }
            : img
        )
      );
    }
  };

  // Open interactive comparison modal
  const handleOpenComparison = (item: ImageItem) => {
    if (!item.compressedResult) return;
    setActiveComparison({
      id: item.id,
      name: item.file.name,
      originalUrl: item.previewUrl,
      compressedUrl: item.compressedResult.url,
      originalSize: item.originalSize,
      compressedSize: item.compressedResult.compressedSize,
      originalWidth: item.originalWidth,
      originalHeight: item.originalHeight,
      compressedWidth: item.compressedResult.width,
      compressedHeight: item.compressedResult.height,
      format: item.compressedResult.format,
      mimeType: item.compressedResult.mimeType,
    });
  };

  // Metrics for the whole queue
  const totalOriginalSize = images.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalCompressedSize = images.reduce(
    (acc, curr) => acc + (curr.compressedResult ? curr.compressedResult.compressedSize : curr.originalSize),
    0
  );
  const totalReduction = calculateReduction(totalOriginalSize, totalCompressedSize);

  // Selected item metrics
  const selectedItem = images.find((i) => i.id === selectedImageId) || images[0] || null;
  const selectedReduction =
    selectedItem && selectedItem.compressedResult
      ? calculateReduction(selectedItem.originalSize, selectedItem.compressedResult.compressedSize)
      : null;

  return (
    <section id="compressor-tool" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Global Error Banner */}
      {globalError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">{globalError}</div>
          <button
            onClick={() => setGlobalError(null)}
            className="text-red-500 hover:text-red-700 text-sm font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* VIEW STATE 1: MAIN UPLOAD & COMPRESSION PAGE */}
      {viewState === 'upload' && (
        <div className="text-center">
          {/* Main Title & Subtitle */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Compress Images Online for Free
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-500 max-w-xl mx-auto font-normal">
            Reduce image file sizes quickly without unnecessary complexity.
          </p>

          {/* Large Drag-and-Drop Card */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-10 rounded-2xl border-2 border-dashed transition-all p-10 sm:p-14 bg-white shadow-sm ${
              isDragging
                ? 'border-blue-600 bg-blue-50/50 scale-[1.01]'
                : 'border-slate-300 hover:border-blue-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              id="choose-images-input"
              onChange={(e) => {
                if (e.target.files) handleFilesAdded(e.target.files);
              }}
            />

            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Drag & Drop Images Here
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Supports JPG, JPEG, PNG, and WebP (up to 50MB per file).
              </p>

              {/* Main "Choose Images" button */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-200 transition-all cursor-pointer"
                >
                  Choose Images
                </button>

                <button
                  type="button"
                  onClick={handleAddSample}
                  className="px-4 py-3.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 inline mr-1.5" />
                  Sample Photo
                </button>

                <button
                  type="button"
                  onClick={handleAddTransparentSample}
                  className="px-4 py-3.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
                >
                  <FileImage className="w-4 h-4 text-blue-600 inline mr-1.5" />
                  Transparent PNG
                </button>
              </div>

              <p className="mt-6 text-xs text-slate-400">
                100% Secure · Images are processed locally on your device.
              </p>
            </div>
          </div>

          {/* If images are selected: Show Selected Thumbnails + Settings + Primary "Compress Images" button */}
          {images.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 text-left animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Selected Images ({images.length})
                </h3>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Thumbnails row */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-1.5 flex flex-col items-center text-center"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-200 mb-1.5 flex items-center justify-center">
                      <img
                        src={img.previewUrl}
                        alt={img.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 truncate w-full px-1">
                      {img.file.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatBytes(img.originalSize)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Controls Grid */}
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Format Selector: PNG is default */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Output Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      data-format="image/png"
                      onClick={() => setFormat('image/png')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        format === 'image/png'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/10 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 text-slate-700'
                      }`}
                    >
                      <span className="text-sm block">PNG</span>
                      <span className="text-[10px] text-slate-500">Lossless & Alpha</span>
                    </button>

                    <button
                      type="button"
                      data-format="image/jpeg"
                      onClick={() => setFormat('image/jpeg')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        format === 'image/jpeg'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/10 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 text-slate-700'
                      }`}
                    >
                      <span className="text-sm block">JPEG</span>
                      <span className="text-[10px] text-slate-500">Photos</span>
                    </button>

                    <button
                      type="button"
                      data-format="image/webp"
                      onClick={() => setFormat('image/webp')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        format === 'image/webp'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/10 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 text-slate-700'
                      }`}
                    >
                      <span className="text-sm block">WebP</span>
                      <span className="text-[10px] text-slate-500">Smallest Size</span>
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500">
                    {format === 'image/jpeg'
                      ? 'Note: JPEG fills transparent backgrounds with solid white.'
                      : 'PNG and WebP preserve alpha transparency.'}
                  </p>
                </div>

                {/* Quality Slider (10% to 100%, default 80%) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="upload-quality-slider" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Compression Quality
                    </label>
                    <span className="px-2.5 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 rounded font-mono">
                      {quality}%
                    </span>
                  </div>

                  <input
                    id="upload-quality-slider"
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>10% (Smaller)</span>
                    <span>80% (Default)</span>
                    <span>100% (High)</span>
                  </div>

                  {format === 'image/png' && (
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      <em>PNG uses lossless encoding; quality slider does not alter PNG size.</em>
                    </p>
                  )}
                </div>
              </div>

              {/* Primary Action Button: "Compress Images" */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Total Size: {formatBytes(totalOriginalSize)}
                </span>

                <button
                  type="button"
                  data-testid="start-compress-btn"
                  onClick={handleCompressAll}
                  disabled={isCompressing}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-200 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCompressing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Compressing Images...</span>
                    </>
                  ) : (
                    <span>Compress Images</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW STATE 2: COMPRESSION RESULTS PAGE (MATCHING THE REFERENCE SCREENSHOT) */}
      {viewState === 'results' && selectedItem && (
        <div className="animate-in fade-in duration-200 text-center">
          {/* Headline matching screenshot */}
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Your IMAGES have been compressed!
          </h2>

          {/* Primary Action Bar matching screenshot */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {/* Round Back Button */}
            <button
              type="button"
              data-testid="back-to-upload-btn"
              aria-label="Back to upload"
              onClick={() => setViewState('upload')}
              className="w-11 h-11 rounded-full bg-slate-700 hover:bg-slate-800 text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm shrink-0"
              title="Compress more images"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Large Blue Download Button matching screenshot */}
            <button
              type="button"
              data-testid="primary-download-btn"
              onClick={handleDownloadAll}
              disabled={isZipping}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base sm:text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-2xl shadow-lg shadow-blue-300 transition-all cursor-pointer shrink-0"
            >
              <Download className="w-5 h-5" />
              <span>
                {isZipping
                  ? 'Preparing Download...'
                  : images.length > 1
                  ? 'Download compressed IMAGES'
                  : `Download compressed IMAGE (${formatBytes(selectedItem.compressedResult?.compressedSize || 0)})`}
              </span>
            </button>

            {/* Circular Utility Action Buttons matching screenshot */}
            <div className="grid grid-cols-2 gap-2 shrink-0">
              {/* Google Drive / Cloud trigger */}
              <button
                type="button"
                onClick={() => {
                  alert('Drive integration: Files are saved locally. You can upload the downloaded image to your Google Drive directly.');
                }}
                className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="Save to Cloud"
              >
                <Cloud className="w-4 h-4" />
              </button>

              {/* Copy link trigger */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="Copy share link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>

              {/* Dropbox trigger */}
              <button
                type="button"
                onClick={() => {
                  alert('Dropbox integration: Files are saved locally. You can upload the downloaded image to Dropbox directly.');
                }}
                className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="Save to Dropbox"
              >
                <HardDrive className="w-4 h-4" />
              </button>

              {/* Reset/Delete trigger */}
              <button
                type="button"
                onClick={handleReset}
                className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="Delete & start over"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Copy link confirmation feedback */}
          {copiedLink && (
            <p className="mt-2 text-xs font-semibold text-emerald-600">
              Link copied to clipboard!
            </p>
          )}

          {/* Circular Percentage & Reduction Stat Row matching screenshot */}
          <div className="mt-8 flex items-center justify-center gap-5">
            <CircularProgress
              percent={
                images.length > 1
                  ? totalReduction.percent
                  : selectedReduction?.percent || 0
              }
              size={90}
            />

            <div className="text-left">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                {images.length > 1
                  ? !totalReduction.isLarger
                    ? `Your Images are now ${totalReduction.percent}% smaller!`
                    : 'Images are ready for download!'
                  : selectedReduction && !selectedReduction.isLarger
                  ? `Your Images are now ${selectedReduction.percent}% smaller!`
                  : 'Image has been converted!'}
              </h3>
              <p className="text-sm font-semibold text-slate-600 font-mono mt-0.5">
                {images.length > 1 ? (
                  <>
                    {formatBytes(totalOriginalSize)} → {formatBytes(totalCompressedSize)}
                  </>
                ) : (
                  <>
                    {formatBytes(selectedItem.originalSize)} →{' '}
                    {formatBytes(selectedItem.compressedResult?.compressedSize || 0)}
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Side-by-Side Image Previews Container */}
          <div className="mt-10 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Image Comparison Preview
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedItem.file.name}
                </p>
              </div>

              {/* Multi-image switcher */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Viewing:</span>
                  <select
                    value={selectedItem.id}
                    onChange={(e) => setSelectedImageId(e.target.value)}
                    className="px-2.5 py-1 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-blue-600"
                  >
                    {images.map((img, idx) => (
                      <option key={img.id} value={img.id}>
                        {idx + 1}. {img.file.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Side by side on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Preview */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 text-xs font-bold uppercase">
                    Original Image
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {selectedItem.originalWidth} × {selectedItem.originalHeight}px
                  </span>
                </div>

                <div className="relative aspect-[4/3] w-full rounded-lg border border-slate-200/70 overflow-hidden flex items-center justify-center p-2 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                  <img
                    src={selectedItem.previewUrl}
                    alt={`Original: ${selectedItem.file.name}`}
                    className="max-h-full max-w-full object-contain rounded select-none"
                  />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Original Size:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {formatBytes(selectedItem.originalSize)}
                  </span>
                </div>
              </div>

              {/* Compressed Preview */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/20 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-bold uppercase">
                      Compressed Image
                    </span>
                    {selectedItem.compressedResult && (
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
                        {selectedItem.compressedResult.format}
                      </span>
                    )}
                  </div>
                  {selectedItem.compressedResult && (
                    <span className="text-xs font-mono text-slate-600">
                      {selectedItem.compressedResult.width} × {selectedItem.compressedResult.height}px
                    </span>
                  )}
                </div>

                <div className="relative aspect-[4/3] w-full rounded-lg border border-blue-100 overflow-hidden flex items-center justify-center p-2 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                  {selectedItem.compressedResult ? (
                    <img
                      src={selectedItem.compressedResult.url}
                      alt={`Compressed: ${selectedItem.file.name}`}
                      className="max-h-full max-w-full object-contain rounded select-none"
                    />
                  ) : (
                    <div className="text-xs text-slate-400">Processing...</div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Compressed Size:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {selectedItem.compressedResult
                      ? formatBytes(selectedItem.compressedResult.compressedSize)
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Comparison Controls & Action */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setViewState('upload')}
                className="px-4 py-2 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                Compress More Images
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenComparison(selectedItem)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Interactive Split Slider</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadSingle(selectedItem)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download This File</span>
                </button>
              </div>
            </div>
          </div>

          {/* "Continue to..." / More Image Tools Component matching reference screenshot */}
          <MoreImageTools
            currentFile={selectedItem.file}
            onImageTransformed={handleImageTransformed}
          />
        </div>
      )}

      {/* Interactive Before & After Modal */}
      {activeComparison && (
        <BeforeAfterModal
          item={activeComparison}
          onClose={() => setActiveComparison(null)}
          onDownload={(compItem) => {
            const target = images.find((i) => i.id === compItem.id);
            if (target) handleDownloadSingle(target);
          }}
        />
      )}
    </section>
  );
};
