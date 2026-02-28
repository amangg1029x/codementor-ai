const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Challenge = require('./models/Challenge.js');

dotenv.config();

const challenges = [
  {
    title: "Two Sum",
    description: "Given an array of integers and a target, return indices of two numbers that add up to target.",
    difficulty: "easy",
    category: "arrays",
    starterCode: {
      javascript: "function twoSum(nums, target) {\n  // Your code here\n}",
      python: "def two_sum(nums, target):\n    # Your code here\n    pass",
      cpp: "vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n}"
    },
    hints: [
      "Think about using a hash map",
      "You need O(n) time complexity",
      "Store the complement of each number"
    ],
    expectedComplexity: {
      time: "O(n)",
      space: "O(n)"
    }
  },
  {
    title: "Valid Parentheses",
    description: "Given a string containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "easy",
    category: "strings",
    starterCode: {
      javascript: "function isValid(s) {\n  // Your code here\n}",
      python: "def is_valid(s):\n    # Your code here\n    pass",
      cpp: "bool isValid(string s) {\n    // Your code here\n}"
    },
    hints: [
      "Use a stack data structure",
      "Match opening and closing brackets",
      "Pop from stack when you find a match"
    ],
    expectedComplexity: {
      time: "O(n)",
      space: "O(n)"
    }
  },
  {
    title: "Fibonacci Number",
    description: "Calculate the nth Fibonacci number. F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) for n > 1.",
    difficulty: "easy",
    category: "recursion",
    starterCode: {
      javascript: "function fibonacci(n) {\n  // Your code here\n}",
      python: "def fibonacci(n):\n    # Your code here\n    pass",
      cpp: "int fibonacci(int n) {\n    // Your code here\n}"
    },
    hints: [
      "Can you solve it recursively?",
      "Think about memoization to optimize",
      "Or use iteration for O(n) time"
    ],
    expectedComplexity: {
      time: "O(n)",
      space: "O(1)"
    }
  },
  {
    title: "Reverse Linked List",
    description: "Reverse a singly linked list and return the new head.",
    difficulty: "easy",
    category: "arrays",
    starterCode: {
      javascript: "function reverseList(head) {\n  // Your code here\n}",
      python: "def reverse_list(head):\n    # Your code here\n    pass",
      cpp: "ListNode* reverseList(ListNode* head) {\n    // Your code here\n}"
    },
    hints: [
      "Use three pointers: prev, current, next",
      "Iterate through the list",
      "Change the direction of pointers"
    ],
    expectedComplexity: {
      time: "O(n)",
      space: "O(1)"
    }
  },
  {
    title: "Maximum Subarray",
    description: "Find the contiguous subarray with the largest sum and return its sum.",
    difficulty: "medium",
    category: "dynamic-programming",
    starterCode: {
      javascript: "function maxSubArray(nums) {\n  // Your code here\n}",
      python: "def max_sub_array(nums):\n    # Your code here\n    pass",
      cpp: "int maxSubArray(vector<int>& nums) {\n    // Your code here\n}"
    },
    hints: [
      "Use Kadane's algorithm",
      "Keep track of current and maximum sum",
      "Decide whether to extend or start new subarray"
    ],
    expectedComplexity: {
      time: "O(n)",
      space: "O(1)"
    }
  }
];

async function seedChallenges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('Cleared existing challenges');

    // Insert new challenges
    await Challenge.insertMany(challenges);
    console.log(`✅ Seeded ${challenges.length} challenges`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding challenges:', error);
    process.exit(1);
  }
}

seedChallenges();