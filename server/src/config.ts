import * as minimist from 'minimist';

export interface Config { help?: boolean, setColor?: string, statusCheck?: string }

const opts: minimist.Opts = {
  boolean: ['help'],
  string: ['setColor', 'statusCheck'],
  alias: {
    help: ['h'],
  },
  default: {}
};

export function processArgs(argv: string[]) {
  return minimist(argv, opts) as Config;
}

export function printHelp() {
  console.log(`
Usage: ble-light-server <options>

Options:
    --help, -h              Show help
    --statusCheck <id>      Run the given status check
`)
}
