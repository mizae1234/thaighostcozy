# PROJECT BRIEF: เกาะปลาบู่ทอง (Thai Folklore Survival Game — MVP)

## 1. ภาพรวมโปรเจกต์

เกม survival/idle แนวเดียวกับ "Castaway Cove" (เดินสำรวจเกาะ, เก็บทรัพยากร,
craft ของ, ดูแลค่า Hunger/Thirst/Health, ทำ quest) แต่ใช้ธีมนิทานพื้นบ้านไทย
เริ่มจากเรื่อง **ปลาบู่ทอง** เป็น episode/MVP แรก

**เป้าหมายทางธุรกิจ**: ทดสอบตลาดไทย (niche, คู่แข่งน้อยเพราะไม่มีใครทำ Thai
folklore survival game) ก่อนตัดสินใจขยายเป็นหลายเกาะ/นิทานอื่น (เช่น สังข์ทอง)
หรือปรับให้ขายตลาดสากลในอนาคต (mechanic สากล + theme "exotic SEA folklore")

**สถานะผู้พัฒนา**: Solo developer, มีพื้นฐาน Next.js + PostgreSQL (Prisma) +
มี VPS อยู่แล้ว ยังไม่เคยทำเกมมาก่อน

## 2. Tech Stack ที่ตัดสินใจแล้ว

- **Frontend/Render**: Phaser 3 (TypeScript) — embed canvas ไว้ใน Next.js
  page เดียว (เช่น route `/play`)
- **Game state ขณะเล่น**: เก็บใน client (React state/Zustand) ไม่ sync ทุก
  frame กับ server
- **Persistence**: Next.js API routes → Prisma → PostgreSQL (ของเดิมที่มี)
  - Server-authoritative pattern แนะนำในระยะยาว (กัน cheat) แต่ MVP เก็บ
    state ง่ายๆ พอ
