'use client';
import React, { useRef } from 'react';
import { useProjectStore } from '@/store/projectStore';

export default function Toolbar() {
  const { newProject, saveProject, exportProject, loadProject, project, setActiveTab, activeTab } = useProjectStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleNew = () => {
    const name = prompt('Project name:', 'New Flare Project');
    if (!name) return;
    const location = prompt('Location:', 'Indonesia') || '';
    const client = prompt('Client:', '') || '';
    newProject(name, location, client);
    setActiveTab('input');
  };

  const handleOpen = () => fileRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      loadProject(text);
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    saveProject();
    const data = exportProject();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || 'flare-project'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    const data = exportProject();
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || 'flare-project'}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'input', label: '📊 Input Data', tooltip: 'Enter gas composition, flare parameters, atmospheric conditions' },
    { id: 'results', label: '📋 Results', tooltip: 'View calculation results, safe radius summary' },
    { id: 'visualization', label: '🗺️ Visualization', tooltip: '2D contour maps, elevation views' },
    { id: 'comparison', label: '⚖️ Compare', tooltip: 'Compare scenarios side-by-side' },
    { id: 'report', label: '📄 Report', tooltip: 'Generate PDF/CSV reports' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button onClick={handleNew} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" title="New Project">📄 New</button>
          <button onClick={handleOpen} className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Open Project">📂 Open</button>
          <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Save Project">💾 Save</button>
          <button onClick={handleExport} className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Export Project">📤 Export</button>
          <input type="file" ref={fileRef} className="hidden" accept=".json" onChange={handleFile} />
        </div>
        <div className="flex items-center gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              title={t.tooltip}
              className={`px-3 py-1.5 text-sm rounded ${activeTab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
