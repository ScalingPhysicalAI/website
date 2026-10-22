#!/usr/bin/env node
// Regenerates agreement.b64.ts / loi.b64.ts from the checked-in PDFs.
// Run with: node src/lib/server/partner-agreement/templates/generate.mjs
//
// The server build (Vite SSR + the Vercel adapter) restructures output
// directories, so a `new URL('./templates/x.pdf', import.meta.url)` +
// `fs.readFile` reference breaks at runtime - the sibling file is no longer
// where the compiled module ends up. Embedding the bytes as a base64 string
// constant makes them ordinary JS data that survives any bundling.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));

for (const [pdf, varName] of [
	['agreement.pdf', 'AGREEMENT_PDF_BASE64'],
	['loi.pdf', 'LOI_PDF_BASE64']
]) {
	const base64 = readFileSync(join(dir, pdf)).toString('base64');
	const outPath = join(dir, pdf.replace('.pdf', '.b64.ts'));
	writeFileSync(
		outPath,
		`// Generated from ${pdf} via generate.mjs. Do not hand-edit.\nexport const ${varName} =\n\t'${base64}';\n`
	);
	console.log(`wrote ${outPath} (${base64.length} chars)`);
}
