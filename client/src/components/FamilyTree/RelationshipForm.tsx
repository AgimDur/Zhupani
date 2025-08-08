import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

interface RelationshipFormProps {
  person: Person;
  familyPersons: Person[];
  onClose: () => void;
  onSave: () => void;
}

const relationshipTypes = [
  { value: 'PARENT', label: 'Elternteil', description: 'Diese Person ist Elternteil von...' },
  { value: 'CHILD', label: 'Kind', description: 'Diese Person ist Kind von...' },
  { value: 'SPOUSE', label: 'Ehepartner', description: 'Diese Person ist verheiratet mit...' },
  { value: 'EX_SPOUSE', label: 'Ex-Ehepartner', description: 'Diese Person war verheiratet mit...' },
  { value: 'SIBLING', label: 'Geschwister', description: 'Diese Person ist Geschwister von...' },
];

export const RelationshipForm: React.FC<RelationshipFormProps> = ({
  person,
  familyPersons,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    relatedPersonId: '',
    type: 'PARENT',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);

  // Filtere die aktuelle Person aus der Liste
  const availablePersons = familyPersons.filter(p => p.id !== person.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.relatedPersonId) {
      toast.error('Bitte wähle eine Person aus');
      return;
    }

    setLoading(true);

    try {
      await api.post(`/persons/${person.id}/relationships`, {
        relatedPersonId: formData.relatedPersonId,
        type: formData.type,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      });

      toast.success('Beziehung erfolgreich hinzugefügt!');
      onSave();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Fehler beim Erstellen der Beziehung');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectedRelationType = relationshipTypes.find(rt => rt.value === formData.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Beziehung hinzufügen
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{person.firstName} {person.lastName}</strong> wird mit einer anderen Person verknüpft.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Beziehungstyp *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input-field"
              required
            >
              {relationshipTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {selectedRelationType && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {selectedRelationType.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Person auswählen *
            </label>
            <select
              name="relatedPersonId"
              value={formData.relatedPersonId}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">-- Person auswählen --</option>
              {availablePersons.map(p => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </div>

          {(formData.type === 'SPOUSE' || formData.type === 'EX_SPOUSE') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Beginn der Beziehung
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {formData.type === 'EX_SPOUSE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ende der Beziehung
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Wird gespeichert...' : 'Beziehung hinzufügen'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};