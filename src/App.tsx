import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProjectsSection } from './components/ProjectsSection';
import { AreasSection } from './components/AreasSection';
import { ReferencesSection } from './components/ReferencesSection';
import { TasksSection } from './components/TasksSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Project, Area, Reference, Task, TaskGroup, SectionType } from './types';

function App() {
  const [activeSection, setActiveSection] = useState<SectionType>('projects');
  const [showArchived, setShowArchived] = useState(false);

  const [projects, setProjects] = useLocalStorage<Project[]>('part-projects', []);
  const [areas, setAreas] = useLocalStorage<Area[]>('part-areas', []);
  const [references, setReferences] = useLocalStorage<Reference[]>('part-references', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('part-tasks', []);
  const [taskGroups, setTaskGroups] = useLocalStorage<TaskGroup[]>('part-task-groups', []);

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setTasks(tasks.map(t => t.projectId === id ? { ...t, projectId: null } : t));
  };

  const addArea = (area: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newArea: Area = {
      ...area,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAreas([...areas, newArea]);
  };

  const updateArea = (id: string, updates: Partial<Area>) => {
    setAreas(areas.map(a =>
      a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
    ));
  };

  const deleteArea = (id: string) => {
    setAreas(areas.filter(a => a.id !== id));
  };

  const addReference = (reference: Omit<Reference, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReference: Reference = {
      ...reference,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setReferences([...references, newReference]);
  };

  const updateReference = (id: string, updates: Partial<Reference>) => {
    setReferences(references.map(r =>
      r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
    ));
  };

  const deleteReference = (id: string) => {
    setReferences(references.filter(r => r.id !== id));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTaskGroup = (group: Omit<TaskGroup, 'id' | 'createdAt'>) => {
    const newGroup: TaskGroup = {
      ...group,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTaskGroups([...taskGroups, newGroup]);
  };

  const updateTaskGroup = (id: string, updates: Partial<TaskGroup>) => {
    setTaskGroups(taskGroups.map(g =>
      g.id === id ? { ...g, ...updates } : g
    ));
  };

  const deleteTaskGroup = (id: string) => {
    setTaskGroups(taskGroups.filter(g => g.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived(!showArchived)}
      />
      <main className="flex-1 p-4 md:p-8 lg:ml-0 w-full pb-24 lg:pb-8">
        <div className="max-w-5xl mx-auto w-full">
          {activeSection === 'projects' && (
            <ProjectsSection
              projects={projects}
              onAdd={addProject}
              onUpdate={updateProject}
              onDelete={deleteProject}
              showArchived={showArchived}
            />
          )}
          {activeSection === 'areas' && (
            <AreasSection
              areas={areas}
              onAdd={addArea}
              onUpdate={updateArea}
              onDelete={deleteArea}
              showArchived={showArchived}
            />
          )}
          {activeSection === 'references' && (
            <ReferencesSection
              references={references}
              onAdd={addReference}
              onUpdate={updateReference}
              onDelete={deleteReference}
              showArchived={showArchived}
            />
          )}
          {activeSection === 'tasks' && (
            <TasksSection
              tasks={tasks}
              projects={projects}
              taskGroups={taskGroups}
              onAdd={addTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onAddGroup={addTaskGroup}
              onUpdateGroup={updateTaskGroup}
              onDeleteGroup={deleteTaskGroup}
              showArchived={showArchived}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
