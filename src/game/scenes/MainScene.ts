import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import Player from '../entities/Player';
import ResourceNode from '../entities/ResourceNode';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../config/gameConfig';
import { fitDisplaySize } from '../utils/fitDisplaySize';
import type { BuildingPlacedPayload, PlayerMovedPayload } from '../types';
import { useQuestStore } from '../../stores/useQuestStore';
import { useInventoryStore } from '../../stores/useInventoryStore';
import { useInteractionStore } from '../../stores/useInteractionStore';
import { useContentStore } from '../../stores/useContentStore';
import { usePlayerStatsStore } from '../../stores/usePlayerStatsStore';

const BUILDING_DISPLAY_MAX_DIM = 88;

// World layout, not narrative content — pixel coordinates on the static MVP
// island background (island-background.png), matched by eye to open ground.
const ISLAND_BOUNDS = { centerX: 640, centerY: 360, radiusX: 480, radiusY: 260 };

const PLABOO_RESOURCE_LAYOUT: Array<{ x: number; y: number; itemKey: string; texture: string }> = [
  { x: 460, y: 277, itemKey: 'wood', texture: 'node-wood' },
  { x: 820, y: 277, itemKey: 'wood', texture: 'node-wood' },
  { x: 460, y: 443, itemKey: 'wood', texture: 'node-wood' },
  { x: 820, y: 443, itemKey: 'wood', texture: 'node-wood' },
  { x: 640, y: 221, itemKey: 'wood', texture: 'node-wood' },
  { x: 520, y: 332, itemKey: 'coconut', texture: 'node-coconut' },
  { x: 760, y: 332, itemKey: 'coconut', texture: 'node-coconut' },
  { x: 520, y: 388, itemKey: 'coconut', texture: 'node-coconut' },
  { x: 760, y: 388, itemKey: 'coconut', texture: 'node-coconut' },
  { x: 400, y: 332, itemKey: 'stone', texture: 'node-stone' },
  { x: 880, y: 332, itemKey: 'stone', texture: 'node-stone' },
  { x: 640, y: 499, itemKey: 'stone', texture: 'node-stone' },
];

const GHOST_RESOURCE_LAYOUT: Array<{ x: number; y: number; itemKey: string; texture: string }> = [
  // Top-Left (behind greenhouse/fence)
  { x: 130, y: 220, itemKey: 'wood', texture: 'node-wood' },
  { x: 140, y: 165, itemKey: 'stone', texture: 'node-stone' },
  
  // Center-Left (near greenhouse edge)
  { x: 140, y: 330, itemKey: 'coconut', texture: 'node-coconut' },
  
  // Bottom-Left corner
  { x: 180, y: 520, itemKey: 'wood', texture: 'node-wood' },
  { x: 240, y: 440, itemKey: 'coconut', texture: 'node-coconut' },
  { x: 260, y: 560, itemKey: 'stone', texture: 'node-stone' },
  
  // Bottom-Center / below pond
  { x: 500, y: 560, itemKey: 'wood', texture: 'node-wood' },
  { x: 440, y: 580, itemKey: 'stone', texture: 'node-stone' },
  { x: 740, y: 580, itemKey: 'stone', texture: 'node-stone' },
  
  // Top-Right far corner
  { x: 860, y: 160, itemKey: 'wood', texture: 'node-wood' },
  { x: 800, y: 240, itemKey: 'coconut', texture: 'node-coconut' },
  { x: 880, y: 200, itemKey: 'stone', texture: 'node-stone' },
  
  // Center-Right / next to pond
  { x: 840, y: 380, itemKey: 'coconut', texture: 'node-coconut' },
  { x: 820, y: 440, itemKey: 'stone', texture: 'node-stone' },
];

const BUILDING_TEXTURE_BY_RECIPE: Record<string, string> = {
  campfire: 'building-campfire',
  shelter: 'building-shelter',
};

