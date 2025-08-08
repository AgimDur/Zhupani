import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.ts';
import { PlusIcon, UserGroupIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Family {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  creator: {
    firstName: string;
    lastName: string;
  };
  _count: {
    persons: number;
  };
}

export const FamilyTreePage: React.FC = () => {
  const navigate = useNavigate();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFamily, setNewFamily] = useState({
    name: '',
    description: '',
    isPublic: false
  });

  useEffect(() => {
    loadFamilies();
  }, []);

  const loadFamilies = async () => {
    try {
      const response = await api.get('/families');
      setFamilies(response.data);
    } catch (error) {
      toast.error('Fehler beim Laden der Familien');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFamily.name.trim()) {
      toast.error('Familienname ist erforderlich');
      return;
    }

    try {
      const response = await api.post('/families', newFamily);
      setFamilies([response.data, ...families]);
      setNewFamily({ name: '', description: '', isPublic: false });
      setShowCreateForm(false);
      toast.success('Familie erfolgreich erstellt!');
    } catch (error) {
      toast.error('Fehler beim Erstellen der Familie');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Familienstammbäume
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Verwalte deine Familienstammbäume und erkunde andere Familien
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Neue Familie</span>
        </button>
      </div>

      {/* Create Family Form */}
      {showCreateForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Neue Familie erstellen</h2>
          <form onSubmit={handleCreateFamily} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Familienname *
              </label>
              <input
                type="text"
                className="input-field"
                value={newFamily.name}
                onChange={(e) => setNewFamily({ ...newFamily, name: e.target.value })}
                placeholder="z.B. Familie Durmishi"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Beschreibung
              </label>
              <textarea
                className="input-field"
                rows={3}
                value={newFamily.description}
                onChange={(e) => setNewFamily({ ...newFamily, description: e.target.value })}
                placeholder="Optionale Beschreibung der Familie..."
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={newFamily.isPublic}
                onChange={(e) => setNewFamily({ ...newFamily, isPublic: e.target.checked })}
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Öffentlich sichtbar machen
              </label>
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Familie erstellen
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Families Grid */}
      {families.length === 0 ? (
        <div className="text-center py-16">
          <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Noch keine Familien
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Erstelle deine erste Familie, um mit dem Stammbaum zu beginnen.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Erste Familie erstellen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((family) => (
            <div key={family.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {family.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    von {family.creator.firstName} {family.creator.lastName}
                  </p>
                </div>
                {family.isPublic && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Öffentlich
                  </span>
                )}
              </div>
              
              {family.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {family.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <UserGroupIcon className="h-4 w-4" />
                  <span>{family._count.persons} Personen</span>
                </div>
                <button 
                  onClick={() => navigate(`/family-tree/${family.id}`)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>Öffnen</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};