# Asset Generation Prompts — เกาะปลาบู่ทอง

Prompt สำหรับ gen asset ด้วย AI image generator (เช่น Gemini) ใช้แทนที่ placeholder
สี่เหลี่ยมสีในเกม แต่ละอันคือ prompt เต็ม copy ไปวางแล้ว gen ได้เลย ไม่ต้องแก้คำเอง

ได้ไฟล์มาแล้วเซฟตามชื่อที่กำหนดไว้ใต้ prompt แต่ละอัน แล้ววางใน
`public/assets/stories/pla-boo-thong/` (มี subfolder `tiles/`, `sprites/player/`,
`sprites/npc/`, `icons/`, `ui/` เตรียมไว้แล้ว) แล้วแจ้งให้เปลี่ยนจาก placeholder เป็น
asset จริงในโค้ด

**Tips ตอน gen:**
- ถ้าภาพที่ได้มีพื้นหลังติดมา ให้บอกต่อว่า "remove the background, make it transparent
  PNG" แล้ว gen ซ้ำ
- เก็บภาพเป็น PNG ตามความละเอียดที่ได้ ไม่ต้อง resize เอง จะ crop/resize ให้พอดี tile
  ทีหลัง

## 1. พื้นเกาะ (tiles)

**1a. หญ้า** → บันทึกเป็น `tiles/tile-grass.png`
```
Top-down 2D pixel art game tile, seamless/tileable, 128x128 pixels, grass texture for
a tropical island survival game, warm soft color palette, subtle shading and
highlights, no characters, no text, no watermark, clean edges for tiling, style
similar to cozy mobile island survival games
```

**1b. หาดทรายเปียก** → บันทึกเป็น `tiles/tile-sand.png`
```
Top-down 2D pixel art game tile, seamless/tileable, 128x128 pixels, wet sand beach
texture for a tropical island survival game, warm soft color palette, subtle shading
and highlights, no characters, no text, no watermark, clean edges for tiling, style
similar to cozy mobile island survival games
```

**1c. น้ำตื้น** → บันทึกเป็น `tiles/tile-water.png`
```
Top-down 2D pixel art game tile, seamless/tileable, 128x128 pixels, shallow turquoise
water texture for a tropical island survival game, warm soft color palette, subtle
shading and highlights, no characters, no text, no watermark, clean edges for tiling,
style similar to cozy mobile island survival games
```

**1d. หิน** → บันทึกเป็น `tiles/tile-rock.png`
```
Top-down 2D pixel art game tile, seamless/tileable, 128x128 pixels, gray rock texture
for a tropical island survival game, warm soft color palette, subtle shading and
highlights, no characters, no text, no watermark, clean edges for tiling, style
similar to cozy mobile island survival games
```

## 2. ต้นไม้ / ของตกแต่งบนเกาะ

**2a. ต้นมะพร้าว** → บันทึกเป็น `tiles/prop-palm-tree.png`
```
2D pixel art game asset, single isolated object on transparent background, coconut
palm tree, tropical island survival game style, warm lighting, soft cel-shaded pixel
art, no background, no text, no watermark
```

**2b. กองไฟ** → บันทึกเป็น `tiles/prop-campfire.png`
```
2D pixel art game asset, single isolated object on transparent background, campfire
made of stones and logs, tropical island survival game style, warm lighting, soft
cel-shaded pixel art, no background, no text, no watermark
```

**2c. ลังไม้ลอยน้ำ** → บันทึกเป็น `tiles/prop-crate.png`
```
2D pixel art game asset, single isolated object on transparent background, wooden
driftwood crate, tropical island survival game style, warm lighting, soft cel-shaded
pixel art, no background, no text, no watermark
```

**2d. กองหิน** → บันทึกเป็น `tiles/prop-rocks.png`
```
2D pixel art game asset, single isolated object on transparent background, cluster of
gray rocks, tropical island survival game style, warm lighting, soft cel-shaded pixel
art, no background, no text, no watermark
```

