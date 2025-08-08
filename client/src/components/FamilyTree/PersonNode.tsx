import React from 'react';
import { Handle, Position } from 'reactflow';
import { UserIcon, CalendarIcon } from '@heroicons/react/24/outline';

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

interface PersonNodeProps {
  data: {
    person: Person;
    onSelect?: (person: Person) => void;
  };
}

export const PersonNode: React.FC<PersonNodeProps> = ({ data }) => {
  const { person, onSelect } = data;

  const getNodeStyle = () => {
    let baseClasses = 'family-tree-node min-w-[200px] max-w-[200px]';
    
    if (person.deathYear) {
      baseClasses += ' deceased';
    } else if (person.gender === 'MALE') {
      baseClasses += ' male';
    } else if (person.gender === 'FEMALE') {
      baseClasses += ' female';
    }

    return baseClasses;
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(person);
    }
  };

  return (
    <div className={getNodeStyle()} onClick={handleClick}>
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {person.photo ? (
            <img
              src={person.photo}
              alt={`${person.firstName} ${person.lastName}`}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 dark:text-white truncate">
            {person.firstName} {person.lastName}
          </div>
          
          {person.birthName && person.birthName !== person.lastName && (
            <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
              geb. {person.birthName}
            </div>
          )}
          
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <CalendarIcon className="w-3 h-3" />
            <span>
              {person.birthYear || '?'}
              {person.deathYear && ` - ${person.deathYear}`}
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};