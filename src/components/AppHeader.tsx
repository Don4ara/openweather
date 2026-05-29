import React from 'react';
import {Box, Text} from 'ink';
import {translations, type Lang} from '../i18n/index.ts';

type AppHeaderProps = {
  debug: boolean;
  lang: Lang;
  accent: string;
  units: string;
};

export function AppHeader({debug, lang, accent, units}: AppHeaderProps) {
  const t = translations[lang];
  return (
    <Box borderStyle="round" borderColor={accent} paddingX={3} paddingY={1} justifyContent="space-between">
      <Text bold color={accent}>✻ openweather</Text>
      <Text color="gray" dimColor>
        {t.tagline} · {units} · open-meteo · v0.1.0{debug ? ' · debug' : ''}
      </Text>
    </Box>
  );
}
