import { useCallback } from "react";

const removeAtIndex = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
];

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const useDnD = ({
  favorites,
  setFavorites,
  searchResults,
  setSearchResults,
  filteredSearchResults,
}) => {
  const onDragEnd = useCallback(
    ({ source, destination }) => {
      if (!source || !destination) return;

      const { droppableId: sourceId, index: sourceIndex } = source;
      const { droppableId: destId, index: destIndex } = destination;

      if (sourceId === destId) {
        if (sourceId === "favorites") {
          setFavorites((prev) => reorder(prev, sourceIndex, destIndex));
        } else if (sourceId === "searchResults") {
          setSearchResults((prev) => reorder(prev, sourceIndex, destIndex));
        }
        return;
      }

      if (sourceId === "searchResults" && destId === "favorites") {
        if (sourceIndex < 0 || sourceIndex >= filteredSearchResults.length)
          return;
        const moved = filteredSearchResults[sourceIndex];
        if (!moved) return;

        const newSearchResults = searchResults.filter(
          (item) => item.id !== moved.id
        );
        const newFavorites = [
          ...favorites.slice(0, destIndex),
          moved,
          ...favorites.slice(destIndex),
        ];

        setSearchResults(newSearchResults);
        setFavorites(newFavorites);
        return;
      }

      if (sourceId === "favorites" && destId === "searchResults") {
        if (sourceIndex < 0 || sourceIndex >= favorites.length) return;

        const moved = favorites[sourceIndex];
        if (!moved) return;

        const existsInSearch = searchResults.some(
          (item) => item.id === moved.id
        );

        const newFavorites = removeAtIndex(favorites, sourceIndex);

        if (existsInSearch) {
          setFavorites(newFavorites);
        } else {
          const newSearchResults = [
            ...searchResults.slice(0, destIndex),
            moved,
            ...searchResults.slice(destIndex),
          ];
          setFavorites(newFavorites);
          setSearchResults(newSearchResults);
        }
        return;
      }
    },
    [
      favorites,
      filteredSearchResults,
      searchResults,
      setFavorites,
      setSearchResults,
    ]
  );

  return { onDragEnd };
};