## 3. ตัวละครเอก (ผู้เรือแตก)

**3a. หันหน้าเข้ากล้อง (ลง)** → บันทึกเป็น `sprites/player/player-down.png`
```
2D pixel art character sprite, top-down RPG game style, young Thai shipwreck survivor
wearing torn simple clothes, facing forward, full body, standing pose, transparent
background, cozy island survival game aesthetic, warm color palette, soft shading, no
text, no watermark, consistent proportions suitable for a 32x32 tile-based game
```

**3b. หันหลัง (ขึ้น)** → บันทึกเป็น `sprites/player/player-up.png`
```
2D pixel art character sprite, top-down RPG game style, young Thai shipwreck survivor
wearing torn simple clothes, facing backward (away from camera), full body, standing
pose, transparent background, cozy island survival game aesthetic, warm color
palette, soft shading, no text, no watermark, consistent proportions suitable for a
32x32 tile-based game
```

**3c. หันซ้าย** → บันทึกเป็น `sprites/player/player-left.png`
```
2D pixel art character sprite, top-down RPG game style, young Thai shipwreck survivor
wearing torn simple clothes, facing left, side view, full body, standing pose,
transparent background, cozy island survival game aesthetic, warm color palette, soft
shading, no text, no watermark, consistent proportions suitable for a 32x32
tile-based game
```

**3d. หันขวา** → บันทึกเป็น `sprites/player/player-right.png`
```
2D pixel art character sprite, top-down RPG game style, young Thai shipwreck survivor
wearing torn simple clothes, facing right, side view, full body, standing pose,
transparent background, cozy island survival game aesthetic, warm color palette, soft
shading, no text, no watermark, consistent proportions suitable for a 32x32
tile-based game
```

## 4. ปลาบู่ทอง (NPC หลัก)

→ บันทึกเป็น `sprites/npc/golden-goby.png`
```
2D pixel art creature sprite, mystical golden goby fish with a soft ethereal glow,
floating pose, transparent background, warm gold and soft blue color palette, magical
Thai folklore spirit fish, cozy pixel art game style, no text, no watermark
```

## 5. UI elements (HUD)

**5a. กรอบ panel ทั่วไป** → บันทึกเป็น `ui/panel-frame.png`
```
2D pixel art UI frame for a mobile game, wooden/bamboo beach-themed panel border with
rope details, transparent background/center, warm tan and brown tones, rounded
corners, cozy tropical island game style, no text inside, no watermark
```

**5b. แถบ Health** → บันทึกเป็น `ui/bar-health.png`
```
2D pixel art UI frame for a mobile game, wooden/bamboo beach-themed health bar frame
(empty, red fill area), transparent background/center, warm tan and brown tones,
rounded corners, cozy tropical island game style, no text inside, no watermark
```

**5c. แถบ Hunger** → บันทึกเป็น `ui/bar-hunger.png`
```
2D pixel art UI frame for a mobile game, wooden/bamboo beach-themed hunger bar frame
(empty, orange fill area), transparent background/center, warm tan and brown tones,
rounded corners, cozy tropical island game style, no text inside, no watermark
```

**5d. แถบ Thirst** → บันทึกเป็น `ui/bar-thirst.png`
```
2D pixel art UI frame for a mobile game, wooden/bamboo beach-themed thirst bar frame
(empty, blue fill area), transparent background/center, warm tan and brown tones,
rounded corners, cozy tropical island game style, no text inside, no watermark
```

**5e. ปุ่ม icon กลม (inventory/craft)** → บันทึกเป็น `ui/icon-button-frame.png`
```
2D pixel art UI frame for a mobile game, wooden/bamboo beach-themed circular icon
button frame (empty, for inventory/craft icons), transparent background/center, warm
tan and brown tones, rounded corners, cozy tropical island game style, no text
inside, no watermark
```

## 6. ทางเลือกเสริม: gen ด้วย Google Flow (image mode)

