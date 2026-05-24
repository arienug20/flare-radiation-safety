import { CompositionEntry, RadiationResult, NoiseResult, DispersionResult, SafeRadiusSummary, ComplianceCheck, ScenarioResults } from '@/types';
import { GAS_COMPONENTS } from './constants';

// ==================== Gas Properties ====================
export function calculateMW(entries: CompositionEntry[]): number {
  if (!entries || entries.length === 0) return 28.97; // default: air MW
  const total = entries.reduce((s, e) => s + e.molPercent, 0);
  if (total <= 0) return 28.97;
  return entries.reduce((sum, e) => {
    const comp = GAS_COMPONENTS.find(c => c.id === e.componentId);
    return sum + (comp ? comp.mw * (e.molPercent / total) : 0);
  }, 0);
}

export function calculateLHV(entries: CompositionEntry[]): number {
  if (!entries || entries.length === 0) return 0;
  const total = entries.reduce((s, e) => s + e.molPercent, 0);
  if (total <= 0) return 0;
  return entries.reduce((sum, e) => {
    const comp = GAS_COMPONENTS.find(c => c.id === e.componentId);
    return sum + (comp ? comp.lhv * (e.molPercent / total) : 0);
  }, 0);
}

export function calculateHHV(entries: CompositionEntry[]): number {
  if (!entries || entries.length === 0) return 0;
  const total = entries.reduce((s, e) => s + e.molPercent, 0);
  if (total <= 0) return 0;
  return entries.reduce((sum, e) => {
    const comp = GAS_COMPONENTS.find(c => c.id === e.componentId);
    return sum + (comp ? comp.hhv * (e.molPercent / total) : 0);
  }, 0);
}

export function calculateDensity(entries: CompositionEntry[]): number {
  if (!entries || entries.length === 0) return 1.225; // default: air density
  const total = entries.reduce((s, e) => s + e.molPercent, 0);
  if (total <= 0) return 1.225;
  return entries.reduce((sum, e) => {
    const comp = GAS_COMPONENTS.find(c => c.id === e.componentId);
    return sum + (comp ? comp.density * (e.molPercent / total) : 0);
  }, 0);
}

export function calculateLFL(entries: CompositionEntry[]): number {
  // Le Chatelier's rule
  let numerator = 0;
  let denominator = 0;
  entries.forEach(e => {
    const comp = GAS_COMPONENTS.find(c => c.id === e.componentId);
    if (comp && comp.lfl > 0 && e.molPercent > 0) {
      numerator += e.molPercent;
      denominator += e.molPercent / comp.lfl;
    }
  });
  return denominator > 0 ? numerator / denominator : 0;
}

export function calculateUFL(entries: CompositionEntry[]): number {
  let numerator = 0;
  let denominator = 0;
  entries.forEach(e => {
    const comp = GAS_COMPONENTS.find(c => c.id === e.componentId);
    if (comp && comp.ufl > 0 && e.molPercent > 0) {
      numerator += e.molPercent;
      denominator += e.molPercent / comp.ufl;
    }
  });
  return denominator > 0 ? numerator / denominator : 0;
}

