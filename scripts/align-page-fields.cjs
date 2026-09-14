const fs = require('fs');
const path = require('path');
const { parse, compileTemplate } = require('@vue/compiler-sfc');
const { baseParse } = require('@vue/compiler-dom');
const prettier = require('prettier');
const fieldTags = new Set(['q-input', 'q-select', 'q-field']);
const attr = (n, key) => n.props?.find(p => p.type === 6 && p.name === key);
const classes = n => (attr(n, 'class')?.value?.content || '').split(/\s+/);
const elements = n => (n.children || []).filter(c => c.type === 1);
function descendants(n, test) { return elements(n).some(c => test(c) || descendants(c, test)); }
const isCol = n => n.tag === 'div' && classes(n).some(c => /^col(?:-|$)/.test(c));
const isFieldCol = n => isCol(n) && descendants(n, c => fieldTags.has(c.tag) || c.tag === 'q-checkbox') && !descendants(n, isCol) && !n.props.some(p => p.type === 7 && p.name === 'bind' && p.arg?.content === 'class');
const isFieldRow = n => n.tag === 'div' && classes(n).includes('row') && n.props.every(p => p.type === 6 && p.name === 'class') && elements(n).length && elements(n).every(isFieldCol);
function files(dir) { return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):e.name.endsWith('.vue')?[path.join(dir,e.name)]:[]); }
const pending=[];
let fieldCount=0, gridCount=0;
for (const file of [...files('src/pages'), ...files('src/components')]) {
  const source=fs.readFileSync(file,'utf8');
  const descriptor=parse(source).descriptor;
  if(!descriptor.template) continue;
  const original=descriptor.template.content;
  const ast=baseParse(original);
  const align=/[\\/]DMS|[\\/]Generic/.test(file);
  const edit = (text, changes, start) => changes.sort((a,b)=>b[0]-a[0]).reduce((value,[a,b,s])=>value.slice(0,a-start)+s+value.slice(b-start),text);
  function render(n, parent, label) {
    if(n.type!==1) return n.loc.source;
    const changes=[];
    const setAttr=(key,value)=>{
      const p=attr(n,key);
      if(p) { if(p.value?.content!==value) changes.push([p.loc.start.offset,p.loc.end.offset,`${key}="${value}"`]); }
      else changes.push([n.loc.start.offset+1+n.tag.length,n.loc.start.offset+1+n.tag.length,` ${key}="${value}"`]);
    };
    if(fieldTags.has(n.tag)) {
      if(attr(n,'bg-color')?.value?.content!=='blue-1') {setAttr('bg-color','blue-1');fieldCount++;}
      if(label) setAttr('label',label);
      const css=attr(n,'class');
      if(css && /\bbg-(?:yellow|amber|grey)(?:-\d+)?\b/.test(css.value.content)) setAttr('class',css.value.content.replace(/\bbg-(?:yellow|amber|grey)(?:-\d+)?\b/g,'bg-blue-1'));
      if(align) for(const key of ['square','dense','outlined']) if(!attr(n,key)) setAttr(key,'');
    }
    if(align && isFieldCol(n) && isFieldRow(parent)) {
      const wide=descendants(n,c=>fieldTags.has(c.tag) && (attr(c,'type')?.value?.content==='textarea' || /Address|Remarks/.test(attr(c,'label')?.value?.content||'')));
      const rest=classes(n).filter(c=>!/^col(?:-|$)/.test(c));
      setAttr('class',['col-12','col-sm-6',wide?'col-md-6':'col-md-3',...rest].join(' '));
    }
    if(align && isFieldRow(n)) {setAttr('class','row q-col-gutter-sm items-start');gridCount++;}
    const childEls=elements(n);
    const caption=align && childEls.find(c=>c.tag==='span' && classes(c).includes('field-label') && c.children.every(x=>x.type===2));
    const target=caption && childEls[childEls.indexOf(caption)+1];
    const floating=target && fieldTags.has(target.tag) && !attr(target,'label');
    for(let i=0;i<(n.children||[]).length;i++) {
      const child=n.children[i];
      if(align && isFieldRow(child)) {
        let end=i;
        const group=[child];
        for(let j=i+1;j<n.children.length;j++) {
          const next=n.children[j];
          if(next.type===3 || next.type===2 && !next.content.trim()) continue;
          if(!isFieldRow(next)) break;
          group.push(next);end=j;
        }
        if(group.length>1) {
          const body=group.map(row=>row.children.map(c=>render(c,row)).join('')).join('\n');
          changes.push([child.loc.start.offset,n.children[end].loc.end.offset,`<div class="row q-col-gutter-sm items-start">${body}</div>`]);
          gridCount+=group.length;i=end;continue;
        }
      }
      const replacement=child===caption && floating?'':render(child,n,child===target && floating?caption.children.map(c=>c.content).join('').trim():undefined);
      if(replacement!==child.loc.source) changes.push([child.loc.start.offset,child.loc.end.offset,replacement]);
    }
    return edit(n.loc.source,changes,n.loc.start.offset);
  }
  const transformed=ast.children.map(n=>render(n,ast)).join('');
  if(transformed===original) continue;
  // Reject changes before writing if a template becomes invalid or a binding disappears.
  const compiled=compileTemplate({source:transformed,filename:file,id:file});
  if(compiled.errors.length) throw new Error(file+': '+JSON.stringify(compiled.errors));
  function models(tree) { const result=[]; function walk(n) { for(const p of n.props||[]) if(p.type===7 && p.name==='model') result.push(p.exp?.content); (n.children||[]).forEach(walk); } walk(tree);return result.sort(); }
  if(JSON.stringify(models(ast))!==JSON.stringify(models(baseParse(transformed)))) throw new Error('Changed model bindings: '+file);
  let result=source.slice(0,descriptor.template.loc.start.offset)+transformed+source.slice(descriptor.template.loc.end.offset);
  if(align) result=prettier.format(result,{parser:'vue',htmlWhitespaceSensitivity:'ignore'});
  pending.push([file,result]);
}
for(const [file,source] of pending) fs.writeFileSync(file,source);
fs.writeFileSync('scripts/field-layout-changes.json',JSON.stringify(pending.map(([file])=>file),null,2));
console.log(`Updated ${pending.length} files; ${fieldCount} field backgrounds; ${gridCount} field rows. Model bindings preserved.`);
