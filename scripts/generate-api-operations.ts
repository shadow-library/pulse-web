/**
 * Importing npm packages
 */
import { SpawnSyncOptions, spawnSync } from 'node:child_process';
import { join } from 'node:path';

import { generate, GlobalMockOptions } from 'orval';

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

/**
 * Declaring the constants
 */
const isMockEnabled = process.env.MOCK_API === 'true';
const delay = process.env.MOCK_API_DELAY ? parseInt(process.env.MOCK_API_DELAY, 10) : 0;
const openapiSpecUrl = process.env.OPENAPI_SPEC_URL || 'https://pulse.shadow-apps.com/dev/api-docs/openapi.json';

const mockOptions: GlobalMockOptions = { type: 'msw', delay };

/** Generating the API operations */
await generate({
  input: openapiSpecUrl,
  output: {
    target: 'src/api/operations.ts',
    client: 'fetch',
    mock: isMockEnabled ? mockOptions : false,
    override: {
      operationName: document => {
        if (!document.summary) return '';
        const noSpaces = document.summary.replace(/\s+/g, '');
        return noSpaces.charAt(0).toLowerCase() + noSpaces.slice(1);
      },
    },
  },
});

/** Formatting the generated file */
const cwd = join(import.meta.dirname, '..');
const options = { cwd, stdio: 'inherit' } satisfies SpawnSyncOptions;
spawnSync('bunx', ['prettier', '--write', 'src/api/operations.ts'], options);

console.log('API operations generated successfully.');
