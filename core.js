/* Pure data functions. No network or DOM; shared by the app and regression tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SevenCore = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const KEY = '7doc_state_v2';
  const MAX_BACKUP_BYTES = 32 * 1024 * 1024;
  const HASHES = {
    core: '5c3ea39b0514cfe6ce5be98daa069f400454a4e9446bcf86766c63a79fb3ff19',
    bonus: '4ab4bdc3c6a493bb635efce952ae9ef124750fdf99bf79f2cf499a7b85317a08',
    bundle: '05c8b1e5aab515703364c49f2a64d813e7cdaea34dc6a07b275801e7d32da074',
    legacyBundle: '510f5fb94ea8f0049b0667c6a37bdbefe2cd12179db71fcd6ebe09b17b4fa988',
    owner: '13c256b1f86a9487b721efbcf02ed3c5142eb41894abac6fdb9f559fcbf50833'
  };
  const METRICS = ['a', 'b', 'c', 'd'];
  const isObj = x => !!x && typeof x === 'object' && !Array.isArray(x);
  const text = (x, limit = 100000) => typeof x === 'string' ? x.slice(0, limit) : '';
  const date = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(x) && Number.isFinite(Date.parse(x)) ? x : null;
  const localDate = (now = new Date()) => [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  function blankDay() { return { notes: {}, ratings: null, ratingDraft: null, legacyRatings: null, completed: false, completedAt: null, measuredAt: null, startedAt: null, stage: 0, practiceStep: 0, mode: 'full', value: '', audioTime: 0, offline: false }; }
  function fresh() { return { schema: 2, updatedAt: null, settings: { language: 'de', theme: 'system', name: '', reminderTime: '09:00', writingMode: 'app' }, access: { codes: [] }, days: Array.from({ length: 10 }, blankDay), moods: {}, archives: [] }; }
  function ratings(x) {
    if (x == null) return null;
    if (!isObj(x) || !METRICS.every(k => Number.isInteger(x[k]) && x[k] >= 0 && x[k] <= 10)) throw new Error('Invalid ratings');
    return Object.fromEntries(METRICS.map(k => [k, x[k]]));
  }
  function notes(x) {
    if (!isObj(x)) return {};
    const result = {};
    for (const [k, v] of Object.entries(x)) {
      if (/^[a-z][a-z0-9_]{0,39}$/i.test(k) && !['constructor', 'prototype', '__proto__'].includes(k) && typeof v === 'string') result[k] = v;
    }
    return result;
  }
  function cleanDay(x) {
    if (!isObj(x)) throw new Error('Invalid day');
    return { ...blankDay(), notes: notes(x.notes), ratings: ratings(x.ratings), ratingDraft: ratings(x.ratingDraft), legacyRatings: ratings(x.legacyRatings), completed: x.completed === true, completedAt: date(x.completedAt), measuredAt: date(x.measuredAt), startedAt: date(x.startedAt), stage: Number.isInteger(x.stage) ? Math.max(0, Math.min(3, x.stage)) : 0, practiceStep: Number.isInteger(x.practiceStep) ? Math.max(0, Math.min(2, x.practiceStep)) : 0, mode: x.mode === 'short' ? 'short' : 'full', value: text(x.value, 80), audioTime: Number.isFinite(x.audioTime) ? Math.max(0, Math.min(86400, x.audioTime)) : 0, offline: false };
  }
  function cleanDays(x) {
    if (!Array.isArray(x) || x.length !== 10) throw new Error('Expected 10 days');
    return x.map(cleanDay);
  }
  function moods(x) {
    if (!isObj(x)) return {};
    return Object.fromEntries(Object.entries(x).filter(([k,v]) => /^\d{4}-\d{2}-\d{2}$/.test(k) && Number.isInteger(v) && v >= 1 && v <= 5).slice(-3650));
  }
  function normalize(x) {
    if (!isObj(x) || x.schema !== 2) throw new Error('Unknown backup version');
    if (x.archives != null && (!Array.isArray(x.archives) || x.archives.length > 20)) throw new Error('Invalid archive');
    const s = fresh(), cfg = isObj(x.settings) ? x.settings : {};
    s.settings = { language: cfg.language === 'en' ? 'en' : 'de', theme: ['light','dark','system'].includes(cfg.theme) ? cfg.theme : 'system', name: text(cfg.name, 40), reminderTime: /^([01]\d|2[0-3]):[0-5]\d$/.test(cfg.reminderTime) ? cfg.reminderTime : '09:00', writingMode: cfg.writingMode === 'paper' ? 'paper' : 'app' };
    s.access.codes = Array.isArray(x.access?.codes) ? [...new Set(x.access.codes.filter(h => Object.values(HASHES).includes(h)))] : [];
    s.days = cleanDays(x.days);
    s.moods = moods(x.moods);
    s.archives = (x.archives || []).map(a => { if (!isObj(a)) throw new Error('Invalid archive'); return { endedAt: date(a.endedAt), name: text(a.name, 40), days: cleanDays(a.days) }; });
    s.updatedAt = date(x.updatedAt);
    return s;
  }
  function entitlements(s) {
    const codes = s.access.codes, full = [HASHES.bundle, HASHES.legacyBundle, HASHES.owner].some(h => codes.includes(h));
    return { core: full || codes.includes(HASHES.core), bonus: full || codes.includes(HASHES.bonus) };
  }
  function allowed(s) { const e = entitlements(s); return Array.from({ length: 10 }, (_, i) => i + 1).filter(n => n <= 7 ? e.core : e.bonus); }
  function allComplete(s, ids = allowed(s), records = s.days) { return ids.length > 0 && ids.every(n => records[n - 1].completed); }
  function nextDay(s) {
    const ids = allowed(s), open = ids.filter(n => !s.days[n-1].completed);
    const started = open.filter(n => s.days[n-1].startedAt).sort((a,b) => Date.parse(s.days[b-1].startedAt) - Date.parse(s.days[a-1].startedAt));
    return started[0] || open[0] || null;
  }
  function insights(records, ids) {
    const measured = ids.map(n => ({ num: n, ...records[n-1] })).filter(d => d.ratings);
    if (measured.length < 2) return { kind: 'insufficient', count: measured.length };
    // Dated check-ins define chronology. Imported undated measurements stay visible but do not imply time order.
    const chronological = measured.every(d => d.measuredAt) ? measured.slice().sort((a,b) => Date.parse(a.measuredAt) - Date.parse(b.measuredAt)) : measured;
    const first = chronological[0], last = chronological.at(-1);
    const deltas = METRICS.map(k => last.ratings[k] - first.ratings[k]);
    const kind = deltas.every(x => x === 0) ? 'stable' : deltas.every(x => x <= 0) ? 'lower' : deltas.every(x => x >= 0) ? 'higher' : 'mixed';
    return { kind, count: measured.length, first: first.num, last: last.num, deltas, orderedBy: measured.every(d => d.measuredAt) ? 'time' : 'day' };
  }
  function migrate(get, keys = []) {
    const s = fresh(); let found = false;
    const read = (k, fallback) => { const raw = get(k); if (raw == null) return fallback; found = true; try { return JSON.parse(raw); } catch { return fallback; } };
    const codes = read('7doc_codes', []);
    s.access.codes = Array.isArray(codes) ? codes.filter(h => Object.values(HASHES).includes(h)) : [];
    const oldAccess = get('7doc_access');
    if (oldAccess === 'granted' && !s.access.codes.length) s.access.codes.push(HASHES.core);
    if (oldAccess === 'full' && !s.access.codes.length) s.access.codes.push(HASHES.bundle);
    const p = read('7doc_p', []);
    s.settings.language = get('7doc_lang') === 'en' ? 'en' : 'de';
    s.settings.theme = ['dark','light'].includes(get('7doc_theme')) ? get('7doc_theme') : 'system';
    s.settings.name = text(get('7doc_user_name'),40);
    for (let i = 0; i < 10; i++) {
      s.days[i].completed = p?.[i] === true;
      s.days[i].notes = notes(read('7doc_n' + (i+1), {}));
      const r = read('7doc_s' + (i+1), null);
      try { s.days[i].legacyRatings = ratings(r); } catch { /* retain source keys for manual recovery */ }
    }
    s.days[1].value = text(get('7doc_daily_value'),80);
    for (const k of keys) { if (/^7doc_mood_\d{4}-\d{2}-\d{2}$/.test(k)) { const v = Number(get(k)); if (Number.isInteger(v) && v >= 1 && v <= 5) s.moods[k.slice(10)] = v; } }
    return { state: s, migrated: found || !!oldAccess };
  }
  function backup(s) {
    const { access, ...data } = s;
    return { app: '7DOC', exportedAt: new Date().toISOString(), ...data };
  }
  function serializeBackup(s) {
    const json = JSON.stringify(backup(s));
    if (new TextEncoder().encode(json).byteLength > MAX_BACKUP_BYTES) throw new Error('backup_too_large');
    return json;
  }
  function backupRound(s, index = null) {
    const copy = normalize(s);
    if (index !== null) { if (!copy.archives[index]) throw new Error('archive_missing'); copy.days = copy.archives[index].days; }
    copy.archives = [];
    return copy;
  }
  function restore(data, current) {
    if (!isObj(data) || data.app !== '7DOC') throw new Error('Not a 7DOC backup');
    return normalize({ ...data, access: current.access });
  }
  function remaining(s) { return allowed(s).filter(n => !s.days[n-1].completed).length; }
  function calendar(s, now = new Date()) {
    if (!remaining(s)) throw new Error('Program complete');
    const start = new Date(now), [h,m] = s.settings.reminderTime.split(':').map(Number);
    start.setHours(h,m,0,0); if (start <= now) start.setDate(start.getDate()+1);
    const stamp = d => localDate(d).replaceAll('-','') + 'T' + [d.getHours(), d.getMinutes(),0].map(n=>String(n).padStart(2,'0')).join('');
    const en = s.settings.language === 'en';
    return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sash and Ventures//7DOC//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:7doc-'+now.getTime()+'@sashandventures.com','DTSTAMP:'+now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),'DTSTART:'+stamp(start),'DURATION:PT20M','RRULE:FREQ=DAILY;COUNT='+remaining(s),'SUMMARY:7 Days of Change','DESCRIPTION:'+(en?'A moment for your practice. Open your 7DOC app.':'Ein Moment für deine Praxis. Öffne deine 7DOC-App.'),'BEGIN:VALARM','TRIGGER:-PT0M','ACTION:DISPLAY','DESCRIPTION:7 Days of Change','END:VALARM','END:VEVENT','END:VCALENDAR',''].join('\r\n');
  }
  return { KEY, MAX_BACKUP_BYTES, serializeBackup, backupRound, HASHES, METRICS, text, localDate, blankDay, fresh, normalize, entitlements, allowed, allComplete, nextDay, insights, migrate, backup, restore, remaining, calendar };
});
