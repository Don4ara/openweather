import React from 'react';
import {Box, Text} from 'ink';
import type {WeatherIconType} from '../services/weather.ts';

type WeatherIconProps = {
  type: WeatherIconType;
  night?: boolean;
};

// All icons are pure ASCII (. - / \ | ( ) _ * ' " ~) so they render
// identically in any terminal font — no exotic unicode glyphs.
export function WeatherIcon({type, night = false}: WeatherIconProps) {
  if (type === 'sun') {
    // Clear sky: sun by day, crescent moon by night.
    if (night) {
      return (
        <Box flexDirection="column">
          <Text color="gray">    .--.     </Text>
          <Text color="whiteBright">   /    )    </Text>
          <Text color="whiteBright">  (    (     </Text>
          <Text color="whiteBright">   \    )    </Text>
          <Text color="gray">    `--'     </Text>
        </Box>
      );
    }
    return (
      <Box flexDirection="column">
        <Text color="yellowBright">    \   /    </Text>
        <Text color="yellowBright">     .-.     </Text>
        <Text color="yellowBright">  - (   ) -  </Text>
        <Text color="yellowBright">     `-'     </Text>
        <Text color="yellowBright">    /   \    </Text>
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
    // Sun (or moon) peeking out behind a cloud.
    return (
      <Box flexDirection="column">
        <Text color={night ? 'gray' : 'yellowBright'}>{night ? '   .--.      ' : '   \\  /      '}</Text>
        <Text>
          <Text color={night ? 'whiteBright' : 'yellowBright'}>{night ? '  (    )  .--.' : ' _ /"" .--.   '}</Text>
        </Text>
        <Text>
          <Text color={night ? 'gray' : 'yellowBright'}>{night ? "   `--' " : '   \\_  '}</Text>
          <Text color="white">{night ? '(    ).' : '(    ). '}</Text>
        </Text>
        <Text color="gray">  (___.__)__) </Text>
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
        <Text color="blueBright">  ' ' ' '    </Text>
        <Text color="blue"> ' ' ' '     </Text>
      </Box>
    );
  }

  if (type === 'storm') {
    return (
      <Box flexDirection="column">
        <Text color="whiteBright">     .--.    </Text>
        <Text color="white">  .-(    ).  </Text>
        <Text color="gray"> (___.__)__) </Text>
        <Text color="yellowBright">   /_ /_     </Text>
        <Text color="blue">  '   '      </Text>
      </Box>
    );
  }

  if (type === 'snow') {
    return (
      <Box flexDirection="column">
        <Text color="whiteBright">     .--.    </Text>
        <Text color="white">  .-(    ).  </Text>
        <Text color="gray"> (___.__)__) </Text>
        <Text color="cyanBright">   *  *  *   </Text>
        <Text color="cyan"> *  *  *     </Text>
      </Box>
    );
  }

  // mist / fog
  return (
    <Box flexDirection="column">
      <Text color="gray">             </Text>
      <Text color="gray"> ~ ~ ~ ~ ~   </Text>
      <Text color="whiteBright">  ~ ~ ~ ~ ~  </Text>
      <Text color="gray"> ~ ~ ~ ~ ~   </Text>
      <Text color="gray">             </Text>
    </Box>
  );
}
