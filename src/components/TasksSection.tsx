import { useState } from 'react';
import { Plus, Archive, Trash2, RotateCcw, Check, Square } from 'lucide-react';
import { Task, Project } from '../types';

interface TasksSectionProps {
  tasks: Task[];
  projects: Project[];
  onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  showArchived: boolean;
}

export function TasksSection({
  tasks,
  projects,
  onAdd,
  onUpdate,
  onDelete,
  showArchived,
}: TasksSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newProjectId, setNewProjectId] = useState<string>('');

  const filteredTasks = tasks.filter((t) =>
    showArchived ? t.archived : !t.archived
  );
  const activeProjects = projects.filter((p) => !p.archived);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAdd({
        title: newTitle,
        description: newDescription,
        completed: false,
        projectId: newProjectId || null,
        archived: false,
      });
      setNewTitle('');
      setNewDescription('');
      setNewProjectId('');
      setIsAdding(false);
    }
  };

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return null;
    const project = projects.find((p) => p.id === projectId);
    return project?.title;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-sm text-gray-500 mt-1">
            Standalone tasks to complete or those linked to larger projects
          </p>
        </div>
        {!showArchived && (
          <button
            onClick={() => setIsAdding(true)}
            className="floating-button bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
        >
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <select
            value={newProjectId}
            onChange={(e) => setNewProjectId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Standalone task (not linked to project)</option>
            {activeProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewTitle('');
                setNewDescription('');
                setNewProjectId('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-500">
              {showArchived
                ? 'No archived tasks'
                : 'No tasks yet. Create your first task to get started.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const projectName = getProjectName(task.projectId);
            return (
              <div
                key={task.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() =>
                      onUpdate(task.id, { completed: !task.completed })
                    }
                    className="mt-1 flex-shrink-0"
                  >
                    {task.completed ? (
                      <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold ${
                        task.completed
                          ? 'text-gray-400 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </h3>
                    {projectName && (
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded mt-1">
                        {projectName}
                      </span>
                    )}
                    {task.description && (
                      <p
                        className={`mt-2 ${
                          task.completed ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        onUpdate(task.id, { archived: !task.archived })
                      }
                      className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                      title={task.archived ? 'Unarchive' : 'Archive'}
                    >
                      {task.archived ? (
                        <RotateCcw className="w-5 h-5" />
                      ) : (
                        <Archive className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
