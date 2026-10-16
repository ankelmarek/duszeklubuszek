import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';

// This small app has three modules and no third-party imports. Bundle their
// explicit dependency order into one classic script, so file:// needs no CORS,
// fetches or development server. Keep source modules for normal development.
const [template, css, favicon, image, ...modules] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('styles.css', 'utf8'),
  readFile('favicon.svg'),
  readFile('assets/duszek.png'),
  ...['game', 'scenes', 'app'].map(name => readFile(`src/${name}.js`, 'utf8'))
]);
const imageData = `data:image/png;base64,${image.toString('base64')}`;
const javascript = modules.map(source => source
  .replace(/^import [^\n]+;\r?\n/gm, '')
  .replace(/^export /gm, '')
  .replace("new URL('../assets/duszek.png', import.meta.url).href", JSON.stringify(imageData))
).join('\n\n');
if (/^\s*(?:import|export)\b/m.test(javascript) || javascript.includes('import.meta')) {
  throw new Error('Nieobsługiwany import: uaktualnij kolejność modułów w build.js.');
}
const script = `<script>\n(() => {\n${javascript.replace(/<\/script/gi, '<\\/script')}\n})();\n</script>`;
const html = template
  .replace('<link rel="icon" type="image/svg+xml" href="./favicon.svg" />', `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,${favicon.toString('base64')}" />`)
  .replace('<link rel="stylesheet" href="./styles.css" />', `<style>\n${css}\n</style>`)
  .replace('    <script type="module" src="./src/app.js"></script>\n', '')
  .replace('</body>', `${script}\n  </body>`);

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', html);
console.log('Gotowe: dist/index.html zawiera całą grę, style i grafikę. Działa po dwukliku i na hostingu w podkatalogu.');
