const fs=require('node:fs');const path=require('node:path');
const folder=path.join(__dirname,'../public');
// Copy the standalone worker byte-for-byte; CRA's Babel asset processing otherwise
// adds absolute filesystem helper imports which cannot be fetched in a browser.
fs.copyFileSync(require.resolve('pdfjs-dist/build/pdf.worker.min.mjs'),path.join(folder,'porty-pdf-worker.mjs'));
fs.copyFileSync(require.resolve('pdfjs-dist/LICENSE'),path.join(folder,'porty-pdf-worker.LICENSE.txt'));
