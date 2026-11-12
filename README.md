# SE Intern Simulator — Research Edition

SE Intern Simulator v1.2.0 (จาก [chontipan/swe-intern-game](https://github.com/chontipan/swe-intern-game)) + research logger
ตรรกะเกม ค่าสถานะ และ scenario **ไม่เปลี่ยน** — logger เป็นสคริปต์แยกท้าย `index.html` ที่ห่อฟังก์ชันเดิมเพื่อบันทึกข้อมูล

## URL parameters
| พารามิเตอร์ | ผล |
|---|---|
| `?study` | หน้ายินยอม + กรอกรหัสผู้เข้าร่วม |
| `?pid=P001` | กำหนดรหัสผู้เข้าร่วมผ่านลิงก์ |
| `?group=exp` | ระบุกลุ่ม |
| `?endpoint=<URL>` | ส่งข้อมูลเข้า Google Apps Script |
| `?admin` | แผงดาวน์โหลด CSV/JSON |

ตัวอย่าง: `https://chontipan.github.io/swe-intern-game-research/?study&group=exp`

## ข้อมูลที่บันทึก
- **choices** (รายสัปดาห์): week, scenario_title, source_ref, choice_idx, choice_text, rt_ms, feedback_ms, input (click/key), stats ก่อน/หลัง, net_money, sent_back
- **sessions** (รายรอบ): pid, group, attempt, role, company, company_rerolls, weeks_completed, ending_badge, career_choice, final stats, tab_hidden_count, research_modal_count

เก็บใน localStorage เสมอ; ส่งเข้า Google Sheets เมื่อมี endpoint (upsert ตาม session_id)

## ตั้งค่า Google Sheets
1. สร้าง Google Sheet → Extensions → Apps Script → วาง `apps-script/Code.gs`
2. Deploy → Web app → Execute as: Me, Access: Anyone
3. ใส่ URL ใน `DEFAULT_ENDPOINT` (ใน `index.html`) หรือส่งผ่าน `?endpoint=`

## หมายเหตุสำหรับงานวิจัย
- ค่าสถานะในเกมไม่ถูก clamp ที่ 0 (เช่น energy ติดลบได้)
- `rt_ms` อาจยาวผิดปกติถ้าผู้เล่นสลับแท็บ — คัดกรองด้วย `tab_hidden_count`
