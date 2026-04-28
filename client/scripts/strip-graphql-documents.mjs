import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(__dirname, '../src/store/generated/graphql.ts');

let s = fs.readFileSync(target, 'utf8');
const before = s;

s = s.replace(/new TypedDocumentString\(\s*`([\s\S]*?)`\s*,\s*\{[^}]*}\s*\)/g, '`$1`');
s = s.replace(/new TypedDocumentString\(\s*`([\s\S]*?)`\s*\)/g, '`$1`');
s = s.replace(/,\s*\{\s*"fragmentName"\s*:\s*"[^"]+"\s*\}\s*\)\s*;/g, ';');

if (s === before) {
  console.warn('strip-graphql-documents: no patterns changed');
} else {
  console.log('strip-graphql-documents: OK');
}
fs.writeFileSync(target, s);
