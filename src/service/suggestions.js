async function getWordSuggestions(input) {
  if (!input) return [];

  const response = await fetch(`https://api.datamuse.com/sug?s=${input}`);
  const data = await response.json();

  return data.map(item => item.word);
}

export default getWordSuggestions;