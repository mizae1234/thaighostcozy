'use client';

import React, { useState } from 'react';
import { useInventoryStore } from '@/stores/useInventoryStore';

interface AdventureCard {
  key: string;
  name: string;
  category: 'CHARACTER' | 'CLUE' | 'EVENT';
  categoryName: string;
  desc: string;
  buff: string;
  emoji: string;
  bgColor: string; // Tailwind gradient classes
  img: string;
}

const ADVENTURE_CARDS: AdventureCard[] = [
  // Characters
  {
    key: 'card-grandpa-retro',
    name: 'คุณตาเดช (ตาของเรา)',
    category: 'CHARACTER',
    categoryName: 'ตัวละคร',
    desc: 'คุณตาผู้ล่วงลับ ทิ้งมรดกสวนกล้วยและบ้านสวนเก่าไว้ให้เรา พร้อมความลับโบราณที่ปิดบังหมู่บ้าน',
    buff: '🌾 มรดกตาเดช: ผลผลิตกล้วยน้ำว้าขุดฟาร์มได้เพิ่มขึ้น +15%',
    emoji: '👴',
    bgColor: 'from-amber-600 to-yellow-500',
    img: '/assets/stories/ghost-whisperer/cards/card-grandpa-retro.png',
  },
  {
    key: 'card-suspicious-chief',
    name: 'ผู้ใหญ่บ้านลุงแดง',
    category: 'CHARACTER',
    categoryName: 'ตัวละคร',
    desc: 'ผู้ใหญ่บ้านลุงแดงที่พยายามมาเตือนห้ามออกไปข้างนอกตอนกลางคืน แอบพกไฟฉายหาศิลาอาคมปราบผี',
    buff: '🔦 ไฟส่องสว่าง: ลดอัตราการหิวข้าวลงช้าลง 10%',
    emoji: '🧔',
    bgColor: 'from-slate-700 to-slate-900',
    img: '/assets/stories/ghost-whisperer/cards/card-suspicious-chief.png',
  },
  {
    key: 'card-tani-cozy',
    name: 'แม่นางตานี (ร่างอบอุ่น)',
    category: 'CHARACTER',
    categoryName: 'ตัวละคร',
    desc: 'วิญญาณผีสาวต้นกล้วยตานีที่อาศัยในศาลขาวมูจิ ร่างดีแสนอบอุ่น ผูกพันกับตาเดชมาก',
    buff: '⚡ พรตานีรักษ์โลก: เพิ่มความเร็วการเดิน/วิ่งของตัวละคร 20%',
    emoji: '👻',
    bgColor: 'from-emerald-600 to-teal-500',
    img: '/assets/stories/ghost-whisperer/cards/card-tani-cozy.png',
  },
  {
    key: 'tani',
    name: 'นางตานีสายแฟ',
    category: 'CHARACTER',
    categoryName: 'วิญญาณคู่หู',
    desc: 'วิญญาณผีสาวต้นกล้วยสายแฟชั่น อัญเชิญมาช่วยรดน้ำแปลงผักด้วยใจรักษ์โลก',
    buff: '⚡ พรตานีรักษ์โลก: เพิ่มความเร็วการโตของพืชผล 20%',
    emoji: '💚',
    bgColor: 'from-emerald-500 to-teal-400',
    img: '/assets/stories/ghost-whisperer/gacha/card-tani.png',
  },
  {
    key: 'kuman',
    name: 'กุมารทองติดแท็บเล็ต',
    category: 'CHARACTER',
    categoryName: 'วิญญาณคู่หู',
    desc: 'กุมารทองยุคดิจิทัลที่ติดการเล่นเกมแท็บเล็ตเป็นชีวิตจิตใจ ช่วยอำนวยความสะดวกเก็บของอัตโนมัติ',
    buff: '🎮 พรกุมารเจมเมอร์: แฮกเก็บกล่องไม้/หินอัตโนมัติ',
    emoji: '👶',
    bgColor: 'from-amber-500 to-orange-400',
    img: '/assets/stories/ghost-whisperer/gacha/card-kuman.png',
  },
  {
    key: 'pob',
    name: 'ปอบออฟฟิศซินโดรม',
    category: 'CHARACTER',
    categoryName: 'วิญญาณคู่หู',
    desc: 'ผีปอบที่ต้องทนทำงานออฟฟิศจนปวดหลังและคอบ่าไหล่ อัญเชิญมาช่วยฟาร์มวัสดุ',
    buff: '☕ พรปอบเบิร์นเอาท์: เพิ่มจำนวนไม้ที่ขุดได้ 15%',
    emoji: '🧛',
    bgColor: 'from-blue-500 to-indigo-400',
    img: '/assets/stories/ghost-whisperer/gacha/card-pob.png',
  },
  {
    key: 'naga',
    name: 'พญานาคน้อย',
    category: 'CHARACTER',
    categoryName: 'วิญญาณคู่หู',
    desc: 'พญานาครุ่นเยาว์ผู้มีอิทธิฤทธิ์ด้านวารี ช่วยพัดพาความเย็นชุ่มชื้น ลดความเหนื่อยล้าดับกระหาย',
    buff: '🌊 พรวารีเทพ: ค่าความกระหายลดช้าลง 30%',
    emoji: '🐉',
    bgColor: 'from-cyan-500 to-blue-400',
    img: '/assets/stories/ghost-whisperer/gacha/card-naga.png',
  },

  // Clues
  {
    key: 'card-torn-diary',
    name: 'เศษบันทึกคุณตา',
    category: 'CLUE',
    categoryName: 'เบาะแสความลับ',
    desc: 'บันทึกตาเดชเตือนเรื่องสัญญาลับของป่ากล้วยกับผู้ใหญ่บ้าน และการใช้ยันต์กันวิญญาณกลืนกินสวน',
    buff: '📖 สื่อพลังธรรม: อัตรากระหายน้ำลดลงช้าขึ้น 15%',
    emoji: '📜',
    bgColor: 'from-amber-800 to-yellow-750',
    img: '/assets/stories/ghost-whisperer/cards/card-torn-diary.png',
  },
  {
    key: 'card-village-pact',
    name: 'คัมภีร์สัญญาเก่าแก่',
    category: 'CLUE',
    categoryName: 'เบาะแสความลับ',
    desc: 'กระดาษสัญญาร่วมทำอาคมสะกดแม่ตานีร้ายไม่ให้โกรธแค้นหมู่บ้าน โดยแลกกับความดูแลของคุณตา',
    buff: '🛡️ ขวัญกำลังใจ: ความเสียหายจากการฟุบลดลง 40%',
    emoji: '🕸️',
    bgColor: 'from-rose-800 to-red-650',
    img: '/assets/stories/ghost-whisperer/cards/card-village-pact.png',
  },
  {
    key: 'card-tani-essence',
    name: 'น้ำมันตานีขวดจิ๋ว',
    category: 'CLUE',
    categoryName: 'เบาะแสความลับ',
    desc: 'น้ำมันอารักษ์สีเขียวมรกตที่ทำจากส่วนผสมป่ากล้วยโบราณ ฟื้นฟูและสมานสัญญาชีวิต',
    buff: '💧 น้ำมนต์ฟื้นฟู: การทานกล้วยน้ำว้าจะบวกพลังเพิ่มอีก +10 หน่วย',
    emoji: '🧪',
    bgColor: 'from-green-700 to-emerald-650',
    img: '/assets/stories/ghost-whisperer/cards/card-tani-essence.png',
  },

  // Night Decisions
  {
    key: 'card-safety-first',
    name: 'ระแวดระวัง (Safety First)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 1: เลือกที่จะอยู่แต่ในบ้านจนถึงเช้า รอดพ้นปลอดภัยในบ้านสวนเก่า',
    buff: '💤 บ้านมั่นคง: เลือดพลังชีวิต (Max Health) เพิ่มขึ้น +10',
    emoji: '🛌',
    bgColor: 'from-blue-600 to-indigo-500',
    img: '/assets/stories/ghost-whisperer/cards/card-door-peek.png',
  },
  {
    key: 'card-banana-glance',
    name: 'ผู้สังเกตการณ์ (Banana Glance)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 1: เลือกแง้มประตูดู เห็นพลังงานแสงสีเขียวอ่อนกวักกอใบกล้วย',
    buff: '👀 ลางสังหรณ์: ความเร็วขุดเก็บกล้วยเร็วขึ้น 10%',
    emoji: '🫣',
    bgColor: 'from-sky-650 to-blue-500',
    img: '/assets/stories/ghost-whisperer/cards/card-door-peek.png',
  },
  {
    key: 'card-bold-explorer',
    name: 'ผู้กล้าท้าทาย (Bold Explorer)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 1: เลือกเดินลุยเข้าไปในสวนผลไม้ ย่ำดินป่ากล้วยตามหาความสยอง',
    buff: '🔥 พรานราตรี: เพิ่มความเร็วการเดินเวลากลางคืน 15%',
    emoji: '🚶‍♂️',
    bgColor: 'from-orange-600 to-red-500',
    img: '/assets/stories/ghost-whisperer/cards/card-midnight-search.png',
  },
  {
    key: 'card-window-witness',
    name: 'พยานหน้าต่าง (Window Witness)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 2: แอบส่องช่องหน้าต่าง พบว่าผู้ใหญ่บ้านเดินสอดส่องหาศิลากลางสวน',
    buff: '🤫 พลพรางตัว: อัตรากระหายน้ำลดลงช้าลง 10%',
    emoji: '🪟',
    bgColor: 'from-stone-600 to-stone-850',
    img: '/assets/stories/ghost-whisperer/cards/card-door-peek.png',
  },
  {
    key: 'card-shouter',
    name: 'เสียงเตือนภัย (Voice of Warning)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 2: ตะโกนเสียงดังส่งสัญญาณเตือนภัยขู่หัวขโมย จนไฟดับเตลิดหาย',
    buff: '📢 เสียงแตร: ข่มขวัญภูตผีแถวสวนกล้วยลดพลังลง 5%',
    emoji: '🗣️',
    bgColor: 'from-red-650 to-orange-500',
    img: '/assets/stories/ghost-whisperer/cards/card-door-peek.png',
  },
  {
    key: 'card-shadow-stalker',
    name: 'เงาสะกดรอย (Shadow Stalker)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 2: ถือมีดย่องตามเงาลับไปดุจเงา พบขวดขี้ผึ้งน้ำมันตานีปริศนา',
    buff: '🗡️ ตรวจค้นเงียบ: เพิ่มโอกาสฟาร์มไอเทมคู่หูได้เงิน +5 🪙',
    emoji: '🕵️‍♂️',
    bgColor: 'from-violet-800 to-fuchsia-700',
    img: '/assets/stories/ghost-whisperer/cards/card-midnight-search.png',
  },
  {
    key: 'card-ignorant-ear',
    name: 'เพิกเฉยเสียงเศร้า (Ignorant Ear)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 3: เลือกปิดหูสวดคาถาปล่อยวางเสียงเศร้ารอบบ่อน้ำโบราณ',
    buff: '🧿 เกราะจิตวิญญาณ: ต้านทานฟุบหลับความเครียด 10%',
    emoji: '📿',
    bgColor: 'from-zinc-600 to-slate-500',
    img: '/assets/stories/ghost-whisperer/cards/card-door-peek.png',
  },
  {
    key: 'card-offering-giver',
    name: 'ผู้ให้เครื่องเซ่น (Offering Giver)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 3: วางผลกล้วยน้ำหวานเครื่องเซ่นให้นางตานีชิมด้วยความอารี',
    buff: '🍎 มิตรผลทาน: เพิ่มพรอัตราโตของกล้วยไวขึ้น 15%',
    emoji: '🍌',
    bgColor: 'from-yellow-600 to-amber-500',
    img: '/assets/stories/ghost-whisperer/cards/card-tani-cozy.png',
  },
  {
    key: 'card-ghost-whisperer',
    name: 'ผู้เจรจาวิญญาณ (Ghost Whisperer)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 3: เดินไปคุยปัญหาสนทนาเคลียร์ความขัดแย้งสะสมกับวิญญาณ',
    buff: '🔮 จิตสัมผัส: ได้รับส่วนลดในการซื้อของร้านค้า 10%',
    emoji: '🧙‍♂️',
    bgColor: 'from-indigo-650 to-purple-650',
    img: '/assets/stories/ghost-whisperer/cards/card-tani-cozy.png',
  },
  {
    key: 'card-secure-home',
    name: 'ปราการแน่นหนา (Secure Home)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 4: ตอกแผ่นไม้ต้านเงาล้อมบ้านสวนอย่างแข็งขัน ป้องกันชีวิต',
    buff: '🪵 แน่นหนา: อัตราเลือดลดเมื่อหิวโหยช้าขึ้น 20%',
    emoji: '🚪',
    bgColor: 'from-amber-800 to-stone-700',
    img: '/assets/stories/ghost-whisperer/cards/card-door-peek.png',
  },
  {
    key: 'card-amulet-barrier',
    name: 'ม่านอักขระ (Amulet Barrier)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 4: สาดน้ำมนต์ผ่านผ้ายันต์แดง สลายเงาร้ายล้อมประตูปลิดทิ้ง',
    buff: '💠 ยันตป้องภัย: ต้านทานวิญญาณฟันดาเมจ 15%',
    emoji: '📜',
    bgColor: 'from-red-750 to-rose-600',
    img: '/assets/stories/ghost-whisperer/cards/card-village-pact.png',
  },
  {
    key: 'card-orchard-runner',
    name: 'หนีพ้นวิกฤต (Orchard Runner)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 4: หนีออกจากชานบ้านไปหลบกระท่อม ค้นพบเอกสารลับจดหมายลุงแดง',
    buff: '🏃‍♂️ ฝีเท้าปราชญ์: เพิ่มความเร็ววิ่งหลบหลีก 15%',
    emoji: '👣',
    bgColor: 'from-teal-650 to-emerald-500',
    img: '/assets/stories/ghost-whisperer/cards/card-midnight-search.png',
  },
  {
    key: 'card-clue-collector',
    name: 'นักสืบภาพนิ่ง (Clue Collector)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 5: แอบบันทึกภาพผู้ใหญ่บ้านพยายามทำลายศิลาสัญญาประธาน',
    buff: '📷 แสงแฟลช: เพิ่มความเร็วการหาเงินได้เหรียญ +20%',
    emoji: '📱',
    bgColor: 'from-pink-650 to-rose-500',
    img: '/assets/stories/ghost-whisperer/cards/card-suspicious-chief.png',
  },
  {
    key: 'card-confronter',
    name: 'ผู้ประชิดความจริง (Confronter)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 5: ตะโกนเรียกให้ลุงแดงหยุดฟันขุดกลบหลุมสวนกล้วยส่งตัวกลับ',
    buff: '👊 สิทธิกล้าหาญ: โอกาสขุดพบบ้านวัสดุไม้แร่เพิ่ม +1 ชิ้น',
    emoji: '🗣️',
    bgColor: 'from-red-650 to-orange-500',
    img: '/assets/stories/ghost-whisperer/cards/card-suspicious-chief.png',
  },
  {
    key: 'card-pact-seeker',
    name: 'ผู้สืบหาศิลา (Pact Seeker)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 5: ย่องเงียบตามไปไขที่ซ่อนศิลาสลักสัญญาโบราณใต้ดินสวน',
    buff: '🗺️ แผนที่ป่า: ขยายวิสัยทัศน์แสงสว่างกลางคืนขึ้น 25%',
    emoji: '🧭',
    bgColor: 'from-violet-750 to-purple-650',
    img: '/assets/stories/ghost-whisperer/cards/card-midnight-search.png',
  },
  {
    key: 'card-peace-maker',
    name: 'นักประสานรอยร้าว (Peace Maker)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 6: เจรจาขอยกแหวนตาเดชบรรเทาความดุร้ายแค้นของแม่ตานี',
    buff: '🤝 สมานฉันท์: ความเร็วในการขุดเพาะปลูกเร็วขึ้น 15%',
    emoji: '💍',
    bgColor: 'from-yellow-500 to-amber-500',
    img: '/assets/stories/ghost-whisperer/cards/card-tani-cozy.png',
  },
  {
    key: 'card-ghost-slayer',
    name: 'หมอผีวัยรุ่น (Ghost Slayer)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 6: ถือมีดร่ายอาคมกันวิญญาณร้าย บังคับลดพลังคลั่งของแม่ตานี',
    buff: '⚡ พลังปราบมาร: พลังกายลดสเตมิน่าช้าลง 20%',
    emoji: '🗡️',
    bgColor: 'from-rose-850 to-red-750',
    img: '/assets/stories/ghost-whisperer/cards/card-village-pact.png',
  },
  {
    key: 'card-truth-holder',
    name: 'ผู้คืนความสัจจะ (Truth Holder)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 6: แสดงหลักฐานลายมือที่ปกป้องตานีของคุณตาให้เธอหลั่งน้ำตา',
    buff: '🕊️ สัจธรรมปกป้อง: เพิ่มค่าความหิว Max Hunger +10',
    emoji: '📄',
    bgColor: 'from-teal-600 to-emerald-500',
    img: '/assets/stories/ghost-whisperer/cards/card-torn-diary.png',
  },

  // Day 7 Final Choices
  {
    key: 'card-destiny-savior',
    name: 'ผู้พิทักษ์ศีลธรรม (Destiny Savior)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 7: ตัดรากวิญญาณช่วยชีวิตผู้ใหญ่บ้านลุงแดงจากความตาย',
    buff: '🛡️ เมตตาสงเคราะห์: เพิ่ม Max Health, Hunger, Thirst ทุกอย่าง +10',
    emoji: '❤️',
    bgColor: 'from-rose-650 to-pink-500',
    img: '/assets/stories/ghost-whisperer/cards/card-the-climax.png',
  },
  {
    key: 'card-vengeance-allied',
    name: 'สหายตานีเดือด (Vengeance Allied)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 7: ยอมปล่อยให้ความโกรธแค้นแม่ตานีลงทัณฑ์ลุงแดงจมสวนกล้วย',
    buff: '💥 พันธะแค้น: ฟาร์มกล้วยและขุดไม้ได้เหรียญคูณ 2 เท่า',
    emoji: '🖤',
    bgColor: 'from-zinc-800 to-stone-900',
    img: '/assets/stories/ghost-whisperer/cards/card-the-climax.png',
  },
  {
    key: 'card-sacrificial-covenant',
    name: 'สืบทองสัญญาเลือด (Sacrificial Covenant)',
    category: 'EVENT',
    categoryName: 'เหตุการณ์ที่เลือก',
    desc: 'คืนที่ 7: ยินดีรับมอบสัญญาป่ากล้วยสืบต่อจากคุณตา ร่างจิตวิญญาณรวมกับเรา',
    buff: '🧿 รวมชีวิตจิตหนึ่ง: ฟื้นฟูเลือดอัตโนมัติ 2 หน่วยต่อวินาทีตลอดเวลา',
    emoji: '💚',
    bgColor: 'from-emerald-700 to-teal-650',
    img: '/assets/stories/ghost-whisperer/cards/card-the-climax.png',
  }
];

