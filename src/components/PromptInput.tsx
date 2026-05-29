import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import type {Lang} from '../i18n/index.ts';

export type Command = {
  name: string;
  description: string;
};

type PromptInputProps = {
  onSubmit: (value: string) => void;
  onCommand: (name: string) => void;
  commands: Command[];
  lang: Lang;
};

export function PromptInput({onSubmit, onCommand, commands, lang}: PromptInputProps) {
  const [value, setValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isCommandMode = value.startsWith('/');
  const filtered = isCommandMode
    ? commands.filter(c => `/${c.name}`.startsWith(value.toLowerCase()))
    : [];
  const clampedIndex = Math.min(selectedIndex, Math.max(0, filtered.length - 1));

  useInput((input, key) => {
    if (isCommandMode && filtered.length > 0) {
      if (key.upArrow) {
        setSelectedIndex(i => Math.max(0, i - 1));
        return;
      }
      if (key.downArrow) {
        setSelectedIndex(i => Math.min(filtered.length - 1, i + 1));
        return;
      }
      if (key.tab) {
        setValue(`/${filtered[clampedIndex].name}`);
        return;
      }
    }

    if (key.return) {
      if (isCommandMode && filtered.length > 0) {
        onCommand(filtered[clampedIndex].name);
        setValue('');
        setSelectedIndex(0);
      } else {
        onSubmit(value);
        setValue('');
        setSelectedIndex(0);
      }
      return;
    }

    if (key.backspace || key.delete) {
      setValue(current => current.slice(0, -1));
      return;
    }

    if (!key.ctrl && !key.meta && input) {
      setValue(current => current + input);
      setSelectedIndex(0);
    }
  });

  const placeholder = lang === 'ru' ? 'Введите город...' : 'Enter city...';

  return (
    <Box flexDirection="column">
      <Box
        borderStyle="round"
        borderColor={isCommandMode ? 'cyan' : 'gray'}
        paddingX={1}
      >
        <Text color="cyan" bold>❯ </Text>
        {value
          ? <Text>{value}<Text color="cyan">█</Text></Text>
          : <Text><Text color="cyan">█</Text><Text color="gray" dimColor> {placeholder}</Text></Text>}
      </Box>
      {isCommandMode && filtered.length > 0 && (
        <Box flexDirection="column" paddingLeft={2}>
          {filtered.map((cmd, i) => {
            const selected = i === clampedIndex;
            return (
              <Box key={cmd.name}>
                <Text color={selected ? 'cyan' : 'gray'}>{selected ? '❯ ' : '  '}</Text>
                <Text color={selected ? 'cyan' : 'gray'} bold={selected}>/{cmd.name}</Text>
                <Text color="gray" dimColor>{'   '}{cmd.description}</Text>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
