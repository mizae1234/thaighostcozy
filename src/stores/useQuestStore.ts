import { create } from 'zustand';
import { useInventoryStore } from './useInventoryStore';
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
  
  // Event objectives state
  reachedLocations: Record<string, boolean>;
  talkedNPCs: Record<string, boolean>;
  placedBuildings: Record<string, number>;
  
  // End of Episode state
  isEpisodeEnd: boolean;

  initQuests: (quests: QuestContent[]) => void;
  startQuest: (questKey: string) => void;
  nextDialogue: () => void;
  
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
        set({ isDialogueActive: false, dialogueLines: [], dialogueIndex: 0 });
        
        // Check if we met the objectives already (e.g. if the dialogue completion makes us advance)
        get().checkObjectives();
      }
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

      if (get().talkedNPCs[npcKey]) return;

      set((state) => ({
        talkedNPCs: { ...state.talkedNPCs, [npcKey]: true }
      }));
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
          const currentQty = placedBuildings[obj.targetKey] || 0;
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
