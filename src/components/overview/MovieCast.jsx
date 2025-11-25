import React from "react";

function MovieCast({ movieCast }) {
  return (
    <>
      {movieCast.slice(0, 8).map((actor) => (
        <div
          className="surface-card border border-(--border) rounded-xl p-3 text-center"
          key={actor.id}
        >
          {actor.profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`}
              alt={actor.name}
              className="w-full rounded-lg mb-3 object-cover"
            />
          ) : (
            <div className="w-full aspect-2/3 border border-dashed border-(--border) rounded-lg mb-3 flex justify-center items-center text-3xl text-muted">
              👤
            </div>
          )}
          <p className="font-semibold text-sm text-(--text)">{actor.name}</p>
          <p className="text-xs text-muted">{actor.character || "—"}</p>
        </div>
      ))}
    </>
  );
}

export default MovieCast;
