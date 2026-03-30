// Course data organized by level: Foundation (1-5), Growth (6-8), Mastery (9-12)
export const courseData = {
  foundation: [
    {
      id: 'f-math', name: 'Mathematics', icon: '🔢', color: 'from-blue-500 to-indigo-600',
      description: 'Numbers, shapes, and fun with math!',
      lessons: [
        { id: 'f-m-l1', title: 'Numbers & Counting', subtopics: [
          { id: 'f-m-l1-s1', title: 'Counting 1 to 100', content: 'Learn to count from 1 to 100 using objects, fingers, and number lines.', duration: '15 min' },
          { id: 'f-m-l1-s2', title: 'Place Value', content: 'Understand ones, tens, and hundreds places in numbers.', duration: '20 min' },
        ], quiz: { questions: [
          { q: 'What comes after 49?', opts: ['48', '50', '51', '59'], ans: 1 },
          { q: 'How many tens in 73?', opts: ['3', '7', '73', '37'], ans: 1 },
        ]}},
        { id: 'f-m-l2', title: 'Addition & Subtraction', subtopics: [
          { id: 'f-m-l2-s1', title: 'Adding Numbers', content: 'Learn to add single and double digit numbers with carry forward.', duration: '20 min' },
          { id: 'f-m-l2-s2', title: 'Subtracting Numbers', content: 'Learn subtraction with borrowing method.', duration: '20 min' },
          { id: 'f-m-l2-s3', title: 'Word Problems', content: 'Solve real-world addition and subtraction problems.', duration: '25 min' },
        ], quiz: { questions: [
          { q: '24 + 18 = ?', opts: ['32', '42', '44', '34'], ans: 1 },
          { q: '50 - 23 = ?', opts: ['27', '33', '37', '23'], ans: 0 },
        ]}},
        { id: 'f-m-l3', title: 'Shapes & Patterns', subtopics: [
          { id: 'f-m-l3-s1', title: '2D Shapes', content: 'Identify circles, squares, triangles, rectangles and their properties.', duration: '15 min' },
          { id: 'f-m-l3-s2', title: '3D Shapes', content: 'Learn about cubes, spheres, cylinders and cones.', duration: '15 min' },
        ], quiz: { questions: [
          { q: 'How many sides does a triangle have?', opts: ['2', '3', '4', '5'], ans: 1 },
          { q: 'A ball is which shape?', opts: ['Cube', 'Cylinder', 'Sphere', 'Cone'], ans: 2 },
        ]}},
      ]
    },
    {
      id: 'f-eng', name: 'English', icon: '📖', color: 'from-green-500 to-emerald-600',
      description: 'Reading, writing, and storytelling!',
      lessons: [
        { id: 'f-e-l1', title: 'Alphabets & Phonics', subtopics: [
          { id: 'f-e-l1-s1', title: 'Vowels & Consonants', content: 'Learn the 5 vowels (A, E, I, O, U) and 21 consonants.', duration: '15 min' },
          { id: 'f-e-l1-s2', title: 'Phonics Sounds', content: 'Connect letters to their sounds for better reading.', duration: '20 min' },
        ], quiz: { questions: [
          { q: 'Which is a vowel?', opts: ['B', 'E', 'D', 'G'], ans: 1 },
          { q: 'How many vowels are there?', opts: ['3', '4', '5', '6'], ans: 2 },
        ]}},
        { id: 'f-e-l2', title: 'Simple Sentences', subtopics: [
          { id: 'f-e-l2-s1', title: 'Nouns & Verbs', content: 'Nouns are naming words. Verbs are action words.', duration: '20 min' },
          { id: 'f-e-l2-s2', title: 'Making Sentences', content: 'Combine nouns and verbs to make meaningful sentences.', duration: '20 min' },
        ], quiz: { questions: [
          { q: '"Dog" is a ___?', opts: ['Verb', 'Noun', 'Adjective', 'Pronoun'], ans: 1 },
          { q: '"Run" is a ___?', opts: ['Noun', 'Adjective', 'Verb', 'Adverb'], ans: 2 },
        ]}},
      ]
    },
    {
      id: 'f-sci', name: 'Science', icon: '🔬', color: 'from-purple-500 to-pink-600',
      description: 'Explore the world around you!',
      lessons: [
        { id: 'f-s-l1', title: 'Living Things', subtopics: [
          { id: 'f-s-l1-s1', title: 'Plants', content: 'Plants make their own food using sunlight through photosynthesis.', duration: '15 min' },
          { id: 'f-s-l1-s2', title: 'Animals', content: 'Animals are living things that eat, breathe, and move.', duration: '15 min' },
        ], quiz: { questions: [
          { q: 'Plants make food using ___?', opts: ['Water only', 'Sunlight', 'Soil only', 'Air only'], ans: 1 },
          { q: 'Which is a living thing?', opts: ['Stone', 'Tree', 'Chair', 'Book'], ans: 1 },
        ]}},
      ]
    },
  ],

  growth: [
    {
      id: 'g-math', name: 'Mathematics', icon: '📐', color: 'from-blue-600 to-violet-700',
      description: 'Algebra, geometry, and problem-solving',
      lessons: [
        { id: 'g-m-l1', title: 'Algebra Basics', subtopics: [
          { id: 'g-m-l1-s1', title: 'Variables & Expressions', content: 'Variables represent unknown values. An expression like 2x + 3 combines variables and constants.', duration: '25 min' },
          { id: 'g-m-l1-s2', title: 'Solving Linear Equations', content: 'To solve x + 5 = 12, subtract 5 from both sides to get x = 7.', duration: '30 min' },
          { id: 'g-m-l1-s3', title: 'Inequalities', content: 'Inequalities use <, >, ≤, ≥ to compare expressions.', duration: '25 min' },
        ], quiz: { questions: [
          { q: 'Solve: 2x = 10', opts: ['x = 2', 'x = 5', 'x = 10', 'x = 20'], ans: 1 },
          { q: 'If x + 3 > 7, then x > ?', opts: ['3', '4', '7', '10'], ans: 1 },
        ]}},
        { id: 'g-m-l2', title: 'Geometry', subtopics: [
          { id: 'g-m-l2-s1', title: 'Angles & Lines', content: 'Acute angles < 90°, right angles = 90°, obtuse angles > 90°.', duration: '25 min' },
          { id: 'g-m-l2-s2', title: 'Triangles', content: 'Types: equilateral (all equal), isosceles (two equal), scalene (none equal). Sum of angles = 180°.', duration: '30 min' },
          { id: 'g-m-l2-s3', title: 'Area & Perimeter', content: 'Rectangle area = l × b. Circle area = πr². Perimeter is the boundary length.', duration: '30 min' },
        ], quiz: { questions: [
          { q: 'Sum of angles in a triangle?', opts: ['90°', '180°', '270°', '360°'], ans: 1 },
          { q: 'Area of rectangle 5×3?', opts: ['8', '15', '16', '30'], ans: 1 },
        ]}},
        { id: 'g-m-l3', title: 'Fractions & Decimals', subtopics: [
          { id: 'g-m-l3-s1', title: 'Operations on Fractions', content: 'To add fractions, find LCD. To multiply, multiply numerators and denominators.', duration: '30 min' },
          { id: 'g-m-l3-s2', title: 'Decimal Conversions', content: 'Convert fractions to decimals by dividing numerator by denominator.', duration: '25 min' },
        ], quiz: { questions: [
          { q: '1/2 + 1/4 = ?', opts: ['2/6', '3/4', '1/6', '2/4'], ans: 1 },
          { q: '0.75 as fraction?', opts: ['1/2', '3/4', '2/3', '7/5'], ans: 1 },
        ]}},
      ]
    },
    {
      id: 'g-sci', name: 'Science', icon: '⚗️', color: 'from-emerald-600 to-teal-700',
      description: 'Physics, Chemistry & Biology fundamentals',
      lessons: [
        { id: 'g-s-l1', title: 'Force & Motion', subtopics: [
          { id: 'g-s-l1-s1', title: "Newton's Laws", content: "1st: Objects at rest stay at rest. 2nd: F = ma. 3rd: Every action has equal opposite reaction.", duration: '30 min' },
          { id: 'g-s-l1-s2', title: 'Speed & Velocity', content: 'Speed = distance/time. Velocity includes direction. Acceleration = change in velocity/time.', duration: '25 min' },
        ], quiz: { questions: [
          { q: "Newton's 2nd law formula?", opts: ['F = mv', 'F = ma', 'F = mg', 'F = mc²'], ans: 1 },
          { q: 'Speed = ?', opts: ['d × t', 'd / t', 'd + t', 'd - t'], ans: 1 },
        ]}},
        { id: 'g-s-l2', title: 'Atoms & Elements', subtopics: [
          { id: 'g-s-l2-s1', title: 'Atomic Structure', content: 'Atoms have protons (+), neutrons (0) in nucleus, electrons (-) orbiting.', duration: '30 min' },
          { id: 'g-s-l2-s2', title: 'Periodic Table', content: 'Elements arranged by atomic number. Groups = columns, Periods = rows.', duration: '30 min' },
        ], quiz: { questions: [
          { q: 'Protons have what charge?', opts: ['Negative', 'Positive', 'Neutral', 'None'], ans: 1 },
          { q: 'Symbol for Oxygen?', opts: ['Ox', 'O', 'On', 'Og'], ans: 1 },
        ]}},
      ]
    },
    {
      id: 'g-his', name: 'History', icon: '🏛️', color: 'from-amber-600 to-orange-700',
      description: 'Ancient civilizations to modern India',
      lessons: [
        { id: 'g-h-l1', title: 'Ancient India', subtopics: [
          { id: 'g-h-l1-s1', title: 'Indus Valley Civilization', content: 'One of the oldest civilizations. Cities like Mohenjo-daro had planned streets, drainage systems.', duration: '25 min' },
          { id: 'g-h-l1-s2', title: 'Vedic Period', content: 'Period of the Vedas. Society was organized into varnas. Sanskrit was the language.', duration: '25 min' },
        ], quiz: { questions: [
          { q: 'Mohenjo-daro is from which civilization?', opts: ['Egyptian', 'Roman', 'Indus Valley', 'Chinese'], ans: 2 },
          { q: 'Language of the Vedas?', opts: ['Hindi', 'Tamil', 'Sanskrit', 'Pali'], ans: 2 },
        ]}},
      ]
    },
  ],

  mastery: [
    {
      id: 'm-phy', name: 'Physics', icon: '⚡', color: 'from-orange-500 to-red-600',
      description: 'Mechanics, electromagnetism & waves',
      lessons: [
        { id: 'm-p-l1', title: 'Kinematics', subtopics: [
          { id: 'm-p-l1-s1', title: 'Motion in 1D', content: 'Equations: v = u + at, s = ut + ½at², v² = u² + 2as. These describe uniformly accelerated motion.', duration: '35 min' },
          { id: 'm-p-l1-s2', title: 'Projectile Motion', content: 'Object launched at angle θ. Range R = u²sin2θ/g. Max height H = u²sin²θ/2g.', duration: '35 min' },
          { id: 'm-p-l1-s3', title: 'Relative Motion', content: 'Velocity of A relative to B: V_AB = V_A - V_B. Frame of reference matters.', duration: '30 min' },
        ], quiz: { questions: [
          { q: 'An object in free fall has acceleration?', opts: ['0 m/s²', '9.8 m/s²', '10.8 m/s²', 'Variable'], ans: 1 },
          { q: 'Range is maximum at what angle?', opts: ['30°', '45°', '60°', '90°'], ans: 1 },
          { q: 'v = u + at is valid for?', opts: ['Circular motion', 'Uniform acceleration', 'Variable acceleration', 'No motion'], ans: 1 },
        ]}},
        { id: 'm-p-l2', title: 'Laws of Motion', subtopics: [
          { id: 'm-p-l2-s1', title: "Newton's Laws Deep Dive", content: 'F_net = ma applies to system of particles. Free body diagrams help resolve forces.', duration: '35 min' },
          { id: 'm-p-l2-s2', title: 'Friction', content: 'Static friction ≤ μₛN. Kinetic friction = μₖN. μₛ > μₖ always.', duration: '30 min' },
          { id: 'm-p-l2-s3', title: 'Circular Motion', content: 'Centripetal force = mv²/r. It acts toward center. Banking of roads reduces friction need.', duration: '30 min' },
        ], quiz: { questions: [
          { q: 'Centripetal force direction?', opts: ['Outward', 'Tangential', 'Toward center', 'Upward'], ans: 2 },
          { q: 'Which friction is larger?', opts: ['Kinetic', 'Static', 'Both equal', 'Neither'], ans: 1 },
        ]}},
        { id: 'm-p-l3', title: 'Work, Energy & Power', subtopics: [
          { id: 'm-p-l3-s1', title: 'Work-Energy Theorem', content: 'Net work = ΔKE. W = Fd cosθ. Work done by gravity = mgh.', duration: '30 min' },
          { id: 'm-p-l3-s2', title: 'Conservation of Energy', content: 'Total energy in isolated system is constant. KE + PE = constant.', duration: '30 min' },
        ], quiz: { questions: [
          { q: 'Unit of work?', opts: ['Newton', 'Joule', 'Watt', 'Pascal'], ans: 1 },
          { q: 'Power = ?', opts: ['Work × Time', 'Work / Time', 'Force × Time', 'Energy × Time'], ans: 1 },
        ]}},
      ]
    },
    {
      id: 'm-chem', name: 'Chemistry', icon: '🧪', color: 'from-green-600 to-cyan-700',
      description: 'Organic, inorganic & physical chemistry',
      lessons: [
        { id: 'm-c-l1', title: 'Atomic Structure', subtopics: [
          { id: 'm-c-l1-s1', title: 'Quantum Numbers', content: 'n (principal), l (azimuthal), m (magnetic), s (spin). They define electron position.', duration: '35 min' },
          { id: 'm-c-l1-s2', title: 'Electronic Configuration', content: 'Follow Aufbau principle, Pauli exclusion, Hund rule. E.g., Carbon: 1s² 2s² 2p².', duration: '30 min' },
        ], quiz: { questions: [
          { q: 'How many quantum numbers?', opts: ['2', '3', '4', '5'], ans: 2 },
          { q: 'Max electrons in n=2?', opts: ['2', '4', '8', '18'], ans: 2 },
        ]}},
        { id: 'm-c-l2', title: 'Chemical Bonding', subtopics: [
          { id: 'm-c-l2-s1', title: 'Ionic Bonds', content: 'Transfer of electrons. Metal + Non-metal. NaCl: Na gives e⁻ to Cl.', duration: '30 min' },
          { id: 'm-c-l2-s2', title: 'Covalent Bonds', content: 'Sharing of electrons. H₂O: O shares electrons with 2 H atoms.', duration: '30 min' },
          { id: 'm-c-l2-s3', title: 'VSEPR Theory', content: 'Predicts molecular geometry. Linear, trigonal planar, tetrahedral shapes.', duration: '30 min' },
        ], quiz: { questions: [
          { q: 'NaCl has which bond?', opts: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], ans: 1 },
          { q: 'Shape of CH₄?', opts: ['Linear', 'Trigonal', 'Tetrahedral', 'Octahedral'], ans: 2 },
        ]}},
      ]
    },
    {
      id: 'm-math', name: 'Mathematics', icon: '∫', color: 'from-indigo-600 to-blue-800',
      description: 'Calculus, trigonometry & advanced algebra',
      lessons: [
        { id: 'm-m-l1', title: 'Trigonometry', subtopics: [
          { id: 'm-m-l1-s1', title: 'Ratios & Identities', content: 'sin²θ + cos²θ = 1. tan θ = sinθ/cosθ. Learn all compound angle formulas.', duration: '35 min' },
          { id: 'm-m-l1-s2', title: 'Inverse Trigonometry', content: 'sin⁻¹, cos⁻¹, tan⁻¹ functions. Their domains and ranges.', duration: '30 min' },
        ], quiz: { questions: [
          { q: 'sin²θ + cos²θ = ?', opts: ['0', '1', '2', 'sinθ'], ans: 1 },
          { q: 'tan 45° = ?', opts: ['0', '0.5', '1', '√3'], ans: 2 },
        ]}},
        { id: 'm-m-l2', title: 'Calculus', subtopics: [
          { id: 'm-m-l2-s1', title: 'Limits & Continuity', content: 'Limit is the value a function approaches. A function is continuous if limit exists and equals f(a).', duration: '35 min' },
          { id: 'm-m-l2-s2', title: 'Derivatives', content: 'd/dx(xⁿ) = nxⁿ⁻¹. Chain rule: d/dx[f(g(x))] = f\'(g(x))·g\'(x).', duration: '40 min' },
          { id: 'm-m-l2-s3', title: 'Integration', content: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C. Integration is reverse of differentiation.', duration: '40 min' },
        ], quiz: { questions: [
          { q: 'd/dx(x³) = ?', opts: ['x²', '3x²', '3x³', 'x³'], ans: 1 },
          { q: '∫2x dx = ?', opts: ['2x + C', 'x² + C', '2x²', 'x + C'], ans: 1 },
        ]}},
      ]
    },
    {
      id: 'm-eng', name: 'English', icon: '✍️', color: 'from-rose-500 to-pink-700',
      description: 'Literature, writing & communication',
      lessons: [
        { id: 'm-e-l1', title: 'Essay Writing', subtopics: [
          { id: 'm-e-l1-s1', title: 'Structure & Planning', content: 'Introduction (hook + thesis), Body (3 paragraphs with evidence), Conclusion (restate + insight).', duration: '30 min' },
          { id: 'm-e-l1-s2', title: 'Argumentative Essays', content: 'Present claim, provide evidence, address counterarguments, conclude with impact.', duration: '35 min' },
        ], quiz: { questions: [
          { q: 'An essay intro should have?', opts: ['Only facts', 'Hook + thesis', 'Conclusion', 'References'], ans: 1 },
          { q: 'Argumentative essays need?', opts: ['Only opinion', 'Evidence', 'Poetry', 'Dialogue'], ans: 1 },
        ]}},
      ]
    },
  ],
};