export default class MainScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;
  private harvestKey!: Phaser.Input.Keyboard.Key;
  private resourceNodes: ResourceNode[] = [];
  private questNodes: ResourceNode[] = [];
  private goldenGobySprite: Phaser.GameObjects.Image | null = null;
  private shopBuilding: Phaser.GameObjects.Image | null = null;
  private currentStepKey: string | null = null;
  private lastEmitted: PlayerMovedPayload | null = null;
  private zoomKey!: Phaser.Input.Keyboard.Key;
  
  private darkOverlay: Phaser.GameObjects.Graphics | null = null;
  private maskGraphics: Phaser.GameObjects.Graphics | null = null;
  private chiefNPC: Phaser.GameObjects.Image | null = null;
  private backgroundImage!: Phaser.GameObjects.Image;

  constructor() {
    super('Main');
  }

  create() {
    this.backgroundImage = this.add.image(0, 0, 'island-background').setOrigin(0, 0).setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT);
    this.spawnResourceNodes();

    const slug = this.registry.get('storySlug') || 'pla-boo-thong';
    const isGhostMode = slug === 'ghost-whisperer';
    if (isGhostMode) {
      this.shopBuilding = this.add.image(340, 520, 'building-shop');
      fitDisplaySize(this.shopBuilding, 88);

      // Setup Night Overlay and Light mask
      this.maskGraphics = this.make.graphics({ x: 0, y: 0 }, false);
      this.darkOverlay = this.add.graphics();
      this.darkOverlay.fillStyle(0x05070a, 0.86);
      this.darkOverlay.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      this.darkOverlay.setDepth(20);

      const mask = this.maskGraphics.createGeometryMask();
      mask.setInvertAlpha(true);
      this.darkOverlay.setMask(mask);
      this.darkOverlay.setVisible(false);
    }

    this.player = new Player(this, ISLAND_BOUNDS.centerX, ISLAND_BOUNDS.centerY);

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    const defaultZoom = slug === 'ghost-whisperer' ? 1.8 : 2.0;
    this.cameras.main.setZoom(defaultZoom);
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.harvestKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.zoomKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    const handleBuildingPlaced = this.onBuildingPlaced.bind(this);
    EventBus.on('building-placed', handleBuildingPlaced);
    
    // Listen to quest step changes
    const handleQuestStepChanged = (payload: { stepKey: string }) => {
      this.onQuestStepChanged(payload.stepKey);
    };
    EventBus.on('quest-step-changed', handleQuestStepChanged);

    const handleRespawn = () => {
      this.player.sprite.setPosition(ISLAND_BOUNDS.centerX, ISLAND_BOUNDS.centerY);
    };
    EventBus.on('respawn-player', handleRespawn);

    const handleToggleZoom = () => {
      const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'pla-boo-thong';
      const closeZoom = slug === 'ghost-whisperer' ? 1.8 : 2.0;
      const wideZoom = slug === 'ghost-whisperer' ? 1.1 : 1.2;
      const targetZoom = this.cameras.main.zoom > 1.4 ? wideZoom : closeZoom;
      this.cameras.main.zoomTo(targetZoom, 300, 'Sine.easeInOut');
    };
    EventBus.on('toggle-camera-zoom', handleToggleZoom);

    const handleVirtualHarvest = () => {
      this.tryHarvest(true);
    };
    EventBus.on('virtual-harvest', handleVirtualHarvest);

    this.events.once('shutdown', () => {
      EventBus.off('building-placed', handleBuildingPlaced);
      EventBus.off('quest-step-changed', handleQuestStepChanged);
      EventBus.off('respawn-player', handleRespawn);
      EventBus.off('toggle-camera-zoom', handleToggleZoom);
      EventBus.off('virtual-harvest', handleVirtualHarvest);
    });

    // Run once on load to spawn entities for current active step
    const currentStep = useQuestStore.getState().quests[0]?.steps[useQuestStore.getState().currentStepIndex];
    if (currentStep) {
      this.onQuestStepChanged(currentStep.key);
    }

    EventBus.emit('current-scene-ready', this);
  }

  update() {
    const isDialogueActive = useQuestStore.getState().isDialogueActive;
    const isEpisodeEnd = useQuestStore.getState().isEpisodeEnd;
    const hunger = usePlayerStatsStore.getState().hunger;
    const thirst = usePlayerStatsStore.getState().thirst;
    const isStarving = hunger === 0 || thirst === 0;

    const hasTani = useInventoryStore.getState().unlockedGhosts.includes('tani');
    const speedMultiplier = hasTani ? 1.2 : 1.0;

    this.player.update(this.cursors, this.wasd, isDialogueActive, isEpisodeEnd, isStarving, speedMultiplier);
    this.clampToIsland();
    this.emitPlayerMovedIfChanged();
    this.tryHarvest();
    this.checkWellDistance();
    this.updateInteractionPrompt();

    // Night light cone circle drawing
    const currentStep = useQuestStore.getState().quests[0]?.steps[useQuestStore.getState().currentStepIndex];
    const isNight = currentStep?.phase === 'NIGHT';

    if (isNight && this.maskGraphics && this.darkOverlay) {
      this.darkOverlay.setVisible(true);
      this.maskGraphics.clear();
      this.maskGraphics.fillStyle(0xffffff);
      this.maskGraphics.fillCircle(this.player.sprite.x, this.player.sprite.y, 110);
    } else if (this.darkOverlay) {
      this.darkOverlay.setVisible(false);
    }

    // Toggle camera zoom with Z key
    if (Phaser.Input.Keyboard.JustDown(this.zoomKey)) {
      const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'pla-boo-thong';
      const closeZoom = slug === 'ghost-whisperer' ? 1.8 : 2.0;
      const wideZoom = slug === 'ghost-whisperer' ? 1.1 : 1.2;
      const targetZoom = this.cameras.main.zoom > 1.4 ? wideZoom : closeZoom;
      this.cameras.main.zoomTo(targetZoom, 300, 'Sine.easeInOut');
    }
  }

  private updateInteractionPrompt() {
    // If dialogue is active, hide interactive prompts
    if (useQuestStore.getState().isDialogueActive || useQuestStore.getState().isEpisodeEnd) {
      useInteractionStore.getState().setPrompt(null);
      return;
    }

    const playerX = this.player.sprite.x;
    const playerY = this.player.sprite.y;

    // Resolve story slug
    const slug = this.registry.get('storySlug') || 'pla-boo-thong';

    // 1. Check Goby NPC proximity
    if (this.goldenGobySprite) {
      const dist = Phaser.Math.Distance.Between(playerX, playerY, this.goldenGobySprite.x, this.goldenGobySprite.y);
      if (dist < 45) {
        const npcName = slug === 'ghost-whisperer' ? 'แม่นางตานี' : 'ปลาบู่ทอง';
        if (slug === 'ghost-whisperer') {
          useInteractionStore.getState().setPrompt(`คุยกับ ${npcName}`, 'talk');
          return;
        } else {
          const actionSuffix = this.currentStepKey === 'lift-the-curse' ? 'เพื่อปลดคำสาป' : '';
          useInteractionStore.getState().setPrompt(`คุยกับ ${npcName} ${actionSuffix}`, 'talk');
          return;
        }
      }
    }

    // 1.2. Check Chief NPC proximity
    if (this.chiefNPC) {
      const dist = Phaser.Math.Distance.Between(playerX, playerY, this.chiefNPC.x, this.chiefNPC.y);
      if (dist < 45) {
        useInteractionStore.getState().setPrompt('คุยกับ ผู้ใหญ่บ้านลุงแดง', 'talk');
        return;
      }
    }

    // 1.5. Check Shop proximity (Ghost Mode only)
    if (this.shopBuilding) {
      const dist = Phaser.Math.Distance.Between(playerX, playerY, this.shopBuilding.x, this.shopBuilding.y);
      if (dist < 45) {
        useInteractionStore.getState().setPrompt('เปิดร้านค้าสายมูของป้าศรี', 'talk');
        return;
      }
    }

    // 2. Check well proximity (Step 2 well-song or Day 6/7)
    const isWellStep = this.currentStepKey === 'well-song' || this.currentStepKey === 'day6-covenant' || this.currentStepKey === 'day7-climax';
    if (isWellStep) {
      const wellX = 640;
      const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'pla-boo-thong';
      const wellY = slug === 'ghost-whisperer' ? 460 : 360;
      const dist = Phaser.Math.Distance.Between(playerX, playerY, wellX, wellY);
      if (dist < 100 && !useQuestStore.getState().reachedLocations['well']) {
        useInteractionStore.getState().setPrompt(slug === 'ghost-whisperer' ? 'เดินเข้าไปใกล้บ่อน้ำโบราณท้ายสวน' : 'เดินเข้าไปใกล้บ่อน้ำโบราณเพื่อฟังเพลง', 'info');
        return;
      }
    }

    // 3. Check quest item nodes
    const now = this.time.now;
    const playerBounds = this.player.sprite.getBounds();
    const closeQuestNode = this.questNodes.find(
      (node) =>
        node.canHarvest(now) &&
        Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, node.sprite.getBounds()),
    );

    if (closeQuestNode) {
      const itemData = useContentStore.getState().getItem(closeQuestNode.itemKey);
      const thaiName = itemData?.name || closeQuestNode.itemKey;
      if (closeQuestNode.itemKey === 'sandalwood') {
        const hasKnife = useInventoryStore.getState().quantities['knife'] > 0;
        if (!hasKnife) {
          useInteractionStore.getState().setPrompt(`ต้องมี มีด (สร้างจากเมนูซ้าย) เพื่อตัด${thaiName}`, 'warning');
        } else {
          useInteractionStore.getState().setPrompt(`ตัด ${thaiName}`, 'harvest');
        }
      } else {
        useInteractionStore.getState().setPrompt(`เก็บ ${thaiName}`, 'harvest');
      }
      return;
    }

    // 4. Check normal resource nodes
    const closeNode = this.resourceNodes.find(
      (node) =>
        node.canHarvest(now) &&
        Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, node.sprite.getBounds()),
    );

    if (closeNode) {
      const itemData = useContentStore.getState().getItem(closeNode.itemKey);
      const thaiName = itemData?.name || (closeNode.itemKey === 'wood' ? 'ลังไม้' : closeNode.itemKey === 'coconut' ? 'มะพร้าว' : 'หิน');
      useInteractionStore.getState().setPrompt(`เก็บ ${thaiName}`, 'harvest');
      return;
    }

    // Clear prompt if nothing is nearby
    useInteractionStore.getState().setPrompt(null);
  }

  private spawnResourceNodes() {
    const slug = this.registry.get('storySlug') || 'pla-boo-thong';
    const layout = slug === 'ghost-whisperer' ? GHOST_RESOURCE_LAYOUT : PLABOO_RESOURCE_LAYOUT;
    this.resourceNodes = layout.map(({ x, y, itemKey, texture }) => new ResourceNode(this, x, y, texture, itemKey));
  }

  private onQuestStepChanged(stepKey: string) {
    this.currentStepKey = stepKey;

    // Resolve story slug and active step
    const slug = this.registry.get('storySlug') || 'pla-boo-thong';
    const isGhostMode = slug === 'ghost-whisperer';
    const currentStep = useQuestStore.getState().quests[0]?.steps[useQuestStore.getState().currentStepIndex];
    const isNight = currentStep?.phase === 'NIGHT';

    // Update background texture dynamically
    if (this.backgroundImage) {
      if (isNight && this.textures.exists('island-background-night')) {
        this.backgroundImage.setTexture('island-background-night');
      } else {
        this.backgroundImage.setTexture('island-background');
      }
    }

    // Toggle resources visibility
    this.resourceNodes.forEach((node) => {
      if (isNight) {
        node.sprite.setVisible(false);
      } else {
        node.sprite.setVisible(true);
      }
    });

    // Clear previous quest items
    this.questNodes.forEach((node) => {
      node.sprite.destroy();
      if (node.shadow) {
        node.shadow.destroy();
      }
    });
    this.questNodes = [];

    // Clear NPC sprites
    if (this.goldenGobySprite) {
      this.goldenGobySprite.destroy();
      this.goldenGobySprite = null;
    }
    if (this.chiefNPC) {
      this.chiefNPC.destroy();
      this.chiefNPC = null;
    }

    // Step-specific spawns
    if (isGhostMode) {
      // 1. Spawning Chief NPC (ลุงแดง)
      if (stepKey === 'day1-arrival') {
        const chiefX = ISLAND_BOUNDS.centerX + 120;
        const chiefY = ISLAND_BOUNDS.centerY;
        const texture = this.textures.exists('npc-chief-down') ? 'npc-chief-down' : 'golden-goby';
        this.chiefNPC = this.add.image(chiefX, chiefY, texture);
        fitDisplaySize(this.chiefNPC, 64);
      } else if (stepKey === 'day5-night') {
        const chiefX = 460;
        const chiefY = 277;
        const texture = this.textures.exists('npc-chief-walk1') ? 'npc-chief-walk1' : 'golden-goby';
        this.chiefNPC = this.add.image(chiefX, chiefY, texture);
        fitDisplaySize(this.chiefNPC, 64);
      }

      // 2. Spawning Tani NPC (using golden-goby sprite key)
      const taniSteps = ['day3-lockbox', 'day3-night', 'day6-covenant', 'day6-night', 'day7-climax', 'day7-night'];
      if (taniSteps.includes(stepKey)) {
        this.spawnGoldenGoby(stepKey);
      }

      // 3. Spawning 3 hair clips around the well on Day 3
      if (stepKey === 'day3-lockbox') {
        const wellX = 640;
        const wellY = 460; // well y is 460 in ghost mode
        const fruitLocs: Array<{ x: number; y: number }> = [];
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 80 + Math.random() * 140;
          const x = wellX + Math.cos(angle) * dist;
          const y = wellY + Math.sin(angle) * dist * 0.54;
          fruitLocs.push({ x, y });
        }
        this.questNodes = fruitLocs.map(
          (loc) => new ResourceNode(this, loc.x, loc.y, 'prop-fallen-fruit', 'fallen-fruit'),
        );
      }
    } else {
      // Classic Pla Boo Thong steps
      if (stepKey === 'well-song') {
        const fruitLocs: Array<{ x: number; y: number }> = [];
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 80 + Math.random() * 140;
          const x = 640 + Math.cos(angle) * dist;
          const y = 360 + Math.sin(angle) * dist * 0.54;
          fruitLocs.push({ x, y });
        }
        this.questNodes = fruitLocs.map(
          (loc) => new ResourceNode(this, loc.x, loc.y, 'prop-fallen-fruit', 'fallen-fruit'),
        );
      } else if (stepKey === 'goby-revealed') {
        this.spawnGoldenGoby();
      } else if (stepKey === 'collect-three-treasures') {
        this.spawnGoldenGoby();
        const flowerX = 640 + (Math.random() - 0.5) * 180;
        const flowerY = 160 + Math.random() * 60;
        this.questNodes.push(new ResourceNode(this, flowerX, flowerY, 'prop-flower', 'sacred-flower'));

        const shellX = 220 + Math.random() * 80;
        const shellY = 350 + (Math.random() - 0.5) * 100;
        this.questNodes.push(new ResourceNode(this, shellX, shellY, 'prop-shell', 'pearl-shell'));

        const woodX = 520 + Math.random() * 160;
        const woodY = 490 + Math.random() * 50;
        this.questNodes.push(new ResourceNode(this, woodX, woodY, 'prop-sandalwood', 'sandalwood'));
      } else if (stepKey === 'lift-the-curse') {
        this.spawnGoldenGoby();
      }
    }
  }

  private spawnGoldenGoby(stepKey = '') {
    const gobyX = 640;
    const gobyY = 330;
    const isScary = stepKey === 'day6-night' || stepKey === 'day7-night';
    const texture = isScary && this.textures.exists('npc-tani-angry') ? 'npc-tani-angry' : 'golden-goby';

    this.goldenGobySprite = this.add.image(gobyX, gobyY, texture);
    fitDisplaySize(this.goldenGobySprite, 64);

    this.tweens.add({
      targets: this.goldenGobySprite,
      y: gobyY - 8,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private checkWellDistance() {
    const isWellStep = this.currentStepKey === 'well-song' || this.currentStepKey === 'day6-covenant' || this.currentStepKey === 'day7-climax';
    if (isWellStep) {
      const wellX = 640;
      const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'pla-boo-thong';
      const wellY = slug === 'ghost-whisperer' ? 460 : 360;
      const dist = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        wellX,
        wellY,
      );
      if (dist < 50) {
        useQuestStore.getState().triggerLocationReached('well');
      }
    }
  }

  // Clamping to island boundary ellipse
  private clampToIsland() {
    const slug = typeof window !== 'undefined' 
      ? window.location.pathname.split('/').pop() 
      : 'pla-boo-thong';
    if (slug === 'ghost-whisperer') return;

    const sprite = this.player.sprite;
    const dx = (sprite.x - ISLAND_BOUNDS.centerX) / ISLAND_BOUNDS.radiusX;
    const dy = (sprite.y - ISLAND_BOUNDS.centerY) / ISLAND_BOUNDS.radiusY;
    const dist = Math.hypot(dx, dy);

    if (dist > 1) {
      const angle = Math.atan2(dy, dx);
      sprite.x = ISLAND_BOUNDS.centerX + Math.cos(angle) * ISLAND_BOUNDS.radiusX;
      sprite.y = ISLAND_BOUNDS.centerY + Math.sin(angle) * ISLAND_BOUNDS.radiusY;
    }
  }

  private tryHarvest(force = false) {
    if (!force && !Phaser.Input.Keyboard.JustDown(this.harvestKey)) return;

    const now = this.time.now;
    const playerBounds = this.player.sprite.getBounds();

    // 1. Prioritize talking to Golden Goby if nearby
    if (this.goldenGobySprite) {
      const dist = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        this.goldenGobySprite.x,
        this.goldenGobySprite.y
      );
      if (dist < 45) {
        const slug = this.registry.get('storySlug') || 'pla-boo-thong';
        if (slug === 'ghost-whisperer') {
          useQuestStore.getState().triggerTalkToNPC('golden-goby');
          return;
        } else if (this.currentStepKey === 'goby-revealed' || this.currentStepKey === 'lift-the-curse') {
          useQuestStore.getState().triggerTalkToNPC('golden-goby');
          return;
        }
      }
    }

    // 1.2. Prioritize talking to Chief if nearby
    if (this.chiefNPC) {
      const dist = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        this.chiefNPC.x,
        this.chiefNPC.y
      );
      if (dist < 45) {
        useQuestStore.getState().triggerTalkToNPC('chief');
        return;
      }
    }

    // 1.5. Check Shop Proximity to open shop UI
    if (this.shopBuilding) {
      const dist = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        this.shopBuilding.x,
        this.shopBuilding.y
      );
      if (dist < 45) {
        EventBus.emit('open-shop-ui', undefined);
        return;
      }
    }

    // 2. Next, check quest node harvesting
    const questNode = this.questNodes.find(
      (candidate) =>
        candidate.canHarvest(now) &&
        Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, candidate.sprite.getBounds()),
    );

    if (questNode) {
      // Sandalwood knife check (crafting-gate)
      if (questNode.itemKey === 'sandalwood') {
        const hasKnife = useInventoryStore.getState().quantities['knife'] > 0;
        if (!hasKnife) {
          const itemData = useContentStore.getState().getItem('sandalwood');
          const sandalwoodName = itemData?.name || 'ไม้จันทน์';
          const warnText = this.add.text(
            this.player.sprite.x,
            this.player.sprite.y - 42,
            `ต้องใช้มีดเพื่อตัด${sandalwoodName}!`,
            {
              fontFamily: 'Courier',
              fontSize: '14px',
              color: '#ff3333',
              stroke: '#000000',
              strokeThickness: 3,
              fontStyle: 'bold',
            },
          ).setOrigin(0.5);

          this.tweens.add({
            targets: warnText,
            y: warnText.y - 25,
            alpha: 0,
            duration: 1500,
            onComplete: () => warnText.destroy(),
          });
          return;
        }
      }

      questNode.harvest(now);
      questNode.sprite.destroy();
      if (questNode.shadow) {
        questNode.shadow.destroy();
      }
      this.questNodes = this.questNodes.filter((n) => n !== questNode);

      EventBus.emit('resource-collected', { itemKey: questNode.itemKey, amount: questNode.yieldAmount });
      usePlayerStatsStore.getState().deductOnAction(5, 5);
      return;
    }

    // 3. Last, check normal node harvesting
    const node = this.resourceNodes.find(
      (candidate) =>
        candidate.canHarvest(now) &&
        Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, candidate.sprite.getBounds()),
    );

    if (!node) return;

    node.harvest(now);
    EventBus.emit('resource-collected', { itemKey: node.itemKey, amount: node.yieldAmount });
    usePlayerStatsStore.getState().deductOnAction(5, 5);
  }

  private onBuildingPlaced(payload: BuildingPlacedPayload) {
    const texture = BUILDING_TEXTURE_BY_RECIPE[payload.recipeKey];
    if (!texture) return;

    // Shift the campfire down by 20px so its base stones sit on the ground
    const buildY = payload.y + 20;
    const shadowY = payload.y + 34;

    const shadow = this.add.image(payload.x, shadowY, 'contact-shadow');
    shadow.setScale(1.3, 0.9); // Flat oval shadow

    const image = this.add.image(payload.x, buildY, texture);
    fitDisplaySize(image, BUILDING_DISPLAY_MAX_DIM);
  }

  private emitPlayerMovedIfChanged() {
    const { x, y } = this.player.position;
    const payload: PlayerMovedPayload = {
      x,
      y,
      direction: this.player.direction,
      isMoving: this.player.isMoving,
    };

    const changed =
      !this.lastEmitted ||
      this.lastEmitted.x !== payload.x ||
      this.lastEmitted.y !== payload.y ||
      this.lastEmitted.direction !== payload.direction ||
      this.lastEmitted.isMoving !== payload.isMoving;

    if (changed) {
      this.lastEmitted = payload;
      EventBus.emit('player-moved', payload);
    }
  }
}
