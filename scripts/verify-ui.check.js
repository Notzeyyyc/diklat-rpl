// Cek UI dashboard via Camoufox (Firefox) + playwright-core. Exit 1 kalau ada cek yang gagal.
const { firefox } = require('/root/camofox/node_modules/playwright-core');

const BASE = 'http://localhost:3001';
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} ${detail}`); };

(async () => {
  const browser = await firefox.launch({ executablePath: '/root/.cache/camoufox/camoufox-bin', headless: true, timeout: 90000 });
  try {
    // Desktop: ketua
    const d = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await d.request.post(`${BASE}/api/auth/login`, { data: { username: 'ketua', password: 'ketua123' } });
    const p = await d.newPage();

    await p.goto(`${BASE}/ketua/panel`, { waitUntil: 'load', timeout: 90000 });
    await p.waitForTimeout(3000);
    const chevPanel = await p.evaluate(() => {
      const sel = [...document.querySelectorAll('[role=combobox]')];
      return sel.map(b => {
        const c = b.querySelector('[class*=chevron-down]');
        return c ? Math.round(b.getBoundingClientRect().right - c.getBoundingClientRect().right) : null;
      });
    });
    const panelOk = chevPanel.length > 0 && chevPanel.every(d => d !== null && d <= 30);
    check('ketua/panel: chevron di kanan semua USelect', panelOk, JSON.stringify(chevPanel));

    await p.goto(`${BASE}/ketua/riwayat`, { waitUntil: 'load', timeout: 90000 });
    await p.waitForTimeout(3000);
    const rw = await p.evaluate(() => {
      const t = document.querySelector("[role='combobox']");
      if (!t) return null;
      const c = t.querySelector('[class*=chevron-down]');
      return { chevGap: c ? Math.round(t.getBoundingClientRect().right - c.getBoundingClientRect().right) : null, w: Math.round(t.getBoundingClientRect().width) };
    });
    check('ketua/riwayat: chevron di kanan', !!rw && rw.chevGap !== null && rw.chevGap <= 30, JSON.stringify(rw));

    await p.click("[role='combobox']");
    await p.waitForTimeout(1200);
    const pop = await p.evaluate(() => {
      const l = document.querySelector("[role='listbox']");
      if (!l) return null;
      return Math.round(l.getBoundingClientRect().width);
    });
    const trigW = rw ? rw.w : null;
    check('ketua/riwayat: lebar dropdown = trigger', pop !== null && Math.abs(pop - trigW) <= 2, `dropdown=${pop} trigger=${trigW}`);

    // Mobile: admin tracking murid & pos (tanpa overflow horizontal)
    const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await m.request.post(`${BASE}/api/auth/login`, { data: { username: 'admin', password: 'admin123' } });
    const mp = await m.newPage();
    for (const path of ['/admin/tracking-murid', '/admin/tracking-pos', '/login']) {
      if (path !== '/login') { /* login cookie sudah di context */ }
      await mp.goto(`${BASE}${path}`, { waitUntil: 'load', timeout: 90000 });
      await mp.waitForTimeout(2500);
      const overflow = await mp.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      check(`mobile 390px ${path}: tidak overflow horizontal`, overflow <= 0, `overflow=${overflow}px`);
    }
  } finally {
    await browser.close();
  }

  const failed = results.filter(r => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} cek lulus`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('ERR', e.message.split('\n')[0]); process.exit(1); });
