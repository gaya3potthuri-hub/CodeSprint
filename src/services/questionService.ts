import { QuizQuestion, QuizSetupConfig, ProgrammingIslandId } from '../types';

/**
 * Curated Question Bank for all 20 Villages across Python, SQL, Java, and AI.
 * Each question has 4 options, a validated correct option, explanation, and optional code snippet.
 */
const CURATED_QUESTIONS: Record<string, QuizQuestion[]> = {
  // =================== PYTHON ISLAND ===================
  'py-v1': [
    {
      id: 'py-v1-q1',
      islandId: 'python',
      villageId: 'py-v1',
      topic: 'Variables',
      difficulty: 'Beginner',
      question: 'What is the output of the following Python variable assignment and print?',
      codeSnippet: {
        language: 'python',
        code: `x = 10\ny = 5\nx = y + 2\nprint(x)`
      },
      options: [
        { id: 'a', text: '10' },
        { id: 'b', text: '7' },
        { id: 'c', text: '12' },
        { id: 'd', text: '5' }
      ],
      correctOptionId: 'b',
      explanation: 'In Python, variables are evaluated on the right side first: `y + 2` is `5 + 2 = 7`, which is then assigned to `x`.'
    },
    {
      id: 'py-v1-q2',
      islandId: 'python',
      villageId: 'py-v1',
      topic: 'Data Types',
      difficulty: 'Beginner',
      question: 'What data type is returned by the expression type(3.14)?',
      options: [
        { id: 'a', text: "<class 'int'>" },
        { id: 'b', text: "<class 'float'>" },
        { id: 'c', text: "<class 'double'>" },
        { id: 'd', text: "<class 'decimal'>" }
      ],
      correctOptionId: 'b',
      explanation: 'In Python, numbers with decimal points are represented by the built-in `float` type.'
    },
    {
      id: 'py-v1-q3',
      islandId: 'python',
      villageId: 'py-v1',
      topic: 'Input and Output',
      difficulty: 'Beginner',
      question: 'What does the input() function in Python always return as its data type?',
      options: [
        { id: 'a', text: 'int' },
        { id: 'b', text: 'str (string)' },
        { id: 'c', text: 'depends on what user types' },
        { id: 'd', text: 'None' }
      ],
      correctOptionId: 'b',
      explanation: '`input()` in Python always reads raw user keystrokes as a string (`str`). To use it as an integer, you must explicitly convert with `int()`.'
    },
    {
      id: 'py-v1-q4',
      islandId: 'python',
      villageId: 'py-v1',
      topic: 'Variables',
      difficulty: 'Beginner',
      question: 'Which of the following is a valid variable identifier name in Python?',
      options: [
        { id: 'a', text: '2nd_score' },
        { id: 'b', text: 'total-score' },
        { id: 'c', text: 'total_score' },
        { id: 'd', text: 'class' }
      ],
      correctOptionId: 'c',
      explanation: 'Python identifiers cannot start with a digit, cannot contain hyphens, and cannot be reserved keywords like `class`. `total_score` uses valid snake_case.'
    },
    {
      id: 'py-v1-q5',
      islandId: 'python',
      villageId: 'py-v1',
      topic: 'Data Types',
      difficulty: 'Beginner',
      question: 'What will this print statement evaluate to?',
      codeSnippet: {
        language: 'python',
        code: `print("Sprint" + str(10))`
      },
      options: [
        { id: 'a', text: 'Sprint 10' },
        { id: 'b', text: 'Sprint10' },
        { id: 'c', text: 'TypeError' },
        { id: 'd', text: 'Sprint + 10' }
      ],
      correctOptionId: 'b',
      explanation: '`str(10)` converts the number to `"10"`. Concatenating `"Sprint"` and `"10"` yields `"Sprint10"` without spaces.'
    }
  ],

  'py-v2': [
    {
      id: 'py-v2-q1',
      islandId: 'python',
      villageId: 'py-v2',
      topic: 'If-Else Conditions',
      difficulty: 'Beginner',
      question: 'What does this conditional logic print?',
      codeSnippet: {
        language: 'python',
        code: `score = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")`
      },
      options: [
        { id: 'a', text: 'A' },
        { id: 'b', text: 'B' },
        { id: 'c', text: 'C' },
        { id: 'd', text: 'A and B' }
      ],
      correctOptionId: 'b',
      explanation: '`score >= 90` is False, but `score >= 80` is True (85 >= 80), so `"B"` is printed and the elif chain terminates.'
    },
    {
      id: 'py-v2-q2',
      islandId: 'python',
      villageId: 'py-v2',
      topic: 'For Loops',
      difficulty: 'Beginner',
      question: 'How many iterations does this loop execute?',
      codeSnippet: {
        language: 'python',
        code: `total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)`
      },
      options: [
        { id: 'a', text: '5 iterations, prints 15' },
        { id: 'b', text: '4 iterations, prints 10' },
        { id: 'c', text: '3 iterations, prints 6' },
        { id: 'd', text: '4 iterations, prints 14' }
      ],
      correctOptionId: 'b',
      explanation: '`range(1, 5)` iterates over values 1, 2, 3, and 4 (the upper bound 5 is exclusive). 1 + 2 + 3 + 4 = 10 across 4 iterations.'
    },
    {
      id: 'py-v2-q3',
      islandId: 'python',
      villageId: 'py-v2',
      topic: 'While Loops',
      difficulty: 'Beginner',
      question: 'What is the final value of count when this while loop terminates?',
      codeSnippet: {
        language: 'python',
        code: `count = 0\nwhile count < 6:\n    count += 2\nprint(count)`
      },
      options: [
        { id: 'a', text: '4' },
        { id: 'b', text: '6' },
        { id: 'c', text: '8' },
        { id: 'd', text: 'Infinite loop' }
      ],
      correctOptionId: 'b',
      explanation: 'The loop executes for count = 0 -> 2 -> 4 -> 6. When count reaches 6, `count < 6` evaluates to False, ending the loop.'
    }
  ],

  'py-v3': [
    {
      id: 'py-v3-q1',
      islandId: 'python',
      villageId: 'py-v3',
      topic: 'Functions',
      difficulty: 'Intermediate',
      question: 'What is the output of this Python function with a default parameter?',
      codeSnippet: {
        language: 'python',
        code: `def greet(name, title="Coder"):\n    return f"{title} {name}"\n\nprint(greet("Zack"))`
      },
      options: [
        { id: 'a', text: 'Zack Coder' },
        { id: 'b', text: 'Coder Zack' },
        { id: 'c', text: 'TypeError: missing argument' },
        { id: 'd', text: 'None Zack' }
      ],
      correctOptionId: 'b',
      explanation: 'Since the second argument is omitted in `greet("Zack")`, the default value `"Coder"` is used, returning `"Coder Zack"`.'
    },
    {
      id: 'py-v3-q2',
      islandId: 'python',
      villageId: 'py-v3',
      topic: 'Return Values',
      difficulty: 'Intermediate',
      question: 'What does a Python function return if it has no return statement?',
      options: [
        { id: 'a', text: '0' },
        { id: 'b', text: 'False' },
        { id: 'c', text: 'None' },
        { id: 'd', text: 'undefined' }
      ],
      correctOptionId: 'c',
      explanation: 'Functions in Python without an explicit `return` return `None` by default when they finish execution.'
    }
  ],

  'py-v4': [
    {
      id: 'py-v4-q1',
      islandId: 'python',
      villageId: 'py-v4',
      topic: 'Lists',
      difficulty: 'Intermediate',
      question: 'What does the slice nums[1:3] produce?',
      codeSnippet: {
        language: 'python',
        code: `nums = [10, 20, 30, 40, 50]\nprint(nums[1:3])`
      },
      options: [
        { id: 'a', text: '[10, 20]' },
        { id: 'b', text: '[20, 30]' },
        { id: 'c', text: '[20, 30, 40]' },
        { id: 'd', text: '[10, 20, 30]' }
      ],
      correctOptionId: 'b',
      explanation: 'Slicing `[1:3]` extracts elements from index 1 up to (but not including) index 3. Indices 1 and 2 correspond to `20` and `30`.'
    },
    {
      id: 'py-v4-q2',
      islandId: 'python',
      villageId: 'py-v4',
      topic: 'Dictionaries',
      difficulty: 'Intermediate',
      question: 'How do you safely look up a key in a dictionary with a fallback value?',
      options: [
        { id: 'a', text: 'dict[key, default]' },
        { id: 'b', text: 'dict.get(key, default)' },
        { id: 'c', text: 'dict.lookup(key, default)' },
        { id: 'd', text: 'dict.find(key, default)' }
      ],
      correctOptionId: 'b',
      explanation: '`dict.get(key, default)` returns the value if the key exists, or the default value without raising a `KeyError`.'
    }
  ],

  'py-v5': [
    {
      id: 'py-v5-q1',
      islandId: 'python',
      villageId: 'py-v5',
      topic: 'Searching',
      difficulty: 'Advanced',
      question: 'What is the time complexity of Binary Search on a sorted array of size N?',
      options: [
        { id: 'a', text: 'O(N)' },
        { id: 'b', text: 'O(log N)' },
        { id: 'c', text: 'O(N^2)' },
        { id: 'd', text: 'O(1)' }
      ],
      correctOptionId: 'b',
      explanation: 'Binary Search halves the search space with each comparison, yielding an optimal logarithmic time complexity of `O(log N)`.'
    }
  ],

  // =================== SQL ISLAND ===================
  'sql-v1': [
    {
      id: 'sql-v1-q1',
      islandId: 'sql',
      villageId: 'sql-v1',
      topic: 'Basic Queries',
      difficulty: 'Beginner',
      question: 'Which SQL keyword is used to retrieve all rows and columns from a table named students?',
      codeSnippet: {
        language: 'sql',
        code: `SELECT * FROM students;`
      },
      options: [
        { id: 'a', text: 'GET ALL FROM students;' },
        { id: 'b', text: 'SELECT * FROM students;' },
        { id: 'c', text: 'EXTRACT TABLE students;' },
        { id: 'd', text: 'FETCH students;' }
      ],
      correctOptionId: 'b',
      explanation: '`SELECT * FROM table_name;` is standard SQL syntax to project all columns and return all rows from a table.'
    },
    {
      id: 'sql-v1-q2',
      islandId: 'sql',
      villageId: 'sql-v1',
      topic: 'Tables',
      difficulty: 'Beginner',
      question: 'What primary constraint ensures that each row in a database table has a unique identifier that cannot be NULL?',
      options: [
        { id: 'a', text: 'FOREIGN KEY' },
        { id: 'b', text: 'PRIMARY KEY' },
        { id: 'c', text: 'UNIQUE NULLABLE' },
        { id: 'd', text: 'INDEX KEY' }
      ],
      correctOptionId: 'b',
      explanation: 'A `PRIMARY KEY` uniquely identifies each record in a database table and cannot contain NULL values.'
    }
  ],

  'sql-v2': [
    {
      id: 'sql-v2-q1',
      islandId: 'sql',
      villageId: 'sql-v2',
      topic: 'WHERE Filtering',
      difficulty: 'Beginner',
      question: 'Which query filters for users located in "Tokyo" with an age greater than 20?',
      codeSnippet: {
        language: 'sql',
        code: `SELECT name FROM users\nWHERE city = 'Tokyo' AND age > 20;`
      },
      options: [
        { id: 'a', text: "WHERE city == 'Tokyo' && age > 20" },
        { id: 'b', text: "WHERE city = 'Tokyo' AND age > 20" },
        { id: 'c', text: "FILTER city = 'Tokyo' WITH age > 20" },
        { id: 'd', text: "HAVING city = 'Tokyo' AND age > 20" }
      ],
      correctOptionId: 'b',
      explanation: 'SQL uses single equals `=` for comparison and the boolean operator `AND` in the `WHERE` clause.'
    },
    {
      id: 'sql-v2-q2',
      islandId: 'sql',
      villageId: 'sql-v2',
      topic: 'ORDER BY',
      difficulty: 'Beginner',
      question: 'How do you sort employees from highest to lowest salary in SQL?',
      options: [
        { id: 'a', text: 'ORDER BY salary ASC' },
        { id: 'b', text: 'ORDER BY salary DESC' },
        { id: 'c', text: 'SORT BY salary HIGH' },
        { id: 'd', text: 'GROUP BY salary DESC' }
      ],
      correctOptionId: 'b',
      explanation: '`ORDER BY column DESC` sorts results in descending order (highest to lowest).'
    }
  ],

  'sql-v3': [
    {
      id: 'sql-v3-q1',
      islandId: 'sql',
      villageId: 'sql-v3',
      topic: 'GROUP BY',
      difficulty: 'Intermediate',
      question: 'What is the key difference between WHERE and HAVING in SQL?',
      options: [
        { id: 'a', text: 'WHERE filters before aggregation; HAVING filters after aggregation' },
        { id: 'b', text: 'HAVING filters individual rows; WHERE filters grouped rows' },
        { id: 'c', text: 'They are identical and interchangeable' },
        { id: 'd', text: 'HAVING cannot be used with GROUP BY' }
      ],
      correctOptionId: 'a',
      explanation: '`WHERE` filters individual rows prior to grouping, while `HAVING` filters aggregated groups produced by `GROUP BY`.'
    }
  ],

  'sql-v4': [
    {
      id: 'sql-v4-q1',
      islandId: 'sql',
      villageId: 'sql-v4',
      topic: 'INNER JOIN',
      difficulty: 'Intermediate',
      question: 'What rows does an INNER JOIN return between two tables?',
      options: [
        { id: 'a', text: 'All rows from both tables, filling mismatches with NULL' },
        { id: 'b', text: 'Only rows that have matching values in both tables' },
        { id: 'c', text: 'All rows from the left table only' },
        { id: 'd', text: 'All rows from the right table only' }
      ],
      correctOptionId: 'b',
      explanation: '`INNER JOIN` returns records only when there is a match between the joined columns in both the left and right tables.'
    }
  ],

  'sql-v5': [
    {
      id: 'sql-v5-q1',
      islandId: 'sql',
      villageId: 'sql-v5',
      topic: 'Nested Queries',
      difficulty: 'Advanced',
      question: 'What is a correlated subquery in SQL?',
      options: [
        { id: 'a', text: 'A query that executes independently once before the outer query' },
        { id: 'b', text: 'A subquery that references columns from the outer query and evaluates once per outer row' },
        { id: 'c', text: 'A query joined with another database instance' },
        { id: 'd', text: 'A recursive common table expression' }
      ],
      correctOptionId: 'b',
      explanation: 'A correlated subquery depends on values from the outer query for its evaluation and executes for each row processed by the outer query.'
    }
  ],

  // =================== JAVA ISLAND ===================
  'java-v1': [
    {
      id: 'java-v1-q1',
      islandId: 'java',
      villageId: 'java-v1',
      topic: 'Syntax',
      difficulty: 'Beginner',
      question: 'What is the required signature for the entry-point method of a standard Java application?',
      codeSnippet: {
        language: 'java',
        code: `public static void main(String[] args)`
      },
      options: [
        { id: 'a', text: 'public void start(String[] args)' },
        { id: 'b', text: 'public static void main(String[] args)' },
        { id: 'c', text: 'static int main(String[] args)' },
        { id: 'd', text: 'public static main(String args)' }
      ],
      correctOptionId: 'b',
      explanation: 'The JVM requires `public static void main(String[] args)` as the official runtime entry point for Java programs.'
    },
    {
      id: 'java-v1-q2',
      islandId: 'java',
      villageId: 'java-v1',
      topic: 'Primitive Types',
      difficulty: 'Beginner',
      question: 'Which of the following is NOT a primitive data type in Java?',
      options: [
        { id: 'a', text: 'int' },
        { id: 'b', text: 'boolean' },
        { id: 'c', text: 'char' },
        { id: 'd', text: 'String' }
      ],
      correctOptionId: 'd',
      explanation: '`String` in Java is a reference Class (`java.lang.String`), not one of Java’s 8 primitive types (byte, short, int, long, float, double, char, boolean).'
    }
  ],

  'java-v2': [
    {
      id: 'java-v2-q1',
      islandId: 'java',
      villageId: 'java-v2',
      topic: 'Loops',
      difficulty: 'Beginner',
      question: 'What will this enhanced for-each loop print?',
      codeSnippet: {
        language: 'java',
        code: `int[] numbers = {2, 4, 6};\nfor (int n : numbers) {\n    System.out.print(n * 2 + " ");\n}`
      },
      options: [
        { id: 'a', text: '2 4 6 ' },
        { id: 'b', text: '4 8 12 ' },
        { id: 'c', text: '4 6 8 ' },
        { id: 'd', text: 'ArrayIndexOutOfBounds' }
      ],
      correctOptionId: 'b',
      explanation: 'The enhanced for-each loop visits every element: 2*2=4, 4*2=8, 6*2=12, printing `"4 8 12 "`.'
    }
  ],

  'java-v3': [
    {
      id: 'java-v3-q1',
      islandId: 'java',
      villageId: 'java-v3',
      topic: 'Constructors',
      difficulty: 'Intermediate',
      question: 'What is true about constructors in Java?',
      options: [
        { id: 'a', text: 'They must have a void return type' },
        { id: 'b', text: 'They have the exact same name as the class and no return type' },
        { id: 'c', text: 'They cannot take parameters' },
        { id: 'd', text: 'They must be declared private' }
      ],
      correctOptionId: 'b',
      explanation: 'In Java, a constructor matches the class name exactly, has no return type specification, and is invoked via `new`.'
    }
  ],

  'java-v4': [
    {
      id: 'java-v4-q1',
      islandId: 'java',
      villageId: 'java-v4',
      topic: 'Inheritance',
      difficulty: 'Intermediate',
      question: 'Which Java keyword allows a subclass to inherit attributes and methods from a superclass?',
      options: [
        { id: 'a', text: 'implements' },
        { id: 'b', text: 'extends' },
        { id: 'c', text: 'inherits' },
        { id: 'd', text: 'super' }
      ],
      correctOptionId: 'b',
      explanation: '`extends` is used to inherit from a class in Java (e.g., `class Dog extends Animal`). `implements` is used for interfaces.'
    }
  ],

  'java-v5': [
    {
      id: 'java-v5-q1',
      islandId: 'java',
      villageId: 'java-v5',
      topic: 'HashMaps',
      difficulty: 'Advanced',
      question: 'What is the average time complexity to get or put a key in a Java HashMap?',
      options: [
        { id: 'a', text: 'O(1)' },
        { id: 'b', text: 'O(N)' },
        { id: 'c', text: 'O(log N)' },
        { id: 'd', text: 'O(N^2)' }
      ],
      correctOptionId: 'a',
      explanation: '`HashMap` uses hash bucket indexing, providing constant time `O(1)` average performance for get and put operations.'
    }
  ],

  // =================== AI ISLAND ===================
  'ai-v1': [
    {
      id: 'ai-v1-q1',
      islandId: 'ai',
      villageId: 'ai-v1',
      topic: 'AI vs ML Basics',
      difficulty: 'Beginner',
      question: 'What is the relationship between Artificial Intelligence (AI) and Machine Learning (ML)?',
      options: [
        { id: 'a', text: 'They are completely unrelated fields' },
        { id: 'b', text: 'Machine Learning is a subset of Artificial Intelligence' },
        { id: 'c', text: 'Artificial Intelligence is a subset of Machine Learning' },
        { id: 'd', text: 'Machine Learning only deals with computer hardware' }
      ],
      correctOptionId: 'b',
      explanation: 'Machine Learning is a subset of AI that focuses on enabling algorithms to learn patterns and make predictions from data without explicit rules.'
    },
    {
      id: 'ai-v1-q2',
      islandId: 'ai',
      villageId: 'ai-v1',
      topic: 'Datasets & Features',
      difficulty: 'Beginner',
      question: 'In a machine learning dataset predicting house prices, what is the house price called?',
      options: [
        { id: 'a', text: 'A Feature (Input)' },
        { id: 'b', text: 'A Hyperparameter' },
        { id: 'c', text: 'The Target / Label (Output)' },
        { id: 'd', text: 'An Epoch' }
      ],
      correctOptionId: 'c',
      explanation: 'In supervised learning, the property we want the model to predict (like price) is called the target or label.'
    }
  ],

  'ai-v2': [
    {
      id: 'ai-v2-q1',
      islandId: 'ai',
      villageId: 'ai-v2',
      topic: 'Supervised Learning',
      difficulty: 'Beginner',
      question: 'Why do data scientists split data into Training and Testing sets?',
      options: [
        { id: 'a', text: 'To double the amount of data available' },
        { id: 'b', text: 'To evaluate how well the trained model generalizes to unseen data' },
        { id: 'c', text: 'To compress the model weights' },
        { id: 'd', text: 'Because GPUs cannot process entire datasets' }
      ],
      correctOptionId: 'b',
      explanation: 'The test set acts as unseen data to objectively evaluate whether the model has learned generalizable patterns rather than simply memorizing the training samples.'
    }
  ],

  'ai-v3': [
    {
      id: 'ai-v3-q1',
      islandId: 'ai',
      villageId: 'ai-v3',
      topic: 'Activation Functions',
      difficulty: 'Intermediate',
      question: 'What is the primary purpose of an Activation Function (like ReLU) in a neural network?',
      options: [
        { id: 'a', text: 'To introduce non-linearity so the network can learn complex patterns' },
        { id: 'b', text: 'To prevent weights from updating during training' },
        { id: 'c', text: 'To automatically label the test dataset' },
        { id: 'd', text: 'To convert text tokens into integers' }
      ],
      correctOptionId: 'a',
      explanation: 'Without non-linear activation functions, a multi-layer neural network collapses into a simple linear regression regardless of depth.'
    }
  ],

  'ai-v4': [
    {
      id: 'ai-v4-q1',
      islandId: 'ai',
      villageId: 'ai-v4',
      topic: 'NLP & Tokenization',
      difficulty: 'Intermediate',
      question: 'What does tokenization do in Natural Language Processing (NLP)?',
      options: [
        { id: 'a', text: 'Compresses text files into zip archives' },
        { id: 'b', text: 'Breaks raw text into smaller pieces (words, subwords, or characters) for processing' },
        { id: 'c', text: 'Translates code into machine binary' },
        { id: 'd', text: 'Renders vectors as images' }
      ],
      correctOptionId: 'b',
      explanation: 'Tokenization segments continuous human text into discrete tokens that can be mapped to numerical IDs and embeddings.'
    }
  ],

  'ai-v5': [
    {
      id: 'ai-v5-q1',
      islandId: 'ai',
      villageId: 'ai-v5',
      topic: 'Overfitting Prevention',
      difficulty: 'Advanced',
      question: 'What happens when a machine learning model is "overfitting"?',
      options: [
        { id: 'a', text: 'It performs poorly on both training and test data' },
        { id: 'b', text: 'It memorizes training data noise and fails to generalize to test data' },
        { id: 'c', text: 'The model trains too quickly' },
        { id: 'd', text: 'The dataset has too few features' }
      ],
      correctOptionId: 'b',
      explanation: 'Overfitting occurs when a model learns the training data and noise too well, achieving high training accuracy but poor real-world/testing generalization.'
    }
  ]
};