- **Auth**: ใช้ระบบเดิมที่ถนัด หรือไม่ต้อง login ก่อนสำหรับทดสอบรอบแรกก็ได้
- **Asset**: หา free pixel art tileset จาก itch.io ("tropical island
  tileset") ไม่วาดเองเพื่อประหยัดเวลา
- **Content pipeline**: มี Claude skill ชื่อ `story-thai` ที่ใช้ gen
  เนื้อเรื่อง/scene list/บทพูดภาษาไทยอยู่แล้ว — ควรออกแบบ format ทางเกม
  (JSON quest steps) ให้ตรงกับ output ของ skill นี้ เพื่อให้ pipeline
  "เขียนนิทาน → เข้าเกมได้ทันที" ไม่ต้องแปลงมือ

## 3. หลักการ Design เผื่ออนาคต (ตัดสินใจไว้แล้ว)

**ควร design เผื่อตั้งแต่ต้น** (แก้ยากทีหลัง):
- DB schema ต้องรองรับหลาย "story/island" ตั้งแต่แรก แม้ MVP มีแค่เรื่องเดียว
  - แนะนำตาราง: `Story` (id, name, theme) → `Quest` → `PlayerProgress`
  - ห้าม hardcode เนื้อเรื่อง/ชื่อไอเทมเฉพาะเจาะจงไว้ในโค้ด logic ตรงๆ
    ให้เก็บเป็น data record แทน
- Asset folder แยกตาม story ตั้งแต่ต้น เช่น `/assets/stories/pla-boo-thong/`
  ไม่ใช่ยัดรวมกันหมด

**ไม่ต้อง design เผื่อตอนนี้** (เพิ่มทีหลังได้โดยไม่กระทบ schema):
- Multiplayer/realtime sync
- Combat system, skill tree ซับซ้อน
- IAP/payment integration
- Character customization / หลายตัวละคร

## 4. ขอบเขต MVP (Definition of Done)

Core loop ที่ต้องมีแค่นี้:
1. ตัวละครเดิน 4 ทิศ บนแมพเดียว (ไม่ต้องหลายฉาก)
2. เก็บทรัพยากร 3 อย่าง: ไม้, มะพร้าว, หิน
3. Craft ของ 3-4 อย่าง: ขวาน/มีด, กองไฟ, ที่พัก
4. แถบ Hunger/Thirst ลดตามเวลา, กินมะพร้าวฟื้นค่า
5. Quest เดียวจบใน 1 episode (ดูหัวข้อ 5)

**ตัดออกจาก MVP ทั้งหมด**: multiplayer, IAP, หลายเกาะ, combat, crafting
tree ซับซ้อน, character customization

**Definition of Done**: ผู้เล่นเล่นจบ episode ได้ภายใน 10–15 นาที และรู้สึก
"อยากรู้ต่อ" (โดยเฉพาะช่วง hook ตอนจบ) — ถ้า playtester ไม่รู้สึกแบบนี้ ต้อง
กลับไปปรับ core loop/dialogue ก่อนเพิ่ม content

## 5. เนื้อเรื่อง + Quest Flow: "ตามหาปลาบู่ทอง"

อ้างอิงนิทานเดิม: นางเอื้อยถูกแม่เลี้ยง/นางรจนา (น้องสาวต่างแม่) กลั่นแกล้งจน
ตาย กลายเป็นปลาบู่ทอง คอยช่วยเหลือคนตกทุกข์ได้ยาก — ในเกม ตัวเอกเป็น
"ผู้เรือแตก" (ไม่ใช่นางเอื้อย) ที่มาเจอปลาบู่ทองบนเกาะ

**Quest Step 1 — คลื่นซัดขึ้นฝั่ง**
- เก็บไม้ 5, มะพร้าว 2 → คราฟต์กองไฟ
- Reward: มีด

**Quest Step 2 — เสียงเพลงจากบ่อน้ำ**
- เดินสำรวจเจอบ่อน้ำกลางเกาะ ได้ยินเสียงร้องเพลงแปลก (ปลาบู่ทอง ยังไม่เห็นตัว)
- Mechanic: เก็บลูกไม้ 3 ลูกมาโปรยล่อ
- Reward: เศษกระดูกปลาทองประหลาด (quest item)

**Quest Step 3 — ปลาบู่ทองปรากฏตัว**
- Dialogue scene: ปลาบู่ทองเล่าว่าคือดวงวิญญาณนางเอื้อยที่ถูกสาปไว้บนเกาะ
  ขอให้ผู้เล่นช่วยเก็บของ 3 อย่างเพื่อปลดคำสาป
- เปิด quest ย่อย 3 อัน: ดอกไม้ศักดิ์สิทธิ์ / เปลือกหอยมุก / ไม้จันทน์

**Quest Step 4 — เก็บของสามอย่าง**
- 3 จุดบนแมพ, บางจุดต้องมีเครื่องมือที่ปลดล็อกมาก่อน (เช่น ต้องมีมีดก่อน
  ตัดไม้จันทน์) → ใช้สอน mechanic "crafting-gate" แบบเบาๆ

**Quest Step 5 — ปลดคำสาป / จบ episode**
- นำของ 3 อย่างไปคืนที่บ่อน้ำ → cutscene ปลาบู่ทองแปลงกาย/หายไปอย่างสงบ
  ทิ้ง "แหวนวิเศษ" ไว้ (teaser สำหรับเกาะถัดไป เช่น เกาะสังข์ทอง)
- ขึ้นจอ "จบบทที่ 1" + ปลดล็อกไอคอนล็อกอันถัดไป (UI pattern แบบแถบ 8
  ไอคอนล็อกด้านล่างจอ อ้างอิงจาก Castaway Cove)

**จุดทดสอบสำคัญ**: หลัง step 3 ผู้เล่นควรอยากรู้ว่า "แหวนวิเศษ" ตอนจบคือ
อะไร ถ้า playtester ไม่รู้สึกกระตุ้นความสงสัย ต้องปรับบทพูดปลาบู่ทองใหม่

## 6. งานที่ยังไม่ได้ทำ (Next Steps)

- [ ] ออกแบบ Prisma schema จริง (Story, Quest, PlayerProgress, Item,
      Inventory) รองรับหลาย story ตั้งแต่ต้น
- [ ] Scaffold Next.js + Phaser 3 project เริ่มต้น (ตัวละครเดินได้บนแมพ
      static)
- [ ] เขียนบทพูดปลาบู่ทองแบบเต็ม (ใช้ skill `story-thai`)
- [ ] หา/เตรียม pixel art tileset จาก itch.io
- [ ] Timeline โดยประมาณ (นอกเวลางาน, solo dev): 6 สัปดาห์ถึง MVP เล่นจบได้
      (สัปดาห์ 1-2 เดิน+แมพ, 3 inventory, 4 crafting+hunger/thirst, 5 quest+
      dialogue, 6 save/load+polish+playtest)

## 7. บริบทเพิ่มเติมเกี่ยวกับผู้พัฒนา (สำหรับ Claude Code)

- ถนัด TypeScript, Next.js, Prisma, PostgreSQL, openpyxl/Python สำหรับงาน
  data ฝั่งอื่น (ไม่เกี่ยวกับเกมนี้)
- มี Claude skill files สำหรับ content generation ภาษาไทยอยู่แล้ว:
  `story-thai`, `lakorn-kuntham`, `cartoon-3d-pixar`, `film-skill` — ควร
  ใช้ประโยชน์จาก pipeline เหล่านี้ในการ gen เนื้อเรื่อง/scene/บทพูด แทนเขียน
  ใหม่ทั้งหมด
- ทำงานหลักภาษาไทย ต้องการให้ dialogue/UI/เนื้อหาในเกมเป็นภาษาไทยเป็นหลัก
