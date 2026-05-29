import React, {useEffect, useMemo, useState} from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import {AppHeader} from '../components/AppHeader.tsx';
import {Message} from '../components/Message.tsx';
import {PromptInput, type Command} from '../components/PromptInput.tsx';
import {Spinner} from '../components/Spinner.tsx';
import {StatusBar} from '../components/StatusBar.tsx';
import {getWeather, iconColor, type WeatherResult} from '../services/weather.ts';
import {unitConfig, nextSystem, type UnitSystem} from '../services/units.ts';
import {saveConfig, type AppConfig} from '../services/storage.ts';
import {translations, type Lang} from '../i18n/index.ts';

type AppProps = {
  city: string;
  debug: boolean;
  config: AppConfig;
};

export type ChatMessage =
  | {role: 'user' | 'tool' | 'error'; text: string}
  | {role: 'forecast'; weather: WeatherResult};

// Cap chat history so a long session doesn't grow memory unbounded
// (each forecast holds 8 days of data).
const MAX_HISTORY = 50;

function pushMessage(prev: ChatMessage[], msg: ChatMessage): ChatMessage[] {
  const next = [...prev, msg];
  return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
}

export function App({city, debug, config}: AppProps) {
  const {exit} = useApp();

  const [query, setQuery] = useState(city);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lang, setLang] = useState<Lang>(config.lang);
  const [units, setUnits] = useState<UnitSystem>(config.units);
  const [favorites, setFavorites] = useState<string[]>(config.favorites);
  const [, forceRedraw] = useState(0);

  const t = translations[lang];

  const commands: Command[] = useMemo(
    () => [
      {name: 'lang', description: t.commands.lang},
      {name: 'units', description: t.commands.units},
      {name: 'save', description: t.commands.save},
      {name: 'list', description: t.commands.list},
      {name: 'clear', description: t.commands.clear},
      {name: 'help', description: t.commands.help},
      {name: 'quit', description: t.commands.quit},
    ],
    [t],
  );

  // Persist preferences whenever they change.
  useEffect(() => {
    saveConfig({favorites, lang, units});
  }, [favorites, lang, units]);

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
        const result = await getWeather(query, lang, units);
        if (!alive) return;
        setMessages(prev => pushMessage(prev, {role: 'forecast', weather: result}));
      } catch (err) {
        if (!alive) return;
        const msg = err instanceof Error ? err.message : String(err);
        setMessages(prev => pushMessage(prev, {role: 'error', text: msg}));
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [query, lang, units]);

  function info(text: string) {
    setMessages(prev => pushMessage(prev, {role: 'tool', text}));
  }

  function submitPrompt(value: string) {
    const nextCity = value.trim();
    if (!nextCity) return;
    setMessages(prev => pushMessage(prev, {role: 'user', text: value}));
    setQuery(nextCity);
  }

  function handleCommand(name: string) {
    switch (name) {
      case 'lang':
        setLang(l => (l === 'ru' ? 'en' : 'ru'));
        setMessages([]);
        break;
      case 'units': {
        const next = nextSystem(units);
        setUnits(next);
        info(`${t.unitsPrefix}${unitConfig[next].tempLabel} · ${unitConfig[next].windLabel}`);
        break;
      }
      case 'save':
        if (favorites.includes(query)) {
          info(`${t.alreadyPrefix}${query}`);
        } else {
          setFavorites(prev => [...prev, query]);
          info(`${t.savedPrefix}${query}`);
        }
        break;
      case 'list':
        if (favorites.length === 0) {
          info(t.favoritesEmpty);
        } else {
          info([t.favoritesTitle, ...favorites.map(c => `  • ${c}`)].join('\n'));
        }
        break;
      case 'clear':
        setMessages([{role: 'tool', text: t.cleared}]);
        break;
      case 'help':
        info([t.helpTitle, ...commands.map(c => `  /${c.name}  —  ${c.description}`)].join('\n'));
        break;
      case 'quit':
        exit();
        break;
    }
  }

  // Accent color = latest successful forecast condition (reverse scan, no array copy).
  let latest: Extract<ChatMessage, {role: 'forecast'}> | undefined;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'forecast') {
      latest = messages[i] as Extract<ChatMessage, {role: 'forecast'}>;
      break;
    }
  }
  const accent = latest ? iconColor(latest.weather.iconType) : 'cyan';
  const unitsLabel = `${unitConfig[units].tempLabel} · ${unitConfig[units].windLabel}`;

  return (
    <Box flexDirection="column">
      <AppHeader debug={debug} lang={lang} accent={accent} units={unitsLabel} />

      <Box flexDirection="column" paddingX={2} paddingTop={1}>
        {messages.map((msg, i) => (
          <Message key={`msg-${i}-${msg.role}`} message={msg} lang={lang} />
        ))}
        {loading && (
          <Box marginBottom={1}>
            <Text color="cyan" bold>{t.agent} </Text>
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
