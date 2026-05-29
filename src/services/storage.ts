import {homedir} from 'node:os';
import {join} from 'node:path';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import type {Lang} from '../i18n/index.ts';
import type {UnitSystem} from './units.ts';

export type AppConfig = {
  favorites: string[];
  lang: Lang;
  units: UnitSystem;
};

const DIR = join(homedir(), '.openweather');
const FILE = join(DIR, 'config.json');

const DEFAULT_CONFIG: AppConfig = {
  favorites: [],
  lang: 'ru',
  units: 'metric',
};

export function loadConfig(): AppConfig {
  try {
    const raw = readFileSync(FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      lang: parsed.lang === 'en' ? 'en' : 'ru',
      units: parsed.units === 'imperial' ? 'imperial' : 'metric',
    };
  } catch {
    return {...DEFAULT_CONFIG};
  }
}

export function saveConfig(config: AppConfig): void {
  try {
    if (!existsSync(DIR)) mkdirSync(DIR, {recursive: true});
    writeFileSync(FILE, JSON.stringify(config, null, 2), 'utf8');
  } catch {
    // best-effort: ignore write failures (read-only fs, etc.)
  }
}