const SHARE_CODES_MAP: Record<string, string> = {
  'MUTE-GRANDPA': 'card-grandpa-retro',
  'MUTE-CHIEF': 'card-suspicious-chief',
  'MUTE-TANI': 'card-tani-cozy',
  'MUTE-DIARY': 'card-torn-diary',
  'MUTE-PACT': 'card-village-pact',
  'MUTE-ESSENCE': 'card-tani-essence',
  'MUTE-SAFETY': 'card-safety-first',
  'MUTE-GLANCE': 'card-banana-glance',
  'MUTE-EXPLORER': 'card-bold-explorer',
  'MUTE-WINDOW': 'card-window-witness',
  'MUTE-SHOUT': 'card-shouter',
  'MUTE-STALKER': 'card-shadow-stalker',
  'MUTE-IGNORE': 'card-ignorant-ear',
  'MUTE-OFFERING': 'card-offering-giver',
  'MUTE-WHISPER': 'card-ghost-whisperer',
  'MUTE-HOME': 'card-secure-home',
  'MUTE-BARRIER': 'card-amulet-barrier',
  'MUTE-RUNNER': 'card-orchard-runner',
  'MUTE-CLUE': 'card-clue-collector',
  'MUTE-CONFRONT': 'card-confronter',
  'MUTE-SEEKER': 'card-pact-seeker',
  'MUTE-PEACE': 'card-peace-maker',
  'MUTE-SLAYER': 'card-ghost-slayer',
  'MUTE-TRUTH': 'card-truth-holder',
  'MUTE-SAVIOR': 'card-destiny-savior',
  'MUTE-ALLIED': 'card-vengeance-allied',
  'MUTE-COVENANT': 'card-sacrificial-covenant',
};

