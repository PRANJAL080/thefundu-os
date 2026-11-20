const fs = require('fs');
const content = fs.readFileSync('src/lib/mock-data.ts', 'utf8');
const lines = content.split('\n');
const dates = [];
for (const line of lines) {
  if (line.includes('date:') && line.includes('2026')) {
    dates.push(line.trim());
  }
}
console.log('Found dates in mock-data:', dates.slice(0, 10));
