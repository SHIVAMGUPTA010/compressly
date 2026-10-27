/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OutputFormat = 'image/webp' | 'image/jpeg' | 'image/png';

export interface CompressionOptions {
  quality: number; // 0.1 to 1.0 (defaults to 0.80)
  format: OutputFormat;
  maxWidth?: number;
  maxHeight?: number;
}

export interface CompressionResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  compressedSize: number;
  originalSize: number;
  reductionPercent: number;
  savedBytes: number;
  isLarger: boolean;
  format: string; // 'WEBP' | 'JPEG' | 'PNG'
  mimeType: string;
}

export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

/**
 * Format bytes into human-readable string (B, KB, MB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  if (bytes < 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeIndex = Math.min(i, sizes.length - 1);

  return `${parseFloat((bytes / Math.pow(k, safeIndex)).toFixed(dm))} ${sizes[safeIndex]}`;
}

/**
 * Calculate reduction percentage between original and compressed size
 */
export function calculateReduction(originalSize: number, compressedSize: number): {
  percent: number;
  savedBytes: number;
  isLarger: boolean;
} {
  if (originalSize <= 0) {
    return { percent: 0, savedBytes: 0, isLarger: false };
  }

  const savedBytes = originalSize - compressedSize;
  const isLarger = compressedSize > originalSize;
  const percent = Math.round((Math.abs(savedBytes) / originalSize) * 100);

  return {
    percent,
    savedBytes,
    isLarger,
  };
}

/**
 * Map MIME type to corresponding file extension
 */
export function getOutputExtension(mimeType: string): string {
  switch (mimeType.toLowerCase()) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
}

/**
 * Map MIME type to friendly display name
 */
export function getFormatDisplayName(mimeType: string): string {
  switch (mimeType.toLowerCase()) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'JPEG';
    case 'image/png':
      return 'PNG';
    case 'image/webp':
      return 'WebP';
    default:
      return 'JPEG';
  }
}

/**
 * Generate a clean output filename based on original name and target extension
 */
export function generateCompressedFilename(originalName: string, targetMimeType: string): string {
  const ext = getOutputExtension(targetMimeType);
  if (!originalName || originalName.trim() === '') {
    return `compressed-image.${ext}`;
  }

  const dotIndex = originalName.lastIndexOf('.');
  const baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
  const cleanBase = baseName.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  return `${cleanBase}-compressed.${ext}`;
}

/**
 * Validate an uploaded image file
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  const isValidType =
    SUPPORTED_MIME_TYPES.includes(file.type.toLowerCase()) ||
    /\.(jpe?g|png|webp)$/i.test(file.name);

  if (!isValidType) {
    return {
      isValid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload JPG, PNG, or WebP images.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size (${formatBytes(file.size)}) exceeds the maximum allowed limit of 50 MB.`,
    };
  }

  return { isValid: true };
}

/**
 * Calculate scaled dimensions while preserving aspect ratio
 */
export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth?: number,
  maxHeight?: number
): { width: number; height: number } {
  let width = srcWidth;
  let height = srcHeight;

  if (maxWidth && width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height = Math.round(height * ratio);
  }

  if (maxHeight && height > maxHeight) {
    const ratio = maxHeight / height;
    height = maxHeight;
    width = Math.round(width * ratio);
  }

  return { width: Math.max(1, width), height: Math.max(1, height) };
}

/**
 * Real client-side image compression using HTML5 Canvas API
 */
export async function compressImageOnCanvas(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const targetMime: OutputFormat = options.format;
  const quality = Math.max(0.1, Math.min(1.0, options.quality));

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const originalWidth = img.naturalWidth || img.width;
      const originalHeight = img.naturalHeight || img.height;

      const { width, height } = calculateAspectRatioFit(
        originalWidth,
        originalHeight,
        options.maxWidth,
        options.maxHeight
      );

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      // Preserve alpha transparency for PNG and WebP
      const isTransparentFormat = targetMime === 'image/png' || targetMime === 'image/webp';
      const ctx = canvas.getContext('2d', {
        alpha: isTransparentFormat,
      });

      if (!ctx) {
        reject(new Error('Failed to create 2D canvas rendering context.'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // JPEG does not support transparency: fill with white background
      if (targetMime === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      const callback = (blob: Blob | null) => {
        if (!blob) {
          reject(new Error('Failed to convert canvas to image blob.'));
          return;
        }

        // Verify that the browser actually produced the requested MIME type
        // Browsers may fall back to image/png if a format (like WebP) is unsupported
        if (blob.type && blob.type.toLowerCase() !== targetMime.toLowerCase()) {
          reject(
            new Error(
              `The requested format "${getFormatDisplayName(targetMime)}" is not supported by this browser (received ${blob.type}).`
            )
          );
          return;
        }

        const compressedUrl = URL.createObjectURL(blob);
        const compressedSize = blob.size;
        const reduction = calculateReduction(file.size, compressedSize);

        resolve({
          blob,
          url: compressedUrl,
          width,
          height,
          originalWidth,
          originalHeight,
          compressedSize,
          originalSize: file.size,
          reductionPercent: reduction.percent,
          savedBytes: reduction.savedBytes,
          isLarger: reduction.isLarger,
          format: getFormatDisplayName(targetMime),
          mimeType: targetMime,
        });
      };

      // Call canvas.toBlob with exact format specification:
      // - PNG uses lossless encoding (quality argument is ignored by specs)
      // - JPEG and WebP accept a quality parameter (0.1 to 1.0)
      if (targetMime === 'image/png') {
        canvas.toBlob(callback, 'image/png');
      } else if (targetMime === 'image/jpeg') {
        canvas.toBlob(callback, 'image/jpeg', quality);
      } else {
        canvas.toBlob(callback, 'image/webp', quality);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to decode image. The file may be corrupted or unreadable.'));
    };

    img.src = objectUrl;
  });
}
