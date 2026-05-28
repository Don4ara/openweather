import React, {useEffect, useState} from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import {AppHeader} from '../components/AppHeader.tsx';
import {Message} from '../components/Message.tsx';
import {PromptInput, type Command} from '../components/PromptInput.tsx';
import {Spinner} from '../components/Spinner.tsx';
import {StatusBar} from '../components/StatusBar.tsx';
import {getWeather, type WeatherResult} from '../services/weather.ts';
import {translations, type Lang} from '../i18n/index.ts';

type AppProps = {
  city: string;
  debug: boolean;
};

export type ChatMessage =
  | {role: 'user' | 'tool' | 'error'; text: string}
  | {role: 'forecast'; weather: WeatherResult};

export function App({city, debug}: AppProps) {
  const {exit} = useApp();

  const [query, setQuery] = useState(city);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lang, setLang] = useState<Lang>('ru');
  const [, forceRedraw] = useState(0);

  const commands: Command[] = [
    {name: 'lang', description: translations[lang].commands.lang},
  ];

  useInput((input, key) => {
    if (key.escape || (key.ctrl && input === 'c')) {
      exit();
    }
  });

  useEffect(() => {
    const handleResize = () => {
      process.stdout.write('\x1B[2J\x1B[H');
      forceRedraw(n => n + 1);
    };
    process.stdout.on('resize', handleResize);
    return () => {
      process.stdout.off('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);

      try {
        const result = await getWeather(query, lang);
        if (!alive) return;
        setMessages(prev => [...prev, {role: 'forecast', weather: result}]);
      } catch (err) {
        if (!alive) return;
        const msg = err instanceof Error ? err.message : String(err);
        setMessages(prev => [...prev, {role: 'error', text: msg}]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [query, lang]);

  function submitPrompt(value: string) {
    const nextCity = value.trim();
    if (!nextCity) return;
    setMessages(prev => [...prev, {role: 'user', text: value}]);
    setQuery(nextCity);
  }

  function handleCommand(name: string) {
    if (name === 'lang') {
      setLang(l => l === 'ru' ? 'en' : 'ru');
      setMessages([]);
    }
  }

  return (
    <Box flexDirection="column">
      <AppHeader debug={debug} lang={lang} />

      <Box flexDirection="column" paddingX={2} paddingTop={1}>
        {messages.map((msg, i) => (
          <Message key={`msg-${i}-${msg.role}`} message={msg} lang={lang} />
        ))}
        {loading && (
          <Box marginBottom={1}>
            <Text color="cyan" bold>{translations[lang].agent} </Text>
            <Spinner label={query} />
          </Box>
        )}
      </Box>

      <PromptInput
        onSubmit={submitPrompt}
        onCommand={handleCommand}
        commands={commands}
        lang={lang}
      />
      <StatusBar lang={lang} />
    </Box>
  );
}