// ==================== Thermal Radiation (API 521) ====================
export function calculateThermalRadiation(params: {
  flowRate: number; // kg/hr
  lhv: number; // MJ/Nm³
  density: number; // kg/Nm³
  stackHeight: number; // m
  tipDiameter: number; // m (0 = auto)
  machNumber: number;
  windSpeed: number; // m/s
  fractionRadiated: number;
  combustionEfficiency: number;
  fluidTemperature: number; // °C
  fluidPressure: number; // barg
}): RadiationResult {
  const { flowRate, lhv, density, stackHeight, tipDiameter, machNumber, windSpeed, fractionRadiated, combustionEfficiency, fluidTemperature, fluidPressure } = params;

  // Guard against invalid inputs
  if (flowRate <= 0 || density <= 0) {
    return {
      distances: [0], intensities: [0], flameLength: 0, flameTilt: 0,
      safeRadii: { equipment_6_3: 0, escape_4_7: 0, personnel_1_6: 0, boundary_3_2: 0, design_9_5: 0 },
      tipDiameter: 0, gasVelocity: 0, heatRelease: 0,
    };
  }

  // Heat release rate
  const safeDensity = density > 0 ? density : 1.225;
  const safeLHV = lhv > 0 ? lhv : 35; // typical natural gas LHV
  const volumetricFlowNormal = flowRate / safeDensity; // Nm³/hr
  const Q_release = volumetricFlowNormal * safeLHV * 1000 * combustionEfficiency / 3600; // kW

  // Wind speed guard
  const safeWindSpeed = Math.max(windSpeed, 0.5); // minimum 0.5 m/s

  // Gas velocity at tip
  const T_actual = (fluidTemperature + 273.15) / 273.15;
  const P_ratio = (fluidPressure + 1.01325) / 1.01325;
  const actualVolFlow = volumetricFlowNormal * T_actual / P_ratio / 3600; // m³/s

  // Speed of sound approximation for hydrocarbons
  const k = 1.3; // approximate ratio of specific heats
  const mw = calculateMW([]); // returns 28.97 (air) if empty
  const R_gas = 8314 / (mw > 0 ? mw : 28.97); // guard against zero
  const speedOfSound = Math.sqrt(k * R_gas * T_actual * (fluidTemperature + 273.15) / 273.15);
  const gasVelocity = machNumber * speedOfSound;

  // Tip diameter
  const calcTipDiameter = tipDiameter > 0
    ? tipDiameter
    : Math.sqrt(4 * actualVolFlow / (Math.PI * gasVelocity));

  const actualGasVelocity = calcTipDiameter > 0 ? actualVolFlow / (Math.PI / 4 * calcTipDiameter * calcTipDiameter) : gasVelocity;

  // Flame length (API 521)
  const Q_kJhr = Q_release * 3600; // kJ/hr
  const flameLength = 0.00336 * Math.sqrt(Q_kJhr);

  // Flame tilt (API 521)
  const tiltAngle = Math.atan(safeWindSpeed / Math.max(actualGasVelocity, 0.1) * 0.4) * 180 / Math.PI;

  // Flame center position
  const flameCenterHeight = stackHeight + flameLength / 2 * Math.cos(tiltAngle * Math.PI / 180);
  const flameCenterDownwind = flameLength / 2 * Math.sin(tiltAngle * Math.PI / 180);

  // Calculate radiation at distances
  const maxDist = Math.max(500, flameLength * 2);
  const distances: number[] = [];
  const intensities: number[] = [];
  const tau = fractionRadiated;

  for (let d = 1; d <= maxDist; d += Math.max(1, Math.floor(maxDist / 200))) {
    // Skip if no valid flame center
    if (flameCenterHeight <= 0 && flameCenterDownwind <= 0) {
      distances.push(d);
      intensities.push(0);
      continue;
    }
    // Distance from flame center to point at ground level, distance d from flare base
    const dx = d - flameCenterDownwind;
    const R = Math.sqrt(dx * dx + flameCenterHeight * flameCenterHeight);
    const q = R > 0 ? (tau * Q_release) / (4 * Math.PI * R * R) : 0;
    distances.push(d);
    intensities.push(isFinite(q) ? q : 0);
  }

  // Safe radii for each allowable level
  const findRadius = (limit: number): number => {
    for (let i = distances.length - 1; i >= 0; i--) {
      if (intensities[i] >= limit) {
        // Interpolate
        if (i < distances.length - 1) {
          const ratio = (limit - intensities[i + 1]) / (intensities[i] - intensities[i + 1]);
          return distances[i + 1] + ratio * (distances[i] - distances[i + 1]);
        }
        return distances[i];
      }
    }
    return 0;
  };

  return {
    distances,
    intensities,
    flameLength,
    flameTilt: tiltAngle,
    safeRadii: {
      equipment_6_3: findRadius(6.3),
      escape_4_7: findRadius(4.73),
      personnel_1_6: findRadius(1.58),
      boundary_3_2: findRadius(3.16),
      design_9_5: findRadius(9.46),
    },
    tipDiameter: calcTipDiameter,
    gasVelocity: actualGasVelocity,
    heatRelease: Q_release,
  };
}

