const fs = require('fs');
const { parse, compileTemplate } = require('@vue/compiler-sfc');
let errors = 0;
for (const file of fs.readdirSync('src/pages').filter(f=>f.endsWith('.vue'))) {
  const source = fs.readFileSync('src/pages/'+file,'utf8');
  const result = parse(source);
  const template = result.descriptor.template;
  const compiled = template && compileTemplate({ source: template.content, filename:file, id:file });
  const failures = [...result.errors, ...(compiled?.errors || [])];
  if (failures.length) { errors++; console.error(file, failures); }
}
if (errors) process.exit(1);
console.log('All page templates compile.');
