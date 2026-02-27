const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Submission = require('../models/Submission');
const User = require('../models/User');
const staticAnalyzer = require('../utils/staticAnalyzer');
const aiEvaluator = require('../services/aiEvaluator');

// @route   POST /api/submissions/evaluate
// @desc    Submit and evaluate code
// @access  Private
router.post(
  '/evaluate',
  protect,
  [
    body('code').trim().notEmpty().withMessage('Code is required'),
    body('language').isIn(['javascript', 'python', 'cpp', 'java', 'typescript']).withMessage('Invalid language'),
    body('interviewMode').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { code, language, interviewMode = false } = req.body;

      // Step 1: Static Analysis
      let staticAnalysis;
      switch (language) {
        case 'javascript':
        case 'typescript':
          staticAnalysis = staticAnalyzer.analyzeJavaScript(code);
          break;
        case 'python':
          staticAnalysis = staticAnalyzer.analyzePython(code);
          break;
        case 'cpp':
          staticAnalysis = staticAnalyzer.analyzeCpp(code);
          break;
        default:
          staticAnalysis = {
            nestedLoops: 0,
            consoleLogs: 0,
            longFunctions: 0,
            securityRisks: 0,
            poorNaming: 0,
            missingErrorHandling: 0
          };
      }

      // Step 2: AI Evaluation
      const aiEvaluation = await aiEvaluator.evaluateCode(
        code,
        language,
        interviewMode,
        staticAnalysis
      );

      // Step 3: Calculate DevScore
      const staticPenalty = aiEvaluator.calculateStaticPenalty(staticAnalysis);
      const devScore = aiEvaluator.calculateDevScore(aiEvaluation.scores, staticPenalty);

      // Step 4: Create submission record
      const submission = await Submission.create({
        user: req.user._id,
        code,
        language,
        interviewMode,
        staticAnalysis,
        scores: aiEvaluation.scores,
        devScore,
        feedback: aiEvaluation.feedback
      });

      // Step 5: Update user's submission history
      await User.findByIdAndUpdate(req.user._id, {
        $push: { devScoreHistory: submission._id }
      });

      // Return full evaluation
      res.status(201).json({
        success: true,
        message: 'Code evaluated successfully',
        data: {
          submissionId: submission._id,
          devScore,
          scores: aiEvaluation.scores,
          staticAnalysis,
          feedback: aiEvaluation.feedback,
          language,
          interviewMode,
          createdAt: submission.createdAt
        }
      });

    } catch (error) {
      console.error('Evaluation Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to evaluate code',
        error: error.message
      });
    }
  }
);

// @route   GET /api/submissions
// @desc    Get user's submission history
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-code'); // Exclude code from list view for performance

    const total = await Submission.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get Submissions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions'
    });
  }
});

// @route   GET /api/submissions/:id
// @desc    Get single submission details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const submission = await Submission.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Get Submission Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission'
    });
  }
});

// @route   GET /api/submissions/stats/overview
// @desc    Get user's statistics overview
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    if (submissions.length === 0) {
      return res.json({
        success: true,
        data: {
          totalSubmissions: 0,
          averageDevScore: 0,
          latestDevScore: 0,
          improvement: 0,
          weakestSkill: null,
          scoreBreakdown: {},
          recentTrend: []
        }
      });
    }

    // Calculate statistics
    const totalSubmissions = submissions.length;
    const averageDevScore = Math.round(
      submissions.reduce((sum, sub) => sum + sub.devScore, 0) / totalSubmissions
    );
    const latestDevScore = submissions[0].devScore;

    // Calculate improvement (compare last 3 vs previous 3)
    let improvement = 0;
    if (totalSubmissions >= 6) {
      const recentAvg = submissions.slice(0, 3).reduce((sum, sub) => sum + sub.devScore, 0) / 3;
      const previousAvg = submissions.slice(3, 6).reduce((sum, sub) => sum + sub.devScore, 0) / 3;
      improvement = Math.round(recentAvg - previousAvg);
    }

    // Find weakest skill
    const avgScores = {
      codeQuality: 0,
      timeComplexity: 0,
      spaceComplexity: 0,
      security: 0,
      readability: 0
    };

    submissions.forEach(sub => {
      Object.keys(avgScores).forEach(key => {
        avgScores[key] += sub.scores[key] || 0;
      });
    });

    Object.keys(avgScores).forEach(key => {
      avgScores[key] = Math.round(avgScores[key] / totalSubmissions);
    });

    const weakestSkill = Object.keys(avgScores).reduce((a, b) => 
      avgScores[a] < avgScores[b] ? a : b
    );

    // Recent trend (last 10 submissions)
    const recentTrend = submissions.slice(0, 10).reverse().map(sub => ({
      date: sub.createdAt,
      devScore: sub.devScore,
      language: sub.language
    }));

    res.json({
      success: true,
      data: {
        totalSubmissions,
        averageDevScore,
        latestDevScore,
        improvement,
        weakestSkill,
        scoreBreakdown: avgScores,
        recentTrend
      }
    });

  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// @route   DELETE /api/submissions/:id
// @desc    Delete a submission
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const submission = await Submission.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    await submission.deleteOne();

    // Remove from user's history
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { devScoreHistory: submission._id }
    });

    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    console.error('Delete Submission Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete submission'
    });
  }
});

module.exports = router;
