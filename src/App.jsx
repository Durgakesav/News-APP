import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import Weather from './Weather';
import RatesSidebar from './RatesSidebar';
import './styles.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  // Use env variable, or fallback to hardcoded (not recommended for production)
  const apiKey = import.meta.env.VITE_NEWS_API_KEY || 'e9a9994c0e7d4f96968960888b074c00';

  const fetchSearchResults = async (searchQuery) => {
    const q = searchQuery.trim() || 'global';
    setLoading(true);
    setError(null);
    try {
const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&apiKey=${apiKey}&pageSize=20`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`NewsAPI error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load news. Please try again.");
      setArticles([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSearchResults('');
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  const handleSearch = () => {
    fetchSearchResults(query);
  };

  return (
    <div className="main-layout">
      {/* Theme toggle button */}
      <button
        className="theme-bulb-toggle"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? (
          // Bulb on (filled)
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFD600" stroke="#FFD600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="6" fill="#FFD600" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          // Bulb off (outline)
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="6" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        )}
      </button>

      <div className="rates-bar-wrapper">
        <RatesSidebar />
      </div>

      <div className="container">
        <h1>UTPAD SAMACHAR</h1>

        <Weather />

        <div className="controls">
          <input
            type="text"
            placeholder="Search news globally or Indian topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {loading && <p>Loading news...</p>}
        {error && <p className="error">{error}</p>}

        <div className="news-list">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <NewsCard key={article.url || index} article={article} />
            ))
          ) : (
            !loading && !error && <p>No articles found.</p>
          )}
        </div>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} UTPAD SAMACHAR. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
