import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { getPopularMovies, searchMovies } from "../service/api";
import { MovieCard } from "../components/index.js";

function Home() {
  const [searchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();
  const location = useLocation();
  const hasRestoredScroll = useRef(false);

  const query = searchParams.get("search") || "";

  const fetchPage = async (p) => {
    if (query) return searchMovies(query, p);
    return getPopularMovies(p);
  };

  function dedeupById(arr) {
    const seen = new Set();
    const output = [];
    for (const movie of arr) {
      if (!movie || seen.has(movie.id)) continue;
      seen.add(movie.id);
      output.push(movie);
    }
    return output;
  }

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      setLoading(true);
      setError(null);
      hasRestoredScroll.current = false;

      try {
        const targetPage = Math.max(1, Number(location.state?.page) || 1);
        const first = await fetchPage(1);
        if (cancelled) return;

        let all = [...first];

        if (targetPage > 1) {
          const pagePromises = [];
          for (let p = 2; p <= targetPage; p++) pagePromises.push(fetchPage(p));
          const rest = await Promise.all(pagePromises);
          if (cancelled) return;
          all = rest.reduce((acc, arr) => acc.concat(arr || []), all);
        }

        setMovies(dedeupById(all));
        setPage(targetPage);
        setHasMore((all?.length || 0) >= targetPage * 20);
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setError("Failed to load movies...");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init();
    return () => {
      cancelled = true;
    };
  }, [query, location.state?.page]);

  useEffect(() => {
    if (
      !loading &&
      !hasRestoredScroll.current &&
      location.state?.scrollPosition !== undefined &&
      movies.length > 0
    ) {
      setTimeout(() => {
        window.scrollTo(0, Number(location.state.scrollPosition) || 0);
        hasRestoredScroll.current = true;
      }, 100);
    }
  }, [loading, movies.length, location.state?.scrollPosition]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const res = await fetchPage(next);
      if (!res || res.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prev) => dedeupById([...prev, ...res]));
        setPage(next);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load more movies...");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, query]);

  const lastRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, loadMore]
  );

  return (
    <div className="space-y-10 mt-16">
      <section className="surface-card border border-(--border) rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          <div className="space-y-4 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Daily picks
            </p>
            <h1 className="text-3xl font-semibold leading-tight">
              Discover what the world is watching now.
            </h1>
            <p className="text-muted text-sm sm:text-base">
              Browse the live popularity feed or filter with the search bar in
              the header. Use recommendations for AI generated suggestions, or
              save titles into your favorites list.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                to="/recommendations"
                className="inline-flex items-center gap-2 border border-(--text) text-(--text) px-4 py-2 rounded-full"
              >
                Open recommendations
              </Link>
              <Link
                to="/favorites"
                className="inline-flex items-center gap-2 border border-(--border) text-muted px-4 py-2 rounded-full"
              >
                View favorites
              </Link>
            </div>
          </div>
          <div className="flex gap-8 text-sm text-muted">
            <div>
              <p className="text-xs uppercase tracking-[0.3em]">Movies</p>
              <p className="text-3xl font-semibold text-(--text)">
                {movies.length || "–"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em]">Page</p>
              <p className="text-3xl font-semibold text-(--text)">{page}</p>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <div className="flex justify-center py-10 text-muted">Loading…</div>
      )}
      {error && (
        <p className="text-center text-rose-500 border border-rose-200 bg-rose-50 rounded-2xl py-4">
          {error}
        </p>
      )}
      {!loading && !error && (
        <>
          {(() => {
            const visible = movies.filter(
              (m) => m && (m.poster_path || m.backdrop_path)
            );
            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {visible.map((m, i) => {
                  const isLast = i === movies.length - 1;
                  return (
                    <div key={m.id || i} ref={isLast ? lastRef : undefined}>
                      <MovieCard
                        movie={m}
                        currentPage={page}
                        totalCount={movies.length}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })()}
          {loadingMore && (
            <p className="text-center mt-6 text-muted">Loading more…</p>
          )}
          {!hasMore && movies.length > 0 && (
            <p className="text-center mt-6 text-muted">
              That’s everything for now.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
