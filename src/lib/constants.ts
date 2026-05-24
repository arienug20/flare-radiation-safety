import { GasComponent, CompositionTemplate, AllowableRadiationLevel } from '@/types';

export const GAS_COMPONENTS: GasComponent[] = [
  { id: 'H2', name: 'Hydrogen', formula: 'H₂', mw: 2.016, lhv: 10.78, hhv: 12.74, lfl: 4.0, ufl: 75.0, density: 0.0899 },
  { id: 'CH4', name: 'Methane', formula: 'CH₄', mw: 16.043, lhv: 35.88, hhv: 39.82, lfl: 5.0, ufl: 15.0, density: 0.717 },
  { id: 'C2H6', name: 'Ethane', formula: 'C₂H₆', mw: 30.069, lhv: 63.73, hhv: 70.31, lfl: 3.0, ufl: 12.5, density: 1.357 },
  { id: 'C2H4', name: 'Ethylene', formula: 'C₂H₄', mw: 28.053, lhv: 59.04, hhv: 62.98, lfl: 2.7, ufl: 36.0, density: 1.260 },
  { id: 'C3H8', name: 'Propane', formula: 'C₃H₈', mw: 44.096, lhv: 93.00, hhv: 101.22, lfl: 2.1, ufl: 9.5, density: 2.004 },
  { id: 'C3H6', name: 'Propylene', formula: 'C₃H₆', mw: 42.080, lhv: 86.40, hhv: 92.05, lfl: 2.0, ufl: 11.1, density: 1.915 },
  { id: 'iC4H10', name: 'i-Butane', formula: 'i-C₄H₁₀', mw: 58.122, lhv: 121.70, hhv: 132.01, lfl: 1.8, ufl: 8.4, density: 2.668 },
  { id: 'nC4H10', name: 'n-Butane', formula: 'n-C₄H₁₀', mw: 58.122, lhv: 123.50, hhv: 133.78, lfl: 1.6, ufl: 8.4, density: 2.703 },
  { id: 'C5H12', name: 'Pentane+', formula: 'C₅+', mw: 72.150, lhv: 156.60, hhv: 169.25, lfl: 1.4, ufl: 7.8, density: 3.457 },
  { id: 'H2S', name: 'Hydrogen Sulfide', formula: 'H₂S', mw: 34.082, lhv: 23.14, hhv: 25.36, lfl: 4.3, ufl: 46.0, density: 1.539 },
  { id: 'CO2', name: 'Carbon Dioxide', formula: 'CO₂', mw: 44.010, lhv: 0, hhv: 0, lfl: 0, ufl: 0, density: 1.977 },
  { id: 'N2', name: 'Nitrogen', formula: 'N₂', mw: 28.013, lhv: 0, hhv: 0, lfl: 0, ufl: 0, density: 1.250 },
  { id: 'H2O', name: 'Water', formula: 'H₂O', mw: 18.015, lhv: 0, hhv: 0, lfl: 0, ufl: 0, density: 0.804 },
  { id: 'CO', name: 'Carbon Monoxide', formula: 'CO', mw: 28.010, lhv: 12.64, hhv: 12.64, lfl: 12.5, ufl: 74.0, density: 1.250 },
  { id: 'O2', name: 'Oxygen', formula: 'O₂', mw: 31.998, lhv: 0, hhv: 0, lfl: 0, ufl: 0, density: 1.429 },
];

export const DEFAULT_TEMPLATES: CompositionTemplate[] = [
  {
    id: 'natural-gas',
    name: 'Natural Gas',
    entries: [
      { componentId: 'CH4', molPercent: 85.0 },
      { componentId: 'C2H6', molPercent: 7.5 },
      { componentId: 'C3H8', molPercent: 3.0 },
      { componentId: 'iC4H10', molPercent: 0.5 },
      { componentId: 'nC4H10', molPercent: 0.5 },
      { componentId: 'N2', molPercent: 2.0 },
      { componentId: 'CO2', molPercent: 1.5 },
    ],
  },
  {
    id: 'refinery-flare-gas',
    name: 'Refinery Flare Gas',
    entries: [
      { componentId: 'H2', molPercent: 25.0 },
      { componentId: 'CH4', molPercent: 30.0 },
      { componentId: 'C2H6', molPercent: 15.0 },
      { componentId: 'C2H4', molPercent: 10.0 },
      { componentId: 'C3H8', molPercent: 5.0 },
      { componentId: 'C3H6', molPercent: 8.0 },
      { componentId: 'nC4H10', molPercent: 3.0 },
      { componentId: 'H2S', molPercent: 2.0 },
      { componentId: 'N2', molPercent: 2.0 },
    ],
  },
];

export const ALLOWABLE_RADIATION_LEVELS: AllowableRadiationLevel[] = [
  { label: 'Equipment (continuous)', value: 6.3, btuHrFt2: 2000, description: 'Equipment that can be continuously exposed' },
  { label: 'Escape route (30s)', value: 4.73, btuHrFt2: 1500, description: 'Personnel escape route, 30 sec exposure' },
  { label: 'Emergency action (1-2min)', value: 6.3, btuHrFt2: 2000, description: 'Personnel emergency action, 1-2 min exposure' },
  { label: 'Continuous (with clothing)', value: 1.58, btuHrFt2: 500, description: 'Personnel continuous exposure with appropriate clothing' },
  { label: 'Design (no personnel)', value: 9.46, btuHrFt2: 3000, description: 'Locations where personnel are not expected' },
  { label: 'Property boundary', value: 3.16, btuHrFt2: 1000, description: 'Property boundary limit' },
];

// Fraction of heat radiated (τ) - API 521
export const FRACTION_RADIATED_TABLE = [
  { description: 'Hydrogen', min: 0.15, max: 0.15 },
  { description: 'Methane / Natural Gas', min: 0.15, max: 0.20 },
  { description: 'Propane', min: 0.20, max: 0.25 },
  { description: 'Butane', min: 0.20, max: 0.25 },
  { description: 'Ethylene', min: 0.25, max: 0.30 },
  { description: 'Propylene', min: 0.25, max: 0.30 },
  { description: 'Heavy hydrocarbons (C6+)', min: 0.30, max: 0.40 },
];

// Pasquill-Gifford stability class descriptions
export const STABILITY_CLASSES = [
  { class: 'A', description: 'Very unstable (strong sun, light wind)', color: '#ff0000' },
  { class: 'B', description: 'Moderately unstable', color: '#ff6600' },
  { class: 'C', description: 'Slightly unstable', color: '#ffcc00' },
  { class: 'D', description: 'Neutral (overcast, moderate wind)', color: '#00cc00' },
  { class: 'E', description: 'Slightly stable', color: '#0066ff' },
  { class: 'F', description: 'Very stable (clear night, light wind)', color: '#6600cc' },
];
