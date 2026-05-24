'use client';
import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import { runFullCalculation } from '@/lib/calculations';

export default function ComparisonPanel() {
  const { project } = useProjectStore();
  const scenarios = project?.scenarios || [];
  const resultsList = scenarios.map(sc => ({
    scenario: sc,
    results: sc.results || (sc.gasComposition.length > 0 ? runFullCalculation(sc) : null),
  })).filter(r => r.results);

  if (resultsList.length < 2) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-3">⚖️</div>
          <p>Add at least 2 scenarios with results to compare.</p>
        </div>
      </div>
    );
  }

  // Find worst case
  const worstCaseIdx = resultsList.reduce((worst, curr, idx) => {
    const worstR = resultsList[worst].results?.safeRadiusSummary.overallSafeRadius || 0;
    const currR = curr.results?.safeRadiusSummary.overallSafeRadius || 0;
    return currR > worstR ? idx : worst;
  }, 0);

  const formatN = (n: number | undefined, d = 1) => n !== undefined && isFinite(n) ? n.toFixed(d) : '—';

  const rows = [
    { label: 'Heat Release (MW)', get: (r: any) => r.radiation.heatRelease / 1000 },
    { label: 'Flame Length (m)', get: (r: any) => r.radiation.flameLength },
    { label: 'Flame Tilt (°)', get: (r: any) => r.radiation.flameTilt },
    { label: 'Tip Diameter (m)', get: (r: any) => r.radiation.tipDiameter },
    { label: 'Exclusion Zone (6.3 kW/m²)', get: (r: any) => r.radiation.safeRadii.equipment_6_3 },
    { label: 'Restricted Zone (4.7 kW/m²)', get: (r: any) => r.radiation.safeRadii.escape_4_7 },
    { label: 'Controlled Zone (1.6 kW/m²)', get: (r: any) => r.radiation.safeRadii.personnel_1_6 },
    { label: 'Noise Residential (55 dBA) m', get: (r: any) => r.noise.safeRadii.residential_55 },
    { label: 'Noise Industrial (85 dBA) m', get: (r: any) => r.noise.safeRadii.industrial_85 },
    { label: 'Overall Safe Radius (m)', get: (r: any) => r.safeRadiusSummary.overallSafeRadius },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <h2 className="text-lg font-bold dark:text-white">Scenario Comparison</h2>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-3 text-sm dark:text-yellow-200">
        🚨 <strong>Worst Case:</strong> {resultsList[worstCaseIdx].scenario.name} — Overall safe radius: {formatN(resultsList[worstCaseIdx].results?.safeRadiusSummary.overallSafeRadius)} m
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-3 py-2 text-left dark:text-white">Parameter</th>
              {resultsList.map((r, i) => (
                <th key={i} className={`px-3 py-2 text-center dark:text-white ${i === worstCaseIdx ? 'bg-red-50 dark:bg-red-900/30' : ''}`}>
                  {r.scenario.name}
                  {i === worstCaseIdx && ' ⚠️'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const vals = resultsList.map(r => row.get(r.results));
              const maxVal = Math.max(...vals);
              return (
                <tr key={i} className="border-b dark:border-gray-700">
                  <td className="px-3 py-2 dark:text-white font-medium">{row.label}</td>
                  {vals.map((v, j) => (
                    <td key={j} className={`px-3 py-2 text-center font-mono ${v === maxVal && i > 2 ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold' : 'dark:text-white'}`}>
                      {formatN(v)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