Prompt ชุดที่ 1-5 ด้านบนเอาไปลองใน Flow (image mode) ได้เลยเหมือนกัน — โครงสร้าง prompt
แบบบรรยายละเอียด (style + subject + lighting + "no text/watermark") ใช้ได้กับทั้งสองเครื่องมือ
ส่วนด้านล่างนี้เป็น prompt เพิ่มเติมสำหรับทำ **storyboard** เล่าเรื่อง "ตามหาปลาบู่ทอง" เป็นภาพนิ่ง
ต่อกันหลายช็อต (เผื่อใช้พรีวิวจังหวะเรื่องก่อนตัดสินใจ หรือโพสต์โปรโมทเกม) — ใส่ style ให้ตรงกันทุก
panel เพื่อให้ดูเป็นชุดเดียวกัน

**Tips**: ใส่ท้าย prompt ทุกอันด้วยวลี style เดียวกัน (ผมล็อกไว้ว่า
`storybook illustration style, warm tropical color palette, soft painterly lighting,
consistent character design across panels, no text, no watermark`) จะได้ภาพหน้าตา
เรื่องเดียวกันตลอดทั้งชุด แม้ gen แยกทีละ panel

**Storyboard Panel 1 — คลื่นซัดขึ้นฝั่ง**
```
Storyboard panel illustration, a young shipwreck survivor washed up unconscious on a
tropical beach at dawn, a broken wooden ship sinking in the background waves, soft
golden morning light, storybook illustration style, warm tropical color palette, soft
painterly lighting, consistent character design across panels, no text, no watermark
```

**Storyboard Panel 2 — สร้างกองไฟคืนแรก**
```
Storyboard panel illustration, the same shipwreck survivor sitting by a small campfire
on the beach at night, gathered wood and coconuts nearby, stars and a calm dark ocean
in the background, storybook illustration style, warm tropical color palette, soft
painterly lighting, consistent character design across panels, no text, no watermark
```

**Storyboard Panel 3 — เสียงเพลงจากบ่อน้ำ**
```
Storyboard panel illustration, the survivor standing curiously beside an old stone well
at the center of a jungle clearing, listening closely, faint magical golden light
glowing from inside the well, storybook illustration style, warm tropical color
palette, soft painterly lighting, consistent character design across panels, no text,
no watermark
```

**Storyboard Panel 4 — ปลาบู่ทองปรากฏตัว**
```
Storyboard panel illustration, a mystical glowing golden goby fish emerging from the
water inside an old stone well, the shipwreck survivor kneeling in awe beside it, soft
golden magical glow lighting the scene, storybook illustration style, warm tropical
color palette, soft painterly lighting, consistent character design across panels, no
text, no watermark
```

**Storyboard Panel 5 — ออกตามหาของสามอย่าง**
```
Storyboard panel illustration, the survivor exploring a lush jungle path holding a
knife, searching among flowers, pearl shells, and sandalwood trees, dappled sunlight
through the canopy, storybook illustration style, warm tropical color palette, soft
painterly lighting, consistent character design across panels, no text, no watermark
```

**Storyboard Panel 6 — จบบท / แหวนวิเศษ**
```
Storyboard panel illustration, the golden goby fish dissolving into sparkling light
above the stone well at dusk, leaving behind a glowing magic ring floating in the air,
the survivor watching with wonder, storybook illustration style, warm tropical color
palette, soft painterly lighting, consistent character design across panels, no text,
no watermark
```

## 7. เวอร์ชันสวยขึ้น: painterly storybook style เป็น asset จริงในเกม

สไตล์ภาพ storyboard ที่ gen ได้จาก Flow (painterly, แสงนวล, โทนอบอุ่น) สวยกว่า pixel art
มาก — ชุดนี้เอาสไตล์เดียวกันมาเขียนใหม่ให้เป็น "asset ตัดเดี่ยว" ที่ใช้ในเกมได้จริง (ไม่ใช่ภาพฉาก
มีพื้นหลังแบบ storyboard) คือต้องตัดตัวละคร/ของให้อยู่บนพื้นหลังเปล่าๆ และมุมมองต้องเป็นมุมบน
(top-down) ให้เข้ากับกล้องของเกม ไม่ใช่มุมภาพประกอบปกติ

