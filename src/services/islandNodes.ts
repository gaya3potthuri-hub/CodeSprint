import { IslandWorldNode, LearningPathId } from '../types';
import { INITIAL_LEARNING_PATHS } from './mockData';

// Helper to find challenge by ID
const findChallenge = (id: string) => {
  for (const p of INITIAL_LEARNING_PATHS) {
    for (const t of p.topics) {
      for (const c of t.challenges) {
        if (c.id === id) return c;
      }
    }
  }
  return INITIAL_LEARNING_PATHS[0].topics[0].challenges[0];
};

export interface SectorWaypoint {
  id: string;
  name: string;
  code: string;
  x: number;
  z: number;
  description: string;
}

export interface IslandConfigData {
  name: string;
  code: string;
  areaKm2: string;
  areaNumber: number;
  theme: string;
  ambientColor: number;
  terrainColor: number;
  rockColor: number;
  foliageColor: number;
  waterColor: number;
  skyColor: number;
  highlightColor: string;
  description: string;
  tacticalBrief: string;
  sectors: SectorWaypoint[];
}

export const ISLAND_CONFIG: Record<LearningPathId, IslandConfigData> = {
  python: {
    name: 'PYTHON ARCHIPELAGO',
    code: 'SEC-PY-45K',
    areaKm2: '45.2 km²',
    areaNumber: 45.2,
    theme: 'Lush Emerald High-Plateau & Volcanic Peaks',
    ambientColor: 0x182c20,
    terrainColor: 0x1c3826,
    rockColor: 0x1b1f2b,
    foliageColor: 0x2ed573,
    highlightColor: '#FF4655',
    waterColor: 0x092233,
    skyColor: 0x060f18,
    description: 'A colossal 45.2 km² floating mountain realm. Expansive valleys of Knowledge Trees, ancient arithmetic monoliths, and deep logic caverns overlooking endless atmospheric horizons.',
    tacticalBrief: 'SURFACE SURVEY: 45.2 KM² EXPANSE · 6 PRIMARY TACTICAL DRILLS · SPRINT & GLIDER THRUSTERS ACTIVE',
    sectors: [
      { id: 'sec-py-1', name: 'Alpha Grove', code: 'SEC-A1', x: -16, z: 12, description: 'Knowledge Tree Basin & Pointer Primitives' },
      { id: 'sec-py-2', name: 'Basalt Ridge', code: 'SEC-B2', x: -10, z: -22, description: 'Ancient Runic Monoliths of Math' },
      { id: 'sec-py-3', name: 'Abyssal Ravine', code: 'SEC-C3', x: 26, z: 16, description: 'Deep Problem-Solving Caves of Branching Logic' },
      { id: 'sec-py-4', name: 'Apex Plateau', code: 'SEC-D4', x: 0, z: 32, description: 'Masterpiece Shrine of Encapsulated Functions' }
    ]
  },
  sql: {
    name: 'SQL CAVERNS & MINES',
    code: 'SEC-SQL-42K',
    areaKm2: '42.8 km²',
    areaNumber: 42.8,
    theme: 'Crystalline Cyan & Obsidian Subterranean Atoll',
    ambientColor: 0x0c2530,
    terrainColor: 0x122933,
    rockColor: 0x101722,
    foliageColor: 0x00f5d4,
    highlightColor: '#00F5D4',
    waterColor: 0x051b22,
    skyColor: 0x040c12,
    description: 'A 42.8 km² luminous subterranean archipelago. Relational projection groves, crystalline deduplication obelisks, and colossal GROUP BY aggregation caverns.',
    tacticalBrief: 'SURFACE SURVEY: 42.8 KM² EXPANSE · 4 HIGH-TIER RELATIONAL DRILLS · DEEP MINE CRATER COLLISION ACTIVE',
    sectors: [
      { id: 'sec-sql-1', name: 'Cyan Trench', code: 'SEC-Q1', x: -15, z: -15, description: 'Projection Groves & Column Schemas' },
      { id: 'sec-sql-2', name: 'Obsidian Quarry', code: 'SEC-Q2', x: 18, z: -12, description: 'Deduplication Runestones' },
      { id: 'sec-sql-3', name: 'Sub-Vault Vaults', code: 'SEC-Q3', x: -22, z: 20, description: 'Aggregation Caverns & Filtering Shafts' },
      { id: 'sec-sql-4', name: 'Relational Core', code: 'SEC-Q4', x: 6, z: 28, description: 'Masterpiece Shrine of Multi-Table JOINs' }
    ]
  },
  'web-dev': {
    name: 'WEB DEV CITADEL',
    code: 'SEC-WEB-48K',
    areaKm2: '48.5 km²',
    areaNumber: 48.5,
    theme: 'Cyber-Coral & Radiant Amber Coastal Megastructure',
    ambientColor: 0x2b1c0d,
    terrainColor: 0x382613,
    rockColor: 0x211b26,
    foliageColor: 0xf59e0b,
    highlightColor: '#F59E0B',
    waterColor: 0x1a1230,
    skyColor: 0x0d0716,
    description: 'A 48.5 km² sprawling futuristic citadel on a coastal shelf. Semantic component groves, CSS flexbox runic stones, and DOM mutation subterranean chambers.',
    tacticalBrief: 'SURFACE SURVEY: 48.5 KM² EXPANSE · 4 FULL-STACK KINETIC CHALLENGES · HIGH-ALTITUDE SPATIAL CITADEL',
    sectors: [
      { id: 'sec-web-1', name: 'Semantic Shoreline', code: 'SEC-W1', x: -18, z: 8, description: 'Semantic Tree Architecture' },
      { id: 'sec-web-2', name: 'Flexbox Spire', code: 'SEC-W2', x: 20, z: -18, description: 'Alignment Monolith & Cross-Axis Runes' },
      { id: 'sec-web-3', name: 'Async Faultline', code: 'SEC-W3', x: -12, z: -24, description: 'Event Loop & DOM Mutation Caverns' },
      { id: 'sec-web-4', name: 'Summit Apex', code: 'SEC-W4', x: 20, z: 24, description: 'Masterpiece Citadel of Reactive Interfaces' }
    ]
  },
  java: {
    name: 'JAVA FOUNDRY REALM',
    code: 'SEC-JAVA-46K',
    areaKm2: '46.0 km²',
    areaNumber: 46.0,
    theme: 'Clockwork Towers & Engineered Bridges',
    ambientColor: 0x281216,
    terrainColor: 0x36161c,
    rockColor: 0x1c0e12,
    foliageColor: 0xff4655,
    highlightColor: '#FF4655',
    waterColor: 0x1f0a10,
    skyColor: 0x0c0406,
    description: 'A 46.0 km² precision-engineered world of object factories, inheritance bridges, and bytecode compilers.',
    tacticalBrief: 'SURFACE SURVEY: 46.0 KM² EXPANSE · 5 OBJECT-ORIENTED VILLAGES · CIRCUIT POWER ACTIVE',
    sectors: [
      { id: 'sec-java-1', name: 'Byte Basin', code: 'SEC-J1', x: -16, z: 12, description: 'Primitive Types & Scanner' },
      { id: 'sec-java-2', name: 'Control Core', code: 'SEC-J2', x: 18, z: -14, description: 'Decisions & Loops' },
      { id: 'sec-java-3', name: 'Object Foundry', code: 'SEC-J3', x: -10, z: -22, description: 'Classes & Constructors' },
      { id: 'sec-java-4', name: 'Inheritance Spire', code: 'SEC-J4', x: 22, z: 18, description: 'Polymorphism & Contracts' }
    ]
  },
  ai: {
    name: 'AI SYNAPSE ATOLL',
    code: 'SEC-AI-47K',
    areaKm2: '47.5 km²',
    areaNumber: 47.5,
    theme: 'Holographic Neural Pattern Realm',
    ambientColor: 0x1c102c,
    terrainColor: 0x28163e,
    rockColor: 0x140a20,
    foliageColor: 0x875cff,
    highlightColor: '#875CFF',
    waterColor: 0x160a2c,
    skyColor: 0x090412,
    description: 'A 47.5 km² futuristic neural atoll of glowing synaptic nodes, deep activation chambers, and machine learning models.',
    tacticalBrief: 'SURFACE SURVEY: 47.5 KM² EXPANSE · 5 MACHINE LEARNING VILLAGES · HOLOGRAPHIC NODES ACTIVE',
    sectors: [
      { id: 'sec-ai-1', name: 'Neural Outpost', code: 'SEC-A1', x: -18, z: 10, description: 'AI Basics & Training Data' },
      { id: 'sec-ai-2', name: 'Perceptron Ridge', code: 'SEC-A2', x: 20, z: -16, description: 'Supervised Learning' },
      { id: 'sec-ai-3', name: 'Deep Nexus', code: 'SEC-A3', x: -12, z: -20, description: 'Activation Functions' },
      { id: 'sec-ai-4', name: 'Monolith Summit', code: 'SEC-A4', x: 18, z: 22, description: 'Evaluation & Ethics' }
    ]
  }
};

