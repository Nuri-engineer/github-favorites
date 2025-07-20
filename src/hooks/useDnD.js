import { useCallback } from 'react';

export const useDnD = ({ favorites, setFavorites, searchResults, setSearchResults }) => {
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (source, destination, sourceIdx, destIdx) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [moved] = sourceClone.splice(sourceIdx, 1);
    destClone.splice(destIdx, 0, moved);
    return [sourceClone, destClone];
  };

  const onDragEnd = useCallback(({ source, destination }) => {
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "favorites") {
        setFavorites(prev => reorder(prev, source.index, destination.index));
      } else {
        setSearchResults(prev => reorder(prev, source.index, destination.index));
      }
    } else {
      if (source.droppableId === "searchResults") {
        const [newSearch, newFavs] = move(
          searchResults,
          favorites,
          source.index,
          destination.index
        );
        setSearchResults(newSearch);
        setFavorites(newFavs);
      } else {
        const [newFavs, newSearch] = move(
          favorites,
          searchResults,
          source.index,
          destination.index
        );
        setFavorites(newFavs);
        setSearchResults(newSearch);
      }
    }
  }, [favorites, searchResults, setFavorites, setSearchResults]);

  return { onDragEnd };
};