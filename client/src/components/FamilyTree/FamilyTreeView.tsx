import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlusIcon, UserPlusIcon, LinkIcon } from '@heroicons/react/24/outline';
import { FamilyTreeVisualization } from './FamilyTreeVisualization.tsx';
import { PersonForm } from './PersonForm.tsx';
import { RelationshipForm } from './RelationshipForm.tsx';
import { api } from '../../services/api.ts';
import toast from 'react-hot-toast';

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  birthName?: string;
  birthYear?: number;
  deathYear?: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  photo?: string;
}

interface Family {
  id: string;
  name: string;
  description?: string;
  persons: Person[];
}

export const FamilyTreeView: React.FC = () => {
  const { familyId } = useParams<{ familyId: string }>();
  const [family, setFamily] = useState<Family | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [showRelationshipForm, setShowRelationshipForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (familyId) {
      loadFamily();
    }
  }, [familyId]);

  const loadFamily = async () => {
    try {
      const response = await api.get(`/families/${familyId}`);
      setFamily(response.data);
    } catch (error) {
      toast.error('Fehler beim Laden der Familie');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleAddPerson = () => {
    setEditingPerson(null);
    setShowPersonForm(true);
  };

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    setShowPersonForm(true);
  };

  const handlePersonSave = (person: Person) => {
    loadFamily(); // Reload family data
  };

  const handleAddRelationship = () => {
    if (!selectedPerson) {
      toast.error('Bitte wähle zuerst eine Person aus');
      return;
    }
    setShowRelationshipForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!family) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Familie nicht gefunden
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Die angeforderte Familie existiert nicht oder du hast keinen Zugriff darauf.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {family.name}
          </h1>
          {family.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {family.description}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {family.persons.length} Personen
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleAddPerson}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlusIcon className="h-5 w-5" />
            <span>Person hinzufügen</span>
          </button>
          <button
            onClick={handleAddRelationship}
            className="btn-secondary flex items-center space-x-2"
            disabled={!selectedPerson}
          >
            <LinkIcon className="h-5 w-5" />
            <span>Beziehung hinzufügen</span>
          </button>
        </div>
      </div>

      {/* Selected Person Info */}
      {selectedPerson && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Ausgewählt: {selectedPerson.firstName} {selectedPerson.lastName}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {selectedPerson.birthYear && `Geboren ${selectedPerson.birthYear}`}
                {selectedPerson.deathYear && ` - Gestorben ${selectedPerson.deathYear}`}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditPerson(selectedPerson)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Bearbeiten
              </button>
              <button
                onClick={() => setSelectedPerson(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Abwählen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Family Tree Visualization */}
      <div className="mb-8">
        <FamilyTreeVisualization
          familyId={familyId!}
          onPersonSelect={handlePersonSelect}
        />
      </div>

      {/* Color Legend */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Legende
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded border-2 border-blue-300"></div>
            <span className="text-gray-700 dark:text-gray-300">Männer</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-pink-500 rounded border-2 border-pink-300"></div>
            <span className="text-gray-700 dark:text-gray-300">Frauen</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-500 rounded border-2 border-gray-400 opacity-75"></div>
            <span className="text-gray-700 dark:text-gray-300">Verstorbene</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPersonForm && (
        <PersonForm
          person={editingPerson}
          familyId={familyId!}
          onClose={() => setShowPersonForm(false)}
          onSave={handlePersonSave}
        />
      )}

      {showRelationshipForm && selectedPerson && (
        <RelationshipForm
          person={selectedPerson}
          familyPersons={family.persons}
          onClose={() => setShowRelationshipForm(false)}
          onSave={() => {
            setShowRelationshipForm(false);
            loadFamily();
          }}
        />
      )}
    </div>
  );
};