'use client'
import { useState } from 'react';
import UrlForm from '../components/UrlForm';
import HtmlForm from '../components/HtmlForm';
import AnalysisResults from '../components/AnalysisResults';
import LoadingAnimation from '../components/LoadingAnimation';
import { ArrowLeft, Info } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('url');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  const handleUrlSubmit = async (url) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze the URL');
      }
      
      const data = await response.json();
      setAnalysisResults(data);
      
      const newAnalysis = {
        id: Date.now(),
        type: 'url',
        source: url,
        score: data.overallScore,
        date: new Date().toLocaleString()
      };
      
      setRecentAnalyses(prev => [newAnalysis, ...prev.slice(0, 4)]);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHtmlSubmit = async (html) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze the HTML');
      }
      
      const data = await response.json();
      setAnalysisResults(data);
      
      const newAnalysis = {
        id: Date.now(),
        type: 'html',
        source: html.substring(0, 50) + '...',
        score: data.overallScore,
        date: new Date().toLocaleString()
      };
      
      setRecentAnalyses(prev => [newAnalysis, ...prev.slice(0, 4)]);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">

      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8">
        <div className="w-full max-w-4xl">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Landing Page UX Audit Tool
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get actionable suggestions to improve your landing page performance
            </p>
          </header>

          {!analysisResults ? (
            <>
              <div className="flex w-full border-b border-gray-200 mb-6">
                <button 
                  className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'url' 
                      ? 'text-blue-600 border-b-2 border-blue-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('url')}
                >
                  Analyze URL
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'html' 
                      ? 'text-blue-600 border-b-2 border-blue-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('html')}
                >
                  Analyze HTML
                </button>
                {recentAnalyses.length > 0 && (
                  <button 
                    className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'recent' 
                        ? 'text-blue-600 border-b-2 border-blue-500' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('recent')}
                  >
                    Recent Analyses
                  </button>
                )}
              </div>

              <div className="w-full p-6 bg-white rounded-lg shadow-md">
                {activeTab === 'url' && (
                  <UrlForm onSubmit={handleUrlSubmit} loading={loading} />
                )}
                
                {activeTab === 'html' && (
                  <HtmlForm onSubmit={handleHtmlSubmit} loading={loading} />
                )}
                
                {activeTab === 'recent' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Analyses</h3>
                    {recentAnalyses.map(analysis => (
                      <div key={analysis.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium mb-1 text-black">
                            {analysis.type === 'url' ? '🔗 URL' : '📄 HTML'}: {analysis.source}
                          </p>
                          <p className="text-sm text-gray-500">{analysis.date}</p>
                        </div>
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                            analysis.score >= 80 ? 'bg-green-100 text-green-800' :
                            analysis.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {analysis.score}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
              <div className="mb-4 flex justify-between items-center">
                <button 
                  onClick={resetAnalysis}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-1 w-4 h-4" />
                  Back
                </button>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
              <AnalysisResults results={analysisResults} />
            </div>
          )}

          {error && (
            <div className="p-4 mt-4 bg-red-50 text-red-700 rounded-md border border-red-100">
              <div className="flex">
                <Info className="h-5 w-5 text-red-400 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {loading && <LoadingAnimation />}
        </div>
      </main>

      <footer className="w-full h-16 border-t border-gray-200 flex justify-center items-center">
        <p className="text-sm text-gray-600">Built with Next.js and Tailwind CSS</p>
      </footer>
    </div>
  );
}

