import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  Code2,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { submissionAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await submissionAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // No submissions yet
  if (!stats || stats.totalSubmissions === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Code2 className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Your Dashboard!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              You haven't submitted any code yet. Let's get started!
            </p>
            <Link to="/editor" className="btn-primary inline-flex items-center space-x-2">
              <Code2 className="w-5 h-5" />
              <span>Submit Your First Code</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Prepare radar chart data
  const radarData = [
    { skill: 'Code Quality', value: stats.scoreBreakdown.codeQuality },
    { skill: 'Time Complexity', value: stats.scoreBreakdown.timeComplexity },
    { skill: 'Space Complexity', value: stats.scoreBreakdown.spaceComplexity },
    { skill: 'Security', value: stats.scoreBreakdown.security },
    { skill: 'Readability', value: stats.scoreBreakdown.readability }
  ];

  // Format trend data for chart
  const trendData = stats.recentTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: item.devScore
  }));

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-500' };
    if (score >= 80) return { label: 'Great', color: 'bg-green-400' };
    if (score >= 70) return { label: 'Good', color: 'bg-yellow-500' };
    if (score >= 60) return { label: 'Fair', color: 'bg-orange-500' };
    return { label: 'Needs Work', color: 'bg-red-500' };
  };

  const latestBadge = getScoreBadge(stats.latestDevScore);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Developer Dashboard
          </h1>
          <p className="text-gray-600">
            Track your progress and identify areas for improvement
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Latest DevScore */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-primary-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Latest DevScore</span>
              <Award className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold text-gray-900">
                  {stats.latestDevScore}
                </div>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 ${latestBadge.color} text-white`}>
                  {latestBadge.label}
                </div>
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Average Score</span>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900">
              {stats.averageDevScore}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Across {stats.totalSubmissions} submissions
            </div>
          </div>

          {/* Improvement */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Recent Trend</span>
              {stats.improvement >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className={`text-4xl font-bold ${stats.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.improvement >= 0 ? '+' : ''}{stats.improvement}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {stats.improvement >= 0 ? 'Improving' : 'Declining'} trend
            </div>
          </div>

          {/* Weakest Skill */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Focus Area</span>
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-lg font-bold text-gray-900 capitalize">
              {stats.weakestSkill?.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Score: {stats.scoreBreakdown[stats.weakestSkill]}/100
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Progress Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skills Radar */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Skill Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="skill" stroke="#6b7280" />
                <PolarRadiusAxis domain={[0, 100]} stroke="#6b7280" />
                <Radar 
                  name="Score" 
                  dataKey="value" 
                  stroke="#0ea5e9" 
                  fill="#0ea5e9" 
                  fillOpacity={0.5} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Skill Scores</h3>
          <div className="space-y-4">
            {Object.entries(stats.scoreBreakdown).map(([skill, score]) => (
              <div key={skill}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium capitalize">
                    {skill.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`font-bold ${getScoreColor(score)} px-3 py-1 rounded-full`}>
                    {score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      score >= 80 ? 'bg-green-500' : 
                      score >= 60 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Improve Your Score?</h3>
          <p className="mb-6 opacity-90">Submit more code and watch your DevScore climb!</p>
          <div className="flex justify-center gap-4">
            <Link to="/editor" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Submit New Code
            </Link>
            <Link to="/history" className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
              View History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
