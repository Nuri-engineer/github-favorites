import React from 'react';
import './SearchBar.css';

const SearchBar = React.memo(function SearchBar({ searchQuery, setSearchQuery, onSearch }) {
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      const input = document.querySelector('.search-bar__input');
      if (input) {
        input.classList.add('search-bar__input--error');
        setTimeout(() => input.classList.remove('search-bar__input--error'), 2000);
      }
      return;
    }
    onSearch();
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchQuery}
        placeholder="Введите запрос"
        onChange={e => setSearchQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        className="search-bar__input"
      />
      <button
        onClick={handleSearch}
        className="search-bar__button"
      >
        Найти
      </button>
    </div>
  );
});

export default SearchBar;