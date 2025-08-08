export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  FAMILY_MEMBER = 'FAMILY_MEMBER',
  VISITOR = 'VISITOR'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum RelationType {
  PARENT = 'PARENT',
  CHILD = 'CHILD',
  SPOUSE = 'SPOUSE',
  EX_SPOUSE = 'EX_SPOUSE',
  SIBLING = 'SIBLING'
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  birthName?: string;
  birthYear?: number;
  deathYear?: number;
  gender: Gender;
  photo?: string;
  familyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Family {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Relationship {
  id: string;
  personId: string;
  relatedPersonId: string;
  type: RelationType;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  images?: string[];
  visibility: PostVisibility;
  authorId: string;
  familyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  FAMILY = 'FAMILY',
  ADMIN = 'ADMIN'
}