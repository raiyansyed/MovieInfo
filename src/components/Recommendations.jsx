import React, { useState } from "react";
import { MovieCard } from "./index.js";
import { languages, tmdbGenres, typeOfMovie } from "./data.js"
import { fetchByIds, fetchByCollectionIds } from "../service/api.js";
import { aiRecommendations } from "../service/aiRecomendations.js";
import {useLocation} from 'react-router-dom'

function Recommendations() {
  const moodLimit = 3,
    genreLimit = 5,
    languagesLimit = 3;

  const [genreSelected, setGenreSelected] = useState([]);
  const [movieTypeSelected, setMovieTypeSelected] = useState([]);
  const [languagesSelected, setLanguagesSelected] = useState([]);
  const [description, setDescription] = useState("");
  const descriptionLimit = 300;

  const [selection, setSelection] = useState(true);

  const [individualMovies, setIndividualMovies] = useState([]);
  const [collectionMovies, setCollectionMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const Result_key = 'ai_results';

  React.useEffect(() => {
    if(location.state?.recommendationsSelection === false) {
      setSelection(false)
    }
    const saved = sessionStorage.getItem(Result_key)
    if(saved) {
      try {
        const parsed = JSON.parse(saved);
        if(parsed.individual?.length || parsed.collections?.length) {
          setIndividualMovies(parsed.individual || []);
          setCollectionMovies(parsed.collections || [])
          setSelection(false);
        }
      }
      catch{}
    }
  }, [location.state])


  function toggleGenre(id) {
    setGenreSelected((prev) =>
      prev.includes(id)
        ? prev.filter((g) => g !== id)
        : prev.length < genreLimit
        ? [...prev, id]
        : prev
    );
  }

  function toggleLanguages(lang) {
    setLanguagesSelected((prev) =>
      prev.includes(lang)
        ? prev.filter((lan) => lan !== lang)
        : prev.length < languagesLimit
        ? [...prev, lang]
        : prev
    );
  }

  function toggleMovieTypes(type) {
    setMovieTypeSelected((prev) =>
      prev.includes(type)
        ? prev.filter((mt) => mt !== type)
        : prev.length < moodLimit
        ? [...prev, type]
        : prev
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSelection(false);
    setLoading(true);
    setError(null);
    try {
      const data = await aiRecommendations({
        typeOfMovie: movieTypeSelected.join(", "),
        description,
        language: languagesSelected.join(", "),
        genres: genreSelected.join(", "),
        count: 8,
        excludeIds: [],
        minRating: 7.0,
        yearRange: "Any",
      });
      console.log(data);
      if (Array.isArray(data)) {
        const movieIds = data
          .filter(item => item.type?.toLowerCase() === "movie")
          .map(item => item.id)
          .filter(Boolean);

        const collectionIds = data
          .filter(item => item.type?.toLowerCase() === "collection")
          .map(item => item.id)
          .filter(Boolean);

        let moviesFetched = []
        let collectionsFetched = []

        if(movieIds.length) {
          moviesFetched = await fetchByIds(movieIds);
          setIndividualMovies(moviesFetched || []);
        }
        
        if(collectionIds.length) {
          collectionsFetched = await fetchByCollectionIds(collectionIds);
          setCollectionMovies(collectionsFetched || []);
        }

        sessionStorage.setItem(
          Result_key, 
          JSON.stringify({
            individual: moviesFetched, 
            collections: collectionsFetched,
          })
        )
      }
      else {
        throw new Error("AI response not an array")
      }
    } catch (err) {
      setError(err);
      console.error("Ai Error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    setSelection(true);
    setIndividualMovies([]);
    setCollectionMovies([]);
    sessionStorage.removeItem(
      Result_key
    )
  }

  return !selection ? (
    <div>
      {loading && <p className="flex items-center justify-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error.message || String(error)}</p>}
      {!loading && !error && (
        <div className="">
          <button
          onClick={handleBackClick}
          className="mb-6 px-4 py-2 rounded-lg transition bg-[#403963] hover:bg-[#524a7a] hover:cursor-pointer"
        >
          ← Back
        </button>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
            {[
              ...individualMovies,
              ...collectionMovies.flatMap(c => Array.isArray(c.parts) ? c.parts : [])
            ].map((m, i) => (
              <MovieCard key={m.id || i} movie={m} />
            ))
            }
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-around min-h-[80vh] w-[80vw]"
    >
        {/* Types of Movies */}
      {/* <div>
        <h3 className="font-semibold p-3 text-center text-2xl pb-5 shadow-2xl text-shadow-amber-50">
          Types Of Movies : Upto {moodLimit}
        </h3>
        <div className="grid gap-1 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-y-1 gap-x-3">
          {typeOfMovie.map((type, i) => (
            <label key={i} className="cursor-pointer text-lg">
              <input
                type="checkbox"
                value={type}
                checked={movieTypeSelected.includes(type)}
                onChange={() => toggleMovieTypes(type)}
                className="mr-6"
              />
              {type}
            </label>
          ))}
        </div>
      </div> */}
        {/* Languages */}
      {/* <div>
        <h3 className="font-semibold p-3 text-center text-2xl pb-5 shadow-2xl text-shadow-amber-50">
          Languages
        </h3>
        <div className="grid gap-1 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-y-1 gap-x-3">
          {languages.map((lang, i) => (
            <label key={lang} className="cursor-pointer text-lg">
              <input
                type="checkbox"
                value={lang}
                checked={languagesSelected.includes(lang)}
                onChange={() => toggleLanguages(lang)}
                className="mr-6"
              />
              {lang}
            </label>
          ))}
        </div>
      </div> */}
      <div>
        {/* Genres */}
        <h3 className="font-semibold p-3 text-center text-2xl">
          Genres : Upto {genreLimit}
        </h3>
        <div className="grid gap-1 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-y-1 gap-x-3">
          {tmdbGenres.map((g) => (
            <label key={g.value} className="cursor-pointer text-lg">
              <input
                type="checkbox"
                value={g.value}
                checked={genreSelected.includes(g.value)}
                onChange={() => toggleGenre(g.value)}
                className="mr-6"
              />
              {g.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        {/* Description Box */}
        <h3 className="font-semibold text-2xl text-center p-3">
          Description (If any)
        </h3>
        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value.slice(0, descriptionLimit))
          }
          disabled={
            !genreSelected.length && !!movieTypeSelected.length && !description
          }
          className="border border-white rounded-lg w-full p-2 text-sm resize-vertical min-h-50 outline-none"
          placeholder="Description The Movie You want to watch"
        ></textarea>
      </div>
      <div className="text-center mt-4">
        {/* Button */}
        <button
        type="submit"
          className="border-none px-10 py-5 rounded-full bg-gray-700 hover:cursor-pointer hover:bg-gray-500"
        >
          Search
        </button>
      </div>
    </form>
    </div>
  );
}

export default Recommendations;
