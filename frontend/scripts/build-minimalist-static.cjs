const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const webpack = require('webpack');
const frontend = path.resolve(__dirname, '..');
const output = path.resolve(frontend, '../huggingface/minimalist-static');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'porty-minimalist-'));
const entry = path.join(temporary, 'entry.jsx');
fs.writeFileSync(entry, `import React from ${JSON.stringify(require.resolve('react'))};
import {createRoot} from ${JSON.stringify(require.resolve('react-dom/client'))};
import Preview from ${JSON.stringify(path.join(frontend, 'src/pages/MinimalistDemoPage.jsx'))};
createRoot(document.getElementById('porty-minimalist-preview')).render(<Preview />);`);
webpack({ mode: 'production', devtool: false, entry,
  output: { path: temporary, filename: 'preview.js' },
  resolve: { extensions: ['.jsx', '.js', '.json'], modules: [path.join(frontend, 'node_modules')] },
  module: { rules: [
    { test: /\.jsx?$/, exclude: /node_modules/, use: { loader: require.resolve('babel-loader'), options: { presets: [[require.resolve('@babel/preset-react'), { runtime: 'automatic' }]] } } },
    { test: /\.css$/, use: [require.resolve('style-loader'), require.resolve('css-loader')] }
  ] }
}, (error, stats) => {
  try {
    if (error || stats.hasErrors()) throw error || new Error(stats.toString({ all: false, errors: true }));
    const avatar = 'data:image/webp;base64,' + fs.readFileSync(path.join(frontend, 'public/demo/minimalist-character.webp')).toString('base64');
    const script = fs.readFileSync(path.join(temporary, 'preview.js'), 'utf8').replaceAll('/demo/minimalist-character.webp', avatar).replaceAll('</script', '<\\/script');
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Try PORTY's minimalist portfolio: colours, typography and character avatars."><title>PORTY — Minimalist preview</title><style>html,body{margin:0}</style></head><body><div id="porty-minimalist-preview"></div><script>${script}</script></body></html>`;
    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(path.join(output, 'index.html'), html);
    console.log(`Static preview ready: ${path.join(output, 'index.html')} (${Buffer.byteLength(html)} bytes)`);
  } catch (failure) { console.error(failure); process.exitCode = 1; }
  finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});
