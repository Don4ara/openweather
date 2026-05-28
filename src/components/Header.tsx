import React from 'react';
import {Box, Text} from 'ink';

type HeaderProps = {
  title: string;
  model: string;
  debug: boolean;
};

export function Header({title, model, debug}: HeaderProps) {
  return (
    <Box
      borderStyle="round"
      borderColor="cyan"
      paddingX={2}
      paddingY={1}
      justifyContent="space-between"
    >
      <Text bold color="cyan">
        ✻ {title}
      </Text>

      <Text color="gray">
        model: {model}
        {debug ? ' · debug' : ''}
      </Text>
    </Box>
  );
}
