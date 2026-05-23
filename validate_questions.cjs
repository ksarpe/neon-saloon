const fs = require('fs');

const file = process.argv[2] || 'src/config/games/categories.ts';
const src = fs.readFileSync(file, 'utf8');

// Match objects shaped { text: '...', answer: '...', options: [...] }
const re = /text:\s*('(?:[^'\\]|\\.)*')\s*,\s*answer:\s*('(?:[^'\\]|\\.)*')\s*,\s*options:\s*(\[[\s\S]*?\])\s*,?\s*\}/g;

let m;
let count = 0;
let bad = 0;
const dupCheck = {};

while ((m = re.exec(src))) {
  count++;
  let opts, ans, text;
  try {
    text = eval(m[1]);
    ans = eval(m[2]);
    opts = eval(m[3]);
  } catch (e) {
    console.log('EVAL FAIL near:', m[1].slice(0, 60));
    continue;
  }
  if (!opts.includes(ans)) {
    bad++;
    console.log('MISMATCH:', text.slice(0, 70));
    console.log('   answer :', ans);
    console.log('   options:', JSON.stringify(opts));
  }
  if (opts.length !== 4) {
    console.log('OPT COUNT', opts.length, '-', text.slice(0, 60));
  }
}

console.log('---');
console.log('Parsed questions:', count, '| Answer/option mismatches:', bad);
