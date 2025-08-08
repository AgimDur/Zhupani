import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api.ts';
import toast from 'react-hot-toast';

interface Person {
  id?: string;
  firstName: string;
  lastName: string;
  birthName?: string;
  birthYear?: number;
  deathYear?: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  photo?: string;
}

interface PersonFormProps {
  person?: Person;
  familyId: string;
  onClose: () => void;
  onSave: (person: Person) => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({
  person,
  familyId,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Person>({
    firstName: person?.firstName || '',
    lastName: person?.lastName || '',
    birthName: person?.birthName || '',
    birthYear: person?.birthYear || undefined,
    deathYear: person?.deathYear || undefined,
    gender: person?.gender || 'MALE',
    photo: person?.photo || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Year') ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (person?.id) {
        // Person bearbeiten
        response = await api.put(`/persons/${person.id}`, formData);
      } else {
        // Neue Person erstellen
        response = await api.post('/persons', { ...formData, familyId });
      }

      onSave(response.data);
      toast.success(person?.id ? 'Person aktualisiert!' : 'Person hinzugefügt!');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {person?.id ? 'Person bearbeiten' : 'Neue Person hinzufügen'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vorname *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nachname *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Geburtsname
            </label>
            <input
              type="text"
              name="birthName"
              value={formData.birthName}
              onChange={handleChange}
              className="input-field"
              placeholder="Falls abweichend vom Nachnamen"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Geschlecht *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="MALE">Männlich</option>
              <option value="FEMALE">Weiblich</option>
              <option value="OTHER">Divers</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Geburtsjahr
              </label>
              <input
                type="number"
                name="birthYear"
                value={formData.birthYear || ''}
                onChange={handleChange}
                className="input-field"
                min="1800"
                max={new Date().getFullYear()}
                placeholder="z.B. 1990"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sterbejahr
              </label>
              <input
                type="number"
                name="deathYear"
                value={formData.deathYear || ''}
                onChange={handleChange}
                className="input-field"
                min="1800"
                max={new Date().getFullYear()}
                placeholder="Falls verstorben"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Foto URL
            </label>
            <input
              type="url"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Wird gespeichert...' : 'Speichern'}
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