import React, { useState, useEffect } from 'react';
import '../css/Quote.css';

const Quote = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('http://api.quotable.io/random');
        const data = await response.json();
        setQuote(data);
      } catch (error) {
        console.error('Error fetching quote:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (loading) return <div className="quote-container">Loading quote...</div>;
  if (!quote) return null;

  return (
    <div className="quote-container">
      <p className="quote-content">"{quote.content}"</p>
      <p className="quote-author">- {quote.author}</p>
    </div>
  );
};

export default Quote;