# 🍌 Cozy Gen Z Ghost RPG: คู่มือคําสั่งสร้างภาพ (Asset Prompts v2 — โหมดความลับสวนกล้วย)

คู่มือฉบับนี้เป็นเวอร์ชันเพิ่มเติมสำหรับการสร้างภาพตัวละคร NPC ใหม่, ภาพฉากหลังสภาพแวดล้อม และภาพประกอบการ์ดเบาะแส (Adventure Card Album) สำหรับเกมโหมดสืบสวนค่ำคืน 7 วันครับ

> [!IMPORTANT]
> **ย้ำเรื่องพื้นหลังสำหรับการเจาะโปร่งแสง:**
> สำหรับสไปรต์ตัวละคร NPC และสิ่งของประกอบฉาก (Props) ทุกตัว ให้ระบุให้มีพื้นหลังเป็น **สีชมพูบานเย็นเข้ม (#FF00FF)** เพื่อใช้สคริปต์เจาะสีพื้นหลังออกได้ทันทีโดยไม่ทำลายขอบสีขาวหรือสีพาสเทลของตัวสไปรต์ครับ

---

## 1. กลุ่มสไปรต์ตัวละคร NPC ใหม่ (New NPC Sprites)

เซฟไฟล์สไปรต์เหล่านี้ไว้ที่โฟลเดอร์: `public/assets/stories/ghost-whisperer/sprites/npc/`

| ไฟล์ปลายทาง | บทบาทการใช้งาน | คำสั่งสร้างภาพ (Prompt Suggestions) |
| :--- | :--- | :--- |
| **npc-chief-down.png**<br>*(ยืนหันหน้าเข้าหาจอ)* | **ผู้ใหญ่บ้าน (ลุงแดง)**<br>ดูใจดีแต่แอบมีพิรุธ | `A single isolated chibi 2D pixel art character sprite of a middle-aged Thai village chief, wearing a retro short-sleeve safari shirt, a striped loincloth cloth (Pha-Khao-Ma) wrapped around his waist, and simple sandals. Suspected look, holding a flashlight in one hand, facing front. Only one character centered, no duplicates, solid bright magenta background (#FF00FF), 2D game asset` |
| **npc-chief-walk1.png**<br>*(ผู้ใหญ่บ้านเดิน)* | ท่าเดินถือมีดฟันกล้วยตอนกลางคืน | `A single isolated chibi 2D pixel art character sprite of a middle-aged Thai village chief in mid-stride walking pose, holding a small vintage machete, wearing a safari shirt and loincloth. Facing front-left profile. Solid bright magenta background (#FF00FF), 2D game asset style` |
| **npc-auntie-down.png**<br>*(ยืนหน้าร้าน)* | **ป้าศรี (ร้านค้าสายมู)**<br>ป้าผู้รู้ความหลังของคุณตา | `A single isolated chibi 2D pixel art character sprite of a cheerful elderly Thai auntie shopkeeper, wearing a retro pastel floral print blouse, large round vintage glasses, hair in a cozy bun, smiling warmly. Facing front. Only one character, solid bright magenta background (#FF00FF), 2D game asset style` |
| **npc-tani-angry.png**<br>*(นางตานีร่างโกรธ)* | **แม่นางตานีร่างจิตวิญญาณ**<br>สำหรับคัตซีนวันที่ 6 และ 7 | `A single isolated chibi cute anime style Nang Tani, Thai banana ghost girl in a spectral angry state, floating, eyes glowing soft green, hair blowing in the wind, wearing a dark green traditional wrap skirt, surrounded by a swirling dark green and black aura, facing front. No duplicates, solid bright magenta background (#FF00FF), 2D game asset` |

---

## 2. ฉากแผนที่และภาพพื้นหลังฉากหลัง (Map Backgrounds & Scenes)

เซฟไฟล์ไว้ที่โฟลเดอร์: `public/assets/stories/ghost-whisperer/tiles/`

| ไฟล์ปลายทาง | รายละเอียดการใช้งาน | คำสั่งสร้างภาพ (Prompt Suggestions) |
| :--- | :--- | :--- |
| **island-background-night.png** | **สวนกล้วยตอนกลางคืน**<br>*(ใช้สำหรับลูปผจญภัยตอนดึก)* | `Top-down 2D game map background of a cozy banana garden at night, dark navy and purple lighting, moon rays filtering through lush banana leaves, tiny glowing green fireflies, watercolor pixel art style, top-down perspective, cozy spooky vibe, no UI elements` |
| **house-interior.png** | **ภายในบ้านสวนไม้ของคุณตา**<br>*(ใช้แสดงหน้าจอช่วงค่ำคืน)* | `Cozy retro interior of an old Thai wooden farmhouse, featuring bamboo mats on the floor, a vintage transistor radio, a warm glowing oil lamp, shelves with old books, and a wooden window looking out into the dark banana trees. Warm golden lighting, 2D game background asset, watercolor watercolor style` |

---

## 3. สิ่งของปริศนาประกอบฉากใหม่ (New Props & Objects)

เซฟไฟล์ทั้งหมดไว้ที่โฟลเดอร์: `public/assets/stories/ghost-whisperer/tiles/`

| ไฟล์ปลายทาง | วัตถุประสงค์ | คำสั่งสร้างภาพ (Prompt Suggestions) |
| :--- | :--- | :--- |
| **prop-grandpa-box.png** | **กล่องล็อกไม้ของคุณตา**<br>*(เบาะแสหลักในวันที่ 3)* | `Cozy 2D game prop of a small vintage dark wood box with a retro rusty brass lock, faint banana leaf details carved on top, pixel art style. Isolated on a solid bright magenta background (#FF00FF)` |
| **prop-old-lantern.png** | **ตะเกียงโบราณของคุณตา**<br>*(ใช้ถือเพิ่มแสงสว่างช่วงกลางคืน)* | `Cozy 2D game prop of an antique metal hurricane oil lamp, warm amber light glowing inside, rustic green metal frame, pixel art style. Isolated on a solid bright magenta background (#FF00FF)` |

---

## 4. กลุ่มภาพบนการ์ดบันทึกการผจญภัย (Adventure Log Cards Art)

ภาพการ์ดเหล่านี้จะแสดงเป็นหน้าปกการ์ดในระบบ **สมุดสะสมการ์ดบันทึก (Adventure Log)**
เซฟไฟล์รูปภาพไว้ที่: `public/assets/stories/ghost-whisperer/cards/`
*(แนะนำขนาดภาพอัตราส่วน 3:4 เช่น 600x800 พิกเซล)*

### 🧑‍🤝‍🧑 หมวดหมู่: การ์ดตัวละคร (Character Cards)

*   **card-grandpa-retro.png** (คุณตาในอดีต)
    *   **Prompt:** `A nostalgic vintage polaroid photo style graphic for a game card. A young Thai farmer in his 25s smiling warmly in a lush organic green banana orchard, holding a bundle of bananas. Cozy warm retro color grade, soft sunlight, border of a Polaroid photograph, 2D game card artwork`
*   **card-suspicious-chief.png** (ผู้ใหญ่บ้านลุงแดง)
    *   **Prompt:** `A vertical fantasy card art featuring a suspicious Thai man in his 50s holding a flashlight that casts a sharp cone of light in a dark forest, shadow covering half of his face, green glowing leaves in the background. Mystical tarot card style border, gold and green theme, 2D game asset`
*   **card-tani-cozy.png** (นางตานีสตรีทแฟชั่น)
    *   **Prompt:** `A beautiful cozy anime card art of a friendly Thai green banana ghost girl, smiling, floating next to a modern styled white wooden spirit house shrine. Soft warm magic light, watercolor aesthetic, fantasy 2D game card illustration`

---

### 📂 หมวดหมู่: การ์ดเบาะแสความลับ (Clue & Secret Cards)

*   **card-torn-diary.png** (เศษบันทึกที่ขาดหาย)
    *   **Prompt:** `A vertical card illustration of a piece of aged, burned ancient parchment paper showing handwritten Thai scripts and sketches of a banana leaf with magical runes. Lying on a dark wooden table under candlelight. Cozy mystery vibe, 2D game artifact style`
*   **card-village-pact.png** (คัมภีร์ยันต์พันธสัญญา)
    *   **Prompt:** `A glowing gold and black talisman paper card, inscribed with complex sacred Thai magical geometry yantra runes (Yant). Magical roots wrapping around the paper, dark background, glowing emerald green aura. Occult fantasy game asset`
*   **card-tani-essence.png** (น้ำมันพรายตานีพาสเทล)
    *   **Prompt:** `A cute miniature perfume glass bottle containing glowing green magical liquid, wrapped with a tiny yellow sacred thread ribbon. Placed on a large wet banana leaf with dew drops. Soft cozy render, Y2K aesthetic, game item icon card`

---

### 🎬 หมวดหมู่: การ์ดเหตุการณ์และการตัดสินใจ (Decision & Event Cards)

*   **card-door-peek.png** (แอบมองผ่านประตู)
    *   **Prompt:** `A first-person view looking through a slightly open old wooden door from a dark room. Outside, a glowing green silhouette is visible among tall banana tree leaves under moonlight. Cinematic composition, soft light rays, cozy suspense, 2D game story scene illustration`
*   **card-midnight-search.png** (ตามหาในความมืด)
    *   **Prompt:** `A cute chibi character with a flashlight exploring a dark dense banana plantation at night. Tall dark green banana leaves silhouetted against a starry dark blue night sky, magical fireflies glowing. Cozy dark fantasy, watercolor game background style`
*   **card-the-climax.png** (ศึกวันตัดต้นกล้วย)
    *   **Prompt:** `A dramatic illustration of angry villagers holding rusty axes and tools facing off against giant glowing green banana tree leaves rising into a storm. Lightning striking, shadows and high contrast, cinematic epic game card art`
