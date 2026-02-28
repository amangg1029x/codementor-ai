import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Calendar, Flame, Trophy, Code2, Lightbulb, Clock } from 'lucide-react';

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [streak, setStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadDailyChallenge();
  }, []);

  const loadDailyChallenge = async () => {
    try {
      const response = await axios.get('/api/challenges/daily', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setChallenge(response.data.data.challenge);
      setStreak(response.data.data.streak);
      setCompletedToday(response.data.data.completedToday);
      setCode(response.data.data.challenge.starterCode[language] || '');
      setLoading(false);
    } catch (error) {
      console.error('Failed to load challenge:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      // Submit code for evaluation
      const evalResponse = await axios.post('/api/submissions/evaluate', {
        code,
        language,
        interviewMode: false
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const score = evalResponse.data.data.devScore.overall;
      
      // Mark challenge as complete
      await axios.post(`/api/challenges/${challenge._id}/complete`, {
        submissionId: evalResponse.data.data.submissionId,
        score
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Redirect to evaluation results
      navigate('/editor'); // Or show results modal
      
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading today's challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Challenge</h1>
            <p className="text-sm text-gray-600 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Streak Display */}
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg">
              <Flame className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{streak}</div>
                <div className="text-xs text-orange-800">Day Streak</div>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {completedToday ? (
          <div className="card text-center py-12">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Challenge Completed! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              You've already completed today's challenge. Come back tomorrow for a new one!
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                View Dashboard
              </button>
              <button
                onClick={() => navigate('/editor')}
                className="btn-secondary"
              >
                Practice More
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Challenge Description */}
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {challenge?.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        challenge?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        challenge?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {challenge?.difficulty?.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                        {challenge?.category}
                      </span>
                    </div>
                  </div>
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {challenge?.description}
                </p>
                
                {challenge?.expectedComplexity && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Expected Complexity:</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">
                        Time: <code className="bg-gray-200 px-2 py-0.5 rounded">{challenge.expectedComplexity.time}</code>
                      </span>
                      <span className="text-gray-600">
                        Space: <code className="bg-gray-200 px-2 py-0.5 rounded">{challenge.expectedComplexity.space}</code>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Hints */}
              <div className="card">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">Hints</h3>
                  </div>
                  <span className="text-sm text-gray-500">
                    {showHints ? 'Hide' : 'Show'}
                  </span>
                </button>
                
                {showHints && (
                  <ul className="mt-4 space-y-2">
                    {challenge?.hints?.map((hint, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="font-semibold text-primary-600">{index + 1}.</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right: Code Editor */}
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Your Solution</h3>
                  <select
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      setCode(challenge?.starterCode[e.target.value] || '');
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
                
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <Editor
                    height="400px"
                    language={language === 'cpp' ? 'cpp' : language}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !code.trim()}
                  className="btn-primary w-full mt-4"
                >
                  {submitting ? 'Submitting...' : 'Submit Solution'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallenge;