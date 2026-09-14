const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost' });
for (const key of ['window','document','Element','HTMLElement','SVGElement','Node','Event','localStorage']) global[key] = dom.window[key];
const { createApp, nextTick } = require('vue');
const { parse, compileTemplate } = require('@vue/compiler-sfc');
const babel = require('@babel/core');
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const source = fs.readFileSync(file, 'utf8');
  const code = file.endsWith('.vue') ? parse(source).descriptor.script.content : source;
  const transformed = babel.transformSync(code, { babelrc: false, configFile: false, plugins: ['@babel/plugin-transform-modules-commonjs'] }).code;
  const localRequire = id => {
    if (/\.(png|jpg|svg)$/.test(id)) return id;
    if (id === 'html2pdf.js') return () => {};
    if (id.startsWith('src/')) return load(id);
    if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id));
    return require(id);
  };
  vm.runInThisContext(`(function(require,module,exports){${transformed}\n})`, { filename:file })(localRequire,module,module.exports);
  return module.exports;
}
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const apps = [];
function mount(name, params = {}, useTabs = true) {
  const navigations = [];
  const component = load('src/pages/'+name+'.vue').default;
  const app = createApp({ ...component, render() { return null; } }, { params });
  app.config.globalProperties.$route = { query: params };
  app.config.globalProperties.$router = { push: target => navigations.push(target) };
  app.config.globalProperties.$q = { notify() {}, screen: { lt: { sm:false } } };
  if (useTabs) app.provide('openTab', target=>navigations.push(target));
  const host = document.createElement('div'); document.body.appendChild(host);
  apps.push(app);
  return { instance: app.mount(host), navigations };
}
(async () => {
  const audit = { newForms: fs.readdirSync('src/pages')
    .filter(file => file.endsWith('Form.vue') && fs.readFileSync('src/pages/'+file,'utf8').includes('extends: ListPage'))
    .map(file => file.slice(0, -8)) };
  for (const name of audit.newForms) {
    const form = mount(name+'Form');
    await pause(400);
    assert.equal(form.instance.entryLoading, false, name);
    assert.equal(form.instance.entryError, '', name);
    assert.equal(form.instance.dialogMode, 'add', name);
    assert.equal(form.instance.entryPage, true, name);
    const descriptor = parse(fs.readFileSync('src/pages/'+name+'Form.vue','utf8')).descriptor;
    assert.equal(descriptor.styles.length,0);
    assert.deepEqual(compileTemplate({ source:descriptor.template.content, filename:name, id:name }).errors, []);
    const sourceList = mount(name);
    await pause(400);
    if (name === 'DMSTripStockTransfer' && !sourceList.instance.filteredTrips.length) {
      await form.instance.saveTrip();
      await sourceList.instance.loadTrips();
    }
    const idKey = Object.keys(sourceList.instance.form).find(key => /Id$|ID$/.test(key));
    const records = Object.values(sourceList.instance.$data).find(value => Array.isArray(value) && value.some(row => row && row[idKey]));
    assert.ok(records, name + ' has source records');
    const record = records.find(row => row && row[idKey]);
    const editForm = mount(name+'Form', { mode:'edit', id:String(record[idKey]) });
    await pause(400);
    assert.equal(editForm.instance.entryError, '', name + ' edit load');
    assert.equal(editForm.instance.form[idKey], record[idKey], name + ' correct record');
  }
  for (const useTabs of [true, false]) {
    const {instance,navigations} = mount('DMSTripStockTransfer',{},useTabs);
    instance.openAddTrip();
    assert.match(navigations[0], /^\/DMSTripStockTransferForm\?mode=add/);
  }
  const list = mount('DMSTripCharge');
  await pause(400);
  const originalCount = list.instance.allCharges.length;
  const charge = mount('DMSTripChargeForm');
  charge.instance.form.TripNo = 'TRP20260001';
  charge.instance.form.Amount = 123;
  await charge.instance.saveCharge();
  const id = charge.instance.form.ChargeId;
  assert.ok(id);
  assert.equal(charge.instance.dialogMode,'edit');
  charge.instance.form.Amount = 456;
  await charge.instance.saveCharge();
  await pause(250);
  assert.equal(list.instance.allCharges.length, originalCount+1, 'Saving twice must not duplicate');
  assert.equal(list.instance.allCharges.find(r=>r.ChargeId===id).Amount,456,'Open list refreshes after save');
  const edit = mount('DMSTripChargeForm',{mode:'edit',id:String(id)},false);
  await pause(400);
  assert.equal(edit.instance.form.Amount,456,'Direct route loads selected record');
  const missing = mount('DMSTripChargeForm',{mode:'edit',id:'999999'});
  await pause(400);
  assert.ok(missing.instance.entryError,'Missing ID must not silently open an add form');
  const booking = mount('DMSBBookingForm');
  await booking.instance.saveBooking();
  const bookingId = booking.instance.form.BookingId;
  assert.ok(bookingId);
  await booking.instance.saveAndCopy();
  assert.equal(booking.instance.form.BookingId,null);
  assert.equal(booking.instance.dialogMode,'add');
  const bookingView = mount('DMSBBookingForm',{mode:'view',id:String(bookingId)});
  await pause(400);
  assert.equal(bookingView.instance.form.BookingId,bookingId);
  assert.equal(bookingView.instance.dialogMode,'view');
  const stock = mount('DMSTripStockTransferForm');
  stock.instance.form.Vehicle1Amount=125;
  stock.instance.form.Vehicle2Amount=75;
  await stock.instance.saveTrip();
  assert.equal(stock.instance.form.TotalTripAmount,'200.00');
  assert.equal(stock.instance.form.IsStockTransferTrip,true);
  assert.ok(stock.instance.form.TripId);
  await nextTick();
  apps.forEach(app=>app.unmount());
  console.log('PASS: all 10 form lifecycles; tab/direct navigation; edit reload; repeated Save; list refresh; missing ID; Save & Copy; stock-transfer totals.');
})().catch(error=>{ console.error(error); process.exitCode=1; apps.forEach(app=>app.unmount()); });
