import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';

// A fixed output directory keeps cleanup portable on Windows, macOS and Linux.
const output = new URL('../test-dist/', import.meta.url);
const root = new URL('../', import.meta.url);
let status = 1;
try {
  rmSync(output, { recursive: true, force: true });
  const compile = spawnSync(process.execPath, [
    'node_modules/typescript/bin/tsc', 'services/parseJsonSafely.ts',
    'services/localStorageService.ts', 'services/videoSuggestions.ts', '--skipLibCheck', '--module', 'commonjs',
    '--target', 'es2020', '--rootDir', '.', '--outDir', 'test-dist',
  ], { cwd: root, stdio: 'inherit' });
  if (compile.status === 0) {
    mkdirSync(output, { recursive: true });
    writeFileSync(new URL('package.json', output), '{"type":"commonjs"}\n');
    const tests = readdirSync(new URL('tests/', root))
      .filter(name => name.endsWith('.test.js')).sort().map(name => `tests/${name}`);
    status = spawnSync(process.execPath, ['--test', ...tests], { cwd: root, stdio: 'inherit' }).status ?? 1;
  }
} finally {
  rmSync(output, { recursive: true, force: true });
}
process.exitCode = status;
