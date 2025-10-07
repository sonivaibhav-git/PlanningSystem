import { useState } from 'react';
import { Plus, Archive, Trash2, RotateCcw, X } from 'lucide-react';
import { Area, CustomField } from '../types';

interface AreasSectionProps {
  areas: Area[];
  onAdd: (area: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Area>) => void;
  onDelete: (id: string) => void;
  showArchived: boolean;
}

export function AreasSection({ areas, onAdd, onUpdate, onDelete, showArchived }: AreasSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newStatus, setNewStatus] = useState<'active' | 'inactive'>('active');
  const [newGoals, setNewGoals] = useState<string[]>([]);
  const [newGoalInput, setNewGoalInput] = useState('');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const filteredAreas = areas.filter(a => showArchived ? a.archived : !a.archived);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAdd({
        title: newTitle,
        description: newDescription,
        role: newRole || undefined,
        status: newStatus,
        goals: newGoals,
        customFields: customFields,
        archived: false,
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewRole('');
    setNewStatus('active');
    setNewGoals([]);
    setNewGoalInput('');
    setCustomFields([]);
    setIsAdding(false);
  };

  const addGoal = () => {
    if (newGoalInput.trim() && !newGoals.includes(newGoalInput.trim())) {
      setNewGoals([...newGoals, newGoalInput.trim()]);
      setNewGoalInput('');
    }
  };

  const removeGoal = (goal: string) => {
    setNewGoals(newGoals.filter(g => g !== goal));
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Areas</h2>
          <p className="text-sm text-gray-500 mt-1">Ongoing responsibilities</p>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">New Area</h3>
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
                placeholder="e.g., Health, Finance, Family"
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
                placeholder="What is this area about?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Role</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g., Father, Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Goals</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {newGoals.map(goal => (
                  <span key={goal} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center gap-1">
                    {goal}
                    <button type="button" onClick={() => removeGoal(goal)} className="hover:bg-gray-300 rounded-full">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGoalInput}
                  onChange={(e) => setNewGoalInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                  placeholder="Add goal..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button type="button" onClick={addGoal} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
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
                Add Area
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
        {filteredAreas.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-500">
              {showArchived ? 'No archived areas' : 'No areas yet'}
            </p>
          </div>
        ) : (
          filteredAreas.map((area) => (
            <div
              key={area.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">{area.title}</h3>
                    <span className="px-2 py-1 text-xs font-medium rounded border bg-green-100 text-green-700 border-green-200">
                      {area.status}
                    </span>
                  </div>
                  {area.role && (
                    <p className="text-sm text-gray-600 mt-1">Role: {area.role}</p>
                  )}
                  {area.description && (
                    <p className="text-gray-600 mt-2">{area.description}</p>
                  )}
                  {area.goals && area.goals.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {area.goals.map(goal => (
                        <span key={goal} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {goal}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdate(area.id, { archived: !area.archived })}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title={area.archived ? 'Unarchive' : 'Archive'}
                  >
                    {area.archived ? <RotateCcw className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => onDelete(area.id)}
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
          title="Add New Area"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
