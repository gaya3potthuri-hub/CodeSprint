import { ProgrammingIsland, ProgrammingIslandId, Village } from '../types';

export const PROGRAMMING_ISLANDS: ProgrammingIsland[] = [
  // 1. PYTHON ISLAND
  {
    id: 'python',
    name: 'Python Island',
    subtitle: 'Build your logic, one challenge at a time.',
    theme: 'Lush & Intelligent Beginner World',
    accentColor: '#10B981', // Emerald Green
    glowColor: 'rgba(16, 185, 129, 0.45)',
    skyGradient: 'from-emerald-950/60 via-[#0A1A14]/80 to-[#050D0A]',
    visualElements: [
      'Green landscapes & winding trails',
      'Cascading waterfalls & ancient trees',
      'Glowing logic checkpoints & shrines',
      'Pythonic syntax obelisks'
    ],
    levelRequirement: 1,
    isLocked: false,
    villages: [
      {
        id: 'py-v1',
        islandId: 'python',
        order: 1,
        title: 'Logic Forest',
        subtitle: 'Foundations of Syntax',
        description: 'Wander under the canopy of variable identifiers, explore fundamental primitive types, and master terminal input/output.',
        topics: ['Variables', 'Data Types', 'Input and Output'],
        difficulty: 'Beginner',
        icon: 'Trees',
        estimatedDuration: '10–15 min',
        xpReward: 120,
        questionBankCount: 15,
        state: 'available',
        coordinates: { xPercent: 18, yPercent: 78 }
      },
      {
        id: 'py-v2',
        islandId: 'python',
        order: 2,
        title: 'Loop Valley',
        subtitle: 'Cycles & Branching Logic',
        description: 'Traverse winding ravines governed by if-else branches, while loops, and iterator sequences.',
        topics: ['If-Else Conditions', 'For Loops', 'While Loops'],
        difficulty: 'Beginner',
        icon: 'RotateCw',
        estimatedDuration: '15–20 min',
        prerequisiteVillageId: 'py-v1',
        prerequisiteExplanation: 'Complete Logic Forest with >= 70% accuracy to unlock.',
        xpReward: 150,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 36, yPercent: 54 }
      },
      {
        id: 'py-v3',
        islandId: 'python',
        order: 3,
        title: 'Function Village',
        subtitle: 'Reusable Modular Power',
        description: 'A bustling settlement of callable blocks, parameter bindings, default arguments, and return pipelines.',
        topics: ['Functions', 'Parameters', 'Return Values'],
        difficulty: 'Intermediate',
        icon: 'Layers',
        estimatedDuration: '15–20 min',
        prerequisiteVillageId: 'py-v2',
        prerequisiteExplanation: 'Complete Loop Valley to unlock modular functions.',
        xpReward: 180,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 55, yPercent: 42 }
      },
      {
        id: 'py-v4',
        islandId: 'python',
        order: 4,
        title: 'Data Structure Castle',
        subtitle: 'Collections & Key-Value Citadels',
        description: 'The fortified keep housing dynamic lists, immutable tuples, hash-mapped dictionaries, and sets.',
        topics: ['Lists', 'Tuples', 'Dictionaries'],
        difficulty: 'Intermediate',
        icon: 'Castle',
        estimatedDuration: '20–25 min',
        prerequisiteVillageId: 'py-v3',
        prerequisiteExplanation: 'Master Function Village to infiltrate the castle collection vault.',
        xpReward: 220,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 72, yPercent: 28 }
      },
      {
        id: 'py-v5',
        islandId: 'python',
        order: 5,
        title: 'Algorithm Summit',
        subtitle: 'Peak Algorithmic Mastery',
        description: 'The highest mountain peak challenging students on two-pointer searches, sorting mechanics, and problem solving.',
        topics: ['Problem Solving', 'Searching', 'Basic Sorting'],
        difficulty: 'Advanced',
        icon: 'Mountain',
        estimatedDuration: '20–30 min',
        prerequisiteVillageId: 'py-v4',
        prerequisiteExplanation: 'Conquer Data Structure Castle to reach the summit.',
        xpReward: 280,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 86, yPercent: 15 }
      }
    ]
  },

  // 2. SQL ISLAND
  {
    id: 'sql',
    name: 'SQL Island',
    subtitle: 'Discover the power of data.',
    theme: 'Futuristic Relational & Oceanic World',
    accentColor: '#00F5D4', // Radiant Cyan
    glowColor: 'rgba(0, 245, 212, 0.45)',
    skyGradient: 'from-cyan-950/60 via-[#061822]/80 to-[#030C10]',
    visualElements: [
      'Floating holographic table shards',
      'Crystalline database query towers',
      'Glowing bioluminescent waterways',
      'Flowing relational data conduits'
    ],
    levelRequirement: 1,
    isLocked: false,
    villages: [
      {
        id: 'sql-v1',
        islandId: 'sql',
        order: 1,
        title: 'Schema Harbor',
        subtitle: 'Tables & Projections',
        description: 'Dock at the relational coast to understand database entities, rows, columns, and foundational queries.',
        topics: ['Tables', 'Data Types', 'Basic Queries'],
        difficulty: 'Beginner',
        icon: 'Anchor',
        estimatedDuration: '10–15 min',
        xpReward: 120,
        questionBankCount: 15,
        state: 'available',
        coordinates: { xPercent: 16, yPercent: 76 }
      },
      {
        id: 'sql-v2',
        islandId: 'sql',
        order: 2,
        title: 'Query Coast',
        subtitle: 'Filtering & Sorting Tides',
        description: 'Navigate coastal waters shaped by WHERE filters, LIKE matchers, AND/OR logic, and ORDER BY directives.',
        topics: ['SELECT', 'WHERE Filtering', 'ORDER BY'],
        difficulty: 'Beginner',
        icon: 'Compass',
        estimatedDuration: '15–20 min',
        prerequisiteVillageId: 'sql-v1',
        prerequisiteExplanation: 'Complete Schema Harbor with >= 70% accuracy to unlock.',
        xpReward: 150,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 35, yPercent: 58 }
      },
      {
        id: 'sql-v3',
        islandId: 'sql',
        order: 3,
        title: 'Aggregation Quarry',
        subtitle: 'Summaries & Grouped Metrics',
        description: 'Mine deep relational veins with COUNT, SUM, AVG, MIN, MAX, GROUP BY grouping, and HAVING filters.',
        topics: ['COUNT & SUM', 'GROUP BY', 'HAVING Filter'],
        difficulty: 'Intermediate',
        icon: 'Database',
        estimatedDuration: '15–20 min',
        prerequisiteVillageId: 'sql-v2',
        prerequisiteExplanation: 'Complete Query Coast to unlock the aggregation quarry.',
        xpReward: 180,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 54, yPercent: 44 }
      },
      {
        id: 'sql-v4',
        islandId: 'sql',
        order: 4,
        title: 'Relational Bridge',
        subtitle: 'Multi-Table Connections',
        description: 'An architectural marvel spanning chasms to bridge related entities with INNER, LEFT, and RIGHT JOINs.',
        topics: ['INNER JOIN', 'LEFT JOIN', 'Foreign Keys'],
        difficulty: 'Intermediate',
        icon: 'Share2',
        estimatedDuration: '20–25 min',
        prerequisiteVillageId: 'sql-v3',
        prerequisiteExplanation: 'Master Aggregation Quarry to cross the relational bridge.',
        xpReward: 220,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 71, yPercent: 30 }
      },
      {
        id: 'sql-v5',
        islandId: 'sql',
        order: 5,
        title: 'Subquery Citadel',
        subtitle: 'Nested Data Dominance',
        description: 'The crowning crystal spire demanding expertise in subqueries, conditional CASE statements, and query execution plans.',
        topics: ['Nested Queries', 'CASE Statements', 'Indexing'],
        difficulty: 'Advanced',
        icon: 'Shield',
        estimatedDuration: '20–30 min',
        prerequisiteVillageId: 'sql-v4',
        prerequisiteExplanation: 'Cross Relational Bridge to enter the Citadel.',
        xpReward: 280,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 88, yPercent: 16 }
      }
    ]
  },

  // 3. JAVA ISLAND
  {
    id: 'java',
    name: 'Java Island',
    subtitle: 'Master the foundations of programming.',
    theme: 'Sophisticated Engineering & OOP Realm',
    accentColor: '#FF4655', // Fiery Crimson / Orange
    glowColor: 'rgba(255, 70, 85, 0.45)',
    skyGradient: 'from-rose-950/60 via-[#1C0E14]/80 to-[#0A0508]',
    visualElements: [
      'Mechanical clockwork towers',
      'Engineered cantilever bridges',
      'Glowing energy circuit tracks',
      'Structured object-oriented monoliths'
    ],
    levelRequirement: 1,
    isLocked: false,
    villages: [
      {
        id: 'java-v1',
        islandId: 'java',
        order: 1,
        title: 'Byte Basin',
        subtitle: 'Strict Types & Class Shells',
        description: 'Enter the engineered basin of static typing, JVM bytecode concepts, and primitive variables.',
        topics: ['Syntax', 'Primitive Types', 'Variables and Scanner'],
        difficulty: 'Beginner',
        icon: 'Cpu',
        estimatedDuration: '10–15 min',
        xpReward: 120,
        questionBankCount: 15,
        state: 'available',
        coordinates: { xPercent: 17, yPercent: 75 }
      },
      {
        id: 'java-v2',
        islandId: 'java',
        order: 2,
        title: 'Control Core',
        subtitle: 'Decisions & Iterations',
        description: 'The pulsing engine room of conditional switches, while loops, and for-each iterators.',
        topics: ['If-Else', 'Switch Statements', 'Loops'],
        difficulty: 'Beginner',
        icon: 'Sliders',
        estimatedDuration: '15–20 min',
        prerequisiteVillageId: 'java-v1',
        prerequisiteExplanation: 'Complete Byte Basin with >= 70% accuracy to unlock.',
        xpReward: 150,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 36, yPercent: 56 }
      },
      {
        id: 'java-v3',
        islandId: 'java',
        order: 3,
        title: 'Object Foundry',
        subtitle: 'Classes, Objects & Constructors',
        description: 'Forge blueprints into living object instances, harness constructors, and encapsulate member state.',
        topics: ['Classes', 'Objects', 'Constructors and Methods'],
        difficulty: 'Intermediate',
        icon: 'Box',
        estimatedDuration: '15–20 min',
        prerequisiteVillageId: 'java-v2',
        prerequisiteExplanation: 'Master Control Core to unlock the object foundry.',
        xpReward: 180,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 55, yPercent: 43 }
      },
      {
        id: 'java-v4',
        islandId: 'java',
        order: 4,
        title: 'Inheritance Spire',
        subtitle: 'Polymorphism & Abstract Contracts',
        description: 'Climb the towering engineering monument of class hierarchies, method overriding, and interface contracts.',
        topics: ['Inheritance', 'Polymorphism', 'Interfaces'],
        difficulty: 'Intermediate',
        icon: 'GitBranch',
        estimatedDuration: '20–25 min',
        prerequisiteVillageId: 'java-v3',
        prerequisiteExplanation: 'Pass Object Foundry to scale the inheritance spire.',
        xpReward: 220,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 73, yPercent: 29 }
      },
      {
        id: 'java-v5',
        islandId: 'java',
        order: 5,
        title: 'Collection Citadel',
        subtitle: 'Data Containers & Robust Safety',
        description: 'The high citadel of ArrayLists, HashMaps, generic wrappers, and defensive try-catch exception handling.',
        topics: ['ArrayLists', 'HashMaps', 'Exception Handling'],
        difficulty: 'Advanced',
        icon: 'Grid',
        estimatedDuration: '20–30 min',
        prerequisiteVillageId: 'java-v4',
        prerequisiteExplanation: 'Conquer Inheritance Spire to enter the collection citadel.',
        xpReward: 280,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 87, yPercent: 16 }
      }
    ]
  },

  // 4. AI ISLAND
  {
    id: 'ai',
    name: 'AI Island',
    subtitle: 'Explore the intelligence behind technology.',
    theme: 'Futuristic Artificial Intelligence & Neural Realm',
    accentColor: '#875CFF', // Electric Violet
    glowColor: 'rgba(135, 92, 255, 0.45)',
    skyGradient: 'from-purple-950/60 via-[#130B22]/80 to-[#07030D]',
    visualElements: [
      'Floating holographic neural networks',
      'Glowing violet crystal nodes',
      'Interconnected synaptic data paths',
      'Intelligent robotic monoliths'
    ],
    levelRequirement: 1,
    isLocked: false,
    villages: [
      {
        id: 'ai-v1',
        islandId: 'ai',
        order: 1,
        title: 'Neural Outpost',
        subtitle: 'The Gateway to Machine Learning',
        description: 'Discover the foundational principles of artificial intelligence, training data, and how machines learn from patterns.',
        topics: ['AI vs ML Basics', 'Datasets & Features', 'Types of Learning'],
        difficulty: 'Beginner',
        icon: 'Sparkles',
        estimatedDuration: '10–15 min',
        xpReward: 120,
        questionBankCount: 15,
        state: 'available',
        coordinates: { xPercent: 18, yPercent: 76 }
      },
      {
        id: 'ai-v2',
        islandId: 'ai',
        order: 2,
        title: 'Perceptron Ridge',
        subtitle: 'Supervised Models & Boundaries',
        description: 'Traverse decision boundaries, linear classifications, training vs test splits, and loss minimization.',
        topics: ['Supervised Learning', 'Training vs Testing', 'Classification Basics'],
        difficulty: 'Beginner',
        icon: 'TrendingUp',
        estimatedDuration: '15–20 min',
        prerequisiteVillageId: 'ai-v1',
        prerequisiteExplanation: 'Complete Neural Outpost with >= 70% accuracy to unlock.',
        xpReward: 150,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 36, yPercent: 55 }
      },
      {
        id: 'ai-v3',
        islandId: 'ai',
        order: 3,
        title: 'Deep Nexus',
        subtitle: 'Neural Layers & Activations',
        description: 'Enter the multi-layered neural core featuring weights, biases, ReLU activations, and backpropagation concepts.',
        topics: ['Neural Networks', 'Activation Functions', 'Weights and Biases'],
        difficulty: 'Intermediate',
        icon: 'Network',
        estimatedDuration: '15–20 min',
        prerequisiteVillageId: 'ai-v2',
        prerequisiteExplanation: 'Master Perceptron Ridge to unlock the deep neural nexus.',
        xpReward: 180,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 55, yPercent: 41 }
      },
      {
        id: 'ai-v4',
        islandId: 'ai',
        order: 4,
        title: 'Vision & Language Spire',
        subtitle: 'Computer Vision & Natural Language',
        description: 'The spire of perceptual intelligence: image convolutions, word embeddings, tokenizers, and transformer attention.',
        topics: ['Computer Vision Basics', 'NLP & Tokenization', 'Transformers & Embeddings'],
        difficulty: 'Intermediate',
        icon: 'Eye',
        estimatedDuration: '20–25 min',
        prerequisiteVillageId: 'ai-v3',
        prerequisiteExplanation: 'Navigate Deep Nexus to access perceptual models.',
        xpReward: 220,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 72, yPercent: 27 }
      },
      {
        id: 'ai-v5',
        islandId: 'ai',
        order: 5,
        title: 'Intelligence Monolith',
        subtitle: 'Evaluation, Ethics & Agent Systems',
        description: 'The pinnacle monolith exploring precision/recall metrics, overfitting mitigation, AI alignment, and agentic workflows.',
        topics: ['Model Evaluation', 'Overfitting Prevention', 'Ethics & Agent Systems'],
        difficulty: 'Advanced',
        icon: 'Brain',
        estimatedDuration: '20–30 min',
        prerequisiteVillageId: 'ai-v4',
        prerequisiteExplanation: 'Conquer Vision & Language Spire to challenge the Monolith.',
        xpReward: 280,
        questionBankCount: 15,
        state: 'locked',
        coordinates: { xPercent: 86, yPercent: 15 }
      }
    ]
  }
];

// Helper to look up island by ID
export function getIslandById(id: ProgrammingIslandId): ProgrammingIsland {
  return PROGRAMMING_ISLANDS.find((i) => i.id === id) || PROGRAMMING_ISLANDS[0];
}

// Helper to look up village by ID
export function getVillageById(villageId: string): Village | null {
  for (const island of PROGRAMMING_ISLANDS) {
    const found = island.villages.find((v) => v.id === villageId);
    if (found) return found;
  }
  return null;
}
