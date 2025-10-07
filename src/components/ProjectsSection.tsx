import { useState } from 'react';
import { Plus, Archive, Trash2, RotateCcw, X, Calendar, AlertCircle } from 'lucide-react';
import { Project, CustomField } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
  onAdd: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
  showArchived: boolean;
}

export function ProjectsSection({ projects, onAdd, onUpdate, onDelete, showArchived }: ProjectsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<'planning' | 'active' | 'on-hold' | 'completed'>('active');
  const [newDeadline, setNewDeadline] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const filteredProjects = projects.filter(p => showArchived ? p.archived : !p.archived);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAdd({
        title: newTitle,
        description: newDescription,
        status: newStatus,
        deadline: newDeadline || undefined,
        priority: newPriority,
        tags: newTags,
        customFields: customFields,
        archived: false,
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewStatus('active');
    setNewDeadline('');
    setNewPriority('medium');
    setNewTags([]);
    setNewTagInput('');
    setCustomFields([]);
    setIsAdding(false);
  };

  const addTag = () => {
    if (newTagInput.trim() && !newTags.includes(newTagInput.trim())) {
      setNewTags([...newTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setNewTags(newTags.filter(t => t !== tag));
  };

  const addCustomField = () => {
    setCustomFields([...customFields, {
      id: crypto.randomUUID(),
      label: '',
      value: '',
      type: 'text'
    }]);
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(customFields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'on-hold': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'planning': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-500 mt-1">Planned efforts with multiple steps</p>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">New Project</h3>
              <button type="button" onClick={resetForm} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Project title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What is this project about?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {newTags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:bg-gray-300 rounded-full">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Add
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Custom Fields</label>
                <button type="button" onClick={addCustomField} className="text-sm text-gray-900 hover:underline">
                  + Add Field
                </button>
              </div>
              {customFields.map(field => (
                <div key={field.id} className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                    placeholder="Field name"
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                    placeholder="Value"
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button type="button" onClick={() => removeCustomField(field.id)} className="text-red-600 hover:bg-red-50 rounded">
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
              >
                Add Project
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-500">
              {showArchived ? 'No archived projects' : 'No projects yet'}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-gray-600 mt-2">{project.description}</p>
                  )}
                  {project.deadline && (
                    <div className={`flex items-center gap-1 mt-2 text-sm ${isOverdue(project.deadline) ? 'text-red-600' : 'text-gray-600'}`}>
                      {isOverdue(project.deadline) && <AlertCircle className="w-4 h-4" />}
                      <Calendar className="w-4 h-4" />
                      <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdate(project.id, { archived: !project.archived })}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title={project.archived ? 'Unarchive' : 'Archive'}
                  >
                    {project.archived ? <RotateCcw className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => onDelete(project.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!showArchived && (
        <button
          onClick={() => setIsAdding(true)}
          className="floating-button bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-center"
          title="Add New Project"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
