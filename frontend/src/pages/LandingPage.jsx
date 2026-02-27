import { Link } from 'react-router-dom';
import { 
  Code2, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Shield, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: 'Multi-Dimensional Scoring',
      description: 'Get evaluated on code quality, time complexity, security, and readability - not just syntax.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Track Your Progress',
      description: 'Watch your DevScore improve over time with detailed analytics and trend graphs.'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Identify Weak Areas',
      description: 'Pinpoint exactly where you need to improve with skill-specific breakdowns.'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Feedback',
      description: 'Receive intelligent, actionable suggestions from Claude AI on every submission.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Interview Preparation',
      description: 'Practice with interview mode for tougher critiques and follow-up questions.'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Developer Dashboard',
      description: 'Visualize your coding journey with comprehensive statistics and heatmaps.'
    }
  ];

  const problemPoints = [
    'Students copy code from AI without understanding',
    'No quantifiable metrics for coding improvement',
    'Lack of structured, actionable feedback',
    'Not interview-ready despite solving problems',
    'Cannot identify specific weak areas'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-lg mb-8 fade-in">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">
                AI That Evaluates Developers, Not Just Code
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 fade-in">
              Stop Copying Code.
              <br />
              <span className="text-gradient">Start Growing as a Developer.</span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto fade-in">
              CodeMentor AI provides structured, multi-dimensional code evaluation with AI-powered insights. 
              Track your progress, identify weaknesses, and become interview-ready.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in">
              <Link
                to="/register"
                className="btn-primary flex items-center space-x-2 group"
              >
                <span>Start Evaluating Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="btn-secondary"
              >
                Login
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              No credit card required • Takes 30 seconds
            </p>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-20 fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-4 border-4 border-primary-200">
              <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-6 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Code2 className="w-20 h-20 text-primary-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Live Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Problem with Current AI Tools
            </h2>
            <p className="text-xl text-gray-600">
              They give you answers, but they don't make you a better developer
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {problemPoints.map((problem, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm font-bold">✕</span>
                </div>
                <p className="text-gray-700">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive evaluation that goes beyond syntax checking
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg card-hover border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get your DevScore in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Submit Your Code
              </h3>
              <p className="text-gray-600">
                Paste your code in our Monaco editor. Choose your language and toggle interview mode if needed.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Get AI Analysis
              </h3>
              <p className="text-gray-600">
                Our AI evaluates your code across 5 dimensions: quality, complexity, security, and readability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600">
                View your DevScore, get actionable feedback, and watch your skills improve over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DevScore Preview */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Your Developer Profile, Quantified
            </h2>
            <p className="text-xl opacity-90">
              Get a comprehensive DevScore that measures what really matters
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
              {[
                { label: 'Code Quality', score: 85 },
                { label: 'Time Complexity', score: 78 },
                { label: 'Security', score: 92 },
                { label: 'Readability', score: 88 },
                { label: 'Space Complexity', score: 80 }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold mb-1">{item.score}</div>
                  <div className="text-sm opacity-80">{item.label}</div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">84/100</div>
              <div className="text-xl opacity-90">Overall DevScore</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Level Up Your Coding Skills?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers who are tracking their progress and becoming interview-ready
          </p>
          <Link
            to="/register"
            className="btn-primary inline-flex items-center space-x-2 group text-lg px-8 py-4"
          >
            <span>Get Started for Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
