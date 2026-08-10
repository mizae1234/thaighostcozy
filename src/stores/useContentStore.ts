import { create } from 'zustand';
import type { ItemContent, RecipeContent, QuestContent } from '@/lib/content/types';

interface ContentState {
  items: ItemContent[];
  recipes: RecipeContent[];
  quests: QuestContent[];
  loaded: boolean;
  error: string | null;
  load: (slug: string) => Promise<void>;
  getItem: (itemKey: string) => ItemContent | undefined;
  getRecipe: (recipeKey: string) => RecipeContent | undefined;
  getQuest: (questKey: string) => QuestContent | undefined;
}

export const useContentStore = create<ContentState>((set, get) => ({
  items: [],
  recipes: [],
  quests: [],
  loaded: false,
  error: null,
  load: async (slug: string) => {
    try {
      const res = await fetch(`/api/stories/${slug}`);
      if (!res.ok) throw new Error(`Failed to load story content: ${res.status}`);
      const data: { items: ItemContent[]; recipes: RecipeContent[]; quests: QuestContent[] } = await res.json();
      set({ items: data.items, recipes: data.recipes, quests: data.quests || [], loaded: true, error: null });
    } catch (error) {
      console.error(error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', loaded: false });
    }
  },
  getItem: (itemKey: string) => get().items.find((item) => item.key === itemKey),
  getRecipe: (recipeKey: string) => get().recipes.find((recipe) => recipe.key === recipeKey),
  getQuest: (questKey: string) => get().quests.find((quest) => quest.key === questKey),
}));
