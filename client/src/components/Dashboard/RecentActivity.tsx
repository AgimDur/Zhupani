import React, { useState, useEffect } from 'react';
import { 
  ClockIcon,
  UserPlusIcon,
  DocumentTextIcon,
  UserGroupIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';

interface Activity {
  id: string;
  type: 'family_created' | 'person_added' | 'post_created' | 'relationship_added';
  title: string;
  description: string;
  timestamp: string;
  familyId?: string;
}

export const RecentActivity: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      const [familiesResponse, postsResponse] = await Promise.all([
        api.get('/families'),
        api.get('/posts')
      ]);

      const recentActivities: Activity[] = [];

      // Füge kürzlich erstellte Familien hinzu
      familiesResponse.data
        .filter((f: any) => f.createdBy === user?.id)
        .slice(0, 3)
        .forEach((family: any) => {
          recentActivities.push({
            id: `family-${family.id}`,
            type: 'family_created',
            title: 'Familie erstellt',
            description: `Du hast die Familie "${family.name}" erstellt`,
            timestamp: family.createdAt,
            familyId: family.id
          });
        });

      // Füge kürzlich erstellte Beiträge hinzu
      postsResponse.data
        .filter((p: any) => p.authorId === user?.id)
        .slice(0, 3)
        .forEach((post: any) => {
          recentActivities.push({
            id: `post-${post.id}`,
            type: 'post_created',
            title: 'Beitrag veröffentlicht',
            description: `"${post.title}"`,
            timestamp: post.createdAt
          });
        });

      // Sortiere nach Datum (neueste zuerst)
      recentActivities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(recentActivities.slice(0, 5));
    } catch (error) {
      console.error('Fehler beim Laden der Aktivitäten:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'family_created':
        return UserGroupIcon;
      case 'person_added':
        return UserPlusIcon;
      case 'post_created':
        return DocumentTextIcon;
      case 'relationship_added':
        return LinkIcon;
      default:
        return ClockIcon;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'family_created':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'person_added':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'post_created':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'relationship_added':
        return 'text-pink-600 bg-pink-100 dark:bg-pink-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Heute';
    } else if (diffDays === 2) {
      return 'Gestern';
    } else if (diffDays < 7) {
      return `vor ${diffDays - 1} Tagen`;
    } else {
      return date.toLocaleDateString('de-DE');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Letzte Aktivitäten
      </h2>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <ClockIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Noch keine Aktivitäten vorhanden</p>
          <p className="text-sm">Erstelle deine erste Familie oder schreibe einen Beitrag!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClasses = getActivityColor(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClasses}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};