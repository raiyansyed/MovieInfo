const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const cache = new Map();
let controller;

async function getWordSuggestions(input, limit = 8, language = "en-US") {
  const query = (input || "").trim();
  if (query.length < 3) return [];

  const cacheKey = `${language}:${query.toLowerCase()}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey).slice(0, limit);

  if (controller) controller.abort();
  controller = new AbortController();

  try {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&language=${encodeURIComponent(language)}&page=1`;

    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return [];

    const data = await response.json();

    const titles = (data.results || [])
      .map((m) => m.title || m.original_title)
      .filter(Boolean);

    const seen = new Set();
    const unique = titles.filter((t) =>
      seen.has(t) ? false : (seen.add(t), true)
    );

    cache.set(cacheKey, unique);
    return unique.slice(0, limit);
  } catch (e) {
    return [];
  }
}

export default getWordSuggestions;
