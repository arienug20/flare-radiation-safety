'use client';
import { create } from 'zustand';
import { Project, Scenario, ReceptorPoint } from '@/types';
import { createDefaultScenario } from '@/lib/calculations';

interface ProjectStore {
  project: Project | null;
  recentProjects: { id: string; name: string; path: string; updatedAt: string }[];
  darkMode: boolean;
  sidebarOpen: boolean;
  activeTab: string;
  units: 'SI' | 'Imperial';
  activeScenarioId: string;
  setProject: (p: Project) => void;
  updateProject: (updates: Partial<Project>) => void;
  addScenario: (type: string) => void;
  updateScenario: (id: string, updates: Partial<Scenario>) => void;
  removeScenario: (id: string) => void;
  setActiveScenario: (id: string) => void;
  addReceptor: (r: ReceptorPoint) => void;
  removeReceptor: (id: string) => void;
  updateReceptor: (id: string, updates: Partial<ReceptorPoint>) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setUnits: (u: 'SI' | 'Imperial') => void;
  setActiveTab: (t: string) => void;
  newProject: (name: string, location: string, client: string) => void;
  saveProject: () => void;
  loadProject: (data: string) => void;
  exportProject: () => string;
}

const createNewProject = (name: string, location: string, client: string): Project => {
  const defaultScenario = createDefaultScenario('normal');
  const scenarioId = crypto.randomUUID();
  return {
    id: crypto.randomUUID(),
    name, location, client,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    units: 'SI',
    scenarios: [{
      ...defaultScenario,
      id: scenarioId,
      results: undefined,
    } as Scenario],
    receptorPoints: [],
    activeScenarioId: scenarioId,
  };
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: null,
  recentProjects: [],
  darkMode: false,
  sidebarOpen: true,
  activeTab: 'input',
  units: 'SI',
  activeScenarioId: '',

  setProject: (p) => set({ project: p }),
  updateProject: (updates) => set(s => s.project ? { project: { ...s.project, ...updates, updatedAt: new Date().toISOString() } } : s),
  addScenario: (type) => set(s => {
    if (!s.project) return s;
    const newScenario = { ...createDefaultScenario(type), id: crypto.randomUUID() } as Scenario;
    return {
      activeScenarioId: newScenario.id,
      project: {
        ...s.project,
        scenarios: [...s.project.scenarios, newScenario],
        activeScenarioId: newScenario.id,
        updatedAt: new Date().toISOString(),
      },
    };
  }),
  updateScenario: (id, updates) => set(s => {
    if (!s.project) return s;
    return {
      project: {
        ...s.project,
        scenarios: s.project.scenarios.map(sc => sc.id === id ? { ...sc, ...updates } : sc),
        updatedAt: new Date().toISOString(),
      },
    };
  }),
  removeScenario: (id) => set(s => {
    if (!s.project) return s;
    const scenarios = s.project.scenarios.filter(sc => sc.id !== id);
    return {
      project: {
        ...s.project,
        scenarios,
        activeScenarioId: s.project.activeScenarioId === id ? (scenarios[0]?.id || '') : s.project.activeScenarioId,
        updatedAt: new Date().toISOString(),
      },
    };
  }),
  setActiveScenario: (id) => set(s => s.project ? { project: { ...s.project, activeScenarioId: id }, activeScenarioId: id } : s),
  addReceptor: (r) => set(s => {
    if (!s.project) return s;
    return { project: { ...s.project, receptorPoints: [...s.project.receptorPoints, r], updatedAt: new Date().toISOString() } };
  }),
  removeReceptor: (id) => set(s => {
    if (!s.project) return s;
    return { project: { ...s.project, receptorPoints: s.project.receptorPoints.filter(r => r.id !== id), updatedAt: new Date().toISOString() } };
  }),
  updateReceptor: (id, updates) => set(s => {
    if (!s.project) return s;
    return { project: { ...s.project, receptorPoints: s.project.receptorPoints.map(r => r.id === id ? { ...r, ...updates } : r), updatedAt: new Date().toISOString() } };
  }),
  toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setUnits: (u) => set({ units: u }),
  setActiveTab: (t) => set({ activeTab: t }),
  newProject: (name, location, client) => {
    const p = createNewProject(name, location, client);
    set({ project: p, activeScenarioId: p.scenarios[0]?.id || '' });
  },
  saveProject: () => {
    const { project } = get();
    if (!project) return;
    try {
      localStorage.setItem('flare-project-' + project.id, JSON.stringify(project));
      const recents = get().recentProjects.filter(r => r.id !== project.id);
      recents.unshift({ id: project.id, name: project.name, path: 'local', updatedAt: project.updatedAt });
      set({ recentProjects: recents.slice(0, 10) });
      localStorage.setItem('flare-recent-projects', JSON.stringify(recents.slice(0, 10)));
    } catch {}
  },
  loadProject: (data) => {
    try {
      const project = JSON.parse(data) as Project;
      set({ project, activeScenarioId: project.scenarios[0]?.id || '' });
    } catch {}
  },
  exportProject: () => {
    const { project } = get();
    return project ? JSON.stringify(project, null, 2) : '';
  },
}));
