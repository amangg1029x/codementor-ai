const express = require('express');
const { protect } = require('../middleware/auth.js');
const Challenge = require('../models/Challenge.js');
const User = require('../models/User.js');
const Submission = require('../models/Submission.js');

const router = express.Router();

/**
 * @route   GET /api/challenges/daily
 * @desc    Get daily challenge for user
 * @access  Private
 */
router.get('/daily', protect, async (req, res) => {
  try {
    const user = req.user;
    
    // Check if user already did today's challenge
    const today = new Date().setHours(0, 0, 0, 0);
    const lastChallenge = user.lastChallengeDate 
      ? new Date(user.lastChallengeDate).setHours(0, 0, 0, 0)
      : null;
    
    // Find user's weak area
    const weakCategory = user.weakAreas?.length > 0 
      ? user.weakAreas.sort((a, b) => a.averageScore - b.averageScore)[0].category
      : null;
    
    // Get a challenge (prioritize weak areas)
    const query = {};
    if (weakCategory) {
      query.category = weakCategory;
    }
    
    // Exclude completed challenges
    const completedIds = user.completedChallenges?.map(c => c.challengeId) || [];
    if (completedIds.length > 0) {
      query._id = { $nin: completedIds };
    }
    
    let challenge = await Challenge.findOne(query);
    
    // If no challenge found, get any challenge
    if (!challenge) {
      challenge = await Challenge.findOne({
        _id: { $nin: completedIds }
      });
    }
    
    // If all challenges completed, get a random one
    if (!challenge) {
      const count = await Challenge.countDocuments();
      const random = Math.floor(Math.random() * count);
      challenge = await Challenge.findOne().skip(random);
    }
    
    res.json({
      success: true,
      data: {
        challenge,
        streak: user.streakDays || 0,
        completedToday: lastChallenge === today
      }
    });
    
  } catch (error) {
    console.error('Get daily challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get daily challenge'
    });
  }
});

/**
 * @route   POST /api/challenges/:id/complete
 * @desc    Mark challenge as completed
 * @access  Private
 */
router.post('/:id/complete', protect, async (req, res) => {
  try {
    const { submissionId, score } = req.body;
    const user = req.user;
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    // Update streak
    const today = new Date().setHours(0, 0, 0, 0);
    const lastChallenge = user.lastChallengeDate 
      ? new Date(user.lastChallengeDate).setHours(0, 0, 0, 0)
      : null;
    
    if (lastChallenge === today) {
      // Already completed today, don't update streak
    } else if (lastChallenge === today - 86400000) {
      // Completed yesterday, increment streak
      user.streakDays = (user.streakDays || 0) + 1;
    } else {
      // Streak broken, reset
      user.streakDays = 1;
    }
    
    user.lastChallengeDate = new Date();
    
    // Add to completed challenges
    if (!user.completedChallenges) {
      user.completedChallenges = [];
    }
    
    user.completedChallenges.push({
      challengeId: challenge._id,
      completedAt: new Date(),
      score: score
    });
    
    // Update weak areas
    const categorySubmissions = await Submission.find({
      userId: req.userId,
      // You might want to tag submissions with category
    });
    
    await user.save();
    
    res.json({
      success: true,
      data: {
        streak: user.streakDays,
        message: `Great! You're on a ${user.streakDays} day streak! 🔥`
      }
    });
    
  } catch (error) {
    console.error('Complete challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete challenge'
    });
  }
});

/**
 * @route   GET /api/challenges/history
 * @desc    Get user's challenge history
 * @access  Private
 */
router.get('/history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('completedChallenges.challengeId');
    
    res.json({
      success: true,
      data: {
        completed: user.completedChallenges || [],
        streak: user.streakDays || 0
      }
    });
    
  } catch (error) {
    console.error('Get challenge history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get challenge history'
    });
  }
});

module.exports = router;