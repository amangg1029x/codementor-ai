const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  category: {
    type: String,
    enum: ['arrays', 'strings', 'recursion', 'sorting', 'searching', 'dynamic-programming', 'graphs', 'trees'],
    required: true
  },
  starterCode: {
    javascript: String,
    python: String,
    cpp: String
  },
  hints: [String],
  expectedComplexity: {
    time: String,
    space: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);
