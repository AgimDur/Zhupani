# 🚀 Deployment Guide

## Vercel Deployment (Empfohlen)

### 1. Repository auf GitHub hochladen

```bash
# Git Repository initialisieren
git init
git add .
git commit -m "Initial commit: Zhupani Familienbaum Platform"

# GitHub Repository erstellen und verknüpfen
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/zhupani-family-tree.git
git push -u origin main
```

### 2. Vercel Setup

1. **Vercel Account**: Gehe zu [vercel.com](https://vercel.com) und melde dich an
2. **Import Project**: Klicke auf "New Project" und importiere dein GitHub Repository
3. **Framework Preset**: Wähle "Other" (da wir ein Monorepo haben)
4. **Build Settings**:
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm install`

### 3. Umgebungsvariablen in Vercel

Füge folgende Environment Variables in Vercel hinzu:

```env
# Database (verwende einen Cloud-Provider wie Supabase oder Railway)
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-production

# Node Environment
NODE_ENV=production

# Client URL (wird automatisch von Vercel gesetzt)
CLIENT_URL=https://your-app.vercel.app
```

### 4. Datenbank Setup (Cloud)

#### Option A: Supabase (Empfohlen)
1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle ein neues Projekt
3. Kopiere die PostgreSQL Connection String
4. Füge sie als `DATABASE_URL` in Vercel hinzu

#### Option B: Railway
1. Gehe zu [railway.app](https://railway.app)
2. Erstelle eine PostgreSQL Datenbank
3. Kopiere die Connection String
4. Füge sie als `DATABASE_URL` in Vercel hinzu

### 5. Deployment ausführen

```bash
# Push zu GitHub (löst automatisch Vercel Deployment aus)
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

## Alternative: Heroku Deployment

### 1. Heroku CLI installieren
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download von https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Heroku App erstellen
```bash
heroku create zhupani-family-tree
heroku addons:create heroku-postgresql:hobby-dev
```

### 3. Environment Variables setzen
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key
heroku config:set CLIENT_URL=https://zhupani-family-tree.herokuapp.com
```

### 4. Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

## Lokale Entwicklung mit Production-Datenbank

```bash
# .env Datei für lokale Entwicklung mit Cloud-DB
DATABASE_URL="postgresql://cloud-db-url"
NODE_ENV=development
JWT_SECRET=local-development-secret
CLIENT_URL=http://localhost:3000
```

## Post-Deployment Schritte

### 1. Datenbank Migration
```bash
# Lokal mit Cloud-DB
cd server
npx prisma db push

# Oder über Vercel CLI
vercel env pull .env.local
npx prisma db push
```

### 2. Ersten Admin-User erstellen
1. Öffne deine deployed App
2. Registriere dich als erster User
3. Du wirst automatisch zum Admin

### 3. Domain konfigurieren (Optional)
1. In Vercel: Settings → Domains
2. Füge deine Custom Domain hinzu
3. Konfiguriere DNS Records

## Monitoring & Wartung

### Logs anzeigen
```bash
# Vercel
vercel logs

# Heroku
heroku logs --tail
```

### Datenbank Backup
```bash
# PostgreSQL Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Troubleshooting

### Häufige Probleme:

1. **Build Fehler**: Prüfe Node.js Version (>=18)
2. **Database Connection**: Prüfe DATABASE_URL Format
3. **CORS Errors**: Prüfe CLIENT_URL Konfiguration
4. **Missing Dependencies**: Führe `npm install` in beiden Ordnern aus

### Debug Commands:
```bash
# Vercel Build lokal testen
vercel dev

# Prisma Schema prüfen
npx prisma validate

# Database Connection testen
npx prisma db pull
```

## Performance Optimierung

### 1. Client-Side
- React.lazy() für Code Splitting
- Image Optimization
- Service Worker für Caching

### 2. Server-Side
- Database Indexing
- Query Optimization
- Response Caching

### 3. CDN
- Vercel Edge Network (automatisch)
- Static Asset Optimization

## Sicherheit

### Production Checklist:
- [ ] Starke JWT Secrets
- [ ] HTTPS erzwungen
- [ ] Rate Limiting implementiert
- [ ] Input Validation aktiv
- [ ] Error Messages sanitized
- [ ] Database Backups konfiguriert

---

**🎉 Deine Zhupani Familienbaum-Plattform ist bereit für die Welt!**