**Style-lock phrase** (ใส่ท้ายทุก prompt ในชุดนี้เพื่อให้หน้าตาตัวละคร/โทนสีเหมือนกับ
storyboard ที่ gen มาแล้ว):
```
warm painterly storybook illustration style, semi-realistic proportions, soft
cinematic lighting, warm tropical color palette, matching a children's adventure
book illustration
```

**ตัวละครหลัก** (คำอธิบายให้ตรงกับที่ gen มาแล้ว ใช้ทุกครั้งเพื่อความสม่ำเสมอ): "a young
barefoot boy, about 10-12 years old, short tousled messy brown hair, warm tan skin,
wearing a torn light blue-teal short-sleeve shirt and rolled-up brown ragged shorts"

**7a. ตัวละคร หันลง** → บันทึกเป็น `sprites/player/player-down.png`
```
Top-down video game character sprite, viewed from directly above at a slightly
elevated angle, a young barefoot boy, about 10-12 years old, short tousled messy
brown hair, warm tan skin, wearing a torn light blue-teal short-sleeve shirt and
rolled-up brown ragged shorts, facing forward toward the camera, full body, standing
pose, isolated on a plain white background, no scene, no shadow on ground, warm
painterly storybook illustration style, semi-realistic proportions, soft cinematic
lighting, warm tropical color palette, matching a children's adventure book
illustration, no text, no watermark
```

**7b. ตัวละคร หันขึ้น (หันหลัง)** → บันทึกเป็น `sprites/player/player-up.png`
```
Top-down video game character sprite, viewed from directly above at a slightly
elevated angle, a young barefoot boy, about 10-12 years old, short tousled messy
brown hair, warm tan skin, wearing a torn light blue-teal short-sleeve shirt and
rolled-up brown ragged shorts, facing away from the camera, back view, full body,
standing pose, isolated on a plain white background, no scene, no shadow on ground,
warm painterly storybook illustration style, semi-realistic proportions, soft
cinematic lighting, warm tropical color palette, matching a children's adventure
book illustration, no text, no watermark
```

**7c. ตัวละคร หันซ้าย** → บันทึกเป็น `sprites/player/player-left.png`
```
Top-down video game character sprite, viewed from directly above at a slightly
elevated angle, a young barefoot boy, about 10-12 years old, short tousled messy
brown hair, warm tan skin, wearing a torn light blue-teal short-sleeve shirt and
rolled-up brown ragged shorts, facing left, side view, full body, standing pose,
isolated on a plain white background, no scene, no shadow on ground, warm painterly
storybook illustration style, semi-realistic proportions, soft cinematic lighting,
warm tropical color palette, matching a children's adventure book illustration, no
text, no watermark
```

**7d. ตัวละคร หันขวา** → บันทึกเป็น `sprites/player/player-right.png`
```
Top-down video game character sprite, viewed from directly above at a slightly
elevated angle, a young barefoot boy, about 10-12 years old, short tousled messy
brown hair, warm tan skin, wearing a torn light blue-teal short-sleeve shirt and
rolled-up brown ragged shorts, facing right, side view, full body, standing pose,
isolated on a plain white background, no scene, no shadow on ground, warm painterly
storybook illustration style, semi-realistic proportions, soft cinematic lighting,
warm tropical color palette, matching a children's adventure book illustration, no
text, no watermark
```

**7e. พื้นเกาะ (tile) — หญ้า** → บันทึกเป็น `tiles/tile-grass.png`
```
Seamless top-down ground texture tile for a video game, tropical island grass viewed
from directly above, warm painterly storybook illustration style, semi-realistic
proportions, soft cinematic lighting, warm tropical color palette, matching a
children's adventure book illustration, tileable edges, no characters, no text, no
watermark
```

