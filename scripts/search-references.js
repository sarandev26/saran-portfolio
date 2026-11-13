const fs = require('fs');
const path = require('path');

function search(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
      search(fullPath);
    } else if (/\.(ts|tsx|js|jsx|json|md)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/2\s*(\+)?\s*years/i.test(line) || /years of experience/i.test(line) || /mailto:/i.test(line) || /wa\.me/i.test(line)) {
          console.log(fullPath + ':' + (idx + 1) + ': ' + line.trim().slice(0, 120));
        }
      });
    }
  }
}

search('.');

