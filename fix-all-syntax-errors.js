const fs = require('fs');

const fixes = [
  // Fix flavors/[id]/page.tsx - ligne 67
  {
    file: 'frontend/app/admin/flavors/[id]/page.tsx',
    find: '      <div className=`d-flex justify-content-center align-items-center" style={{ minHeight: \'400px\' }}>',
    replace: '      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: \'400px\' }}>'
  },
  // Fix flavors/page.tsx - ligne 48
  {
    file: 'frontend/app/admin/flavors/page.tsx',
    find: '      const res = await fetch(`${API_URL}/flavors/${id}`, {',
    replace: '      const res = await fetch(`${API_URL}/flavors/${id}`, {'
  },
  // Fix messages/page.tsx - ligne 52
  {
    file: 'frontend/app/admin/messages/page.tsx',
    find: '          Authorization: `Bearer ${token}`',
    replace: '          Authorization: `Bearer ${token}`'
  },
  // Fix orders/page.tsx - ligne 60-61
  {
    file: 'frontend/app/admin/orders/page.tsx',
    find: '        method: `PUT",\n        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },',
    replace: '        method: "PUT",\n        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },'
  },
  // Fix products/[id]/page.tsx - ligne 64-65
  {
    file: 'frontend/app/admin/products/[id]/page.tsx',
    find: '    await fetch(`${API_URL}/products/${params.id}`, {\n      method: `PUT",',
    replace: '    await fetch(`${API_URL}/products/${params.id}`, {\n      method: "PUT",'
  },
  // Fix products/page.tsx - ligne 98-99
  {
    file: 'frontend/app/admin/products/page.tsx',
    find: '    await fetch(`${API_URL}/products/${product._id}`, {\n      method: `PUT",',
    replace: '    await fetch(`${API_URL}/products/${product._id}`, {\n      method: "PUT",'
  },
  // Fix profile/page.tsx - ligne 50
  {
    file: 'frontend/app/admin/profile/page.tsx',
    find: '    <div className=`container-scroller">',
    replace: '    <div className="container-scroller">'
  },
  // Fix subcategories/[id]/page.tsx - ligne 35-36
  {
    file: 'frontend/app/admin/subcategories/[id]/page.tsx',
    find: '    await fetch(`${API_URL}/subcategories/${params.id}`, {\n      method: `PUT",',
    replace: '    await fetch(`${API_URL}/subcategories/${params.id}`, {\n      method: "PUT",'
  },
  // Fix subcategories/page.tsx - ligne 69-70
  {
    file: 'frontend/app/admin/subcategories/page.tsx',
    find: '      const url = editingSubcategory\n        ? `http://localhost:5000/api/subcategories/${editingSubcategory._id}`\n        : "http://localhost:5000/api/subcategories";',
    replace: '      const url = editingSubcategory\n        ? `${API_URL}/subcategories/${editingSubcategory._id}`\n        : `${API_URL}/subcategories`;'
  },
  // Fix users/[id]/page.tsx - ligne 41-42
  {
    file: 'frontend/app/admin/users/[id]/page.tsx',
    find: '    const res = await fetch(`${API_URL}/users/${params.id}`, {\n      method: `PUT",',
    replace: '    const res = await fetch(`${API_URL}/users/${params.id}`, {\n      method: "PUT",'
  },
  // Fix users/page.tsx - ligne 82-83
  {
    file: 'frontend/app/admin/users/page.tsx',
    find: '        await fetch(`${API_URL}/users/${editingUser._id}`, {\n          method: `PUT",',
    replace: '        await fetch(`${API_URL}/users/${editingUser._id}`, {\n          method: "PUT",'
  },
];

fixes.forEach(fix => {
  try {
    if (!fs.existsSync(fix.file)) {
      console.log(`⚠️  Fichier non trouvé: ${fix.file}`);
      return;
    }

    let content = fs.readFileSync(fix.file, 'utf8');
    
    if (content.includes(fix.find)) {
      content = content.replace(fix.find, fix.replace);
      fs.writeFileSync(fix.file, content, 'utf8');
      console.log(`✅ Corrigé: ${fix.file}`);
    } else {
      console.log(`⚠️  Pattern non trouvé dans: ${fix.file}`);
    }
  } catch (error) {
    console.error(`❌ Erreur dans ${fix.file}:`, error.message);
  }
});

console.log('\n✅ Toutes les corrections appliquées!');
