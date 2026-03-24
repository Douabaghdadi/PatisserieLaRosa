const fs = require('fs');
const path = require('path');

// Fichiers admin à corriger
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

  // Ajouter l'import de API_URL si nécessaire
  if (!content.includes("from '@/lib/api'") && !content.includes('from "../lib/api"')) {
    // Trouver la dernière ligne d'import
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith("import ")) {
        lastImportIndex = i;
      }
    }

    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, "import { API_URL, getImageUrl } from '@/lib/api';");
      content = lines.join('\n');
      modified = true;
    }
  }

  // Remplacer toutes les occurrences de localhost:5000
  const originalContent = content;
  
  // Remplacer les fetch avec localhost:5000
  content = content.replace(/fetch\(\s*["'`]http:\/\/localhost:5000/g, 'fetch(`${API_URL}');
  content = content.replace(/fetch\(\s*["'`]http:\/\/localhost:5000\/api/g, 'fetch(`${API_URL}');
  
  // Remplacer les URLs d'images avec localhost:5000
  content = content.replace(/http:\/\/localhost:5000\$\{/g, '${API_URL.replace(/\\/api$/, "")}${');
  content = content.replace(/`http:\/\/localhost:5000\$\{([^}]+)\}`/g, '`${API_URL.replace(/\\/api$/, "")}${$1}`');
  
  if (content !== originalContent) {
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigé: ${filePath}`);
  } else {
    console.log(`ℹ️  Aucun changement: ${filePath}`);
  }
});

console.log('\n✅ Tous les fichiers admin ont été mis à jour!');
