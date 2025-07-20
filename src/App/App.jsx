import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import AppContext from "../context/AppContext";
import { useDnD } from "../hooks/useDnD";
import SearchBar from "../components/searchBar/SearchBar";
import RepoList from "../components/repoList/RepoList";
import FavoriteList from "../components/favoriteList/FavoriteList";
import RepoModal from "../components/repoModal/RepoModal";
import { useRepoSearch } from "../hooks/useRepoSearch";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { FaQuestionCircle } from "react-icons/fa";
import { HelpModal } from "../components/helpModal/HelpModal";
import "./App.css";

function App() {
  // Состояния с сохранением в localStorage
  const [favorites, setFavorites] = useLocalStorage("github-favorites", []);
  const [filterText, setFilterText] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Закрытие по ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowHelp(false);
        if (modalOpen) {
          setModalOpen(false);
          setSelectedRepo(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  // Логика поиска через кастомный хук
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    error,
    isInitialSearch,
    handleSearch,
  } = useRepoSearch();

  // Логика модального окна
  const modalActions = useMemo(() => ({
    open: (repo) => {
      if (!repo) return;
      setSelectedRepo(repo);
      setModalOpen(true);
    },
    close: () => {
      setModalOpen(false);
      setSelectedRepo(null);
    },
  }), []);

  // Логика DnD через кастомный хук
  const { onDragEnd } = useDnD({
    favorites,
    setFavorites,
    searchResults,
    setSearchResults: () => {},
  });

  // Мемоизированные значения
  const filteredSearchResults = useMemo(() => {
    if (!filterText) return searchResults;
    const query = filterText.toLowerCase();
    return searchResults.filter(r => 
      r.name.toLowerCase().includes(query)
    );
  }, [searchResults, filterText]);

  const contextValue = useMemo(() => ({
    favorites,
    setFavorites,
    selectedRepo,
    modalOpen,
    ...modalActions,
  }), [favorites, setFavorites, selectedRepo, modalOpen, modalActions]);

  return (
    <AppContext.Provider value={contextValue}>
      <div className="app-container">
        <div 
          className="help-icon" 
          onClick={() => setShowHelp(true)}
          aria-label="Открыть справку"
          role="button"
        >
          <FaQuestionCircle size={24} />
        </div>
        <header>GitHub Репозитории</header>
        <DragDropContext onDragEnd={onDragEnd}>
          <main className="main-content">
            <section className="search-section">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
              />
              <RepoList
                repos={filteredSearchResults}
                filterText={filterText}
                setFilterText={setFilterText}
                onRepoClick={modalActions.open}
                droppableId="searchResults"
                isLoading={loading}
                error={error}
                isInitialState={isInitialSearch}
                emptyMessage="Репозитории не найдены"
              />
            </section>
            <section className="favorites-section">
              <h2>Избранное ({favorites.length})</h2>
              <FavoriteList
                repos={favorites}
                onRepoClick={modalActions.open}
                droppableId="favorites"
              />
            </section>
          </main>
        </DragDropContext>

        <RepoModal
          isOpen={modalOpen}
          onRequestClose={modalActions.close}
          repo={selectedRepo}
        />
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      </div>
    </AppContext.Provider>
  );
}

export default App;