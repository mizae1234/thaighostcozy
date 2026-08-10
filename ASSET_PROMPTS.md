# 🍌 Cozy Gen Z Ghost RPG: คู่มือคําสั่งสร้างภาพ (Asset Prompts)

คู่มือนี้สำหรับใช้คัดลอกคำสั่ง (Prompts) ไปสร้างภาพกราฟิกด้วย AI (เช่น Midjourney, DALL-E 3 หรือโปรแกรมสร้างภาพอื่นๆ) แล้วนำมาเซฟลงในโฟลเดอร์ของเกมตามที่ระบุไว้ครับ

> [!IMPORTANT]
> **เทคนิคการเจาะพื้นหลัง (Anti-Transparency Bug):**
> เนื่องจากตัวละครของคุณใส่กางเกงคาร์โก้สีขาว การใช้ AI สร้างภาพบนพื้นหลังสีขาวจะทำให้สคริปต์ลบภาพกลืนขากางเกงสีขาวไปจนโปร่งแสง 
> **ดังนั้น ให้ใช้คำสั่งสร้างภาพบนพื้นหลังสีชมพูบานเย็น (Solid Bright Magenta Background `#FF00FF`) หรือส่งออกเป็นรูปโปร่งแสง (Transparent PNG) โดยตรงครับ**

---

## 1. กลุ่มสไปรต์ตัวละคร (Player & NPC Sprites)

### 🧑‍🎤 ตัวละครผู้เล่น (Gen Z Player)
เซฟไฟล์ไว้ที่โฟลเดอร์: `public/assets/stories/ghost-whisperer/sprites/player/`

| ไฟล์ปลายทาง | คำสั่งสร้างภาพ (Prompt Suggestions) |
| :--- | :--- |
| **player-down1.png**<br>*(ยืนหันหน้าเข้าหาจอ)* | `A single isolated chibi 2D pixel art character sprite of a trendy Gen Z youth player character, facing front, standing idle, wearing an oversized green hoodie, headphones around neck, dark grey cargo pants, and green sneakers. Only one character centered in the frame, no duplicates, no character sheet, solid bright magenta background (#FF00FF), 2D game asset style` |
| **player-down-walk1.png**<br>*(เดินหน้า: ก้าวเท้าซ้าย)* | `A single isolated chibi 2D pixel art character sprite of a trendy Gen Z youth player character, facing front, walking forward (mid-stride pose, left leg stepped forward), wearing an oversized green hoodie, headphones around neck, dark grey cargo pants, and green sneakers. Only one character centered in the frame, no duplicates, no character sheet, solid bright magenta background (#FF00FF), 2D game asset style` |
| **player-down-walk2.png**<br>*(เดินหน้า: ก้าวเท้าขวา)* | `A single isolated chibi 2D pixel art character sprite of a trendy Gen Z youth player character, facing front, walking forward (mid-stride pose, right leg stepped forward), wearing an oversized green hoodie, headphones around neck, dark grey cargo pants, and green sneakers. Only one character centered in the frame, no duplicates, no character sheet, solid bright magenta background (#FF00FF), 2D game asset style` |
| **player-up1.png**<br>*(ยืนหันหลังให้จอ)* | `A single isolated chibi 2D pixel art character sprite of a trendy Gen Z youth player character, facing backward (back view), wearing an oversized green hoodie with hood down, headphones around neck, dark grey cargo pants, and green sneakers. Only one character centered in the frame, no duplicates, no character sheet, solid bright magenta background (#FF00FF), 2D game asset style` |
| **player-left1.png**<br>*(ยืนหันไปทางซ้าย)* | `A single isolated chibi 2D pixel art character sprite of a trendy Gen Z youth player character, left side profile view, wearing an oversized green hoodie, headphones around neck, dark grey cargo pants, and green sneakers. Only one character centered in the frame, no duplicates, no character sheet, solid bright magenta background (#FF00FF), 2D game asset style` |
| **player-left-walk1.png**<br>*(เดินซ้าย: ท่าก้าวเดิน)* | `A single isolated chibi 2D pixel art character sprite of a trendy Gen Z youth player character, left side profile view, in mid-stride walking pose (left profile walking step), wearing an oversized green hoodie, headphones around neck, dark grey cargo pants, and green sneakers. Only one character centered in the frame, no duplicates, no character sheet, solid bright magenta background (#FF00FF), 2D game asset style` |
| **player-right1.png**<br>*(ยืนหันไปทางขวา)* | `A single isolated chibi 2D pixel art character sprite of a trendy Gen Z youth player character, right side profile view, wearing an oversized green hoodie, headphones around neck, dark grey cargo pants, and green sneakers. Only one character centered in the frame, no duplicates, no character sheet, solid bright magenta background (#FF00FF), 2D game asset style` |
| **player-right-walk1.png**<br>*(เดินขวา: ท่าก้าวเดิน)* | `A single isolated chibi 2D pixel art character sprite of a trendy Gen Z youth player character, right side profile view, in mid-stride walking pose (right profile walking step), wearing an oversized green hoodie, headphones around neck, dark grey cargo pants, and green sneakers. Only one character centered in the frame, no duplicates, no character sheet, solid bright magenta background (#FF00FF), 2D game asset style` |

