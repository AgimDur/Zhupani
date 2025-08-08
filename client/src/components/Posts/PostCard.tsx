import React, { useState } from 'react';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ShareIcon,
  EyeIcon,
  LockClosedIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

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

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  const [liked, setLiked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) {
      onLike(post.id);
    }
  };

  const getVisibilityIcon = () => {
    switch (post.visibility) {
      case 'PUBLIC':
        return <EyeIcon className="h-4 w-4 text-green-500" />;
      case 'FAMILY':
        return <UserGroupIcon className="h-4 w-4 text-blue-500" />;
      case 'ADMIN':
        return <LockClosedIcon className="h-4 w-4 text-red-500" />;
    }
  };

  const getVisibilityText = () => {
    switch (post.visibility) {
      case 'PUBLIC':
        return 'Öffentlich';
      case 'FAMILY':
        return 'Familie';
      case 'ADMIN':
        return 'Admin';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 300) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {post.author.firstName[0]}{post.author.lastName[0]}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {post.author.firstName} {post.author.lastName}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="h-3 w-3" />
              <span>{formatDate(post.createdAt)}</span>
              {post.family && (
                <>
                  <span>•</span>
                  <span>{post.family.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-xs">
          {getVisibilityIcon()}
          <span className="text-gray-500 dark:text-gray-400">
            {getVisibilityText()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {post.title}
        </h2>
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {showFullContent ? post.content : truncateContent(post.content)}
          {post.content.length > 300 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-blue-600 hover:text-blue-700 ml-2 text-sm font-medium"
            >
              {showFullContent ? 'Weniger anzeigen' : 'Mehr anzeigen'}
            </button>
          )}
        </div>
      </div>

      {/* Images */}
      {post.images.length > 0 && (
        <div className="mb-4">
          {post.images.length === 1 ? (
            <img
              src={post.images[0]}
              alt="Beitragsbild"
              className="w-full max-h-96 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {post.images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Beitragsbild ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {index === 3 && post.images.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        +{post.images.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              liked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
            }`}
          >
            {liked ? (
              <HeartSolidIcon className="h-5 w-5" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
            <span className="text-sm">Gefällt mir</span>
          </button>
          
          <button
            onClick={() => onComment && onComment(post.id)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span className="text-sm">
              {post._count.comments > 0 ? `${post._count.comments} Kommentare` : 'Kommentieren'}
            </span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors">
            <ShareIcon className="h-5 w-5" />
            <span className="text-sm">Teilen</span>
          </button>
        </div>
      </div>
    </div>
  );
};