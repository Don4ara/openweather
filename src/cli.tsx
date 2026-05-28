import React from 'react';
import {render} from 'ink';
import {Command} from 'commander';
import {App} from './app/App.tsx';

export async function runCli() {
  const program = new Command();

  program
    .name('openweather')
    .description('Beautiful Claude Code-style weather TUI')
    .version('0.1.0');

  program
    .argument('[city]', 'city to show weather for', 'Stockholm')
    .option('-d, --debug', 'enable debug mode')
    .action(async (city: string, options: {debug?: boolean}) => {
      process.stdout.write('\x1B[2J\x1B[H');
      const {waitUntilExit} = render(<App city={city} debug={Boolean(options.debug)} />);
      await waitUntilExit();
    });

  program.parse(process.argv);
}
