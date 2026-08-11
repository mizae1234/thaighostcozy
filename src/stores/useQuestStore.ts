import { create } from 'zustand';
import { useInventoryStore } from './useInventoryStore';
import { usePlayerStatsStore } from './usePlayerStatsStore';
import { EventBus } from '@/game/EventBus';
import type { DialogueLine, QuestContent, QuestStepContent } from '@/lib/content/types';

interface QuestState {
  quests: QuestContent[];
  currentQuestKey: string | null;
  currentStepIndex: number;
  
  // Dialogue state
  isDialogueActive: boolean;
  dialogueLines: DialogueLine[];
  dialogueIndex: number;

  // Choices state
  showChoices: boolean;
  selectedChoices: Record<string, string>;
  
  // Event objectives state
  reachedLocations: Record<string, boolean>;
  talkedNPCs: Record<string, boolean>;
  placedBuildings: Record<string, number>;
  
  // End of Episode state
  isEpisodeEnd: boolean;

  initQuests: (quests: QuestContent[]) => void;
  startQuest: (questKey: string) => void;
  nextDialogue: () => void;
  selectChoice: (choiceKey: string) => void;
  openSleepChoices: () => void;
  
  // Triggers for external actions
  triggerLocationReached: (locationKey: string) => void;
  triggerTalkToNPC: (npcKey: string) => void;
  triggerBuildingPlaced: (recipeKey: string) => void;
  
  checkObjectives: () => void;
}

