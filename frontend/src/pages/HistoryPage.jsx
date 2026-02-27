import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Code2, Trophy, Trash2, Eye, Filter } from 'lucide-react';
import { submissionAPI } from '../services/api';

const HistoryPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [page]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await submissionAPI.getAll(page, 10);
      setSubmissions(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      await submissionAPI.delete(id);
      setSubmissions(submissions.filter(sub => sub._id !== id));
      if (selectedSubmission?._id === id) {
        setSelectedSubmission(null);
      }
    } catch (error) {
      alert('Failed to delete submission');
    }
  };

  const viewDetails = async (id) => {
    try {
      const response = await submissionAPI.getById(id);
      setSelectedSubmission(response.data);
    } catch (error) {
      alert('Failed to load submission details');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getLanguageBadge = (language) => {
    const colors = {
      javascript: 'bg-yellow-100 text-yellow-800',
      python: 'bg-blue-100 text-blue-800',
      cpp: 'bg-purple-100 text-purple-800',
      typescript: 'bg-blue-100 text-blue-800',
      java: 'bg-red-100 text-red-800'
    };
    return colors[language] || 'bg-gray-100 text-gray-800';
  };

  const filteredSubmissions = filterLanguage === 'all' 
    ? submissions 
    : submissions.filter(sub => sub.language === filterLanguage);

  if (loading && submissions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your submissions...</p>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Code2 className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Submissions Yet
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start coding to see your submission history here
            </p>
            <Link to="/editor" className="btn-primary inline-flex items-center space-x-2">
              <Code2 className="w-5 h-5" />
              <span>Go to Editor</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Submission History
          </h1>
          <p className="text-gray-600">
            Review your past code evaluations
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="all">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Total: {pagination?.total || 0} submissions
          </div>
        </div>

        {/* Submissions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLanguageBadge(submission.language)}`}>
                      {submission.language}
                    </span>
                    {submission.interviewMode && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        Interview Mode
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(submission.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* DevScore Badge */}
                <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${getScoreColor(submission.devScore)}`}>
                  {submission.devScore}
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-2 mb-4">
                {Object.entries(submission.scores).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-full rounded-full ${
                            value >= 80 ? 'bg-green-500' : 
                            value >= 60 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-700 w-8 text-right">{value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => viewDetails(submission._id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => handleDelete(submission._id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Detail Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Submission Details
                  </h3>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Code */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Code</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{selectedSubmission.code}</code>
                  </pre>
                </div>

                {/* Detailed Analysis */}
                {selectedSubmission.feedback?.detailedAnalysis && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Detailed Analysis</h4>
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedSubmission.feedback.detailedAnalysis}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