const getShareCodeForKey = (cardKey: string): string => {
  return Object.keys(SHARE_CODES_MAP).find(k => SHARE_CODES_MAP[k] === cardKey) || '';
};

interface CardAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CardAlbumModal({ isOpen, onClose }: CardAlbumModalProps) {
  const { unlockedGhosts } = useInventoryStore();
  const [activeTab, setActiveTab] = useState<'ALL' | 'CHARACTER' | 'CLUE' | 'EVENT'>('ALL');
  const [shareCodeInput, setShareCodeInput] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('text-rose-600');

  if (!isOpen) return null;

  const filteredCards = ADVENTURE_CARDS.filter(
    (card) => activeTab === 'ALL' || card.category === activeTab
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-stone-300 bg-[#FCFBF9] p-4 md:p-6 shadow-2xl text-stone-850 max-h-[92vh] md:max-h-[88vh] flex flex-col overflow-hidden">
        
        {shareStatus && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 border border-emerald-500/20 text-white font-extrabold text-[9px] px-4 py-1.5 rounded-full shadow-lg animate-bounce select-none pointer-events-none uppercase tracking-wider">
            {shareStatus}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-5 md:right-5 text-stone-400 hover:text-stone-700 text-lg font-bold transition-colors p-1"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-5 flex-shrink-0">
          <h2 className="text-2xl font-black uppercase tracking-wider text-[#2D4B32] flex items-center justify-center gap-2">
            📖 บันทึกคดีลับและพันธะสวนกล้วย
          </h2>
          <p className="text-[10px] font-bold text-stone-500 mt-0.5 uppercase tracking-wider">
            ไขปริศนาความลับของคุณตาและหมู่บ้านผ่านเบาะแส การตัดสินใจ และตัวละครที่คุณรวบรวมได้
          </p>
          <div className="inline-block mt-2 bg-[#2D4B32]/15 border border-[#2D4B32]/35 rounded-full px-4.5 py-1 text-xs font-black text-[#2D4B32]">
            ปลดล็อกแล้ว: <span className="font-extrabold text-[#C96E3A]">{ADVENTURE_CARDS.filter(c => unlockedGhosts.includes(c.key)).length}</span> / {ADVENTURE_CARDS.length} ใบ
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-1 border-b border-stone-200 pb-3 flex-shrink-0">
          {(['ALL', 'CHARACTER', 'CLUE', 'EVENT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? 'bg-[#2D4B32] text-white shadow-md'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {tab === 'ALL' ? 'ทั้งหมด' : tab === 'CHARACTER' ? 'ตัวละคร' : tab === 'CLUE' ? 'เบาะแส' : 'การตัดสินใจ'}
            </button>
          ))}
        </div>

        {/* Import Share Code Form */}
        <div className="mt-4 flex-shrink-0 bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-[#2D4B32] mb-1.5 flex items-center gap-1.5 select-none">
            👥 รับบัฟแชร์จากการส่งรหัสการ์ดของเพื่อน (Enter Friend&apos;s Share Code)
          </h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareCodeInput}
              onChange={(e) => setShareCodeInput(e.target.value.toUpperCase())}
              placeholder="กรอกรหัสแชร์ของเพื่อน เช่น MUTE-TANI เพื่อรับพรอวยพรและตัวการ์ด"
              className="flex-grow rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-bold text-stone-850 placeholder-stone-400 focus:border-[#2D4B32] focus:outline-none"
            />
            <button
              onClick={() => {
                const code = shareCodeInput.trim().toUpperCase();
                const targetCardKey = SHARE_CODES_MAP[code];
                if (targetCardKey) {
                  if (unlockedGhosts.includes(targetCardKey)) {
                    setMessage('คุณได้ปลดล็อกการ์ดและบัฟนี้ไปแล้วครับ!');
                    setMessageColor('text-amber-600');
                  } else {
                    useInventoryStore.getState().unlockGhost(targetCardKey);
                    const matchedCard = ADVENTURE_CARDS.find(c => c.key === targetCardKey);
                    setMessage(`🔮 ปลดล็อกการ์ด "${matchedCard?.name || code}" และแชร์บัฟสำเร็จ!`);
                    setMessageColor('text-emerald-700 font-extrabold');
                    setShareCodeInput('');
                  }
                } else {
                  setMessage('❌ รหัสแชร์ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้งครับ');
                  setMessageColor('text-rose-600 font-extrabold');
                }
                setTimeout(() => setMessage(''), 5000);
              }}
              className="rounded-xl bg-[#2D4B32] hover:bg-[#1E3322] px-5 py-2 text-xs font-black text-white shadow transition-all active:scale-95 flex-shrink-0"
            >
              นำเข้าบัฟเพื่อน
            </button>
          </div>
          {message && (
            <p className={`mt-1.5 text-[9px] font-bold ${messageColor} animate-pulse`}>
              {message}
            </p>
          )}
        </div>

        {/* Card Grid Container (Scrollable) */}
        <div className="flex-grow overflow-y-auto mt-4 pr-1 pb-4 min-h-[150px] md:min-h-[300px]">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {filteredCards.map((card) => {
              const isUnlocked = unlockedGhosts.includes(card.key);

              return (
                <div
                  key={card.key}
                  className={`relative flex flex-col items-center rounded-2xl border p-2 md:p-3.5 text-center transition-all bg-white ${
                    isUnlocked
                      ? 'border-[#2D4B32]/30 shadow-md scale-100 hover:scale-[1.02] hover:shadow-[#2D4B32]/10'
                      : 'border-stone-200 opacity-40 grayscale filter select-none'
                  }`}
                >
                  {/* Card Artwork Bubble */}
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-stone-50 border border-stone-200 flex flex-col items-center justify-center">
                    {isUnlocked ? (
                      /* Stylized gradient fallback card with big emoji */
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} p-2 md:p-3 flex flex-col justify-between text-white`}>
                        <div className="flex justify-between items-start">
                          <span className="bg-black/25 text-[7px] md:text-[8.5px] font-black px-1.5 py-0.5 rounded border border-white/20 uppercase tracking-widest">
                            {card.categoryName}
                          </span>
                          <span className="text-[9px] md:text-sm font-mono font-black text-white/70">
                            No.{ADVENTURE_CARDS.indexOf(card) + 1}
                          </span>
                        </div>
                        <span className="text-3xl md:text-5xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] select-none">
                          {card.emoji}
                        </span>
                        <div className="text-left">
                          <span className="text-[6.5px] md:text-[7.5px] text-white/80 font-black uppercase tracking-wider block">บันทึกวิเศษ</span>
                          <h4 className="text-[8px] md:text-[10px] font-black text-white leading-tight uppercase truncate">{card.name}</h4>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-stone-200 flex flex-col items-center justify-center text-stone-400">
                        <span className="text-xl md:text-2xl">🔒</span>
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest mt-1">LOCKED</span>
                      </div>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="mt-2 md:mt-3.5 flex flex-col items-center w-full">
                    <h3 className={`text-[10px] md:text-xs font-black ${isUnlocked ? 'text-[#1E2922]' : 'text-stone-400'} truncate w-full px-1`}>
                      {card.name}
                    </h3>
                    
                    {isUnlocked ? (
                      <>
                        <p className="mt-1 text-[8.5px] md:text-[9.5px] font-semibold text-stone-500 leading-normal max-w-full text-center h-[36px] md:h-[42px] overflow-hidden text-ellipsis line-clamp-3">
                          {card.desc}
                        </p>
                        <p className="mt-2 text-[8px] md:text-[9px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200/50 rounded-lg p-1.5 md:p-2.5 leading-snug w-full">
                          {card.buff}
                        </p>
                        <button
                          onClick={() => {
                            const code = getShareCodeForKey(card.key);
                            if (code) {
                              navigator.clipboard.writeText(code);
                              setShareStatus(`คัดลอกรหัสแชร์ "${code}" สำเร็จ!`);
                              setTimeout(() => setShareStatus(''), 3000);
                            }
                          }}
                          className="mt-1.5 text-[7px] md:text-[8px] font-black text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 md:py-1 rounded border border-amber-200 select-none flex items-center gap-1 active:scale-95 transition-all w-full justify-center"
                        >
                          👥 คัดลอกรหัสแชร์
                        </button>
                      </>
                    ) : (
                      <p className="mt-2 text-[8px] md:text-[9.5px] font-bold text-stone-450 leading-relaxed italic">
                        {card.category === 'EVENT' ? 'ปลดล็อกตามเนื้อเรื่องคืนต่างๆ' : 'ปลดล็อกตามเหตุการณ์สืบสวน'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Passive Buff Info Footer */}
        <div className="mt-4 bg-stone-50 border border-stone-200 rounded-2xl p-4 flex-shrink-0 text-left">
          <h4 className="text-[10.5px] font-black uppercase tracking-wider text-[#2D4B32] mb-2">
            🔮 พรวิเศษอารักษ์ที่กำลังเปิดใช้งานอยู่ (Active Passive Buffs):
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-[9.5px] font-bold text-stone-600">
            {ADVENTURE_CARDS.filter(c => unlockedGhosts.includes(c.key)).map(c => (
              <div key={c.key} className="flex items-center gap-1.5 bg-white border border-emerald-200/40 rounded-lg px-2.5 py-1.5 text-emerald-900 shadow-sm animate-fade-in">
                <span>✅</span>
                <span className="truncate font-black">{c.buff.split(': ')[1]}</span>
              </div>
            ))}
            {ADVENTURE_CARDS.filter(c => unlockedGhosts.includes(c.key)).length === 0 && (
              <p className="text-stone-400 italic">ไม่มีพรวิเศษเปิดใช้งานอยู่ (ยังไม่พบเบาะแสใดๆ)</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
