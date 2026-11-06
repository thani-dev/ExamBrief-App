import { Subject, Task, DailyRhythmItem, StudySession, UserProfile } from '../types';

export const defaultProfile: UserProfile = {
  name: 'Student',
  semester: 'Semester 3 • CSE',
  examinationPeriod: 'November 2026',
  dailyTargetHours: 5.0,
};

export const defaultSubjects: Subject[] = [
  {
    id: 'subj-1',
    name: 'Probability and Statistics',
    code: 'MA301',
    category: 'MATHEMATICAL FOUNDATION',
    examDate: '2026-11-13',
    examTime: '09:30 AM – 12:30 PM',
    hall: 'Hall 4B',
    accentColor: '#8AB4F8',
    units: [
      {
        id: 'u-1-1',
        subjectId: 'subj-1',
        number: 1,
        title: 'Random Variables & Probability Distributions',
        topics: [
          {
            id: 'top-1-1-1',
            unitId: 'u-1-1',
            subjectId: 'subj-1',
            topicNumber: '1.1',
            title: 'Discrete & Continuous Probability Density Functions',
            status: 'completed',
            estimatedWeight: '8 Marks (Core Foundation)',
            overview: 'Probability density function (PDF) and cumulative distribution function (CDF) establish the foundation for mapping continuous sample spaces to probabilistic bounds.',
            definitions: [
              'Probability Density Function: A function f(x) >= 0 where integral from -inf to +inf f(x)dx = 1.',
              'Cumulative Distribution Function: F(x) = P(X <= x) = integral -inf to x f(t)dt.'
            ],
            formulas: [
              {
                id: 'f-1',
                title: 'Expectation Formula',
                equation: 'E[X] = \\int_{-\\infty}^{\\infty} x f(x) dx',
                note: 'For continuous random variables'
              },
              {
                id: 'f-2',
                title: 'Variance Formula',
                equation: 'Var(X) = E[X^2] - (E[X])^2 = \\sigma^2',
                note: 'Spread around the mean'
              }
            ],
            keywords: ['PDF', 'CDF', 'Expectation', 'Variance', 'Moment Generating Function'],
            questions: [
              {
                id: 'q-1',
                title: 'Derive the mean and variance of a Uniform distribution in the interval (a, b).',
                marks: '6M',
                examPaper: 'Dec 2024 End-Sem Exam'
              }
            ],
            attachments: [
              {
                id: 'att-1',
                title: 'Distribution_Curves_CheatSheet.png',
                type: 'diagram',
                size: '520 KB',
                date: '2026-11-01',
                summary: 'Visual bell curves for Normal, Exponential and Poisson distributions'
              }
            ],
            totalStudySeconds: 5400,
            lastStudiedAt: '2026-11-04T14:30:00Z',
            createdAt: '2026-10-20T10:00:00Z'
          },
          {
            id: 'top-1-1-2',
            unitId: 'u-1-1',
            subjectId: 'subj-1',
            topicNumber: '1.2',
            title: 'Binomial, Poisson & Normal Distributions',
            status: 'completed',
            estimatedWeight: '10 Marks (High Yield)',
            overview: 'Binomial distribution models binary trials; Poisson approximates rare occurrences; Normal distribution governs sums of random variables per Central Limit Theorem.',
            definitions: [
              'Poisson Approximation: When n -> inf and p -> 0 such that lambda = np remains constant.',
              'Standard Normal Z-Score: Z = (X - mu) / sigma with standard mean 0 and variance 1.'
            ],
            formulas: [
              {
                id: 'f-3',
                title: 'Poisson Probability Mass Function',
                equation: 'P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}',
                note: 'lambda = average rate of occurrences'
              },
              {
                id: 'f-4',
                title: 'Normal Distribution PDF',
                equation: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
                note: 'Gaussian distribution curve'
              }
            ],
            keywords: ['Poisson Law', 'Gaussian Bell Curve', 'Standard Normal', 'Skewness', 'Kurtosis'],
            questions: [
              {
                id: 'q-2',
                title: 'If 3% of bulbs manufactured are defective, find the probability that a sample of 100 bulbs contains exactly 2 defectives using Poisson approximation.',
                marks: '8M',
                examPaper: 'Dec 2023 End-Sem Exam'
              }
            ],
            attachments: [],
            totalStudySeconds: 7200,
            lastStudiedAt: '2026-11-04T17:15:00Z',
            createdAt: '2026-10-20T10:00:00Z'
          },
          {
            id: 'top-1-1-3',
            unitId: 'u-1-1',
            subjectId: 'subj-1',
            topicNumber: '1.3',
            title: 'Joint Distributions, Covariance & Correlation',
            status: 'revision',
            estimatedWeight: '10 Marks (End-Sem High Yield)',
            overview: 'Joint distributions examine simultaneous outcomes of two or more random variables, quantifying dependency through covariance and Pearson correlation coefficient.',
            definitions: [
              'Marginal Probability Density: f_X(x) = \\int_{-\\infty}^{\\infty} f(x, y) dy.',
              'Independence: X and Y are independent iff f(x, y) = f_X(x) * f_Y(y).'
            ],
            formulas: [
              {
                id: 'f-5',
                title: 'Covariance Formula',
                equation: 'Cov(X, Y) = E[XY] - E[X]E[Y]',
                note: 'Measures directional association'
              },
              {
                id: 'f-6',
                title: 'Pearson Correlation Coefficient',
                equation: '\\rho(X, Y) = \\frac{Cov(X, Y)}{\\sigma_X \\sigma_Y}',
                note: 'Bounds: -1 <= rho <= 1'
              }
            ],
            keywords: ['Joint PDF', 'Marginal PDF', 'Conditional Expectation', 'Covariance', 'Pearson r'],
            questions: [
              {
                id: 'q-3',
                title: 'Given f(x, y) = c(x + 2y) for 0 < x < 1, 0 < y < 1. Find constant c, marginal distributions, and Cov(X, Y).',
                marks: '10M Priority',
                examPaper: 'Dec 2024 End-Sem Exam'
              }
            ],
            attachments: [
              {
                id: 'att-2',
                title: 'Joint_Distribution_Integration_Grid.pdf',
                type: 'pdf',
                size: '1.2 MB',
                date: '2026-11-02',
                summary: 'Limits of double integration for conditional regions'
              }
            ],
            totalStudySeconds: 4800,
            lastStudiedAt: '2026-11-05T09:00:00Z',
            createdAt: '2026-10-20T10:00:00Z'
          }
        ]
      },
      {
        id: 'u-1-2',
        subjectId: 'subj-1',
        number: 2,
        title: 'Sampling Theory & Central Limit Theorem',
        topics: [
          {
            id: 'top-1-2-1',
            unitId: 'u-1-2',
            subjectId: 'subj-1',
            topicNumber: '2.1',
            title: 'Central Limit Theorem & Sampling Distributions',
            status: 'learning',
            estimatedWeight: '7 Marks',
            overview: 'States that sample means approximate a normal distribution as sample size grows, regardless of the underlying population distribution.',
            definitions: [
              'Standard Error of the Mean: SE = sigma / sqrt(n).'
            ],
            formulas: [
              {
                id: 'f-7',
                title: 'CLT Sample Mean Z-Statistic',
                equation: 'Z = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}',
                note: 'Applicable when n >= 30'
              }
            ],
            keywords: ['CLT', 'Standard Error', 'Sample Variance', 'Unbiased Estimator'],
            questions: [
              {
                id: 'q-4',
                title: 'Explain Central Limit Theorem and its significance in hypothesis testing.',
                marks: '5M',
                examPaper: 'Dec 2023 End-Sem Exam'
              }
            ],
            attachments: [],
            totalStudySeconds: 2700,
            lastStudiedAt: '2026-11-03T11:00:00Z',
            createdAt: '2026-10-20T10:00:00Z'
          },
          {
            id: 'top-1-2-2',
            unitId: 'u-1-2',
            subjectId: 'subj-1',
            topicNumber: '2.2',
            title: 'Testing of Hypothesis: Large Samples (Z-Test)',
            status: 'learning',
            estimatedWeight: '8 Marks',
            overview: 'Formulation of null hypothesis H0 versus alternative H1, critical regions, alpha levels, and tests for single mean and difference of two means.',
            definitions: [
              'Type I Error (alpha): Rejecting H0 when it is true.',
              'Type II Error (beta): Failing to reject H0 when it is false.'
            ],
            formulas: [
              {
                id: 'f-8',
                title: 'Two Sample Means Z-Test',
                equation: 'Z = \\frac{\\bar{X}_1 - \\bar{X}_2}{\\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}}',
                note: 'Critical value at 5% level = 1.96'
              }
            ],
            keywords: ['Null Hypothesis', 'Alternative Hypothesis', 'Critical Region', 'P-value', 'Two-tailed Test'],
            questions: [
              {
                id: 'q-5',
                title: 'Two random samples of sizes 900 and 1600 are taken from two populations with mean 67.5 and 68.0. Test if the means differ significantly at 5% significance level.',
                marks: '8M',
                examPaper: 'Dec 2022 End-Sem Exam'
              }
            ],
            attachments: [],
            totalStudySeconds: 3100,
            createdAt: '2026-10-20T10:00:00Z'
          }
        ]
      },
      {
        id: 'u-1-3',
        subjectId: 'subj-1',
        number: 3,
        title: 'Small Sample Tests (t-Test, F-Test, Chi-Square)',
        topics: [
          {
            id: 'top-1-3-1',
            unitId: 'u-1-3',
            subjectId: 'subj-1',
            topicNumber: '3.1',
            title: "Student's t-Test for Single Mean & Paired t-Test",
            status: 'not-started',
            estimatedWeight: '8 Marks',
            overview: 'Employed when population variance is unknown and sample size n < 30 with (n-1) degrees of freedom.',
            definitions: ['Degrees of Freedom: df = n - 1 for one sample t-test.'],
            formulas: [
              {
                id: 'f-9',
                title: 'Student t-Statistic',
                equation: 't = \\frac{\\bar{x} - \\mu}{s / \\sqrt{n}}',
                note: 'where s is sample standard deviation'
              }
            ],
            keywords: ['t-Test', 'Paired t-Test', 'Degrees of Freedom'],
            questions: [],
            attachments: [],
            totalStudySeconds: 0,
            createdAt: '2026-10-20T10:00:00Z'
          },
          {
            id: 'top-1-3-2',
            unitId: 'u-1-3',
            subjectId: 'subj-1',
            topicNumber: '3.2',
            title: 'Chi-Square Test: Goodness of Fit & Independence of Attributes',
            status: 'not-started',
            estimatedWeight: '10 Marks',
            overview: 'Contingency tables, observed vs expected frequencies, Yates correction for continuity.',
            definitions: ['Chi-Square: Sum of ((O - E)^2 / E).'],
            formulas: [
              {
                id: 'f-10',
                title: 'Chi-Square Test Formula',
                equation: '\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i}',
                note: 'df = (r - 1)(c - 1)'
              }
            ],
            keywords: ['Chi-Square', 'Contingency Table', 'Goodness of Fit'],
            questions: [],
            attachments: [],
            totalStudySeconds: 0,
            createdAt: '2026-10-20T10:00:00Z'
          }
        ]
      },
      {
        id: 'u-1-4',
        subjectId: 'subj-1',
        number: 4,
        title: 'Curve Fitting & Linear Regression Analysis',
        topics: [
          {
            id: 'top-1-4-1',
            unitId: 'u-1-4',
            subjectId: 'subj-1',
            topicNumber: '4.1',
            title: 'Method of Least Squares (Straight Line & Parabola)',
            status: 'not-started',
            estimatedWeight: '8 Marks',
            overview: 'Minimizing sum of squared residuals to estimate parameters for y = a + bx and y = a + bx + cx^2.',
            definitions: [],
            formulas: [
              {
                id: 'f-11',
                title: 'Normal Equations for Straight Line',
                equation: '\\sum y = na + b\\sum x \\quad ; \\quad \\sum xy = a\\sum x + b\\sum x^2'
              }
            ],
            keywords: ['Least Squares', 'Normal Equations', 'Regression Lines'],
            questions: [],
            attachments: [],
            totalStudySeconds: 0,
            createdAt: '2026-10-20T10:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'subj-2',
    name: 'Embedded Systems Architecture and Interfacing (ESAI)',
    code: 'CS302',
    category: 'HARDWARE & SYSTEMS',
    examDate: '2026-11-18',
    examTime: '09:30 AM – 12:30 PM',
    hall: 'Hall 2A',
    accentColor: '#A78BFA',
    units: [
      {
        id: 'u-2-1',
        subjectId: 'subj-2',
        number: 1,
        title: 'ARM Cortex-M Architecture & Programming Model',
        topics: [
          {
            id: 'top-2-1-1',
            unitId: 'u-2-1',
            subjectId: 'subj-2',
            topicNumber: '1.1',
            title: 'Cortex-M Core Architecture, Registers & Operating Modes',
            status: 'completed',
            estimatedWeight: '8 Marks',
            overview: 'Harvard architecture, 3-stage pipeline, Thread vs Handler modes, MSP vs PSP stack pointers, and Thumb-2 instruction set.',
            definitions: [
              'Thread Mode: Execution mode for user level application code.',
              'Handler Mode: Privileged execution mode entered during interrupts and exceptions.'
            ],
            formulas: [],
            keywords: ['Cortex-M4', 'Thumb-2', 'MSP', 'PSP', 'Handler Mode', 'NVIC'],
            questions: [
              {
                id: 'q-6',
                title: 'Compare ARM Harvard vs Princeton architecture and explain Cortex-M register organization.',
                marks: '7M',
                examPaper: 'Dec 2024 End-Sem Exam'
              }
            ],
            attachments: [],
            totalStudySeconds: 4200,
            createdAt: '2026-10-21T10:00:00Z'
          },
          {
            id: 'top-2-1-2',
            unitId: 'u-2-1',
            subjectId: 'subj-2',
            topicNumber: '1.2',
            title: 'Nested Vectored Interrupt Controller (NVIC) & Priority Grouping',
            status: 'learning',
            estimatedWeight: '10 Marks (High Yield)',
            overview: 'Low-latency interrupt handling, tail-chaining, preemption priorities, sub-priorities, and late-arrival optimizations.',
            definitions: [
              'Tail Chaining: Mechanism where processor handles back-to-back interrupts without unstacking and restacking state.'
            ],
            formulas: [],
            keywords: ['NVIC', 'Tail-Chaining', 'Late Arrival', 'Interrupt Vector Table'],
            questions: [],
            attachments: [],
            totalStudySeconds: 2400,
            createdAt: '2026-10-21T10:00:00Z'
          }
        ]
      },
      {
        id: 'u-2-2',
        subjectId: 'subj-2',
        number: 2,
        title: 'Bus Protocols & Serial Communication Interfaces',
        topics: [
          {
            id: 'top-2-2-1',
            unitId: 'u-2-2',
            subjectId: 'subj-2',
            topicNumber: '2.1',
            title: 'I2C, SPI & UART Protocol Architecture and Timing',
            status: 'learning',
            estimatedWeight: '10 Marks',
            overview: 'Two-wire synchronous I2C with clock stretching and ACK/NACK, full-duplex 4-wire SPI with chip selects, asynchronous UART with parity and baud rates.',
            definitions: [],
            formulas: [
              {
                id: 'f-12',
                title: 'UART Baud Rate Divisor',
                equation: 'BRR = \\frac{f_{PCLK}}{16 \\times BaudRate}',
                note: 'Clock prescaler calculation'
              }
            ],
            keywords: ['I2C', 'SPI', 'UART', 'Start Condition', 'Clock Stretching'],
            questions: [],
            attachments: [],
            totalStudySeconds: 3600,
            createdAt: '2026-10-21T10:00:00Z'
          }
        ]
      },
      {
        id: 'u-2-3',
        subjectId: 'subj-2',
        number: 3,
        title: 'Sensor Interfacing & ADC/DAC Signal Conditioning',
        topics: [
          {
            id: 'top-2-3-1',
            unitId: 'u-2-3',
            subjectId: 'subj-2',
            topicNumber: '3.1',
            title: 'Successive Approximation ADC & DMA Data Transfer',
            status: 'not-started',
            estimatedWeight: '8 Marks',
            overview: 'ADC resolution, sampling rate, SAR logic, direct memory access channels to eliminate CPU overhead.',
            definitions: [],
            formulas: [],
            keywords: ['SAR ADC', 'DMA', 'Quantization Error', 'Nyquist Rate'],
            questions: [],
            attachments: [],
            totalStudySeconds: 0,
            createdAt: '2026-10-21T10:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'subj-3',
    name: 'Automata and Compiler Design',
    code: 'CS303',
    category: 'CORE THEORY',
    examDate: '2026-11-20',
    examTime: '09:30 AM – 12:30 PM',
    hall: 'Hall 3C',
    accentColor: '#72C99A',
    units: [
      {
        id: 'u-3-1',
        subjectId: 'subj-3',
        number: 1,
        title: 'Finite Automata & Lexical Analysis',
        topics: [
          {
            id: 'top-3-1-1',
            unitId: 'u-3-1',
            subjectId: 'subj-3',
            topicNumber: '1.1',
            title: 'DFA, NFA Equivalence & Subset Construction Algorithm',
            status: 'completed',
            estimatedWeight: '10 Marks',
            overview: 'Formal definition of 5-tuple finite state automata. Powerset construction for NFA to DFA conversion and DFA state minimization via partition algorithm.',
            definitions: [
              'DFA: M = (Q, Sigma, delta, q0, F) where delta: Q x Sigma -> Q is deterministic.'
            ],
            formulas: [],
            keywords: ['DFA', 'NFA', 'Epsilon-Closure', 'Myhill-Nerode', 'Minimization'],
            questions: [
              {
                id: 'q-7',
                title: 'Convert given NFA with epsilon transitions into an equivalent minimum-state DFA.',
                marks: '10M',
                examPaper: 'Dec 2024 End-Sem Exam'
              }
            ],
            attachments: [],
            totalStudySeconds: 5100,
            createdAt: '2026-10-22T10:00:00Z'
          },
          {
            id: 'top-3-1-2',
            unitId: 'u-3-1',
            subjectId: 'subj-3',
            topicNumber: '1.2',
            title: 'Lexical Analyzer Generator (LEX/FLEX) & Input Buffering',
            status: 'revision',
            estimatedWeight: '6 Marks',
            overview: 'Tokenization, lexeme recognition, pair of buffers scheme, sentinels, and LEX specification rules.',
            definitions: [],
            formulas: [],
            keywords: ['Token', 'Lexeme', 'Buffer Pairs', 'Sentinels', 'Regular Expressions'],
            questions: [],
            attachments: [],
            totalStudySeconds: 3200,
            createdAt: '2026-10-22T10:00:00Z'
          }
        ]
      },
      {
        id: 'u-3-2',
        subjectId: 'subj-3',
        number: 2,
        title: 'Syntax Analysis & Parsing Algorithms',
        topics: [
          {
            id: 'top-3-2-1',
            unitId: 'u-3-2',
            subjectId: 'subj-3',
            topicNumber: '2.1',
            title: 'Top-Down Parsing: LL(1) Grammars, FIRST & FOLLOW Computation',
            status: 'completed',
            estimatedWeight: '10 Marks (High Yield)',
            overview: 'Elimination of left recursion, left factoring, computation of FIRST and FOLLOW sets, non-recursive predictive parsing table construction.',
            definitions: [
              'LL(1) Condition: For every production A -> alpha | beta, FIRST(alpha) and FIRST(beta) are disjoint, and if epsilon in FIRST(alpha), FIRST(beta) and FOLLOW(A) are disjoint.'
            ],
            formulas: [],
            keywords: ['LL(1)', 'FIRST', 'FOLLOW', 'Left Recursion', 'Predictive Parsing Table'],
            questions: [],
            attachments: [],
            totalStudySeconds: 4500,
            createdAt: '2026-10-22T10:00:00Z'
          },
          {
            id: 'top-3-2-2',
            unitId: 'u-3-2',
            subjectId: 'subj-3',
            topicNumber: '2.2',
            title: 'Bottom-Up Parsing: SLR(1), CLR(1) & LALR(1) Parsers',
            status: 'learning',
            estimatedWeight: '10 Marks',
            overview: 'Shift-reduce parsing, handles, viable prefixes, LR(0) items, augmented grammars, conflict resolution (Shift/Reduce, Reduce/Reduce).',
            definitions: [],
            formulas: [],
            keywords: ['Shift-Reduce', 'SLR(1)', 'LALR(1)', 'CLR(1)', 'Items Collection', 'GOTO Table'],
            questions: [],
            attachments: [],
            totalStudySeconds: 2900,
            createdAt: '2026-10-22T10:00:00Z'
          }
        ]
      },
      {
        id: 'u-3-3',
        subjectId: 'subj-3',
        number: 3,
        title: 'Syntax Directed Translation & Intermediate Code Generation',
        topics: [
          {
            id: 'top-3-3-1',
            unitId: 'u-3-3',
            subjectId: 'subj-3',
            topicNumber: '3.1',
            title: 'Three-Address Code (Quadruples, Triples, Indirect Triples)',
            status: 'not-started',
            estimatedWeight: '8 Marks',
            overview: 'SDDs, S-attributed and L-attributed definitions, translation of boolean expressions and control structures into TAC.',
            definitions: [],
            formulas: [],
            keywords: ['Three-Address Code', 'Quadruples', 'Triples', 'Backpatching'],
            questions: [],
            attachments: [],
            totalStudySeconds: 0,
            createdAt: '2026-10-22T10:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'subj-4',
    name: 'Computer Networks',
    code: 'CS304',
    category: 'NETWORKING & PROTOCOLS',
    examDate: '2026-11-23',
    examTime: '09:30 AM – 12:30 PM',
    hall: 'Hall 4A',
    accentColor: '#8AB4F8',
    units: [
      {
        id: 'u-4-1',
        subjectId: 'subj-4',
        number: 1,
        title: 'Physical & Data Link Layers',
        topics: [
          {
            id: 'top-4-1-1',
            unitId: 'u-4-1',
            subjectId: 'subj-4',
            topicNumber: '1.1',
            title: 'Framing, Error Detection (CRC) & Hamming Code',
            status: 'completed',
            estimatedWeight: '8 Marks',
            overview: 'Bit and byte stuffing, polynomial division cyclic redundancy checks, Hamming distance, 1-bit error correction formula.',
            definitions: [
              'Hamming Rule: 2^r >= m + r + 1 to detect and correct single bit errors.'
            ],
            formulas: [
              {
                id: 'f-13',
                title: 'Hamming Redundancy Inequality',
                equation: '2^r \\ge m + r + 1',
                note: 'm = data bits, r = parity bits'
              }
            ],
            keywords: ['CRC', 'Hamming Code', 'Bit Stuffing', 'Polynomial Division'],
            questions: [],
            attachments: [],
            totalStudySeconds: 3800,
            createdAt: '2026-10-23T10:00:00Z'
          },
          {
            id: 'top-4-1-2',
            unitId: 'u-4-1',
            subjectId: 'subj-4',
            topicNumber: '1.2',
            title: 'Sliding Window Protocols: Go-Back-N & Selective Repeat',
            status: 'completed',
            estimatedWeight: '10 Marks',
            overview: 'Window sizes, efficiency, piggybacking, timer management, receiver buffer requirements.',
            definitions: [],
            formulas: [
              {
                id: 'f-14',
                title: 'Efficiency of Go-Back-N',
                equation: '\\eta = \\frac{W}{1 + 2a} \\quad \\text{where } a = \\frac{T_{prop}}{T_{trans}}'
              }
            ],
            keywords: ['Go-Back-N', 'Selective Repeat', 'Window Size', 'Piggybacking'],
            questions: [],
            attachments: [],
            totalStudySeconds: 4200,
            createdAt: '2026-10-23T10:00:00Z'
          }
        ]
      },
      {
        id: 'u-4-2',
        subjectId: 'subj-4',
        number: 2,
        title: 'Network Layer & Routing Protocols',
        topics: [
          {
            id: 'top-4-2-1',
            unitId: 'u-4-2',
            subjectId: 'subj-4',
            topicNumber: '2.1',
            title: 'IPv4 Addressing, Subnetting & CIDR Notation',
            status: 'revision',
            estimatedWeight: '10 Marks (High Yield)',
            overview: 'Classless Inter-Domain Routing, subnet mask calculation, supernetting, VLSM allocation algorithms.',
            definitions: [],
            formulas: [],
            keywords: ['CIDR', 'Subnet Mask', 'VLSM', 'Network ID', 'Broadcast Address'],
            questions: [],
            attachments: [],
            totalStudySeconds: 3900,
            createdAt: '2026-10-23T10:00:00Z'
          },
          {
            id: 'top-4-2-2',
            unitId: 'u-4-2',
            subjectId: 'subj-4',
            topicNumber: '2.2',
            title: 'Distance Vector (Bellman-Ford) & Link State (Dijkstra) Routing',
            status: 'learning',
            estimatedWeight: '10 Marks',
            overview: 'Routing Information Protocol (RIP), Count-to-Infinity problem and solutions (Split Horizon, Poison Reverse), Open Shortest Path First (OSPF).',
            definitions: [],
            formulas: [],
            keywords: ['Bellman-Ford', 'Dijkstra', 'Count-to-Infinity', 'Split Horizon', 'OSPF', 'BGP'],
            questions: [],
            attachments: [],
            totalStudySeconds: 2600,
            createdAt: '2026-10-23T10:00:00Z'
          }
        ]
      },
      {
        id: 'u-4-3',
        subjectId: 'subj-4',
        number: 3,
        title: 'Transport Layer Protocols',
        topics: [
          {
            id: 'top-4-3-1',
            unitId: 'u-4-3',
            subjectId: 'subj-4',
            topicNumber: '3.1',
            title: 'TCP 3-Way Handshake, Connection Teardown & State Transition',
            status: 'learning',
            estimatedWeight: '8 Marks',
            overview: 'SYN, SYN-ACK, ACK sequence numbers, TIME_WAIT state, FIN sequence, socket terminations.',
            definitions: [],
            formulas: [],
            keywords: ['SYN', 'ACK', 'FIN', 'TIME_WAIT', '3-Way Handshake'],
            questions: [],
            attachments: [],
            totalStudySeconds: 2100,
            createdAt: '2026-10-23T10:00:00Z'
          },
          {
            id: 'top-4-3-2',
            unitId: 'u-4-3',
            subjectId: 'subj-4',
            topicNumber: '3.2',
            title: 'TCP Congestion Control (Slow Start, Congestion Avoidance, Fast Retransmit)',
            status: 'not-started',
            estimatedWeight: '10 Marks',
            overview: 'AIMD mechanism, cwnd and ssthresh thresholds, triple duplicate ACKs handling.',
            definitions: [],
            formulas: [],
            keywords: ['Slow Start', 'Congestion Avoidance', 'AIMD', 'ssthresh', 'Fast Recovery'],
            questions: [],
            attachments: [],
            totalStudySeconds: 0,
            createdAt: '2026-10-23T10:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'subj-5',
    name: 'Design and Analysis of Algorithms (DAA)',
    code: 'CS305',
    category: 'ALGORITHMS & COMPUTATION',
    examDate: '2026-11-25',
    examTime: '09:30 AM – 12:30 PM',
    hall: 'Hall 1B',
    accentColor: '#A78BFA',
    units: [
      {
        id: 'u-5-1',
        subjectId: 'subj-5',
        number: 1,
        title: 'Asymptotic Analysis & Divide and Conquer',
        topics: [
          {
            id: 'top-5-1-1',
            unitId: 'u-5-1',
            subjectId: 'subj-5',
            topicNumber: '1.1',
            title: 'Master Theorem for Divide-and-Conquer Recurrences',
            status: 'completed',
            estimatedWeight: '8 Marks',
            overview: 'Solving T(n) = aT(n/b) + f(n) across three cases: polynomial dominance, logarithmic balance, regularity condition.',
            definitions: [],
            formulas: [
              {
                id: 'f-15',
                title: 'Master Theorem Recurrence',
                equation: 'T(n) = aT(n/b) + \\Theta(n^k \\log^p n)',
                note: 'Compare a with b^k'
              }
            ],
            keywords: ['Master Theorem', 'Big-O', 'Omega', 'Theta', 'Recurrence Trees'],
            questions: [],
            attachments: [],
            totalStudySeconds: 3600,
            createdAt: '2026-10-24T10:00:00Z'
          }
        ]
      },
      {
        id: 'u-5-2',
        subjectId: 'subj-5',
        number: 2,
        title: 'Dynamic Programming & Greedy Algorithms',
        topics: [
          {
            id: 'top-5-2-1',
            unitId: 'u-5-2',
            subjectId: 'subj-5',
            topicNumber: '2.1',
            title: '0/1 Knapsack & Longest Common Subsequence (LCS)',
            status: 'learning',
            estimatedWeight: '10 Marks (High Yield)',
            overview: 'Optimal substructure and overlapping subproblems. Bottom-up memoization table construction and backtracking for solution recovery.',
            definitions: [],
            formulas: [
              {
                id: 'f-16',
                title: '0/1 Knapsack Recurrence',
                equation: 'K(i, w) = \\max\\{K(i-1, w), K(i-1, w-w_i) + v_i\\}'
              }
            ],
            keywords: ['0/1 Knapsack', 'LCS', 'Memoization', 'Overlapping Subproblems'],
            questions: [],
            attachments: [],
            totalStudySeconds: 3100,
            createdAt: '2026-10-24T10:00:00Z'
          }
        ]
      },
      {
        id: 'u-5-3',
        subjectId: 'subj-5',
        number: 3,
        title: 'Backtracking & Branch and Bound',
        topics: [
          {
            id: 'top-5-3-1',
            unitId: 'u-5-3',
            subjectId: 'subj-5',
            topicNumber: '3.1',
            title: 'N-Queens Problem & Subset Sum Problem',
            status: 'not-started',
            estimatedWeight: '8 Marks',
            overview: 'State space trees, bounding functions, pruning infeasible subtrees, recursive backtracking algorithms.',
            definitions: [],
            formulas: [],
            keywords: ['N-Queens', 'State Space Tree', 'Pruning', 'Bounding Function'],
            questions: [],
            attachments: [],
            totalStudySeconds: 0,
            createdAt: '2026-10-24T10:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'subj-6',
    name: 'Software Engineering and Testing',
    code: 'CS306',
    category: 'SOFTWARE METHODOLOGY',
    examDate: '2026-11-27',
    examTime: '09:30 AM – 12:30 PM',
    hall: 'Hall 3B',
    accentColor: '#72C99A',
    units: [
      {
        id: 'u-6-1',
        subjectId: 'subj-6',
        number: 1,
        title: 'Software Development Life Cycle & Agile Methodologies',
        topics: [
          {
            id: 'top-6-1-1',
            unitId: 'u-6-1',
            subjectId: 'subj-6',
            topicNumber: '1.1',
            title: 'Agile Scrum Framework, Sprint Planning & User Stories',
            status: 'completed',
            estimatedWeight: '8 Marks',
            overview: 'Scrum artifacts (Product Backlog, Sprint Backlog, Increment), roles (Scrum Master, Product Owner, Dev Team), ceremonies (Sprint Review, Retrospective).',
            definitions: [],
            formulas: [],
            keywords: ['Scrum', 'Sprint', 'Product Owner', 'User Story', 'Velocity'],
            questions: [],
            attachments: [],
            totalStudySeconds: 2800,
            createdAt: '2026-10-25T10:00:00Z'
          }
        ]
      },
      {
        id: 'u-6-2',
        subjectId: 'subj-6',
        number: 2,
        title: 'Software Testing Strategies & Test Case Design',
        topics: [
          {
            id: 'top-6-2-1',
            unitId: 'u-6-2',
            subjectId: 'subj-6',
            topicNumber: '2.1',
            title: 'Black-Box vs White-Box Testing (Basis Path & Cyclomatic Complexity)',
            status: 'learning',
            estimatedWeight: '10 Marks (High Yield)',
            overview: 'Equivalence partitioning, boundary value analysis, control flow graphs, McCabe Cyclomatic Complexity V(G) = E - N + 2P.',
            definitions: [
              'Cyclomatic Complexity: Quantitative measure of independent linear execution paths through source code.'
            ],
            formulas: [
              {
                id: 'f-17',
                title: 'McCabe Cyclomatic Complexity',
                equation: 'V(G) = E - N + 2P = P_{pred} + 1',
                note: 'E = edges, N = nodes, P = connected components'
              }
            ],
            keywords: ['Cyclomatic Complexity', 'Basis Path', 'Equivalence Partitioning', 'BVA'],
            questions: [],
            attachments: [],
            totalStudySeconds: 3100,
            createdAt: '2026-10-25T10:00:00Z'
          }
        ]
      }
    ]
  }
];

export const defaultTasks: Task[] = [
  {
    id: 't-1',
    title: 'Solve 5 numericals on Normal & Poisson distributions',
    subjectId: 'subj-1',
    topicId: 'top-1-1-2',
    subjectName: 'Probability and Statistics',
    unitName: 'Unit 1 • Discrete & Continuous Distributions',
    priority: 'urgent',
    dueDate: '2026-11-05',
    dueTime: '04:00 PM',
    completed: true,
    completedAt: '2026-11-05T11:20:00Z'
  },
  {
    id: 't-2',
    title: 'Review ARM Cortex-M NVIC Interrupt Tail-Chaining',
    subjectId: 'subj-2',
    topicId: 'top-2-1-2',
    subjectName: 'Embedded Systems (ESAI)',
    unitName: 'Unit 1 • ARM Cortex-M Architecture',
    priority: 'urgent',
    dueDate: '2026-11-05',
    dueTime: '06:00 PM',
    completed: false
  },
  {
    id: 't-3',
    title: 'Revise TCP 3-way handshake flow and state transitions',
    subjectId: 'subj-4',
    topicId: 'top-4-3-1',
    subjectName: 'Computer Networks',
    unitName: 'Unit 3 • Transport Layer',
    priority: 'high',
    dueDate: '2026-11-05',
    dueTime: '08:30 PM',
    completed: false
  },
  {
    id: 't-4',
    title: 'Practice LL(1) FIRST and FOLLOW table computation problems',
    subjectId: 'subj-3',
    topicId: 'top-3-2-1',
    subjectName: 'Automata & Compiler Design',
    unitName: 'Unit 2 • Syntax Analysis',
    priority: 'normal',
    dueDate: '2026-11-04',
    dueTime: '05:00 PM',
    completed: true,
    completedAt: '2026-11-04T16:45:00Z'
  },
  {
    id: 't-5',
    title: 'Carry forward: Master Theorem 3 cases & edge-case recurrences',
    subjectId: 'subj-5',
    topicId: 'top-5-1-1',
    subjectName: 'DAA',
    unitName: 'Unit 1 • Asymptotic Analysis',
    priority: 'normal',
    dueDate: '2026-11-05',
    completed: false,
    isCarryForward: true
  }
];

export const defaultDailyRhythm: DailyRhythmItem[] = [
  {
    id: 'rhy-1',
    category: 'sleep',
    title: 'Sleep & Recovery',
    plannedTime: '11:30 PM → 06:45 AM',
    actualTime: '11:40 PM → 06:50 AM',
    status: 'logged',
    detail: '7h 10m (Deep rest)'
  },
  {
    id: 'rhy-2',
    category: 'nutrition',
    title: 'Nutritional Reset',
    plannedTime: 'Breakfast 07:30 • Lunch 01:15',
    actualTime: 'Breakfast 07:35 • Lunch 01:20',
    status: 'complete',
    detail: 'Hydrated • High protein'
  },
  {
    id: 'rhy-3',
    category: 'break',
    title: 'Evening Coffee & Light Walk',
    plannedTime: '05:00 PM • in 45m',
    status: 'log_now',
    detail: 'Brain recharge window'
  },
  {
    id: 'rhy-4',
    category: 'winddown',
    title: 'Dinner & Wind Down',
    plannedTime: '08:30 PM (Scheduled)',
    status: 'upcoming',
    detail: 'Formula sheet recall review'
  }
];

export const defaultPastSessions: StudySession[] = [
  {
    id: 'ses-1',
    subjectId: 'subj-1',
    unitId: 'u-1-1',
    topicId: 'top-1-1-3',
    subjectName: 'Probability and Statistics',
    subjectCode: 'MA301',
    unitTitle: 'Unit 1: Random Variables',
    topicTitle: 'Joint Distributions, Covariance & Correlation',
    startTime: '2026-11-05T09:15:00Z',
    endTime: '2026-11-05T10:15:00Z',
    focusDurationSeconds: 3120, // 52 mins focus
    breakDurationSeconds: 480, // 8 mins break
    sessionType: 'topic_study',
    status: 'completed',
    notes: 'Solved 3 double integration problems on conditional expectation'
  },
  {
    id: 'ses-2',
    subjectId: 'subj-2',
    unitId: 'u-2-1',
    topicId: 'top-2-1-2',
    subjectName: 'Embedded Systems (ESAI)',
    subjectCode: 'CS302',
    unitTitle: 'Unit 1: ARM Architecture',
    topicTitle: 'NVIC Priority Grouping & Tail-Chaining',
    startTime: '2026-11-05T10:30:00Z',
    endTime: '2026-11-05T11:20:00Z',
    focusDurationSeconds: 2700, // 45 mins
    breakDurationSeconds: 300,
    sessionType: 'pomodoro',
    status: 'completed',
    pomoCycles: 2,
    notes: 'Completed 2 pomodoro sprints on exception latency'
  },
  {
    id: 'ses-3',
    subjectId: 'subj-3',
    unitId: 'u-3-2',
    topicId: 'top-3-2-1',
    subjectName: 'Automata & Compiler Design',
    subjectCode: 'CS303',
    unitTitle: 'Unit 2: Syntax Analysis',
    topicTitle: 'LL(1) Grammars, FIRST & FOLLOW Computation',
    startTime: '2026-11-04T15:00:00Z',
    endTime: '2026-11-04T16:30:00Z',
    focusDurationSeconds: 4500, // 75 mins
    breakDurationSeconds: 900,
    sessionType: 'topic_study',
    status: 'completed',
    notes: 'Created parsing table for arithmetic expression grammar'
  },
  {
    id: 'ses-4',
    subjectId: 'subj-4',
    unitId: 'u-4-2',
    topicId: 'top-4-2-1',
    subjectName: 'Computer Networks',
    subjectCode: 'CS304',
    unitTitle: 'Unit 2: Network Layer',
    topicTitle: 'IPv4 Addressing, Subnetting & CIDR Notation',
    startTime: '2026-11-04T18:00:00Z',
    endTime: '2026-11-04T19:30:00Z',
    focusDurationSeconds: 4800, // 80 mins
    breakDurationSeconds: 600,
    sessionType: 'problem_solving',
    status: 'completed',
    notes: 'Calculated usable host ranges and broadcast addresses for 4 CIDR subnets'
  },
  {
    id: 'ses-5',
    subjectId: 'subj-5',
    unitId: 'u-5-1',
    topicId: 'top-5-1-1',
    subjectName: 'DAA',
    subjectCode: 'CS305',
    unitTitle: 'Unit 1: Asymptotic Analysis',
    topicTitle: 'Master Theorem for Divide-and-Conquer Recurrences',
    startTime: '2026-11-03T14:00:00Z',
    endTime: '2026-11-03T15:30:00Z',
    focusDurationSeconds: 4200,
    breakDurationSeconds: 600,
    sessionType: 'topic_study',
    status: 'completed'
  },
  {
    id: 'ses-6',
    subjectId: 'subj-1',
    unitId: 'u-1-1',
    topicId: 'top-1-1-2',
    subjectName: 'Probability and Statistics',
    subjectCode: 'MA301',
    unitTitle: 'Unit 1: Random Variables',
    topicTitle: 'Binomial, Poisson & Normal Distributions',
    startTime: '2026-11-02T10:00:00Z',
    endTime: '2026-11-02T11:40:00Z',
    focusDurationSeconds: 5100,
    breakDurationSeconds: 900,
    sessionType: 'topic_study',
    status: 'completed'
  },
  {
    id: 'ses-7',
    subjectId: 'subj-3',
    unitId: 'u-3-1',
    topicId: 'top-3-1-1',
    subjectName: 'Automata & Compiler Design',
    subjectCode: 'CS303',
    unitTitle: 'Unit 1: Finite Automata',
    topicTitle: 'DFA, NFA Equivalence & Subset Construction Algorithm',
    startTime: '2026-11-01T16:00:00Z',
    endTime: '2026-11-01T17:45:00Z',
    focusDurationSeconds: 5400,
    breakDurationSeconds: 900,
    sessionType: 'revision',
    status: 'completed'
  }
];
