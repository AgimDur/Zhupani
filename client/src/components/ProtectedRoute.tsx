import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'FAMILY_MEMBER' | 'VISITOR';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Zugriff verweigert
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Du hast nicht die erforderlichen Berechtigungen für diese Seite.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};