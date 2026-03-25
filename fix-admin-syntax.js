const fs = require('fs');
const path = require('path');

// Tous les fichiers admin
const adminFiles = [
  'frontend/app/admin/page.tsx',
  'frontend/app/admin/users/page.tsx',
  'frontend/app/admin/users/new/page.tsx',
  'frontend/app/admin/users/[id]/page.tsx',
  'frontend/app/admin/products/page.tsx',
  'frontend/app/admin/products/new/page.tsx',
  'frontend/app/admin/products/[id]/page.tsx',
  'frontend/app/admin/orders/page.tsx',
  'frontend/app/admin/messages/page.tsx',
  'frontend/app/admin/categories/page.tsx',
  'frontend/app/admin/categories/new/page.tsx',
  'frontend/app/admin/categories/[id]/page.tsx',
  'frontend/app/admin/subcategories/page.tsx',
  'frontend/app/admin/subcategories/new/page.tsx',
  'frontend/app/admin/subcategories/[id]/page.tsx',
  'frontend/app/admin/flavors/page.tsx',
  'frontend/app/admin/flavors/[id]/page.tsx',
  'frontend/app/admin/profile/page.tsx',
  'frontend/app/admin/search/page.tsx',
  'frontend/app/forgot-password/page.tsx',
  'frontend/app/reset-password/page.tsx',
];

adminFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Corriger les erreurs de syntaxe : remplacer `${API_URL}/api/xxx" par `${API_URL}/xxx`
  const beforeFix = content;
  
  // Pattern 1: `${API_URL}/api/xxx" -> `${API_URL}/xxx`
  content = content.replace(/`\$\{API_URL\}\/api\/([^"]+)"/g, '`${API_URL}/$1`');
  
  // Pattern 2: Corriger les doubles /api/api
  content = content.replace(/\$\{API_URL\}\/api\/api\//g, '${API_URL}/');
  
  // Pattern 3: Enlever le /api après API_URL car API_URL contient déjà /api
  content = content.replace(/\$\{API_URL\}\/api\//g, '${API_URL}/');

  if (content !== beforeFix) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigé: ${filePath}`);
    modified = true;
  } else {
    console.log(`ℹ️  Aucun changement: ${filePath}`);
  }
});

console.log('\n✅ Corrections de syntaxe terminées!');