// ==================== Noise Calculation (ISO 9613) ====================
export function calculateNoise(params: {
  gasVelocity: number; // m/s
  pressureDrop: number; // kPa
  ambientTemp: number; // °C
  relativeHumidity: number; // %
  stackHeight: number; // m
}): NoiseResult {
  const { gasVelocity, pressureDrop, ambientTemp, relativeHumidity, stackHeight } = params;

  // Flare noise estimation
  const sourceSPL = 10 * Math.log10(gasVelocity * Math.max(pressureDrop, 1)) + 100; // empirical

  const maxDist = 2000;
  const distances: number[] = [];
  const splValues: number[] = [];

  // Atmospheric absorption approximation (simplified)
  const absorptionCoeff = 0.005; // dB/m simplified

  for (let d = 1; d <= maxDist; d += Math.max(1, Math.floor(maxDist / 200))) {
    distances.push(d);
    const geometricSpreading = 20 * Math.log10(Math.max(d, 1)) + 11;
    const atmosphericAbsorption = absorptionCoeff * d;
    const spl = sourceSPL - geometricSpreading - atmosphericAbsorption;
    splValues.push(spl);
  }

  const findRadius = (limit: number): number => {
    for (let i = distances.length - 1; i >= 0; i--) {
      if (splValues[i] >= limit) {
        if (i < distances.length - 1) {
          const ratio = (limit - splValues[i + 1]) / (splValues[i] - splValues[i + 1]);
          return distances[i + 1] + ratio * (distances[i] - distances[i + 1]);
        }
        return distances[i];
      }
    }
    return 0;
  };

  return {
    distances,
    splValues,
    sourceSPL,
    safeRadii: {
      residential_55: findRadius(55),
      commercial_65: findRadius(65),
      industrial_85: findRadius(85),
      boundary_70: findRadius(70),
    },
  };
}

// ==================== Gas Dispersion (Gaussian Plume) ====================
export function calculateDispersion(params: {
  flowRate: number; // kg/hr
  mw: number;
  stackHeight: number;
  windSpeed: number;
  stabilityClass: string;
  density: number;
}): DispersionResult {
  const { flowRate, mw, stackHeight, windSpeed, stabilityClass, density } = params;

  const releaseRate = flowRate / 3600; // kg/s
  const validClasses = ['A', 'B', 'C', 'D', 'E', 'F'];
  const validatedClass = validClasses.includes(stabilityClass) ? stabilityClass : 'D';
  const u = Math.max(windSpeed, 0.5); // m/s, minimum 0.5

  // Pasquill-Gifford sigma coefficients
  const sigmaCoeffs: Record<string, { ay: number; by: number; az: number; bz: number }> = {
    'A': { ay: 0.22, by: 0.0001, az: 0.20, bz: 0.0 },
    'B': { ay: 0.16, by: 0.0001, az: 0.12, bz: 0.0 },
    'C': { ay: 0.11, by: 0.0001, az: 0.08, bz: 0.0002 },
    'D': { ay: 0.08, by: 0.0001, az: 0.06, bz: 0.0015 },
    'E': { ay: 0.06, by: 0.0001, az: 0.03, bz: 0.0003 },
    'F': { ay: 0.04, by: 0.0001, az: 0.016, bz: 0.0003 },
  };

  const sc = sigmaCoeffs[validatedClass]

  const sigmaY = (x: number) => sc.ay * x / Math.sqrt(1 + sc.by * x);
  const sigmaZ = (x: number) => sc.az * x / Math.sqrt(1 + sc.bz * x);

  // LFL in mg/m³ (simplified - use a typical value based on MW)
  const lflVolPercent = 2.5; // approximate typical LFL
  const lflMgM3 = lflVolPercent * mw / 24.45 * 1000; // mg/m³

  const maxDist = 5000;
  const distances: number[] = [];
  const centerlineConcentrations: number[] = [];

  for (let x = 10; x <= maxDist; x += Math.max(10, Math.floor(maxDist / 200))) {
    distances.push(x);
    const sy = sigmaY(x);
    const sz = sigmaZ(x);
    // Ground level, centerline concentration
    const C = (releaseRate / (Math.PI * sy * sz * u)) *
      Math.exp(-stackHeight * stackHeight / (2 * sz * sz));
    centerlineConcentrations.push(C * 1e6); // convert to mg/m³ scale
  }

  const findDistanceTo = (targetConc: number): number => {
    for (let i = distances.length - 1; i >= 0; i--) {
      if (centerlineConcentrations[i] >= targetConc) {
        return distances[i];
      }
    }
    return 0;
  };

  return {
    distances,
    centerlineConcentrations,
    distanceToLFL: findDistanceTo(lflMgM3),
    distanceToHalfLFL: findDistanceTo(lflMgM3 / 2),
    distanceToIDLH: findDistanceTo(lflMgM3 * 0.1), // approximate
    lflConcentration: lflMgM3,
  };
}

