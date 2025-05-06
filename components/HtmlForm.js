import { useState } from 'react';

export default function HtmlForm({ onSubmit, loading }) {
  const [html, setHtml] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (html.trim()) {
      onSubmit(html);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label htmlFor="html" className="block text-gray-700 font-medium mb-2">
          Paste your HTML:
        </label>
        <textarea
          id="html"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder="<html>...</html>"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
          rows="8"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className={`px-5 py-2 rounded-md font-medium transition-colors duration-200 ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? 'Analyzing...' : 'Analyze HTML'}
      </button>
    </form>
  );
}