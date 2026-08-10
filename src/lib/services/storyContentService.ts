import { prisma } from '@/lib/prisma';
import type { ItemContent, RecipeContent } from '@/lib/content/types';

export interface StoryContentResponse {
  items: ItemContent[];
  recipes: RecipeContent[];
}

export async function getStoryContentBySlug(slug: string): Promise<StoryContentResponse | null> {
  const story = await prisma.story.findUnique({
    where: { slug },
    include: {
      items: true,
      recipes: {
        include: {
          outputItem: true,
          ingredients: { include: { item: true } },
        },
      },
    },
  });

  if (!story) return null;

  const items: ItemContent[] = story.items.map((item) => ({
    key: item.key,
    name: item.name,
    description: item.description ?? undefined,
    type: item.type,
    iconAsset: item.iconAsset ?? undefined,
    stackable: item.stackable,
    maxStack: item.maxStack ?? undefined,
  }));

  const recipes: RecipeContent[] = story.recipes.map((recipe) => ({
    key: recipe.key,
    name: recipe.name,
    outputItemKey: recipe.outputItem.key,
    outputQty: recipe.outputQty,
    requiredToolItemKey: recipe.requiredToolItemKey ?? undefined,
    ingredients: recipe.ingredients.map((ingredient) => ({
      itemKey: ingredient.item.key,
      quantity: ingredient.quantity,
    })),
  }));

  return { items, recipes };
}
