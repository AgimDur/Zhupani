import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import {
  UserGroupIcon,
  HeartIcon,
  PhotoIcon,
  DevicePhoneMobileIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { UserStats } from '../components/Dashboard/UserStats.tsx';
import { RecentActivity } from '../components/Dashboard/RecentActivity.tsx';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      name: 'Interaktive Stammbäume',
      description: 'Erstelle und bearbeite Familienstammbäume mit Zoom, Pan und Drag & Drop.',
      icon: UserGroupIcon,
    },
    {
      name: 'Beziehungsmanagement',
      description: 'Verwalte komplexe Familienbeziehungen, Partnerschaften und Adoptionen.',
      icon: HeartIcon,
    },
    {
      name: 'Fotos & Erinnerungen',
      description: 'Füge Fotos hinzu und teile Familienerinnerungen mit Beiträgen.',
      icon: PhotoIcon,
    },
    {
      name: 'Mobil optimiert',
      description: 'Vollständig responsive Design für alle Geräte.',
      icon: DevicePhoneMobileIcon,
    },
  ];

  // Dashboard für angemeldete Benutzer
  if (user) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Willkommen zurück, {user.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Hier ist eine Übersicht über deine Familienaktivitäten
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/family-tree"
            className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <UserGroupIcon className="h-8 w-8" />
              <div>
                <h3 className="font-semibold">Stammbaum verwalten</h3>
                <p className="text-sm opacity-90">Familien und Personen bearbeiten</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/posts"
            className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <PhotoIcon className="h-8 w-8" />
              <div>
                <h3 className="font-semibold">Beiträge erstellen</h3>
                <p className="text-sm opacity-90">Erinnerungen und Fotos teilen</p>
              </div>
            </div>
          </Link>
          
          <div className="bg-green-600 text-white p-6 rounded-lg cursor-pointer hover:bg-green-700 transition-colors group">
            <div className="flex items-center space-x-3">
              <PlusIcon className="h-8 w-8" />
              <div>
                <h3 className="font-semibold">Neue Familie</h3>
                <p className="text-sm opacity-90">Stammbaum erweitern</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <UserStats />
          </div>
          <div className="card">
            <RecentActivity />
          </div>
        </div>
      </div>
    );
  }

  // Landing Page für nicht angemeldete Benutzer
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Willkommen bei{' '}
          <span className="text-blue-600">Zhupani</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Erstelle und verwalte interaktive Familienstammbäume. Verbinde dich mit deiner Familie
          und bewahre eure Geschichte für kommende Generationen.
        </p>
        
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Jetzt registrieren
          </Link>
          <Link
            to="/login"
            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors inline-block"
          >
            Anmelden
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Funktionen
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Alles was du brauchst, um deine Familiengeschichte zu dokumentieren
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Color Legend */}
      <div className="py-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Farbkodierung
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Personen werden nach Geschlecht und Status farblich gekennzeichnet
          </p>
        </div>

        <div className="flex justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">Männer</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">Frauen</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">Verstorbene</span>
          </div>
        </div>
      </div>
    </div>
  );
};