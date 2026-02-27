const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: [true, 'Code is required']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['javascript', 'python', 'cpp', 'java', 'typescript']
  },
  interviewMode: {
    type: Boolean,
    default: false
  },
  
  // Static Analysis Results
  staticAnalysis: {
    nestedLoops: { type: Number, default: 0 },
    consoleLogs: { type: Number, default: 0 },
    longFunctions: { type: Number, default: 0 },
    securityRisks: { type: Number, default: 0 },
    poorNaming: { type: Number, default: 0 },
    missingErrorHandling: { type: Number, default: 0 }
  },
  
  // AI Evaluation Scores (0-100)
  scores: {
    codeQuality: { type: Number, min: 0, max: 100 },
    timeComplexity: { type: Number, min: 0, max: 100 },
    spaceComplexity: { type: Number, min: 0, max: 100 },
    security: { type: Number, min: 0, max: 100 },
    readability: { type: Number, min: 0, max: 100 }
  },
  
  // Overall DevScore
  devScore: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // AI Feedback
  feedback: {
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    interviewQuestions: [String],
    detailedAnalysis: String
  },
  
  // Execution Results (if code was run)
  executionResult: {
    success: Boolean,
    output: String,
    error: String,
    executionTime: Number
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
submissionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);
