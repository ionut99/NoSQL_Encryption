import React, { useState } from 'react';
//
import axios from 'axios'
//
import './styles.css';

function Search() {
  const [query, setQuery] = useState('');
  //
  const [results, setResults] = useState([]);
  //

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  //
  const handleSearch = async (query) => {
    try {
      // Update to use a GET request and pass `query` as a query parameter
      const response = await axios.get('http://localhost:3001/booksearch', {
        params: { query }
      });

      setResults(response.data); // Assuming the API returns an array of results
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]); // Reset results on error
    }
  };

  //
  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-60">
            <form onSubmit={handleSubmit}>
            <input
                className='searchBox'
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search..."
            />
            <button type="submit" className="btn btn-success ">Search</button>
            </form>
        <div className='resultBox'>
            {results.length > 0 ? (
                <ul>
                    {results.map((result, index) => (
                        <li key={index}>
                            <h3>{result.title}</h3>
                            <p>Author: {result.author}</p>
                            <p>Year: {result.year}</p>
                        </li>
                    ))}
                </ul>
            ) : (
            <p>No results found.</p>
            )}
      </div>
        </div>
    </div>
  );
}

export default Search;