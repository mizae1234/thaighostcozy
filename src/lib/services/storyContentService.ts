import { prisma } from '@/lib/prisma';
import type { ItemContent, RecipeContent, QuestContent } from '@/lib/content/types';

export interface StoryContentResponse {
  items: ItemContent[];
  recipes: RecipeContent[];
  quests: QuestContent[];
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
      quests: {
        orderBy: { order: 'asc' },
        include: {
          steps: {
            orderBy: { order: 'asc' },
          },
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

  const quests: QuestContent[] = story.quests.map((quest) => ({
    key: quest.key,
    name: quest.name,
    steps: quest.steps.map((step) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const content = step.content as any;
      return {
        key: step.key,
        title: step.title,
        dialogue: content.dialogue || [],
        objectives: content.objectives || [],
        rewards: content.rewards || [],
        choices: content.choices || [],
        phase: content.phase || 'DAY',
        isEpisodeEnd: step.isEpisodeEnd,
      };
    }),
  }));

  return { items, recipes, quests };
}
