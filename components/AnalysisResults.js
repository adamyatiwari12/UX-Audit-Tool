import { useState } from 'react';
import { Printer } from 'lucide-react';

export default function AnalysisResults({ results }) {
  const [selectedTab, setSelectedTab] = useState('suggestions');
  
  const categoryColors = {
    'cta': 'bg-red-100 text-red-800',
    'hierarchy': 'bg-green-100 text-green-800',
    'copy': 'bg-blue-100 text-blue-800',
    'trust': 'bg-yellow-100 text-yellow-800',
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-green-400';
    if (score >= 60) return 'from-yellow-500 to-yellow-400';
    return 'from-red-500 to-red-400';
  };

  const suggestionsByCategory = results.suggestions.reduce((acc, suggestion) => {
    const category = suggestion.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(suggestion);
    return acc;
  }, {});

  return (
    <div className="mt-8 w-full text-black">
      <h2 className="text-2xl font-bold pb-3 mb-6 border-b border-gray-200">
        UX Analysis Results
      </h2>
      
      <div className="flex justify-around items-center flex-wrap mb-8">
        <div className="text-center">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${getScoreColor(results.overallScore)} flex items-center justify-center mx-auto mb-3`}>
            <span className="text-3xl font-bold text-white">{results.overallScore}</span>
          </div>
          <p className="text-gray-700 font-medium">Overall Score</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 sm:mt-0">
          {Object.entries(results.metrics).map(([key, value]) => (
            <div key={key} className="p-3 bg-gray-50 rounded-lg">
              <span className="block text-sm text-gray-500 mb-1">{key}</span>
              <span className="text-lg font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
            selectedTab === 'suggestions' 
              ? 'text-blue-600 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setSelectedTab('suggestions')}
        >
          Suggestions
        </button>
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
            selectedTab === 'categories' 
              ? 'text-blue-600 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setSelectedTab('categories')}
        >
          By Category
        </button>
      </div>

      {selectedTab === 'suggestions' && (
        <div>
          <ul className="space-y-4">
            {results.suggestions.map((suggestion, index) => (
              <li key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <h4 className="text-lg font-medium text-gray-800">{suggestion.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[suggestion.category.toLowerCase()]}`}>
                    {suggestion.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{suggestion.description}</p>
                {suggestion.recommendation && (
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
                    <p className="text-gray-700">
                      <span className="font-medium">Recommendation:</span> {suggestion.recommendation}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTab === 'categories' && (
        <div>
          {Object.entries(suggestionsByCategory).map(([category, suggestions]) => (
            <div key={category} className="mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className={`w-3 h-3 rounded-full ${
                  categoryColors[category].split(' ')[0].replace('bg-', 'bg-')
                } mr-2`}></span>
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({suggestions.length} {suggestions.length === 1 ? 'suggestion' : 'suggestions'})
                </span>
              </h3>
              <ul className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">{suggestion.title}</h4>
                    <p className="text-gray-600 mb-3">{suggestion.description}</p>
                    {suggestion.recommendation && (
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
                        <p className="text-gray-700">
                          <span className="font-medium">Recommendation:</span> {suggestion.recommendation}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button 
          onClick={() => window.print()} 
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Printer className="mr-2 -ml-1 h-5 w-5" />
          Print Report
        </button>
      </div>
    </div>
  );
}