**7f. พื้นเกาะ (tile) — หาดทราย** → บันทึกเป็น `tiles/tile-sand.png`
```
Seamless top-down ground texture tile for a video game, wet sand beach viewed from
directly above, warm painterly storybook illustration style, semi-realistic
proportions, soft cinematic lighting, warm tropical color palette, matching a
children's adventure book illustration, tileable edges, no characters, no text, no
watermark
```

**7g. พื้นเกาะ (tile) — น้ำ** → บันทึกเป็น `tiles/tile-water.png`
```
Seamless top-down ground texture tile for a video game, shallow turquoise water
viewed from directly above, warm painterly storybook illustration style,
semi-realistic proportions, soft cinematic lighting, warm tropical color palette,
matching a children's adventure book illustration, tileable edges, no characters, no
text, no watermark
```

**7h. ของบนเกาะ — ลังไม้ (wood node)** → บันทึกเป็น `tiles/prop-crate.png`
```
Isolated video game prop asset, a weathered wooden driftwood crate, viewed from a
top-down video game angle, isolated on a plain white background, no scene, no
shadow on ground, warm painterly storybook illustration style, semi-realistic
proportions, soft cinematic lighting, warm tropical color palette, matching a
children's adventure book illustration, no text, no watermark
```

**7i. ของบนเกาะ — ต้นมะพร้าว (coconut node)** → บันทึกเป็น `tiles/prop-palm-tree.png`
```
Isolated video game prop asset, a tropical coconut palm tree, viewed from a top-down
video game angle, isolated on a plain white background, no scene, no shadow on
ground, warm painterly storybook illustration style, semi-realistic proportions,
soft cinematic lighting, warm tropical color palette, matching a children's
adventure book illustration, no text, no watermark
```

**7j. ของบนเกาะ — กองหิน (stone node)** → บันทึกเป็น `tiles/prop-rocks.png`
```
Isolated video game prop asset, a cluster of moss-covered rocks, viewed from a
top-down video game angle, isolated on a plain white background, no scene, no
shadow on ground, warm painterly storybook illustration style, semi-realistic
proportions, soft cinematic lighting, warm tropical color palette, matching a
children's adventure book illustration, no text, no watermark
```

**7k. ของที่คราฟต์ได้ (วางบนแมพ)** → บันทึกเป็น `tiles/prop-campfire.png`
```
Isolated video game prop asset, a cozy campfire surrounded by stones with warm
glowing flames, viewed from a top-down video game angle, isolated on a plain white
background, no scene, no shadow on ground, warm painterly storybook illustration
style, semi-realistic proportions, soft cinematic lighting, warm tropical color
palette, matching a children's adventure book illustration, no text, no watermark
```

**7l. ปลาบู่ทอง** → บันทึกเป็น `sprites/npc/golden-goby.png`
```
Isolated video game creature sprite, a small glowing golden goby fish with a soft
magical sparkle, swimming pose, isolated on a plain white background, no scene, warm
painterly storybook illustration style, semi-realistic proportions, soft cinematic
lighting, warm golden color palette, matching a children's adventure book
illustration, no text, no watermark
```

**Tip**: ถ้า Flow รองรับการอัปโหลดภาพ reference (image-to-image / style reference) ลอง
อัปโหลดภาพ storyboard ที่ได้มาแล้วเป็น reference ตอน gen แต่ละ asset ด้านบน จะช่วยให้หน้าตา
ตัวละครและโทนสีตรงกับ storyboard เดิมแม่นยิ่งขึ้นกว่าการพึ่ง prompt คำบรรยายอย่างเดียว

## 8. Version 3 — สไตล์ pixel art ที่ใช้อยู่ตอนนี้ (แสงเรียบ ไม่มีเงาทิศทางเดียว)