// ==================== Full Scenario Calculation ====================
export function runFullCalculation(scenario: {
  gasComposition: CompositionEntry[];
  flowRate: number;
  fluidTemperature: number;
  fluidPressure: number;
  windSpeed: number;
  windDirection: number;
  ambientTemp: number;
  relativeHumidity: number;
  stackHeight: number;
  tipDiameter: number;
  machNumber: number;
  stabilityClass: string;
  fractionRadiated: number;
  combustionEfficiency: number;
  type: string;
}): ScenarioResults {
  const mw = calculateMW(scenario.gasComposition);
  const lhv = calculateLHV(scenario.gasComposition);
  const density = calculateDensity(scenario.gasComposition);

  // Guard: skip calculation if composition is empty
  if (!scenario.gasComposition || scenario.gasComposition.length === 0 || mw <= 0) {
    const emptyResults: ScenarioResults = {
      radiation: {
        distances: [0], intensities: [0], flameLength: 0, flameTilt: 0,
        safeRadii: { equipment_6_3: 0, escape_4_7: 0, personnel_1_6: 0, boundary_3_2: 0, design_9_5: 0 },
        tipDiameter: 0, gasVelocity: 0, heatRelease: 0,
      },
      noise: {
        distances: [0], splValues: [0], sourceSPL: 0,
        safeRadii: { residential_55: 0, commercial_65: 0, industrial_85: 0, boundary_70: 0 },
      },
      safeRadiusSummary: {
        exclusionZone: 0, restrictedZone: 0, controlledZone: 0,
        noiseIndustrial: 0, noiseCommunity: 0,
        overallSafeRadius: 0, complianceChecks: [],
      },
    };
    return emptyResults;
  }

  const radiation = calculateThermalRadiation({
    flowRate: scenario.flowRate,
    lhv,
    density,
    stackHeight: scenario.stackHeight,
    tipDiameter: scenario.tipDiameter,
    machNumber: scenario.machNumber,
    windSpeed: scenario.windSpeed,
    fractionRadiated: scenario.fractionRadiated,
    combustionEfficiency: scenario.combustionEfficiency,
    fluidTemperature: scenario.fluidTemperature,
    fluidPressure: scenario.fluidPressure,
  });

  const noise = calculateNoise({
    gasVelocity: radiation.gasVelocity,
    pressureDrop: scenario.fluidPressure * 10, // rough estimate
    ambientTemp: scenario.ambientTemp,
    relativeHumidity: scenario.relativeHumidity,
    stackHeight: scenario.stackHeight,
  });

  let dispersion: DispersionResult | undefined;
  if (scenario.type === 'flameout') {
    dispersion = calculateDispersion({
      flowRate: scenario.flowRate,
      mw,
      stackHeight: scenario.stackHeight,
      windSpeed: scenario.windSpeed,
      stabilityClass: scenario.stabilityClass,
      density,
    });
  }

  // Safe radius summary
  const safeRadiusSummary = buildSafeRadiusSummary(radiation, noise, dispersion);

  return { radiation, noise, dispersion, safeRadiusSummary };
}

