import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { UserStats } from '../components/Dashboard/UserStats';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'FAMILY_MEMBER':
        return 'Familienmitglied';
      case 'VISITOR':
        return 'Besucher';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'FAMILY_MEMBER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'VISITOR':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <UserIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h1>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleColor(user.role)}`}>
              {getRoleName(user.role)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Persönliche Informationen
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">E-Mail</p>
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vollständiger Name</p>
                  <p className="text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mitglied seit</p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date().toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Kontoeinstellungen
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <h3 className="font-medium text-gray-900 dark:text-white">Profil bearbeiten</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Name und E-Mail-Adresse ändern
                </p>
              </button>
              <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <h3 className="font-medium text-gray-900 dark:text-white">Passwort ändern</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sicherheitseinstellungen verwalten
                </p>
              </button>
              <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <h3 className="font-medium text-gray-900 dark:text-white">Benachrichtigungen</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  E-Mail-Benachrichtigungen konfigurieren
                </p>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <UserStats />
        </div>
      </div>
    </div>
  );
};