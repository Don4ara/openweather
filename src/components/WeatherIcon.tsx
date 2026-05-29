import React from 'react';
import {Box, Text} from 'ink';
import type {WeatherIconType} from '../services/weather.ts';

type WeatherIconProps = {
  type: WeatherIconType;
  night?: boolean;
};

export function WeatherIcon({type, night = false}: WeatherIconProps) {
  if (type === 'sun') {
    if (night) {
      return (
        <Box flexDirection="column">
          <Text color="gray">    .--.    </Text>
          <Text color="yellowBright">   /    \   </Text>
          <Text color="yellowBright">  |      )  </Text>
          <Text color="yellowBright">   \    /   </Text>
          <Text color="gray">    `--'    </Text>
        </Box>
      );
    }
    return (
      <Box flexDirection="column">
        <Text color="yellowBright">  \   |   /  </Text>
        <Text color="yellowBright">    .---.    </Text>
        <Text color="yellowBright">— (  ☼  ) —  </Text>
        <Text color="yellowBright">    `---'    </Text>
        <Text color="yellowBright">  /   |   \  </Text>
      </Box>
    );
  }

  if (type === 'cloud') {
    return (
      <Box flexDirection="column">
        <Text color="whiteBright">             </Text>
        <Text color="whiteBright">     .--.    </Text>
        <Text color="white">  .-(    ).  </Text>
        <Text color="gray"> (___.__)__) </Text>
        <Text color="gray">             </Text>
      </Box>
    );
  }

  if (type === 'partly-cloudy') {
    return (
      <Box flexDirection="column">
        <Text color={night ? 'gray' : 'yellowBright'}>{night ? '  .--. ' : '  \\  /  '}</Text>
        <Text>
          <Text color={night ? 'yellow' : 'yellowBright'}>{night ? ' (   ) ' : ' _ /""'}</Text>
          <Text color="white">{night ? '.--.' : '.-.  '}</Text>
        </Text>
        <Text>
          <Text color={night ? 'gray' : 'yellowBright'}>{night ? "  `-'" : '   \\_'}</Text>
          <Text color="white">(    ).</Text>
        </Text>
        <Text color="gray">   (___.__)__)</Text>
        <Text color="gray">             </Text>
      </Box>
    );
  }

  if (type === 'rain') {
    return (
      <Box flexDirection="column">
        <Text color="whiteBright">     .--.    </Text>
        <Text color="white">  .-(    ).  </Text>
        <Text color="gray"> (___.__)__) </Text>
        <Text color="blueBright">  ‚ʻ‚ʻ‚ʻ‚ʻ  </Text>
        <Text color="blue"> ‚ʻ‚ʻ‚ʻ‚ʻ   </Text>
      </Box>
    );
  }

  if (type === 'storm') {
    return (
      <Box flexDirection="column">
        <Text color="whiteBright">     .--.    </Text>
        <Text color="white">  .-(    ).  </Text>
        <Text color="gray"> (___.__)__) </Text>
        <Text color="yellowBright">   ⚡‚ʻ⚡‚ʻ   </Text>
        <Text color="blue">  ‚ʻ‚ʻ‚ʻ‚   </Text>
      </Box>
    );
  }

  if (type === 'snow') {
    return (
      <Box flexDirection="column">
        <Text color="whiteBright">     .--.    </Text>
        <Text color="white">  .-(    ).  </Text>
        <Text color="gray"> (___.__)__) </Text>
        <Text color="cyanBright">   ❄  ❄  ❄  </Text>
        <Text color="cyan"> ❄  ❄  ❄    </Text>
      </Box>
    );
  }

  // mist / fog
  return (
    <Box flexDirection="column">
      <Text color="gray">             </Text>
      <Text color="gray"> ≡ ≡ ≡ ≡ ≡   </Text>
      <Text color="whiteBright">  ≡ ≡ ≡ ≡ ≡  </Text>
      <Text color="gray"> ≡ ≡ ≡ ≡ ≡   </Text>
      <Text color="gray">             </Text>
    </Box>
  );
}
