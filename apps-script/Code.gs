/**
 * SE Intern Simulator — Research Log receiver (Google Apps Script)
 * วิธีใช้: สร้าง Google Sheet > Extensions > Apps Script > วางโค้ดนี้
 * Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone
 * นำ URL ที่ได้ไปใส่ DEFAULT_ENDPOINT ใน index.html หรือส่งผ่าน ?endpoint=<URL>
 * ข้อมูล upsert ตาม session_id (ส่งซ้ำ/partial จะเขียนทับแถวเดิม)
 */
const STATS = ['skill', 'energy', 'sanity', 'karma', 'money'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const s = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const fs = s.final_stats || (s.choices.length ? s.choices[s.choices.length - 1].after : {});

    upsert(sheet(ss, 'sessions', ['session_id', 'pid', 'group', 'attempt', 'role', 'company', 'company_rerolls',
      'weeks_completed', 'ending_badge', 'career_choice', 'sent_back', ...STATS.map(k => 'final_' + k),
      'started_at', 'ended_at', 'partial', 'tab_hidden_count', 'research_modal_count', 'game_version', 'user_agent']),
      s.session_id, [[s.session_id, s.pid, s.group, s.attempt, s.role, s.company, s.company_rerolls,
        s.weeks_completed, s.ending_badge || 'INCOMPLETE', s.career_choice, s.sent_back, ...STATS.map(k => fs[k]),
        s.started_at, s.ended_at, !!s.partial,
        s.events.filter(x => x.type === 'tab_hidden').length,
        s.events.filter(x => x.type === 'research_modal').length, s.game_version, s.user_agent]]);

    upsert(sheet(ss, 'choices', ['session_id', 'pid', 'group', 'attempt', 'role', 'company', 'week', 'scenario_title',
      'source_ref', 'choice_idx', 'choice_text', 'rt_ms', 'feedback_ms', 'input', ...STATS.map(k => k + '_before'),
      ...STATS.map(k => k + '_after'), 'net_money', 'sent_back', 'timestamp']),
      s.session_id, s.choices.map(c => [s.session_id, s.pid, s.group, s.attempt, c.role, c.company, c.week,
        c.scenario_title, c.source_ref, c.choice_idx + 1, c.choice_text, c.rt_ms, c.feedback_ms, c.input,
        ...STATS.map(k => c.before[k]), ...STATS.map(k => c.after[k]), c.net_money, c.sent_back, c.t]));

    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

function sheet(ss, name, header) {
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); }
  return sh;
}

// ลบแถวเดิมของ session_id แล้วเขียนใหม่
function upsert(sh, id, rows) {
  const n = sh.getLastRow();
  if (n > 1) {
    const ids = sh.getRange(2, 1, n - 1, 1).getValues();
    for (let i = ids.length - 1; i >= 0; i--) if (ids[i][0] === id) sh.deleteRow(i + 2);
  }
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}
