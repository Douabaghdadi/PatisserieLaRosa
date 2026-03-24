const fs = require('fs');
const path = require('path');

const files = [
  'frontend/app/(public)/page.tsx',
  'frontend/app/(public)/shop/page.tsx',
  'frontend/app/(public)/category/[id]/page.tsx',
  'frontend/app/(public)/subcategory/[id]/page.tsx',
  'frontend/app/(public)/product/[id]/page.tsx',
  'frontend/app/(public)/nouveautes/page.tsx',
  'frontend/app/(public)/promotions/page.tsx',
  'frontend/app/(public)/recherche/page.tsx',
  'frontend/app/(public)/orders/page.tsx',
  'frontend/app/(public)/contact/page.tsx',
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Add import if not present
  if (!content.includes('import { API_URL')) {
    const importLine = "import { API_URL, getImageUrl } from '@/lib/api';";
    if (content.includes("'use client';")) {
      content = content.replace("'use client';", `'use client';\n${importLine}`);
    } else {
      content = importLine + '\n' + content;
    }
  }
  
  // Replace fetch URLs
  content = content.replace(/fetch\('http:\/\/localhost:5000\/api\//g, "fetch(`${API_URL}/");
  content = content.replace(/fetch\(`http:\/\/localhost:5000\/api\//g, "fetch(`${API_URL}/");
  
  // Replace image URLs
  content = content.replace(
    /product\.image\?\.startsWith\('http'\) \? product\.image : product\.image \? `http:\/\/localhost:5000\$\{product\.image\}` : '\/img\/product-placeholder\.jpg'/g,
    "getImageUrl(product.image)"
  );
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`✓ Fixed ${file}`);
});

console.log('\nDone!');
