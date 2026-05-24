// ==================== Gas Composition ====================
export interface GasComponent {
  id: string;
  name: string;
  formula: string;
  mw: number; // g/mol
  lhv: number; // MJ/Nm³
  hhv: number; // MJ/Nm³
  lfl: number; // vol%
  ufl: number; // vol%
  density: number; // kg/Nm³ at 0°C, 1 atm
}

export interface CompositionEntry {
  componentId: string;
  molPercent: number;
}

export interface CompositionTemplate {
  id: string;
  name: string;
  entries: CompositionEntry[];
}

// ==================== Project ====================
export interface ReceptorPoint {
  id: string;
  name: string;
  x: number; // m from flare
  y: number; // m from flare
  elevation: number; // m
  category: 'personnel' | 'equipment' | 'boundary' | 'community';
  customAllowableRadiation?: number; // kW/m²
  customAllowableNoise?: number; // dBA
}

export type ScenarioType = 'normal' | 'emergency_blowdown' | 'flameout' | 'planned_shutdown';

export interface Scenario {
  id: string;
  name: string;
  type: ScenarioType;
  gasComposition: CompositionEntry[];
  flowRate: number; // kg/hr
  fluidTemperature: number; // °C
  fluidPressure: number; // barg
  windSpeed: number; // m/s
  windDirection: number; // degrees
  ambientTemp: number; // °C
  relativeHumidity: number; // %
  stackHeight: number; // m
  tipDiameter: number; // m (0 = auto)
  machNumber: number;
  stabilityClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  fractionRadiated: number;
  combustionEfficiency: number; // fraction
  results?: ScenarioResults;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  client: string;
  createdAt: string;
  updatedAt: string;
  units: 'SI' | 'Imperial';
  scenarios: Scenario[];
  receptorPoints: ReceptorPoint[];
  activeScenarioId: string;
}

// ==================== Calculation Results ====================
export interface RadiationResult {
  distances: number[]; // m
  intensities: number[]; // kW/m²
  flameLength: number; // m
  flameTilt: number; // degrees
  safeRadii: {
    equipment_6_3: number; // m
    escape_4_7: number;
    personnel_1_6: number;
    boundary_3_2: number;
    design_9_5: number;
  };
  tipDiameter: number; // m (calculated)
  gasVelocity: number; // m/s
  heatRelease: number; // kW
}

export interface NoiseResult {
  distances: number[];
  splValues: number[]; // dBA
  sourceSPL: number; // dBA
  safeRadii: {
    residential_55: number;
    commercial_65: number;
    industrial_85: number;
    boundary_70: number;
  };
}

export interface DispersionResult {
  distances: number[];
  centerlineConcentrations: number[]; // mg/m³ or ppm
  distanceToLFL: number; // m
  distanceToHalfLFL: number;
  distanceToIDLH: number;
  lflConcentration: number; // mg/m³
}

export interface ScenarioResults {
  radiation: RadiationResult;
  noise: NoiseResult;
  dispersion?: DispersionResult;
  safeRadiusSummary: SafeRadiusSummary;
}

// ==================== Safe Radius ====================
export interface SafeRadiusSummary {
  exclusionZone: number; // thermal > 6.3 kW/m²
  restrictedZone: number; // thermal > 4.7 kW/m²
  controlledZone: number; // thermal > 1.6 kW/m²
  noiseIndustrial: number; // > 85 dBA
  noiseCommunity: number; // > 55 dBA
  dispersionLFL?: number;
  dispersionHalfLFL?: number;
  overallSafeRadius: number;
  complianceChecks: ComplianceCheck[];
}

export interface ComplianceCheck {
  standard: string;
  requirement: string;
  value: number;
  limit: number;
  unit: string;
  compliant: boolean;
}

// ==================== Allowable Levels ====================
export interface AllowableRadiationLevel {
  label: string;
  value: number; // kW/m²
  btuHrFt2: number;
  description: string;
}

// ==================== UI State ====================
export interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  activeTab: string;
  units: 'SI' | 'Imperial';
}