export const useQuestStore = create<QuestState>((set, get) => {
  // Helper to get active step
  const getActiveStep = (): QuestStepContent | null => {
    const { quests, currentQuestKey, currentStepIndex } = get();
    if (!currentQuestKey) return null;
    const quest = quests.find(q => q.key === currentQuestKey);
    if (!quest) return null;
    return quest.steps[currentStepIndex] || null;
  };

  const startStepDialogue = (step: QuestStepContent) => {
    if (step.dialogue && step.dialogue.length > 0) {
      set({
        isDialogueActive: true,
        dialogueLines: step.dialogue,
        dialogueIndex: 0
      });
    } else {
      set({
        isDialogueActive: false,
        dialogueLines: [],
        dialogueIndex: 0
      });
      // Immediately check objectives if there is no dialogue
      get().checkObjectives();
    }
  };

  const advanceStep = () => {
    const { quests, currentQuestKey, currentStepIndex } = get();
    const quest = quests.find(q => q.key === currentQuestKey);
    if (!quest) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < quest.steps.length) {
      const nextStep = quest.steps[nextIndex];
      set({
        currentStepIndex: nextIndex,
        reachedLocations: {},
        talkedNPCs: {}
      });
      
      // Let Phaser know about the step transition
      EventBus.emit('quest-step-changed', {
        questKey: currentQuestKey,
        stepKey: nextStep.key,
        stepIndex: nextIndex
      });

      startStepDialogue(nextStep);
    } else {
      // Completed last step of episode
      set({ isEpisodeEnd: true });
    }
  };

  return {
    quests: [],
    currentQuestKey: null,
    currentStepIndex: 0,
    isDialogueActive: false,
    dialogueLines: [],
    dialogueIndex: 0,
    showChoices: false,
    selectedChoices: {},
    reachedLocations: {},
    talkedNPCs: {},
    placedBuildings: {},
    isEpisodeEnd: false,

    initQuests: (quests) => {
      set({ quests });
      // Autostart first quest if available
      if (quests.length > 0) {
        get().startQuest(quests[0].key);
      }
    },

    startQuest: (questKey) => {
      const { quests } = get();
      const quest = quests.find(q => q.key === questKey);
      if (!quest) return;

      const firstStep = quest.steps[0];
      set({
        currentQuestKey: questKey,
        currentStepIndex: 0,
        showChoices: false,
        selectedChoices: {},
        reachedLocations: {},
        talkedNPCs: {},
        placedBuildings: {},
        isEpisodeEnd: false
      });

      EventBus.emit('quest-step-changed', {
        questKey,
        stepKey: firstStep.key,
        stepIndex: 0
      });

      startStepDialogue(firstStep);
    },

    nextDialogue: () => {
      const { dialogueIndex, dialogueLines } = get();
      if (dialogueIndex + 1 < dialogueLines.length) {
        set({ dialogueIndex: dialogueIndex + 1 });
      } else {
        // Dialogue completed!
        const step = getActiveStep();
        if (step && step.choices && step.choices.length > 0) {
          // If it is a NIGHT step, do not open choices immediately!
          // Let the player play the night gameplay first.
          if (step.phase === 'NIGHT') {
            set({ isDialogueActive: false, dialogueLines: [], dialogueIndex: 0, showChoices: false });
          } else {
            set({ showChoices: true });
          }
        } else {
          const previousLines = get().dialogueLines;
          set({ isDialogueActive: false, dialogueLines: [], dialogueIndex: 0 });
          
          // Trigger Shop Overlay after Vendor NPC dialogue completes
          if (previousLines.some(line => line.speaker === "แม่ค้าตลาด")) {
            EventBus.emit('open-shop-ui', undefined);
          }

          // Check if we met the objectives already (e.g. if the dialogue completion makes us advance)
          get().checkObjectives();
        }
      }
    },

    openSleepChoices: () => {
      const step = getActiveStep();
      if (step && step.choices && step.choices.length > 0) {
        set({ showChoices: true, isDialogueActive: true });
      }
    },

    selectChoice: (choiceKey) => {
      const step = getActiveStep();
      if (!step || !step.choices) return;

      const choice = step.choices.find(c => c.key === choiceKey);
      if (!choice) return;

      // 1. Record the selected choice
      set((state) => ({
        selectedChoices: {
          ...state.selectedChoices,
          [step.key]: choiceKey
        },
        showChoices: false,
        isDialogueActive: false,
        dialogueLines: [],
        dialogueIndex: 0
      }));

      // 2. Unlock the corresponding card in the adventure log
      useInventoryStore.getState().unlockGhost(choice.cardKey);

      // 3. Award the item (if any)
      if (choice.itemReward) {
        useInventoryStore.getState().add(choice.itemReward, 1);
      }

      // 4. Advance to the next day/phase step
      advanceStep();
    },

    triggerLocationReached: (locationKey) => {
      const step = getActiveStep();
      if (!step) return;

      // Avoid double triggering
      if (get().reachedLocations[locationKey]) return;

      set((state) => ({
        reachedLocations: { ...state.reachedLocations, [locationKey]: true }
      }));
      get().checkObjectives();
    },

    triggerTalkToNPC: (npcKey) => {
      const step = getActiveStep();
      if (!step) return;

      // If already showing dialogue, do not interrupt
      if (get().isDialogueActive) return;

      let customLines: Array<{ speaker: string; thai: string }> = [];
      const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'ghost-whisperer';

      if (slug === 'ghost-whisperer') {
        if (npcKey === 'chief') {
          if (step.key === 'day1-arrival') {
            customLines = [
              { speaker: "ผู้ใหญ่บ้านลุงแดง", thai: "ยินดีต้อนรับกลับมาบ้านสวนนะหลานตาเดช... มีอะไรให้ลุงช่วยก็บอกนะ" },
              { speaker: "ผู้ใหญ่บ้านลุงแดง", thai: "แต่ลุงขอเตือนไว้เรื่องนึง... หลังพระอาทิตย์ตกดิน อย่าริอ่านออกจากบ้านเด็ดขาด! หมู่บ้านนี้ตอนดึกๆ มันอันตราย..." }
            ];
          } else if (step.key === 'day5-night') {
            customLines = [
              { speaker: "ผู้ใหญ่บ้านลุงแดง", thai: "(ลุงแดงสะดุ้งสุดตัวและหันมาทางคุณด้วยสายตามีพิรุธ) เฮ้ย! เจ้าหลานคนนั้น มาเดินทำลับๆ ล่อๆ อะไรแถวนี้ดึกดื่น!" },
              { speaker: "ผู้ใหญ่บ้านลุงแดง", thai: "กลับเข้าบ้านล็อกประตูไปเดี๋ยวนี้เลย! อย่าหาว่าลุงไม่เตือน!" }
            ];
          } else {
            customLines = [
              { speaker: "ผู้ใหญ่บ้านลุงแดง", thai: "ช่วงนี้หมู่บ้านเรามีเรื่องแปลกๆ บ่อย ดูแลตัวเองด้วยนะหลานตาเดช" }
            ];
          }
        } else if (npcKey === 'monk') {
          customLines = [
            { speaker: "หลวงพี่", thai: "เจริญพรโยม... ลานวัดนี้สงบร่มเย็นเสมอ หากจิตใจเหน็ดเหนื่อยหรือเหนื่อยล้า ก็แวะมาเสี่ยงเซียมซีใต้ร่มโพธิ์ได้นะ" },
            { speaker: "หลวงพี่", thai: "สติและความไม่ประมาทจะเป็นเครื่องคุ้มครองโยมในยามราตรี... หลวงพี่มอบยันต์คุ้มภัยและน้ำมนต์นี้ให้โยมคุ้มครองตัวเถิด" }
          ];
          // Restore health and thirst
          usePlayerStatsStore.setState((_state) => ({
            thirst: 100,
            health: 100
          }));
          // Give 1 free protective amulet
          useInventoryStore.getState().add('amulet', 1);
        } else if (npcKey === 'vendor') {
          customLines = [
            { speaker: "แม่ค้าตลาด", thai: "ยินดีต้อนรับสู่ตลาดจ้าหลานตาเดช! สนใจเอาผลผลิตกล้วยน้ำว้ามาแลกเหรียญมู หรือซื้อหาเครื่องรางของชำไปใช้ไหมจ๊ะ?" }
          ];
        } else if (npcKey === 'golden-goby') { // Nang Tani
          if (step.key === 'day3-lockbox') {
            const hairClipsCount = useInventoryStore.getState().quantities['fallen-fruit'] || 0;
            if (hairClipsCount < 3) {
              customLines = [
                { speaker: "แม่นางตานี", thai: "เจ้าหลานตาเดช... ตามหากิ๊บหนีบผมใบตองของข้า 3 ชิ้นที่ตกหล่นแถวๆ บ่อน้ำมาให้ข้าก่อนสิ แล้วข้าจะยอมช่วยเจ้าเจรจาไขกุญแจกล่องไม้ของคุณตา..." }
              ];
            } else {
              customLines = [
                { speaker: "แม่นางตานี", thai: "กิ๊บหนีบผมของข้าครบ 3 ชิ้นจริงๆ ด้วย! ขอบใจมากนะเจ้านักเรียนสายมู..." },
                { speaker: "แม่นางตานี", thai: "ข้าปลดล็อกกล่องไม้โบราณให้แล้ว... แต่ระวังตัวด้วยล่ะ เพราะความจริงในนั้นอาจทำร้ายเจ้า..." }
              ];
            }
          } else if (step.key === 'day6-covenant') {
            customLines = [
              { speaker: "แม่นางตานี", thai: "ยันต์พันธสัญญาเสื่อมโทรมลงมากแล้ว... เจ้าต้องคราฟต์น้ำมันพรายตานีพาสเทลมาตั้งบูชาที่ศาลพระภูมิด่วนที่สุด!" }
            ];
          } else if (step.key === 'day7-climax') {
            customLines = [
              { speaker: "แม่นางตานี", thai: "พวกชาวบ้านพากันขนขวานและเลื่อยยนต์มาจะตัดโค่นต้นกล้วยแม่ตานีประธานของข้า... ข้าจะไม่ทนยอมอีกต่อไปแล้ว!" }
            ];
          } else {
            customLines = [
              { speaker: "แม่นางตานี", thai: "จิตวิญญาณแห่งป่ากล้วยสถิตอยู่รอบตัวเจ้า... เจ้าเด็กน้อย" }
            ];
          }
        }
      } else {
        // Classic Pla Boo Thong NPC dialogues
        if (npcKey === 'golden-goby') {
          if (step.key === 'goby-revealed') {
            customLines = [
              { speaker: "ปลาบู่ทอง", thai: "ขอบใจมากนะเจ้านักเรียนที่ตามหากระดูกของข้าจนพบ..." }
            ];
          } else if (step.key === 'lift-the-curse') {
            customLines = [
              { speaker: "ปลาบู่ทอง", thai: "นำดอกไม้ เปลือกหอย และไม้จันทน์หอมมาร่วมสวดภาวนาเพื่อคลายคำสาปให้ข้าเถอะ" }
            ];
          }
        }
      }

      // If we populated custom dialogue lines, open the overlay!
      if (customLines.length > 0) {
        set({
          isDialogueActive: true,
          dialogueLines: customLines,
          dialogueIndex: 0
        });
      }

      // Set talked NPC state
      set((state) => ({
        talkedNPCs: {
          ...state.talkedNPCs,
          [npcKey]: true
        }
      }));

      // Check objectives immediately
      get().checkObjectives();
    },

    triggerBuildingPlaced: (recipeKey) => {
      set((state) => ({
        placedBuildings: {
          ...state.placedBuildings,
          [recipeKey]: (state.placedBuildings[recipeKey] || 0) + 1
        }
      }));
      get().checkObjectives();
    },

    checkObjectives: () => {
      const step = getActiveStep();
      if (!step || get().isDialogueActive) return;

      const inventory = useInventoryStore.getState().quantities;
      const { reachedLocations, talkedNPCs, placedBuildings } = get();

      // Calculate effective quantities by adding back ingredients consumed for placed structures
      const getEffectiveQty = (itemKey: string): number => {
        let qty = inventory[itemKey] || 0;

        // Campfire consumed: wood x5, coconut x2
        const campfireCount = placedBuildings['campfire'] || 0;
        if (campfireCount > 0) {
          if (itemKey === 'wood') qty += 5 * campfireCount;
          if (itemKey === 'coconut') qty += 2 * campfireCount;
        }

        // Shelter consumed: wood x8, stone x3
        const shelterCount = placedBuildings['shelter'] || 0;
        if (shelterCount > 0) {
          if (itemKey === 'wood') qty += 8 * shelterCount;
          if (itemKey === 'stone') qty += 3 * shelterCount;
        }

        return qty;
      };

      let allMet = true;

      for (const obj of step.objectives) {
        const requiredQty = obj.quantity ?? 1;
        if (obj.type === 'COLLECT') {
          const currentQty = getEffectiveQty(obj.targetKey);
          if (currentQty < requiredQty) allMet = false;
        } else if (obj.type === 'CRAFT') {
          const currentQty = (inventory[obj.targetKey] ?? 0) + (placedBuildings[obj.targetKey] ?? 0);
          if (currentQty < requiredQty) allMet = false;
        } else if (obj.type === 'REACH_LOCATION') {
          if (!reachedLocations[obj.targetKey]) allMet = false;
        } else if (obj.type === 'TALK_TO') {
          if (!talkedNPCs[obj.targetKey]) allMet = false;
        }
      }

      if (allMet) {
        // Grant rewards
        if (step.rewards && step.rewards.length > 0) {
          for (const reward of step.rewards) {
            useInventoryStore.getState().add(reward.itemKey, reward.quantity);
          }
        }

        // Consume items for step 5 "lift-the-curse" to make it feel like they are delivered
        if (step.key === 'lift-the-curse') {
          useInventoryStore.getState().remove('sacred-flower', 1);
          useInventoryStore.getState().remove('pearl-shell', 1);
          useInventoryStore.getState().remove('sandalwood', 1);
        }

        // Advance to next step
        advanceStep();
      }
    }
  };
});

// Automatically verify objectives when inventory updates (avoids circular dependency)
useInventoryStore.subscribe(() => {
  setTimeout(() => {
    useQuestStore.getState().checkObjectives();
  }, 0);
});
