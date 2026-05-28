import React from 'react';
import {Box, Text} from 'ink';
import {WeatherIcon} from './WeatherIcon.tsx';
import type {WeatherResult} from '../services/weather.ts';

type WeatherCardProps = {
  weather: WeatherResult;
};

export function WeatherCard({weather}: WeatherCardProps) {
  return (
    <Box marginTop={1} marginLeft={2}>
      <Box marginRight={2}>
        <WeatherIcon type={weather.iconType} />
      </Box>

      <Box flexDirection="column" justifyContent="center">
        <Text color="cyan" bold>{weather.city}</Text>
        <Text color="yellow" bold>{weather.temperature}°C</Text>
        <Text>{weather.condition}</Text>
        <Text color="gray">Wind: {weather.wind} m/s</Text>
      </Box>
    </Box>
  );
}
