import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  type: 'person' | 'family' | 'post';
  id: string;
  title: string;
  subtitle: string;
  familyId?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length >= 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const [familiesResponse, postsResponse] = await Promise.all([
        api.get('/families'),
        api.get('/posts')
      ]);

      const searchResults: SearchResult[] = [];

      // Durchsuche Familien und Personen
      familiesResponse.data.forEach((family: any) => {
        if (family.name.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({
            type: 'family',
            id: family.id,
            title: family.name,
            subtitle: `${family._count?.persons || 0} Personen`,
          });
        }

        // Durchsuche Personen in der Familie
        if (family.persons) {
          family.persons.forEach((person: any) => {
            const fullName = `${person.firstName} ${person.lastName}`;
            if (fullName.toLowerCase().includes(query.toLowerCase()) ||
                person.birthName?.toLowerCase().includes(query.toLowerCase())) {
              searchResults.push({
                type: 'person',
                id: person.id,
                title: fullName,
                subtitle: `${family.name} • ${person.birthYear || '?'} - ${person.deathYear || 'heute'}`,
                familyId: family.id,
              });
            }
          });
        }
      });

      // Durchsuche Beiträge
      postsResponse.data.forEach((post: any) => {
        if (post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({
            type: 'post',
            id: post.id,
            title: post.title,
            subtitle: `von ${post.author.firstName} ${post.author.lastName}`,
          });
        }
      });

      setResults(searchResults.slice(0, 10)); // Limitiere auf 10 Ergebnisse
    } catch (error) {
      console.error('Suchfehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'family':
        navigate(`/family-tree/${result.id}`);
        break;
      case 'person':
        if (result.familyId) {
          navigate(`/family-tree/${result.familyId}`);
        }
        break;
      case 'post':
        navigate('/posts');
        break;
    }
    onClose();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'family':
        return '👨‍👩‍👧‍👦';
      case 'person':
        return '👤';
      case 'post':
        return '📝';
      default:
        return '🔍';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Suche nach Personen, Familien oder Beiträgen..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-3"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Keine Ergebnisse für "{query}" gefunden
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  <span className="text-2xl">{getResultIcon(result.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {result.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {result.subtitle}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {result.type === 'family' ? 'Familie' : 
                     result.type === 'person' ? 'Person' : 'Beitrag'}
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length < 2 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Gib mindestens 2 Zeichen ein, um zu suchen
            </div>
          )}
        </div>
      </div>
    </div>
  );
};