/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Rotate an image 90 degrees clockwise using HTML5 Canvas
 */
export async function rotateImage90(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalHeight || img.height;
      canvas.height = img.naturalWidth || img.width;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to create canvas context'));
        return;
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      const mimeType = file.type || 'image/png';
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to rotate image'));
          return;
        }
        const rotatedFile = new File([blob], file.name, { type: blob.type || mimeType });
        resolve(rotatedFile);
      }, mimeType);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for rotation'));
    };

    img.src = url;
  });
}

/**
 * Convert an image directly to JPG format with solid white background
 */
export async function convertToJpg(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to create canvas context'));
        return;
      }

      // Fill white background for JPEG
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to convert to JPG'));
          return;
        }
        const dotIndex = file.name.lastIndexOf('.');
        const baseName = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
        const newFile = new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
        resolve(newFile);
      }, 'image/jpeg', 0.92);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for conversion'));
    };

    img.src = url;
  });
}

/**
 * Add a clean watermark to an image
 */
export async function applyWatermark(file: File, watermarkText: string = 'Compressly'): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to create canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Watermark styling
      const fontSize = Math.max(20, Math.round(canvas.width / 24));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 6;
      ctx.textAlign = 'right';
      ctx.fillText(watermarkText, canvas.width - 24, canvas.height - 24);

      const mimeType = file.type || 'image/png';
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to watermark image'));
          return;
        }
        const newFile = new File([blob], file.name, { type: blob.type || mimeType });
        resolve(newFile);
      }, mimeType);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for watermarking'));
    };

    img.src = url;
  });
}

/**
 * Resize image dimensions by percentage
 */
export async function resizeImageScale(file: File, scaleFactor: number = 0.5): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const targetWidth = Math.max(1, Math.round((img.naturalWidth || img.width) * scaleFactor));
      const targetHeight = Math.max(1, Math.round((img.naturalHeight || img.height) * scaleFactor));

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to create canvas context'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mimeType = file.type || 'image/png';
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to resize image'));
          return;
        }
        const newFile = new File([blob], file.name, { type: blob.type || mimeType });
        resolve(newFile);
      }, mimeType);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for resize'));
    };

    img.src = url;
  });
}

/**
 * Crop image to aspect ratio
 */
export async function cropImageToAspect(file: File, aspect: '1:1' | '16:9' = '1:1'): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const srcWidth = img.naturalWidth || img.width;
      const srcHeight = img.naturalHeight || img.height;

      let cropWidth = srcWidth;
      let cropHeight = srcHeight;
      let cropX = 0;
      let cropY = 0;

      if (aspect === '1:1') {
        const side = Math.min(srcWidth, srcHeight);
        cropWidth = side;
        cropHeight = side;
        cropX = Math.round((srcWidth - side) / 2);
        cropY = Math.round((srcHeight - side) / 2);
      } else if (aspect === '16:9') {
        const targetRatio = 16 / 9;
        const currentRatio = srcWidth / srcHeight;
        if (currentRatio > targetRatio) {
          cropWidth = Math.round(srcHeight * targetRatio);
          cropHeight = srcHeight;
          cropX = Math.round((srcWidth - cropWidth) / 2);
        } else {
          cropWidth = srcWidth;
          cropHeight = Math.round(srcWidth / targetRatio);
          cropY = Math.round((srcHeight - cropHeight) / 2);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to create canvas context'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      const mimeType = file.type || 'image/png';
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to crop image'));
          return;
        }
        const newFile = new File([blob], file.name, { type: blob.type || mimeType });
        resolve(newFile);
      }, mimeType);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for cropping'));
    };

    img.src = url;
  });
}