กลับมาใช้สไตล์ pixel art ชุดแรก (section 1-5) เพราะปูต่อกันเป็นแมพได้เนียนกว่า painterly —
ชุดนี้คือ prompt เดียวกันแต่ **ล็อกเรื่องแสงให้เรียบสม่ำเสมอ (flat lighting) ไม่มีเงาทิศทาง
เดียวแรงๆ** ซึ่งเป็นสาเหตุจริงของปัญหา "รอยต่อ" ที่เจอมาตลอด ไม่ใช่ที่ style pixel art ไม่ดี
ใช้ prompt ชุดนี้แทนชุดเดิมตั้งแต่นี้ไป (ของเดิมที่ใช้อยู่ในเกมตอนนี้โอเคแล้ว ไม่ต้อง gen ใหม่ —
ชุดนี้ไว้ใช้ตอนต้องการเพิ่ม asset ใหม่ๆทีหลังให้เข้ากับของเดิม)

**Style-lock phrase v3** (ใส่ท้ายทุก prompt):
```
2D pixel art, top-down video game asset, flat even lighting with no strong directional
shadows, soft ambient shading only, warm tropical color palette (greens #6ab04c,
sand #e8d9a0, water #4fb3bf, wood brown #8a5a2e), clean pixel art style consistent
with a cozy top-down island survival game, isolated on a plain white background, no
scene, no text, no watermark
```

**8a. พื้นเกาะ — หญ้า** → `tiles/tile-grass.png`
```
2D pixel art, top-down video game asset, seamless tileable ground texture, tropical
island grass with small flowers and pebbles, flat even lighting with no strong
directional shadows, soft ambient shading only, warm tropical color palette (greens
#6ab04c, sand #e8d9a0, water #4fb3bf, wood brown #8a5a2e), clean pixel art style
consistent with a cozy top-down island survival game, no characters, no text, no
watermark
```

**8b. พื้นเกาะ — หาดทราย** → `tiles/tile-sand.png`
```
2D pixel art, top-down video game asset, seamless tileable ground texture, wet sand
beach with small shells and pebbles, flat even lighting with no strong directional
shadows, soft ambient shading only, warm tropical color palette (greens #6ab04c,
sand #e8d9a0, water #4fb3bf, wood brown #8a5a2e), clean pixel art style consistent
with a cozy top-down island survival game, no characters, no text, no watermark
```

**8c. พื้นเกาะ — น้ำ** → `tiles/tile-water.png`
```
2D pixel art, top-down video game asset, seamless tileable ground texture, shallow
turquoise water with soft ripples, flat even lighting with no strong directional
shadows, soft ambient shading only, warm tropical color palette (greens #6ab04c,
sand #e8d9a0, water #4fb3bf, wood brown #8a5a2e), clean pixel art style consistent
with a cozy top-down island survival game, no characters, no text, no watermark
```

**8d. ลังไม้ (wood node)** → `tiles/prop-crate.png`
```
2D pixel art, top-down video game asset, a weathered wooden crate tied with rope,
flat even lighting with no strong directional shadows, soft ambient shading only,
warm tropical color palette (greens #6ab04c, sand #e8d9a0, water #4fb3bf, wood brown
#8a5a2e), clean pixel art style consistent with a cozy top-down island survival game,
isolated on a plain white background, no scene, no text, no watermark
```

**8e. ต้นมะพร้าว (coconut node)** → `tiles/prop-palm-tree.png`
```
2D pixel art, top-down video game asset, a tropical coconut palm tree viewed from
directly above, flat even lighting with no strong directional shadows, soft ambient
shading only, warm tropical color palette (greens #6ab04c, sand #e8d9a0, water
#4fb3bf, wood brown #8a5a2e), clean pixel art style consistent with a cozy top-down
island survival game, isolated on a plain white background, no scene, no text, no
watermark
```

**8f. กองหิน (stone node)** → `tiles/prop-rocks.png`
```
2D pixel art, top-down video game asset, a cluster of mossy gray rocks, flat even
lighting with no strong directional shadows, soft ambient shading only, warm
tropical color palette (greens #6ab04c, sand #e8d9a0, water #4fb3bf, wood brown
#8a5a2e), clean pixel art style consistent with a cozy top-down island survival
game, isolated on a plain white background, no scene, no text, no watermark
```

