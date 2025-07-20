import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import "./RepoList.css";

const RepoList = React.memo(function RepoList({
  repos,
  filterText,
  setFilterText,
  onRepoClick,
  droppableId,
  isLoading,
  error,
  emptyMessage = "Ничего не найдено",
  isInitialState,
}) {
  const filteredRepos = filterText
    ? repos.filter((r) =>
        r.name.toLowerCase().includes(filterText.toLowerCase())
      )
    : repos;

  return (
    <div className="repo-list">
      {setFilterText && (
        <input
          type="text"
          placeholder="Фильтр по названию"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="repo-list__filter"
          aria-label="Фильтр репозиториев"
        />
      )}

      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="repo-list__droppable"
            aria-live="polite"
          >
            {isLoading && <div className="repo-list__status">Загрузка...</div>}

            {error && (
              <div
                className="repo-list__status repo-list__status_error"
                role="alert"
              >
                {error}
              </div>
            )}

            {!isLoading &&
              !error &&
              isInitialState && (
                <div className="repo-list__status">
                  Введите запрос для поиска репозиториев
                </div>
              )}

            {!isLoading &&
              !error &&
              !isInitialState &&
              filteredRepos.length === 0 && (
                <div className="repo-list__status">{emptyMessage}</div>
              )}

            {!isLoading &&
              !error &&
              filteredRepos.map((repo, index) => (
                <Draggable
                  key={repo.id}
                  draggableId={repo.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => onRepoClick(repo)}
                      className="repo-list__item"
                      style={provided.draggableProps.style}
                    >
                      <strong>{repo.name}</strong>
                      <span>⭐ {repo.stargazers_count}</span>
                      <div className="repo-list__item-desc">
                        {repo.description}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
});

export default RepoList;
