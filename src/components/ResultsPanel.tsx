'use client';
import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import { runFullCalculation } from '@/lib/calculations';
import { ALLOWABLE_RADIATION_LEVELS } from '@/lib/constants';
import type { ScenarioResults } from '@/types';

export default function ResultsPanel() {
  const { project, activeScenarioId, updateScenario } = useProjectStore();
  const scenario = project?.scenarios.find(s => s.id === activeScenarioId);

  const runCalc = () => {
    if (!scenario || !activeScenarioId) return;
    try {
      const results = runFullCalculation(scenario);
      updateScenario(activeScenarioId, { results } as any);
    } catch (err) {
      alert('Calculation error: ' + (err as Error).message);
    }
  };

  const results: ScenarioResults | undefined = scenario?.results;

  const formatNum = (n: number | undefined, decimals = 1) => {
    if (n === undefined || !isFinite(n)) return '—';
    return n.toFixed(decimals);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Calculation Results — {scenario?.name}</h2>
        <button onClick={runCalc} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">
          ▶ Run Calculation
        </button>
      </div>

      {!results ? (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-3">🔬</div>
          <p>Click "Run Calculation" to compute results.</p>
        </div>
      ) : (
        <>
          {/* Radiation Results */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-800 mb-3">🌡️ Thermal Radiation (API 521)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-50 rounded p-2">
                <div className="text-xs text-gray-500">Heat Release</div>
                <div className="font-bold text-gray-800">{formatNum(results.radiation.heatRelease / 1000, 0)} MW</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-xs text-gray-500">Flame Length</div>
                <div className="font-bold text-gray-800">{formatNum(results.radiation.flameLength)} m</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-xs text-gray-500">Flame Tilt</div>
                <div className="font-bold text-gray-800">{formatNum(results.radiation.flameTilt)}°</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-xs text-gray-500">Tip Diameter</div>
                <div className="font-bold text-gray-800">{formatNum(results.radiation.tipDiameter, 3)} m</div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="pb-2">Zone</th>
                    <th className="pb-2">Allowable (kW/m²)</th>
                    <th className="pb-2">Safe Radius (m)</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ALLOWABLE_RADIATION_LEVELS.map((level, i) => {
                    const radii = Object.values(results.radiation.safeRadii);
                    const radius = radii[i] || 0;
                    return (
                      <tr key={i} className="border-b border-gray-200">
                        <td className="py-2">{level.label}</td>
                        <td className="py-2">{level.value}</td>
                        <td className="py-2 font-mono">{formatNum(radius)}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${radius > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {radius > 0 ? 'Exceeds at radius' : 'Within limits'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Noise Results */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-800 mb-3">🔊 Noise (ISO 9613)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded p-2">
                <div className="text-xs text-gray-500">Source SPL</div>
                <div className="font-bold text-gray-800">{formatNum(results.noise.sourceSPL, 0)} dBA</div>
              </div>
              {results.noise.safeRadii.residential_55 > 0 && (
                <div className="bg-blue-50 rounded p-2">
                  <div className="text-xs text-gray-500">Residential (55 dBA)</div>
                  <div className="font-bold text-gray-800">{formatNum(results.noise.safeRadii.residential_55)} m</div>
                </div>
              )}
              {results.noise.safeRadii.commercial_65 > 0 && (
                <div className="bg-green-50 rounded p-2">
                  <div className="text-xs text-gray-500">Commercial (65 dBA)</div>
                  <div className="font-bold text-gray-800">{formatNum(results.noise.safeRadii.commercial_65)} m</div>
                </div>
              )}
              {results.noise.safeRadii.industrial_85 > 0 && (
                <div className="bg-orange-50 rounded p-2">
                  <div className="text-xs text-gray-500">Industrial (85 dBA)</div>
                  <div className="font-bold text-gray-800">{formatNum(results.noise.safeRadii.industrial_85)} m</div>
                </div>
              )}
            </div>
          </div>

          {/* Dispersion Results */}
          {results.dispersion && (
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-3">💨 Gas Dispersion (Gaussian Plume)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-orange-50 rounded p-2">
                  <div className="text-xs text-gray-500">Distance to LFL</div>
                  <div className="font-bold text-gray-800">{formatNum(results.dispersion.distanceToLFL)} m</div>
                </div>
                <div className="bg-orange-50 rounded p-2">
                  <div className="text-xs text-gray-500">Distance to LFL/2</div>
                  <div className="font-bold text-gray-800">{formatNum(results.dispersion.distanceToHalfLFL)} m</div>
                </div>
                <div className="bg-orange-50 rounded p-2">
                  <div className="text-xs text-gray-500">Distance to IDLH</div>
                  <div className="font-bold text-gray-800">{formatNum(results.dispersion.distanceToIDLH)} m</div>
                </div>
              </div>
            </div>
          )}

          {/* Safe Radius Summary */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-800 mb-3">🛡️ Safe Radius Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="pb-2">Zone</th>
                    <th className="pb-2">Radius (m)</th>
                    <th className="pb-2">Criteria</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: '🚫 Exclusion Zone', value: results.safeRadiusSummary.exclusionZone, criteria: 'Thermal > 6.3 kW/m²' },
                    { label: '⚠️ Restricted Zone', value: results.safeRadiusSummary.restrictedZone, criteria: 'Thermal > 4.7 kW/m²' },
                    { label: '🟡 Controlled Zone', value: results.safeRadiusSummary.controlledZone, criteria: 'Thermal > 1.6 kW/m²' },
                    { label: '🔊 Noise Zone (Industrial)', value: results.safeRadiusSummary.noiseIndustrial, criteria: 'Noise > 85 dBA' },
                    { label: '🏘️ Community Zone', value: results.safeRadiusSummary.noiseCommunity, criteria: 'Noise > 55 dBA' },
                    ...(results.safeRadiusSummary.dispersionHalfLFL ? [{ label: '💨 Dispersion (LFL/2)', value: results.safeRadiusSummary.dispersionHalfLFL, criteria: 'Concentration > LFL/2' }] : []),
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-200">
                      <td className="py-2">{row.label}</td>
                      <td className="py-2 font-mono font-bold">{formatNum(row.value)} m</td>
                      <td className="py-2 text-xs text-gray-500">{row.criteria}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-bold">
                    <td className="py-2">📐 Overall Safe Radius</td>
                    <td className="py-2 font-mono text-lg text-blue-800">{formatNum(results.safeRadiusSummary.overallSafeRadius)} m</td>
                    <td className="py-2 text-xs text-gray-500">Maximum of all zones</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Compliance */}
            <h4 className="font-semibold mt-4 mb-2 text-sm text-gray-800">Compliance Check</h4>
            <div className="space-y-1">
              {results.safeRadiusSummary.complianceChecks.map((check, i) => (
                <div key={i} className={`text-xs px-3 py-1.5 rounded flex items-center gap-2 ${check.compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <span>{check.compliant ? '✅' : '❌'}</span>
                  <span>[{check.standard}] {check.requirement}: {formatNum(check.value)} {check.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
