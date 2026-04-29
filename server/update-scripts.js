// Add dev & start scripts to server package.json
const fs = require('fs');
const path = require('path');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
pkg.scripts = {
  ...pkg.scripts,
  "start": "node index.js",
  "dev": "node --watch index.js"
};
fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(pkg, null, 2));
console.log('Updated server package.json');
