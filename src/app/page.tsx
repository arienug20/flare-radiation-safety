'use client';
import React, { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import Toolbar from '@/components/Toolbar';
import Sidebar from '@/components/Sidebar';
import InputDataPanel from '@/components/InputDataPanel';
import ResultsPanel from '@/components/ResultsPanel';
import VisualizationPanel from '@/components/VisualizationPanel';
import ComparisonPanel from '@/components/ComparisonPanel';
import ReportPanel from '@/components/ReportPanel';

export default function Home() {
  const { activeTab, project, setProject } = useProjectStore();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('flare-recent-projects');
      if (saved) {
        const recents = JSON.parse(saved);
        if (recents.length > 0) {
          const lastProject = localStorage.getItem('flare-project-' + recents[0].id);
          if (lastProject) {
            setProject(JSON.parse(lastProject));
          }
        }
      }
    } catch {}
  }, [setProject]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (project) {
        try {
          localStorage.setItem('flare-project-' + project.id, JSON.stringify(project));
        } catch {}
      }
    }, 120000);
    return () => clearInterval(interval);
  }, [project]);

  const renderContent = () => {
    switch (activeTab) {
      case 'input': return <InputDataPanel />;
      case 'results': return <ResultsPanel />;
      case 'visualization': return <VisualizationPanel />;
      case 'comparison': return <ComparisonPanel />;
      case 'report': return <ReportPanel />;
      default: return <InputDataPanel />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
