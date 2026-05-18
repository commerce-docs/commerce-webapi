#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '..');
const CONFIG = path.join(ROOT, 'spectaql/config-md.yml');

const { spectaql: config } = yaml.load(fs.readFileSync(CONFIG, 'utf8'));
const TARGET_DIR = path.join(ROOT, config.targetDir);
const TARGET_FILE = config.targetFile ?? 'index.md';
const OUTPUT_FILE = path.join(TARGET_DIR, TARGET_FILE);

fs.mkdirSync(TARGET_DIR, { recursive: true });

console.log('Running SpectaQL with Markdown theme...');
execSync(`spectaql "${CONFIG}"`, { stdio: 'inherit', cwd: ROOT });

if (!fs.existsSync(OUTPUT_FILE)) {
  console.error(`SpectaQL did not produce ${OUTPUT_FILE}`);
  process.exit(1);
}

const content = fs.readFileSync(OUTPUT_FILE, 'utf8');
const cleaned = content.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
fs.writeFileSync(OUTPUT_FILE, cleaned, 'utf8');

for (const dir of ['javascripts', 'stylesheets']) {
  fs.rmSync(path.join(TARGET_DIR, dir), { recursive: true, force: true });
}

console.log(`Generated: ${OUTPUT_FILE}`);