**8g. กองไฟ (campfire building)** → `tiles/prop-campfire.png`
```
2D pixel art, top-down video game asset, a cozy campfire with stones and warm
flames viewed from directly above, flat even lighting with no strong directional
shadows, soft ambient shading only, warm tropical color palette (greens #6ab04c,
sand #e8d9a0, water #4fb3bf, wood brown #8a5a2e), clean pixel art style consistent
with a cozy top-down island survival game, isolated on a plain white background, no
scene, no text, no watermark
```

**8h. ตัวละคร หันลง** → `sprites/player/player-down.png`
```
2D pixel art character sprite, top-down video game angle, a young barefoot boy with
messy brown hair wearing a torn white shirt and brown shorts, facing forward toward
the camera, full body, standing pose, flat even lighting with no strong directional
shadows, soft ambient shading only, warm tropical color palette, clean pixel art
style consistent with a cozy top-down island survival game, isolated on a plain
white background, no scene, no text, no watermark
```

**8i. ตัวละคร หันขึ้น** → `sprites/player/player-up.png`
```
2D pixel art character sprite, top-down video game angle, a young barefoot boy with
messy brown hair wearing a torn white shirt and brown shorts, facing away from the
camera, back view, full body, standing pose, flat even lighting with no strong
directional shadows, soft ambient shading only, warm tropical color palette, clean
pixel art style consistent with a cozy top-down island survival game, isolated on a
plain white background, no scene, no text, no watermark
```

**8j. ตัวละคร หันซ้าย** → `sprites/player/player-left.png`
```
2D pixel art character sprite, top-down video game angle, a young barefoot boy with
messy brown hair wearing a torn white shirt and brown shorts, facing left, side
view, full body, standing pose, flat even lighting with no strong directional
shadows, soft ambient shading only, warm tropical color palette, clean pixel art
style consistent with a cozy top-down island survival game, isolated on a plain
white background, no scene, no text, no watermark
```

**8k. ตัวละคร หันขวา** → `sprites/player/player-right.png`
```
2D pixel art character sprite, top-down video game angle, a young barefoot boy with
messy brown hair wearing a torn white shirt and brown shorts, facing right, side
view, full body, standing pose, flat even lighting with no strong directional
shadows, soft ambient shading only, warm tropical color palette, clean pixel art
style consistent with a cozy top-down island survival game, isolated on a plain
white background, no scene, no text, no watermark
```

**8l. ปลาบู่ทอง** → `sprites/npc/golden-goby.png`
```
2D pixel art creature sprite, a small glowing golden goby fish with a soft magical
sparkle, side swimming pose, flat even lighting with no strong directional shadows,
soft ambient shading only, warm golden color palette, clean pixel art style
consistent with a cozy top-down island survival game, isolated on a plain white
background, no scene, no text, no watermark
```

## 9. ทางเลือก: พื้นเกาะเป็นภาพเดียวเต็มจอ (ไม่ใช่ tile)

แทนที่จะปู tile ต่อกัน ใช้ภาพวาดเกาะทั้งเกาะภาพเดียวมุมบน (top-down) เป็นพื้นหลัง แล้ววาง
ตัวละคร/ของเก็บลอยทับด้านบน (ต้องมุมบนเท่านั้น ไม่ใช่มุมเฉียงข้างแบบภาพ postcard เพราะเดินได้
ต้องมองจากบน)

**9a. พื้นเกาะเต็มจอ** → บันทึกเป็น `tiles/island-background.png`
```
Top-down aerial view illustration of a small tropical island, sandy beach
surrounding a grassy center, scattered palm trees and rocks, seen directly
from above like a game map, warm painterly style, soft even lighting, no
strong directional shadows, cohesive color palette, no text, no watermark,
1920x1080 landscape
```
