import React from 'react';
import {Box, Text} from 'ink';
import {translations, type Lang} from '../i18n/index.ts';

type StatusBarProps = {
  lang: Lang;
};

export function StatusBar({lang}: StatusBarProps) {
  const t = translations[lang];
  return (
    <Box justifyContent="space-between" paddingX={1}>
      <Text color="gray">{t.submit}</Text>
      <Text color="gray">{t.quit}</Text>
    </Box>
  );
}
