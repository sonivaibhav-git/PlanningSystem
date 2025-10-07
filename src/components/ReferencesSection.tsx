import { useState } from 'react';
import {
  Plus,
  Archive,
  Trash2,
  RotateCcw,
  ExternalLink,
  Book,
  Video,
  FileText,
  GraduationCap,
  Folder,
} from 'lucide-react';
import { Reference } from '../types';

interface ReferencesSectionProps {
  references: Reference[];
  onAdd: (reference: Omit<Reference, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Reference>) => void;
  onDelete: (id: string) => void;
  showArchived: boolean;
}

const typeIcons = {
  book: Book,
  video: Video,
  article: FileText,
  course: GraduationCap,
  other: Folder,
};

const typeLabels = {
  book: 'Book',
  video: 'Video',
  article: 'Article',
  course: 'Course',
  other: 'Other',
};

export function ReferencesSection({
  references,
  onAdd,
  onUpdate,
  onDelete,
  showArchived,
}: ReferencesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<Reference['type']>('other');
  const [newUrl, setNewUrl] = useState('');

  const filteredReferences = references.filter((r) =>
    showArchived ? r.archived : !r.archived
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAdd({
        title: newTitle,
        description: newDescription,
        type: newType,
        url: newUrl,
        archived: false,
      });
      setNewTitle('');
      setNewDescription('');
      setNewType('other');
      setNewUrl('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">References</h2>
          <p className="text-sm text-gray-500 mt-1">
            External knowledge like books, videos, articles, and courses
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
            placeholder="Reference title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as Reference['type'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="other">Other</option>
            <option value="book">Book</option>
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="course">Course</option>
          </select>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
              Add Reference
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewTitle('');
                setNewDescription('');
                setNewType('other');
                setNewUrl('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {filteredReferences.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-500">
              {showArchived
                ? 'No archived references'
                : 'No references yet. Add your first reference to track external knowledge.'}
            </p>
          </div>
        ) : (
          filteredReferences.map((reference) => {
            const Icon = typeIcons[reference.type];
            return (
              <div
                key={reference.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 flex-1">
                    <div className="p-2 bg-gray-100 rounded-lg h-fit">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {reference.title}
                        </h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          {typeLabels[reference.type]}
                        </span>
                      </div>
                      {reference.description && (
                        <p className="text-gray-600 mt-2">
                          {reference.description}
                        </p>
                      )}
                      {reference.url && (
                        <a
                          href={reference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open link
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        onUpdate(reference.id, {
                          archived: !reference.archived,
                        })
                      }
                      className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                      title={reference.archived ? 'Unarchive' : 'Archive'}
                    >
                      {reference.archived ? (
                        <RotateCcw className="w-5 h-5" />
                      ) : (
                        <Archive className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(reference.id)}
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
