import { LearningPath, AchievementBadge, LeaderboardUser, DailyActivity } from '../types';

export const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'python',
    title: 'Python Core',
    tagline: 'High-Velocity Logic & Systems Protocol',
    tacticalRole: 'OPERATOR · COMBAT AUTOMATION',
    description: 'Master backend algorithmic logic, data recursion, and automated protocols. Built for students who want direct terminal dominance.',
    icon: 'Terminal',
    color: '#FF4655', // Radiant Red
    accentColor: '#FF707E',
    badge: 'Python Operator',
    totalChallenges: 18,
    estimatedHours: 12,
    sampleCode: {
      language: 'python',
      filename: 'defuse_payload.py',
      code: `def calculate_stock(items: list[dict]) -> int:
    """Sum available quantities for in-stock items."""
    return sum(item["qty"] for item in items if item["active"])

inventory = [
    {"sku": "KB-01", "qty": 14, "active": True},
    {"sku": "MS-09", "qty": 0, "active": False},
    {"sku": "MN-44", "qty": 8, "active": True},
]

total = calculate_stock(inventory)
print(f"Total available units: {total}")`
    },
    topics: [
      {
        id: 'py-01',
        title: 'Variables & Data Primitives',
        description: 'Initialize registers, memory blocks, and variable bindings.',
        order: 1,
        challengesCount: 3,
        completedCount: 3,
        isLocked: false,
        challenges: [
          {
            id: 'py-ch-1',
            pathId: 'python',
            topicId: 'py-01',
            topicTitle: 'Variables & Data Primitives',
            title: 'Variable Pointer & Output Protocol',
            difficulty: 'Beginner',
            xpReward: 50,
            question: 'What will this Python protocol print to the combat terminal?',
            tacticalBrief: 'TARGET: Output verification for single identifier reference.',
            codeSnippet: {
              language: 'python',
              code: `name = "Alex"
print(name)`
            },
            options: [
              { id: 'opt-a', text: 'name' },
              { id: 'opt-b', text: 'Alex' },
              { id: 'opt-c', text: 'Error' },
              { id: 'opt-d', text: '"Alex"' }
            ],
            correctOptionId: 'opt-b',
            explanation: 'The variable `name` stores the string `"Alex"`. When passed to `print(name)`, the runtime evaluates the identifier and emits its literal value.',
            hint: 'In Python, passing an unquoted identifier to print() outputs its referenced value.'
          },
          {
            id: 'py-ch-2',
            pathId: 'python',
            topicId: 'py-01',
            topicTitle: 'Variables & Data Primitives',
            title: 'String Concatenation & Weapon Buff',
            difficulty: 'Beginner',
            xpReward: 50,
            question: 'What is the resulting output of the string concatenation operator?',
            tacticalBrief: 'COMBINE: String concatenation with spaced delimiter.',
            codeSnippet: {
              language: 'python',
              code: `first = "Code"
second = "Sprint"
print(first + " " + second)`
            },
            options: [
              { id: 'opt-a', text: 'CodeSprint' },
              { id: 'opt-b', text: 'Code Sprint' },
              { id: 'opt-c', text: 'first second' },
              { id: 'opt-d', text: 'TypeError' }
            ],
            correctOptionId: 'opt-b',
            explanation: 'The `+` operator concatenates strings. Here, `"Code"` + `" "` + `"Sprint"` results in `"Code Sprint"`.',
            hint: 'Notice the single space string `" "` inserted between `first` and `second`.'
          },
          {
            id: 'py-ch-3',
            pathId: 'python',
            topicId: 'py-01',
            topicTitle: 'Variables & Data Primitives',
            title: 'Floor Division & Velocity Calculation',
            difficulty: 'Intermediate',
            xpReward: 65,
            question: 'What does the floor division operator `//` produce in this snippet?',
            tacticalBrief: 'CALCULATE: Integer division rounding down.',
            codeSnippet: {
              language: 'python',
              code: `a = 17
b = 4
print(a // b)`
            },
            options: [
              { id: 'opt-a', text: '4.25' },
              { id: 'opt-b', text: '4' },
              { id: 'opt-c', text: '5' },
              { id: 'opt-d', text: '1' }
            ],
            correctOptionId: 'opt-b',
            explanation: 'In Python, `//` computes floor division, discarding the fractional remainder. 17 / 4 = 4.25, which floors to 4.',
            hint: 'Floor division rounds down to the nearest integer.'
          }
        ]
      },
      {
        id: 'py-02',
        title: 'Tactical Branching & Conditions',
        description: 'Direct instruction pipelines with if/elif/else gates.',
        order: 2,
        challengesCount: 3,
        completedCount: 2,
        isLocked: false,
        challenges: [
          {
            id: 'py-ch-4',
            pathId: 'python',
            topicId: 'py-02',
            topicTitle: 'Tactical Branching & Conditions',
            title: 'Rank Threshold Evaluation',
            difficulty: 'Beginner',
            xpReward: 50,
            question: 'What will be printed when this score evaluation executes?',
            tacticalBrief: 'GATE: Multi-branch conditional hierarchy.',
            codeSnippet: {
              language: 'python',
              code: `score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
else:
    print("Grade: C")`
            },
            options: [
              { id: 'opt-a', text: 'Grade: A' },
              { id: 'opt-b', text: 'Grade: B' },
              { id: 'opt-c', text: 'Grade: C' },
              { id: 'opt-d', text: 'Grade: B and Grade: C' }
            ],
            correctOptionId: 'opt-b',
            explanation: '85 is not >= 90, so the first condition is false. The elif condition `score >= 80` evaluates to True, printing "Grade: B" and exiting the conditional structure.',
            hint: 'Once a condition in an if-elif-else chain evaluates to True, subsequent branches are skipped.'
          },
          {
            id: 'py-ch-5',
            pathId: 'python',
            topicId: 'py-02',
            topicTitle: 'Tactical Branching & Conditions',
            title: 'Empty Ammo Clip Truthiness',
            difficulty: 'Intermediate',
            xpReward: 65,
            question: 'What is the output of this Python boolean collection check?',
            tacticalBrief: 'VERIFY: Empty list evaluated in boolean context.',
            codeSnippet: {
              language: 'python',
              code: `items = []

if items:
    print("Populated")
else:
    print("Empty")`
            },
            options: [
              { id: 'opt-a', text: 'Populated' },
              { id: 'opt-b', text: 'Empty' },
              { id: 'opt-c', text: 'None' },
              { id: 'opt-d', text: 'IndexError' }
            ],
            correctOptionId: 'opt-b',
            explanation: 'In Python, empty collections (empty lists `[]`, tuples, dictionaries, and strings) evaluate to `False` in a boolean context.',
            hint: 'An empty list `[]` is considered falsy in Python.'
          }
        ]
      },
      {
        id: 'py-03',
        title: 'Encapsulation & Functional Routines',
        description: 'Construct reusable tactical modules and parameter signatures.',
        order: 3,
        challengesCount: 3,
        completedCount: 0,
        isLocked: false,
        challenges: [
          {
            id: 'py-ch-6',
            pathId: 'python',
            topicId: 'py-03',
            topicTitle: 'Encapsulation & Functional Routines',
            title: 'Default Parameter Multiplier',
            difficulty: 'Intermediate',
            xpReward: 75,
            question: 'What will be output by this function call with default multiplier?',
            tacticalBrief: 'EXECUTE: Default argument resolution in function invocation.',
            codeSnippet: {
              language: 'python',
              code: `def calculate_fare(distance, surge=1.5):
    return distance * 10 * surge

print(int(calculate_fare(5)))`
            },
            options: [
              { id: 'opt-a', text: '50' },
              { id: 'opt-b', text: '75' },
              { id: 'opt-c', text: '150' },
              { id: 'opt-d', text: 'TypeError: missing surge' }
            ],
            correctOptionId: 'opt-b',
            explanation: 'Since the `surge` argument is not passed in `calculate_fare(5)`, it defaults to 1.5. 5 * 10 * 1.5 = 75.0, converted to integer 75.',
            hint: 'Parameters with `= value` in the function definition use their default value when omitted in the call.'
          }
        ]
      },
      {
        id: 'py-04',
        title: 'Data Structures & List Slicing',
        description: 'Advanced memory manipulation and list comprehensions.',
        order: 4,
        challengesCount: 4,
        completedCount: 0,
        isLocked: true,
        challenges: []
      }
    ]
  },
  {
    id: 'sql',
    title: 'SQL Mastery',
    tagline: 'Relational Intelligence & Data Extraction',
    tacticalRole: 'SENTINEL · DATA DEFENSE',
    description: 'Infiltrate relational databases, construct multi-table JOIN ambushes, and aggregate high-value intel with surgical precision.',
    icon: 'Database',
    color: '#00F5D4', // Cyber Cyan / Viper Teal
    accentColor: '#38F8DE',
    badge: 'SQL Sentinel',
    totalChallenges: 15,
    estimatedHours: 10,
    sampleCode: {
      language: 'sql',
      filename: 'tactical_intel.sql',
      code: `SELECT 
    d.department_name,
    COUNT(e.id) AS total_engineers,
    ROUND(AVG(e.salary), 2) AS avg_compensation
FROM departments d
JOIN employees e ON d.id = e.department_id
WHERE e.status = 'active'
GROUP BY d.department_name
HAVING COUNT(e.id) >= 5
ORDER BY avg_compensation DESC;`
    },
    topics: [
      {
        id: 'sql-01',
        title: 'SELECT & Recon Filtering',
        description: 'Query database columns and filter records using WHERE, AND, OR.',
        order: 1,
        challengesCount: 3,
        completedCount: 2,
        isLocked: false,
        challenges: [
          {
            id: 'sql-ch-1',
            pathId: 'sql',
            topicId: 'sql-01',
            topicTitle: 'SELECT & Recon Filtering',
            title: 'Targeted Column Extraction',
            difficulty: 'Beginner',
            xpReward: 50,
            question: 'Which SQL clause is used to extract only username and email columns from students?',
            tacticalBrief: 'EXTRACT: Specific fields from target relational table.',
            codeSnippet: {
              language: 'sql',
              code: `SELECT username, email
FROM students;`
            },
            options: [
              { id: 'opt-a', text: 'EXTRACT username, email FROM students;' },
              { id: 'opt-b', text: 'SELECT username, email FROM students;' },
              { id: 'opt-c', text: 'GET (username, email) IN students;' },
              { id: 'opt-d', text: 'FILTER students WHERE username, email;' }
            ],
            correctOptionId: 'opt-b',
            explanation: 'The `SELECT` statement specifies the columns you want to retrieve, followed by `FROM` denoting the target table.',
            hint: 'Standard SQL begins data retrieval with the SELECT keyword.'
          },
          {
            id: 'sql-ch-2',
            pathId: 'sql',
            topicId: 'sql-01',
            topicTitle: 'SELECT & Recon Filtering',
            title: 'Unique Telemetry Deduplication',
            difficulty: 'Intermediate',
            xpReward: 60,
            question: 'How do you return only unique country names without duplicates from the customers table?',
            tacticalBrief: 'DEDUPLICATE: Remove identical rows from result payload.',
            codeSnippet: {
              language: 'sql',
              code: `SELECT DISTINCT country
FROM customers;`
            },
            options: [
              { id: 'opt-a', text: 'SELECT UNIQUE country FROM customers;' },
              { id: 'opt-b', text: 'SELECT DISTINCT country FROM customers;' },
              { id: 'opt-c', text: 'SELECT country ONLY FROM customers;' },
              { id: 'opt-d', text: 'SELECT DEDUPE(country) FROM customers;' }
            ],
            correctOptionId: 'opt-b',
            explanation: 'The `DISTINCT` keyword following `SELECT` removes duplicate rows from the query result set.',
            hint: 'In SQL, the keyword for deduplicating returned records is DISTINCT.'
          }
        ]
      },
      {
        id: 'sql-02',
        title: 'Aggregations & Cluster Grouping',
        description: 'Aggregate counts, sums, averages, and group row sets.',
        order: 2,
        challengesCount: 3,
        completedCount: 0,
        isLocked: false,
        challenges: [
          {
            id: 'sql-ch-3',
            pathId: 'sql',
            topicId: 'sql-02',
            topicTitle: 'Aggregations & Cluster Grouping',
            title: 'Aggregated Group Filtering',
            difficulty: 'Intermediate',
            xpReward: 70,
            question: 'Which clause correctly filters aggregated groups that have more than 5 members?',
            tacticalBrief: 'FILTER: Grouped result sets with aggregate predicate.',
            codeSnippet: {
              language: 'sql',
              code: `SELECT department_id, COUNT(*) AS headcount
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;`
            },
            options: [
              { id: 'opt-a', text: 'WHERE COUNT(*) > 5' },
              { id: 'opt-b', text: 'HAVING COUNT(*) > 5' },
              { id: 'opt-c', text: 'LIMIT COUNT(*) > 5' },
              { id: 'opt-d', text: 'FILTER BY COUNT(*) > 5' }
            ],
            correctOptionId: 'opt-b',
            explanation: 'The `WHERE` clause filters individual rows before grouping, while `HAVING` filters aggregated groups after `GROUP BY`.',
            hint: 'Think: WHERE is for rows, HAVING is for groups.'
          }
        ]
      },
      {
        id: 'sql-03',
        title: 'Relational Cross-Table JOINs',
        description: 'Connect related tables with INNER, LEFT, and RIGHT joins.',
        order: 3,
        challengesCount: 4,
        completedCount: 0,
        isLocked: true,
        challenges: []
      }
    ]
  },
  {
    id: 'web-dev',
    title: 'Modern Web Dev',
    tagline: 'DOM Infiltration & Interface Combat',
    tacticalRole: 'DUELIST · INTERFACE ASSAULT',
    description: 'Build lightning-fast, reactive user interfaces. Weaponize CSS Flexbox, manipulate the DOM live, and handle asynchronous events with zero lag.',
    icon: 'Layout',
    color: '#F59E0B', // Tactical Gold
    accentColor: '#FBBF24',
    badge: 'DOM Duelist',
    totalChallenges: 20,
    estimatedHours: 14,
    sampleCode: {
      language: 'javascript',
      filename: 'hud_overlay.ts',
      code: `interface CombatHUD {
  crosshair: string;
  ammoCount: number;
  tacticalMode: 'ACTIVE' | 'STANDBY';
}

export function deployHUD(config: CombatHUD): void {
  const reticle = document.querySelector('#reticle');
  if (reticle) {
    reticle.classList.add('hud--active');
  }
}`
    },
    topics: [
      {
        id: 'web-01',
        title: 'Semantic HTML & Layout Grids',
        description: 'Construct modern web documents with semantic tags and accessibility.',
        order: 1,
        challengesCount: 3,
        completedCount: 1,
        isLocked: false,
        challenges: [
          {
            id: 'web-ch-1',
            pathId: 'web-dev',
            topicId: 'web-01',
            topicTitle: 'Semantic HTML & Layout Grids',
            title: 'Navigation Element Semantics',
            difficulty: 'Beginner',
            xpReward: 50,
            question: 'Which semantic HTML tag should wrap major site navigation links?',
            tacticalBrief: 'STRUCTURE: Accessibility landmark for site navigation.',
            codeSnippet: {
              language: 'html',
              code: `<nav aria-label="Main Navigation">
  <ul>
    <li><a href="/courses">Courses</a></li>
    <li><a href="/challenges">Challenges</a></li>
  </ul>
</nav>`
            },
            options: [
              { id: 'opt-a', text: '<div class="navigation">' },
              { id: 'opt-b', text: '<nav>' },
              { id: 'opt-c', text: '<section id="links">' },
              { id: 'opt-d', text: '<menu role="nav">' }
            ],
            correctOptionId: 'opt-b',
            explanation: 'The `<nav>` tag is the standard HTML5 semantic element designated specifically for blocks containing navigation links.',
            hint: 'HTML5 introduced semantic tags for landmark regions, including headers, footers, and navigation.'
          },
          {
            id: 'web-ch-2',
            pathId: 'web-dev',
            topicId: 'web-01',
            topicTitle: 'Semantic HTML & Layout Grids',
            title: 'Flexbox Cross-Axis Target Alignment',
            difficulty: 'Beginner',
            xpReward: 55,
            question: 'Which CSS property centers flex items along the cross-axis?',
            tacticalBrief: 'ALIGN: Cross-axis centering in flexible box layout.',
            codeSnippet: {
              language: 'javascript',
              code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
}`
            },
            options: [
              { id: 'opt-a', text: 'justify-content' },
              { id: 'opt-b', text: 'align-items' },
              { id: 'opt-c', text: 'text-align' },
              { id: 'opt-d', text: 'flex-direction' }
            ],
            correctOptionId: 'opt-b',
            explanation: 'In Flexbox, `justify-content` aligns items along the main axis, while `align-items` aligns along the cross axis.',
            hint: 'Think about cross axis vs main axis alignment in Flexbox.'
          }
        ]
      },
      {
        id: 'web-02',
        title: 'JavaScript DOM Assault & Mutation',
        description: 'Mutate DOM elements and handle asynchronous event streams.',
        order: 2,
        challengesCount: 4,
        completedCount: 0,
        isLocked: false,
        challenges: [
          {
            id: 'web-ch-3',
            pathId: 'web-dev',
            topicId: 'web-02',
            topicTitle: 'JavaScript DOM Assault & Mutation',
            title: 'Array Transformation Ammo Multiplier',
            difficulty: 'Intermediate',
            xpReward: 65,
            question: 'What is the value of `doubled` after running this JavaScript code?',
            tacticalBrief: 'MUTATE: Map array transformation without mutation.',
            codeSnippet: {
              language: 'javascript',
              code: `const numbers = [2, 4, 6];
const doubled = numbers.map(n => n * 2);
console.log(doubled);`
            },
            options: [
              { id: 'opt-a', text: '[4, 8, 12]' },
              { id: 'opt-b', text: '[2, 4, 6]' },
              { id: 'opt-c', text: '24' },
              { id: 'opt-d', text: 'undefined' }
            ],
            correctOptionId: 'opt-a',
            explanation: '`Array.prototype.map()` creates a new array populated with the results of calling the provided callback on every element: 2*2=4, 4*2=8, 6*2=12.',
            hint: 'The map method returns a brand new transformed array of identical length.'
          }
        ]
      },
      {
        id: 'web-03',
        title: 'Async API Fetching & Protocol Infiltration',
        description: 'Promises, async/await, and fetching remote data payloads.',
        order: 3,
        challengesCount: 4,
        completedCount: 0,
        isLocked: true,
        challenges: []
      }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'badge-first-blood',
    title: 'FIRST BLOOD',
    description: 'Secured your first verified challenge victory in the combat arena.',
    icon: 'Crosshair',
    tier: 'common',
    category: 'milestone',
    unlockedAt: '2026-10-04',
    isUnlocked: true,
    progress: { current: 1, total: 1 }
  },
  {
    id: 'badge-py-operator',
    title: 'PYTHON OPERATOR',
    description: 'Mastered 5 tactical combat challenges in the Python Core track.',
    icon: 'Terminal',
    tier: 'rare',
    category: 'mastery',
    unlockedAt: '2026-10-07',
    isUnlocked: true,
    progress: { current: 5, total: 5 }
  },
  {
    id: 'badge-streak-7',
    title: '7-ROUND SPRINT STREAK',
    description: 'Maintained uninterrupted daily combat practice for 7 days in a row.',
    icon: 'Flame',
    tier: 'epic',
    category: 'streak',
    unlockedAt: undefined,
    isUnlocked: false,
    progress: { current: 5, total: 7 }
  },
  {
    id: 'badge-sql-sentinel',
    title: 'DATA SENTINEL',
    description: 'Execute 3 flawless relational database queries without syntax error.',
    icon: 'Shield',
    tier: 'rare',
    category: 'mastery',
    unlockedAt: '2026-10-08',
    isUnlocked: true,
    progress: { current: 3, total: 3 }
  },
  {
    id: 'badge-speed-ace',
    title: 'ACE SPRINTER',
    description: 'Solve 3 consecutive challenges on the first attempt with 100% accuracy.',
    icon: 'Zap',
    tier: 'legendary',
    category: 'speed',
    unlockedAt: undefined,
    isUnlocked: false,
    progress: { current: 2, total: 3 }
  },
  {
    id: 'badge-radiant-mastery',
    title: 'TRI-PROTOCOL MASTER',
    description: 'Clear at least 3 combat exercises across all three tactical disciplines.',
    icon: 'Crown',
    tier: 'legendary',
    category: 'milestone',
    unlockedAt: undefined,
    isUnlocked: false,
    progress: { current: 2, total: 3 }
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'u-1',
    name: 'Alex Rivera',
    callsign: 'PHANTOM',
    username: 'phantom_99',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rank: 1,
    rankTier: 'Platinum',
    rr: 2450,
    level: 5,
    streak: 12,
    primaryPath: 'Python Operator',
    headshotAccuracy: 98.4,
    winStreak: 9,
    badgesCount: 7
  },
  {
    id: 'u-2',
    name: 'Jordan Hayes',
    callsign: 'CIPHER_X',
    username: 'jordan_h',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rank: 2,
    rankTier: 'Platinum',
    rr: 2200,
    level: 4,
    streak: 9,
    primaryPath: 'SQL Sentinel',
    headshotAccuracy: 96.1,
    winStreak: 6,
    badgesCount: 6
  },
  {
    id: 'u-3',
    name: 'Samira Patel',
    callsign: 'NOVA',
    username: 'nova_patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    rank: 3,
    rankTier: 'Gold',
    rr: 1950,
    level: 4,
    streak: 14,
    primaryPath: 'DOM Duelist',
    headshotAccuracy: 95.5,
    winStreak: 8,
    badgesCount: 5
  },
  {
    id: 'u-current',
    name: 'Alex Chen',
    callsign: 'VORTEX',
    username: 'vortex_dev',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    rank: 4,
    rankTier: 'Gold',
    rr: 1850,
    level: 3,
    streak: 5,
    primaryPath: 'Python Operator',
    headshotAccuracy: 94.2,
    winStreak: 4,
    badgesCount: 3,
    isCurrentUser: true
  },
  {
    id: 'u-5',
    name: 'Elena Rostova',
    callsign: 'VIPER_R',
    username: 'elena_r',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rank: 5,
    rankTier: 'Gold',
    rr: 1720,
    level: 3,
    streak: 4,
    primaryPath: 'Python Operator',
    headshotAccuracy: 92.8,
    winStreak: 3,
    badgesCount: 4
  },
  {
    id: 'u-6',
    name: 'Marcus Vance',
    callsign: 'SLEDGE',
    username: 'mvance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    rank: 6,
    rankTier: 'Gold',
    rr: 1540,
    level: 3,
    streak: 3,
    primaryPath: 'SQL Sentinel',
    headshotAccuracy: 89.4,
    winStreak: 2,
    badgesCount: 3
  },
  {
    id: 'u-7',
    name: 'Chloe Zhang',
    callsign: 'RAZE_Z',
    username: 'chloez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    rank: 7,
    rankTier: 'Silver',
    rr: 1390,
    level: 2,
    streak: 6,
    primaryPath: 'DOM Duelist',
    headshotAccuracy: 87.0,
    winStreak: 2,
    badgesCount: 2
  }
];

export const INITIAL_WEEKLY_ACTIVITY: DailyActivity[] = [
  { day: 'MON', date: 'OCT 03', challenges: 3, xp: 160 },
  { day: 'TUE', date: 'OCT 04', challenges: 4, xp: 210 },
  { day: 'WED', date: 'OCT 05', challenges: 2, xp: 110 },
  { day: 'THU', date: 'OCT 06', challenges: 5, xp: 280 },
  { day: 'FRI', date: 'OCT 07', challenges: 4, xp: 215 },
  { day: 'SAT', date: 'OCT 08', challenges: 6, xp: 340 },
  { day: 'SUN', date: 'TODAY', challenges: 3, xp: 150 }
];
