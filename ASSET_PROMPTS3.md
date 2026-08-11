# 🍌 Cozy Gen Z Ghost RPG: คู่มือคําสั่งสร้างภาพ (Asset Prompts v3 — ฉากขยาย วัดและตลาด)

คู่มือฉบับนี้เป็นเวอร์ชันเพิ่มเติมสำหรับการสร้างแผนที่ภาพพื้นหลังใหม่ (วัดและตลาด) ทั้งในช่วงเวลากลางวันและกลางคืน รวมถึงสไปรต์ตัวละคร (NPC/วิญญาณ) ที่จะมาปรากฏในพื้นที่ขยายเหล่านี้ เพื่อสนับสนุนระบบเดินเปลี่ยนแผนที่และลูประทึกตอนกลางคืนครับ

> [!IMPORTANT]
> **ย้ำเรื่องสไปรต์ประกอบฉากและ NPC:**
> สำหรับสไปรต์ตัวละครหรือสิ่งของวางตกแต่ง (Props) ทุกชิ้น ให้กำหนดภาพพื้นหลังเป็น **สีชมพูบานเย็นเข้ม (#FF00FF)** เสมอ เพื่อนำไปลบสีฉากหลังออกด้วยสคริปต์ได้โดยไม่กระทบขอบภาพจริง

---

## 1. ฉากแผนที่และภาพพื้นหลังพื้นที่ใหม่ (New Map Backgrounds)

เซฟไฟล์รูปภาพไว้ที่โฟลเดอร์: `public/assets/stories/ghost-whisperer/tiles/`
*(แนะนำขนาดภาพอัตราส่วน 16:9 เช่น 1280x720 หรือ 1024x576 พิกเซล)*

| ไฟล์ปลายทาง | รายละเอียดการใช้งาน | คำสั่งสร้างภาพ (Prompt Suggestions) |
| :--- | :--- | :--- |
| **temple-background.png** | **วัดไทยยามกลางวัน**<br>*(ขอบขวาเชื่อมสวนกล้วย)* | `Top-down 2D game map background of a quiet Thai Buddhist temple grounds during daytime. Featuring a golden pagoda (chedi), a small ancient teak wood chapel, sand-covered yard, green bodhi trees, and stone steps. Bright sunny lighting, pixel art style, top-down perspective, cozy rustic vibe, 16:9 aspect ratio, no UI elements` |
| **temple-background-night.png** | **วัดไทยยามกลางคืน**<br>*(ขอบขวาเชื่อมสวนกล้วย)* | `Top-down 2D game map background of a Thai Buddhist temple grounds at night. A golden pagoda casts a warm soft glow, glowing yellow paper lanterns hanging from old tree branches, deep purple and dark navy shadows, thin mist floating near the ground, cozy spooky vibe, pixel art style, top-down perspective, 16:9 aspect ratio` |
| **market-background.png** | **ตลาดชนบทยามกลางวัน**<br>*(ขอบซ้ายเชื่อมสวนกล้วย)* | `Top-down 2D game map background of a Thai countryside marketplace during daytime. Featuring wooden stalls, colorful market umbrellas, crates of fresh fruits (bananas, coconuts), dirt paths, and simple wooden tables. Bright natural daylight, pixel art style, top-down perspective, cozy vibe, 16:9 aspect ratio, no UI` |
| **market-background-night.png** | **ตลาดชนบทยามค่ำคืน**<br>*(ขอบซ้ายเชื่อมสวนกล้วย)* | `Top-down 2D game map background of a Thai countryside market at night. Hanging incandescent warm light bulbs glowing above empty wooden stalls, long dark shadows, a cozy yet desolate nighttime atmosphere, warm orange lights contrasting with dark navy background, pixel art style, top-down perspective, 16:9 aspect ratio` |

---

## 2. กลุ่มสไปรต์ตัวละคร NPC พื้นที่ใหม่ (New Area NPC Sprites)

เซฟไฟล์สไปรต์เหล่านี้ไว้ที่โฟลเดอร์: `public/assets/stories/ghost-whisperer/sprites/npc/`

| ไฟล์ปลายทาง | บทบาทการใช้งาน | คำสั่งสร้างภาพ (Prompt Suggestions) |
| :--- | :--- | :--- |
| **npc-monk-down.png** | **หลวงพี่ / พระสงฆ์**<br>สำหรับให้พรและรับเครื่องสังฆทานในวัด | `A single isolated chibi 2D pixel art character sprite of a young Thai Buddhist monk wearing orange robes, standing calm with hands folded, peaceful facial expression. Facing front. Only one character centered, solid bright magenta background (#FF00FF), 2D game asset` |
| **npc-vendor-down.png** | **พ่อค้าแม่ค้าตลาด**<br>สำหรับตั้งรับขายกล้วยหรือขายของ | `A single isolated chibi 2D pixel art character sprite of a cheerful middle-aged Thai market vendor wearing a blue apron, holding a small scale or fruit basket, smiling warmly. Facing front. Solid bright magenta background (#FF00FF), 2D game asset style` |
| **npc-lotto-vendor.png** | **คนขายหวย/สลากสายมู**<br>ขายสลากเลขท้าย 2 ตัวที่ตลาด | `A single isolated chibi 2D pixel art character sprite of a friendly Thai lottery vendor, wearing a straw hat and a retro polo shirt, holding a large wooden display board filled with colorful lottery tickets. Facing front, solid bright magenta background (#FF00FF), 2D game asset` |

---

## 3. สิ่งของเรืองแสงและศัตรูยามราตรี (Night Spooky Items & Ghosts)

เซฟไฟล์สิ่งของไว้ที่: `public/assets/stories/ghost-whisperer/tiles/` และผีไว้ที่: `public/assets/stories/ghost-whisperer/sprites/npc/`

| ไฟล์ปลายทาง | บทบาทการใช้งาน | คำสั่งสร้างภาพ (Prompt Suggestions) |
| :--- | :--- | :--- |
| **prop-night-herb.png** | **ว่านตานีราตรีเรืองแสง**<br>สมุนไพรงอกเฉพาะกลางคืน | `A single isolated 2D game prop of a rare glowing green magical Thai herb plant, soft emerald green light emanating from its leaves, watercolor pixel art style. Centered, solid bright magenta background (#FF00FF)` |
| **npc-shadow-spirit.png** | **วิญญาณเร่ร่อน / เงาดำ**<br>ศัตรูที่คอยไล่กวดผู้เล่นยามดึก | `A single isolated chibi 2D pixel art character sprite of a spooky Thai shadow ghost, a floating translucent dark smoke form with glowing red eyes, stylized cute but creepy design. Solid bright magenta background (#FF00FF), 2D game asset` |
| **prop-siansi.png** | **กระบอกไม้เสี่ยงเซียมซี**<br>สำหรับตั้งไว้เสี่ยงเซียมซีรายวันที่วัด | `A isolated 2D game prop of a traditional red wooden fortune stick shaker cup (siansi cup) with bamboo sticks inside, cozy Thai temple aesthetic, pixel art style. Centered, solid bright magenta background (#FF00FF)` |
