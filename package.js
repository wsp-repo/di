#!/usr/bin/node

const { execSync } = require('child_process');

const { devDependencies = {}, dependencies = {} } = require('./package.json');

const prodModules = Object.keys(dependencies).map(mod => `${mod}@latest`);
const devModules = Object.keys(devDependencies).map(mod => `${mod}@latest`);

console.warn('Remove "node_modules" & "package-lock.json":');
execSync(
  `rm -r -f -d ./dist ./node_modules ./package-lock.json`,
  { stdio: [process.stdin, process.stdout, process.stderr] },
);

console.warn('Install "devDependencies@latest" modules:');
execSync(
  `npm install --save-dev --save-exact ${devModules.join(' ')}`,
  { stdio: [process.stdin, process.stdout, process.stderr] },
);

console.warn('Install "dependencies@latest" modules:');
execSync(
  `npm install --save --save-exact ${prodModules.join(' ')}`,
  { stdio: [process.stdin, process.stdout, process.stderr] },
);

console.warn('Finish');