---

### 👻 วิญญาณแม่นางตานี (Nang Tani NPC)
**ชื่อไฟล์:** `golden-goby.png` *(วางในโฟลเดอร์ `public/assets/stories/ghost-whisperer/sprites/npc/`)*

*   **คำสั่งสร้างภาพ:**
    `A single isolated chibi cute anime style Nang Tani, a friendly Thai banana tree ghost girl, floating, facing forward, wearing Y2K green crop top and traditional wrap skirt, holding a bubble tea cup, smiling, green aura, 2D game asset. Only one character centered in the frame, no duplicates, solid bright magenta background (#FF00FF)`

---

## 2. ฉากแผนที่หลัก (Map Background)
เซฟไฟล์ไว้ที่: `public/assets/stories/ghost-whisperer/tiles/island-background.png`
*(ความละเอียดแนะนำ: 1280x720 พิกเซล)*

*   **คำสั่งสร้างภาพ:**
    `Top-down 2D game map background of a cozy organic banana garden, featuring lush green grass turf paths, rows of neat banana trees, small dirt pathways, cozy watercolor painted style, pixel art friendly, high resolution, top-down perspective, no user interface elements`

---

## 3. สิ่งก่อสร้างและสิ่งของบนแผนที่ (Buildings & Props)
เซฟไฟล์ทั้งหมดไว้ที่โฟลเดอร์: `public/assets/stories/ghost-whisperer/tiles/`

| ชื่อไฟล์ที่ต้องการ | สิ่งที่ต้องการแทนที่ | คำสั่งสร้างภาพ (Prompt Suggestions) |
| :--- | :--- | :--- |
| **prop-palm-tree.png** | **ต้นกล้วย**<br>*(แทนต้นมะพร้าวเดิม)* | `Cozy 2D game prop of a cute leafy banana tree with a small bunch of yellow bananas, watercolor painted pixel art style. Isolated on a solid bright magenta background (#FF00FF)` |
| **prop-crate.png** | **กองแผ่นไม้**<br>*(แทนลังไม้ผุเดิม)* | `Cozy 2D game prop of a neat stack of Muji pine wood planks, minimalist style, 2D game asset. Isolated on a solid bright magenta background (#FF00FF)` |
| **prop-rocks.png** | **หินวัดเก่า**<br>*(แทนโขดหินเดิม)* | `Cozy 2D game prop of smooth stack of white garden stones, zen stones, pixel art style. Isolated on a solid bright magenta background (#FF00FF)` |
| **prop-campfire.png** | **ศาลพระภูมิมูจิ**<br>*(แทนกองไฟแคมป์)* | `Minimalist aesthetic white wooden Muji spirit house shrine, cozy warm light glowing inside, 2D game building asset. Isolated on a solid bright magenta background (#FF00FF)` |
| **prop-shop.png** | **ร้านค้าสายมู**<br>*(ร้านขายเครื่องเซ่น)* | `A cute street-food style shop stall, cozy wooden cart with a tiny green canopy, decorated with small bubble tea cups and fruits, warm lighting, 2D game building asset. Isolated on a solid bright magenta background (#FF00FF)` |
| **prop-fallen-fruit.png** | **กิ๊บหนีบผมตานี** | `Cute pastel green banana leaf shaped hair claw clip, Y2K accessory, shiny, 2D game item asset. Isolated on a solid bright magenta background (#FF00FF)` |
| **prop-flower.png** | **ดอกไม้บำบัด** | `Beautiful yellow marigold flower blossom, sacred offering flower, pixel art style, 2D game item asset. Isolated on a solid bright magenta background (#FF00FF)` |
| **prop-shell.png** | **เปลือกหอยเรโทร** | `Pastel Y2K purple seashell ornament, shiny pearl luster, 2D game item asset. Isolated on a solid bright magenta background (#FF00FF)` |
| **prop-sandalwood.png** | **ไม้จันทน์มูเตลู** | `A glowing logs of sacred sandalwood wrapped in a tiny Y2K yellow ribbon, 2D game item asset. Isolated on a solid bright magenta background (#FF00FF)` |

---

## 🛠️ ขั้นตอนหลังจากคุณนำภาพที่ Gen เสร็จแล้วมาวางในโฟลเดอร์

เมื่อได้ภาพฉากใหม่และสไปรต์ตัวละครใหม่แล้ว ให้รันสคริปต์นี้เพื่อเจาะพื้นหลังสีชมพูให้โปร่งแสงอัตโนมัติ:

1.  เปิด Terminal ในโปรเจกต์นี้
2.  รันคำสั่งเจาะพื้นหลังสีชมพู (สมมติเราเขียนรองรับไว้):
    `python3 scratch/remove_bg_magenta.py [ระบุเส้นทางไฟล์]`

*(หมายเหตุ: เดี๋ยวผมจะเตรียมสคริปต์ `remove_bg_magenta.py` ไว้ให้คุณนำไปกดรันเจาะสีชมพูออกโดยไม่กินพื้นที่สีขาวได้ทันทีครับ)*
