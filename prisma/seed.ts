import { PrismaClient } from '@prisma/client';
import { loadAllStoryContent } from '../src/lib/content/loadStoryContent';

const prisma = new PrismaClient();

async function main() {
  for (const { story, items, recipes, quests } of loadAllStoryContent()) {
    const storyRow = await prisma.story.upsert({
      where: { slug: story.slug },
      update: { name: story.name, theme: story.theme, order: story.order ?? 0 },
      create: {
        slug: story.slug,
        name: story.name,
        theme: story.theme,
        order: story.order ?? 0,
      },
    });

    const itemIdByKey = new Map<string, string>();

    for (const item of items) {
      const itemRow = await prisma.item.upsert({
        where: { storyId_key: { storyId: storyRow.id, key: item.key } },
        update: {
          name: item.name,
          description: item.description,
          type: item.type,
          iconAsset: item.iconAsset,
          stackable: item.stackable ?? true,
          maxStack: item.maxStack ?? 99,
        },
        create: {
          storyId: storyRow.id,
          key: item.key,
          name: item.name,
          description: item.description,
          type: item.type,
          iconAsset: item.iconAsset,
          stackable: item.stackable ?? true,
          maxStack: item.maxStack ?? 99,
        },
      });
      itemIdByKey.set(item.key, itemRow.id);
    }

    for (const recipe of recipes) {
      const outputItemId = itemIdByKey.get(recipe.outputItemKey);
      if (!outputItemId) {
        throw new Error(
          `Recipe "${recipe.key}" references unknown output item "${recipe.outputItemKey}"`,
        );
      }

      const recipeRow = await prisma.recipe.upsert({
        where: { storyId_key: { storyId: storyRow.id, key: recipe.key } },
        update: {
          name: recipe.name,
          outputItemId,
          outputQty: recipe.outputQty,
          requiredToolItemKey: recipe.requiredToolItemKey,
        },
        create: {
          storyId: storyRow.id,
          key: recipe.key,
          name: recipe.name,
          outputItemId,
          outputQty: recipe.outputQty,
          requiredToolItemKey: recipe.requiredToolItemKey,
        },
      });

      await prisma.recipeIngredient.deleteMany({ where: { recipeId: recipeRow.id } });
      await prisma.recipeIngredient.createMany({
        data: recipe.ingredients.map((ingredient) => {
          const itemId = itemIdByKey.get(ingredient.itemKey);
          if (!itemId) {
            throw new Error(
              `Recipe "${recipe.key}" references unknown ingredient item "${ingredient.itemKey}"`,
            );
          }
          return { recipeId: recipeRow.id, itemId, quantity: ingredient.quantity };
        }),
      });
    }

    for (const quest of quests) {
      const questRow = await prisma.quest.upsert({
        where: { storyId_key: { storyId: storyRow.id, key: quest.key } },
        update: { name: quest.name },
        create: { storyId: storyRow.id, key: quest.key, name: quest.name },
      });

      let previousStepId: string | null = null;

      for (const [order, step] of quest.steps.entries()) {
        for (const reward of step.rewards) {
          if (!itemIdByKey.has(reward.itemKey)) {
            throw new Error(
              `Quest step "${step.key}" references unknown reward item "${reward.itemKey}"`,
            );
          }
        }

        const stepRow = (await prisma.questStep.upsert({
          where: { questId_key: { questId: questRow.id, key: step.key } },
          update: {
            order,
            title: step.title,
            content: { dialogue: step.dialogue, objectives: step.objectives, rewards: step.rewards } as any,
            requiresStepId: previousStepId,
            isEpisodeEnd: step.isEpisodeEnd ?? false,
          },
          create: {
            questId: questRow.id,
            key: step.key,
            order,
            title: step.title,
            content: { dialogue: step.dialogue, objectives: step.objectives, rewards: step.rewards } as any,
            requiresStepId: previousStepId,
            isEpisodeEnd: step.isEpisodeEnd ?? false,
          },
        })) as { id: string };

        previousStepId = stepRow.id;
      }
    }

    console.log(
      `Seeded story "${story.slug}" with ${items.length} items, ${recipes.length} recipes and ${quests.length} quests`,
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
