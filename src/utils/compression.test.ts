import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBytes,
  calculateReduction,
  getOutputExtension,
  getFormatDisplayName,
  generateCompressedFilename,
  validateImageFile,
  calculateAspectRatioFit,
} from './compression';

test('formatBytes formats bytes correctly', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1024 * 1024), '1 MB');
  assert.equal(formatBytes(2.5 * 1024 * 1024, 1), '2.5 MB');
  assert.equal(formatBytes(5000000, 2), '4.77 MB');
});

test('calculateReduction calculates savings and flags larger files accurately', () => {
  // 1000 to 250 -> 75% reduction
  const res1 = calculateReduction(1000, 250);
  assert.equal(res1.percent, 75);
  assert.equal(res1.savedBytes, 750);
  assert.equal(res1.isLarger, false);

  // No reduction / zero
  const res2 = calculateReduction(0, 0);
  assert.equal(res2.percent, 0);

  // File grew in size (e.g. converting a highly compressed JPEG to lossless PNG)
  const res3 = calculateReduction(1000, 1250);
  assert.equal(res3.isLarger, true);
  assert.equal(res3.percent, 25);
  assert.equal(res3.savedBytes, -250);
});

test('getOutputExtension maps mime types properly', () => {
  assert.equal(getOutputExtension('image/jpeg'), 'jpg');
  assert.equal(getOutputExtension('image/jpg'), 'jpg');
  assert.equal(getOutputExtension('image/png'), 'png');
  assert.equal(getOutputExtension('image/webp'), 'webp');
  assert.equal(getOutputExtension('unknown/mime'), 'jpg');
});

test('getFormatDisplayName provides standard labels', () => {
  assert.equal(getFormatDisplayName('image/webp'), 'WebP');
  assert.equal(getFormatDisplayName('image/jpeg'), 'JPEG');
  assert.equal(getFormatDisplayName('image/png'), 'PNG');
});

test('generateCompressedFilename produces clean filenames matching extension', () => {
  assert.equal(
    generateCompressedFilename('vacation-photo.JPG', 'image/jpeg'),
    'vacation-photo-compressed.jpg'
  );
  assert.equal(
    generateCompressedFilename('screenshot.png', 'image/webp'),
    'screenshot-compressed.webp'
  );
  assert.equal(
    generateCompressedFilename('banner (copy).png', 'image/png'),
    'banner__copy_-compressed.png'
  );
  assert.equal(
    generateCompressedFilename('', 'image/png'),
    'compressed-image.png'
  );
});

test('validateImageFile validates image formats and sizes', () => {
  const validJpeg = { name: 'photo.jpg', type: 'image/jpeg', size: 1024 * 500 } as any;
  const validWebp = { name: 'graphic.webp', type: 'image/webp', size: 1024 * 100 } as any;
  const invalidPdf = { name: 'doc.pdf', type: 'application/pdf', size: 1024 * 100 } as any;
  const oversizedFile = { name: 'huge.jpg', type: 'image/jpeg', size: 60 * 1024 * 1024 } as any;

  assert.equal(validateImageFile(validJpeg).isValid, true);
  assert.equal(validateImageFile(validWebp).isValid, true);
  assert.equal(validateImageFile(invalidPdf).isValid, false);
  assert.equal(validateImageFile(oversizedFile).isValid, false);
});

test('calculateAspectRatioFit scales dimensions preserving aspect ratio', () => {
  // Fit 2000x1000 into max width 1000 -> 1000x500
  const fit1 = calculateAspectRatioFit(2000, 1000, 1000);
  assert.equal(fit1.width, 1000);
  assert.equal(fit1.height, 500);

  // If already smaller than max, keep original dimensions
  const fit2 = calculateAspectRatioFit(800, 600, 1200);
  assert.equal(fit2.width, 800);
  assert.equal(fit2.height, 600);
});
