const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploads = [
  'C:/Users/SaranSM/.gemini/antigravity/brain/7c232d40-f4f1-44f0-bb78-c079a7899d1f/.user_uploaded/media_1793175898966_b0b1b47a.jpg',
  'C:/Users/SaranSM/.gemini/antigravity/brain/7c232d40-f4f1-44f0-bb78-c079a7899d1f/.user_uploaded/media_1793175899148_745e8ef7.jpg',
  'C:/Users/SaranSM/.gemini/antigravity/brain/7c232d40-f4f1-44f0-bb78-c079a7899d1f/.user_uploaded/media_1793175899168_87e06265.jpg',
  'C:/Users/SaranSM/.gemini/antigravity/brain/7c232d40-f4f1-44f0-bb78-c079a7899d1f/.user_uploaded/media_1793175899168_76a3d562.jpg'
];

const originalsDir = path.join(__dirname, '..', 'public', 'images', 'connect', 'originals');
const targetDir = path.join(__dirname, '..', 'public', 'images', 'connect');

fs.mkdirSync(originalsDir, { recursive: true });

async function processPhotos() {
  for (let i = 0; i < uploads.length; i++) {
    const src = uploads[i];
    const indexStr = String(i + 1).padStart(2, '0');
    const origPath = path.join(originalsDir, `connect-${indexStr}-original.jpg`);
    const optPath = path.join(targetDir, `connect-${indexStr}.jpg`);

    // 1. Copy original
    fs.copyFileSync(src, origPath);

    // 2. Read metadata and optimize
    const img = sharp(src).rotate(); // auto-rotate based on EXIF
    const meta = await img.metadata();

    let resizeOpts = {};
    if (meta.width > 1600 || meta.height > 1600) {
      if (meta.width >= meta.height) {
        resizeOpts = { width: 1600, withoutEnlargement: true };
      } else {
        resizeOpts = { height: 1600, withoutEnlargement: true };
      }
      img.resize(resizeOpts);
    }

    await img
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(optPath);

    const outStat = fs.statSync(optPath);
    const outMeta = await sharp(optPath).metadata();
    console.log(`Processed connect-${indexStr}.jpg:`, {
      origSize: fs.statSync(src).size,
      optSize: outStat.size,
      dimensions: `${outMeta.width}x${outMeta.height}`,
      aspectRatio: (outMeta.width / outMeta.height).toFixed(3)
    });
  }
}

processPhotos().catch(console.error);

