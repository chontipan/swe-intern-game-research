# SE Intern Simulator — Research Edition

SE Intern Simulator **v1.3.0** — ต่อยอดจาก v1.2.0 ( [chontipan/swe-intern-game](https://github.com/chontipan/swe-intern-game)) + research logger
scenario และค่าผลกระทบของแต่ละตัวเลือก **ไม่เปลี่ยน** — logger เป็นสคริปต์แยกท้าย `index.html`

## การเปลี่ยนแปลง v1.3.0 (เพื่อความถูกต้องของการวิจัย)
- สุ่มลำดับตัวเลือกต่อสัปดาห์ (v1.2.0: ตัวเลือก 1 ให้ skill สูงสุด 84%, ตัวเลือก 3 karma ต่ำสุด 78% ของ scenario dev/devops)
- จำกัด skill/energy/sanity/karma ที่ 0–100 (เงื่อนไขแพ้ `<= 0` เหมือนเดิม)
- ตัดตัวเลขค่าสถานะออกจาก hint ในโหมด study
- ล็อกบริษัท / ปิดการสุ่มบริษัทใหม่
- แสดงเวอร์ชันที่ footer; log บันทึก `display_pos`, `display_order` และเงื่อนไขการทดลอง

## URL parameters
| พารามิเตอร์ | ผล |
|---|---|
| `?study` | หน้ายินยอม + กรอกรหัสผู้เข้าร่วม |
| `?pid=P001` | กำหนดรหัสผู้เข้าร่วมผ่านลิงก์ |
| `?group=exp` | ระบุกลุ่ม |
| `?endpoint=<URL>` | ส่งข้อมูลเข้า Google Apps Script |
| `?admin` | แผงดาวน์โหลด CSV/JSON |
| `?shuffle=on\|off` | สุ่มลำดับตัวเลือก (study: on) |
| `?hint=full\|text\|off` | hint เต็ม / ตัดตัวเลข / ซ่อน (study: text) |
| `?src=show\|hide` | แสดงกล่องที่มางานวิจัย (เงื่อนไข A/B) |
| `?company=startup\|bigcorp\|softwarehouse\|gov` | ล็อกบริษัท |
| `?reroll=on\|off` | อนุญาตสุ่มบริษัทใหม่ (study: off) |

ตัวอย่าง: `https://chontipan.github.io/swe-intern-game-research/?study&group=exp`

## ข้อมูลที่บันทึก
- **choices** (รายสัปดาห์): week, scenario_title, source_ref, choice_idx (ลำดับเดิม), display_pos (ตำแหน่งที่แสดง), display_order, choice_text, rt_ms, feedback_ms, input (click/key), stats ก่อน/หลัง, net_money, sent_back
- **sessions** (รายรอบ): pid, group, attempt, role, company, company_rerolls, weeks_completed, ending_badge, career_choice, final stats, tab_hidden_count, research_modal_count

เก็บใน localStorage เสมอ; ส่งเข้า Google Sheets เมื่อมี endpoint (upsert ตาม session_id)

## ตั้งค่า Google Sheets
1. สร้าง Google Sheet → Extensions → Apps Script → วาง `apps-script/Code.gs`
2. Deploy → Web app → Execute as: Me, Access: Anyone
3. ใส่ URL ใน `DEFAULT_ENDPOINT` (ใน `index.html`) หรือส่งผ่าน `?endpoint=`

## หมายเหตุสำหรับงานวิจัย
- `rt_ms` อาจยาวผิดปกติถ้าผู้เล่นสลับแท็บ — คัดกรองด้วย `tab_hidden_count`

## ตัวอย่างลิงก์ A/B
- กลุ่ม A (มีหลักฐานงานวิจัย): `?study&group=A&src=show&company=softwarehouse`
- กลุ่ม B (ไม่มี): `?study&group=B&src=hide&company=softwarehouse`
