import React, { useState, useEffect } from 'react';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { PostCard } from '../components/Posts/PostCard.tsx';
import { PostForm } from '../components/Posts/PostForm.tsx';
import { api } from '../services/api.ts';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  images: string[];
  visibility: 'PUBLIC' | 'FAMILY' | 'ADMIN';
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
  };
  family?: {
    name: string;
  };
  _count: {
    comments: number;
  };
}

interface Family {
  id: string;
  name: string;
}

export const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsResponse, familiesResponse] = await Promise.all([
        api.get('/posts'),
        api.get('/families')
      ]);
      
      setPosts(postsResponse.data);
      setFamilies(familiesResponse.data);
    } catch (error) {
      toast.error('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const handlePostSave = () => {
    setShowPostForm(false);
    loadData();
  };

  const handleLike = (postId: string) => {
    // TODO: Implement like functionality
    console.log('Like post:', postId);
  };

  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
    console.log('Comment on post:', postId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Beiträge
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Teile Erinnerungen, Fotos und Neuigkeiten mit deiner Familie
          </p>
        </div>
        <button
          onClick={() => setShowPostForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Neuer Beitrag</span>
        </button>
      </div>

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Noch keine Beiträge
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sei der Erste, der einen Beitrag teilt!
          </p>
          <button
            onClick={() => setShowPostForm(true)}
            className="btn-primary"
          >
            Ersten Beitrag erstellen
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))}
        </div>
      )}

      {/* Post Form Modal */}
      {showPostForm && (
        <PostForm
          onClose={() => setShowPostForm(false)}
          onSave={handlePostSave}
          families={families}
        />
      )}
    </div>
  );
};