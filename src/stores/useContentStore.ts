import { create } from 'zustand';
import type { ItemContent, RecipeContent } from '@/lib/content/types';

interface ContentState {
  items: ItemContent[];
  recipes: RecipeContent[];
  loaded: boolean;
  error: string | null;
  load: (slug: string) => Promise<void>;
  getItem: (itemKey: string) => ItemContent | undefined;
  getRecipe: (recipeKey: string) => RecipeContent | undefined;
}

export const useContentStore = create<ContentState>((set, get) => ({
  items: [],
  recipes: [],
  loaded: false,
  error: null,
  load: async (slug: string) => {
    try {
      const res = await fetch(`/api/stories/${slug}`);
      if (!res.ok) throw new Error(`Failed to load story content: ${res.status}`);
      const data: { items: ItemContent[]; recipes: RecipeContent[] } = await res.json();
      set({ items: data.items, recipes: data.recipes, loaded: true, error: null });
    } catch (error) {
      console.error(error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', loaded: false });
    }
  },
  getItem: (itemKey: string) => get().items.find((item) => item.key === itemKey),
  getRecipe: (recipeKey: string) => get().recipes.find((recipe) => recipe.key === recipeKey),
}));
