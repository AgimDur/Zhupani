#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Zhupani Familienbaum Setup wird gestartet...\n');

// Funktion zum Ausführen von Befehlen
function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`📦 Führe aus: ${command}`);
    execSync(command, { cwd, stdio: 'inherit' });
    console.log('✅ Erfolgreich abgeschlossen\n');
  } catch (error) {
    console.error(`❌ Fehler beim Ausführen von: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Prüfe ob Node.js und npm installiert sind
function checkPrerequisites() {
  console.log('🔍 Prüfe Voraussetzungen...');
  
  try {
    execSync('node --version', { stdio: 'pipe' });
    execSync('npm --version', { stdio: 'pipe' });
    console.log('✅ Node.js und npm sind installiert\n');
  } catch (error) {
    console.error('❌ Node.js oder npm ist nicht installiert');
    console.error('Bitte installiere Node.js von https://nodejs.org/');
    process.exit(1);
  }
}

// Installiere Dependencies
function installDependencies() {
  console.log('📦 Installiere Dependencies...');
  
  // Root dependencies
  runCommand('npm install');
  
  // Server dependencies
  runCommand('npm install', './server');
  
  // Client dependencies
  runCommand('npm install', './client');
}

// Erstelle Datenbank-Migration
function setupDatabase() {
  console.log('🗄️ Richte Datenbank ein...');
  
  // Prüfe ob PostgreSQL läuft
  try {
    console.log('📋 Hinweis: Stelle sicher, dass PostgreSQL läuft und die Datenbank "zhupani_family_tree" existiert');
    console.log('📋 Du kannst die Datenbank mit folgendem Befehl erstellen:');
    console.log('   createdb zhupani_family_tree');
    console.log('📋 Oder ändere die DATABASE_URL in server/.env\n');
    
    // Führe Prisma-Migration aus
    runCommand('npx prisma generate', './server');
    runCommand('npx prisma db push', './server');
    
    console.log('✅ Datenbank erfolgreich eingerichtet\n');
  } catch (error) {
    console.log('⚠️  Datenbank-Setup übersprungen. Bitte richte die Datenbank manuell ein:');
    console.log('   1. Erstelle eine PostgreSQL-Datenbank');
    console.log('   2. Aktualisiere die DATABASE_URL in server/.env');
    console.log('   3. Führe "cd server && npx prisma db push" aus\n');
  }
}

// Erstelle ersten Admin-Benutzer
function createAdminUser() {
  console.log('👤 Erstelle Admin-Benutzer...');
  console.log('📋 Nach dem Start der Anwendung kannst du dich registrieren');
  console.log('📋 Der erste Benutzer wird automatisch zum Admin\n');
}

// Zeige finale Anweisungen
function showFinalInstructions() {
  console.log('🎉 Setup erfolgreich abgeschlossen!\n');
  console.log('🚀 So startest du die Anwendung:');
  console.log('   npm run dev\n');
  console.log('📱 Die Anwendung wird verfügbar sein unter:');
  console.log('   Frontend: http://localhost:3000');
  console.log('   Backend:  http://localhost:5000\n');
  console.log('📋 Erste Schritte:');
  console.log('   1. Registriere dich als erster Benutzer (wird automatisch Admin)');
  console.log('   2. Erstelle deine erste Familie');
  console.log('   3. Füge Personen und Beziehungen hinzu');
  console.log('   4. Teile Beiträge und Erinnerungen\n');
  console.log('📚 Weitere Informationen findest du in der README.md');
}

// Hauptfunktion
function main() {
  try {
    checkPrerequisites();
    installDependencies();
    setupDatabase();
    createAdminUser();
    showFinalInstructions();
  } catch (error) {
    console.error('❌ Setup fehlgeschlagen:', error.message);
    process.exit(1);
  }
}

// Führe Setup aus
main();