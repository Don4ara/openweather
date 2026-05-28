import React from 'react';
import {Box, Text} from 'ink';
import {Spinner} from './Spinner.tsx';

type WelcomeScreenProps = {
  city: string;
  loading: boolean;
  debug: boolean;
};

export function WelcomeScreen({city, loading, debug}: WelcomeScreenProps) {
  return (
    <Box
      borderStyle="round"
      borderColor="gray"
      marginTop={1}
      flexDirection="row"
    >
      {/* Left: logo + info */}
      <Box
        flexDirection="column"
        flexGrow={1}
        alignItems="center"
        justifyContent="center"
        paddingX={3}
        paddingY={1}
      >
        <Box flexDirection="column" alignItems="center">
          <Text color="yellow">  \   /  </Text>
          <Text color="yellow">   .-.   </Text>
          <Text color="yellow">― (   ) ―</Text>
          <Text color="yellow">   `-'   </Text>
          <Text color="yellow">  /   \  </Text>
        </Box>

        <Box marginTop={1}>
          <Text bold color="cyan">✻ Weather Agent</Text>
        </Box>

        <Text color="gray">
          model: open-meteo{debug ? ' · debug' : ''}
        </Text>

        <Text color="gray">{city}</Text>

        {loading && (
          <Box marginTop={1}>
            <Spinner label="Fetching weather..." />
          </Box>
        )}
      </Box>

      {/* Right: tips */}
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="gray"
        paddingX={2}
        paddingY={1}
        margin={1}
        width={32}
      >
        <Text bold>Tips for getting started</Text>
        <Box marginTop={1} marginBottom={1}>
          <Text color="gray">{'─'.repeat(24)}</Text>
        </Box>
        <Text color="gray">Type a city, press</Text>
        <Box marginBottom={1}>
          <Text color="cyan">Enter</Text>
          <Text color="gray"> to fetch weather</Text>
        </Box>
        <Text color="gray">London</Text>
        <Text color="gray">New York</Text>
        <Text color="gray">Tokyo</Text>
        <Box marginTop={1}>
          <Text color="cyan">Esc</Text>
          <Text color="gray"> / </Text>
          <Text color="cyan">Ctrl+C</Text>
          <Text color="gray"> quit</Text>
        </Box>
      </Box>
    </Box>
  );
}
