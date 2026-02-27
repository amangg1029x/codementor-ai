const { GoogleGenAI } = require('@google/genai');

class AIEvaluator {

  constructor() {
    this.client = null;
  }

  getClient() {
    if (!this.client) {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set');
      }
      
      this.client = new GoogleGenAI({ apiKey });
      console.log('✅ Gemini client initialized');
    }
    return this.client;
  }

  async evaluateCode(code, language, interviewMode = false, staticAnalysis = {}) {
  try {
    const client = this.getClient();
    const prompt = this.buildEvaluationPrompt(code, language, interviewMode, staticAnalysis);
    
    // Correct API call for @google/genai
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    
    // Extract text from response
    const content = response.text || response.content || '';
    const evaluation = this.parseEvaluation(content);
    
    return evaluation;
  } catch (error) {
    console.error('AI Evaluation Error:', error.message);
    console.error('Full error:', error);
    throw new Error('Failed to evaluate code with AI');
  }
}

  buildEvaluationPrompt(code, language, interviewMode, staticAnalysis) {
    const modeInstructions = interviewMode 
      ? `
      INTERVIEW MODE ENABLED:
      - Provide tougher, more critical evaluation
      - Include 3-5 challenging follow-up questions
      - Ask about optimization opportunities
      - Challenge edge cases
      - Include behavioral questions about coding approach
      `
      : `
      - Provide balanced, constructive feedback
      - Focus on learning and improvement
      - Include 2-3 relevant follow-up questions
      `;

    return `You are an expert code reviewer and technical interviewer. Evaluate the following ${language} code.

${modeInstructions}

CODE TO EVALUATE:
\`\`\`${language}
${code}
\`\`\`

STATIC ANALYSIS RESULTS:
${JSON.stringify(staticAnalysis, null, 2)}

Provide a comprehensive evaluation in VALID JSON format with this exact structure:

{
  "scores": {
    "codeQuality": <number 0-100>,
    "timeComplexity": <number 0-100>,
    "spaceComplexity": <number 0-100>,
    "security": <number 0-100>,
    "readability": <number 0-100>
  },
  "feedback": {
    "strengths": [<array of 2-4 strength points>],
    "weaknesses": [<array of 2-4 weakness points>],
    "suggestions": [<array of 3-5 actionable improvements>],
    "interviewQuestions": [<array of ${interviewMode ? '3-5' : '2-3'} follow-up questions>],
    "detailedAnalysis": "<comprehensive 2-3 paragraph analysis covering: algorithm choice, code structure, potential bugs, performance considerations, and security implications>"
  }
}

SCORING GUIDELINES:
- Code Quality (0-100): Overall structure, design patterns, best practices
- Time Complexity (0-100): Algorithm efficiency, unnecessary operations
- Space Complexity (0-100): Memory usage, data structure choices
- Security (0-100): Vulnerabilities, input validation, secure practices
- Readability (0-100): Naming, comments, code organization

Return ONLY valid JSON, no markdown code blocks or additional text.`;
  }

  parseEvaluation(content) {
    try {
      // Remove markdown code blocks if present
      let jsonString = content.trim();
      
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/```\n?/g, '');
      }
      
      const evaluation = JSON.parse(jsonString);
      
      // Validate structure
      if (!evaluation.scores || !evaluation.feedback) {
        throw new Error('Invalid evaluation structure');
      }
      
      return evaluation;
    } catch (error) {
      console.error('Failed to parse AI response:', content);
      
      // Return a default structure if parsing fails
      return {
        scores: {
          codeQuality: 50,
          timeComplexity: 50,
          spaceComplexity: 50,
          security: 50,
          readability: 50
        },
        feedback: {
          strengths: ['Code submitted successfully'],
          weaknesses: ['Unable to complete full evaluation'],
          suggestions: ['Please try again or contact support'],
          interviewQuestions: ['What was your approach to solving this problem?'],
          detailedAnalysis: 'Evaluation service encountered an issue. Please try submitting again.'
        }
      };
    }
  }

  calculateDevScore(aiScores, staticPenalty) {
    // DevScore formula:
    // 30% Code Quality + 20% Time Complexity + 20% Security + 20% Readability + 10% Space Complexity
    // Then apply static analysis penalty
    
    const baseScore = (
      aiScores.codeQuality * 0.30 +
      aiScores.timeComplexity * 0.20 +
      aiScores.security * 0.20 +
      aiScores.readability * 0.20 +
      aiScores.spaceComplexity * 0.10
    );
    
    // Calculate penalty from static analysis (max 10 points)
    const penalty = Math.min(staticPenalty * 2, 10);
    
    const finalScore = Math.max(0, Math.min(100, baseScore - penalty));
    
    return Math.round(finalScore);
  }

  calculateStaticPenalty(staticAnalysis) {
    let penalty = 0;
    
    if (staticAnalysis.nestedLoops >= 3) penalty += 2;
    if (staticAnalysis.consoleLogs > 5) penalty += 1;
    if (staticAnalysis.longFunctions > 0) penalty += 2;
    if (staticAnalysis.securityRisks > 0) penalty += 3;
    if (staticAnalysis.poorNaming > 3) penalty += 1;
    if (staticAnalysis.missingErrorHandling > 0) penalty += 1;
    
    return penalty;
  }
}

module.exports = new AIEvaluator();
