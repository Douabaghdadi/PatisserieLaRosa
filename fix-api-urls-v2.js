const fs = require('fs');

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
  
  // Fix broken template literals - replace fetch(`${API_URL}/xxx') with fetch(`${API_URL}/xxx`)
  content = content.replace(/fetch\(`\$\{API_URL\}\/([^']+)'\)/g, 'fetch(`${API_URL}/$1`)');
  
  // Fix broken template literals in headers
  content = content.replace(/`Bearer \$\{token\}`/g, '`Bearer ${token}`');
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`✓ Fixed ${file}`);
});

console.log('\nDone!');
