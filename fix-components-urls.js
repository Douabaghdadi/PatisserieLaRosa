const fs = require('fs');
const path = require('path');

const componentsDir = 'frontend/app/components';
const files = fs.readdirSync(componentsDir)
  .filter(f => f.endsWith('.tsx'))
  .map(f => path.join(componentsDir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Add import if not present and file uses localhost
  if (content.includes('localhost:5000') && !content.includes('import { API_URL')) {
    const importLine = "import { API_URL, getImageUrl } from '@/lib/api';";
    
    if (content.startsWith("'use client';")) {
      content = content.replace("'use client';", `'use client';\n${importLine}`);
    } else if (content.startsWith('"use client";')) {
      content = content.replace('"use client";', `"use client";\n${importLine}`);
    } else {
      // Add at the top
      content = importLine + '\n' + content;
    }
    modified = true;
  }
  
  // Replace fetch URLs
  if (content.includes('http://localhost:5000/api/')) {
    content = content.replace(/fetch\('http:\/\/localhost:5000\/api\//g, "fetch(`${API_URL}/");
    content = content.replace(/fetch\(`http:\/\/localhost:5000\/api\//g, "fetch(`${API_URL}/");
    modified = true;
  }
  
  // Replace image URLs - simple concatenation
  if (content.includes('http://localhost:5000${')) {
    content = content.replace(/`http:\/\/localhost:5000\$\{([^}]+)\}`/g, '`${API_URL}${$1}`');
    modified = true;
  }
  
  // Replace image URLs - ternary with startsWith
  if (content.includes("? `http://localhost:5000${")) {
    content = content.replace(
      /(\w+)\.image\?\.startsWith\('http'\) \? \1\.image : \1\.image \? `http:\/\/localhost:5000\$\{\1\.image\}` : '([^']+)'/g,
      'getImageUrl($1.image)'
    );
    modified = true;
  }
  
  // Replace simpler ternary patterns
  if (content.includes("startsWith('http') ? ")) {
    content = content.replace(
      /(\w+)\.image\?\.startsWith\('http'\) \? \1\.image : `http:\/\/localhost:5000\$\{\1\.image\}`/g,
      'getImageUrl($1.image)'
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✓ Fixed ${file}`);
  }
});

console.log('\nDone!');
