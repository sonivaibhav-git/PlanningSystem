import { FolderKanban, Heart, BookOpen, CheckSquare, Archive } from 'lucide-react';
import { SectionType } from '../types';

interface SidebarProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  showArchived: boolean;
  onToggleArchived: () => void;
}

export function Sidebar({ activeSection, onSectionChange, showArchived, onToggleArchived }: SidebarProps) {
  const sections = [
    { id: 'projects' as SectionType, name: 'Projects', icon: FolderKanban },
    { id: 'areas' as SectionType, name: 'Areas', icon: Heart },
    { id: 'references' as SectionType, name: 'References', icon: BookOpen },
    { id: 'tasks' as SectionType, name: 'Tasks', icon: CheckSquare },
  ];

  return (
    <>
      <div className="hidden lg:flex lg:w-64 h-full bg-white border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">PART System</h1>
          <p className="text-sm text-gray-500 mt-1">Knowledge Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{section.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onToggleArchived}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              showArchived
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Archive className="w-5 h-5" />
            <span className="font-medium">
              {showArchived ? 'Hide Archive' : 'Show Archive'}
            </span>
          </button>
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around px-2 py-3">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[70px] ${
                  isActive
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{section.name}</span>
              </button>
            );
          })}
          <button
            onClick={onToggleArchived}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[70px] ${
              showArchived
                ? 'text-gray-900'
                : 'text-gray-500'
            }`}
          >
            <Archive className="w-6 h-6" />
            <span className="text-xs font-medium">Archive</span>
          </button>
        </div>
      </nav>
    </>
  );
}
