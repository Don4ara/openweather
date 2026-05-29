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

/** Center text within a fixed-width field. */
function center(s: string, width: number): string {
  const total = Math.max(0, width - s.length);
  const left = Math.floor(total / 2);
  return ' '.repeat(left) + s + ' '.repeat(total - left);
}

function MessageInner({message, lang}: MessageProps) {
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

        {/* Hourly strip: next 24h, every 2 hours */}
        {weather.hourly.length > 0 && (() => {
          // Round 4-hour slots (00:00, 04:00, ...) within the next 24h.
          const hours = weather.hourly.filter(h => Number(h.hourLabel) % 4 === 0).slice(0, 6);
          // Pad value to a fixed inner width before centering so every row's
          // left edge lines up (no staircase from variable-length values).
          const cell = (s: string) => center(s.padEnd(5), 8);
          return (
            <Box flexDirection="column" marginLeft={4} marginBottom={1}>
              <Text color="gray" dimColor>{t.hourly}</Text>
              <Box>
                {hours.map((h, i) => (
                  <Text key={`ht-${i}`} color="gray" dimColor>{cell(`${h.hourLabel}:00`)}</Text>
                ))}
              </Box>
              <Box>
                {hours.map((h, i) => (
                  <Text key={`hv-${i}`} color={tempColor(h.temp, weather.system)} bold>{cell(`${h.temp}°`)}</Text>
                ))}
              </Box>
              <Box>
                {hours.map((h, i) => (
                  <Text key={`hp-${i}`} color="blue" dimColor>{cell(`${h.precipitationProbability}%`)}</Text>
                ))}
              </Box>
            </Box>
          );
        })()}

        {/* 8-day forecast */}
        <Box flexDirection="column" marginLeft={4}>
          <Box>
            {/* Pad to start of precip column: label 11 + temp 4 + " / " 3 + tempMin 6 + condition 13 = 37 */}
            <Text color="gray" dimColor>{''.padEnd(37)}</Text>
            {/* Precip block is bar(8) + "xxx%  "(6) = 14 wide; wind block centered over bar(6) */}
            <Text color="blue" dimColor>{center(t.precip, 14)}</Text>
            <Text color="cyan" dimColor>{center(t.wind, 8)}</Text>
          </Box>
          <Text color="gray" dimColor>{'─'.repeat(62)}</Text>
          {weather.forecast.map((day) => (
            <Box key={day.date}>
              <Text color="gray" dimColor>{day.label.padEnd(11)}</Text>
              <Text color={tempColor(day.tempMax, weather.system)} bold>{String(day.tempMax).padStart(3)}°</Text>
              <Text color="gray"> / </Text>
              <Text color="gray" dimColor>{String(day.tempMin).padStart(3)}°  </Text>
              <Text color="gray">{day.conditionShort.padEnd(13)}</Text>
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

// Memoized: history rows are immutable, so they skip re-render when a new
// message is appended or the input/cursor ticks.
export const Message = React.memo(MessageInner);
