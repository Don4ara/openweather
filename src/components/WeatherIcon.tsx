import React from 'react';
import {Box, Text} from 'ink';
import type {WeatherIconType} from '../services/weather.ts';

type WeatherIconProps = {
  type: WeatherIconType;
};

export function WeatherIcon({type}: WeatherIconProps) {
  if (type === 'sun') {
    return (
      <Box flexDirection="column">
        <Text color="yellow">   \   /   </Text>
        <Text color="yellow">    .-.    </Text>
        <Text color="yellow"> ― (   ) ― </Text>
        <Text color="yellow">    `-'    </Text>
        <Text color="yellow">   /   \   </Text>
      </Box>
    );
  }

  if (type === 'cloud') {
    return (
      <Box flexDirection="column">
        <Text color="gray">             </Text>
        <Text color="gray">     .--.    </Text>
        <Text color="gray">  .-(    ).  </Text>
        <Text color="gray"> (___.__)__) </Text>
      </Box>
    );
  }

  if (type === 'partly-cloudy') {
    return (
      <Box flexDirection="column">
        <Text color="yellow">   \  / </Text>
        <Text>
          <Text color="yellow"> _ /"".</Text>
          <Text color="gray">-.  </Text>
        </Text>
        <Text>
          <Text color="yellow">   \_</Text>
          <Text color="gray">(   ).</Text>
        </Text>
        <Text color="gray">   (___.__)__)</Text>
      </Box>
    );
  }

  if (type === 'rain') {
    return (
      <Box flexDirection="column">
        <Text color="gray">     .--.    </Text>
        <Text color="gray">  .-(    ).  </Text>
        <Text color="gray"> (___.__)__) </Text>
        <Text color="blue">  ʻ ʻ ʻ ʻ   </Text>
        <Text color="blue"> ʻ ʻ ʻ ʻ    </Text>
      </Box>
    );
  }

  if (type === 'storm') {
    return (
      <Box flexDirection="column">
        <Text color="gray">     .--.    </Text>
        <Text color="gray">  .-(    ).  </Text>
        <Text color="gray"> (___.__)__) </Text>
        <Text color="yellow">    ⚡ ⚡    </Text>
        <Text color="blue">   ʻ ʻ ʻ    </Text>
      </Box>
    );
  }

  if (type === 'snow') {
    return (
      <Box flexDirection="column">
        <Text color="gray">     .--.    </Text>
        <Text color="gray">  .-(    ).  </Text>
        <Text color="gray"> (___.__)__) </Text>
        <Text color="cyan">   *  *  *  </Text>
        <Text color="cyan"> *  *  *    </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text color="gray"> _ - _ - _ </Text>
      <Text color="gray">  _ - _ -  </Text>
      <Text color="gray"> _ - _ - _ </Text>
    </Box>
  );
}
