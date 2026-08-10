import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import type { ItemContent, LoadedStory, QuestContent, RecipeContent, StoryContent } from './types';

const STORIES_ROOT = path.join(process.cwd(), 'content', 'stories');

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
}

export function loadAllStoryContent(): LoadedStory[] {
  return readdirSync(STORIES_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => loadStoryContent(entry.name));
}

export function loadStoryContent(slug: string): LoadedStory {
  const storyDir = path.join(STORIES_ROOT, slug);
  const story = readJson<StoryContent>(path.join(storyDir, 'story.json'));
  const items = readJson<ItemContent[]>(path.join(storyDir, 'items.json'));
  const recipes = readJson<RecipeContent[]>(path.join(storyDir, 'recipes.json'));
  const quests = readJson<QuestContent[]>(path.join(storyDir, 'quests.json'));
  return { story, items, recipes, quests };
}
