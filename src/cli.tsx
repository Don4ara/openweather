import React from 'react';
import {render} from 'ink';
import {Command} from 'commander';
import {App} from './app/App.tsx';
import {loadConfig} from './services/storage.ts';

export async function runCli() {
  const program = new Command();

  program
    .name('openweather')
    .description('Beautiful Claude Code-style weather TUI')
    .version('0.1.0');

  program
    .argument('[city]', 'city to show weather for')
    .option('-d, --debug', 'enable debug mode')
    .action(async (city: string | undefined, options: {debug?: boolean}) => {
      const config = loadConfig();
      const startCity = city ?? config.favorites[0] ?? 'Stockholm';
      process.stdout.write('\x1B[2J\x1B[H');
      const {waitUntilExit} = render(
        <App city={startCity} debug={Boolean(options.debug)} config={config} />
      );
      await waitUntilExit();
    });

  program.parse(process.argv);
}
