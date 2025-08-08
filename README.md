# 🌳 Zhupani Familienbaum-Plattform

Eine moderne, webbasierte Familienbaum-Anwendung für die interaktive Verwaltung von Familienstammbäumen, ähnlich FamilyEcho.com.

## ✨ Features

### 🔐 Benutzerverwaltung & Rollen
- **Registrierung & Login** mit JWT-Authentifizierung
- **Rollensystem**: Admin, Familienmitglied, Besucher
- **Passwort-Reset** per E-Mail (optional)
- **Admin-Dashboard** für Benutzerverwaltung

### 🌳 Interaktive Stammbäume
- **Zoom & Pan** Navigation
- **Drag & Drop** Bearbeitung
- **Farbkodierung**: 
  - 🔵 Männer (Blau)
  - 🩷 Frauen (Pink) 
  - ⚫ Verstorbene (Grau)
- **Generationen-Layout** mit automatischer Positionierung

### 👨‍👩‍👧‍👦 Erweiterte Beziehungslogik
- **Automatische Verknüpfungen** zwischen Familienmitgliedern
- **Mehrere Partner** und Ex-Beziehungen
- **Adoptionen** und komplexe Familienstrukturen
- **Geschwisterbeziehungen**
- **Nachnamensbasierte Gruppierung**

### 📝 Beiträge & Erinnerungen
- **Rich-Text Beiträge** mit Bildern
- **Sichtbarkeitseinstellungen**: Öffentlich, Familie, Admin
- **Kommentarfunktion** (geplant)
- **Foto-Upload** via URL

### 🔍 Erweiterte Suche
- **Globale Suche** nach Personen, Familien und Beiträgen
- **Echtzeit-Suchergebnisse**
- **Intelligente Filterung**

### 📱 Modern & Responsiv
- **Mobile-first Design**
- **Dark Mode** Support
- **Intuitive Navigation**
- **Progressive Web App** Features

### 📊 Dashboard & Statistiken
- **Benutzer-Dashboard** mit Aktivitätsübersicht
- **Detaillierte Statistiken**
- **Letzte Aktivitäten**
- **Admin-Analytics**

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Datenbank**: PostgreSQL + Prisma ORM
- **Visualisierung**: React Flow
- **Authentifizierung**: JWT + bcrypt
- **Styling**: Tailwind CSS + Heroicons
- **State Management**: Zustand + React Query

## 🚀 Schnellstart

### Automatische Installation

```bash
# Klone das Repository
git clone <repository-url>
cd zhupani-family-tree

# Führe das Setup-Skript aus
node setup.js

# Starte die Anwendung
npm run dev
```

### Manuelle Installation

```bash
# 1. Dependencies installieren
npm run install:all

# 2. Datenbank einrichten
cd server
cp .env.example .env
# Bearbeite .env mit deinen Datenbankdaten
npx prisma db push

# 3. Development starten
cd ..
npm run dev
```

## 📋 Voraussetzungen

- **Node.js** 18+ 
- **PostgreSQL** 12+
- **npm** oder **yarn**

## 🗄️ Datenbank Setup

1. **PostgreSQL installieren** und starten
2. **Datenbank erstellen**:
   ```sql
   createdb zhupani_family_tree
   ```
3. **Umgebungsvariablen** in `server/.env` konfigurieren:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/zhupani_family_tree"
   JWT_SECRET="your-secret-key"
   ```
4. **Migration ausführen**:
   ```bash
   cd server && npx prisma db push
   ```

## 🎯 Erste Schritte

1. **Registrierung**: Der erste Benutzer wird automatisch zum Admin
2. **Familie erstellen**: Lege deine erste Familie an
3. **Personen hinzufügen**: Füge Familienmitglieder hinzu
4. **Beziehungen definieren**: Verknüpfe Personen miteinander
5. **Stammbaum visualisieren**: Betrachte den interaktiven Baum
6. **Beiträge teilen**: Veröffentliche Erinnerungen und Fotos

## 📁 Projektstruktur

```
zhupani-family-tree/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Wiederverwendbare Komponenten
│   │   ├── pages/         # Seiten-Komponenten
│   │   ├── contexts/      # React Contexts
│   │   ├── services/      # API Services
│   │   └── utils/         # Utility-Funktionen
│   ├── public/            # Statische Assets
│   └── package.json
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── routes/        # API Routes
│   │   ├── middleware/    # Express Middleware
│   │   ├── utils/         # Backend Utilities
│   │   └── types/         # TypeScript Types
│   ├── prisma/            # Datenbank Schema & Migrationen
│   └── package.json
├── setup.js              # Automatisches Setup-Skript
└── README.md
```

## 🔧 Verfügbare Skripte

```bash
# Development (Frontend + Backend)
npm run dev

# Nur Frontend
npm run client:dev

# Nur Backend  
npm run server:dev

# Production Build
npm run build

# Alle Dependencies installieren
npm run install:all
```

## 🌐 API Endpunkte

### Authentifizierung
- `POST /api/auth/register` - Benutzerregistrierung
- `POST /api/auth/login` - Benutzeranmeldung
- `GET /api/auth/me` - Aktueller Benutzer

### Familien
- `GET /api/families` - Alle Familien
- `POST /api/families` - Familie erstellen
- `GET /api/families/:id` - Familie mit Personen

### Personen
- `POST /api/persons` - Person erstellen
- `PUT /api/persons/:id` - Person bearbeiten
- `POST /api/persons/:id/relationships` - Beziehung hinzufügen

### Beiträge
- `GET /api/posts` - Alle Beiträge
- `POST /api/posts` - Beitrag erstellen

### Admin (nur für Admins)
- `GET /api/users` - Alle Benutzer
- `PATCH /api/users/:id/role` - Benutzerrolle ändern

## 🎨 Farbschema

- **Primärfarbe**: Blau (#3B82F6)
- **Männer**: Blau (#3B82F6)
- **Frauen**: Pink (#EC4899)
- **Verstorbene**: Grau (#6B7280)
- **Erfolg**: Grün (#10B981)
- **Warnung**: Orange (#F59E0B)
- **Fehler**: Rot (#EF4444)

## 🔒 Sicherheit

- **JWT-Tokens** für Authentifizierung
- **Passwort-Hashing** mit bcrypt
- **Input-Validierung** mit Joi
- **CORS-Schutz**
- **Helmet.js** für HTTP-Header-Sicherheit

## 🚀 Deployment

### Vercel (Frontend)
```bash
cd client
npm run build
# Deploy zu Vercel
```

### Heroku (Backend)
```bash
# Heroku CLI installieren
heroku create zhupani-api
heroku addons:create heroku-postgresql
git push heroku main
```

## 🤝 Beitragen

1. **Fork** das Repository
2. **Feature Branch** erstellen (`git checkout -b feature/AmazingFeature`)
3. **Commit** deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. **Push** zum Branch (`git push origin feature/AmazingFeature`)
5. **Pull Request** öffnen

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe `LICENSE` Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:
- **Issues** auf GitHub erstellen
- **Dokumentation** in `/docs` prüfen
- **Community** Discord beitreten

## 🎉 Danksagungen

- **React Flow** für die Stammbaum-Visualisierung
- **Tailwind CSS** für das moderne Design
- **Prisma** für die Datenbank-Integration
- **Heroicons** für die Icons

---

**Entwickelt mit ❤️ für Familien weltweit**