#!/usr/bin/env node
/*
  Flatten schema includes into a migration-friendly baseline file.
  - Removes psql meta-commands (we don't parse them; we expand includes explicitly)
  - Skips missing files but logs a warning
*/
const fs = require('fs');
const path = require('path');

const root = process.cwd();
// Output to supabase/migrations/baseline.sql
const outPath = path.join(root, 'supabase', 'migrations', '00000000000000_baseline.sql');

// Build file list dynamically: others/01, others/02, models/*.sql (sorted), then others/03..06
const modelsDir = path.join(root, 'supabase', 'schema', 'models');
let modelFiles = [];
try {
  modelFiles = fs
    .readdirSync(modelsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((f) => path.join('supabase', 'schema', 'models', f));
} catch (e) {
  // no models dir
  modelFiles = [];
}

const filesInOrder = [
  'supabase/schema/others/01_extensions.sql',
  'supabase/schema/others/02_types.sql',
  ...modelFiles, // 03_models (by convention)
  'supabase/schema/others/04_functions.sql',
  'supabase/schema/others/05_views.sql',
  'supabase/schema/others/06_auth_hooks.sql',
  'supabase/schema/others/07_rls.sql',
  'supabase/schema/others/08_orphan_checks.sql',
];

let output = [];
output.push('-- GENERATED: Flattened baseline migration');
output.push('');

for (const rel of filesInOrder) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    output.push(`-- (skip missing) ${rel}`);
    output.push('');
    continue;
  }
  const content = fs.readFileSync(p, 'utf8');
  output.push(`-- >>> BEGIN ${rel}`);
  output.push('');
  output.push(content);
  output.push('');
  output.push(`-- <<< END ${rel}`);
  output.push('');
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output.join('\n'));
console.log('Wrote', outPath);
