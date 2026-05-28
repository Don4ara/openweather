import React from 'react';
import {Box, Text} from 'ink';
import {translations, type Lang} from '../i18n/index.ts';

type AppHeaderProps = {
  debug: boolean;
  lang: Lang;
};

export function AppHeader({debug, lang}: AppHeaderProps) {
  const t = translations[lang];
  return (
    <Box borderStyle="round" borderColor="gray" paddingX={3} paddingY={1} justifyContent="space-between">
      <Text bold color="cyan">✻ openweather</Text>
      <Text color="gray" dimColor>
        {t.tagline} · open-meteo · v0.1.0{debug ? ' · debug' : ''}
      </Text>
    </Box>
  );
}
