export type UnitSystem = 'metric' | 'imperial';

export const unitConfig = {
  metric: {
    temperatureUnit: 'celsius',
    windSpeedUnit: 'ms',
    tempLabel: '°C',
    windLabel: 'm/s',
  },
  imperial: {
    temperatureUnit: 'fahrenheit',
    windSpeedUnit: 'mph',
    tempLabel: '°F',
    windLabel: 'mph',
  },
} as const;

export function nextSystem(system: UnitSystem): UnitSystem {
  return system === 'metric' ? 'imperial' : 'metric';
}

/** Normalize a temperature to Celsius for color thresholds. */
export function toCelsius(temp: number, system: UnitSystem): number {
  return system === 'imperial' ? (temp - 32) * 5 / 9 : temp;
}
