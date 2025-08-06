import React, { useState } from 'react';
import { loanAPI } from '../utils/api';
import { Calculator, CheckCircle, XCircle, Info } from 'lucide-react';

const LoanCheck = () => {
  const [formData, setFormData] = useState({
    income: '',
    credit_score: '',
    employment_type: 'employed'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await loanAPI.predict({
        income: parseFloat(formData.income),
        credit_score: parseInt(formData.credit_score),
        employment_type: formData.employment_type
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error making prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Calculator className="mx-auto h-12 w-12 text-primary-600 mb-4" />
        <h1 className="text-3xl font-bold text-banking-900">Loan Approval Prediction</h1>
        <p className="mt-2 text-banking-600">
          Get an instant prediction on your loan approval chances using our AI-powered system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-banking-900 mb-6">Financial Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="income" className="block text-sm font-medium text-banking-700 mb-2">
                Annual Income ($)
              </label>
              <input
                type="number"
                id="income"
                name="income"
                required
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-banking-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 50000"
                value={formData.income}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="credit_score" className="block text-sm font-medium text-banking-700 mb-2">
                Credit Score
              </label>
              <input
                type="number"
                id="credit_score"
                name="credit_score"
                required
                min="300"
                max="850"
                className="w-full px-3 py-2 border border-banking-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 720"
                value={formData.credit_score}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-banking-500">Score should be between 300-850</p>
            </div>

            <div>
              <label htmlFor="employment_type" className="block text-sm font-medium text-banking-700 mb-2">
                Employment Status
              </label>
              <select
                id="employment_type"
                name="employment_type"
                className="w-full px-3 py-2 border border-banking-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.employment_type}
                onChange={handleChange}
              >
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Check Loan Approval'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-banking-900 mb-6">Prediction Results</h2>
          
          {!result && !loading && (
            <div className="text-center py-12">
              <Info className="mx-auto h-12 w-12 text-banking-400 mb-4" />
              <p className="text-banking-500">Fill out the form to get your loan approval prediction</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-banking-500">Analyzing your financial profile...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Approval Status */}
              <div className={`p-4 rounded-lg ${
                result.approved 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {result.approved ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 mr-3" />
                  )}
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      result.approved ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.approved ? 'Loan Likely to be Approved' : 'Loan Likely to be Rejected'}
                    </h3>
                    <p className={`text-sm ${
                      result.approved ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Approval Probability: {(result.probability * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Reasoning */}
              <div className="bg-banking-50 p-4 rounded-lg">
                <h4 className="font-medium text-banking-900 mb-2">Analysis Details</h4>
                <p className="text-sm text-banking-700 leading-relaxed">
                  {result.reasoning}
                </p>
              </div>

              {/* Improvement Tips */}
              {!result.approved && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Ways to Improve Your Chances</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Increase your annual income through additional sources</li>
                    <li>• Improve your credit score by paying bills on time</li>
                    <li>• Consider getting a co-signer with good credit</li>
                    <li>• Reduce existing debt before applying</li>
                    <li>• Build a longer credit history</li>
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setResult(null);
                    setFormData({ income: '', credit_score: '', employment_type: 'employed' });
                  }}
                  className="flex-1 bg-banking-100 text-banking-700 py-2 px-4 rounded-md hover:bg-banking-200 focus:outline-none focus:ring-2 focus:ring-banking-500"
                >
                  Try Again
                </button>
                {result.approved && (
                  <button
                    onClick={() => alert('This would redirect to the loan application form')}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Apply for Loan
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Model Information */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-banking-900 mb-4">About Our Prediction Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-banking-600">
          <div>
            <h4 className="font-medium text-banking-800 mb-2">Model Type</h4>
            <p>Logistic Regression with feature scaling for optimal performance</p>
          </div>
          <div>
            <h4 className="font-medium text-banking-800 mb-2">Key Factors</h4>
            <p>Income level, credit score, and employment status are the primary factors</p>
          </div>
          <div>
            <h4 className="font-medium text-banking-800 mb-2">Accuracy</h4>
            <p>Trained on historical data with ~85% accuracy on test scenarios</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            <strong>Disclaimer:</strong> This is a prediction tool for educational purposes. 
            Actual loan approval depends on many additional factors and bank policies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanCheck;