import React from 'react';
import {Box, Text} from 'ink';
import {WeatherIcon} from './WeatherIcon.tsx';
import {translations, type Lang} from '../i18n/index.ts';
import {iconColor} from '../services/weather.ts';
import {toCelsius, type UnitSystem} from '../services/units.ts';
import type {ChatMessage} from '../app/App.tsx';

type MessageProps = {
  message: ChatMessage;
  lang: Lang;
};

function tempColor(temp: number, system: UnitSystem): string {
  const c = toCelsius(temp, system);
  if (c >= 35) return 'red';
  if (c >= 25) return 'yellow';
  if (c >= 10) return 'white';
  if (c >= 0) return 'cyan';
  return 'blue';
}

const PARTIALS = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉'];

/** Render a proportional bar of given character width from value/max. */
function bar(value: number, max: number, width: number): string {
  const ratio = Math.max(0, Math.min(1, value / max));
  const units = ratio * width;
  let full = Math.floor(units);
  let rem = Math.round((units - full) * 8);
  if (rem === 8) {
    full += 1;
    rem = 0;
  }
  const head = rem > 0 && full < width ? PARTIALS[rem] : '';
  const pad = Math.max(0, width - full - (head ? 1 : 0));
  return '█'.repeat(full) + head + ' '.repeat(pad);
}

export function Message({message, lang}: MessageProps) {
  const t = translations[lang];

  if (message.role === 'user') {
    return (
      <Box marginBottom={1}>
        <Text color="green" bold>{t.you} </Text>
        <Text color="gray">&gt; </Text>
        <Text>{message.text}</Text>
      </Box>
    );
  }

  if (message.role === 'error') {
    return (
      <Box marginBottom={1}>
        <Text color="red">✕ </Text>
        <Text color="red" dimColor>{message.text}</Text>
      </Box>
    );
  }

  if (message.role === 'tool') {
    return (
      <Box marginBottom={1}>
        <Text color="blue">ℹ </Text>
        <Text color="gray">{message.text}</Text>
      </Box>
    );
  }

  if (message.role === 'forecast') {
    const {weather} = message;
    const accent = iconColor(weather.iconType);
    const windMaxScale = weather.system === 'imperial' ? 45 : 20;

    return (
      <Box flexDirection="column" marginBottom={1}>
        <Box marginBottom={1}>
          <Text color="cyan" bold>{t.agent} </Text>
          <Text color="gray">{t.forecast} · </Text>
          <Text color={accent} bold>{weather.city}, {weather.country}</Text>
        </Box>

        <Box marginLeft={2} marginBottom={1}>
          {/* Icon */}
          <Box marginRight={3}>
            <WeatherIcon type={weather.iconType} night={!weather.isDay} />
          </Box>

          {/* Current conditions */}
          <Box flexDirection="column">
            <Text bold color="white">
              {weather.city}
              <Text color="gray" dimColor>  {weather.country}</Text>
            </Text>
            <Box>
              <Text color={tempColor(weather.temperature, weather.system)} bold>{weather.temperature}{weather.tempLabel}</Text>
              <Text color={accent}>  {weather.condition}</Text>
              {weather.forecast[0] && (
                <>
                  <Text color="gray" dimColor>  (</Text>
                  <Text color={tempColor(weather.forecast[0].tempMax, weather.system)} bold>{weather.forecast[0].tempMax}°</Text>
                  <Text color="gray" dimColor> / </Text>
                  <Text color={tempColor(weather.forecast[0].tempMin, weather.system)}>{weather.forecast[0].tempMin}°</Text>
                  <Text color="gray" dimColor>)</Text>
                </>
              )}
            </Box>
            <Text color="gray" dimColor>{t.feelsLike} {weather.feelsLike}{weather.tempLabel}</Text>
            <Text color="gray" dimColor>💧 {weather.humidity}%  ↑ {weather.wind} {weather.windLabel}  {weather.pressure} {t.pressure}</Text>
            {weather.forecast[0] && (
              <Text color="yellow" dimColor>🌅 {weather.forecast[0].sunrise}  🌇 {weather.forecast[0].sunset}</Text>
            )}
          </Box>
        </Box>

        {/* 8-day forecast */}
        <Box flexDirection="column" marginLeft={4}>
          <Box>
            <Text color="gray" dimColor>{''.padEnd(31)}</Text>
            <Text color="blue" dimColor>{t.precip.padEnd(12)}</Text>
            <Text color="cyan" dimColor>{t.wind}</Text>
          </Box>
          <Text color="gray" dimColor>{'─'.repeat(62)}</Text>
          {weather.forecast.map((day) => (
            <Box key={day.date}>
              <Text color="gray" dimColor>{day.label.padEnd(11)}</Text>
              <Text color={tempColor(day.tempMax, weather.system)} bold>{String(day.tempMax).padStart(3)}°</Text>
              <Text color="gray"> / </Text>
              <Text color="gray" dimColor>{String(day.tempMin).padStart(3)}°  </Text>
              <Text color="gray">{day.condition.slice(0, 12).padEnd(13)}</Text>
              <Text color="blue">{bar(day.precipitationProbability, 100, 8)}</Text>
              <Text color="blue" dimColor>{String(day.precipitationProbability).padStart(3)}%  </Text>
              <Text color="cyan">{bar(day.windMax, windMaxScale, 6)}</Text>
              <Text color="cyan" dimColor> {day.windMax}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return null;
}
