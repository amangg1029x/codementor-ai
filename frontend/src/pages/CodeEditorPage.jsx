import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { submissionAPI } from '../services/api';

const CodeEditorPage = () => {
  const [code, setCode] = useState('// Write your code here\nfunction example() {\n  return "Hello World";\n}');
  const [language, setLanguage] = useState('javascript');
  const [interviewMode, setInterviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', defaultCode: '// JavaScript\nfunction example() {\n  return "Hello World";\n}' },
    { value: 'python', label: 'Python', defaultCode: '# Python\ndef example():\n    return "Hello World"' },
    { value: 'cpp', label: 'C++', defaultCode: '// C++\n#include <iostream>\n\nint main() {\n    std::cout << "Hello World";\n    return 0;\n}' },
    { value: 'typescript', label: 'TypeScript', defaultCode: '// TypeScript\nfunction example(): string {\n  return "Hello World";\n}' },
    { value: 'java', label: 'Java', defaultCode: '// Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}' }
  ];

  const handleLanguageChange = (newLang) => {
    const langOption = languageOptions.find(opt => opt.value === newLang);
    setLanguage(newLang);
    setCode(langOption?.defaultCode || '');
    setResult(null);
    setShowResults(false);
  };

  const handleEvaluate = async () => {
    if (!code.trim()) {
      setError('Please write some code first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await submissionAPI.evaluate(code, language, interviewMode);
      setResult(response.data);
      setShowResults(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to evaluate code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Code Editor
          </h1>
          <p className="text-gray-600">
            Write your code and get AI-powered evaluation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Editor Controls */}
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Language Selector */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">
                      Language:
                    </label>
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {languageOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Interview Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="interviewMode"
                      checked={interviewMode}
                      onChange={(e) => setInterviewMode(e.target.checked)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="interviewMode" className="text-sm font-medium text-gray-700">
                      Interview Mode
                    </label>
                  </div>

                  {/* Evaluate Button */}
                  <button
                    onClick={handleEvaluate}
                    disabled={loading}
                    className="ml-auto btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating...</span>
                        <span className="text-xs text-gray-500">This takes ~5 seconds</span>
                      </div>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Evaluate Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="h-[600px]">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2
                  }}
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 mb-1">Evaluation Failed</p>
                    <p className="text-sm text-red-800">{error}</p>
                    <button 
                      onClick={() => setError('')}
                      className="text-xs text-red-600 hover:text-red-800 mt-2 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            {!showResults ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Evaluate
                </h3>
                <p className="text-gray-600 text-sm">
                  Click "Evaluate Code" to get your DevScore and detailed feedback
                </p>
                {interviewMode && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-700 font-medium">
                      🎯 Interview Mode Active: Expect tougher evaluation and challenging follow-up questions
                    </p>
                  </div>
                )}
              </div>
            ) : result && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* DevScore Header */}
                <div className={`p-6 ${getScoreBg(result.devScore)} border-b-2`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-700">DevScore</h3>
                    <button
                      onClick={() => setShowResults(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className={`text-5xl font-bold ${getScoreColor(result.devScore)}`}>
                    {result.devScore}/100
                  </div>
                </div>

                {/* Scrollable Results */}
                <div className="max-h-[600px] overflow-y-auto">
                  {/* Score Breakdown */}
                  <div className="p-6 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-4">Score Breakdown</h4>
                    <div className="space-y-3">
                      {Object.entries(result.scores).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={`font-semibold ${getScoreColor(value)}`}>
                              {value}/100
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-full rounded-full ${
                                value >= 80 ? 'bg-green-500' : 
                                value >= 60 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Static Analysis */}
                  {result.staticAnalysis && (
                    <div className="p-6 border-b border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4">Static Analysis</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {Object.entries(result.staticAnalysis).map(([key, value]) => (
                          value > 0 && (
                            <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="font-semibold text-orange-600">{value}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {result.feedback.strengths?.length > 0 && (
                    <div className="p-6 border-b border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {result.feedback.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {result.feedback.weaknesses?.length > 0 && (
                    <div className="p-6 border-b border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        Areas to Improve
                      </h4>
                      <ul className="space-y-2">
                        {result.feedback.weaknesses.map((weakness, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {result.feedback.suggestions?.length > 0 && (
                    <div className="p-6 border-b border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        💡 Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {result.feedback.suggestions.map((suggestion, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start">
                            <span className="text-primary-600 mr-2">→</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Interview Questions */}
                  {result.feedback.interviewQuestions?.length > 0 && (
                    <div className="p-6 bg-purple-50">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        🎯 Follow-up Questions
                      </h4>
                      <ul className="space-y-3">
                        {result.feedback.interviewQuestions.map((question, i) => (
                          <li key={i} className="text-sm text-gray-700 p-3 bg-white rounded-lg shadow-sm">
                            <span className="font-medium text-purple-600">Q{i + 1}:</span> {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPage;
