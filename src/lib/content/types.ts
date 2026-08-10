export type ItemTypeKey = 'RESOURCE' | 'TOOL' | 'QUEST_ITEM' | 'CONSUMABLE' | 'BUILDING';

export interface StoryContent {
  slug: string;
  name: string;
  theme?: string;
  order?: number;
}

export interface ItemContent {
  key: string;
  name: string;
  description?: string;
  type: ItemTypeKey;
  iconAsset?: string;
  stackable?: boolean;
  maxStack?: number;
}

export interface DialogueLine {
  speaker: string;
  thai: string;
  voRef?: string;
}

export interface Objective {
  type: 'COLLECT' | 'CRAFT' | 'REACH_LOCATION' | 'TALK_TO';
  targetKey: string;
  quantity?: number;
}

export interface RewardSpec {
  itemKey: string;
  quantity: number;
}

export interface QuestStepContent {
  key: string;
  title: string;
  scene?: {
    background?: string;
    sceneListRef?: string;
  };
  dialogue: DialogueLine[];
  objectives: Objective[];
  rewards: RewardSpec[];
  isEpisodeEnd?: boolean;
}

export interface QuestContent {
  key: string;
  name: string;
  steps: QuestStepContent[];
}

export interface RecipeIngredientContent {
  itemKey: string;
  quantity: number;
}

export interface RecipeContent {
  key: string;
  name: string;
  outputItemKey: string;
  outputQty: number;
  ingredients: RecipeIngredientContent[];
  requiredToolItemKey?: string;
}

export interface LoadedStory {
  story: StoryContent;
  items: ItemContent[];
  recipes: RecipeContent[];
  quests: QuestContent[];
}
