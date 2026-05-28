import React from 'react';
import {Box, Text} from 'ink';
import {WeatherIcon} from './WeatherIcon.tsx';
import {translations, type Lang} from '../i18n/index.ts';
import type {ChatMessage} from '../app/App.tsx';

type MessageProps = {
  message: ChatMessage;
  lang: Lang;
};

function tempColor(temp: number): string {
  if (temp >= 35) return 'red';
  if (temp >= 25) return 'yellow';
  if (temp >= 10) return 'white';
  if (temp >= 0) return 'cyan';
  return 'blue';
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
        <Text color="gray" dimColor>{message.text}</Text>
      </Box>
    );
  }

  if (message.role === 'forecast') {
    const {weather} = message;
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Box marginBottom={1}>
          <Text color="cyan" bold>{t.agent} </Text>
          <Text color="gray">{t.forecast} · {weather.city}, {weather.country}</Text>
        </Box>

        <Box marginLeft={2} marginBottom={1}>
          {/* Icon */}
          <Box marginRight={3}>
            <WeatherIcon type={weather.iconType} />
          </Box>

          {/* Current conditions */}
          <Box flexDirection="column">
            <Text bold color="white">
              {weather.city}
              <Text color="gray" dimColor>  {weather.country}</Text>
            </Text>
            <Box>
              <Text color={tempColor(weather.temperature)} bold>{weather.temperature}°C</Text>
              <Text color="gray">  {weather.condition}</Text>
              {weather.forecast[0] && (
                <>
                  <Text color="gray" dimColor>  (</Text>
                  <Text color={tempColor(weather.forecast[0].tempMax)} bold>{weather.forecast[0].tempMax}°</Text>
                  <Text color="gray" dimColor> / </Text>
                  <Text color={tempColor(weather.forecast[0].tempMin)}>{weather.forecast[0].tempMin}°</Text>
                  <Text color="gray" dimColor>)</Text>
                </>
              )}
            </Box>
            <Text color="gray" dimColor>{t.feelsLike} {weather.feelsLike}°C</Text>
            <Text color="gray" dimColor>💧 {weather.humidity}%  ↑ {weather.wind} m/s  {weather.pressure} {t.pressure}</Text>
            {weather.forecast[0] && (
              <Text color="yellow" dimColor>🌅 {weather.forecast[0].sunrise}  🌇 {weather.forecast[0].sunset}</Text>
            )}
          </Box>
        </Box>

        {/* 8-day forecast */}
        <Box flexDirection="column" marginLeft={4}>
          <Text color="gray" dimColor>{'─'.repeat(56)}</Text>
          {weather.forecast.map((day) => (
            <Box key={day.date}>
              <Text color="gray" dimColor>{day.label.padEnd(12)}</Text>
              <Text color={tempColor(day.tempMax)} bold>{String(day.tempMax).padStart(3)}°</Text>
              <Text color="gray"> / </Text>
              <Text color="gray" dimColor>{String(day.tempMin).padStart(3)}°  </Text>
              <Text color="gray">{day.condition.padEnd(24)}</Text>
              <Text color="blue" dimColor>💧{String(day.precipitationProbability).padStart(3)}%  </Text>
              <Text color="gray" dimColor>↑{day.windMax} m/s</Text>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return null;
}
