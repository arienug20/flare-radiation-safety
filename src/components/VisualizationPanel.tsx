'use client';
import React, { useMemo, useRef, useCallback, useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import type { ScenarioResults } from '@/types';

// Dynamic import wrapper for Plotly (avoids SSR issues)
let Plot: any = null;

function ContourPlot({ results, type, title }: { results: ScenarioResults; type: 'radiation' | 'noise' | 'dispersion'; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
    import('react-plotly.js').then(mod => {
      Plot = mod.default;
      setLoaded(true);
    });
  }, []);

  const { radiation, noise, dispersion } = results;

  const plotData = useMemo(() => {
    if (!Plot) return null;

    const maxR = Math.max(
      radiation.safeRadii.personnel_1_6 || 100,
      noise.safeRadii.residential_55 || 200,
      150
    ) * 1.5;

    const gridSize = 80;
    const x: number[] = [];
    const y: number[] = [];
    const z: number[][] = [];

    for (let i = 0; i < gridSize; i++) {
      const row: number[] = [];
      for (let j = 0; j < gridSize; j++) {
        const px = -maxR + (2 * maxR * j) / (gridSize - 1);
        const py = -maxR + (2 * maxR * i) / (gridSize - 1);
        const dist = Math.sqrt(px * px + py * py);
        const flameH = 0; // simplified center height

        let val = 0;
        if (type === 'radiation') {
          const R = Math.sqrt(dist * dist + radiation.flameLength * radiation.flameLength / 4);
          val = R > 0 ? (radiation.heatRelease * 0.2) / (4 * Math.PI * R * R) : 0;
        } else if (type === 'noise') {
          if (dist > 0) {
            val = noise.sourceSPL - 20 * Math.log10(dist) - 11 - 0.005 * dist;
          } else {
            val = noise.sourceSPL;
          }
        } else if (dispersion) {
          // Simplified Gaussian plume contour
          const sigmaY = 0.08 * dist / Math.sqrt(1 + 0.0001 * dist);
          const sigmaZ = 0.06 * dist / Math.sqrt(1 + 0.0015 * dist);
          if (dist > 10 && sigmaY > 0 && sigmaZ > 0) {
            val = (1 / (Math.PI * sigmaY * sigmaZ * 5)) * Math.exp(-py * py / (2 * sigmaY * sigmaY)) * Math.exp(-30 * 30 / (2 * sigmaZ * sigmaZ)) * 1e6;
          }
        }
        row.push(val);

        if (i === 0) x.push(px);
      }
      y.push(-maxR + (2 * maxR * i) / (gridSize - 1));
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
        type: 'contour',
        colorscale,
        contours,
        colorbar: { title: type === 'radiation' ? 'kW/m²' : type === 'noise' ? 'dBA' : 'mg/m³' },
        hovertemplate: 'X: %{x:.0f}m<br>Y: %{y:.0f}m<br>Value: %{z:.2f}<extra></extra>',
      }],
      layout: {
        title: { text: title, font: { size: 14 } },
        xaxis: { title: 'Distance (m)', scaleanchor: 'y' },
        yaxis: { title: 'Distance (m)' },
        width: 600,
        height: 600,
        margin: { l: 60, r: 40, t: 40, b: 50 },
        shapes: [{
          type: 'circle',
          xref: 'x', yref: 'y',
          x0: -3, y0: -3, x1: 3, y1: 3,
          line: { color: 'black', width: 2 },
        }],
      },
      config: { responsive: true, displayModeBar: true },
    };
  }, [results, type, title]);

  if (!loaded || !plotData) return <div className="text-center p-8 dark:text-white">Loading chart...</div>;

  return (
    <div ref={containerRef}>
      <Plot
        data={plotData.data}
        layout={plotData.layout}
        config={plotData.config}
      />
    </div>
  );
}

function ElevationView({ results }: { results: ScenarioResults }) {
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
    import('react-plotly.js').then(mod => {
      Plot = mod.default;
      setLoaded(true);
    });
  }, []);

  const { radiation } = results;
  const stackH = 30; // from input
  const flameLen = radiation.flameLength;
  const tilt = radiation.flameTilt;

  const plotData = useMemo(() => {
    if (!Plot) return null;

    // Stack
    const stackX = [0, 0];
    const stackY = [0, stackH];

    // Flame (tilted)
    const tipX = flameLen * Math.sin(tilt * Math.PI / 180);
    const tipY = stackH + flameLen * Math.cos(tilt * Math.PI / 180);
    const flameX = [0, tipX];
    const flameY = [stackH, tipY];

    // Radiation cone (simplified)
    const coneDist = radiation.safeRadii.personnel_1_6 * 1.2;
    const coneX = [0, tipX, coneDist, coneDist, tipX, 0, 0];
    const coneY = [stackH, tipY, 0, 0, tipY, stackH, stackH];

    return {
      data: [
        { x: coneX, y: coneY, fill: 'tozerox', fillcolor: 'rgba(255,165,0,0.15)', line: { color: 'rgba(255,165,0,0.3)', width: 1 }, showlegend: false },
        { x: stackX, y: stackY, mode: 'lines', line: { color: 'gray', width: 8 }, name: 'Stack' },
        { x: flameX, y: flameY, mode: 'lines', line: { color: 'orange', width: 6 }, name: 'Flame' },
      ],
      layout: {
        title: { text: 'Side View / Elevation', font: { size: 14 } },
        xaxis: { title: 'Distance (m)', zeroline: true },
        yaxis: { title: 'Height (m)', zeroline: true, scaleanchor: 'x' },
        width: 700,
        height: 400,
        margin: { l: 60, r: 40, t: 40, b: 50 },
        showlegend: true,
      },
      config: { responsive: true },
    };
  }, [results]);

  if (!loaded || !plotData) return <div className="text-center p-4 dark:text-white">Loading chart...</div>;

  return <Plot data={plotData.data} layout={plotData.layout} config={plotData.config} />;
}

export default function VisualizationPanel() {
  const { project, activeScenarioId } = useProjectStore();
  const scenario = project?.scenarios.find(s => s.id === activeScenarioId);
  const results = scenario?.results;

  if (!results) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <p>Run calculations first to see visualizations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <h2 className="text-lg font-bold dark:text-white">Visualization — {scenario?.name}</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ContourPlot results={results} type="radiation" title="Thermal Radiation Contour (kW/m²)" />
        <ContourPlot results={results} type="noise" title="Noise Contour (dBA)" />
        {results.dispersion && <ContourPlot results={results} type="dispersion" title="Gas Dispersion (mg/m³)" />}
        <ElevationView results={results} />
      </div>
    </div>
  );
}
