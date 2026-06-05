export const UNIT_SYSTEMS = {
  SI: 'si',
  IMPERIAL: 'imperial',
}

export const CONVERSIONS = {
  mmToInch: (mm) => mm / 25.4,
  inchToMm: (inch) => inch * 25.4,

  mToFt: (m) => m * 3.28084,
  ftToM: (ft) => ft / 3.28084,

  mpaToPsi: (mpa) => mpa * 145.038,
  psiToMpa: (psi) => psi / 145.038,

  knToKip: (kn) => kn * 0.224809,
  kipToKn: (kip) => kip / 0.224809,
}

export function getUnitLabel(unitSystem, unitType) {
  const units = {
    si: {
      length: 'm',
      smallLength: 'mm',
      force: 'kN',
      stress: 'MPa',
    },
    imperial: {
      length: 'ft',
      smallLength: 'in',
      force: 'kip',
      stress: 'psi',
    },
  }

  return units[unitSystem]?.[unitType] || ''
}
