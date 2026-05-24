'use client';
import React, { useMemo, useCallback } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { GAS_COMPONENTS, DEFAULT_TEMPLATES } from '@/lib/constants';
import { calculateMW, calculateLHV, calculateHHV, calculateDensity, calculateLFL, calculateUFL } from '@/lib/calculations';
import type { CompositionEntry, ReceptorPoint } from '@/types';

export default function InputDataPanel() {
  const { project, updateScenario, activeScenarioId, addReceptor, removeReceptor, updateReceptor } = useProjectStore();
  const scenario = project?.scenarios.find(s => s.id === activeScenarioId);

  const update = useCallback((field: string, value: any) => {
    if (activeScenarioId) updateScenario(activeScenarioId, { [field]: value });
  }, [activeScenarioId, updateScenario]);

  const gasProps = useMemo(() => {
    if (!scenario?.gasComposition) return null;
    const e = scenario.gasComposition;
    return {
      mw: calculateMW(e),
      lhv: calculateLHV(e),
      hhv: calculateHHV(e),
      density: calculateDensity(e),
      lfl: calculateLFL(e),
      ufl: calculateUFL(e),
      total: e.reduce((s, x) => s + x.molPercent, 0),
    };
  }, [scenario?.gasComposition]);

  if (!project || !scenario) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-6xl mb-4">🔥</div>
          <h2 className="text-xl font-bold mb-2 dark:text-white">Flare Radiation & Safety</h2>
          <p>Create a new project or open an existing one to get started.</p>
        </div>
      </div>
    );
  }

  const updateComp = (componentId: string, molPercent: number) => {
    const existing = scenario.gasComposition.find(e => e.componentId === componentId);
    let newComp: CompositionEntry[];
    if (existing) {
      newComp = scenario.gasComposition.map(e => e.componentId === componentId ? { ...e, molPercent } : e);
    } else {
      newComp = [...scenario.gasComposition, { componentId, molPercent }];
    }
    update('gasComposition', newComp);
  };

  const loadTemplate = (templateId: string) => {
    const tmpl = DEFAULT_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) update('gasComposition', tmpl.entries.map(e => ({ ...e })));
  };

  const addNewReceptor = () => {
    const rp: ReceptorPoint = {
      id: crypto.randomUUID(),
      name: `Receptor ${(project?.receptorPoints.length || 0) + 1}`,
      x: 100, y: 0, elevation: 0,
      category: 'personnel',
    };
    addReceptor(rp);
  };

  const inputClass = "w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white";
  const labelClass = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <h2 className="text-lg font-bold dark:text-white">Input Data — {scenario.name}</h2>

      {/* Gas Composition */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold dark:text-white">🧪 Gas Composition (mol%)</h3>
          <div className="flex gap-2">
            <select onChange={e => loadTemplate(e.target.value)} value="" className="text-xs border rounded px-2 py-1 dark:bg-gray-700 dark:text-white dark:border-gray-600">
              <option value="">Load Template...</option>
              {DEFAULT_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button onClick={() => {
              const total = gasProps?.total || 0;
              if (total > 0 && Math.abs(total - 100) > 0.01) {
                const factor = 100 / total;
                const normalized = scenario.gasComposition.map(e => ({ ...e, molPercent: e.molPercent * factor }));
                update('gasComposition', normalized);
              }
            }} className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded" title="Normalize to 100%">
              Normalize
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {GAS_COMPONENTS.map(comp => {
            const entry = scenario.gasComposition.find(e => e.componentId === comp.id);
            return (
              <div key={comp.id} className="border dark:border-gray-600 rounded p-2">
                <label className={labelClass} title={`MW: ${comp.mw} g/mol, LHV: ${comp.lhv} MJ/Nm³`}>{comp.formula}</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={entry?.molPercent || 0}
                  onChange={e => updateComp(comp.id, parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
            );
          })}
        </div>
        {gasProps && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <span className="text-gray-500 dark:text-gray-400">Total</span>
              <div className={`font-bold ${Math.abs(gasProps.total - 100) > 0.1 ? 'text-red-600' : 'text-green-600'}`}>{gasProps.total.toFixed(1)}%</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <span className="text-gray-500 dark:text-gray-400">MW</span>
              <div className="font-bold dark:text-white">{gasProps.mw.toFixed(2)} g/mol</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <span className="text-gray-500 dark:text-gray-400">LHV</span>
              <div className="font-bold dark:text-white">{gasProps.lhv.toFixed(2)} MJ/Nm³</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <span className="text-gray-500 dark:text-gray-400">HHV</span>
              <div className="font-bold dark:text-white">{gasProps.hhv.toFixed(2)} MJ/Nm³</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <span className="text-gray-500 dark:text-gray-400">Density</span>
              <div className="font-bold dark:text-white">{gasProps.density.toFixed(3)} kg/Nm³</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <span className="text-gray-500 dark:text-gray-400">LFL</span>
              <div className="font-bold dark:text-white">{gasProps.lfl.toFixed(1)}%</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <span className="text-gray-500 dark:text-gray-400">UFL</span>
              <div className="font-bold dark:text-white">{gasProps.ufl.toFixed(1)}%</div>
            </div>
          </div>
        )}
      </div>

      {/* Flare Parameters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="font-semibold dark:text-white mb-3">🔥 Flare Parameters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass} title="Mass flow rate of flare gas">Flow Rate (kg/hr)</label>
            <input type="number" step="100" value={scenario.flowRate} onChange={e => update('flowRate', parseFloat(e.target.value) || 0)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} title="Fluid temperature at flare header">Temperature (°C)</label>
            <input type="number" step="1" value={scenario.fluidTemperature} onChange={e => update('fluidTemperature', parseFloat(e.target.value) || 0)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} title="Fluid pressure at flare header">Pressure (barg)</label>
            <input type="number" step="0.1" value={scenario.fluidPressure} onChange={e => update('fluidPressure', parseFloat(e.target.value) || 0)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} title="Flare stack height above grade">Stack Height (m)</label>
            <input type="number" step="1" value={scenario.stackHeight} onChange={e => update('stackHeight', parseFloat(e.target.value) || 0)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} title="Tip diameter (0 = auto-calculate)">Tip Diameter (m)</label>
            <input type="number" step="0.01" value={scenario.tipDiameter} onChange={e => update('tipDiameter', parseFloat(e.target.value) || 0)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} title="Mach number at flare tip">Mach Number</label>
            <input type="number" step="0.01" min="0.1" max="1" value={scenario.machNumber} onChange={e => update('machNumber', parseFloat(e.target.value) || 0.3)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} title="Fraction of heat radiated (τ) per API 521">Fraction Radiated (τ)</label>
            <input type="number" step="0.01" min="0.1" max="0.5" value={scenario.fractionRadiated} onChange={e => update('fractionRadiated', parseFloat(e.target.value) || 0.2)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} title="Combustion efficiency (typically 0.98)">Combustion Efficiency</label>
            <input type="number" step="0.01" min="0.9" max="1" value={scenario.combustionEfficiency} onChange={e => update('combustionEfficiency', parseFloat(e.target.value) || 0.98)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Atmospheric Conditions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="font-semibold dark:text-white mb-3">🌤️ Atmospheric Conditions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className={labelClass} title="Design wind speed">Wind Speed (m/s)</label>
            <input type="number" step="0.5" value={scenario.windSpeed} onChange={e => update('windSpeed', parseFloat(e.target.value) || 0)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} title="Wind direction in degrees from North">Wind Direction (°)</label>
            <input type="number" step="15" min="0" max="360" value={scenario.windDirection} onChange={e => update('windDirection', parseFloat(e.target.value) || 0)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} title="Ambient air temperature">Ambient Temp (°C)</label>
            <input type="number" step="1" value={scenario.ambientTemp} onChange={e => update('ambientTemp', parseFloat(e.target.value) || 30)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} title="Relative humidity">Humidity (%)</label>
            <input type="number" step="5" min="0" max="100" value={scenario.relativeHumidity} onChange={e => update('relativeHumidity', parseFloat(e.target.value) || 80)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} title="Pasquill-Gifford stability class (A-F)">Stability Class</label>
            <select value={scenario.stabilityClass} onChange={e => update('stabilityClass', e.target.value)} className={inputClass}>
              {['A','B','C','D','E','F'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Receptor Points */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold dark:text-white">📍 Receptor Points</h3>
          <button onClick={addNewReceptor} className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">+ Add Receptor</button>
        </div>
        {project.receptorPoints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-600">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">X (m)</th>
                  <th className="pb-2">Y (m)</th>
                  <th className="pb-2">Elev (m)</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {project.receptorPoints.map(rp => (
                  <tr key={rp.id} className="border-b dark:border-gray-700">
                    <td className="py-1"><input type="text" value={rp.name} onChange={e => updateReceptor(rp.id, { name: e.target.value })} className={inputClass} /></td>
                    <td className="py-1"><input type="number" step="1" value={rp.x} onChange={e => updateReceptor(rp.id, { x: parseFloat(e.target.value) || 0 })} className={inputClass} /></td>
                    <td className="py-1"><input type="number" step="1" value={rp.y} onChange={e => updateReceptor(rp.id, { y: parseFloat(e.target.value) || 0 })} className={inputClass} /></td>
                    <td className="py-1"><input type="number" step="0.1" value={rp.elevation} onChange={e => updateReceptor(rp.id, { elevation: parseFloat(e.target.value) || 0 })} className={inputClass} /></td>
                    <td className="py-1">
                      <select value={rp.category} onChange={e => updateReceptor(rp.id, { category: e.target.value as any })} className={inputClass}>
                        <option value="personnel">Personnel</option>
                        <option value="equipment">Equipment</option>
                        <option value="boundary">Boundary</option>
                        <option value="community">Community</option>
                      </select>
                    </td>
                    <td className="py-1"><button onClick={() => removeReceptor(rp.id)} className="text-red-500 text-xs">✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-gray-400">No receptor points added yet. Click &quot;Add Receptor&quot; to add points of interest.</p>
        )}
      </div>
    </div>
  );
}