function buildSafeRadiusSummary(
  radiation: RadiationResult,
  noise: NoiseResult,
  dispersion?: DispersionResult
): SafeRadiusSummary {
  const radii = [
    radiation.safeRadii.equipment_6_3,
    radiation.safeRadii.escape_4_7,
    radiation.safeRadii.personnel_1_6,
    noise.safeRadii.industrial_85,
    noise.safeRadii.residential_55,
  ];
  if (dispersion) {
    radii.push(dispersion.distanceToHalfLFL);
  }

  const complianceChecks: ComplianceCheck[] = [
    { standard: 'API 521', requirement: 'Equipment zone (6.3 kW/m²)', value: radiation.safeRadii.equipment_6_3, limit: 50, unit: 'm', compliant: true },
    { standard: 'API 521', requirement: 'Personnel continuous (1.58 kW/m²)', value: radiation.safeRadii.personnel_1_6, limit: 100, unit: 'm', compliant: true },
    { standard: 'DLHK', requirement: 'Community noise (55 dBA)', value: noise.safeRadii.residential_55, limit: 500, unit: 'm', compliant: true },
    { standard: 'API 521', requirement: 'Industrial noise (85 dBA)', value: noise.safeRadii.industrial_85, limit: 50, unit: 'm', compliant: true },
  ];

  return {
    exclusionZone: radiation.safeRadii.equipment_6_3,
    restrictedZone: radiation.safeRadii.escape_4_7,
    controlledZone: radiation.safeRadii.personnel_1_6,
    noiseIndustrial: noise.safeRadii.industrial_85,
    noiseCommunity: noise.safeRadii.residential_55,
    dispersionLFL: dispersion?.distanceToLFL,
    dispersionHalfLFL: dispersion?.distanceToHalfLFL,
    overallSafeRadius: Math.max(...radii.filter(r => isFinite(r) && r > 0)),
    complianceChecks,
  };
}

// ==================== Unit Conversion ====================
export const unitConversions = {
  kWm2_to_BTUhrft2: 317.1,
  m_to_ft: 3.28084,
  kg_to_lb: 2.20462,
  mps_to_fts: 3.28084,
  degC_to_degF: (c: number) => c * 9 / 5 + 32,
  barg_to_psig: 14.5038,
};

export function convertRadiation(value: number, from: 'SI' | 'Imperial'): number {
  return from === 'SI' ? value * unitConversions.kWm2_to_BTUhrft2 : value / unitConversions.kWm2_to_BTUhrft2;
}

export function convertDistance(value: number, from: 'SI' | 'Imperial'): number {
  return from === 'SI' ? value * unitConversions.m_to_ft : value / unitConversions.m_to_ft;
}

// ==================== Default Scenario ====================
export function createDefaultScenario(type: string = 'normal'): {
  id: string; name: string; type: string;
  gasComposition: CompositionEntry[];
  flowRate: number; fluidTemperature: number; fluidPressure: number;
  windSpeed: number; windDirection: number; ambientTemp: number; relativeHumidity: number;
  stackHeight: number; tipDiameter: number; machNumber: number;
  stabilityClass: string; fractionRadiated: number; combustionEfficiency: number;
} {
  return {
    id: crypto.randomUUID(),
    name: type === 'normal' ? 'Normal Operation' : type === 'emergency_blowdown' ? 'Emergency Blowdown' : type === 'flameout' ? 'Flameout' : 'Planned Shutdown',
    type,
    gasComposition: DEFAULT_TEMPLATES[0].entries.map(e => ({ ...e })),
    flowRate: 10000,
    fluidTemperature: 40,
    fluidPressure: 1,
    windSpeed: 5,
    windDirection: 0,
    ambientTemp: 30,
    relativeHumidity: 80,
    stackHeight: 30,
    tipDiameter: 0,
    machNumber: 0.3,
    stabilityClass: 'D',
    fractionRadiated: 0.2,
    combustionEfficiency: 0.98,
  };
}

import { DEFAULT_TEMPLATES } from './constants';
