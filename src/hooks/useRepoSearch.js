import { useState, useCallback, useEffect, useRef } from 'react';

export const useRepoSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialSearch, setIsInitialSearch] = useState(true);
  const abortControllerRef = useRef(null);

  const executeSearch = useCallback(async (query) => {
    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (!query.trim()) {
      setError("Введите поисковый запрос");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSearchResults([]);
    setIsInitialSearch(false);
    
    // Создаем новый контроллер
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=30`,
        { signal: controller.signal }
      );
      
      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
      const data = await res.json();
      setSearchResults(data.items || []);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Ошибка поиска", error);
        setError(error.message || "Ошибка поиска");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSearch = useCallback(() => {
    executeSearch(searchQuery);
  }, [searchQuery, executeSearch]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    error,
    isInitialSearch,
    handleSearch,
    setSearchResults
  };
};