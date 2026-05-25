'use client';
import React from 'react';
import { useProjectStore } from '@/store/projectStore';

export default function Sidebar() {
  const { project, sidebarOpen, toggleSidebar, activeScenarioId, setActiveScenario, addScenario, removeScenario, darkMode, toggleDarkMode, units, setUnits } = useProjectStore();

  if (!sidebarOpen) {
    return (
      <button onClick={toggleSidebar} className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-blue-600 text-white px-1 py-4 rounded-r">
        ▶
      </button>
    );
  }

  const scenarioTypes = [
    { value: 'normal', label: '⚙️ Normal' },
    { value: 'emergency_blowdown', label: '🚨 Emergency Blowdown' },
    { value: 'flameout', label: '🔥 Flameout' },
    { value: 'planned_shutdown', label: '⛔ Planned Shutdown' },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full overflow-y-auto">
      <div className="p-3 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-sm text-gray-800">Project Tree</span>
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">◀</button>
        </div>
        {project && (
          <div className="text-xs text-gray-600">
            <div className="font-semibold text-gray-800">{project.name}</div>
            <div>{project.location}</div>
            <div>{project.client}</div>
          </div>
        )}
      </div>

      <div className="p-3 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-xs text-gray-800">Scenarios</span>
          <select
            className="text-xs border rounded px-1 py-0.5 bg-white text-gray-800 border-gray-300"
            onChange={(e) => addScenario(e.target.value)}
            value=""
          >
            <option value="">+ Add...</option>
            {scenarioTypes.map(st => <option key={st.value} value={st.value}>{st.label}</option>)}
          </select>
        </div>
        {project?.scenarios.map(sc => (
          <div
            key={sc.id}
            className={`flex items-center justify-between px-2 py-1.5 mb-1 rounded text-xs cursor-pointer ${sc.id === activeScenarioId ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveScenario(sc.id)}
          >
            <span className="truncate flex-1">{sc.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); if (confirm('Remove scenario?')) removeScenario(sc.id); }}
              className="text-red-400 hover:text-red-600 ml-1 text-xs"
            >✕</button>
          </div>
        ))}
      </div>

      <div className="p-3 border-b border-gray-200">
        <span className="font-semibold text-xs text-gray-800 block mb-2">Receptors</span>
        {project?.receptorPoints.map(rp => (
          <div key={rp.id} className="text-xs py-1 text-gray-600">
            {rp.name} ({rp.x}m, {rp.y}m)
          </div>
        ))}
        {(!project?.receptorPoints.length) && <div className="text-xs text-gray-500">No receptors added</div>}
      </div>

      <div className="mt-auto p-3 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Theme</span>
          <button onClick={toggleDarkMode} className="text-lg">🌙</button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Units</span>
          <select
            value={units}
            onChange={e => setUnits(e.target.value as 'SI' | 'Imperial')}
            className="text-xs border rounded px-1 py-0.5 bg-white text-gray-800 border-gray-300"
          >
            <option value="SI">SI (Metric)</option>
            <option value="Imperial">Imperial</option>
          </select>
        </div>
      </div>
    </div>
  );
}
