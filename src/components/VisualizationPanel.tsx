'use client';
import React, { useMemo, useRef, Suspense, useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import type { ScenarioResults } from '@/types';

interface PlotWrapperProps {
  data: any[];
  layout: any;
  config?: any;
}

function PlotLoader() {
  return <div className="text-center p-8 text-gray-500">Loading chart...</div>;
}

function PlotContent({ data, layout, config }: PlotWrapperProps) {
  const Plot = require('react-plotly.js').default;
  return <Plot data={data} layout={layout} config={config} />;
}

function ContourPlot({ results, type, title }: { results: ScenarioResults; type: 'radiation' | 'noise' | 'dispersion'; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { radiation, noise, dispersion } = results;

  const plotSpec = useMemo(() => {
    const maxR = Math.max(
      radiation.safeRadii.personnel_1_6 || 100,
      noise.safeRadii.residential_55 || 200,
      150
    ) * 1.5;

    const gridSize = 50;
    const x: number[] = [];
    const y: number[] = [];
    const z: number[][] = [];

    for (let i = 0; i < gridSize; i++) {
      const row: number[] = [];
      const py = -maxR + (2 * maxR * i) / (gridSize - 1);
      for (let j = 0; j < gridSize; j++) {
        const px = -maxR + (2 * maxR * j) / (gridSize - 1);
        const dist = Math.sqrt(px * px + py * py);

        let val = 0;
        if (type === 'radiation') {
          const R = Math.sqrt(dist * dist + radiation.flameLength * radiation.flameLength / 4);
          val = R > 0 ? (radiation.heatRelease * 0.2) / (4 * Math.PI * R * R) : 0;
        } else if (type === 'noise') {
          val = dist > 0 ? noise.sourceSPL - 20 * Math.log10(dist) - 11 - 0.005 * dist : noise.sourceSPL;
        } else if (dispersion) {
          const sigmaY = 0.08 * dist / Math.sqrt(1 + 0.0001 * dist);
          const sigmaZ = 0.06 * dist / Math.sqrt(1 + 0.0015 * dist);
          if (dist > 10 && sigmaY > 0 && sigmaZ > 0) {
            val = (1 / (Math.PI * sigmaY * sigmaZ * 5)) * Math.exp(-py * py / (2 * sigmaY * sigmaY)) * Math.exp(-30 * 30 / (2 * sigmaZ * sigmaZ)) * 1e6;
          }
        }
        row.push(val);
        if (i === 0) x.push(px);
      }
      y.push(py);
      z.push(row);
    }

    const contours = type === 'radiation'
      ? { show: true, levels: [1.58, 3.16, 4.73, 6.3, 9.46] }
      : type === 'noise'
      ? { show: true, levels: [55, 65, 70, 85] }
      : { show: true };

    const colorscale = type === 'radiation'
      ? [[0, '#00ff00'], [0.25, '#ffff00'], [0.5, '#ff9900'], [0.75, '#ff0000'], [1, '#990000']]
      : type === 'noise'
      ? [[0, '#0000ff'], [0.33, '#00ff00'], [0.66, '#ffff00'], [1, '#ff0000']]
      : [[0, '#ffffff'], [0.5, '#ffcc00'], [1, '#ff0000']];

    return {
      data: [{
        z, x, y,
        type: 'contour' as const,
        colorscale,
        contours,
        colorbar: { title: { text: type === 'radiation' ? 'kW/m²' : type === 'noise' ? 'dBA' : 'mg/m³' } },
        hovertemplate: 'X: %{x:.0f}m<br>Y: %{y:.0f}m<br>Value: %{z:.2f}<extra></extra>',
      }],
      layout: {
        title: { text: title, font: { size: 14, color: '#333' } },
        xaxis: { title: { text: 'Distance (m)', font: { color: '#333' } }, scaleanchor: 'y', tickfont: { color: '#333' } },
        yaxis: { title: { text: 'Distance (m)', font: { color: '#333' } }, tickfont: { color: '#333' } },
        paper_bgcolor: 'white',
        plot_bgcolor: '#f9f9f9',
        width: 500,
        height: 400,
        margin: { l: 60, r: 40, t: 40, b: 50 },
      },
      config: { responsive: true, displayModeBar: false },
    };
  }, [radiation, noise, dispersion, type, title]);

  return (
    <div ref={containerRef} className="bg-white rounded-lg p-2">
      <Suspense fallback={<PlotLoader />}>
        <PlotContent {...plotSpec} />
      </Suspense>
    </div>
  );
}

function ElevationView({ results }: { results: ScenarioResults }) {
  const { radiation } = results;
  const stackH = 30;
  const flameLen = radiation.flameLength;
  const tilt = radiation.flameTilt;

  const plotSpec = useMemo(() => {
    const tipX = flameLen * Math.sin(tilt * Math.PI / 180);
    const tipY = stackH + flameLen * Math.cos(tilt * Math.PI / 180);
    const coneDist = radiation.safeRadii.personnel_1_6 * 1.2;

    return {
      data: [
        { x: [0, tipX, coneDist, coneDist, tipX, 0, 0], y: [stackH, tipY, 0, 0, tipY, stackH, stackH], type: 'scatter', fill: 'tozerox' as const, fillcolor: 'rgba(255,165,0,0.15)', line: { color: 'rgba(255,165,0,0.3)', width: 1 }, showlegend: false },
        { x: [0, 0], y: [0, stackH], mode: 'lines' as const, type: 'scatter' as const, line: { color: '#666', width: 6 }, name: 'Stack' },
        { x: [0, tipX], y: [stackH, tipY], mode: 'lines' as const, type: 'scatter' as const, line: { color: 'orange', width: 5 }, name: 'Flame' },
      ],
      layout: {
        title: { text: 'Side View / Elevation', font: { size: 14, color: '#333' } },
        xaxis: { title: { text: 'Distance (m)', font: { color: '#333' } }, zeroline: true, tickfont: { color: '#333' } },
        yaxis: { title: { text: 'Height (m)', font: { color: '#333' } }, zeroline: true, scaleanchor: 'x' as const, tickfont: { color: '#333' } },
        paper_bgcolor: 'white',
        plot_bgcolor: '#f9f9f9',
        width: 600,
        height: 350,
        margin: { l: 60, r: 40, t: 40, b: 50 },
        showlegend: true,
      },
      config: { responsive: true, displayModeBar: false },
    };
  }, [radiation, stackH, flameLen, tilt]);

  return (
    <div className="bg-white rounded-lg p-2">
      <Suspense fallback={<PlotLoader />}>
        <PlotContent {...plotSpec} />
      </Suspense>
    </div>
  );
}

export default function VisualizationPanel() {
  const { project, activeScenarioId } = useProjectStore();
  const scenario = project?.scenarios.find(s => s.id === activeScenarioId);
  const results = scenario?.results;

  if (!results) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600">
        <div className="text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <p>Run calculations first to see visualizations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-100">
      <h2 className="text-lg font-bold text-gray-800">Visualization — {scenario?.name}</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ContourPlot results={results} type="radiation" title="Thermal Radiation Contour (kW/m²)" />
        <ContourPlot results={results} type="noise" title="Noise Contour (dBA)" />
        {results.dispersion && <ContourPlot results={results} type="dispersion" title="Gas Dispersion (mg/m³)" />}
        <ElevationView results={results} />
      </div>
    </div>
  );
}
