import React, { useMemo } from "react";
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
import "./index.css";
import { useHelpModal } from "../hooks/useHelpModal";
import { useModal } from "../hooks/useModal";

function App() {
  const [favorites, setFavorites] = useLocalStorage("github-favorites", []);

  const {
    isOpen: modalOpen,
    selectedItem: selectedRepo,
    open: openModal,
    close: closeModal,
  } = useModal();
  const { showHelp, open: openHelp, close: closeHelp } = useHelpModal();

  // Логика поиска через кастомный хук
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    filteredSearchResults,
    loading,
    error,
    isInitialSearch,
    handleSearch,
    setSearchResults,
  } = useRepoSearch(favorites);

  // Логика DnD через кастомный хук
  const { onDragEnd } = useDnD({
    favorites,
    setFavorites,
    searchResults,
    filteredSearchResults,
    setSearchResults,
  });

  // Контекст приложения
  const contextValue = useMemo(
    () => ({
      favorites,
      setFavorites,
      selectedRepo,
      modalOpen,
      openModal,
      closeModal,
    }),
    [favorites, setFavorites, selectedRepo, modalOpen, openModal, closeModal]
  );

  return (
    <AppContext.Provider value={contextValue}>
      <div className="app-container">
        <header>GitHub репозитории </header>

        <div
          className="help-icon"
          onClick={openHelp}
          aria-label="Открыть справку"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openHelp();
          }}
        >
          <FaQuestionCircle size={24} />
        </div>

        <main className="main-content">
          <div className="search-bar-container">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="lists-container">
              <div className="repo-list-wrapper">
                <h2>Искомые репозитории ({filteredSearchResults.length})</h2>
                <RepoList
                  repos={filteredSearchResults}
                  onRepoClick={openModal}
                  droppableId="searchResults"
                  isLoading={loading}
                  error={error}
                  isInitialState={isInitialSearch}
                  emptyMessage="Репозитории не найдены"
                />
              </div>

              <div className="favorite-list-wrapper">
                <h2>Избранные репозитории ({favorites.length})</h2>
                <FavoriteList
                  repos={favorites}
                  onRepoClick={openModal}
                  droppableId="favorites"
                />
              </div>
            </div>
          </DragDropContext>
        </main>

        <RepoModal
          isOpen={modalOpen}
          onRequestClose={closeModal}
          repo={selectedRepo}
        />
        <HelpModal isOpen={showHelp} onClose={closeHelp} />
      </div>
    </AppContext.Provider>
  );
}

export default App;
