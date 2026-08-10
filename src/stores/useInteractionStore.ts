import { create } from 'zustand';

export type PromptType = 'harvest' | 'talk' | 'warning' | 'info';

interface InteractionPromptState {
  promptText: string | null;
  promptType: PromptType | null;
  setPrompt: (text: string | null, type?: PromptType | null) => void;
}

export const useInteractionStore = create<InteractionPromptState>((set) => ({
  promptText: null,
  promptType: null,
  setPrompt: (text, type = 'info') => set({ promptText: text, promptType: text ? type : null }),
}));
