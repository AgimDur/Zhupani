import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  UsersIcon, 
  DocumentTextIcon,
  HeartIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';

interface UserStats {
  familiesCreated: number;
  personsAdded: number;
  postsCreated: number;
  relationshipsCreated: number;
  joinDate: string;
}

export const UserStats: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    familiesCreated: 0,
    personsAdded: 0,
    postsCreated: 0,
    relationshipsCreated: 0,
    joinDate: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const [familiesResponse, postsResponse] = await Promise.all([
        api.get('/families'),
        api.get('/posts')
      ]);

      const userFamilies = familiesResponse.data.filter((f: any) => f.createdBy === user?.id);
      const userPosts = postsResponse.data.filter((p: any) => p.authorId === user?.id);
      
      // Berechne Personen und Beziehungen aus den Familien
      let totalPersons = 0;
      let totalRelationships = 0;
      
      for (const family of userFamilies) {
        if (family.persons) {
          totalPersons += family.persons.length;
          family.persons.forEach((person: any) => {
            if (person.relationshipsFrom) {
              totalRelationships += person.relationshipsFrom.length;
            }
          });
        }
      }

      setStats({
        familiesCreated: userFamilies.length,
        personsAdded: totalPersons,
        postsCreated: userPosts.length,
        relationshipsCreated: totalRelationships,
        joinDate: user?.createdAt || new Date().toISOString()
      });
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerstatistiken:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `vor ${diffDays} Tagen`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `vor ${months} Monat${months > 1 ? 'en' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `vor ${years} Jahr${years > 1 ? 'en' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const statItems = [
    {
      name: 'Erstellte Familien',
      value: stats.familiesCreated,
      icon: UserGroupIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      name: 'Hinzugefügte Personen',
      value: stats.personsAdded,
      icon: UsersIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      name: 'Verfasste Beiträge',
      value: stats.postsCreated,
      icon: DocumentTextIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      name: 'Erstellte Beziehungen',
      value: stats.relationshipsCreated,
      icon: HeartIcon,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      name: 'Mitglied seit',
      value: formatJoinDate(stats.joinDate),
      icon: CalendarIcon,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      isText: true
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Deine Aktivitäten
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statItems.map((item) => (
          <div key={item.name} className={`p-6 rounded-lg ${item.bgColor}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.name}
                </p>
                <p className={`text-2xl font-bold ${item.color}`}>
                  {item.isText ? item.value : item.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};