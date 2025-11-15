import { createContext, useContext, useEffect, useState } from "react";

const FavContext = createContext();

export const useFavContext = () => useContext(FavContext);

export const FavProvider = ({ children }) => {
  const [favList, setFavList] = useState(() => {
    try {
      const favs = localStorage.getItem("favMovies");
      return favs ? JSON.parse(favs) : [];
    } catch (error) {
      console.error("Faild to parse localStorage...");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favMovies", JSON.stringify(favList));
  }, [favList]);

  const addTofavs = (movie) => {
    if (!favList.some((fav) => fav.id === movie.id)) {
      setFavList((prev) => [...prev, movie]);
    }
  };

  const removeFromfavs = (movieId) => {
    setFavList((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const isFav = (movieId) => {
    return favList.some((movie) => movie.id === movieId);
  };

  return (
    <FavContext.Provider value={{ favList, addTofavs, removeFromfavs, isFav }}>
      {children}
    </FavContext.Provider>
  );
};
