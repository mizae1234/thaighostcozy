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
  private currentArea: 'orchard' | 'temple' | 'market' = 'orchard';
  private isTransitioning = false;
  private siansiProp: Phaser.GameObjects.Image | null = null;
  private lottoVendorNPC: Phaser.GameObjects.Image | null = null;
  private monkNPC: Phaser.GameObjects.Image | null = null;
  private vendorNPC: Phaser.GameObjects.Image | null = null;
  private leftAreaSign: Phaser.GameObjects.Text | null = null;
  private rightAreaSign: Phaser.GameObjects.Text | null = null;
  private nightHerbs: Phaser.GameObjects.Image[] = [];
  private shadowGhost: Phaser.Physics.Arcade.Sprite | null = null;
  private npcHomePositions: Map<Phaser.GameObjects.Image, { x: number; y: number; rangeX: number; rangeY: number }> = new Map();

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

    // Create screen boundary signposts
    this.leftAreaSign = this.add.text(180, 415, '◀ ไปวัด', {
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#ffffff',
      backgroundColor: '#5c3a2acc',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(2000);
    this.leftAreaSign.setStroke('#c96e3a', 2);

    this.rightAreaSign = this.add.text(1100, 415, 'ไปตลาด ▶', {
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#ffffff',
      backgroundColor: '#5c3a2acc',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(2000);
    this.rightAreaSign.setStroke('#c96e3a', 2);

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
    const health = usePlayerStatsStore.getState().health;
    const isStarving = hunger === 0 || thirst === 0;
    const isLowEnergy = hunger <= 30 || thirst <= 30;

    // Calculate dynamic advice warning text to display above player head in Phaser
    let warningText: string | null = null;
    if (health <= 30) {
      const amuletCount = useInventoryStore.getState().quantities['amulet'] ?? 0;
      if (amuletCount === 0) {
        warningText = '🚨 เลือดวิกฤต! (ซื้อยันต์กันผี 🌸 ที่ป้าศรี)';
      } else {
        warningText = '🚨 เลือดวิกฤต! (ฟื้นพลังกับหลวงพี่ ⛪)';
      }
    } else if (isLowEnergy) {
      const hasGlasses = (useInventoryStore.getState().quantities['retro-sunglasses'] ?? 0) > 0;
      if (!hasGlasses) {
        warningText = '⚠️ พลังจะหมด! (ซื้อแว่น Y2K 🕶️ ที่ป้าศรี)';
      } else {
        warningText = '⚠️ พลังจะหมด! (กดกินมะพร้าว/ชา 🥥)';
      }
    }

    const hasTani = useInventoryStore.getState().unlockedGhosts.includes('tani');
    const hasElephantPants = useInventoryStore.getState().quantities['elephant-pants'] > 0;
    const speedMultiplier = (hasTani ? 1.2 : 1.0) * (hasElephantPants ? 1.1 : 1.0);

    this.player.update(this.cursors, this.wasd, isDialogueActive || this.isTransitioning, isEpisodeEnd, isStarving, speedMultiplier, warningText);
    this.clampToIsland();
    this.emitPlayerMovedIfChanged();
    this.tryHarvest();
    this.checkWellDistance();
    this.updateInteractionPrompt();
    this.checkAreaTransitions();

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

    // Ghost movement and chasing logic
    if (this.shadowGhost && this.shadowGhost.active) {
      const angle = Phaser.Math.Angle.Between(this.shadowGhost.x, this.shadowGhost.y, this.player.sprite.x, this.player.sprite.y);
      const ghostSpeed = 50; // Slower than player (120) so the player can flee
      if (this.shadowGhost.body) {
        (this.shadowGhost.body as Phaser.Physics.Arcade.Body).setVelocity(Math.cos(angle) * ghostSpeed, Math.sin(angle) * ghostSpeed);
      }

      // Simple bobbing scale/squish for spirit effect
      const bob = Math.sin(this.time.now / 150) * 0.05;
      this.shadowGhost.setScale((64 / this.shadowGhost.width) * (1 + bob), (64 / this.shadowGhost.height) * (1 - bob));

      // Overlap damage check
      const dist = Phaser.Math.Distance.Between(this.shadowGhost.x, this.shadowGhost.y, this.player.sprite.x, this.player.sprite.y);
      if (dist < 40) {
        const amuletCount = useInventoryStore.getState().quantities['amulet'] ?? 0;
        if (amuletCount > 0) {
          useInventoryStore.getState().remove('amulet', 1);
          useInteractionStore.getState().setPrompt('🌸 ยันต์แดงคุ้มภัยช่วยบล็อกความเสียหายจากวิญญาณเงาดำ! (เสียยันต์ x1)', 'info');
        } else {
          const currentHealth = usePlayerStatsStore.getState().health;
          if (currentHealth > 0) {
            usePlayerStatsStore.setState({ health: Math.max(0, currentHealth - 25) });
            useInteractionStore.getState().setPrompt('❗️ ถูกวิญญาณเงาดำหลอน! เสียพลังชีวิต', 'info');
          }
        }
        // Teleport ghost away slightly to avoid instant death
        this.shadowGhost.setPosition(
          this.player.sprite.x + (Math.random() > 0.5 ? 200 : -200),
          this.player.sprite.y + (Math.random() > 0.5 ? 200 : -200)
        );
      }
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

    if (this.currentArea === 'temple') {
      if (this.siansiProp) {
        const dist = Phaser.Math.Distance.Between(playerX, playerY, this.siansiProp.x, this.siansiProp.y);
        if (dist < 50) {
          useInteractionStore.getState().setPrompt('เสี่ยงเซียมซีทำนายดวง', 'talk');
          return;
        }
      }
      if (this.monkNPC) {
        const dist = Phaser.Math.Distance.Between(playerX, playerY, this.monkNPC.x, this.monkNPC.y);
        if (dist < 50) {
          useInteractionStore.getState().setPrompt('คุยกับหลวงพี่ เพื่อรับน้ำมนต์ (ฟื้นฟูเลือด & น้ำดื่มฟรี! ⛪)', 'talk');
          return;
        }
      }
      useInteractionStore.getState().setPrompt(null);
      return;
    }

    if (this.currentArea === 'market') {
      if (this.lottoVendorNPC) {
        const dist = Phaser.Math.Distance.Between(playerX, playerY, this.lottoVendorNPC.x, this.lottoVendorNPC.y);
        if (dist < 50) {
          useInteractionStore.getState().setPrompt('ซื้อสลากกินแบ่งสายมู', 'talk');
          return;
        }
      }
      if (this.vendorNPC) {
        const dist = Phaser.Math.Distance.Between(playerX, playerY, this.vendorNPC.x, this.vendorNPC.y);
        if (dist < 50) {
          useInteractionStore.getState().setPrompt('คุยกับแม่ค้า เพื่อซื้อขายของ', 'talk');
          return;
        }
      }
      useInteractionStore.getState().setPrompt(null);
      return;
    }

    if (this.currentArea !== 'orchard') {
      useInteractionStore.getState().setPrompt(null);
      return;
    }

    // 0. Night-time specific interactions
    const currentStep = useQuestStore.getState().quests[0]?.steps[useQuestStore.getState().currentStepIndex];
    const isNight = currentStep?.phase === 'NIGHT';

    if (isNight && this.currentArea === 'orchard') {
      // 0.1 Check house sleeping trigger
      const distToHouse = Phaser.Math.Distance.Between(playerX, playerY, 640, 280);
      if (distToHouse < 60) {
        useInteractionStore.getState().setPrompt('เข้านอนที่บ้านสวน', 'talk');
        return;
      }

      // 0.2 Check night herbs proximity
      for (const herb of this.nightHerbs) {
        if (herb.active) {
          const distToHerb = Phaser.Math.Distance.Between(playerX, playerY, herb.x, herb.y);
          if (distToHerb < 50) {
            useInteractionStore.getState().setPrompt('เก็บว่านตานีราตรี', 'harvest');
            return;
          }
        }
      }
    }

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
    this.resourceNodes = layout.map(({ x, y, itemKey, texture }) => {
      // Add random starting jitter to x and y coordinates to prevent same spawn location on boot
      const rx = x + (Math.random() - 0.5) * 120;
      const ry = y + (Math.random() - 0.5) * 120;
      return new ResourceNode(this, rx, ry, texture, itemKey);
    });
  }

  private onQuestStepChanged(stepKey: string) {
    this.currentStepKey = stepKey;

    // Resolve story slug and active step
    const slug = this.registry.get('storySlug') || 'pla-boo-thong';
    const isGhostMode = slug === 'ghost-whisperer';

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
        this.registerNPCWander(this.chiefNPC, chiefX, chiefY, 50, 30);
      } else if (stepKey === 'day5-night') {
        const chiefX = 460;
        const chiefY = 277;
        const texture = this.textures.exists('npc-chief-walk1') ? 'npc-chief-walk1' : 'golden-goby';
        this.chiefNPC = this.add.image(chiefX, chiefY, texture);
        fitDisplaySize(this.chiefNPC, 64);
        this.registerNPCWander(this.chiefNPC, chiefX, chiefY, 50, 30);
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
    this.updateAreaEnvironment();
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
    const quests = useQuestStore.getState().quests;
    const currentQuestKey = useQuestStore.getState().currentQuestKey;
    const currentStepIndex = useQuestStore.getState().currentStepIndex;
    const quest = quests.find(q => q.key === currentQuestKey);
    const step = quest?.steps[currentStepIndex];
    
    const hasWellObjective = step?.objectives?.some(
      obj => obj.type === 'REACH_LOCATION' && obj.targetKey === 'well'
    ) || this.currentStepKey === 'well-song';

    if (hasWellObjective) {
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

    if (this.currentArea === 'temple') {
      if (this.siansiProp) {
        const dist = Phaser.Math.Distance.Between(this.player.sprite.x, this.player.sprite.y, this.siansiProp.x, this.siansiProp.y);
        if (dist < 50) {
          EventBus.emit('open-siansi-ui', undefined);
          return;
        }
      }
      if (this.monkNPC) {
        const dist = Phaser.Math.Distance.Between(this.player.sprite.x, this.player.sprite.y, this.monkNPC.x, this.monkNPC.y);
        if (dist < 50) {
          useQuestStore.getState().triggerTalkToNPC('monk');
          return;
        }
      }
      return;
    }

    if (this.currentArea === 'market') {
      if (this.lottoVendorNPC) {
        const dist = Phaser.Math.Distance.Between(this.player.sprite.x, this.player.sprite.y, this.lottoVendorNPC.x, this.lottoVendorNPC.y);
        if (dist < 50) {
          EventBus.emit('open-lotto-ui', undefined);
          return;
        }
      }
      if (this.vendorNPC) {
        const dist = Phaser.Math.Distance.Between(this.player.sprite.x, this.player.sprite.y, this.vendorNPC.x, this.vendorNPC.y);
        if (dist < 50) {
          useQuestStore.getState().triggerTalkToNPC('vendor');
          return;
        }
      }
      return;
    }

    if (this.currentArea !== 'orchard') return;

    // 0. Night-time specific interactions
    const currentStep = useQuestStore.getState().quests[0]?.steps[useQuestStore.getState().currentStepIndex];
    const isNight = currentStep?.phase === 'NIGHT';

    if (isNight) {
      // 0.1 Check house sleeping interaction
      const distToHouse = Phaser.Math.Distance.Between(this.player.sprite.x, this.player.sprite.y, 640, 280);
      if (distToHouse < 60) {
        useQuestStore.getState().openSleepChoices();
        return;
      }

      // 0.2 Check night herbs harvesting interaction
      for (let i = 0; i < this.nightHerbs.length; i++) {
        const herb = this.nightHerbs[i];
        if (herb && herb.active) {
          const dist = Phaser.Math.Distance.Between(this.player.sprite.x, this.player.sprite.y, herb.x, herb.y);
          if (dist < 50) {
            herb.destroy();
            this.nightHerbs.splice(i, 1);
            useInventoryStore.getState().add('night-herb', 1);
            useInteractionStore.getState().setPrompt('เก็บว่านตานีราตรีสำเร็จ! 🌿', 'info');
            setTimeout(() => {
              useInteractionStore.getState().setPrompt(null);
            }, 2000);
            return;
          }
        }
      }
    }

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

  private checkAreaTransitions() {
    const slug = this.registry.get('storySlug') || 'pla-boo-thong';
    if (slug !== 'ghost-whisperer') return;
    if (this.isTransitioning) return;

    const sprite = this.player.sprite;

    if (this.currentArea === 'orchard') {
      if (sprite.x <= 25) {
        this.transitionToArea('temple', 1200, sprite.y);
      } else if (sprite.x >= 1255) {
        this.transitionToArea('market', 80, sprite.y);
      }
    } else if (this.currentArea === 'temple') {
      if (sprite.x >= 1255) {
        this.transitionToArea('orchard', 80, sprite.y);
      }
    } else if (this.currentArea === 'market') {
      if (sprite.x <= 25) {
        this.transitionToArea('orchard', 1200, sprite.y);
      }
    }
  }

  private transitionToArea(newArea: 'orchard' | 'temple' | 'market', spawnX: number, spawnY: number) {
    this.isTransitioning = true;
    this.cameras.main.fadeOut(250, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.currentArea = newArea;
      this.player.sprite.setPosition(spawnX, spawnY);
      this.updateAreaEnvironment();
      this.cameras.main.fadeIn(250, 0, 0, 0);
      this.cameras.main.once('camerafadeincomplete', () => {
        this.isTransitioning = false;
      });
    });
  }

  private updateAreaEnvironment() {
    const currentStep = useQuestStore.getState().quests[0]?.steps[useQuestStore.getState().currentStepIndex];
    const isNight = currentStep?.phase === 'NIGHT';

    if (this.backgroundImage) {
      if (this.currentArea === 'orchard') {
        if (isNight && this.textures.exists('island-background-night')) {
          this.backgroundImage.setTexture('island-background-night');
        } else {
          this.backgroundImage.setTexture('island-background');
        }
      } else if (this.currentArea === 'temple') {
        if (isNight && this.textures.exists('temple-background-night')) {
          this.backgroundImage.setTexture('temple-background-night');
        } else if (this.textures.exists('temple-background')) {
          this.backgroundImage.setTexture('temple-background');
        }
      } else if (this.currentArea === 'market') {
        if (isNight && this.textures.exists('market-background-night')) {
          this.backgroundImage.setTexture('market-background-night');
        } else if (this.textures.exists('market-background')) {
          this.backgroundImage.setTexture('market-background');
        }
      }
    }

    const showResources = this.currentArea === 'orchard' && !isNight;
    this.resourceNodes.forEach((node) => {
      node.sprite.setVisible(showResources);
      if (node.shadow) {
        node.shadow.setVisible(showResources);
      }
    });

    const isOrchard = this.currentArea === 'orchard';
    if (this.goldenGobySprite) {
      this.goldenGobySprite.setVisible(isOrchard);
    }
    if (this.chiefNPC) {
      this.chiefNPC.setVisible(isOrchard);
    }
    if (this.shopBuilding) {
      this.shopBuilding.setVisible(isOrchard);
    }
    this.questNodes.forEach((node) => {
      node.sprite.setVisible(isOrchard);
      if (node.shadow) {
        node.shadow.setVisible(isOrchard);
      }
    });

    // Spawn or hide Temple/Market specific interactive elements
    const isTemple = this.currentArea === 'temple';
    if (isTemple) {
      if (!this.siansiProp && this.textures.exists('prop-siansi')) {
        this.siansiProp = this.add.image(780, 520, 'prop-siansi');
        fitDisplaySize(this.siansiProp, 64);
      }
      if (!isNight && !this.monkNPC && this.textures.exists('npc-monk-down')) {
        this.monkNPC = this.add.image(980, 520, 'npc-monk-down');
        fitDisplaySize(this.monkNPC, 64);
        this.registerNPCWander(this.monkNPC, 980, 520, 60, 40);
      } else if (isNight && this.monkNPC) {
        this.monkNPC.destroy();
        this.monkNPC = null;
      }
    } else {
      if (this.siansiProp) {
        this.siansiProp.destroy();
        this.siansiProp = null;
      }
      if (this.monkNPC) {
        this.monkNPC.destroy();
        this.monkNPC = null;
      }
    }

    const isMarket = this.currentArea === 'market';
    if (isMarket) {
      if (!this.lottoVendorNPC && this.textures.exists('npc-lotto-vendor')) {
        this.lottoVendorNPC = this.add.image(750, 200, 'npc-lotto-vendor');
        fitDisplaySize(this.lottoVendorNPC, 64);
        this.registerNPCWander(this.lottoVendorNPC, 750, 200, 45, 20);
      }
      if (!isNight && !this.vendorNPC && this.textures.exists('npc-vendor-down')) {
        this.vendorNPC = this.add.image(420, 195, 'npc-vendor-down');
        fitDisplaySize(this.vendorNPC, 64);
        this.registerNPCWander(this.vendorNPC, 420, 195, 30, 0); // Only wanders left/right behind counter
      } else if (isNight && this.vendorNPC) {
        this.vendorNPC.destroy();
        this.vendorNPC = null;
      }
    } else {
      if (this.lottoVendorNPC) {
        this.lottoVendorNPC.destroy();
        this.lottoVendorNPC = null;
      }
      if (this.vendorNPC) {
        this.vendorNPC.destroy();
        this.vendorNPC = null;
      }
    }

    // Spawn or hide Night specific items (Orchard at night)
    if (isNight && this.currentArea === 'orchard') {
      if (this.nightHerbs.length === 0 && this.textures.exists('prop-night-herb')) {
        const coords = [
          { x: 300, y: 450 },
          { x: 900, y: 320 },
          { x: 750, y: 500 }
        ];
        coords.forEach((c) => {
          const herb = this.add.image(c.x, c.y, 'prop-night-herb');
          fitDisplaySize(herb, 64);
          this.nightHerbs.push(herb);
        });
      }
      if (!this.shadowGhost && this.textures.exists('npc-shadow-spirit')) {
        this.shadowGhost = this.physics.add.sprite(200, 200, 'npc-shadow-spirit');
        fitDisplaySize(this.shadowGhost, 64);
        if (this.shadowGhost.body) {
          (this.shadowGhost.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        }
      }
    } else {
      this.nightHerbs.forEach((h) => h.destroy());
      this.nightHerbs = [];
      if (this.shadowGhost) {
        this.shadowGhost.destroy();
        this.shadowGhost = null;
      }
    }

    // Update travel signposts based on the current area
    if (this.leftAreaSign && this.rightAreaSign) {
      if (this.currentArea === 'orchard') {
        this.leftAreaSign.setPosition(180, 415).setText('◀ ไปวัด').setVisible(true);
        this.rightAreaSign.setPosition(1100, 415).setText('ไปตลาด ▶').setVisible(true);
      } else if (this.currentArea === 'temple') {
        this.leftAreaSign.setVisible(false);
        this.rightAreaSign.setPosition(1100, 415).setText('กลับบ้านสวน ▶').setVisible(true);
      } else if (this.currentArea === 'market') {
        this.leftAreaSign.setPosition(180, 415).setText('◀ กลับบ้านสวน').setVisible(true);
        this.rightAreaSign.setVisible(false);
      }
    }
  }

  private registerNPCWander(npc: Phaser.GameObjects.Image, homeX: number, homeY: number, rangeX = 65, rangeY = 40) {
    this.npcHomePositions.set(npc, { x: homeX, y: homeY, rangeX, rangeY });
    this.triggerNPCNextWander(npc);
  }

  private triggerNPCNextWander(npc: Phaser.GameObjects.Image) {
    if (!npc || !npc.active) return;

    const delay = Phaser.Math.Between(4000, 8000);
    this.time.delayedCall(delay, () => {
      if (!npc || !npc.active) return;
      
      const home = this.npcHomePositions.get(npc);
      if (!home) return;

      const targetX = home.x + Phaser.Math.Between(-home.rangeX, home.rangeX);
      const targetY = home.y + Phaser.Math.Between(-home.rangeY, home.rangeY);

      const dx = targetX - npc.x;
      if (Math.abs(dx) > 5) {
        npc.setFlipX(dx < 0);
      }

      const duration = Phaser.Math.Between(1500, 2500);
      this.tweens.add({
        targets: npc,
        x: targetX,
        y: targetY,
        duration: duration,
        ease: 'Power1',
        onComplete: () => {
          this.triggerNPCNextWander(npc);
        }
      });
    });
  }
}
