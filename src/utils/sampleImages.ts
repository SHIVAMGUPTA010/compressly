/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates sample real image files directly in the browser
 * so users can test compression right away with 1 click.
 */
export async function createSampleImageFile(
  name: string = 'sample-landscape.jpg',
  width: number = 1600,
  height: number = 1000
): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Draw rich sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  skyGradient.addColorStop(0, '#1e3a8a');
  skyGradient.addColorStop(0.5, '#3b82f6');
  skyGradient.addColorStop(1, '#93c5fd');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height * 0.7);

  // Draw sun
  ctx.beginPath();
  ctx.arc(width * 0.75, height * 0.25, 90, 0, Math.PI * 2);
  ctx.fillStyle = '#fbbf24';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw mountain range 1 (far)
  ctx.beginPath();
  ctx.moveTo(0, height * 0.7);
  ctx.lineTo(width * 0.25, height * 0.35);
  ctx.lineTo(width * 0.5, height * 0.65);
  ctx.lineTo(width * 0.7, height * 0.4);
  ctx.lineTo(width, height * 0.7);
  ctx.closePath();
  ctx.fillStyle = '#475569';
  ctx.fill();

  // Mountain snow caps
  ctx.beginPath();
  ctx.moveTo(width * 0.2, height * 0.42);
  ctx.lineTo(width * 0.25, height * 0.35);
  ctx.lineTo(width * 0.3, height * 0.43);
  ctx.closePath();
  ctx.fillStyle = '#f8fafc';
  ctx.fill();

  // Draw closer mountains
  ctx.beginPath();
  ctx.moveTo(0, height * 0.7);
  ctx.lineTo(width * 0.4, height * 0.45);
  ctx.lineTo(width * 0.85, height * 0.75);
  ctx.lineTo(0, height * 0.75);
  ctx.closePath();
  ctx.fillStyle = '#334155';
  ctx.fill();

  // Draw lake & reflection
  const waterGradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
  waterGradient.addColorStop(0, '#1e293b');
  waterGradient.addColorStop(0.5, '#0f172a');
  waterGradient.addColorStop(1, '#020617');
  ctx.fillStyle = waterGradient;
  ctx.fillRect(0, height * 0.7, width, height * 0.3);

  // Ripple lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 40; i++) {
    const y = height * 0.72 + (i / 40) * (height * 0.28);
    const xStart = (Math.sin(i * 1.5) * 0.5 + 0.5) * width * 0.3;
    const xEnd = width * 0.7 + (Math.cos(i) * 0.5 + 0.5) * width * 0.3;
    ctx.beginPath();
    ctx.moveTo(xStart, y);
    ctx.lineTo(xEnd, y);
    ctx.stroke();
  }

  // Draw label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('Compressly High-Res Photo', 60, height - 60);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], name, { type: 'image/jpeg' });
        resolve(file);
      }
    }, 'image/jpeg', 0.98);
  });
}

/**
 * Generates a PNG with genuine alpha transparency
 * to test transparency preservation in PNG/WebP and white background in JPEG.
 */
export async function createTransparentSamplePng(
  name: string = 'sample-badge-transparent.png',
  size: number = 800
): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { alpha: true })!;

  // Clear canvas so background is completely transparent
  ctx.clearRect(0, 0, size, size);

  // Draw a circular badge with gradient fill
  const center = size / 2;
  const radius = size * 0.38;

  const gradient = ctx.createLinearGradient(center - radius, center - radius, center + radius, center + radius);
  gradient.addColorStop(0, '#6366f1'); // Indigo
  gradient.addColorStop(1, '#a855f7'); // Purple

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.shadowColor = 'rgba(79, 70, 229, 0.4)';
  ctx.shadowBlur = 30;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw inner ring
  ctx.beginPath();
  ctx.arc(center, center, radius * 0.85, 0, Math.PI * 2);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
  ctx.stroke();

  // Draw star / icon in center
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  const spikes = 5;
  const outerRadius = radius * 0.45;
  const innerRadius = radius * 0.22;
  let rot = (Math.PI / 2) * 3;
  let x = center;
  let y = center;
  const step = Math.PI / spikes;

  ctx.moveTo(center, center - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = center + Math.cos(rot) * outerRadius;
    y = center + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = center + Math.cos(rot) * innerRadius;
    y = center + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(center, center - outerRadius);
  ctx.closePath();
  ctx.fill();

  // Draw text badge
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TRANSPARENT', center, center + radius * 0.65);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], name, { type: 'image/png' });
        resolve(file);
      }
    }, 'image/png');
  });
}
