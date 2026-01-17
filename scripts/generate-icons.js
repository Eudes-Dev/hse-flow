const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Créer un SVG simple avec les couleurs du design system
const createIconSVG = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0B0B0B"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="#F2E41C"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" 
        font-family="Inter, sans-serif" font-size="${size / 4}" font-weight="bold" fill="#0B0B0B">HSE</text>
</svg>`;
};

const publicDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateIcons() {
  console.log('Génération des icônes PWA...');

  const sizes = [192, 512];

  for (const size of sizes) {
    const svg = createIconSVG(size);
    const svgBuffer = Buffer.from(svg);
    
    await sharp(svgBuffer)
      .png()
      .resize(size, size)
      .toFile(path.join(publicDir, `icon-${size}x${size}.png`));
    
    console.log(`✓ Icône ${size}x${size} créée`);
  }

  // Créer également le favicon.ico (16x16 et 32x32)
  const faviconSvg = createIconSVG(32);
  const faviconBuffer = Buffer.from(faviconSvg);
  
  await sharp(faviconBuffer)
    .png()
    .resize(32, 32)
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  console.log('✓ Icônes PWA générées avec succès dans public/icons/');
}

generateIcons().catch(console.error);
