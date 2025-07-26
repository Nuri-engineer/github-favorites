import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import "./FavoriteList.css";

const FavoriteList = React.memo(function FavoriteList({
  repos,
  onRepoClick,
  droppableId,
}) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="favorite-list"
        >
          {repos.length === 0 && (
            <div className="repo-list__status">
              Перетащите сюда нужный репозиторий
            </div>
          )}

          {repos.map((repo, index) => (
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
                  className="favorite-list__item"
                  style={provided.draggableProps.style}
                >
                  <strong>{repo.name}</strong>
                  <span>⭐ {repo.stargazers_count}</span>
                  <div className="favorite-list__item-desc">
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
  );
});

export default FavoriteList;
