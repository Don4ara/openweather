import {translations, type Lang} from '../i18n/index.ts';

export type WeatherIconType =
  | 'sun'
  | 'cloud'
  | 'partly-cloudy'
  | 'rain'
  | 'storm'
  | 'snow'
  | 'mist';

export type DayForecast = {
  date: string;
  label: string;
  condition: string;
  icon: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  windMax: number;
  sunrise: string;
  sunset: string;
};

export type WeatherResult = {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  condition: string;
  wind: number;
  icon: string;
  iconType: WeatherIconType;
  forecast: DayForecast[];
};

export function wmoToCondition(code: number, lang: Lang = 'ru'): {condition: string; icon: string; iconType: WeatherIconType} {
  const c = translations[lang].conditions;
  if (code === 0) return {condition: c.clear, icon: '☀', iconType: 'sun'};
  if (code <= 3) return {condition: c.partlyCloudy, icon: '⛅', iconType: 'partly-cloudy'};
  if (code <= 48) return {condition: c.fog, icon: '≡', iconType: 'mist'};
  if (code <= 67) return {condition: c.rain, icon: '~', iconType: 'rain'};
  if (code <= 77) return {condition: c.snow, icon: '*', iconType: 'snow'};
  if (code <= 82) return {condition: c.showers, icon: '~', iconType: 'rain'};
  if (code <= 86) return {condition: c.snowfall, icon: '*', iconType: 'snow'};
  return {condition: c.storm, icon: '!', iconType: 'storm'};
}

function dayLabel(dateStr: string, index: number, lang: Lang): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const t = translations[lang];
  if (index === 0) return `${t.today} ${day}`;
  if (index === 1) return `${t.tomorrow} ${day}`;
  const weekday = d.toLocaleDateString(lang === 'ru' ? 'ru' : 'en', {weekday: 'short'}).replace('.', '');
  return `${weekday} ${day}`;
}

async function geocode(city: string, lang: Lang): Promise<{name: string; country: string; latitude: number; longitude: number}> {
  const r1 = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=${lang}&format=json`
  );
  if (r1.ok) {
    const d = await r1.json() as {results?: Array<{name: string; country_code: string; latitude: number; longitude: number}>};
    if (d.results?.length) {
      const g = d.results[0];
      return {name: g.name, country: g.country_code.toUpperCase(), latitude: g.latitude, longitude: g.longitude};
    }
  }

  // Fallback: Nominatim
  const r2 = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&addressdetails=1&accept-language=${lang}`,
    {headers: {'User-Agent': 'openweather-cli/0.1.0'}}
  );
  if (!r2.ok) throw new Error(lang === 'ru' ? `Город не найден: "${city}"` : `City not found: "${city}"`);
  const d2 = await r2.json() as Array<{lat: string; lon: string; display_name: string; address?: Record<string, string>}>;
  if (!d2.length) throw new Error(lang === 'ru' ? `Город не найден: "${city}"` : `City not found: "${city}"`);

  const g = d2[0];
  const name = g.address?.city ?? g.address?.town ?? g.address?.village ?? g.display_name.split(',')[0];
  const country = (g.address?.country_code ?? '').toUpperCase();
  return {name, country, latitude: parseFloat(g.lat), longitude: parseFloat(g.lon)};
}

export async function getWeather(city: string, lang: Lang = 'ru'): Promise<WeatherResult> {
  const {name, country, latitude, longitude} = await geocode(city, lang);

  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset` +
    `&temperature_unit=celsius&wind_speed_unit=ms&forecast_days=8&timezone=auto`
  );
  if (!weatherRes.ok) throw new Error(`Weather fetch failed: ${weatherRes.status}`);

  const data = await weatherRes.json() as {
    current: {
      temperature_2m: number;
      apparent_temperature: number;
      relative_humidity_2m: number;
      surface_pressure: number;
      wind_speed_10m: number;
      weather_code: number;
    };
    daily: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      weather_code: number[];
      precipitation_probability_max: number[];
      wind_speed_10m_max: number[];
      sunrise: string[];
      sunset: string[];
    };
  };

  const {temperature_2m, apparent_temperature, relative_humidity_2m, surface_pressure, wind_speed_10m, weather_code} = data.current;
  const {condition, icon, iconType} = wmoToCondition(weather_code, lang);

  const forecast: DayForecast[] = data.daily.time.map((date, i) => {
    const {condition: fc, icon: fi} = wmoToCondition(data.daily.weather_code[i], lang);
    return {
      date,
      label: dayLabel(date, i, lang),
      condition: fc,
      icon: fi,
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      precipitationProbability: Math.round(data.daily.precipitation_probability_max[i] ?? 0),
      windMax: Math.round(data.daily.wind_speed_10m_max[i] * 10) / 10,
      sunrise: (data.daily.sunrise[i] ?? '').slice(11, 16),
      sunset: (data.daily.sunset[i] ?? '').slice(11, 16),
    };
  });

  return {
    city: name,
    country,
    temperature: Math.round(temperature_2m),
    feelsLike: Math.round(apparent_temperature),
    humidity: Math.round(relative_humidity_2m),
    pressure: Math.round(surface_pressure),
    condition,
    wind: Math.round(wind_speed_10m * 10) / 10,
    icon,
    iconType,
    forecast,
  };
}