export const ISLAND_NODES: IslandWorldNode[] = [
  // PYTHON ISLAND (Expanded Layout for 45.2 km² Vast Scale)
  {
    id: 'node-py-1',
    title: 'Knowledge Tree of Pointers',
    type: 'tree',
    islandId: 'python',
    x: -16,
    z: 12,
    radius: 4.0,
    challenge: findChallenge('py-ch-1'),
    cleared: true,
    description: 'A towering cyber-foliage tree whispering Python variable pointer and binding rules.'
  },
  {
    id: 'node-py-2',
    title: 'Knowledge Tree of Strings',
    type: 'tree',
    islandId: 'python',
    x: 20,
    z: -14,
    radius: 4.0,
    challenge: findChallenge('py-ch-2'),
    cleared: true,
    description: 'A radiant emerald canopy containing string concatenation and type conversion drills.'
  },
  {
    id: 'node-py-3',
    title: 'Ancient Stone of Floor Division',
    type: 'stone',
    islandId: 'python',
    x: -10,
    z: -22,
    radius: 3.8,
    challenge: findChallenge('py-ch-3'),
    cleared: false,
    description: 'An ancient basalt monolith etched with glowing floor division arithmetic runes.'
  },
  {
    id: 'node-py-4',
    title: 'Deep Problem-Solving Cave of Logic',
    type: 'cave',
    islandId: 'python',
    x: 26,
    z: 16,
    radius: 5.5,
    challenge: findChallenge('py-ch-4'),
    cleared: true,
    description: 'A massive hollowed crag testing multi-branch conditional statements and execution flow.'
  },
  {
    id: 'node-py-5',
    title: 'Subterranean Truthiness Cavern',
    type: 'cave',
    islandId: 'python',
    x: -26,
    z: -8,
    radius: 5.5,
    challenge: findChallenge('py-ch-5'),
    cleared: false,
    description: 'A deep cavern shrouded in shadow testing falsy collections and boolean evaluations.'
  },
  {
    id: 'node-py-6',
    title: 'Masterpiece Monolith of Functions',
    type: 'masterpiece',
    islandId: 'python',
    x: 0,
    z: 32,
    radius: 6.0,
    challenge: findChallenge('py-ch-6'),
    cleared: false,
    description: 'The monumental floating apex shrine of Python encapsulation and default arguments.'
  },

  // SQL ISLAND (Expanded Layout for 42.8 km² Vast Scale)
  {
    id: 'node-sql-1',
    title: 'Knowledge Tree of Columns',
    type: 'tree',
    islandId: 'sql',
    x: -15,
    z: -15,
    radius: 4.0,
    challenge: findChallenge('sql-ch-1'),
    cleared: true,
    description: 'A glowing cyan crystalline tree pulsing with relational projection queries.'
  },
  {
    id: 'node-sql-2',
    title: 'Ancient Stone of Deduplication',
    type: 'stone',
    islandId: 'sql',
    x: 18,
    z: -12,
    radius: 3.8,
    challenge: findChallenge('sql-ch-2'),
    cleared: false,
    description: 'A runic crystal stone that filters duplicate entity payloads with DISTINCT clauses.'
  },
  {
    id: 'node-sql-3',
    title: 'Deep Cave of Aggregations',
    type: 'cave',
    islandId: 'sql',
    x: -22,
    z: 20,
    radius: 5.5,
    challenge: findChallenge('sql-ch-3'),
    cleared: false,
    description: 'A subterranean mine shaft challenging operatives on GROUP BY and HAVING filters.'
  },
  {
    id: 'node-sql-4',
    title: 'Masterpiece Monolith of Relational JOINs',
    type: 'masterpiece',
    islandId: 'sql',
    x: 6,
    z: 28,
    radius: 6.0,
    challenge: findChallenge('sql-ch-3'),
    cleared: false,
    description: 'The monumental core of relational database foreign keys and multi-table queries.'
  },

  // WEB DEV ISLAND (Expanded Layout for 48.5 km² Vast Scale)
  {
    id: 'node-web-1',
    title: 'Knowledge Tree of Semantic HTML',
    type: 'tree',
    islandId: 'web-dev',
    x: -18,
    z: 8,
    radius: 4.0,
    challenge: findChallenge('web-ch-1'),
    cleared: true,
    description: 'A cyber-coral tree instructing players in semantic hierarchy and accessibility.'
  },
  {
    id: 'node-web-2',
    title: 'Ancient Stone of Flexbox Alignment',
    type: 'stone',
    islandId: 'web-dev',
    x: 20,
    z: -18,
    radius: 3.8,
    challenge: findChallenge('web-ch-2'),
    cleared: false,
    description: 'A glowing golden obelisk aligning items across main and cross layout axes.'
  },
  {
    id: 'node-web-3',
    title: 'Deep Problem-Solving Cave of DOM Mutation',
    type: 'cave',
    islandId: 'web-dev',
    x: -12,
    z: -24,
    radius: 5.5,
    challenge: findChallenge('web-ch-3'),
    cleared: false,
    description: 'A glowing cavern pulsing with immutable array transformation loops and state mutations.'
  },
  {
    id: 'node-web-4',
    title: 'Masterpiece Monolith of Reactive Interfaces',
    type: 'masterpiece',
    islandId: 'web-dev',
    x: 20,
    z: 24,
    radius: 6.0,
    challenge: findChallenge('web-ch-3'),
    cleared: false,
    description: 'The golden citadel summit of full-stack asynchronous reactive event flows.'
  }
];
