export interface CustomField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  customFields: CustomField[];
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Area {
  id: string;
  title: string;
  description: string;
  role?: string;
  status: 'active' | 'inactive';
  goals: string[];
  customFields: CustomField[];
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reference {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'video' | 'article' | 'course' | 'podcast' | 'other';
  url: string;
  author?: string;
  rating?: number;
  dateAccessed?: string;
  tags: string[];
  customFields: CustomField[];
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  projectId: string | null;
  groupId?: string | null;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  estimatedTime?: string;
  tags: string[];
  customFields: CustomField[];
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskGroup {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export type SectionType = 'projects' | 'areas' | 'references' | 'tasks';
