import { useState, useCallback, useEffect, useRef, useMemo } from "react";

export const useRepoSearch = (favorites = []) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialSearch, setIsInitialSearch] = useState(true);
  const abortControllerRef = useRef(null);

  const executeSearch = useCallback(async (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query.trim()) {
      setError("Введите поисковый запрос");
      setSearchResults([]);
      setIsInitialSearch(true);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResults([]);
    setIsInitialSearch(false);

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
      if (error.name !== "AbortError") {
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

  const filteredSearchResults = useMemo(() => {
    const favoriteIds = new Set(favorites.map((repo) => repo.id));
    return searchResults.filter((repo) => !favoriteIds.has(repo.id));
  }, [searchResults, favorites]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    filteredSearchResults,
    loading,
    error,
    isInitialSearch,
    handleSearch,
    setSearchResults,
  };
};
