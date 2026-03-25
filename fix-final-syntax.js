const fs = require('fs');
const glob = require('glob');

// Trouver tous les fichiers .tsx dans admin
const files = glob.sync('frontend/app/admin/**/*.tsx');
files.push('frontend/app/forgot-password/page.tsx');
files.push('frontend/app/reset-password/page.tsx');

let totalFixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Fix 1: || `" -> || ""
  content = content.replace(/\|\| `"/g, '|| ""');
  
  // Fix 2: method: `DELETE" -> method: "DELETE"
  content = content.replace(/method: `([A-Z]+)"/g, 'method: "$1"');
  
  // Fix 3: method: `PUT" -> method: "PUT"
  content = content.replace(/method: `([A-Z]+)"/g, 'method: "$1"');
  
  // Fix 4: className=` -> className="
  content = content.replace(/className=`/g, 'className="');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ ${file}`);
    totalFixed++;
  }
});

console.log(`\n✅ ${totalFixed} fichiers corrigés!`);
