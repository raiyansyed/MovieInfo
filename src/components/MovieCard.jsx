import { useFavContext } from "../context/FavContext";
import { useLocation, useNavigate } from "react-router-dom";

function MovieCard({ movie, currentPage = null, totalCount = null }) {
  const { addTofavs, removeFromfavs, isFav } = useFavContext();
  const navigate = useNavigate();
  const location = useLocation();

  const release = movie.release_date;
  const posterPath = movie.poster_path || movie.backdrop_path;
  if (!posterPath) return null;
  const image = `https://image.tmdb.org/t/p/w500/${posterPath}`;
  const fav = isFav(movie.id);
  const voteAverage = Number(movie.vote_average);
  const score = Number.isFinite(voteAverage) ? voteAverage.toFixed(1) : null;
  const year = release ? new Date(movie.release_date).getFullYear() : "N/A";

  const handleCardClick = () => {
    const scrollPosition = window.scrollY;
    const state = {
      from: location.pathname + location.search,
      scrollPosition,
    };
    if (currentPage != null) state.page = currentPage;
    if (totalCount != null) state.totalCount = totalCount;
    navigate(`/movie/${movie.id}`, { state });
  };

  return (
    <article
      onClick={handleCardClick}
      className="group border border-(--border) rounded-xl overflow-hidden bg-(--card) hover:border-(--text) transition cursor-pointer"
    >
      <div className="relative">
        <img
          className="block w-full h-auto object-cover"
          src={image}
          alt={movie?.title || movie?.original_title || "Movie"}
        />
        {score && (
          <span className="absolute top-3 left-3 text-xs font-semibold bg-(--card) text-(--text) rounded-full px-2 py-1 border border-(--border)">
            {score}
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (fav) removeFromfavs(movie.id);
            else addTofavs(movie);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full border border-(--border) bg-(--card) text-sm transition ${
            fav ? "text-rose-500 border-rose-400" : "text-(--text)"
          }`}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          {fav ? "♥" : "+"}
        </button>
      </div>

      <div className="p-3 space-y-2">
        <p className="text-xs text-muted">{year}</p>
        <h3 className="text-sm font-semibold text-(--text) line-clamp-2">
          {movie.title || movie.original_title}
        </h3>
        {movie.overview && (
          <p className="text-xs text-muted line-clamp-2">{movie.overview}</p>
        )}
      </div>
    </article>
  );
}

export default MovieCard;