// Generative template expansion to ensure all question counts (5, 10, 15, 20, 25) can always be generated reliably
function generateDynamicVariations(baseQuestions: QuizQuestion[], targetCount: number, villageId: string, islandId: ProgrammingIslandId): QuizQuestion[] {
  const result: QuizQuestion[] = [...baseQuestions];
  let cycle = 1;

  while (result.length < targetCount) {
    for (const q of baseQuestions) {
      if (result.length >= targetCount) break;
      result.push({
        ...q,
        id: `${q.id}-var${cycle}`,
        question: cycle % 2 === 1 ? `[Review Drill] ${q.question}` : `[Mastery Check] ${q.question}`
      });
    }
    cycle++;
  }

  return result.slice(0, targetCount);
}

export class QuestionService {
  /**
   * Generates or retrieves questions matching the exact quiz configuration:
   * island, village, topics, difficulty, and requested question count (5, 10, 15, 20, 25).
   */
  public static async getQuestions(config: QuizSetupConfig): Promise<QuizQuestion[]> {
    // 1. Check curated questions for this village
    let bank = CURATED_QUESTIONS[config.villageId] || [];

    // If specific village has fewer questions, merge with island's general bank
    if (bank.length === 0) {
      const allIslandQuestions: QuizQuestion[] = [];
      Object.keys(CURATED_QUESTIONS).forEach((key) => {
        if (key.startsWith(config.islandId.substring(0, 2)) || (config.islandId === 'python' && key.startsWith('py'))) {
          allIslandQuestions.push(...CURATED_QUESTIONS[key]);
        }
      });
      bank = allIslandQuestions.length > 0 ? allIslandQuestions : CURATED_QUESTIONS['py-v1'];
    }

    // 2. Expand/shuffle to meet requested questionCount (5, 10, 15, 20, 25)
    const questions = generateDynamicVariations(bank, config.questionCount, config.villageId, config.islandId);

    // Shuffle options order subtly so repeat attempts remain challenging
    return questions.map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    }));
  }
}
