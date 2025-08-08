#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Funktion zum rekursiven Durchsuchen von Verzeichnissen
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Funktion zum Korrigieren der Imports
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Korrigiere relative Imports ohne Erweiterung
  const importRegex = /from ['"](\.\/.+?)['"];/g;
  
  content = content.replace(importRegex, (match, importPath) => {
    // Überspringe bereits korrekte Imports
    if (importPath.endsWith('.tsx') || importPath.endsWith('.ts') || importPath.endsWith('.css')) {
      return match;
    }
    
    // Bestimme die korrekte Erweiterung
    const fullPath = path.resolve(path.dirname(filePath), importPath);
    
    if (fs.existsSync(fullPath + '.tsx')) {
      modified = true;
      return match.replace(importPath, importPath + '.tsx');
    } else if (fs.existsSync(fullPath + '.ts')) {
      modified = true;
      return match.replace(importPath, importPath + '.ts');
    }
    
    return match;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed imports in: ${filePath}`);
  }
}

// Hauptfunktion
function main() {
  const clientSrcDir = path.join(__dirname, 'client', 'src');
  
  if (!fs.existsSync(clientSrcDir)) {
    console.error('❌ client/src directory not found');
    process.exit(1);
  }
  
  console.log('🔧 Fixing TypeScript imports...');
  
  const tsxFiles = findTsxFiles(clientSrcDir);
  
  tsxFiles.forEach(fixImports);
  
  console.log(`🎉 Processed ${tsxFiles.length} files`);
}

main();