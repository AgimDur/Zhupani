import React, { useState } from 'react';
import { XMarkIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api.ts';
import toast from 'react-hot-toast';

interface PostFormProps {
  onClose: () => void;
  onSave: () => void;
  families: Array<{ id: string; name: string }>;
}

export const PostForm: React.FC<PostFormProps> = ({ onClose, onSave, families }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    visibility: 'FAMILY',
    familyId: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (imageInput.trim() && !images.includes(imageInput.trim())) {
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Titel und Inhalt sind erforderlich');
      return;
    }

    setLoading(true);

    try {
      await api.post('/posts', {
        ...formData,
        images,
      });

      toast.success('Beitrag erfolgreich erstellt!');
      onSave();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Fehler beim Erstellen des Beitrags');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Neuen Beitrag erstellen
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titel *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Gib deinem Beitrag einen Titel..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Inhalt *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="input-field"
              placeholder="Teile deine Gedanken, Erinnerungen oder Neuigkeiten..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sichtbarkeit
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="input-field"
              >
                <option value="PUBLIC">Öffentlich</option>
                <option value="FAMILY">Nur Familie</option>
                <option value="ADMIN">Nur Admins</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Familie (optional)
              </label>
              <select
                name="familyId"
                value={formData.familyId}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">-- Keine Familie --</option>
                {families.map(family => (
                  <option key={family.id} value={family.id}>
                    {family.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bilder hinzufügen
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="input-field flex-1"
                placeholder="Bild-URL eingeben..."
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="btn-secondary flex items-center space-x-1"
              >
                <PhotoIcon className="h-4 w-4" />
                <span>Hinzufügen</span>
              </button>
            </div>
            
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Bild ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM5Ljc5IDEzLjc5IDkuNzkgMTAuMjEgMTIgOEMxNC4yMSAxMC4yMSAxNC4yMSAxMy43OSAxMiAxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Wird veröffentlicht...' : 'Beitrag veröffentlichen'}
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